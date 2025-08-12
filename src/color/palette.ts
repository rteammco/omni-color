import { getConstrainedValue } from '../utils';
import { Color } from './color';

export interface PaletteColorVariations {
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

export function getPaletteColorVariations(baseColor: Color): PaletteColorVariations {
  const { h: baseH, s: baseS, l: baseL } = baseColor.toHSL();
  return {
    100: new Color({
      h: baseH,
      s: getConstrainedValue(baseS + 20, 0, 100),
      l: getConstrainedValue(baseL + 40, 0, 100),
    }),
    200: new Color({
      h: baseH,
      s: getConstrainedValue(baseS + 15, 0, 100),
      l: getConstrainedValue(baseL + 30, 0, 100),
    }),
    300: new Color({
      h: baseH,
      s: getConstrainedValue(baseS + 10, 0, 100),
      l: getConstrainedValue(baseL + 20, 0, 100),
    }),
    400: new Color({
      h: baseH,
      s: getConstrainedValue(baseS + 5, 0, 100),
      l: getConstrainedValue(baseL + 10, 0, 100),
    }),
    500: baseColor.clone(),
    600: new Color({
      h: baseH,
      s: getConstrainedValue(baseS - 5, 0, 100),
      l: getConstrainedValue(baseL - 10, 0, 100),
    }),
    700: new Color({
      h: baseH,
      s: getConstrainedValue(baseS - 10, 0, 100),
      l: getConstrainedValue(baseL - 20, 0, 100),
    }),
    800: new Color({
      h: baseH,
      s: getConstrainedValue(baseS - 15, 0, 100),
      l: getConstrainedValue(baseL - 30, 0, 100),
    }),
    900: new Color({
      h: baseH,
      s: getConstrainedValue(baseS - 20, 0, 100),
      l: getConstrainedValue(baseL - 40, 0, 100),
    }),
  };
}
