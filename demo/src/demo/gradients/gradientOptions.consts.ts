import type { ColorGradientOptions } from '../../../../dist';

const DEFAULT_COLOR_GRADIENT_OPTIONS: ColorGradientOptions = {
  stops: 2,
  space: 'RGB',
  interpolation: 'LINEAR',
  easing: 'LINEAR',
  clamp: true,
  hueInterpolationMode: 'CARTESIAN',
} as const;

export const DEFAULT_COLOR_GRADIENT_TO_OPTIONS: ColorGradientOptions = {
  ...DEFAULT_COLOR_GRADIENT_OPTIONS,
  stops: 5,
};

export const DEFAULT_COLOR_GRADIENT_THROUGH_OPTIONS: ColorGradientOptions = {
  ...DEFAULT_COLOR_GRADIENT_OPTIONS,
  stops: 6,
};
