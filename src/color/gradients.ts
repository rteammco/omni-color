import { clampValue } from '../utils';
import type { Color } from './color';
import { toRGB } from './conversions';
import type {
  ColorHSL,
  ColorHSV,
  ColorLCH,
  ColorOKLCH,
  ColorRGB,
  ColorRGBA,
} from './formats';

export type ColorGradientSpace = 'RGB' | 'HSL' | 'HSV' | 'LCH' | 'OKLCH';
export type ColorGradientInterpolation = 'LINEAR' | 'BEZIER';
export type ColorGradientEasing =
  | 'LINEAR'
  | 'EASE_IN'
  | 'EASE_OUT'
  | 'EASE_IN_OUT'
  | ((t: number) => number);

export interface ColorGradientOptions {
  /**
   * Number of colors to generate, including the input anchors.
   * Must be at least 2.
   */
  stops?: number;
  /** Color space in which interpolation will occur. */
  space?: ColorGradientSpace;
  /**
   * Interpolation style. Linear moves stop-to-stop evenly; bezier uses
   * the provided colors as control points for a bezier curve.
   */
  interpolation?: ColorGradientInterpolation;
  /** Easing to apply across the 0–1 range of the scale. */
  easing?: ColorGradientEasing;
  /**
   * Clamp the resulting values to the target color space range before
   * converting back to sRGB.
   */
  clamp?: boolean;
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

  switch (easing) {
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

function getHSLVector(color: Color, alpha: number): InterpolatableColor {
  const { h, s, l } = color.toHSL();
  const rad = (h * Math.PI) / 180;
  return { values: [Math.cos(rad) * s, Math.sin(rad) * s, l], alpha };
}

function getHSVVector(color: Color, alpha: number): InterpolatableColor {
  const { h, s, v } = color.toHSV();
  const rad = (h * Math.PI) / 180;
  return { values: [Math.cos(rad) * s, Math.sin(rad) * s, v], alpha };
}

function getLCHVector(color: Color, alpha: number): InterpolatableColor {
  const { l, c, h } = color.toLCH();
  const rad = (h * Math.PI) / 180;
  return { values: [l, Math.cos(rad) * c, Math.sin(rad) * c], alpha };
}

function getOKLCHVector(color: Color, alpha: number): InterpolatableColor {
  const { l, c, h } = color.toOKLCH();
  const rad = (h * Math.PI) / 180;
  return { values: [l, Math.cos(rad) * c, Math.sin(rad) * c], alpha };
}

/**
 * Convert a color into an interpolatable vector for the target color space
 * while preserving alpha separately.
 */
function colorToVector(color: Color, space: ColorGradientSpace): InterpolatableColor {
  const rgba = color.toRGBA();
  const alpha = rgba.a ?? 1;
  switch (space) {
    case 'HSL':
      return getHSLVector(color, alpha);
    case 'HSV':
      return getHSVVector(color, alpha);
    case 'LCH':
      return getLCHVector(color, alpha);
    case 'OKLCH':
      return getOKLCHVector(color, alpha);
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
  clamp: boolean
): { format: ColorRGB | ColorHSL | ColorHSV | ColorLCH | ColorOKLCH; alpha: number } {
  const [first, second, third] = vector.values;
  const alpha = clamp ? clampValue(vector.alpha, 0, 1) : vector.alpha;

  switch (space) {
    case 'HSL': {
      const saturation = Math.sqrt(second ** 2 + first ** 2);
      const hue = wrapHue((Math.atan2(second, first) * 180) / Math.PI);
      const l = clamp ? clampValue(third, 0, 100) : third;
      const s = clamp ? clampValue(saturation, 0, 100) : saturation;
      return { format: { h: hue, s, l }, alpha };
    }
    case 'HSV': {
      const saturation = Math.sqrt(second ** 2 + first ** 2);
      const hue = wrapHue((Math.atan2(second, first) * 180) / Math.PI);
      const v = clamp ? clampValue(third, 0, 100) : third;
      const s = clamp ? clampValue(saturation, 0, 100) : saturation;
      return { format: { h: hue, s, v }, alpha };
    }
    case 'LCH': {
      const chroma = Math.sqrt(second ** 2 + third ** 2);
      const hue = wrapHue((Math.atan2(third, second) * 180) / Math.PI);
      const l = clamp ? clampValue(first, 0, 100) : first;
      const c = clamp ? clampValue(chroma, 0, MAX_LCH_CHROMA) : chroma;
      return { format: { l, c, h: hue }, alpha };
    }
    case 'OKLCH': {
      const chroma = Math.sqrt(second ** 2 + third ** 2);
      const hue = wrapHue((Math.atan2(third, second) * 180) / Math.PI);
      const l = clamp ? clampValue(first, 0, 1) : first;
      const c = clamp ? clampValue(chroma, 0, MAX_OKLCH_CHROMA) : chroma;
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

function getStopCount(stops?: number): number {
  if (stops === undefined) {
    return DEFAULT_SCALE_STOPS;
  }
  const rounded = Math.round(stops);
  return Math.max(rounded, MIN_SCALE_STOPS);
}

function interpolateLinearStops(
  stops: InterpolatableColor[],
  easing: (t: number) => number,
  space: ColorGradientSpace,
  clamp: boolean,
  stopCount: number
): ColorRGBA[] {
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
    const { format, alpha: clampedAlpha } = vectorToFormat({ values, alpha }, space, clamp);
    results.push({ ...toRGB(format), a: +clampedAlpha.toFixed(3) });
  }

  return results;
}

function interpolateBezierStops(
  stops: InterpolatableColor[],
  easing: (t: number) => number,
  space: ColorGradientSpace,
  clamp: boolean,
  stopCount: number
): ColorRGBA[] {
  const controlPoints = stops.map((stop) => stop.values);
  const alphaPoints = stops.map((stop) => stop.alpha);
  const results: ColorRGBA[] = [];

  for (let i = 0; i < stopCount; i += 1) {
    const rawT = stopCount === 1 ? 0 : i / (stopCount - 1);
    const t = clampValue(easing(clampValue(rawT, 0, 1)), 0, 1);
    const values = interpolateBezier(controlPoints, t);
    const alpha = interpolateBezierScalar(alphaPoints, t);
    const { format, alpha: clampedAlpha } = vectorToFormat({ values, alpha }, space, clamp);
    results.push({ ...toRGB(format), a: +clampedAlpha.toFixed(3) });
  }

  return results;
}

/**
 * Generate a gradient made up of evenly spaced colors between provided
 * anchors. Gradients can interpolate linearly segment-by-segment or along a
 * bezier curve defined by the supplied anchors. Colors are interpolated in the
 * chosen color space and optionally clamped to that space's valid gamut before
 * being converted back to RGB.
 */
export function createColorGradient(colors: Color[], options: ColorGradientOptions = {}): Color[] {
  if (colors.length < MIN_SCALE_STOPS) {
    throw new Error('at least two colors are required to build a gradient');
  }

  const ColorConstructor = colors[0].constructor as typeof Color;
  const stopCount = getStopCount(options.stops);
  const space = options.space ?? DEFAULT_SPACE;
  const interpolation = options.interpolation ?? DEFAULT_INTERPOLATION;
  const clamp = options.clamp ?? true;
  const easing = getEasingFunction(options.easing);

  const vectors = colors.map((color) => colorToVector(color, space));

  if (interpolation === 'BEZIER') {
    return interpolateBezierStops(vectors, easing, space, clamp, stopCount).map(
      (stop) => new ColorConstructor(stop)
    );
  }

  return interpolateLinearStops(vectors, easing, space, clamp, stopCount).map(
    (stop) => new ColorConstructor(stop)
  );
}
