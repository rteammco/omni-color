import type { Color } from './color';

export const COLOR_BRAND: unique symbol = Symbol.for('omni-color.Color');

export function isColorInstance(value: unknown): value is Color {
  return !!value && typeof value === 'object' && (value as Partial<Color>)[COLOR_BRAND] === true;
}
