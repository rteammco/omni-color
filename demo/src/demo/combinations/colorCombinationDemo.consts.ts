import type { AverageColorsOptions, BlendColorsOptions, MixColorsOptions } from '../../../../dist';

export const DEFAULT_MIX_COLORS_OPTIONS: MixColorsOptions = {
  space: 'LINEAR_RGB',
  type: 'ADDITIVE',
} as const;

export const DEFAULT_BLEND_COLORS_OPTIONS: BlendColorsOptions = {
  mode: 'NORMAL',
  space: 'RGB',
  ratio: 0.5,
} as const;

export const DEFAULT_AVERAGE_COLORS_OPTIONS: AverageColorsOptions = {
  space: 'LINEAR_RGB',
} as const;
