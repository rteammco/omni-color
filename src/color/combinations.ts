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

export interface MixOptions {
  type?: MixType;
  space?: MixSpace;
  weights?: number[];
  /** Optional white point placeholder for future use */
  whitePoint?: unknown;
  /** Clamp the resulting color into gamut */
  gamutMap?: 'clip';
}

function getWeights(count: number, weights?: number[]): number[] {
  return weights && weights.length === count ? weights : Array(count).fill(1);
}

export function mixColors(colors: Color[], options: MixOptions = {}): Color {
  if (colors.length < 2) {
    throw new Error('mixColors requires at least two colors');
  }
  const { type = MixType.ADDITIVE, space = MixSpace.RGB, weights } = options;
  const w = getWeights(colors.length, weights);

  switch (type) {
    case MixType.SUBTRACTIVE: {
      const norm = w.map((v) => v / w.reduce((a, b) => a + b, 0));
      let c = 1;
      let m = 1;
      let y = 1;
      let k = 1;
      colors.forEach((color, i) => {
        const part = toCMYK(color.toRGBA());
        const weight = norm[i];
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
    case MixType.ADDITIVE:
    default:
      break;
  }

  const total = w.reduce((a, b) => a + b, 0);
  const norm = w.map((v) => v / total);

  switch (space) {
    case MixSpace.RGB:
    default: {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      colors.forEach((color, i) => {
        const val: ColorRGBA = color.toRGBA();
        const weight = w[i];
        r += val.r * weight;
        g += val.g * weight;
        b += val.b * weight;
        a += (val.a ?? 1) * weight;
      });
      const result: ColorRGBA = {
        r: Math.round(clampValue(r, 0, 255)),
        g: Math.round(clampValue(g, 0, 255)),
        b: Math.round(clampValue(b, 0, 255)),
        a: +clampValue(a / total, 0, 1).toFixed(3),
      };
      return new Color(result);
    }
    case MixSpace.HSL: {
      let h = 0;
      let s = 0;
      let l = 0;
      colors.forEach((color, i) => {
        const val: ColorHSL = color.toHSL();
        const weight = norm[i];
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
        const weight = norm[i];
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
        const weight = norm[i];
        l += val.l * weight;
        c += val.c * weight;
        h += val.h * weight;
      });
      const result: ColorOKLCH = { l, c, h };
      return new Color(result);
    }
  }
}

export interface AverageOptions {
  space?: MixSpace;
  weights?: number[];
}

export function averageColors(colors: Color[], options: AverageOptions = {}): Color {
  if (colors.length < 2) {
    throw new Error('averageColors requires at least two colors');
  }
  const { space = MixSpace.RGB, weights } = options;
  const w = getWeights(colors.length, weights);
  const total = w.reduce((a, b) => a + b, 0);
  const norm = w.map((v) => v / total);

  switch (space) {
    case MixSpace.RGB:
    default: {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      colors.forEach((color, i) => {
        const val: ColorRGBA = color.toRGBA();
        const weight = norm[i];
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
        const weight = norm[i];
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
        const weight = norm[i];
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
        const weight = norm[i];
        l += val.l * weight;
        c += val.c * weight;
        h += val.h * weight;
      });
      return new Color({ l, c, h });
    }
  }
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

export interface BlendOptions {
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

export function blendColors(base: Color, blend: Color, options: BlendOptions = {}): Color {
  const { mode = BlendMode.NORMAL, space = BlendSpace.RGB, ratio = 0.5 } = options;
  const t = clampValue(ratio, 0, 1);
  switch (space) {
    case BlendSpace.HSL: {
      const b = base.toHSL();
      const a = blend.toHSL();
      const result: ColorHSL = {
        h: (1 - t) * b.h + t * a.h,
        s: (1 - t) * b.s + t * a.s,
        l: (1 - t) * b.l + t * a.l,
      };
      return new Color(result);
    }
    case BlendSpace.RGB:
    default: {
      const b = base.toRGBA();
      const a = blend.toRGBA();
      const r = (1 - t) * b.r + t * blendChannel(mode, b.r, a.r);
      const g = (1 - t) * b.g + t * blendChannel(mode, b.g, a.g);
      const bb = (1 - t) * b.b + t * blendChannel(mode, b.b, a.b);
      const alpha = (1 - t) * (b.a ?? 1) + t * (a.a ?? 1);
      const result: ColorRGBA = {
        r: Math.round(clampValue(r, 0, 255)),
        g: Math.round(clampValue(g, 0, 255)),
        b: Math.round(clampValue(bb, 0, 255)),
        a: +clampValue(alpha, 0, 1).toFixed(3),
      };
      return new Color(result);
    }
  }
}
