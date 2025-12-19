import { clampValue } from '../utils';
import { Color } from './color';
import type { ColorLCH } from './formats';

export type ColorManipulationSpace = 'HSL' | 'LAB' | 'LCH';

export interface ColorManipulationOptions {
  amount?: number;
  space?: ColorManipulationSpace;
}

type ManipulationInput = number | ColorManipulationOptions | undefined;

const DEFAULT_MANIPULATION_AMOUNT = 10;
const CHROMA_LAB_K = 18;

function isColorManipulationOptions(
  value: ManipulationInput
): value is ColorManipulationOptions {
  return Boolean(value) && typeof value === 'object';
}

function getNormalizedAmount(amount?: number): number {
  if (typeof amount !== 'number') {
    return DEFAULT_MANIPULATION_AMOUNT;
  }
  if (!Number.isFinite(amount)) {
    return DEFAULT_MANIPULATION_AMOUNT;
  }
  return amount;
}

function normalizeManipulationOptions(
  amountOrOptions?: ManipulationInput
): { amount: number; space: ColorManipulationSpace } {
  if (typeof amountOrOptions === 'number') {
    return { amount: getNormalizedAmount(amountOrOptions), space: 'HSL' };
  }

  if (isColorManipulationOptions(amountOrOptions)) {
    const { amount, space } = amountOrOptions;
    const normalizedSpace: ColorManipulationSpace =
      space === 'LAB' || space === 'LCH' ? space : 'HSL';

    return {
      amount: getNormalizedAmount(amount),
      space: normalizedSpace,
    };
  }

  return { amount: DEFAULT_MANIPULATION_AMOUNT, space: 'HSL' };
}

function getLabLikeDelta(amount: number): number {
  const chromaStep = amount / 10;
  return CHROMA_LAB_K * chromaStep;
}

function createColorWithAlpha(color: Color, format: ConstructorParameters<typeof Color>[0]): Color {
  const alpha = color.getAlpha();
  const updatedColor = new Color(format);
  if (alpha === 1) {
    return updatedColor;
  }
  return updatedColor.setAlpha(alpha);
}

function normalizeLch(lch: ColorLCH): ColorLCH {
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

export function brightenColor(color: Color, amountOrOptions?: ManipulationInput): Color {
  const { amount, space } = normalizeManipulationOptions(amountOrOptions);
  if (space === 'HSL') {
    const hsla = color.toHSLA();
    hsla.l = clampValue(hsla.l + amount, 0, 100);
    return new Color(hsla);
  }

  if (space === 'LAB') {
    const lab = color.toLAB();
    const updatedL = clampValue(lab.l + getLabLikeDelta(amount), 0, 100);
    return createColorWithAlpha(color, { ...lab, l: updatedL });
  }

  const lch = normalizeLch(color.toLCH());
  const updatedL = clampValue(lch.l + getLabLikeDelta(amount), 0, 100);
  return createColorWithAlpha(color, { ...lch, l: updatedL });
}

export function darkenColor(color: Color, amountOrOptions?: ManipulationInput): Color {
  const { amount, space } = normalizeManipulationOptions(amountOrOptions);
  if (space === 'HSL') {
    return brightenColor(color, -amount);
  }

  if (space === 'LAB') {
    const lab = color.toLAB();
    const updatedL = clampValue(lab.l - getLabLikeDelta(amount), 0, 100);
    return createColorWithAlpha(color, { ...lab, l: updatedL });
  }

  const lch = normalizeLch(color.toLCH());
  const updatedL = clampValue(lch.l - getLabLikeDelta(amount), 0, 100);
  return createColorWithAlpha(color, { ...lch, l: updatedL });
}

export function saturateColor(color: Color, amountOrOptions?: ManipulationInput): Color {
  const { amount, space } = normalizeManipulationOptions(amountOrOptions);
  if (space === 'HSL') {
    const hsla = color.toHSLA();
    hsla.s = clampValue(hsla.s + amount, 0, 100);
    return new Color(hsla);
  }

  const lch = normalizeLch(color.toLCH());
  const updatedC = Math.max(0, lch.c + getLabLikeDelta(amount));
  return createColorWithAlpha(color, { ...lch, c: updatedC });
}

export function desaturateColor(color: Color, amountOrOptions?: ManipulationInput): Color {
  const { amount, space } = normalizeManipulationOptions(amountOrOptions);
  if (space === 'HSL') {
    return saturateColor(color, -amount);
  }

  const lch = normalizeLch(color.toLCH());
  const updatedC = Math.max(0, lch.c - getLabLikeDelta(amount));
  return createColorWithAlpha(color, { ...lch, c: updatedC });
}

export function colorToGrayscale(color: Color): Color {
  const hsla = color.toHSLA();
  hsla.s = 0;
  return new Color(hsla);
}
