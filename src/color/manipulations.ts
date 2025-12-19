import { clampValue } from '../utils';
import { Color } from './color';
import type { ColorLCH } from './formats';

export type ColorBrightnessSpace = 'HSL' | 'LAB' | 'LCH';

export interface ColorBrightnessOptions {
  amount?: number;
  space?: ColorBrightnessSpace;
}

export type ColorSaturationSpace = 'HSL' | 'LCH';

export interface ColorSaturationOptions {
  amount?: number;
  space?: ColorSaturationSpace;
}

const DEFAULT_MANIPULATION_AMOUNT = 10;
const CHROMA_LAB_K = 18; // TODO: this is just to match chroma.js scale value... rename and replace with option

function getColorBrightnessOptions(
  options?: ColorBrightnessOptions
): Required<ColorBrightnessOptions> {
  const { amount = DEFAULT_MANIPULATION_AMOUNT, space = 'HSL' } = options ?? {};
  return { amount, space };
}

function getColorSaturationOptions(
  options?: ColorSaturationOptions
): Required<ColorSaturationOptions> {
  const { amount = DEFAULT_MANIPULATION_AMOUNT, space = 'HSL' } = options ?? {};
  return { amount, space };
}

function getLABLikeDelta(amount: number): number {
  const chromaStep = amount / 10;
  return CHROMA_LAB_K * chromaStep;
}

function normalizeLCH(lch: ColorLCH): ColorLCH {
  const sanitizedChroma = Math.abs(lch.c) < 0.01 ? 0 : lch.c;
  const sanitizedHue = Number.isFinite(lch.h) ? lch.h : 0;
  return {
    ...lch,
    c: sanitizedChroma,
    h: sanitizedChroma === 0 ? 0 : sanitizedHue,
  };
}

export function spinColorHue(color: Color, degrees: number): Color {
  const hsl = color.toHSL();
  let rotatedHue = Math.floor((hsl.h + degrees) % 360);
  if (rotatedHue < 0) {
    rotatedHue += 360; // ensure hue is always positive
  }
  hsl.h = rotatedHue;
  return new Color(hsl);
}

export function brightenColor(color: Color, options?: ColorBrightnessOptions): Color {
  const { amount, space } = getColorBrightnessOptions(options);
  switch (space) {
    case 'LAB': {
      const lab = color.toLAB();
      const updatedL = clampValue(lab.l + getLABLikeDelta(amount), 0, 100);
      return new Color({ ...lab, l: updatedL }).setAlpha(color.getAlpha());
    }
    case 'LCH': {
      const lch = normalizeLCH(color.toLCH());
      const updatedL = clampValue(lch.l + getLABLikeDelta(amount), 0, 100);
      return new Color({ ...lch, l: updatedL }).setAlpha(color.getAlpha());
    }
    case 'HSL':
    default: {
      const hsla = color.toHSLA();
      hsla.l = clampValue(hsla.l + amount, 0, 100);
      return new Color(hsla);
    }
  }
}

export function darkenColor(color: Color, options?: ColorBrightnessOptions): Color {
  const { amount, space } = getColorBrightnessOptions(options);
  switch (space) {
    case 'LAB': {
      const lab = color.toLAB();
      const updatedL = clampValue(lab.l - getLABLikeDelta(amount), 0, 100);
      return new Color({ ...lab, l: updatedL }).setAlpha(color.getAlpha());
    }
    case 'LCH': {
      const lch = normalizeLCH(color.toLCH());
      const updatedL = clampValue(lch.l - getLABLikeDelta(amount), 0, 100);
      return new Color({ ...lch, l: updatedL }).setAlpha(color.getAlpha());
    }
    case 'HSL':
    default: {
      return brightenColor(color, { amount: -amount, space: 'HSL' });
    }
  }
}

export function saturateColor(color: Color, options?: ColorSaturationOptions): Color {
  const { amount, space } = getColorSaturationOptions(options);
  switch (space) {
    case 'LCH': {
      const lch = normalizeLCH(color.toLCH());
      const updatedC = Math.max(0, lch.c + getLABLikeDelta(amount));
      return new Color({ ...lch, c: updatedC }).setAlpha(color.getAlpha());
    }
    case 'HSL':
    default: {
      const hsla = color.toHSLA();
      hsla.s = clampValue(hsla.s + amount, 0, 100);
      return new Color(hsla);
    }
  }
}

export function desaturateColor(color: Color, options?: ColorSaturationOptions): Color {
  const { amount, space } = getColorSaturationOptions(options);
  switch (space) {
    case 'LCH': {
      const lch = normalizeLCH(color.toLCH());
      const updatedC = Math.max(0, lch.c - getLABLikeDelta(amount));
      return new Color({ ...lch, c: updatedC }).setAlpha(color.getAlpha());
    }
    case 'HSL':
    default: {
      return saturateColor(color, { amount: -amount, space: 'HSL' });
    }
  }
}

export function colorToGrayscale(color: Color): Color {
  const hsla = color.toHSLA();
  hsla.s = 0;
  return new Color(hsla);
}
