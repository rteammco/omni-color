import type { Color } from './color';

export const COLOR_BRAND: unique symbol = Symbol('omni-color.Color');

export interface ColorBrand {
  readonly [COLOR_BRAND]: true;
}

export function isColorInstance(value: unknown): value is Color {
  return (
    !!value && typeof value === 'object' && (value as Partial<ColorBrand>)[COLOR_BRAND] === true
  );
}
