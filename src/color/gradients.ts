import { type CaseInsensitive, clampValue } from '../utils';
import type { Color } from './color';
import type {
  ColorHSL,
  ColorHSV,
  ColorLCH,
  ColorOKLAB,
  ColorOKLCH,
  ColorRGB,
  ColorRGBA,
} from './formats';
import { linearChannelToSrgb, srgbChannelToLinear } from './utils';

export type ColorGradientSpace = 'RGB' | 'HSL' | 'HSV' | 'LCH' | 'OKLAB' | 'OKLCH';
export type ColorGradientInterpolation = 'LINEAR' | 'BEZIER';

type ColorGradientEasingMode = 'LINEAR' | 'EASE_IN' | 'EASE_OUT' | 'EASE_IN_OUT';
export type ColorGradientEasing =
  | CaseInsensitive<ColorGradientEasingMode>
  | ((t: number) => number);

export type HueInterpolationMode =
  | 'CARTESIAN'
  | 'SHORTEST'
  | 'LONGEST'
  | 'INCREASING'
  | 'DECREASING'
  | 'RAW';

export interface ColorGradientOptions {
  /**
   * Number of colors to generate, including the input anchors.
   * Must be at least 2.
   */
  stops?: number;
  /** Color space in which interpolation will occur. */
  space?: CaseInsensitive<ColorGradientSpace>;
  /**
   * Interpolation style. Linear moves stop-to-stop evenly; bezier uses
   * the provided colors as control points for a bezier curve.
   */
  interpolation?: CaseInsensitive<ColorGradientInterpolation>;
  /** Easing to apply across the 0–1 range of the scale. */
  easing?: ColorGradientEasing;
  /**
   * Clamp the resulting values to the target color space range before
   * converting back to sRGB.
   */
  clamp?: boolean;
  /**
   * Strategy for interpolating hue angles in polar color spaces (HSL, HSV, LCH, OKLCH).
   * Defaults to 'SHORTEST' for polar spaces, enabling saturation-preserving gradients.
   * Set to 'CARTESIAN' to use the legacy method (converting to x/y coordinates),
   * which may cause desaturation in the middle of the gradient.
   * Ignored for RGB space.
   */
  hueInterpolationMode?: CaseInsensitive<HueInterpolationMode>;
}

type InterpolatableColor = {
  values: number[];
  alpha: number;
};

const MIN_SCALE_STOPS = 2;
const DEFAULT_SCALE_STOPS = 5;
const DEFAULT_SPACE: ColorGradientSpace = 'OKLCH';
const DEFAULT_INTERPOLATION: ColorGradientInterpolation = 'LINEAR';
const MAX_OKLCH_CHROMA = 0.5;
const MAX_LCH_CHROMA = 150;
const LAB_DELTA = 6 / 29;
const LAB_DELTA_CUBED = LAB_DELTA ** 3;
const LAB_F_LINEAR_COEFFICIENT = 1 / (3 * LAB_DELTA ** 2);
const LAB_C_OFFSET = 4 / 29;
const LAB_KAPPA = 116 * LAB_F_LINEAR_COEFFICIENT;

/**
 * Keep hue values in [0, 360) to avoid discontinuities when wrapping around the
 * color wheel.
 */
function wrapHue(degrees: number): number {
  const result = degrees % 360;
  return result < 0 ? result + 360 : result;
}

/**
 * Convert a supplied easing configuration into a normalized easing function.
 */
function getEasingFunction(easing?: ColorGradientEasing): (t: number) => number {
  if (typeof easing === 'function') {
    return easing;
  }

  const easingMode = (easing ? easing.toUpperCase() : 'LINEAR') as ColorGradientEasingMode;
  switch (easingMode) {
    case 'EASE_IN':
      return (t: number) => t ** 2;
    case 'EASE_OUT':
      return (t: number) => 1 - (1 - t) ** 2;
    case 'EASE_IN_OUT':
      return (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    case 'LINEAR':
    default:
      return (t: number) => t;
  }
}

function interpolateLinearValue(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

function interpolateLinearVector(start: number[], end: number[], progress: number): number[] {
  return start.map((value, index) => interpolateLinearValue(value, end[index], progress));
}

/**
 * Evaluate a bezier curve for vector control points using De Casteljau's
 * algorithm so multi-stop gradients remain smooth.
 */
function interpolateBezier(points: number[][], t: number): number[] {
  if (points.length === 1) {
    return points[0];
  }

  let working = points.map((point) => [...point]);
  while (working.length > 1) {
    const next: number[][] = [];
    for (let i = 0; i < working.length - 1; i += 1) {
      next.push(interpolateLinearVector(working[i], working[i + 1], t));
    }
    working = next;
  }

  return working[0];
}

/**
 * Evaluate a bezier curve for a single dimension such as the alpha channel.
 */
function interpolateBezierScalar(values: number[], t: number): number {
  if (values.length === 1) {
    return values[0];
  }

  let working = [...values];
  while (working.length > 1) {
    const next: number[] = [];
    for (let i = 0; i < working.length - 1; i += 1) {
      next.push(interpolateLinearValue(working[i], working[i + 1], t));
    }
    working = next;
  }

  return working[0];
}

function getUnroundedHSL(color: Color): ColorHSL {
  const { r, g, b } = color.toRGB();
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / delta + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: (h * 360 + 360) % 360,
    s: s * 100,
    l: l * 100,
  };
}

function getUnroundedHSV(color: Color): ColorHSV {
  const { r, g, b } = color.toRGB();
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;
  let h = 0;
  let s = 0;

  if (delta !== 0) {
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / delta + 4;
        break;
    }
    h /= 6;
  }

  if (max !== 0) {
    s = delta / max;
  }

  return {
    h: (h * 360 + 360) % 360,
    s: s * 100,
    v: max * 100,
  };
}

function getUnroundedLCH(color: Color): ColorLCH {
  const { r, g, b } = color.toRGB();
  const rLin = srgbChannelToLinear(r, 'SRGB');
  const gLin = srgbChannelToLinear(g, 'SRGB');
  const bLin = srgbChannelToLinear(b, 'SRGB');

  let x = rLin * 0.4124 + gLin * 0.3576 + bLin * 0.1805;
  let y = rLin * 0.2126 + gLin * 0.7152 + bLin * 0.0722;
  let z = rLin * 0.0193 + gLin * 0.1192 + bLin * 0.9505;

  x /= 0.95047;
  y /= 1.0;
  z /= 1.08883;

  const fx = x > LAB_DELTA_CUBED ? Math.cbrt(x) : LAB_F_LINEAR_COEFFICIENT * x + LAB_C_OFFSET;
  const fy = y > LAB_DELTA_CUBED ? Math.cbrt(y) : LAB_F_LINEAR_COEFFICIENT * y + LAB_C_OFFSET;
  const fz = z > LAB_DELTA_CUBED ? Math.cbrt(z) : LAB_F_LINEAR_COEFFICIENT * z + LAB_C_OFFSET;

  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b2 = 200 * (fy - fz);
  const c = Math.sqrt(a * a + b2 * b2);
  const h = wrapHue((Math.atan2(b2, a) * 180) / Math.PI);

  return { l, c, h };
}

function getHSLVector(color: Color, alpha: number, isCartesian: boolean): InterpolatableColor {
  const { h, s, l } = getUnroundedHSL(color);
  if (isCartesian) {
    const rad = (h * Math.PI) / 180;
    return { values: [Math.cos(rad) * s, Math.sin(rad) * s, l], alpha };
  }
  return { values: [h, s, l], alpha };
}

function getHSVVector(color: Color, alpha: number, isCartesian: boolean): InterpolatableColor {
  const { h, s, v } = getUnroundedHSV(color);
  if (isCartesian) {
    const rad = (h * Math.PI) / 180;
    return { values: [Math.cos(rad) * s, Math.sin(rad) * s, v], alpha };
  }
  return { values: [h, s, v], alpha };
}

function getLCHVector(color: Color, alpha: number, isCartesian: boolean): InterpolatableColor {
  const { l, c, h } = getUnroundedLCH(color);
  if (isCartesian) {
    const rad = (h * Math.PI) / 180;
    return { values: [l, Math.cos(rad) * c, Math.sin(rad) * c], alpha };
  }
  return { values: [l, c, h], alpha };
}

function getOKLCHVector(color: Color, alpha: number, isCartesian: boolean): InterpolatableColor {
  const { l, c, h } = color.toOKLCH();
  if (isCartesian) {
    const rad = (h * Math.PI) / 180;
    return { values: [l, Math.cos(rad) * c, Math.sin(rad) * c], alpha };
  }
  return { values: [l, c, h], alpha };
}

function getOKLABVector(color: Color, alpha: number): InterpolatableColor {
  const { l, a, b } = color.toOKLAB();
  return { values: [l, a, b], alpha };
}

/**
 * Convert a color into an interpolatable vector for the target color space
 * while preserving alpha separately.
 */
function colorToVector(
  color: Color,
  space: ColorGradientSpace,
  isCartesian: boolean
): InterpolatableColor {
  const rgba = color.toRGBA();
  const alpha = rgba.a ?? 1;
  switch (space) {
    case 'HSL':
      return getHSLVector(color, alpha, isCartesian);
    case 'HSV':
      return getHSVVector(color, alpha, isCartesian);
    case 'LCH':
      return getLCHVector(color, alpha, isCartesian);
    case 'OKLAB':
      return getOKLABVector(color, alpha);
    case 'OKLCH':
      return getOKLCHVector(color, alpha, isCartesian);
    case 'RGB':
    default: {
      const { r, g, b } = rgba;
      return { values: [r, g, b], alpha };
    }
  }
}

function vectorToFormat(
  vector: InterpolatableColor,
  space: ColorGradientSpace,
  clamp: boolean,
  isCartesian: boolean
): {
  format: ColorRGB | ColorHSL | ColorHSV | ColorLCH | ColorOKLAB | ColorOKLCH;
  alpha: number;
} {
  const [first, second, third] = vector.values;
  const alpha = clamp ? clampValue(vector.alpha, 0, 1) : vector.alpha;

  switch (space) {
    case 'HSL': {
      if (isCartesian) {
        const saturation = Math.sqrt(second ** 2 + first ** 2);
        const hue = wrapHue((Math.atan2(second, first) * 180) / Math.PI);
        const l = clamp ? clampValue(third, 0, 100) : third;
        const s = clamp ? clampValue(saturation, 0, 100) : saturation;
        return { format: { h: hue, s, l }, alpha };
      }
      // HSL Polar: [h, s, l]
      const hue = wrapHue(first);
      const s = clamp ? clampValue(second, 0, 100) : second;
      const l = clamp ? clampValue(third, 0, 100) : third;
      return { format: { h: hue, s, l }, alpha };
    }
    case 'HSV': {
      if (isCartesian) {
        const saturation = Math.sqrt(second ** 2 + first ** 2);
        const hue = wrapHue((Math.atan2(second, first) * 180) / Math.PI);
        const v = clamp ? clampValue(third, 0, 100) : third;
        const s = clamp ? clampValue(saturation, 0, 100) : saturation;
        return { format: { h: hue, s, v }, alpha };
      }
      // HSV Polar: [h, s, v]
      const hue = wrapHue(first);
      const s = clamp ? clampValue(second, 0, 100) : second;
      const v = clamp ? clampValue(third, 0, 100) : third;
      return { format: { h: hue, s, v }, alpha };
    }
    case 'LCH': {
      if (isCartesian) {
        const chroma = Math.sqrt(second ** 2 + third ** 2);
        const hue = wrapHue((Math.atan2(third, second) * 180) / Math.PI);
        const l = clamp ? clampValue(first, 0, 100) : first;
        const c = clamp ? clampValue(chroma, 0, MAX_LCH_CHROMA) : chroma;
        return { format: { l, c, h: hue }, alpha };
      }
      // LCH Polar: [l, c, h]
      const l = clamp ? clampValue(first, 0, 100) : first;
      const c = clamp ? clampValue(second, 0, MAX_LCH_CHROMA) : second;
      const hue = wrapHue(third);
      return { format: { l, c, h: hue }, alpha };
    }
    case 'OKLAB': {
      const l = clamp ? clampValue(first, 0, 1) : first;
      return { format: { l, a: second, b: third, format: 'OKLAB' }, alpha };
    }
    case 'OKLCH': {
      if (isCartesian) {
        const chroma = Math.sqrt(second ** 2 + third ** 2);
        const hue = wrapHue((Math.atan2(third, second) * 180) / Math.PI);
        const l = clamp ? clampValue(first, 0, 1) : first;
        const c = clamp ? clampValue(chroma, 0, MAX_OKLCH_CHROMA) : chroma;
        return { format: { l, c, h: hue }, alpha };
      }
      // OKLCH Polar: [l, c, h]
      const l = clamp ? clampValue(first, 0, 1) : first;
      const c = clamp ? clampValue(second, 0, MAX_OKLCH_CHROMA) : second;
      const hue = wrapHue(third);
      return { format: { l, c, h: hue }, alpha };
    }
    case 'RGB':
    default: {
      const r = clamp ? clampValue(first, 0, 255) : first;
      const g = clamp ? clampValue(second, 0, 255) : second;
      const b = clamp ? clampValue(third, 0, 255) : third;
      const rounded: ColorRGB = {
        r: Math.round(r),
        g: Math.round(g),
        b: Math.round(b),
      };
      return { format: rounded, alpha };
    }
  }
}

function hslToRgbUnrounded(color: ColorHSL): ColorRGB {
  const h = (((color.h % 360) + 360) % 360) / 360;
  const s = color.s / 100;
  const l = color.l / 100;

  if (s === 0) {
    const channel = l * 255;
    return { r: channel, g: channel, b: channel };
  }

  const t2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const t1 = 2 * l - t2;
  const t3 = [h + 1 / 3, h, h - 1 / 3];
  const channels = t3.map((t) => {
    let temp = t;
    if (temp < 0) {
      temp += 1;
    }
    if (temp > 1) {
      temp -= 1;
    }
    if (6 * temp < 1) {
      return t1 + (t2 - t1) * 6 * temp;
    }
    if (2 * temp < 1) {
      return t2;
    }
    if (3 * temp < 2) {
      return t1 + (t2 - t1) * (2 / 3 - temp) * 6;
    }
    return t1;
  });

  return {
    r: channels[0] * 255,
    g: channels[1] * 255,
    b: channels[2] * 255,
  };
}

function hsvToRgbUnrounded(color: ColorHSV): ColorRGB {
  const h = (((color.h % 360) + 360) % 360) / 60;
  const s = color.s / 100;
  const v = color.v / 100;
  const c = v * s;
  const x = c * (1 - Math.abs((h % 2) - 1));
  const m = v - c;

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;
  if (0 <= h && h < 1) {
    r1 = c;
    g1 = x;
  } else if (1 <= h && h < 2) {
    r1 = x;
    g1 = c;
  } else if (2 <= h && h < 3) {
    g1 = c;
    b1 = x;
  } else if (3 <= h && h < 4) {
    g1 = x;
    b1 = c;
  } else if (4 <= h && h < 5) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }

  return {
    r: (r1 + m) * 255,
    g: (g1 + m) * 255,
    b: (b1 + m) * 255,
  };
}

function lchToRgbUnrounded(color: ColorLCH): ColorRGB {
  const hRad = (color.h * Math.PI) / 180;
  const a = color.c * Math.cos(hRad);
  const b = color.c * Math.sin(hRad);
  const fy = (color.l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;
  const fx3 = fx ** 3;
  const fy3 = fy ** 3;
  const fz3 = fz ** 3;
  let x = fx3 > LAB_DELTA_CUBED ? fx3 : (fx - LAB_C_OFFSET) / LAB_F_LINEAR_COEFFICIENT;
  let y = fy3 > LAB_DELTA_CUBED ? fy3 : color.l / LAB_KAPPA;
  let z = fz3 > LAB_DELTA_CUBED ? fz3 : (fz - LAB_C_OFFSET) / LAB_F_LINEAR_COEFFICIENT;
  x *= 0.95047;
  y *= 1.0;
  z *= 1.08883;

  const rLin = x * 3.2406 + y * -1.5372 + z * -0.4986;
  const gLin = x * -0.9689 + y * 1.8758 + z * 0.0415;
  const bLin = x * 0.0557 + y * -0.204 + z * 1.057;
  return {
    r: linearChannelToSrgb(rLin, 'SRGB'),
    g: linearChannelToSrgb(gLin, 'SRGB'),
    b: linearChannelToSrgb(bLin, 'SRGB'),
  };
}

function oklchToRgbUnrounded(color: ColorOKLCH): ColorRGB {
  const hRad = (color.h * Math.PI) / 180;
  const a = color.c * Math.cos(hRad);
  const b = color.c * Math.sin(hRad);
  const l_ = color.l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = color.l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = color.l - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  const rLin = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return {
    r: linearChannelToSrgb(rLin, 'SRGB'),
    g: linearChannelToSrgb(gLin, 'SRGB'),
    b: linearChannelToSrgb(bLin, 'SRGB'),
  };
}

function oklabToRgbUnrounded(color: ColorOKLAB): ColorRGB {
  const l_ = color.l + 0.3963377774 * color.a + 0.2158037573 * color.b;
  const m_ = color.l - 0.1055613458 * color.a - 0.0638541728 * color.b;
  const s_ = color.l - 0.0894841775 * color.a - 1.291485548 * color.b;

  const l3 = l_ ** 3;
  const m3 = m_ ** 3;
  const s3 = s_ ** 3;

  const rLin = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const gLin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bLin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  return {
    r: linearChannelToSrgb(rLin, 'SRGB'),
    g: linearChannelToSrgb(gLin, 'SRGB'),
    b: linearChannelToSrgb(bLin, 'SRGB'),
  };
}

function formatToRGB(
  format: ColorRGB | ColorHSL | ColorHSV | ColorLCH | ColorOKLAB | ColorOKLCH,
  space: ColorGradientSpace,
  clamp: boolean
): ColorRGB {
  switch (space) {
    case 'HSL': {
      const { r, g, b } = hslToRgbUnrounded(format as ColorHSL);
      return {
        r: clamp ? clampValue(r, 0, 255) : r,
        g: clamp ? clampValue(g, 0, 255) : g,
        b: clamp ? clampValue(b, 0, 255) : b,
      };
    }
    case 'HSV': {
      const { r, g, b } = hsvToRgbUnrounded(format as ColorHSV);
      return {
        r: clamp ? clampValue(r, 0, 255) : r,
        g: clamp ? clampValue(g, 0, 255) : g,
        b: clamp ? clampValue(b, 0, 255) : b,
      };
    }
    case 'LCH': {
      const { r, g, b } = lchToRgbUnrounded(format as ColorLCH);
      return {
        r: clamp ? clampValue(r, 0, 255) : r,
        g: clamp ? clampValue(g, 0, 255) : g,
        b: clamp ? clampValue(b, 0, 255) : b,
      };
    }
    case 'OKLAB': {
      const { r, g, b } = oklabToRgbUnrounded(format as ColorOKLAB);
      return {
        r: clamp ? clampValue(r, 0, 255) : r,
        g: clamp ? clampValue(g, 0, 255) : g,
        b: clamp ? clampValue(b, 0, 255) : b,
      };
    }
    case 'OKLCH': {
      const { r, g, b } = oklchToRgbUnrounded(format as ColorOKLCH);
      return {
        r: clamp ? clampValue(r, 0, 255) : r,
        g: clamp ? clampValue(g, 0, 255) : g,
        b: clamp ? clampValue(b, 0, 255) : b,
      };
    }
    case 'RGB':
    default:
      return format as ColorRGB;
  }
}

function getStopCount(stops?: number): number {
  if (stops === undefined) {
    return DEFAULT_SCALE_STOPS;
  }
  const rounded = Math.round(stops);
  return Math.max(rounded, MIN_SCALE_STOPS);
}

function interpolateLinearStops({
  clamp,
  easing,
  isCartesian,
  space,
  stopCount,
  stops,
}: {
  clamp: boolean;
  easing: (t: number) => number;
  isCartesian: boolean;
  space: ColorGradientSpace;
  stopCount: number;
  stops: InterpolatableColor[];
}): ColorRGBA[] {
  const segments = stops.length - 1;
  const results: ColorRGBA[] = [];

  for (let i = 0; i < stopCount; i += 1) {
    const segmentPosition = stopCount === 1 ? 0 : i / (stopCount - 1);
    const scaledPosition = clampValue(segmentPosition * segments, 0, segments);
    const segmentIndex = Math.min(Math.floor(scaledPosition), segments - 1);
    const localProgressWithinSegment = scaledPosition - segmentIndex;
    const easedLocalProgress = clampValue(easing(localProgressWithinSegment), 0, 1);

    const start = stops[segmentIndex];
    const end = stops[segmentIndex + 1];
    const values = interpolateLinearVector(start.values, end.values, easedLocalProgress);
    const alpha = interpolateLinearValue(start.alpha, end.alpha, easedLocalProgress);
    const { format, alpha: clampedAlpha } = vectorToFormat(
      { values, alpha },
      space,
      clamp,
      isCartesian
    );
    results.push({ ...formatToRGB(format, space, clamp), a: +clampedAlpha.toFixed(3) });
  }

  return results;
}

function interpolateBezierStops({
  clamp,
  easing,
  isCartesian,
  space,
  stopCount,
  stops,
}: {
  clamp: boolean;
  easing: (t: number) => number;
  isCartesian: boolean;
  space: ColorGradientSpace;
  stopCount: number;
  stops: InterpolatableColor[];
}): ColorRGBA[] {
  const controlPoints = stops.map((stop) => stop.values);
  const alphaPoints = stops.map((stop) => stop.alpha);
  const results: ColorRGBA[] = [];

  for (let i = 0; i < stopCount; i += 1) {
    const rawT = stopCount === 1 ? 0 : i / (stopCount - 1);
    const t = clampValue(easing(clampValue(rawT, 0, 1)), 0, 1);
    const values = interpolateBezier(controlPoints, t);
    const alpha = interpolateBezierScalar(alphaPoints, t);
    const { format, alpha: clampedAlpha } = vectorToFormat(
      { values, alpha },
      space,
      clamp,
      isCartesian
    );
    results.push({ ...formatToRGB(format, space, clamp), a: +clampedAlpha.toFixed(3) });
  }

  return results;
}

function adjustHueStops(
  stops: InterpolatableColor[],
  mode: HueInterpolationMode,
  space: ColorGradientSpace
): InterpolatableColor[] {
  // Identify hue index based on space
  let hueIndex = -1;
  if (space === 'HSL' || space === 'HSV') {
    hueIndex = 0;
  } else if (space === 'LCH' || space === 'OKLCH') {
    hueIndex = 2;
  }

  if (hueIndex === -1 || mode === 'RAW' || mode === 'CARTESIAN') {
    return stops;
  }

  // Clone stops to avoid mutating the original array/objects from colorToVector
  const result = stops.map((stop) => ({ ...stop, values: [...stop.values] }));

  for (let i = 0; i < result.length - 1; i += 1) {
    const start = result[i].values[hueIndex];
    const end = result[i + 1].values[hueIndex];

    let adjustedEnd = end;
    const diff = end - start;

    switch (mode) {
      case 'SHORTEST':
        // If diff > 180, subtract 360 to go the other way (shorter).
        // If diff < -180, add 360.
        if (diff > 180) {
          adjustedEnd -= 360;
        } else if (diff < -180) {
          adjustedEnd += 360;
        }
        break;
      case 'LONGEST':
        // If |diff| < 180, go the other way to make it longer.
        if (Math.abs(diff) < 180 && Math.abs(diff) > 0) {
          // If 0, ambiguous, but 360 is same as 0.
          if (diff >= 0) {
            adjustedEnd -= 360;
          } else {
            adjustedEnd += 360;
          }
        }
        break;
      case 'INCREASING':
        // Ensure end >= start.
        if (adjustedEnd < start) {
          adjustedEnd += 360 * Math.ceil((start - adjustedEnd) / 360);
        }
        break;
      case 'DECREASING':
        // Ensure end <= start
        if (adjustedEnd > start) {
          adjustedEnd -= 360 * Math.ceil((adjustedEnd - start) / 360);
        }
        break;
    }

    result[i + 1].values[hueIndex] = adjustedEnd;
  }

  return result;
}

/**
 * Generate a gradient made up of evenly spaced colors between provided
 * anchors. Gradients can interpolate linearly segment-by-segment or along a
 * bezier curve defined by the supplied anchors. Colors are interpolated in the
 * chosen color space and optionally clamped to that space's valid gamut before
 * being converted back to RGB.
 */
export function createColorGradient(
  colors: readonly Color[],
  options: ColorGradientOptions = {}
): Color[] {
  if (colors.length < MIN_SCALE_STOPS) {
    throw new Error('at least two colors are required to build a gradient');
  }

  const ColorConstructor = colors[0].constructor as typeof Color;
  const stopCount = getStopCount(options.stops);
  const space = (options.space?.toUpperCase() ?? DEFAULT_SPACE) as ColorGradientSpace;
  const interpolation = (options.interpolation?.toUpperCase() ??
    DEFAULT_INTERPOLATION) as ColorGradientInterpolation;
  const clamp = options.clamp ?? true;
  const easing = getEasingFunction(options.easing);
  const isBezier = interpolation === 'BEZIER';

  // Determine Hue Interpolation Mode
  // Default to 'SHORTEST' for Polar spaces, 'CARTESIAN' (legacy) for RGB or if explicit.
  // Actually, legacy for Polar was Cartesian.
  // New default for Polar is Shortest.
  let hueMode = options.hueInterpolationMode?.toUpperCase() as HueInterpolationMode | undefined;

  if (!hueMode) {
    if (isBezier && space === 'LCH') {
      hueMode = 'CARTESIAN';
    } else if (space === 'RGB') {
      hueMode = 'CARTESIAN';
    } else {
      hueMode = 'SHORTEST';
    }
  }

  const isCartesian = hueMode === 'CARTESIAN';

  let vectors = colors.map((color) => colorToVector(color, space, isCartesian));

  // Adjust hues if not Cartesian
  if (!isCartesian) {
    vectors = adjustHueStops(vectors, hueMode, space);
  }

  if (interpolation === 'BEZIER') {
    return interpolateBezierStops({
      clamp,
      easing,
      isCartesian,
      space,
      stopCount,
      stops: vectors,
    }).map((stop) => new ColorConstructor(stop));
  }

  return interpolateLinearStops({
    clamp,
    easing,
    isCartesian,
    space,
    stopCount,
    stops: vectors,
  }).map((stop) => new ColorConstructor(stop));
}
