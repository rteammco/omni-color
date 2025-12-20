import { type CaseInsensitive, clampValue } from '../utils';
import { Color } from './color';
import type { ColorHSL, ColorHSLA, ColorLCH, ColorOKLCH, ColorRGBA } from './formats';
import { linearChannelToSrgb, srgbChannelToLinear } from './utils';

export type MixType = 'ADDITIVE' | 'SUBTRACTIVE';
export type MixSpace = 'RGB' | 'LINEAR_RGB' | 'HSL' | 'LCH' | 'OKLCH';

export interface MixColorsOptions {
  space?: CaseInsensitive<MixSpace>;
  type?: CaseInsensitive<MixType>;
  /**
   * Array of non-normalized `weights` for how much each color is weighed during mixing.
   * Length of weights must match number of colors being mixed.
   * @example
   * ```ts
   * { weights: [1, 1, 2] }
   * ```
   */
  weights?: number[];
}

function getWeights(
  numColors: number,
  inputRawWeights?: number[]
): { weights: number[]; sumOfWeights: number; normalizedWeights: number[] } {
  let weights =
    inputRawWeights && inputRawWeights.length === numColors
      ? inputRawWeights
      : new Array<number>(numColors).fill(1);
  let sumOfWeights = weights.reduce((sum, w) => sum + w, 0);
  if (sumOfWeights === 0) {
    weights = new Array<number>(numColors).fill(1);
    sumOfWeights = numColors;
  }
  const normalizedWeights = weights.map((w) => w / sumOfWeights);
  return { weights, sumOfWeights, normalizedWeights };
}

function weightedGeometricMean(values: readonly number[], weights: readonly number[]): number {
  return values.reduce((product, value, i) => product * Math.pow(value, weights[i]), 1);
}

function mixNormalizedChannel(
  values: readonly number[],
  normalizedWeights: readonly number[],
  maxValue: number,
  precision?: number
): number {
  const normalizedValues = values.map((value) => clampValue(value / maxValue, 0, 1));
  const mixedNormalized = weightedGeometricMean(normalizedValues, normalizedWeights);
  const scaled = clampValue(mixedNormalized * maxValue, 0, maxValue);
  if (precision === undefined) {
    return Math.round(scaled);
  }
  return +scaled.toFixed(precision);
}

function mixAlphaChannel(colors: readonly Color[], normalizedWeights: readonly number[]): number {
  const mixedAlpha = colors.reduce((alpha, color, i) => {
    const rgba = color.toRGBA();
    return alpha + (rgba.a ?? 1) * normalizedWeights[i];
  }, 0);
  return +clampValue(mixedAlpha, 0, 1).toFixed(3);
}

function mixSubtractiveHue(
  hues: readonly number[],
  magnitudes: readonly number[],
  normalizedWeights: readonly number[]
): number {
  let x = 0;
  let y = 0;

  hues.forEach((hue, i) => {
    const normalizedMagnitude = clampValue(magnitudes[i], 0, Number.POSITIVE_INFINITY);
    const weightedMagnitude = normalizedMagnitude * normalizedWeights[i];
    const radians = (normalizeHue(hue) * Math.PI) / 180;
    x += Math.cos(radians) * weightedMagnitude;
    y += Math.sin(radians) * weightedMagnitude;
  });

  if (x === 0 && y === 0) {
    return 0;
  }

  const hue = normalizeHue((Math.atan2(y, x) * 180) / Math.PI);
  return Number.isNaN(hue) ? 0 : hue;
}

function mixColorsSubtractiveInRgb(
  colors: readonly Color[],
  normalizedWeights: readonly number[]
): Color {
  const rgbValues = colors.map((color) => color.toRGBA());
  const r = mixNormalizedChannel(
    rgbValues.map((value) => value.r),
    normalizedWeights,
    255
  );
  const g = mixNormalizedChannel(
    rgbValues.map((value) => value.g),
    normalizedWeights,
    255
  );
  const b = mixNormalizedChannel(
    rgbValues.map((value) => value.b),
    normalizedWeights,
    255
  );

  const a = mixAlphaChannel(colors, normalizedWeights);

  return new Color({ r, g, b, a });
}

function mixColorsSubtractiveInLinearRgb(
  colors: readonly Color[],
  normalizedWeights: readonly number[]
): Color {
  const linearValues = colors
    .map((color) => color.toRGBA())
    .map((value) => ({
      r: clampValue(srgbChannelToLinear(value.r, 'SRGB'), 0, 1),
      g: clampValue(srgbChannelToLinear(value.g, 'SRGB'), 0, 1),
      b: clampValue(srgbChannelToLinear(value.b, 'SRGB'), 0, 1),
    }));

  const rLinear = weightedGeometricMean(
    linearValues.map((value) => value.r),
    normalizedWeights
  );
  const gLinear = weightedGeometricMean(
    linearValues.map((value) => value.g),
    normalizedWeights
  );
  const bLinear = weightedGeometricMean(
    linearValues.map((value) => value.b),
    normalizedWeights
  );

  const r = Math.round(clampValue(linearChannelToSrgb(rLinear, 'SRGB'), 0, 255));
  const g = Math.round(clampValue(linearChannelToSrgb(gLinear, 'SRGB'), 0, 255));
  const b = Math.round(clampValue(linearChannelToSrgb(bLinear, 'SRGB'), 0, 255));
  const a = mixAlphaChannel(colors, normalizedWeights);

  return new Color({ r, g, b, a });
}

function mixColorsSubtractiveInHsl(
  colors: readonly Color[],
  normalizedWeights: readonly number[]
): Color {
  const hslValues = colors.map((color) => color.toHSL());
  const saturation = mixNormalizedChannel(
    hslValues.map((value) => value.s),
    normalizedWeights,
    100,
    3
  );
  const lightness = mixNormalizedChannel(
    hslValues.map((value) => value.l),
    normalizedWeights,
    100,
    3
  );

  const hue = mixSubtractiveHue(
    hslValues.map((value) => value.h),
    hslValues.map((value) => value.s / 100),
    normalizedWeights
  );

  const a = mixAlphaChannel(colors, normalizedWeights);

  return new Color({ h: hue, s: saturation, l: lightness, a });
}

function mixColorsSubtractiveInLch(
  colors: readonly Color[],
  normalizedWeights: readonly number[]
): Color {
  const lchValues = colors.map((color) => color.toLCH());
  const lightnessValues = lchValues.map((value) => value.l);
  const chromaValues = lchValues.map((value) => Math.max(0, value.c));
  const maxChroma = Math.max(...chromaValues);

  const lightness = mixNormalizedChannel(lightnessValues, normalizedWeights, 100, 3);

  const chroma =
    maxChroma === 0
      ? 0
      : +clampValue(
          mixNormalizedChannel(chromaValues, normalizedWeights, maxChroma, 3),
          0,
          maxChroma
        ).toFixed(3);
  const hue = mixSubtractiveHue(
    lchValues.map((value) => value.h),
    maxChroma === 0 ? chromaValues : chromaValues.map((value) => value / maxChroma),
    normalizedWeights
  );
  const a = mixAlphaChannel(colors, normalizedWeights);

  const lchResult: ColorLCH = {
    l: lightness,
    c: chroma,
    h: hue,
  };
  const rgba = new Color(lchResult).toRGBA();

  return new Color({ ...rgba, a });
}

function mixColorsSubtractiveInOklch(
  colors: readonly Color[],
  normalizedWeights: readonly number[]
): Color {
  const oklchValues = colors.map((color) => color.toOKLCH());
  const lightnessValues = oklchValues.map((value) => value.l);
  const chromaValues = oklchValues.map((value) => Math.max(0, value.c));
  const maxChroma = Math.max(...chromaValues);

  const lightness = mixNormalizedChannel(lightnessValues, normalizedWeights, 1, 6);
  const chroma =
    maxChroma === 0
      ? 0
      : +clampValue(
          mixNormalizedChannel(chromaValues, normalizedWeights, maxChroma, 6),
          0,
          maxChroma
        ).toFixed(6);
  const hue = mixSubtractiveHue(
    oklchValues.map((value) => value.h),
    maxChroma === 0 ? chromaValues : chromaValues.map((value) => value / maxChroma),
    normalizedWeights
  );
  const a = mixAlphaChannel(colors, normalizedWeights);

  const oklchResult: ColorOKLCH = {
    l: lightness,
    c: chroma,
    h: hue,
  };
  const rgba = new Color(oklchResult).toRGBA();

  return new Color({ ...rgba, a });
}

function mixColorsSubtractive(
  colors: readonly Color[],
  space: MixSpace,
  normalizedWeights: readonly number[]
): Color {
  switch (space) {
    case 'RGB':
      return mixColorsSubtractiveInRgb(colors, normalizedWeights);
    case 'HSL':
      return mixColorsSubtractiveInHsl(colors, normalizedWeights);
    case 'LCH':
      return mixColorsSubtractiveInLch(colors, normalizedWeights);
    case 'OKLCH':
      return mixColorsSubtractiveInOklch(colors, normalizedWeights);
    case 'LINEAR_RGB':
    default:
      return mixColorsSubtractiveInLinearRgb(colors, normalizedWeights);
  }
}

function normalizeHue(hue: number): number {
  const result = hue % 360;
  return result < 0 ? result + 360 : result;
}

function mixColorsAdditiveInLinearRgb(
  colors: readonly Color[],
  weights: readonly number[],
  sumOfWeights: number
): Color {
  const normalizationFactor = sumOfWeights || 1;
  let rLinear = 0;
  let gLinear = 0;
  let bLinear = 0;
  let alpha = 0;

  colors.forEach((color, i) => {
    const val: ColorRGBA = color.toRGBA();
    const normalizedWeight = weights[i] / normalizationFactor;

    rLinear += srgbChannelToLinear(val.r, 'SRGB') * normalizedWeight;
    gLinear += srgbChannelToLinear(val.g, 'SRGB') * normalizedWeight;
    bLinear += srgbChannelToLinear(val.b, 'SRGB') * normalizedWeight;
    alpha += (val.a ?? 1) * weights[i];
  });

  const result: ColorRGBA = {
    r: Math.round(clampValue(linearChannelToSrgb(rLinear, 'SRGB'), 0, 255)),
    g: Math.round(clampValue(linearChannelToSrgb(gLinear, 'SRGB'), 0, 255)),
    b: Math.round(clampValue(linearChannelToSrgb(bLinear, 'SRGB'), 0, 255)),
    a: +clampValue(alpha / normalizationFactor, 0, 1).toFixed(3),
  };

  return new Color(result);
}

function mixColorsAdditiveInHsl(
  colors: readonly Color[],
  weights: readonly number[],
  sumOfWeights: number
): Color {
  const normalizationFactor = sumOfWeights || 1;
  let x = 0;
  let y = 0;
  let saturation = 0;
  let lightness = 0;
  let alpha = 0;

  colors.forEach((color, i) => {
    const val: ColorHSL = color.toHSL();
    const normalizedWeight = weights[i] / normalizationFactor;
    const hueRadians = (val.h * Math.PI) / 180;
    const weightedSaturation = val.s * normalizedWeight;
    x += Math.cos(hueRadians) * weightedSaturation;
    y += Math.sin(hueRadians) * weightedSaturation;
    saturation += val.s * normalizedWeight;
    lightness += val.l * normalizedWeight;
    alpha += (color.toRGBA().a ?? 1) * normalizedWeight;
  });

  const hue = normalizeHue((Math.atan2(y, x) * 180) / Math.PI);
  const result: ColorHSLA = {
    h: Number.isNaN(hue) ? 0 : hue,
    s: +clampValue(saturation, 0, 100).toFixed(3),
    l: +clampValue(lightness, 0, 100).toFixed(3),
    a: +clampValue(alpha, 0, 1).toFixed(3),
  };
  return new Color(result);
}

function mixColorsAdditiveInLch(
  colors: readonly Color[],
  weights: readonly number[],
  sumOfWeights: number
): Color {
  const normalizationFactor = sumOfWeights || 1;
  let lightness = 0;
  let chromaX = 0;
  let chromaY = 0;
  let alpha = 0;

  colors.forEach((color, i) => {
    const val: ColorLCH = color.toLCH();
    const normalizedWeight = weights[i] / normalizationFactor;
    const hueRadians = (val.h * Math.PI) / 180;
    const weightedChroma = val.c * normalizedWeight;

    lightness += val.l * normalizedWeight;
    chromaX += Math.cos(hueRadians) * weightedChroma;
    chromaY += Math.sin(hueRadians) * weightedChroma;
    alpha += (color.toRGBA().a ?? 1) * normalizedWeight;
  });

  const chroma = Math.sqrt(chromaX * chromaX + chromaY * chromaY);
  const hue = normalizeHue((Math.atan2(chromaY, chromaX) * 180) / Math.PI);
  const lchResult: ColorLCH = {
    l: +clampValue(lightness, 0, 100).toFixed(3),
    c: +Math.max(0, chroma).toFixed(3),
    h: Number.isNaN(hue) ? 0 : hue,
  };
  const rgba = new Color(lchResult).toRGBA();
  return new Color({
    ...rgba,
    a: +clampValue(alpha, 0, 1).toFixed(3),
  });
}

function mixColorsAdditiveInOklch(
  colors: readonly Color[],
  weights: readonly number[],
  sumOfWeights: number
): Color {
  const normalizationFactor = sumOfWeights || 1;
  let lightness = 0;
  let chromaX = 0;
  let chromaY = 0;
  let alpha = 0;

  colors.forEach((color, i) => {
    const val: ColorOKLCH = color.toOKLCH();
    const normalizedWeight = weights[i] / normalizationFactor;
    const hueRadians = (val.h * Math.PI) / 180;
    const weightedChroma = val.c * normalizedWeight;

    lightness += val.l * normalizedWeight;
    chromaX += Math.cos(hueRadians) * weightedChroma;
    chromaY += Math.sin(hueRadians) * weightedChroma;
    alpha += (color.toRGBA().a ?? 1) * normalizedWeight;
  });

  const chroma = Math.sqrt(chromaX * chromaX + chromaY * chromaY);
  const hue = normalizeHue((Math.atan2(chromaY, chromaX) * 180) / Math.PI);
  const oklchResult: ColorOKLCH = {
    l: +clampValue(lightness, 0, 1).toFixed(6),
    c: +Math.max(0, chroma).toFixed(6),
    h: Number.isNaN(hue) ? 0 : hue,
  };
  const rgba = new Color(oklchResult).toRGBA();
  return new Color({
    ...rgba,
    a: +clampValue(alpha, 0, 1).toFixed(3),
  });
}

function mixColorsAdditiveInRgb(
  colors: readonly Color[],
  weights: readonly number[],
  sumOfWeights: number
): Color {
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;
  colors.forEach((color, i) => {
    const val: ColorRGBA = color.toRGBA();
    const weight = weights[i];
    r += val.r * weight;
    g += val.g * weight;
    b += val.b * weight;
    a += (val.a ?? 1) * weight;
  });
  const result: ColorRGBA = {
    r: Math.round(clampValue(r, 0, 255)),
    g: Math.round(clampValue(g, 0, 255)),
    b: Math.round(clampValue(b, 0, 255)),
    a: +clampValue(a / sumOfWeights, 0, 1).toFixed(3),
  };
  return new Color(result);
}

function mixColorsAdditive(
  colors: readonly Color[],
  space: MixSpace,
  weights: readonly number[],
  sumOfWeights: number
) {
  switch (space) {
    case 'LINEAR_RGB':
      return mixColorsAdditiveInLinearRgb(colors, weights, sumOfWeights);
    case 'HSL':
      return mixColorsAdditiveInHsl(colors, weights, sumOfWeights);
    case 'LCH':
      return mixColorsAdditiveInLch(colors, weights, sumOfWeights);
    case 'OKLCH':
      return mixColorsAdditiveInOklch(colors, weights, sumOfWeights);
    case 'RGB':
    default:
      return mixColorsAdditiveInRgb(colors, weights, sumOfWeights);
  }
}

export function mixColors(colors: readonly Color[], options: MixColorsOptions = {}): Color {
  if (colors.length < 2) {
    throw new Error('at least two colors are required for mixing');
  }
  const type = (options.type?.toUpperCase() ?? 'ADDITIVE') as MixType;
  const space = (options.space?.toUpperCase() ?? 'LINEAR_RGB') as MixSpace;

  const { weights, sumOfWeights, normalizedWeights } = getWeights(colors.length, options.weights);

  if (type === 'SUBTRACTIVE') {
    return mixColorsSubtractive(colors, space, normalizedWeights);
  }

  return mixColorsAdditive(colors, space, weights, sumOfWeights);
}

export type BlendMode = 'NORMAL' | 'MULTIPLY' | 'SCREEN' | 'OVERLAY';
export type BlendSpace = 'RGB' | 'HSL';

export interface BlendColorsOptions {
  mode?: CaseInsensitive<BlendMode>;
  space?: CaseInsensitive<BlendSpace>;
  ratio?: number; // amount of blend color over base (0 - 1)
}

function blendNormalizedChannel(mode: BlendMode, base: number, blend: number): number {
  switch (mode) {
    case 'MULTIPLY':
      return base * blend;
    case 'SCREEN':
      return 1 - (1 - base) * (1 - blend);
    case 'OVERLAY':
      return base < 0.5 ? 2 * base * blend : 1 - 2 * (1 - base) * (1 - blend);
    case 'NORMAL':
    default:
      return blend;
  }
}

function blendChannel(mode: BlendMode, base: number, blend: number): number {
  const baseNormalized = base / 255;
  const blendNormalized = blend / 255;
  const resultNormalized = blendNormalizedChannel(mode, baseNormalized, blendNormalized);
  return resultNormalized * 255;
}

function blendValueChannel({
  mode,
  base,
  blend,
  ratio,
  maxValue,
}: {
  mode: BlendMode;
  base: number;
  blend: number;
  ratio: number;
  maxValue: number;
}): number {
  const baseNormalized = clampValue(base / maxValue, 0, 1);
  const blendNormalized = clampValue(blend / maxValue, 0, 1);
  const blendedNormalized = blendNormalizedChannel(mode, baseNormalized, blendNormalized);
  const mixedNormalized = (1 - ratio) * baseNormalized + ratio * blendedNormalized;
  return +clampValue(mixedNormalized * maxValue, 0, maxValue).toFixed(3);
}

function blendHue(mode: BlendMode, baseHue: number, blendHue: number, ratio: number): number {
  const baseRadians = (normalizeHue(baseHue) * Math.PI) / 180;
  const blendRadians = (normalizeHue(blendHue) * Math.PI) / 180;
  const baseXNormalized = (Math.cos(baseRadians) + 1) / 2;
  const baseYNormalized = (Math.sin(baseRadians) + 1) / 2;
  const blendXNormalized = (Math.cos(blendRadians) + 1) / 2;
  const blendYNormalized = (Math.sin(blendRadians) + 1) / 2;

  const blendedX = blendNormalizedChannel(mode, baseXNormalized, blendXNormalized);
  const blendedY = blendNormalizedChannel(mode, baseYNormalized, blendYNormalized);

  const mixedXNormalized = (1 - ratio) * baseXNormalized + ratio * blendedX;
  const mixedYNormalized = (1 - ratio) * baseYNormalized + ratio * blendedY;

  const mixedX = mixedXNormalized * 2 - 1;
  const mixedY = mixedYNormalized * 2 - 1;
  const hue = normalizeHue((Math.atan2(mixedY, mixedX) * 180) / Math.PI);

  return Number.isNaN(hue) ? normalizeHue(baseHue) : hue;
}

function blendAlphaChannel(baseAlpha: number, blendAlpha: number, ratio: number): number {
  const mixedAlpha = (1 - ratio) * baseAlpha + ratio * blendAlpha;
  return +clampValue(mixedAlpha, 0, 1).toFixed(3);
}

function blendColorsInRGBSpace(base: Color, blend: Color, mode: BlendMode, ratio: number): Color {
  const baseRGBA = base.toRGBA();
  const blendRGBA = blend.toRGBA();
  const r = (1 - ratio) * baseRGBA.r + ratio * blendChannel(mode, baseRGBA.r, blendRGBA.r);
  const g = (1 - ratio) * baseRGBA.g + ratio * blendChannel(mode, baseRGBA.g, blendRGBA.g);
  const b = (1 - ratio) * baseRGBA.b + ratio * blendChannel(mode, baseRGBA.b, blendRGBA.b);
  const a = (1 - ratio) * (baseRGBA.a ?? 1) + ratio * (blendRGBA.a ?? 1);
  const resultRGBA: ColorRGBA = {
    r: Math.round(clampValue(r, 0, 255)),
    g: Math.round(clampValue(g, 0, 255)),
    b: Math.round(clampValue(b, 0, 255)),
    a: +clampValue(a, 0, 1).toFixed(3),
  };
  return new Color(resultRGBA);
}

function blendColorsInHSLSpace(base: Color, blend: Color, mode: BlendMode, ratio: number): Color {
  const baseHSL = base.toHSL();
  const blendHSL = blend.toHSL();
  const baseAlpha = base.toRGBA().a ?? 1;
  const blendAlpha = blend.toRGBA().a ?? 1;

  if (mode === 'NORMAL') {
    const delta = ((blendHSL.h - baseHSL.h + 540) % 360) - 180;
    const h = (baseHSL.h + delta * ratio + 360) % 360;
    const s = (1 - ratio) * baseHSL.s + ratio * blendHSL.s;
    const l = (1 - ratio) * baseHSL.l + ratio * blendHSL.l;

    return new Color({
      h,
      s,
      l,
      a: blendAlphaChannel(baseAlpha, blendAlpha, ratio),
    });
  }

  const h = blendHue(mode, baseHSL.h, blendHSL.h, ratio);
  const s = blendValueChannel({ mode, base: baseHSL.s, blend: blendHSL.s, ratio, maxValue: 100 });
  const l = blendValueChannel({ mode, base: baseHSL.l, blend: blendHSL.l, ratio, maxValue: 100 });
  const a = blendAlphaChannel(baseAlpha, blendAlpha, ratio);

  return new Color({
    h,
    s,
    l,
    a,
  });
}

export function blendColors(base: Color, blend: Color, options: BlendColorsOptions = {}): Color {
  const mode = (options.mode?.toUpperCase() ?? 'NORMAL') as BlendMode;
  const space = (options.space?.toUpperCase() ?? 'RGB') as BlendSpace;
  const ratio = clampValue(options.ratio ?? 0.5, 0, 1);

  if (space === 'RGB') {
    return blendColorsInRGBSpace(base, blend, mode, ratio);
  }

  return blendColorsInHSLSpace(base, blend, mode, ratio);
}

export interface AverageColorsOptions {
  space?: CaseInsensitive<MixSpace>;
  /**
   * Array `weights` for how much each color is weighed during averaging.
   * Length of weights must match number of colors being averaged.
   * Weights will be normalized automatically if not already normalized.
   * @example
   * ```ts
   * { weights: [0.25, 0.25, 0.5] }
   * ```
   */
  weights?: number[];
}

const ZERO_VECTOR_EPSILON = 1e-2;

function resolveAveragedHue(x: number, y: number, fallbackHue = 0): number {
  const magnitude = Math.hypot(x, y);
  if (!Number.isFinite(magnitude) || magnitude < ZERO_VECTOR_EPSILON) {
    return fallbackHue;
  }

  const normalizedHue = normalizeHue((Math.atan2(y, x) * 180) / Math.PI);
  return Number.isNaN(normalizedHue) ? fallbackHue : normalizedHue;
}

function averageColorsInHsl(colors: readonly Color[], normalizedWeights: readonly number[]): Color {
  let x = 0;
  let y = 0;
  let lightness = 0;
  colors.forEach((color, i) => {
    const val: ColorHSLA = color.toHSLA();
    const weight = normalizedWeights[i];
    const weightedSaturation = val.s * weight;
    const rad = (val.h * Math.PI) / 180;
    x += Math.cos(rad) * weightedSaturation;
    y += Math.sin(rad) * weightedSaturation;
    lightness += val.l * weight;
  });
  const hue = resolveAveragedHue(x, y);
  const saturation = clampValue(Math.hypot(x, y), 0, 100);
  const alpha = mixAlphaChannel(colors, normalizedWeights);
  return new Color({
    h: Math.round(hue),
    s: Math.round(saturation),
    l: Math.round(lightness),
  }).setAlpha(alpha);
}

function averageColorsInLch(colors: readonly Color[], normalizedWeights: readonly number[]): Color {
  let lightness = 0;
  let chromaX = 0;
  let chromaY = 0;
  colors.forEach((color, i) => {
    const val: ColorLCH = color.toLCH();
    const weight = normalizedWeights[i];
    lightness += val.l * weight;
    const weightedChroma = val.c * weight;
    const rad = (val.h * Math.PI) / 180;
    chromaX += Math.cos(rad) * weightedChroma;
    chromaY += Math.sin(rad) * weightedChroma;
  });
  const chroma = Math.hypot(chromaX, chromaY);
  const hue = resolveAveragedHue(chromaX, chromaY);
  const alpha = mixAlphaChannel(colors, normalizedWeights);
  return new Color({
    l: lightness,
    c: chroma,
    h: hue,
  }).setAlpha(alpha);
}

function averageColorsInOklch(
  colors: readonly Color[],
  normalizedWeights: readonly number[]
): Color {
  let lightness = 0;
  let chromaX = 0;
  let chromaY = 0;
  colors.forEach((color, i) => {
    const val: ColorOKLCH = color.toOKLCH();
    const weight = normalizedWeights[i];
    lightness += val.l * weight;
    const weightedChroma = val.c * weight;
    const rad = (val.h * Math.PI) / 180;
    chromaX += Math.cos(rad) * weightedChroma;
    chromaY += Math.sin(rad) * weightedChroma;
  });
  const chroma = Math.hypot(chromaX, chromaY);
  const hue = resolveAveragedHue(chromaX, chromaY);
  const alpha = mixAlphaChannel(colors, normalizedWeights);
  return new Color({
    l: lightness,
    c: chroma,
    h: hue,
  }).setAlpha(alpha);
}

function averageColorsInLinearRgb(
  colors: readonly Color[],
  normalizedWeights: readonly number[]
): Color {
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;
  colors.forEach((color, i) => {
    const val: ColorRGBA = color.toRGBA();
    const weight = normalizedWeights[i];
    r += srgbChannelToLinear(val.r, 'SRGB') * weight;
    g += srgbChannelToLinear(val.g, 'SRGB') * weight;
    b += srgbChannelToLinear(val.b, 'SRGB') * weight;
    a += (val.a ?? 1) * weight;
  });
  return new Color({
    r: Math.round(linearChannelToSrgb(r, 'SRGB')),
    g: Math.round(linearChannelToSrgb(g, 'SRGB')),
    b: Math.round(linearChannelToSrgb(b, 'SRGB')),
    a: +a.toFixed(3),
  });
}

function averageColorsInRgb(colors: readonly Color[], normalizedWeights: readonly number[]): Color {
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;
  colors.forEach((color, i) => {
    const val: ColorRGBA = color.toRGBA();
    const weight = normalizedWeights[i];
    r += val.r * weight;
    g += val.g * weight;
    b += val.b * weight;
    a += (val.a ?? 1) * weight;
  });
  return new Color({
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
    a: +a.toFixed(3),
  });
}

export function averageColors(colors: readonly Color[], options: AverageColorsOptions = {}): Color {
  if (colors.length < 2) {
    throw new Error('at least two colors are required for averaging');
  }
  const space = (options.space?.toUpperCase() ?? 'LINEAR_RGB') as MixSpace;
  const { normalizedWeights } = getWeights(colors.length, options.weights);

  switch (space) {
    case 'HSL':
      return averageColorsInHsl(colors, normalizedWeights);
    case 'LCH':
      return averageColorsInLch(colors, normalizedWeights);
    case 'OKLCH':
      return averageColorsInOklch(colors, normalizedWeights);
    case 'LINEAR_RGB':
      return averageColorsInLinearRgb(colors, normalizedWeights);
    case 'RGB':
    default:
      return averageColorsInRgb(colors, normalizedWeights);
  }
}
