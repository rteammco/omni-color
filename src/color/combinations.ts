import { clampValue } from '../utils';
import { Color } from './color';
import { toCMYK } from './conversions';
import { ColorCMYK, ColorHSL, ColorLCH, ColorOKLCH, ColorRGBA } from './formats';

export enum MixType {
  ADDITIVE = 'ADDITIVE',
  SUBTRACTIVE = 'SUBTRACTIVE',
}

export enum MixSpace {
  RGB = 'RGB',
  HSL = 'HSL',
  LCH = 'LCH',
  OKLCH = 'OKLCH',
}

export interface MixColorsOptions {
  space?: MixSpace;
  type?: MixType;
  /**
   * Array of non-normalized `weights` for how much each color is weighed during combination.
   * Length of weights must match number of colors being combined.
   * @example
   * ```ts
   * { weights: [1, 1, 2] }
   * ```
   */
  weights?: number[];
}

function getWeights(
  count: number,
  inputRawWeights?: number[]
): { weights: number[]; sumOfWeights: number; normalizedWeights: number[] } {
  const weights =
    inputRawWeights && inputRawWeights.length === count
      ? inputRawWeights
      : new Array<number>(count).fill(1);
  const sumOfWeights = weights.reduce((sum, w) => sum + w, 0);
  if (sumOfWeights === 0) {
    // This is a sort of undefined behavior case, so just return what we can
    return { weights, sumOfWeights, normalizedWeights: weights };
  }
  return { weights, sumOfWeights, normalizedWeights: weights.map((w) => w / sumOfWeights) };
}

function mixColorsSubtractive(colors: Color[], normalizedWeights: number[]): Color {
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
  colors: Color[],
  space: MixSpace,
  weights: number[],
  sumOfWeights: number,
  normalizedWeights: number[]
) {
  switch (space) {
    case MixSpace.RGB:
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
    case MixSpace.HSL: {
      let h = 0;
      let s = 0;
      let l = 0;
      colors.forEach((color, i) => {
        const val: ColorHSL = color.toHSL();
        const weight = normalizedWeights[i];
        h += val.h * weight;
        s += val.s * weight;
        l += val.l * weight;
      });
      const result: ColorHSL = {
        h: Math.round(h) % 360,
        s: Math.round(s),
        l: Math.round(l),
      };
      return new Color(result);
    }
    case MixSpace.LCH: {
      let l = 0;
      let c = 0;
      let h = 0;
      colors.forEach((color, i) => {
        const val: ColorLCH = color.toLCH();
        const weight = normalizedWeights[i];
        l += val.l * weight;
        c += val.c * weight;
        h += val.h * weight;
      });
      const result: ColorLCH = { l, c, h };
      return new Color(result);
    }
    case MixSpace.OKLCH: {
      let l = 0;
      let c = 0;
      let h = 0;
      colors.forEach((color, i) => {
        const val: ColorOKLCH = color.toOKLCH();
        const weight = normalizedWeights[i];
        l += val.l * weight;
        c += val.c * weight;
        h += val.h * weight;
      });
      const result: ColorOKLCH = { l, c, h };
      return new Color(result);
    }
  }
}

export function mixColors(colors: Color[], options: MixColorsOptions = {}): Color {
  if (colors.length < 2) {
    throw new Error('[mixColors] at least two colors are required for mixing');
  }
  const { type = MixType.ADDITIVE, space = MixSpace.RGB } = options;
  const { weights, sumOfWeights, normalizedWeights } = getWeights(colors.length, options.weights);

  if (type === MixType.SUBTRACTIVE) {
    return mixColorsSubtractive(colors, normalizedWeights);
  }

  return mixColorsAdditive(colors, space, weights, sumOfWeights, normalizedWeights);
}

export enum BlendMode {
  NORMAL = 'NORMAL',
  MULTIPLY = 'MULTIPLY',
  SCREEN = 'SCREEN',
  OVERLAY = 'OVERLAY',
}

export enum BlendSpace {
  RGB = 'RGB',
  HSL = 'HSL',
}

export interface BlendColorsOptions {
  mode?: BlendMode;
  space?: BlendSpace;
  ratio?: number; // amount of blend color over base (0 - 1)
}

function blendChannel(mode: BlendMode, base: number, blend: number): number {
  switch (mode) {
    case BlendMode.MULTIPLY:
      return (base * blend) / 255;
    case BlendMode.SCREEN:
      return 255 - ((255 - base) * (255 - blend)) / 255;
    case BlendMode.OVERLAY:
      return base < 128 ? (2 * base * blend) / 255 : 255 - (2 * (255 - base) * (255 - blend)) / 255;
    case BlendMode.NORMAL:
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
  const result: ColorHSL = {
    h: (1 - ratio) * b.h + ratio * a.h,
    s: (1 - ratio) * b.s + ratio * a.s,
    l: (1 - ratio) * b.l + ratio * a.l,
  };
  return new Color(result);
}

export function blendColors(base: Color, blend: Color, options: BlendColorsOptions = {}): Color {
  const { mode = BlendMode.NORMAL, space = BlendSpace.RGB, ratio: inputRatio = 0.5 } = options;
  const ratio = clampValue(inputRatio, 0, 1);

  if (space === BlendSpace.RGB) {
    return blendColorsInRGBSpace(base, blend, mode, ratio);
  }

  return blendColorsInHSLSpace(base, blend, ratio);
}

export interface AverageOptions {
  space?: MixSpace;
  weights?: number[];
}

export function averageColors(colors: Color[], options: AverageOptions = {}): Color {
  if (colors.length < 2) {
    throw new Error('[averageColors] at least two colors are required for averaging');
  }
  const { space = MixSpace.RGB } = options;
  const { normalizedWeights } = getWeights(colors.length, options.weights);

  switch (space) {
    case MixSpace.RGB:
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
    case MixSpace.HSL: {
      let h = 0;
      let s = 0;
      let l = 0;
      colors.forEach((color, i) => {
        const val: ColorHSL = color.toHSL();
        const weight = normalizedWeights[i];
        h += val.h * weight;
        s += val.s * weight;
        l += val.l * weight;
      });
      return new Color({
        h: Math.round(h) % 360,
        s: Math.round(s),
        l: Math.round(l),
      });
    }
    case MixSpace.LCH: {
      let l = 0;
      let c = 0;
      let h = 0;
      colors.forEach((color, i) => {
        const val: ColorLCH = color.toLCH();
        const weight = normalizedWeights[i];
        l += val.l * weight;
        c += val.c * weight;
        h += val.h * weight;
      });
      return new Color({ l, c, h });
    }
    case MixSpace.OKLCH: {
      let l = 0;
      let c = 0;
      let h = 0;
      colors.forEach((color, i) => {
        const val: ColorOKLCH = color.toOKLCH();
        const weight = normalizedWeights[i];
        l += val.l * weight;
        c += val.c * weight;
        h += val.h * weight;
      });
      return new Color({ l, c, h });
    }
  }
}
