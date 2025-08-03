import { ColorRGBA } from './formats';

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
