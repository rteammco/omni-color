import { clampValue } from '../utils';
import { Color } from './color';

type BasicColorSwatchStop = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type ExtendedColorSwatchStop =
  | BasicColorSwatchStop
  | 50
  | 150
  | 250
  | 350
  | 450
  | 550
  | 650
  | 750
  | 850
  | 950;

type SwatchStopDelta = { saturationDelta: number; lightnessDelta: number };
type ColorSwatchStopDeltas<Stop extends number> = Record<Stop, SwatchStopDelta>;

interface BaseColorSwatchStops {
  100: Color; // light
  200: Color;
  300: Color;
  400: Color;
  500: Color; // base color
  600: Color;
  700: Color;
  800: Color;
  900: Color; // dark
}

interface BaseColorSwatch extends BaseColorSwatchStops {
  type: 'BASIC';
  mainStop: BasicColorSwatchStop;
}

interface ExtendedColorSwatchStops extends BaseColorSwatchStops {
  50: Color;
  150: Color;
  250: Color;
  350: Color;
  450: Color;
  550: Color;
  650: Color;
  750: Color;
  850: Color;
  950: Color;
}

export interface ExtendedColorSwatch extends ExtendedColorSwatchStops {
  type: 'EXTENDED';
  mainStop: BasicColorSwatchStop;
}

export type ColorSwatch = BaseColorSwatch | ExtendedColorSwatch;

export interface ColorSwatchOptions {
  /**
   * Include half-stops (`50`, `150`, …, `950`) interpolated between the base swatch stops.
   */
  extended?: boolean;
  /**
   * Center the provided color on the 500 swatch stop instead of positioning it dynamically.
   */
  centerOn500?: boolean;
}

function getAdjustedSaturation(baseSaturation: number, delta: number): number {
  // For cases with no saturation, do not increase it any more since for black or gray
  // colors, that would result in going from grayscale to an unrelated color:
  if (baseSaturation === 0) {
    return baseSaturation;
  }

  return clampValue(baseSaturation + delta, 0, 100);
}

const BASE_COLOR_SWATCH_STOPS: readonly BasicColorSwatchStop[] = [
  100, 200, 300, 400, 500, 600, 700, 800, 900,
];

const EXTENDED_COLOR_SWATCH_STOPS: readonly ExtendedColorSwatchStop[] = [
  50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950,
];

const BASIC_SWATCH_DELTAS: ColorSwatchStopDeltas<BasicColorSwatchStop> = {
  100: { saturationDelta: 20, lightnessDelta: 40 },
  200: { saturationDelta: 15, lightnessDelta: 30 },
  300: { saturationDelta: 10, lightnessDelta: 20 },
  400: { saturationDelta: 5, lightnessDelta: 10 },
  500: { saturationDelta: 0, lightnessDelta: 0 },
  600: { saturationDelta: -5, lightnessDelta: -10 },
  700: { saturationDelta: -10, lightnessDelta: -20 },
  800: { saturationDelta: -15, lightnessDelta: -30 },
  900: { saturationDelta: -20, lightnessDelta: -40 },
};

const EXTENDED_SWATCH_DELTAS: ColorSwatchStopDeltas<ExtendedColorSwatchStop> = {
  50: { saturationDelta: 22.5, lightnessDelta: 45 },
  100: { saturationDelta: 20, lightnessDelta: 40 },
  150: { saturationDelta: 17.5, lightnessDelta: 35 },
  200: { saturationDelta: 15, lightnessDelta: 30 },
  250: { saturationDelta: 12.5, lightnessDelta: 25 },
  300: { saturationDelta: 10, lightnessDelta: 20 },
  350: { saturationDelta: 7.5, lightnessDelta: 15 },
  400: { saturationDelta: 5, lightnessDelta: 10 },
  450: { saturationDelta: 2.5, lightnessDelta: 5 },
  500: { saturationDelta: 0, lightnessDelta: 0 },
  550: { saturationDelta: -2.5, lightnessDelta: -5 },
  600: { saturationDelta: -5, lightnessDelta: -10 },
  650: { saturationDelta: -7.5, lightnessDelta: -15 },
  700: { saturationDelta: -10, lightnessDelta: -20 },
  750: { saturationDelta: -12.5, lightnessDelta: -25 },
  800: { saturationDelta: -15, lightnessDelta: -30 },
  850: { saturationDelta: -17.5, lightnessDelta: -35 },
  900: { saturationDelta: -20, lightnessDelta: -40 },
  950: { saturationDelta: -22.5, lightnessDelta: -45 },
};

function isPureBlackOrWhite(baseColor: Color): boolean {
  const { r, g, b } = baseColor.toRGB();
  const isBlack = r === 0 && g === 0 && b === 0;
  const isWhite = r === 255 && g === 255 && b === 255;

  return isBlack || isWhite;
}

function getMainStop(baseColor: Color, shouldCenterOn500: boolean): BasicColorSwatchStop {
  if (shouldCenterOn500 || isPureBlackOrWhite(baseColor)) {
    return 500;
  }

  const { l } = baseColor.toHSL();
  const stopIndex = Math.round((1 - l / 100) * 8);
  const stop = (100 + stopIndex * 100) as BasicColorSwatchStop;

  return clampValue(stop, 100, 900) as BasicColorSwatchStop;
}

function getSwatchStopDelta<Stop extends number>(
  stop: Stop,
  baseStop: BasicColorSwatchStop,
  deltas: Record<number, SwatchStopDelta>
): SwatchStopDelta {
  const baseDelta = deltas[baseStop];
  const stopDelta = deltas[stop];

  return {
    saturationDelta: stopDelta.saturationDelta - baseDelta.saturationDelta,
    lightnessDelta: stopDelta.lightnessDelta - baseDelta.lightnessDelta,
  };
}

function createSwatch<Stop extends number>({
  baseColor,
  deltas,
  mainStop,
  stops,
  type,
}: {
  baseColor: Color;
  deltas: ColorSwatchStopDeltas<Stop>;
  mainStop: BasicColorSwatchStop;
  stops: readonly Stop[];
  type: ColorSwatch['type'];
}): ColorSwatch {
  const { h: baseH, s: baseS, l: baseL } = baseColor.toHSL();

  const swatchStops = stops.reduce<Record<number, Color>>((acc, stop) => {
    const delta = getSwatchStopDelta(stop, mainStop, deltas);

    acc[stop] =
      stop === mainStop
        ? baseColor.clone()
        : new Color({
            h: baseH,
            s: getAdjustedSaturation(baseS, delta.saturationDelta),
            l: clampValue(baseL + delta.lightnessDelta, 0, 100),
          });

    return acc;
  }, {});

  return {
    type,
    mainStop,
    ...(swatchStops as Record<Stop, Color>),
  } as ColorSwatch;
}

function getBaseColorSwatch(baseColor: Color, mainStop: BasicColorSwatchStop): BaseColorSwatch {
  return createSwatch({
    baseColor,
    deltas: BASIC_SWATCH_DELTAS,
    mainStop,
    stops: BASE_COLOR_SWATCH_STOPS,
    type: 'BASIC',
  }) as BaseColorSwatch;
}

function getExtendedColorSwatch(
  baseColor: Color,
  mainStop: BasicColorSwatchStop
): ExtendedColorSwatch {
  return createSwatch({
    baseColor,
    deltas: EXTENDED_SWATCH_DELTAS,
    mainStop,
    stops: EXTENDED_COLOR_SWATCH_STOPS,
    type: 'EXTENDED',
  }) as ExtendedColorSwatch;
}

export function getColorSwatch(
  baseColor: Color,
  options?: ColorSwatchOptions & { extended: true }
): ExtendedColorSwatch;
export function getColorSwatch(baseColor: Color, options?: ColorSwatchOptions): ColorSwatch;
export function getColorSwatch(baseColor: Color, options: ColorSwatchOptions = {}): ColorSwatch {
  const mainStop = getMainStop(baseColor, options.centerOn500 ?? false);

  if (options.extended) {
    return getExtendedColorSwatch(baseColor, mainStop);
  }

  return getBaseColorSwatch(baseColor, mainStop);
}
