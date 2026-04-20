import { type CaseInsensitive } from '../utils';
import type { Color } from './color';
import type { ColorRGBA } from './formats';
import { getRelativeLuminance } from './utils';

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

export type APCAThresholdPreset = 'BODY' | 'LARGE_TEXT' | 'NON_TEXT' | 'VERY_LOW_VISION';
export type APCAReadabilityPolicy = 'NONE' | 'PRESET' | 'CUSTOM';

export interface APCAReadabilityOptions {
  policy?: CaseInsensitive<APCAReadabilityPolicy>;
  preset?: CaseInsensitive<APCAThresholdPreset>;
  threshold?: number;
}

export interface APCAReadabilityReport {
  score: number;
  absoluteScore: number;
  isReadable: boolean | null;
  requiredLc: number | null;
  shortfall: number | null;
}

const APCA_REQUIRED_PRESETS = {
  BODY: 60,
  LARGE_TEXT: 45,
  NON_TEXT: 30,
  VERY_LOW_VISION: 75,
} as const satisfies Record<APCAThresholdPreset, number>;

function getAPCARequiredLc(options: APCAReadabilityOptions = {}): number | null {
  const policy = (options.policy?.toUpperCase() ?? 'NONE') as APCAReadabilityPolicy;

  if (policy === 'NONE') {
    return null;
  }

  if (policy === 'CUSTOM') {
    return Math.max(0, Math.abs(options.threshold ?? APCA_REQUIRED_PRESETS.BODY));
  }

  const preset = (options.preset?.toUpperCase() ?? 'BODY') as APCAThresholdPreset;
  return APCA_REQUIRED_PRESETS[preset];
}

export function getAPCAReadabilityReport(
  foreground: Color,
  background: Color,
  options: APCAReadabilityOptions = {},
): APCAReadabilityReport {
  const score = getAPCAReadabilityScore(foreground, background);
  const absoluteScore = Math.abs(score);
  const requiredLc = getAPCARequiredLc(options);

  if (requiredLc === null) {
    return {
      score,
      absoluteScore,
      isReadable: null,
      requiredLc: null,
      shortfall: null,
    };
  }

  return {
    score,
    absoluteScore,
    isReadable: absoluteScore >= requiredLc,
    requiredLc,
    shortfall: Math.max(0, requiredLc - absoluteScore),
  };
}

export type WCAGReadabilityConformanceLevel = 'AA' | 'AAA';
export type WCAGReadabilityTextSizeOptions =
  | 'SMALL' // normal body text (< 18pt or < 14pt if bold)
  | 'LARGE'; // large-scale text (>= 18pt or >= 14pt if bold)

const WCAG_CONTRAST_READABILITY_THRESHOLDS: {
  [key in WCAGReadabilityConformanceLevel]: { [key in WCAGReadabilityTextSizeOptions]: number };
} = {
  AA: {
    SMALL: 4.5,
    LARGE: 3.0,
  },
  AAA: {
    SMALL: 7.0,
    LARGE: 4.5,
  },
} as const;

export interface WCAGReadabilityOptions {
  level?: CaseInsensitive<WCAGReadabilityConformanceLevel>;
  size?: CaseInsensitive<WCAGReadabilityTextSizeOptions>;
}

export interface WCAGReadabilityReport {
  contrastRatio: number;
  isReadable: boolean;
  requiredContrast: number;
  shortfall: number;
}

export type ReadabilityAlgorithm = 'WCAG' | 'APCA';

export interface ReadabilityOptions {
  algorithm?: CaseInsensitive<ReadabilityAlgorithm>;
  // Used only when algorithm is WCAG. Ignored for APCA.
  wcagOptions?: WCAGReadabilityOptions;
  // Used only when algorithm is APCA. Ignored for WCAG.
  apcaOptions?: APCAReadabilityOptions;
}

interface ReadabilityComparisonResult {
  score: number;
  isReadable: boolean | null;
  shortfall: number | null;
}

function isBetterReadabilityCandidate(
  candidate: ReadabilityComparisonResult,
  currentBest: ReadabilityComparisonResult,
): boolean {
  if (candidate.isReadable === null || currentBest.isReadable === null) {
    return candidate.score > currentBest.score;
  }

  if (candidate.isReadable !== currentBest.isReadable) {
    return candidate.isReadable;
  }

  if (
    !candidate.isReadable &&
    !currentBest.isReadable &&
    candidate.shortfall !== currentBest.shortfall &&
    candidate.shortfall !== null &&
    currentBest.shortfall !== null
  ) {
    return candidate.shortfall < currentBest.shortfall;
  }

  return candidate.score > currentBest.score;
}

export function getWCAGReadabilityReport(
  foreground: Color,
  background: Color,
  options: WCAGReadabilityOptions = {},
): WCAGReadabilityReport {
  const level = (options.level?.toUpperCase() ?? 'AA') as WCAGReadabilityConformanceLevel;
  const size = (options.size?.toUpperCase() ?? 'SMALL') as WCAGReadabilityTextSizeOptions;

  const contrastRatio = getWCAGContrastRatio(foreground, background);
  const requiredContrast = WCAG_CONTRAST_READABILITY_THRESHOLDS[level][size];
  return {
    contrastRatio,
    requiredContrast,
    isReadable: contrastRatio >= requiredContrast,
    shortfall: Math.max(0, requiredContrast - contrastRatio),
  };
}

export function isTextReadable(
  foreground: Color,
  background: Color,
  options: ReadabilityOptions = {},
): boolean {
  const algorithm = (options.algorithm?.toUpperCase() ?? 'WCAG') as ReadabilityAlgorithm;

  if (algorithm === 'APCA') {
    const report = getAPCAReadabilityReport(foreground, background, options.apcaOptions);
    return report.isReadable ?? report.absoluteScore >= APCA_REQUIRED_PRESETS.BODY;
  }

  return getWCAGReadabilityReport(foreground, background, options.wcagOptions).isReadable;
}

function getReadabilityComparisonResult(
  foreground: Color,
  background: Color,
  options: ReadabilityOptions = {},
): ReadabilityComparisonResult {
  const algorithm = (options.algorithm?.toUpperCase() ?? 'WCAG') as ReadabilityAlgorithm;
  const { apcaOptions, wcagOptions } = options;

  if (algorithm === 'APCA') {
    const report = getAPCAReadabilityReport(foreground, background, apcaOptions);
    return {
      score: report.absoluteScore,
      isReadable: report.isReadable,
      shortfall: report.shortfall,
    };
  }

  const report = getWCAGReadabilityReport(foreground, background, wcagOptions);
  return {
    score: report.contrastRatio,
    isReadable: report.isReadable,
    shortfall: report.shortfall,
  };
}

/**
 * Pick the text color with the strongest readability against a background color.
 */
export function getMostReadableTextColorForBackground(
  backgroundColor: Color,
  textColors: readonly Color[],
  options: ReadabilityOptions = {},
): Color {
  if (textColors.length === 0) {
    throw new Error('At least one text color must be provided.');
  }

  let mostReadableTextColor = textColors[0];
  let bestResult = getReadabilityComparisonResult(mostReadableTextColor, backgroundColor, options);

  for (let i = 1; i < textColors.length; i += 1) {
    const candidate = textColors[i];
    const candidateResult = getReadabilityComparisonResult(candidate, backgroundColor, options);
    if (isBetterReadabilityCandidate(candidateResult, bestResult)) {
      mostReadableTextColor = candidate;
      bestResult = candidateResult;
    }
  }

  return mostReadableTextColor;
}

/**
 * Pick the background color that maximizes readability for a given text color.
 */
export function getBestBackgroundColorForText(
  textColor: Color,
  backgroundColors: readonly Color[],
  options: ReadabilityOptions = {},
): Color {
  if (backgroundColors.length === 0) {
    throw new Error('At least one background color must be provided.');
  }

  let bestBackgroundColor = backgroundColors[0];
  let bestResult = getReadabilityComparisonResult(textColor, bestBackgroundColor, options);

  for (let i = 1; i < backgroundColors.length; i += 1) {
    const candidate = backgroundColors[i];
    const candidateResult = getReadabilityComparisonResult(textColor, candidate, options);
    if (isBetterReadabilityCandidate(candidateResult, bestResult)) {
      bestBackgroundColor = candidate;
      bestResult = candidateResult;
    }
  }

  return bestBackgroundColor;
}
