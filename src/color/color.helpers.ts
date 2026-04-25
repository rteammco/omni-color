import type { Color, CreateColorInstance } from './color';

export const COLOR_BRAND: unique symbol = Symbol.for('omni-color.Color');

export function isColorInstance(value: unknown): value is Color {
  return !!value && typeof value === 'object' && (value as Partial<Color>)[COLOR_BRAND] === true;
}

let colorInstanceFactory: CreateColorInstance | undefined;

export function setColorInstanceFactory(createColor: CreateColorInstance): void {
  colorInstanceFactory = createColor;
}

export function getColorInstanceFactory(): CreateColorInstance {
  if (!colorInstanceFactory) {
    throw new Error('Color instance factory has not been initialized');
  }
  return colorInstanceFactory;
}
