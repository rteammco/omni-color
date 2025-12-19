import { type CaseInsensitive, clampValue } from '../utils';
import { Color } from './color';
import { toCMYK } from './conversions';
import type { ColorCMYK, ColorHSL, ColorHSLA, ColorLCH, ColorOKLCH, ColorRGBA } from './formats';
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

function mixColorsSubtractive(
  colors: readonly Color[],
  normalizedWeights: readonly number[]
): Color {
  let c = 1;
  let m = 1;
  let y = 1;
  let k = 1;
  colors.forEach((color, i) => {
    const part = toCMYK(color.toRGBA());
    const weight = normalizedWeights[i];
    c *= Math.pow(1 - part.c / 100, weight);
    m *= Math.pow(1 - part.m / 100, weight);
    y *= Math.pow(1 - part.y / 100, weight);
    k *= Math.pow(1 - part.k / 100, weight);
  });
  const result: ColorCMYK = {
    c: +(100 * (1 - c)).toFixed(2),
    m: +(100 * (1 - m)).toFixed(2),
    y: +(100 * (1 - y)).toFixed(2),
    k: +(100 * (1 - k)).toFixed(2),
  };
  return new Color(result);
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
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;
  const normalizationFactor = sumOfWeights || 1;

  colors.forEach((color, i) => {
    const val: ColorRGBA = color.toRGBA();
    const normalizedWeight = weights[i] / normalizationFactor;
    r += Math.pow(val.r, 2) * normalizedWeight;
    g += Math.pow(val.g, 2) * normalizedWeight;
    b += Math.pow(val.b, 2) * normalizedWeight;
    a += (val.a ?? 1) * normalizedWeight;
  });
  const result: ColorRGBA = {
    r: Math.round(Math.sqrt(r)),
    g: Math.round(Math.sqrt(g)),
    b: Math.round(Math.sqrt(b)),
    a: +clampValue(a, 0, 1).toFixed(3),
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
    return mixColorsSubtractive(colors, normalizedWeights);
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

function averageColorsInHsl(colors: readonly Color[], normalizedWeights: readonly number[]): Color {
  let x = 0;
  let y = 0;
  let saturation = 0;
  let lightness = 0;
  colors.forEach((color, i) => {
    const val: ColorHSL = color.toHSL();
    const weight = normalizedWeights[i];
    const rad = (val.h * Math.PI) / 180;
    x += Math.cos(rad) * weight;
    y += Math.sin(rad) * weight;
    saturation += val.s * weight;
    lightness += val.l * weight;
  });
  const hue = (Math.atan2(y, x) * 180) / Math.PI;
  return new Color({
    h: Math.round((hue + 360) % 360),
    s: Math.round(saturation),
    l: Math.round(lightness),
  });
}

function averageColorsInLch(colors: readonly Color[], normalizedWeights: readonly number[]): Color {
  let lightness = 0;
  let chroma = 0;
  let x = 0;
  let y = 0;
  colors.forEach((color, i) => {
    const val: ColorLCH = color.toLCH();
    const weight = normalizedWeights[i];
    lightness += val.l * weight;
    chroma += val.c * weight;
    const rad = (val.h * Math.PI) / 180;
    x += Math.cos(rad) * weight;
    y += Math.sin(rad) * weight;
  });
  const hue = (Math.atan2(y, x) * 180) / Math.PI;
  return new Color({ l: lightness, c: chroma, h: (hue + 360) % 360 });
}

function averageColorsInOklch(colors: readonly Color[], normalizedWeights: readonly number[]): Color {
  let lightness = 0;
  let chroma = 0;
  let x = 0;
  let y = 0;
  colors.forEach((color, i) => {
    const val: ColorOKLCH = color.toOKLCH();
    const weight = normalizedWeights[i];
    lightness += val.l * weight;
    chroma += val.c * weight;
    const rad = (val.h * Math.PI) / 180;
    x += Math.cos(rad) * weight;
    y += Math.sin(rad) * weight;
  });
  const hue = (Math.atan2(y, x) * 180) / Math.PI;
  return new Color({ l: lightness, c: chroma, h: (hue + 360) % 360 });
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
