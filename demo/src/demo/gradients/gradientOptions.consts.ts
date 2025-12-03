import type { ColorGradientOptions } from '../../../../dist';

export const DEFAULT_COLOR_GRADIENT_OPTIONS: ColorGradientOptions = {
  stops: 2,
  space: 'RGB',
  interpolation: 'LINEAR',
  easing: 'LINEAR',
  clamp: true,
  hueInterpolationMode: 'CARTESIAN',
} as const;
