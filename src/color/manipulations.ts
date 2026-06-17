import { clampValue } from '../utils';
import { toHSLA, toLAB, toLCH, toRGBA } from './conversions';
import type { ColorLCH, ColorRGBA } from './formats.types';

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

export function spinColorHue(color: ColorRGBA, degrees: number): ColorRGBA {
  const hsla = toHSLA(color);
  const rotatedHue = (((hsla.h + degrees) % 360) + 360) % 360;
  return toRGBA({ ...hsla, h: rotatedHue });
}

export function brightenColor(color: ColorRGBA, options: ColorBrightnessOptions = {}): ColorRGBA {
  const { amount, space, labScale } = getColorBrightnessOptions(options);
  switch (space) {
    case 'LAB': {
      const lab = toLAB(color);
      const updatedL = clampValue(lab.l + getLABLikeDelta(amount, labScale), 0, 100);
      return { ...toRGBA({ ...lab, l: updatedL }), a: color.a };
    }
    case 'LCH': {
      const lch = normalizeLCH(toLCH(color));
      const updatedL = clampValue(lch.l + getLABLikeDelta(amount, labScale), 0, 100);
      return { ...toRGBA({ ...lch, l: updatedL, format: 'LCH' }), a: color.a };
    }
    case 'HSL':
    default: {
      const hsla = toHSLA(color);
      return toRGBA({ ...hsla, l: clampValue(hsla.l + amount, 0, 100) });
    }
  }
}

export function darkenColor(color: ColorRGBA, options: ColorBrightnessOptions = {}): ColorRGBA {
  const { amount, space, labScale } = getColorBrightnessOptions(options);
  switch (space) {
    case 'LAB': {
      const lab = toLAB(color);
      const updatedL = clampValue(lab.l - getLABLikeDelta(amount, labScale), 0, 100);
      return { ...toRGBA({ ...lab, l: updatedL }), a: color.a };
    }
    case 'LCH': {
      const lch = normalizeLCH(toLCH(color));
      const updatedL = clampValue(lch.l - getLABLikeDelta(amount, labScale), 0, 100);
      return { ...toRGBA({ ...lch, l: updatedL, format: 'LCH' }), a: color.a };
    }
    case 'HSL':
    default: {
      return brightenColor(color, { amount: -amount, space: 'HSL' });
    }
  }
}

export function saturateColor(color: ColorRGBA, options: ColorSaturationOptions = {}): ColorRGBA {
  const { amount, space, labScale } = getColorSaturationOptions(options);
  switch (space) {
    case 'LCH': {
      const lch = normalizeLCH(toLCH(color));
      const updatedC = Math.max(0, lch.c + getLABLikeDelta(amount, labScale));
      return { ...toRGBA({ ...lch, c: updatedC, format: 'LCH' }), a: color.a };
    }
    case 'HSL':
    default: {
      const hsla = toHSLA(color);
      return toRGBA({ ...hsla, s: clampValue(hsla.s + amount, 0, 100) });
    }
  }
}

export function desaturateColor(color: ColorRGBA, options: ColorSaturationOptions = {}): ColorRGBA {
  const { amount, space, labScale } = getColorSaturationOptions(options);
  switch (space) {
    case 'LCH': {
      const lch = normalizeLCH(toLCH(color));
      const updatedC = Math.max(0, lch.c - getLABLikeDelta(amount, labScale));
      return { ...toRGBA({ ...lch, c: updatedC, format: 'LCH' }), a: color.a };
    }
    case 'HSL':
    default: {
      return saturateColor(color, { amount: -amount, space: 'HSL' });
    }
  }
}

export function colorToGrayscale(color: ColorRGBA): ColorRGBA {
  const hsla = toHSLA(color);
  return toRGBA({ ...hsla, s: 0 });
}
