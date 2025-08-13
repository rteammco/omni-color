import { getConstrainedValue } from '../utils';
import { Color } from './color';

export interface ColorSwatch {
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

function getAdjustedSaturation(baseSaturation: number, delta: number): number {
  // For cases with no saturation, do not increase it any more since for black or gray
  // colors, that would result in going from grayscale to an unrelated color:
  if (baseSaturation === 0) {
    return baseSaturation;
  }

  return getConstrainedValue(baseSaturation + delta, 0, 100);
}

export function getColorSwatch(baseColor: Color): ColorSwatch {
  const { h: baseH, s: baseS, l: baseL } = baseColor.toHSL();
  return {
    100: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, 20),
      l: getConstrainedValue(baseL + 40, 0, 100),
    }),
    200: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, 15),
      l: getConstrainedValue(baseL + 30, 0, 100),
    }),
    300: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, 10),
      l: getConstrainedValue(baseL + 20, 0, 100),
    }),
    400: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, 5),
      l: getConstrainedValue(baseL + 10, 0, 100),
    }),
    500: baseColor.clone(),
    600: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, -5),
      l: getConstrainedValue(baseL - 10, 0, 100),
    }),
    700: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, -10),
      l: getConstrainedValue(baseL - 20, 0, 100),
    }),
    800: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, -15),
      l: getConstrainedValue(baseL - 30, 0, 100),
    }),
    900: new Color({
      h: baseH,
      s: getAdjustedSaturation(baseS, -20),
      l: getConstrainedValue(baseL - 40, 0, 100),
    }),
  };
}
