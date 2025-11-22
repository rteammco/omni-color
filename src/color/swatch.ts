import { clampValue } from '../utils';
import { Color } from './color';

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
}

export type ColorSwatch = BaseColorSwatch | ExtendedColorSwatch;

export interface ColorSwatchOptions {
  extended?: boolean;
}

function getAdjustedSaturation(baseSaturation: number, delta: number): number {
  // For cases with no saturation, do not increase it any more since for black or gray
  // colors, that would result in going from grayscale to an unrelated color:
  if (baseSaturation === 0) {
    return baseSaturation;
  }

  return clampValue(baseSaturation + delta, 0, 100);
}

function getBaseColorSwatch(baseColor: Color): BaseColorSwatch {
  const { h: baseH, s: baseS, l: baseL } = baseColor.toHSL();

  return {
    type: 'BASIC',
    100: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, 20),
      l: clampValue(baseL + 40, 0, 100),
    }),
    200: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, 15),
      l: clampValue(baseL + 30, 0, 100),
    }),
    300: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, 10),
      l: clampValue(baseL + 20, 0, 100),
    }),
    400: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, 5),
      l: clampValue(baseL + 10, 0, 100),
    }),
    500: baseColor.clone(),
    600: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, -5),
      l: clampValue(baseL - 10, 0, 100),
    }),
    700: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, -10),
      l: clampValue(baseL - 20, 0, 100),
    }),
    800: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, -15),
      l: clampValue(baseL - 30, 0, 100),
    }),
    900: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, -20),
      l: clampValue(baseL - 40, 0, 100),
    }),
  };
}

function getExtendedColorSwatch(baseColor: Color): ExtendedColorSwatch {
  const { h: baseH, s: baseS, l: baseL } = baseColor.toHSL();

  return {
    type: 'EXTENDED',
    50: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, 22.5),
      l: clampValue(baseL + 45, 0, 100),
    }),
    100: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, 20),
      l: clampValue(baseL + 40, 0, 100),
    }),
    150: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, 17.5),
      l: clampValue(baseL + 35, 0, 100),
    }),
    200: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, 15),
      l: clampValue(baseL + 30, 0, 100),
    }),
    250: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, 12.5),
      l: clampValue(baseL + 25, 0, 100),
    }),
    300: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, 10),
      l: clampValue(baseL + 20, 0, 100),
    }),
    350: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, 7.5),
      l: clampValue(baseL + 15, 0, 100),
    }),
    400: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, 5),
      l: clampValue(baseL + 10, 0, 100),
    }),
    450: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, 2.5),
      l: clampValue(baseL + 5, 0, 100),
    }),
    500: baseColor.clone(),
    550: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, -2.5),
      l: clampValue(baseL - 5, 0, 100),
    }),
    600: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, -5),
      l: clampValue(baseL - 10, 0, 100),
    }),
    650: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, -7.5),
      l: clampValue(baseL - 15, 0, 100),
    }),
    700: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, -10),
      l: clampValue(baseL - 20, 0, 100),
    }),
    750: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, -12.5),
      l: clampValue(baseL - 25, 0, 100),
    }),
    800: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, -15),
      l: clampValue(baseL - 30, 0, 100),
    }),
    850: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, -17.5),
      l: clampValue(baseL - 35, 0, 100),
    }),
    900: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, -20),
      l: clampValue(baseL - 40, 0, 100),
    }),
    950: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, -22.5),
      l: clampValue(baseL - 45, 0, 100),
    }),
  };
}

export function getColorSwatch(
  baseColor: Color,
  options: ColorSwatchOptions & { extended: true }
): ExtendedColorSwatch;
export function getColorSwatch(baseColor: Color, options?: ColorSwatchOptions): ColorSwatch;
export function getColorSwatch(baseColor: Color, options: ColorSwatchOptions = {}): ColorSwatch {
  if (options.extended) {
    return getExtendedColorSwatch(baseColor);
  }

  return getBaseColorSwatch(baseColor);
}
