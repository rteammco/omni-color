import { clampValue } from '../utils';
import type { Color } from './color';
import { toHSLA, toRGBA } from './conversions';
import type { ColorRGBA } from './formats.types';

export type BaseColorSwatchShade = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type ExtendedColorSwatchShade =
  | BaseColorSwatchShade
  | 50
  | 150
  | 250
  | 350
  | 450
  | 550
  | 650
  | 750
  | 850
  | 950;

type ColorSwatchShadeAdjustment = { saturationShift: number; lightnessShift: number };
type ColorSwatchShadeAdjustmentsFrom500<Shade extends ExtendedColorSwatchShade> = Record<
  Shade,
  ColorSwatchShadeAdjustment
>;

interface BaseColorSwatchShades {
  100: Color; // light
  200: Color;
  300: Color;
  400: Color;
  500: Color; // base color
  600: Color;
  700: Color;
  800: Color;
  900: Color; // dark
}

export interface BaseColorSwatch extends BaseColorSwatchShades {
  type: 'BASE';
  baseShade: BaseColorSwatchShade;
}

interface ExtendedColorSwatchShades extends BaseColorSwatchShades {
  50: Color;
  150: Color;
  250: Color;
  350: Color;
  450: Color;
  550: Color;
  650: Color;
  750: Color;
  850: Color;
  950: Color;
}

export interface ExtendedColorSwatch extends ExtendedColorSwatchShades {
  type: 'EXTENDED';
  baseShade: BaseColorSwatchShade;
}

export type ColorSwatch = BaseColorSwatch | ExtendedColorSwatch;

type RawBaseColorSwatchShades = Record<BaseColorSwatchShade, ColorRGBA>;
type RawExtendedColorSwatchShades = RawBaseColorSwatchShades &
  Record<Exclude<ExtendedColorSwatchShade, BaseColorSwatchShade>, ColorRGBA>;

interface RawBaseColorSwatch extends RawBaseColorSwatchShades {
  type: 'BASE';
  baseShade: BaseColorSwatchShade;
}

interface RawExtendedColorSwatch extends RawExtendedColorSwatchShades {
  type: 'EXTENDED';
  baseShade: BaseColorSwatchShade;
}

type RawColorSwatch = RawBaseColorSwatch | RawExtendedColorSwatch;

export interface ColorSwatchOptions {
  /**
   * Include half-shades (`50`, `150`, …, `950`) interpolated between the base swatch shades.
   */
  extended?: boolean;
  /**
   * Center the provided color on the 500 swatch shade instead of positioning it dynamically.
   */
  centerOn500?: boolean;
}

function getAdjustedSaturation(baseSaturation: number, delta: number): number {
  // For cases with no saturation, do not increase it any more since for black or gray
  // colors, that would result in going from grayscale to an unrelated color:
  if (baseSaturation === 0) {
    return baseSaturation;
  }

  return clampValue(baseSaturation + delta, 0, 100);
}

const BASE_COLOR_SWATCH_SHADES: readonly BaseColorSwatchShade[] = [
  100, 200, 300, 400, 500, 600, 700, 800, 900,
];

const EXTENDED_COLOR_SWATCH_SHADES: readonly ExtendedColorSwatchShade[] = [
  50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950,
];

const BASE_SWATCH_SHADE_ADJUSTMENTS_FROM_500: ColorSwatchShadeAdjustmentsFrom500<BaseColorSwatchShade> =
  {
    100: { saturationShift: 20, lightnessShift: 40 },
    200: { saturationShift: 15, lightnessShift: 30 },
    300: { saturationShift: 10, lightnessShift: 20 },
    400: { saturationShift: 5, lightnessShift: 10 },
    500: { saturationShift: 0, lightnessShift: 0 },
    600: { saturationShift: -5, lightnessShift: -10 },
    700: { saturationShift: -10, lightnessShift: -20 },
    800: { saturationShift: -15, lightnessShift: -30 },
    900: { saturationShift: -20, lightnessShift: -40 },
  };

const EXTENDED_SWATCH_SHADE_ADJUSTMENTS_FROM_500: ColorSwatchShadeAdjustmentsFrom500<ExtendedColorSwatchShade> =
  {
    50: { saturationShift: 22.5, lightnessShift: 45 },
    100: { saturationShift: 20, lightnessShift: 40 },
    150: { saturationShift: 17.5, lightnessShift: 35 },
    200: { saturationShift: 15, lightnessShift: 30 },
    250: { saturationShift: 12.5, lightnessShift: 25 },
    300: { saturationShift: 10, lightnessShift: 20 },
    350: { saturationShift: 7.5, lightnessShift: 15 },
    400: { saturationShift: 5, lightnessShift: 10 },
    450: { saturationShift: 2.5, lightnessShift: 5 },
    500: { saturationShift: 0, lightnessShift: 0 },
    550: { saturationShift: -2.5, lightnessShift: -5 },
    600: { saturationShift: -5, lightnessShift: -10 },
    650: { saturationShift: -7.5, lightnessShift: -15 },
    700: { saturationShift: -10, lightnessShift: -20 },
    750: { saturationShift: -12.5, lightnessShift: -25 },
    800: { saturationShift: -15, lightnessShift: -30 },
    850: { saturationShift: -17.5, lightnessShift: -35 },
    900: { saturationShift: -20, lightnessShift: -40 },
    950: { saturationShift: -22.5, lightnessShift: -45 },
  };

function isPureBlackOrWhite(baseColor: Readonly<ColorRGBA>): boolean {
  const { r, g, b } = baseColor;
  const isBlack = r === 0 && g === 0 && b === 0;
  const isWhite = r === 255 && g === 255 && b === 255;

  return isBlack || isWhite;
}

function getBaseShade(
  baseColor: Readonly<ColorRGBA>,
  shouldCenterOn500: boolean,
): BaseColorSwatchShade {
  if (shouldCenterOn500 || isPureBlackOrWhite(baseColor)) {
    return 500;
  }

  const { l } = toHSLA(baseColor);
  const shadeIndex = Math.round((1 - l / 100) * 8);
  const shade = (100 + shadeIndex * 100) as BaseColorSwatchShade;

  return clampValue(shade, 100, 900) as BaseColorSwatchShade;
}

function getRelativeShadeAdjustment<Shade extends ExtendedColorSwatchShade>(
  shade: Shade,
  baseShade: BaseColorSwatchShade,
  adjustmentsFrom500: Record<number, ColorSwatchShadeAdjustment>,
): ColorSwatchShadeAdjustment {
  const baseShadeAdjustment = adjustmentsFrom500[baseShade];
  const shadeAdjustment = adjustmentsFrom500[shade];

  return {
    saturationShift: shadeAdjustment.saturationShift - baseShadeAdjustment.saturationShift,
    lightnessShift: shadeAdjustment.lightnessShift - baseShadeAdjustment.lightnessShift,
  };
}

function createSwatch<Shade extends ExtendedColorSwatchShade>({
  baseColor,
  adjustmentsFrom500,
  baseShade,
  shades,
  type,
}: {
  baseColor: Readonly<ColorRGBA>;
  adjustmentsFrom500: ColorSwatchShadeAdjustmentsFrom500<Shade>;
  baseShade: BaseColorSwatchShade;
  shades: readonly Shade[];
  type: RawColorSwatch['type'];
}): RawColorSwatch {
  const { h: baseH, s: baseS, l: baseL, a: baseA } = toHSLA(baseColor);

  const swatchShades = shades.reduce<Record<number, ColorRGBA>>((acc, shade) => {
    const adjustment = getRelativeShadeAdjustment(shade, baseShade, adjustmentsFrom500);

    acc[shade] =
      shade === baseShade
        ? { ...baseColor }
        : toRGBA({
            h: baseH,
            s: getAdjustedSaturation(baseS, adjustment.saturationShift),
            l: clampValue(baseL + adjustment.lightnessShift, 0, 100),
            a: baseA,
          });

    return acc;
  }, {});

  return {
    type,
    baseShade,
    ...(swatchShades as Record<Shade, ColorRGBA>),
  } as RawColorSwatch;
}

function getBaseColorSwatch(
  baseColor: Readonly<ColorRGBA>,
  baseShade: BaseColorSwatchShade,
): RawBaseColorSwatch {
  return createSwatch({
    baseColor,
    adjustmentsFrom500: BASE_SWATCH_SHADE_ADJUSTMENTS_FROM_500,
    baseShade,
    shades: BASE_COLOR_SWATCH_SHADES,
    type: 'BASE',
  }) as RawBaseColorSwatch;
}

function getExtendedColorSwatch(
  baseColor: Readonly<ColorRGBA>,
  baseShade: BaseColorSwatchShade,
): RawExtendedColorSwatch {
  return createSwatch({
    baseColor,
    adjustmentsFrom500: EXTENDED_SWATCH_SHADE_ADJUSTMENTS_FROM_500,
    baseShade,
    shades: EXTENDED_COLOR_SWATCH_SHADES,
    type: 'EXTENDED',
  }) as RawExtendedColorSwatch;
}

export function getColorSwatch(
  baseColor: Readonly<ColorRGBA>,
  options: ColorSwatchOptions & { extended: true },
): RawExtendedColorSwatch;
export function getColorSwatch(
  baseColor: Readonly<ColorRGBA>,
  options?: ColorSwatchOptions,
): RawColorSwatch;
export function getColorSwatch(
  baseColor: Readonly<ColorRGBA>,
  options: ColorSwatchOptions = {},
): RawColorSwatch {
  const baseShade = getBaseShade(baseColor, options.centerOn500 ?? false);

  if (options.extended) {
    return getExtendedColorSwatch(baseColor, baseShade);
  }

  return getBaseColorSwatch(baseColor, baseShade);
}
