import { clampValue } from '../utils';
import type { Color } from './color';
import { toRGB } from './conversions';
import type { ColorHSL, ColorHSV, ColorLCH, ColorOKLCH, ColorRGB, ColorRGBA } from './formats';

export type ColorGradientSpace = 'RGB' | 'HSL' | 'HSV' | 'LCH' | 'OKLCH';
export type ColorGradientInterpolation = 'LINEAR' | 'BEZIER';
export type ColorGradientEasing =
  | 'LINEAR'
  | 'EASE_IN'
  | 'EASE_OUT'
  | 'EASE_IN_OUT'
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
  /**
   * Strategy for interpolating hue angles in polar color spaces (HSL, HSV, LCH, OKLCH).
   * Defaults to 'SHORTEST' for polar spaces, enabling saturation-preserving gradients.
   * Set to 'CARTESIAN' to use the legacy method (converting to x/y coordinates),
   * which may cause desaturation in the middle of the gradient.
   * Ignored for RGB space.
   */
  hueInterpolationMode?: HueInterpolationMode;
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

function getHSLVector(color: Color, alpha: number, isCartesian: boolean): InterpolatableColor {
  const { h, s, l } = color.toHSL();
  if (isCartesian) {
    const rad = (h * Math.PI) / 180;
    return { values: [Math.cos(rad) * s, Math.sin(rad) * s, l], alpha };
  }
  return { values: [h, s, l], alpha };
}

function getHSVVector(color: Color, alpha: number, isCartesian: boolean): InterpolatableColor {
  const { h, s, v } = color.toHSV();
  if (isCartesian) {
    const rad = (h * Math.PI) / 180;
    return { values: [Math.cos(rad) * s, Math.sin(rad) * s, v], alpha };
  }
  return { values: [h, s, v], alpha };
}

function getLCHVector(color: Color, alpha: number, isCartesian: boolean): InterpolatableColor {
  const { l, c, h } = color.toLCH();
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
): { format: ColorRGB | ColorHSL | ColorHSV | ColorLCH | ColorOKLCH; alpha: number } {
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
    results.push({ ...toRGB(format), a: +clampedAlpha.toFixed(3) });
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
    results.push({ ...toRGB(format), a: +clampedAlpha.toFixed(3) });
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

  // Determine Hue Interpolation Mode
  // Default to 'SHORTEST' for Polar spaces, 'CARTESIAN' (legacy) for RGB or if explicit.
  // Actually, legacy for Polar was Cartesian.
  // New default for Polar is Shortest.
  let hueMode = options.hueInterpolationMode;
  if (!hueMode) {
    if (space === 'RGB') {
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
