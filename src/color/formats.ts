import type { CaseInsensitive } from '../utils';
import type { ColorStringOptions } from './colorSpaces';
import { convertRGBToColorSpaceValues, resolveColorSpace } from './colorSpaces';

export type ColorHex = `#${string}`;

export interface ColorRGB {
  r: number; // 0-255 (fractional values allowed internally)
  g: number; // 0-255 (fractional values allowed internally)
  b: number; // 0-255 (fractional values allowed internally)
}

export interface ColorRGBA extends ColorRGB {
  a: number; // 0-1
}

export interface ColorHSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface ColorHSLA extends ColorHSL {
  a: number; // 0-1
}

export interface ColorHSV {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

export interface ColorHSVA extends ColorHSV {
  a: number; // 0-1
}

export interface ColorHWB {
  h: number; // 0-360
  w: number; // 0-100
  b: number; // 0-100
}

export interface ColorHWBA extends ColorHWB {
  a: number; // 0-1
}

export interface ColorCMYK {
  c: number; // 0-100
  m: number; // 0-100
  y: number; // 0-100
  k: number; // 0-100
}

export interface ColorLAB {
  l: number; // 0-100
  a: number; // unbounded
  b: number; // unbounded
  // Internal hint used for format disambiguation.
  format?: CaseInsensitive<'LAB'>;
}

export interface ColorOKLAB {
  l: number; // 0-1
  a: number; // unbounded
  b: number; // unbounded
  // Internal hint used for format disambiguation.
  format?: CaseInsensitive<'OKLAB'>;
}

export interface ColorLCH {
  l: number; // 0-100
  c: number; // >=0
  h: number; // 0-360
  // Internal hint used for format disambiguation.
  format?: CaseInsensitive<'LCH'>;
}

export interface ColorOKLCH {
  l: number; // 0-1
  c: number; // >=0
  h: number; // 0-360
  // Internal hint used for format disambiguation.
  format?: CaseInsensitive<'OKLCH'>;
}

export type ColorFormat =
  | ColorHex
  | ColorRGB
  | ColorRGBA
  | ColorHSL
  | ColorHSLA
  | ColorHSV
  | ColorHSVA
  | ColorHWB
  | ColorHWBA
  | ColorCMYK
  | ColorLAB
  | ColorOKLAB
  | ColorLCH
  | ColorOKLCH;

type ColorFormatTypeAndValue =
  | { formatType: 'HEX'; value: ColorHex }
  | { formatType: 'HEX8'; value: ColorHex }
  | { formatType: 'RGB'; value: ColorRGB }
  | { formatType: 'RGBA'; value: ColorRGBA }
  | { formatType: 'HSL'; value: ColorHSL }
  | { formatType: 'HSLA'; value: ColorHSLA }
  | { formatType: 'HSV'; value: ColorHSV }
  | { formatType: 'HSVA'; value: ColorHSVA }
  | { formatType: 'HWB'; value: ColorHWB }
  | { formatType: 'HWBA'; value: ColorHWBA }
  | { formatType: 'CMYK'; value: ColorCMYK }
  | { formatType: 'LAB'; value: ColorLAB }
  | { formatType: 'OKLAB'; value: ColorOKLAB }
  | { formatType: 'LCH'; value: ColorLCH }
  | { formatType: 'OKLCH'; value: ColorOKLCH };

function getHexColorFormatType(color: ColorHex): ColorFormatTypeAndValue {
  const colorLowerCase = color.toLowerCase();
  if (colorLowerCase.startsWith('#')) {
    if (colorLowerCase.length === 4) {
      return {
        formatType: 'HEX',
        value:
          `#${colorLowerCase[1]}${colorLowerCase[1]}${colorLowerCase[2]}${colorLowerCase[2]}${colorLowerCase[3]}${colorLowerCase[3]}` as ColorHex,
      };
    }
    if (colorLowerCase.length === 5) {
      return {
        formatType: 'HEX8',
        value:
          `#${colorLowerCase[1]}${colorLowerCase[1]}${colorLowerCase[2]}${colorLowerCase[2]}${colorLowerCase[3]}${colorLowerCase[3]}${colorLowerCase[4]}${colorLowerCase[4]}` as ColorHex,
      };
    }
    if (colorLowerCase.length === 7) {
      return { formatType: 'HEX', value: colorLowerCase as ColorHex };
    }
    if (colorLowerCase.length === 9) {
      return { formatType: 'HEX8', value: colorLowerCase as ColorHex };
    }
  }
  throw new Error(`unknown color format: "${JSON.stringify(color)}"`);
}

export function getColorFormatType(color: ColorFormat): ColorFormatTypeAndValue {
  if (typeof color === 'string') {
    return getHexColorFormatType(color);
  }

  if ('c' in color && 'm' in color && 'y' in color && 'k' in color) {
    return { formatType: 'CMYK', value: color };
  }

  if ('h' in color && 's' in color && 'v' in color) {
    return 'a' in color
      ? { formatType: 'HSVA', value: color }
      : { formatType: 'HSV', value: color };
  }

  if ('h' in color && 's' in color && 'l' in color) {
    return 'a' in color
      ? { formatType: 'HSLA', value: color }
      : { formatType: 'HSL', value: color };
  }

  if ('h' in color && 'w' in color && 'b' in color) {
    return 'a' in color
      ? { formatType: 'HWBA', value: color }
      : { formatType: 'HWB', value: color };
  }

  if ('h' in color && 'l' in color && 'c' in color) {
    const { l, c, h } = color;
    const formatHint = 'format' in color ? color.format?.toUpperCase() : undefined;

    if (formatHint === 'OKLCH') {
      const oklch: ColorOKLCH = { l, c, h, format: 'OKLCH' };
      return { formatType: 'OKLCH', value: oklch };
    }

    if (formatHint === 'LCH') {
      const lch: ColorLCH = { l, c, h, format: 'LCH' };
      return { formatType: 'LCH', value: lch };
    }

    const isValidHue = h >= 0 && h <= 360;
    const isOklchLightness = l >= 0 && l <= 1;
    if (isOklchLightness && isValidHue) {
      const oklch: ColorOKLCH = { l, c, h, format: 'OKLCH' };
      return { formatType: 'OKLCH', value: oklch };
    }

    const isLchLightness = l >= 0 && l <= 100;
    if (isLchLightness && isValidHue) {
      const lch: ColorLCH = { l, c, h, format: 'LCH' };
      return { formatType: 'LCH', value: lch };
    }

    if (l <= 1) {
      const oklch: ColorOKLCH = { l, c, h, format: 'OKLCH' };
      return { formatType: 'OKLCH', value: oklch };
    }

    const lch: ColorLCH = { l, c, h, format: 'LCH' };
    return { formatType: 'LCH', value: lch };
  }

  if ('r' in color && 'g' in color && 'b' in color) {
    return 'a' in color
      ? { formatType: 'RGBA', value: color }
      : { formatType: 'RGB', value: color };
  }

  if ('l' in color && 'a' in color && 'b' in color) {
    const { l, a, b } = color;
    const formatHint = 'format' in color ? color.format?.toUpperCase() : undefined;

    if (formatHint === 'OKLAB') {
      const oklab: ColorOKLAB = { l, a, b, format: 'OKLAB' };
      return { formatType: 'OKLAB', value: oklab };
    }

    if (formatHint === 'LAB') {
      const lab: ColorLAB = { l, a, b, format: 'LAB' };
      return { formatType: 'LAB', value: lab };
    }

    const isOklabLightness = l >= 0 && l <= 1;
    if (isOklabLightness) {
      const oklab: ColorOKLAB = { l, a, b, format: 'OKLAB' };
      return { formatType: 'OKLAB', value: oklab };
    }

    const lab: ColorLAB = { l, a, b };
    return { formatType: 'LAB', value: lab };
  }

  throw new Error(`unknown color format: "${JSON.stringify(color)}"`);
}

function getDecimalString(value: number, digits = 3): number {
  return +value.toFixed(digits);
}

function formatColorFunctionChannel(value: number): number {
  return getDecimalString(value, 6);
}

export function colorToString(color: ColorRGBA, options?: ColorStringOptions): string {
  const space = resolveColorSpace(options?.space);
  const values = convertRGBToColorSpaceValues(color, space);
  const base = `${formatColorFunctionChannel(values.r)} ${formatColorFunctionChannel(
    values.g
  )} ${formatColorFunctionChannel(values.b)}`;

  if (color.a !== undefined && color.a < 1) {
    return `color(${space.toLowerCase()} ${base} / ${getDecimalString(color.a)})`;
  }

  return `color(${space.toLowerCase()} ${base})`;
}

export function rgbToString({ r, g, b }: ColorRGB): string {
  return `rgb(${r} ${g} ${b})`;
}

export function rgbaToString({ r, g, b, a }: ColorRGBA): string {
  return `rgb(${r} ${g} ${b} / ${getDecimalString(a)})`;
}

export function hslToString({ h, s, l }: ColorHSL): string {
  return `hsl(${getDecimalString(h)} ${getDecimalString(s)}% ${getDecimalString(l)}%)`;
}

export function hslaToString({ h, s, l, a }: ColorHSLA): string {
  return `hsl(${getDecimalString(h)} ${getDecimalString(s)}% ${getDecimalString(
    l
  )}% / ${getDecimalString(a)})`;
}

export function hwbToString(color: ColorHWB): string {
  return `hwb(${getDecimalString(color.h)} ${getDecimalString(color.w)}% ${getDecimalString(
    color.b
  )}%)`;
}

export function hwbaToString(color: ColorHWBA): string {
  return `hwb(${getDecimalString(color.h)} ${getDecimalString(color.w)}% ${getDecimalString(
    color.b
  )}% / ${getDecimalString(color.a)})`;
}

export function cmykToString({ c, m, y, k }: ColorCMYK): string {
  return `device-cmyk(${getDecimalString(c)}% ${getDecimalString(m)}% ${getDecimalString(
    y
  )}% ${getDecimalString(k)}%)`;
}

export function labToString({ l, a, b }: ColorLAB): string {
  return `lab(${getDecimalString(l)}% ${getDecimalString(a)} ${getDecimalString(b)})`;
}

export function oklabToString({ l, a, b }: ColorOKLAB): string {
  return `oklab(${getDecimalString(l, 6)} ${getDecimalString(a, 6)} ${getDecimalString(b, 6)})`;
}

export function lchToString({ l, c, h }: ColorLCH): string {
  return `lch(${getDecimalString(l)}% ${getDecimalString(c)} ${getDecimalString(h)})`;
}

export function oklchToString({ l, c, h }: ColorOKLCH): string {
  return `oklch(${getDecimalString(l, 6)} ${getDecimalString(c, 6)} ${getDecimalString(h)})`;
}
