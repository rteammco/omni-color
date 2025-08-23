import { Color } from './color';
import type { ColorRGBA } from './formats';
import { srgbChannelToLinear, SrgbGammaPivot } from './utils';

// Does alpha blending between the two RGBA colors. Calculates what the a
// semi-transparent foreground color would look like on the background color.
function getCompositeRGBA(fg: ColorRGBA, bg: ColorRGBA): ColorRGBA {
  const compositeAlpha = fg.a + bg.a * (1 - fg.a);
  if (compositeAlpha === 0) {
    return { r: bg.r, g: bg.g, b: bg.b, a: 0 };
  }
  const r = (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / compositeAlpha;
  const g = (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / compositeAlpha;
  const b = (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / compositeAlpha;
  return { r, g, b, a: compositeAlpha };
}

function getRelativeLuminance(rgb: ColorRGBA): number {
  const r = srgbChannelToLinear(rgb.r, SrgbGammaPivot.WCAG);
  const g = srgbChannelToLinear(rgb.g, SrgbGammaPivot.WCAG);
  const b = srgbChannelToLinear(rgb.b, SrgbGammaPivot.WCAG);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b; // standard luminance formula
}

export function getWCAGContrastRatio(color1: Color, color2: Color): number {
  const c1 = color1.toRGBA();
  const c2 = color2.toRGBA();
  if (c1.a === 0 && c2.a === 0) {
    return 1;
  }

  const c1Over2 = c1.a < 1 ? getCompositeRGBA(c1, c2) : c1;
  const c2Over1 = c2.a < 1 ? getCompositeRGBA(c2, c1) : c2;
  const l1 = getRelativeLuminance(c1Over2);
  const l2 = getRelativeLuminance(c2Over1);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return +ratio.toFixed(2);
}

// SA98G stands for "Silver Algorithm 98 Gamma" or "Somers Algorithm 98 Gamma"
// and contains the constants used for the APCA algorithm.
const SA98G = {
  // Color space and gamma correction:
  mainTRC: 2.4, // APCA gamma correction exponent

  // Luminance coefficients:
  sRco: 0.2126729, // APCA red color coefficient
  sGco: 0.7151522, // APCA green color coefficient
  sBco: 0.072175, // APCA blue color coefficient

  // Normalization exponents:
  normBG: 0.56, // background normalization for normal polarity (dark text on light background)
  normTXT: 0.57, // text normalization for normal polarity
  revBG: 0.65, // background normalization for reverse polarity (light text on dark background)
  revTXT: 0.62, // text normalization for reverse polarity

  // Scaling factors:
  scaleBoW: 1.14, // scale factor for normal polarity (black on white)
  scaleWoB: 1.14, // scale factor for reverse polarity (white on black)

  // Threshold and clipping values:
  blkThresh: 0.022, // black threshold below which special handling is applied
  blkClamp: 1.414, // black clamp exponent for handling very dark colors
  deltaYmin: 0.0005, // minimum luminance difference threshold
  loClip: 0.1, // low contrast clipping threshold

  // Offset values:
  loBoWOffset: 0.027, // low contrast offset for Black on White
  loWoBOffset: 0.027, // low contrast offset for White on Black
} as const;

// Converts RGB to Y (luminance) value using the APCA method
function sRGBtoY(rgb: ColorRGBA): number {
  // Normalizes each channel and applies gamma correction (SA98G.mainTRC exponent)
  const linearizeRGBChannel = (c: number): number => Math.pow(c / 255, SA98G.mainTRC);

  // Calculate weighted luminance using APCA-specified coefficients:
  return (
    SA98G.sRco * linearizeRGBChannel(rgb.r) +
    SA98G.sGco * linearizeRGBChannel(rgb.g) +
    SA98G.sBco * linearizeRGBChannel(rgb.b)
  );
}

// Given the text luminance `txtY` and the background luminance `bgY`, returns the APCA contrast value
// as a percentage (-100 to +100).
function getAPCAContrast(txtY: number, bgY: number): number {
  // Input validation:
  const icp = [0.0, 1.1]; // input color processing range
  if (
    Number.isNaN(txtY) ||
    Number.isNaN(bgY) ||
    Math.min(txtY, bgY) < icp[0] ||
    Math.max(txtY, bgY) > icp[1]
  ) {
    return 0;
  }

  // Black level clamping:
  const clampedTxtY =
    txtY > SA98G.blkThresh ? txtY : txtY + Math.pow(SA98G.blkThresh - txtY, SA98G.blkClamp);
  const clampedBgY =
    bgY > SA98G.blkThresh ? bgY : bgY + Math.pow(SA98G.blkThresh - bgY, SA98G.blkClamp);

  // Minimum delta check (min perceptual difference) - if the colors are too similar, contrast is effectively zero:
  if (Math.abs(clampedBgY - clampedTxtY) < SA98G.deltaYmin) {
    return 0;
  }

  // Polarity-based contrast calculation:
  let SAPC = 0; // "Somers Algorithm Perceptual Contrast"
  let outputContrast = 0;
  if (clampedBgY > clampedTxtY) {
    SAPC =
      (Math.pow(clampedBgY, SA98G.normBG) - Math.pow(clampedTxtY, SA98G.normTXT)) * SA98G.scaleBoW;
    outputContrast = SAPC < SA98G.loClip ? 0 : SAPC - SA98G.loBoWOffset;
  } else {
    SAPC =
      (Math.pow(clampedBgY, SA98G.revBG) - Math.pow(clampedTxtY, SA98G.revTXT)) * SA98G.scaleWoB;
    outputContrast = SAPC > -SA98G.loClip ? 0 : SAPC + SA98G.loWoBOffset;
  }

  // Scale output to percentage (-100 to +100) and return:
  return outputContrast * 100;
}

// Calculates the APCA readability score (Lc value).
// NOTE: This is based on draft recommendations and is provided for advisory use only as WCAG 3 is not finalized.
export function getAPCAReadabilityScore(foreground: Color, background: Color): number {
  const fg = foreground.toRGBA();
  const bg = background.toRGBA();

  const bgOpaque = bg.a < 1 ? getCompositeRGBA(bg, { r: 255, g: 255, b: 255, a: 1 }) : bg;
  const fgOpaque = fg.a < 1 ? getCompositeRGBA(fg, bgOpaque) : fg;

  const txtY = sRGBtoY(fgOpaque);
  const bgY = sRGBtoY(bgOpaque);
  return getAPCAContrast(txtY, bgY);
}
