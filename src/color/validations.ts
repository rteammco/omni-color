import type {
  ColorCMYK,
  ColorFormat,
  ColorHSL,
  ColorHSLA,
  ColorHSV,
  ColorHSVA,
  ColorHWB,
  ColorHWBA,
  ColorLAB,
  ColorLCH,
  ColorOKLAB,
  ColorOKLCH,
  ColorRGB,
  ColorRGBA,
} from './formats';
import { getColorFormatType } from './formats';

const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

function isValidHexColor(color: string): boolean {
  return HEX_COLOR_REGEX.test(color);
}

function isValueInRangeInclusive(value: number, min: number, max: number): boolean {
  return typeof value === 'number' && value >= min && value <= max;
}

function isValidAlphaValue(value: number | undefined): boolean {
  return value === undefined || (typeof value === 'number' && value >= 0 && value <= 1);
}

function isValidRGBColor(color: ColorRGB): boolean {
  const { r, g, b } = color;
  return (
    isValueInRangeInclusive(r, 0, 255) &&
    isValueInRangeInclusive(g, 0, 255) &&
    isValueInRangeInclusive(b, 0, 255)
  );
}

function isValidRGBAColor(color: ColorRGBA): boolean {
  return isValidRGBColor(color) && isValidAlphaValue(color.a);
}

function isValidHSLColor(color: ColorHSL): boolean {
  const { h, s, l } = color;
  return (
    isValueInRangeInclusive(h, 0, 360) &&
    isValueInRangeInclusive(s, 0, 100) &&
    isValueInRangeInclusive(l, 0, 100)
  );
}

function isValidHSLAColor(color: ColorHSLA): boolean {
  return isValidHSLColor(color) && isValidAlphaValue(color.a);
}

function isValidHSVColor(color: ColorHSV): boolean {
  const { h, s, v } = color;
  return (
    isValueInRangeInclusive(h, 0, 360) &&
    isValueInRangeInclusive(s, 0, 100) &&
    isValueInRangeInclusive(v, 0, 100)
  );
}

function isValidHSVAColor(color: ColorHSVA): boolean {
  return isValidHSVColor(color) && isValidAlphaValue(color.a);
}

function isValidHWBColor(color: ColorHWB): boolean {
  const { h, w, b } = color;
  return (
    isValueInRangeInclusive(h, 0, 360) &&
    isValueInRangeInclusive(w, 0, 100) &&
    isValueInRangeInclusive(b, 0, 100)
  );
}

function isValidHWBAColor(color: ColorHWBA): boolean {
  return isValidHWBColor(color) && isValidAlphaValue(color.a);
}

function isValidCMYKColor(color: ColorCMYK): boolean {
  const { c, m, y, k } = color;
  const check = (value: number) => typeof value === 'number' && value >= 0 && value <= 100;
  return [c, m, y, k].every(check);
}

function isValidLABColor(color: ColorLAB): boolean {
  const { l, a, b } = color;
  return (
    typeof l === 'number' &&
    l >= 0 &&
    l <= 100 &&
    typeof a === 'number' &&
    Number.isFinite(a) &&
    typeof b === 'number' &&
    Number.isFinite(b)
  );
}

function isValidOKLABColor(color: ColorOKLAB): boolean {
  const { l, a, b } = color;
  return (
    typeof l === 'number' &&
    l >= 0 &&
    l <= 1 &&
    typeof a === 'number' &&
    Number.isFinite(a) &&
    typeof b === 'number' &&
    Number.isFinite(b)
  );
}

function isValidLCHColor(color: ColorLCH): boolean {
  const { l, c, h } = color;
  return (
    typeof l === 'number' &&
    l >= 0 &&
    l <= 100 &&
    typeof c === 'number' &&
    c >= 0 &&
    typeof h === 'number' &&
    h >= 0 &&
    h <= 360
  );
}

function isValidOKLCHColor(color: ColorOKLCH): boolean {
  const { l, c, h } = color;
  return (
    typeof l === 'number' &&
    l >= 0 &&
    l <= 1 &&
    typeof c === 'number' &&
    c >= 0 &&
    typeof h === 'number' &&
    h >= 0 &&
    h <= 360
  );
}

export function validateColorOrThrow(color?: ColorFormat | null): void {
  if (color === undefined) {
    throw new Error('color is undefined');
  }
  if (color === null) {
    throw new Error('color is null');
  }

  const { formatType, value } = getColorFormatType(color);
  switch (formatType) {
    case 'HEX':
    case 'HEX8':
      if (!isValidHexColor(value)) {
        throw new Error(`invalid hex color: "${value}"`);
      }
      break;
    case 'RGB':
      if (!isValidRGBColor(value)) {
        throw new Error(`invalid RGB color: "${JSON.stringify(value)}"`);
      }
      break;
    case 'RGBA':
      if (!isValidRGBAColor(value)) {
        throw new Error(`invalid RGBA color: "${JSON.stringify(value)}"`);
      }
      break;
    case 'HSL':
      if (!isValidHSLColor(value)) {
        throw new Error(`invalid HSL color: "${JSON.stringify(value)}"`);
      }
      break;
    case 'HSLA':
      if (!isValidHSLAColor(value)) {
        throw new Error(`invalid HSLA color: "${JSON.stringify(value)}"`);
      }
      break;
    case 'HSV':
      if (!isValidHSVColor(value)) {
        throw new Error(`invalid HSV color: "${JSON.stringify(value)}"`);
      }
      break;
    case 'HSVA':
      if (!isValidHSVAColor(value)) {
        throw new Error(`invalid HSVA color: "${JSON.stringify(value)}"`);
      }
      break;
    case 'HWB':
      if (!isValidHWBColor(value)) {
        throw new Error(`invalid HWB color: "${JSON.stringify(value)}"`);
      }
      break;
    case 'HWBA':
      if (!isValidHWBAColor(value)) {
        throw new Error(`invalid HWBA color: "${JSON.stringify(value)}"`);
      }
      break;
    case 'CMYK':
      if (!isValidCMYKColor(value)) {
        throw new Error(`invalid CMYK color: "${JSON.stringify(value)}"`);
      }
      break;
    case 'LAB':
      if (!isValidLABColor(value)) {
        throw new Error(`invalid LAB color: "${JSON.stringify(value)}"`);
      }
      break;
    case 'OKLAB':
      if (!isValidOKLABColor(value)) {
        throw new Error(`invalid OKLAB color: "${JSON.stringify(value)}"`);
      }
      break;
    case 'LCH':
      if (!isValidLCHColor(value)) {
        throw new Error(`invalid LCH color: "${JSON.stringify(value)}"`);
      }
      break;
    case 'OKLCH':
      if (!isValidOKLCHColor(value)) {
        throw new Error(`invalid OKLCH color: "${JSON.stringify(value)}"`);
      }
      break;
    default:
      throw new Error(`unknown color format: "${formatType}"`);
  }
}
