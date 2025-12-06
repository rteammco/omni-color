import { type CaseInsensitive, clampValue } from '../utils';
import { Color } from './color';
import { toCMYK } from './conversions';
import type { ColorCMYK, ColorHSL, ColorLCH, ColorOKLCH, ColorRGBA } from './formats';
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

function mixColorsAdditive(
  colors: readonly Color[],
  space: MixSpace,
  weights: readonly number[],
  sumOfWeights: number
) {
  switch (space) {
    case 'HSL':
    case 'LCH':
    case 'OKLCH':
    case 'LINEAR_RGB': {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      colors.forEach((color, i) => {
        const val: ColorRGBA = color.toRGBA();
        const weight = weights[i];
        r += srgbChannelToLinear(val.r, 'SRGB') * weight;
        g += srgbChannelToLinear(val.g, 'SRGB') * weight;
        b += srgbChannelToLinear(val.b, 'SRGB') * weight;
        a += (val.a ?? 1) * weight;
      });
      const result: ColorRGBA = {
        r: Math.round(linearChannelToSrgb(r, 'SRGB')),
        g: Math.round(linearChannelToSrgb(g, 'SRGB')),
        b: Math.round(linearChannelToSrgb(b, 'SRGB')),
        a: +clampValue(a / sumOfWeights, 0, 1).toFixed(3),
      };
      return new Color(result);
    }
    case 'RGB':
    default: {
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

function blendChannel(mode: BlendMode, base: number, blend: number): number {
  switch (mode) {
    case 'MULTIPLY':
      return (base * blend) / 255;
    case 'SCREEN':
      return 255 - ((255 - base) * (255 - blend)) / 255;
    case 'OVERLAY':
      return base < 128 ? (2 * base * blend) / 255 : 255 - (2 * (255 - base) * (255 - blend)) / 255;
    case 'NORMAL':
    default:
      return blend;
  }
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

function blendColorsInHSLSpace(base: Color, blend: Color, ratio: number): Color {
  const b = base.toHSL();
  const a = blend.toHSL();
  const delta = ((a.h - b.h + 540) % 360) - 180;
  const h = (b.h + delta * ratio + 360) % 360;
  const result: ColorHSL = {
    h,
    s: (1 - ratio) * b.s + ratio * a.s,
    l: (1 - ratio) * b.l + ratio * a.l,
  };
  return new Color(result);
}

export function blendColors(base: Color, blend: Color, options: BlendColorsOptions = {}): Color {
  const mode = (options.mode?.toUpperCase() ?? 'NORMAL') as BlendMode;
  const space = (options.space?.toUpperCase() ?? 'RGB') as BlendSpace;
  const ratio = clampValue(options.ratio ?? 0.5, 0, 1);

  if (space === 'RGB') {
    return blendColorsInRGBSpace(base, blend, mode, ratio);
  }

  return blendColorsInHSLSpace(base, blend, ratio);
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

export function averageColors(colors: readonly Color[], options: AverageColorsOptions = {}): Color {
  if (colors.length < 2) {
    throw new Error('at least two colors are required for averaging');
  }
  const space = (options.space?.toUpperCase() ?? 'LINEAR_RGB') as MixSpace;
  const { normalizedWeights } = getWeights(colors.length, options.weights);

  switch (space) {
    case 'HSL': {
      let x = 0;
      let y = 0;
      let s = 0;
      let l = 0;
      colors.forEach((color, i) => {
        const val: ColorHSL = color.toHSL();
        const weight = normalizedWeights[i];
        const rad = (val.h * Math.PI) / 180;
        x += Math.cos(rad) * weight;
        y += Math.sin(rad) * weight;
        s += val.s * weight;
        l += val.l * weight;
      });
      const hue = (Math.atan2(y, x) * 180) / Math.PI;
      return new Color({
        h: Math.round((hue + 360) % 360),
        s: Math.round(s),
        l: Math.round(l),
      });
    }
    case 'LCH': {
      let l = 0;
      let c = 0;
      let x = 0;
      let y = 0;
      colors.forEach((color, i) => {
        const val: ColorLCH = color.toLCH();
        const weight = normalizedWeights[i];
        l += val.l * weight;
        c += val.c * weight;
        const rad = (val.h * Math.PI) / 180;
        x += Math.cos(rad) * weight;
        y += Math.sin(rad) * weight;
      });
      const hue = (Math.atan2(y, x) * 180) / Math.PI;
      return new Color({ l, c, h: (hue + 360) % 360 });
    }
    case 'OKLCH': {
      let l = 0;
      let c = 0;
      let x = 0;
      let y = 0;
      colors.forEach((color, i) => {
        const val: ColorOKLCH = color.toOKLCH();
        const weight = normalizedWeights[i];
        l += val.l * weight;
        c += val.c * weight;
        const rad = (val.h * Math.PI) / 180;
        x += Math.cos(rad) * weight;
        y += Math.sin(rad) * weight;
      });
      const hue = (Math.atan2(y, x) * 180) / Math.PI;
      return new Color({ l, c, h: (hue + 360) % 360 });
    }
    case 'LINEAR_RGB': {
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
    case 'RGB':
    default: {
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
  }
}
