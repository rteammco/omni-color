import { clampValue } from '../utils';
import { toHSLA, toLAB, toLCH } from './conversions';
import type { ColorFormat, ColorHSLA, ColorLCH, ColorRGBA } from './formats.types';

export type ColorBrightnessSpace = 'HSL' | 'LAB' | 'LCH';

export interface ColorBrightnessOptions {
  amount?: number;
  space?: ColorBrightnessSpace;
  /**
   * Per-step delta applied to the LAB/LCH lightness channel when `space` is `'LAB'` or `'LCH'`.
   * The delta is calculated as `(amount / 10) * labScale`, so an `amount` of `10`
   * applies one "step" of `labScale` lightness change.
   */
  labScale?: number;
}

export type ColorSaturationSpace = 'HSL' | 'LCH';

export interface ColorSaturationOptions {
  amount?: number;
  space?: ColorSaturationSpace;
  /**
   * Per-step delta applied to the LAB/LCH chroma channel when `space` is `'LCH'`.
   * The delta is calculated as `(amount / 10) * labScale`, so an `amount` of `10`
   * applies one "step" of `labScale` chroma change.
   */
  labScale?: number;
}

const DEFAULT_MANIPULATION_AMOUNT = 10;
// Default LAB/LCH lightness or chroma delta applied per 10% step when using LAB-backed spaces.
const DEFAULT_LAB_LIGHTNESS_DELTA_PER_STEP = 18;

function getColorBrightnessOptions(
  options?: ColorBrightnessOptions,
): Required<ColorBrightnessOptions> {
  const {
    amount = DEFAULT_MANIPULATION_AMOUNT,
    space = 'HSL',
    labScale = DEFAULT_LAB_LIGHTNESS_DELTA_PER_STEP,
  } = options ?? {};
  return { amount, space, labScale };
}

function getColorSaturationOptions(
  options?: ColorSaturationOptions,
): Required<ColorSaturationOptions> {
  const {
    amount = DEFAULT_MANIPULATION_AMOUNT,
    space = 'HSL',
    labScale = DEFAULT_LAB_LIGHTNESS_DELTA_PER_STEP,
  } = options ?? {};
  return { amount, space, labScale };
}

function getLABLikeDelta(amount: number, labScale: number): number {
  const chromaStep = amount / 10;
  return labScale * chromaStep;
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

export function spinColorHue(rgba: Readonly<ColorRGBA>, degrees: number): ColorHSLA {
  const hsla = toHSLA(rgba);
  const rotatedHue = (((hsla.h + degrees) % 360) + 360) % 360;
  hsla.h = rotatedHue;
  return hsla;
}

export function brightenColor(
  rgba: Readonly<ColorRGBA>,
  options: ColorBrightnessOptions = {},
): ColorFormat {
  const { amount, space, labScale } = getColorBrightnessOptions(options);
  switch (space) {
    case 'LAB': {
      const lab = toLAB(rgba);
      const updatedL = clampValue(lab.l + getLABLikeDelta(amount, labScale), 0, 100);
      return { ...lab, l: updatedL };
    }
    case 'LCH': {
      const lch = normalizeLCH(toLCH(rgba));
      const updatedL = clampValue(lch.l + getLABLikeDelta(amount, labScale), 0, 100);
      return { ...lch, l: updatedL, format: 'LCH' };
    }
    case 'HSL':
    default: {
      const hsla = toHSLA(rgba);
      hsla.l = clampValue(hsla.l + amount, 0, 100);
      return hsla;
    }
  }
}

export function darkenColor(
  rgba: Readonly<ColorRGBA>,
  options: ColorBrightnessOptions = {},
): ColorFormat {
  const { amount, space, labScale } = getColorBrightnessOptions(options);
  switch (space) {
    case 'LAB': {
      const lab = toLAB(rgba);
      const updatedL = clampValue(lab.l - getLABLikeDelta(amount, labScale), 0, 100);
      return { ...lab, l: updatedL };
    }
    case 'LCH': {
      const lch = normalizeLCH(toLCH(rgba));
      const updatedL = clampValue(lch.l - getLABLikeDelta(amount, labScale), 0, 100);
      return { ...lch, l: updatedL, format: 'LCH' };
    }
    case 'HSL':
    default: {
      return brightenColor(rgba, { amount: -amount, space: 'HSL' });
    }
  }
}

export function saturateColor(
  rgba: Readonly<ColorRGBA>,
  options: ColorSaturationOptions = {},
): ColorFormat {
  const { amount, space, labScale } = getColorSaturationOptions(options);
  switch (space) {
    case 'LCH': {
      const lch = normalizeLCH(toLCH(rgba));
      const updatedC = Math.max(0, lch.c + getLABLikeDelta(amount, labScale));
      return { ...lch, c: updatedC, format: 'LCH' };
    }
    case 'HSL':
    default: {
      const hsla = toHSLA(rgba);
      hsla.s = clampValue(hsla.s + amount, 0, 100);
      return hsla;
    }
  }
}

export function desaturateColor(
  rgba: Readonly<ColorRGBA>,
  options: ColorSaturationOptions = {},
): ColorFormat {
  const { amount, space, labScale } = getColorSaturationOptions(options);
  switch (space) {
    case 'LCH': {
      const lch = normalizeLCH(toLCH(rgba));
      const updatedC = Math.max(0, lch.c - getLABLikeDelta(amount, labScale));
      return { ...lch, c: updatedC, format: 'LCH' };
    }
    case 'HSL':
    default: {
      return saturateColor(rgba, { amount: -amount, space: 'HSL' });
    }
  }
}

export function colorToGrayscale(rgba: Readonly<ColorRGBA>): ColorHSLA {
  const hsla = toHSLA(rgba);
  hsla.s = 0;
  return hsla;
}
