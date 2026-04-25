import { clampValue } from '../utils';

const RGB_CHANNEL_MAX_VALUE = 255; // 8‑bit channel ceiling
const SRGB_LINEAR_SEGMENT_DIVISOR = 12.92; // slope for low‑intensity segment
const SRGB_GAMMA_OFFSET = 0.055; // additive term in sRGB gamma curve
const SRGB_GAMMA_SCALE = 1.055; // multiplicative term in sRGB gamma curve
const SRGB_GAMMA_EXPONENT = 2.4; // exponent in sRGB transfer function

const SRGB_GAMMA_PIVOT_OPTIONS = {
  SRGB: 0.04045,
  WCAG: 0.03928,
} as const;

type SrgbGammaPivot = keyof typeof SRGB_GAMMA_PIVOT_OPTIONS;

export function srgbChannelToLinear(srgbChannelVal: number, pivot: SrgbGammaPivot): number {
  const c = clampValue(srgbChannelVal, 0, RGB_CHANNEL_MAX_VALUE) / RGB_CHANNEL_MAX_VALUE; // normalize
  let result: number;
  if (c <= SRGB_GAMMA_PIVOT_OPTIONS[pivot]) {
    result = c / SRGB_LINEAR_SEGMENT_DIVISOR; // linear portion for dark colors
  } else {
    result = Math.pow((c + SRGB_GAMMA_OFFSET) / SRGB_GAMMA_SCALE, SRGB_GAMMA_EXPONENT); // gamma correction for brighter colors
  }
  return clampValue(result, 0, 1);
}

export function linearChannelToSrgb(linearChannelVal: number, pivot: SrgbGammaPivot): number {
  const c = clampValue(linearChannelVal, 0, 1);
  const threshold = SRGB_GAMMA_PIVOT_OPTIONS[pivot] / SRGB_LINEAR_SEGMENT_DIVISOR;
  let result: number;
  if (c > threshold) {
    result = SRGB_GAMMA_SCALE * Math.pow(c, 1 / SRGB_GAMMA_EXPONENT) - SRGB_GAMMA_OFFSET;
  } else {
    result = c * SRGB_LINEAR_SEGMENT_DIVISOR;
  }
  return clampValue(result * RGB_CHANNEL_MAX_VALUE, 0, RGB_CHANNEL_MAX_VALUE);
}
