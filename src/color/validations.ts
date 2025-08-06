import {
  ColorRGBA,
  ColorHSLA,
  ColorHSV,
  ColorCMYK,
  ColorLCH,
  ColorOKLCH,
} from './formats';

const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export function isValidHexColor(color: string): boolean {
  return HEX_COLOR_REGEX.test(color);
}

export function isValidRGBAColor(color: ColorRGBA): boolean {
  const { r, g, b, a } = color;
  return (
    Number.isInteger(r) &&
    r >= 0 &&
    r <= 255 &&
    Number.isInteger(g) &&
    g >= 0 &&
    g <= 255 &&
    Number.isInteger(b) &&
    b >= 0 &&
    b <= 255 &&
    (a === undefined || (typeof a === 'number' && a >= 0 && a <= 1))
  );
}

export function isValidHSLAColor(color: ColorHSLA): boolean {
  const { h, s, l, a } = color;
  return (
    Number.isInteger(h) &&
    h >= 0 &&
    h <= 360 &&
    Number.isInteger(s) &&
    s >= 0 &&
    s <= 100 &&
    Number.isInteger(l) &&
    l >= 0 &&
    l <= 100 &&
    (a === undefined || (typeof a === 'number' && a >= 0 && a <= 1))
  );
}

export function isValidHSVColor(color: ColorHSV): boolean {
  const { h, s, v } = color;
  return (
    Number.isInteger(h) &&
    h >= 0 &&
    h <= 360 &&
    Number.isInteger(s) &&
    s >= 0 &&
    s <= 100 &&
    Number.isInteger(v) &&
    v >= 0 &&
    v <= 100
  );
}

export function isValidCMYKColor(color: ColorCMYK): boolean {
  const { c, m, y, k } = color;
  const check = (value: number) => typeof value === 'number' && value >= 0 && value <= 100;
  return [c, m, y, k].every(check);
}

export function isValidLCHColor(color: ColorLCH): boolean {
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

export function isValidOKLCHColor(color: ColorOKLCH): boolean {
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
