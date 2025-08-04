import { ColorRGBA, ColorHSLA } from './formats';

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
