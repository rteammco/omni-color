export type ColorHex = `#${string}`;

export interface ColorRGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
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

export interface ColorCMYK {
  c: number; // 0-100
  m: number; // 0-100
  y: number; // 0-100
  k: number; // 0-100
}

export interface ColorLCH {
  l: number; // 0-100
  c: number; // >=0
  h: number; // 0-360
}

export interface ColorOKLCH {
  l: number; // 0-1
  c: number; // >=0
  h: number; // 0-360
}

export type ColorFormat =
  | ColorHex
  | ColorRGB
  | ColorRGBA
  | ColorHSL
  | ColorHSLA
  | ColorHSV
  | ColorHSVA
  | ColorCMYK
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
  | { formatType: 'CMYK'; value: ColorCMYK }
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

  if ('h' in color && 'l' in color && 'c' in color) {
    const { l, c, h } = color;
    if (l <= 1) {
      const oklch: ColorOKLCH = { l, c, h };
      return { formatType: 'OKLCH', value: oklch };
    }
    const lch: ColorLCH = { l, c, h };
    return { formatType: 'LCH', value: lch };
  }

  if ('r' in color && 'g' in color && 'b' in color) {
    return 'a' in color
      ? { formatType: 'RGBA', value: color }
      : { formatType: 'RGB', value: color };
  }

  throw new Error(`unknown color format: "${JSON.stringify(color)}"`);
}

function getDecimalString(value: number, digits = 3): number {
  return +value.toFixed(digits);
}

export function rgbToString({ r, g, b }: ColorRGB): string {
  return `rgb(${r}, ${g}, ${b})`;
}

export function rgbaToString({ r, g, b, a }: ColorRGBA): string {
  return `rgba(${r}, ${g}, ${b}, ${getDecimalString(a)})`;
}

export function hslToString({ h, s, l }: ColorHSL): string {
  return `hsl(${getDecimalString(h)}, ${getDecimalString(s)}%, ${getDecimalString(l)}%)`;
}

export function hslaToString({ h, s, l, a }: ColorHSLA): string {
  return `hsla(${getDecimalString(h)}, ${getDecimalString(s)}%, ${getDecimalString(
    l
  )}%, ${getDecimalString(a)})`;
}

export function cmykToString({ c, m, y, k }: ColorCMYK): string {
  return `cmyk(${getDecimalString(c)}%, ${getDecimalString(m)}%, ${getDecimalString(
    y
  )}%, ${getDecimalString(k)}%)`;
}

export function lchToString({ l, c, h }: ColorLCH): string {
  return `lch(${getDecimalString(l)}% ${getDecimalString(c)} ${getDecimalString(h)})`;
}

export function oklchToString({ l, c, h }: ColorOKLCH): string {
  return `oklch(${getDecimalString(l, 6)} ${getDecimalString(c, 6)} ${getDecimalString(h)})`;
}
