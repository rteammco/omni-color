import type { Color } from '../color/color';
import { BLACK_HEX, WHITE_HEX } from '../color/color.consts';
import { toHSL, toOKLCH, toRGBA } from '../color/conversions';
import type { ColorFormat, ColorRGBA } from '../color/formats.types';
import { type ColorHarmony, getHarmonyColors } from '../color/harmonies';
import { type ColorSwatch, type ColorSwatchOptions, getColorSwatch } from '../color/swatch';
import { type CaseInsensitive, clampValue } from '../utils';

type SemanticColor = 'info' | 'positive' | 'negative' | 'warning' | 'special';

// Minimum HSL saturation (%) for a color to be considered suitable as a palette anchor:
export const SUITABLE_PALETTE_MIN_SATURATION = 40;
// Minimum HSL lightness (%) for a color to be considered suitable as a palette anchor:
export const SUITABLE_PALETTE_MIN_LIGHTNESS = 25;
// Maximum HSL lightness (%) for a color to be considered suitable as a palette anchor:
export const SUITABLE_PALETTE_MAX_LIGHTNESS = 75;

export interface ColorPalette {
  // Main colors:
  /** The main color's swatch. */
  primary: ColorSwatch;
  /** Swatches generated from the selected harmony, excluding the main color. */
  secondaryColors: ColorSwatch[];

  // Neutrals:
  /** Neutral swatch harmonized to the main color's lightness. */
  neutrals: ColorSwatch;
  /** Neutral swatch harmonized to the main color's lightness and slightly tinted toward the main color. */
  tintedNeutrals: ColorSwatch;
  /**
   * Tinted neutral swatches for each secondary color.
   *
   * This array always matches `secondaryColors` by index: `secondaryTintedNeutrals[0]`
   * is the tinted neutral swatch for `secondaryColors[0]`, `secondaryTintedNeutrals[1]`
   * is the tinted neutral swatch for `secondaryColors[1]`, and so on.
   */
  secondaryTintedNeutrals: ColorSwatch[];
  black: Color;
  white: Color;

  // Semantic colors:
  info: ColorSwatch;
  negative: ColorSwatch;
  positive: ColorSwatch;
  special: ColorSwatch;
  warning: ColorSwatch;
}

type RawColorSwatch = ReturnType<typeof getColorSwatch>;

interface RawColorPalette {
  // Main colors:
  primary: RawColorSwatch;
  secondaryColors: RawColorSwatch[];

  // Neutrals:
  neutrals: RawColorSwatch;
  tintedNeutrals: RawColorSwatch;
  secondaryTintedNeutrals: RawColorSwatch[];
  black: ColorRGBA;
  white: ColorRGBA;

  // Semantic colors:
  info: RawColorSwatch;
  negative: RawColorSwatch;
  positive: RawColorSwatch;
  special: RawColorSwatch;
  warning: RawColorSwatch;
}

// TODO: derive from actual color values
const SEMANTIC_COLOR_TO_BASE_OKLCH_HUE_MAP: { [key in SemanticColor]: number } = {
  info: 265, // blue
  positive: 150, // green
  negative: 20, // orange/red
  warning: 90, // amber/yellow
  special: 302, // magenta
  // TODO: consider SPECIAL_ALT which ranges ~282 and is purple
} as const;

const SEMANTIC_COLOR_TO_CHROMA_FACTOR_MAP: {
  [key in SemanticColor]: { chromaFactor: number; minAllowableChroma: number };
} = {
  info: { chromaFactor: 0.9, minAllowableChroma: 0.04 },
  positive: { chromaFactor: 1.0, minAllowableChroma: 0.05 },
  negative: { chromaFactor: 1.1, minAllowableChroma: 0.06 },
  warning: { chromaFactor: 1.1, minAllowableChroma: 0.06 },
  special: { chromaFactor: 1.0, minAllowableChroma: 0.05 },
} as const;

interface SemanticColorHarmonizationOptions {
  huePull?: number; // how much to pull hue toward main palette color (0 to 1)
  chromaRange?: [number, number]; // the range of chroma values to consider (each >= 0, min <= max); for sRGB, the max range tops out at ~0.32
}

const DEFAULT_SEMANTIC_COLOR_HARMONIZATION_OPTIONS: Required<SemanticColorHarmonizationOptions> = {
  huePull: 0.1,
  chromaRange: [0.02, 0.25],
};

interface NeutralColorHarmonizationOptions {
  tintChromaFactor?: number; // fraction of base color's chroma to use for tinted neutrals (0 to 1)
  maxTintChroma?: number; // upper bound of chroma for tinted neutrals
}

const DEFAULT_NEUTRAL_COLOR_HARMONIZATION_OPTIONS: Required<NeutralColorHarmonizationOptions> = {
  tintChromaFactor: 0.1,
  maxTintChroma: 0.04,
};

/**
 * Determine if a color meets the same "palette suitable" constraints used by `Color.random({ paletteSuitable: true })`:
 * - saturation >= `SUITABLE_PALETTE_MIN_SATURATION`
 * - lightness between `SUITABLE_PALETTE_MIN_LIGHTNESS` and `SUITABLE_PALETTE_MAX_LIGHTNESS` (inclusive)
 */
export function isColorPaletteSuitable(color: ColorFormat): boolean {
  const { s, l } = toHSL(color);
  return (
    s >= SUITABLE_PALETTE_MIN_SATURATION &&
    l >= SUITABLE_PALETTE_MIN_LIGHTNESS &&
    l <= SUITABLE_PALETTE_MAX_LIGHTNESS
  );
}

export interface GenerateColorPaletteOptions {
  neutralHarmonization?: NeutralColorHarmonizationOptions;
  semanticHarmonization?: SemanticColorHarmonizationOptions;
  swatchOptions?: ColorSwatchOptions;
}

function harmonizeNeutrals(paletteBaseColor: Readonly<ColorRGBA>): ColorRGBA {
  const { l: baseL, h: baseH } = toOKLCH(paletteBaseColor);
  return toRGBA({ l: baseL, c: 0, h: baseH, format: 'OKLCH' });
}

function harmonizeTintedNeutrals(
  paletteBaseColor: Readonly<ColorRGBA>,
  options: Required<NeutralColorHarmonizationOptions>,
): ColorRGBA {
  const { l: baseL, c: baseC, h: baseH } = toOKLCH(paletteBaseColor);
  const chromaFactor = clampValue(options.tintChromaFactor, 0, 1);
  const maxChroma = Math.max(options.maxTintChroma, 0);
  const resultChroma = clampValue(baseC * chromaFactor, 0, maxChroma);
  return toRGBA({ l: baseL, c: resultChroma, h: baseH, format: 'OKLCH' });
}

/**
 * Interpolate between two angles (in degrees) along the shortest path.
 * Returns the new hue in the range 0–360.
 *
 * Inputs:
 * - `startHue`:   Hue to start from (0–360)
 * - `targetHue`:  Hue to move toward (0–360)
 * - `fraction`:   How far to move toward the target (0 = stay at start, 1 = exactly target)
 */
function interpolateHueShortestPath(startHue: number, targetHue: number, fraction: number): number {
  // Calculate the signed shortest arc between start and target, in range -180..180:
  const shortestDelta = ((targetHue - startHue + 540) % 360) - 180;
  // Move the given fraction of that arc from the start hue:
  const result = startHue + shortestDelta * fraction;
  // Wrap result back into 0..360 range:
  return (result + 360) % 360;
}

const CHROMA_THRESHOLD_FOR_USABLE_HUE = 0.015; // below this threshold, colors appear grayscale

function harmonizeSemanticColor(
  paletteBaseColor: Readonly<ColorRGBA>,
  semanticColor: SemanticColor,
  options: Required<SemanticColorHarmonizationOptions>,
): ColorRGBA {
  // Constrain hue pull option to its valid range:
  const huePullOption = clampValue(options.huePull, 0, 1);

  const { l: baseL, c: baseC, h: baseH } = toOKLCH(paletteBaseColor);

  // Resolve target hue:
  const defaultSemanticH = SEMANTIC_COLOR_TO_BASE_OKLCH_HUE_MAP[semanticColor];
  const resultHue =
    baseC < CHROMA_THRESHOLD_FOR_USABLE_HUE
      ? defaultSemanticH
      : interpolateHueShortestPath(defaultSemanticH, baseH, huePullOption);

  // Resolve target chroma:
  const { chromaFactor, minAllowableChroma } = SEMANTIC_COLOR_TO_CHROMA_FACTOR_MAP[semanticColor];
  const [inputMinChroma, inputMaxChroma] = options.chromaRange;
  const minChromaOption = Math.max(inputMinChroma, 0);
  const maxChromaOption = Math.max(inputMaxChroma, minChromaOption, minAllowableChroma);
  const resultChroma = clampValue(
    Math.max(baseC * chromaFactor, minAllowableChroma), // ensure minimum chroma for very low‑chroma base colors (overrides `minChroma` option if necessary)
    Math.max(minChromaOption, minAllowableChroma),
    maxChromaOption,
  );

  return toRGBA({ l: baseL, c: resultChroma, h: resultHue, format: 'OKLCH' });
}

export function generateColorPaletteFromBaseColor(
  baseColor: Readonly<ColorRGBA>,
  harmony: CaseInsensitive<ColorHarmony> = 'COMPLEMENTARY',
  options: GenerateColorPaletteOptions | undefined,
): RawColorPalette {
  // TODO: helpers or warnings if the palette is suboptimal

  const neutralHarmonizationOptions = {
    tintChromaFactor:
      options?.neutralHarmonization?.tintChromaFactor ??
      DEFAULT_NEUTRAL_COLOR_HARMONIZATION_OPTIONS.tintChromaFactor,
    maxTintChroma:
      options?.neutralHarmonization?.maxTintChroma ??
      DEFAULT_NEUTRAL_COLOR_HARMONIZATION_OPTIONS.maxTintChroma,
  };

  const semanticHarmonizationOptions = {
    huePull:
      options?.semanticHarmonization?.huePull ??
      DEFAULT_SEMANTIC_COLOR_HARMONIZATION_OPTIONS.huePull,
    chromaRange:
      options?.semanticHarmonization?.chromaRange ??
      DEFAULT_SEMANTIC_COLOR_HARMONIZATION_OPTIONS.chromaRange,
  };

  const paletteSwatchOptions: ColorSwatchOptions = {
    centerOn500: true,
    ...options?.swatchOptions,
  };

  const harmonyColors = getHarmonyColors(baseColor, harmony);
  const primary = getColorSwatch(harmonyColors[0], paletteSwatchOptions);
  const secondaryBaseColors = harmonyColors.slice(1);
  const secondaryColors = secondaryBaseColors.map((color) =>
    getColorSwatch(color, paletteSwatchOptions),
  );

  return {
    primary,
    secondaryColors,
    neutrals: getColorSwatch(harmonizeNeutrals(baseColor), paletteSwatchOptions),
    tintedNeutrals: getColorSwatch(
      harmonizeTintedNeutrals(baseColor, neutralHarmonizationOptions),
      paletteSwatchOptions,
    ),
    secondaryTintedNeutrals: secondaryBaseColors.map((color) =>
      getColorSwatch(
        harmonizeTintedNeutrals(color, neutralHarmonizationOptions),
        paletteSwatchOptions,
      ),
    ),
    black: toRGBA(BLACK_HEX),
    white: toRGBA(WHITE_HEX),
    info: getColorSwatch(
      harmonizeSemanticColor(baseColor, 'info', semanticHarmonizationOptions),
      paletteSwatchOptions,
    ),
    positive: getColorSwatch(
      harmonizeSemanticColor(baseColor, 'positive', semanticHarmonizationOptions),
      paletteSwatchOptions,
    ),
    negative: getColorSwatch(
      harmonizeSemanticColor(baseColor, 'negative', semanticHarmonizationOptions),
      paletteSwatchOptions,
    ),
    warning: getColorSwatch(
      harmonizeSemanticColor(baseColor, 'warning', semanticHarmonizationOptions),
      paletteSwatchOptions,
    ),
    special: getColorSwatch(
      harmonizeSemanticColor(baseColor, 'special', semanticHarmonizationOptions),
      paletteSwatchOptions,
    ),
  };
}
