import { Color } from '../color/color';
import { BLACK_HEX, WHITE_HEX } from '../color/color.constants';
import { type ColorHarmony } from '../color/harmonies';
import type { ColorSwatch, ColorSwatchOptions } from '../color/swatch';
import { clampValue } from '../utils';

type SemanticColor = 'info' | 'positive' | 'negative' | 'warning' | 'special';

export interface ColorPalette {
  // Main colors:
  primary: ColorSwatch;
  secondaryColors: ColorSwatch[];

  // Neutrals:
  neutrals: ColorSwatch;
  tintedNeutrals: ColorSwatch;
  back: Color;
  white: Color;

  // Semantic colors:
  info: ColorSwatch;
  negative: ColorSwatch;
  positive: ColorSwatch;
  special: ColorSwatch;
  warning: ColorSwatch;
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

export interface GenerateColorPaletteOptions {
  neutralHarmonization?: NeutralColorHarmonizationOptions;
  semanticHarmonization?: SemanticColorHarmonizationOptions;
  swatchOptions?: ColorSwatchOptions;
}

function harmonizeNeutrals(paletteBaseColor: Color): Color {
  const { l: baseL, h: baseH } = paletteBaseColor.toOKLCH();
  return new Color({ l: baseL, c: 0, h: baseH });
}

function harmonizeTintedNeutrals(
  paletteBaseColor: Color,
  options: Required<NeutralColorHarmonizationOptions>
): Color {
  const { l: baseL, c: baseC, h: baseH } = paletteBaseColor.toOKLCH();
  const chromaFactor = clampValue(options.tintChromaFactor, 0, 1);
  const maxChroma = Math.max(options.maxTintChroma, 0);
  const resultChroma = clampValue(baseC * chromaFactor, 0, maxChroma);
  return new Color({ l: baseL, c: resultChroma, h: baseH });
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
  paletteBaseColor: Color,
  semanticColor: SemanticColor,
  options: Required<SemanticColorHarmonizationOptions>
): Color {
  // Constrain hue pull option to its valid range:
  const huePullOption = clampValue(options.huePull, 0, 1);

  const { l: baseL, c: baseC, h: baseH } = paletteBaseColor.toOKLCH();

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
    maxChromaOption
  );

  return new Color({ l: baseL, c: resultChroma, h: resultHue });
}

export function generateColorPaletteFromBaseColor(
  baseColor: Color,
  harmony: ColorHarmony = 'COMPLEMENTARY',
  options?: GenerateColorPaletteOptions
): ColorPalette {
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

  const harmonyColors = baseColor.getHarmonyColors(harmony);
  const primary = harmonyColors[0].getColorSwatch(paletteSwatchOptions);

  return {
    primary,
    secondaryColors: harmonyColors
      .slice(1)
      .map((color) => color.getColorSwatch(paletteSwatchOptions)),
    neutrals: harmonizeNeutrals(baseColor).getColorSwatch(paletteSwatchOptions),
    tintedNeutrals: harmonizeTintedNeutrals(
      baseColor,
      neutralHarmonizationOptions
    ).getColorSwatch(paletteSwatchOptions),
    back: new Color(BLACK_HEX),
    white: new Color(WHITE_HEX),
    info: harmonizeSemanticColor(
      baseColor,
      'info',
      semanticHarmonizationOptions
    ).getColorSwatch(paletteSwatchOptions),
    positive: harmonizeSemanticColor(
      baseColor,
      'positive',
      semanticHarmonizationOptions
    ).getColorSwatch(paletteSwatchOptions),
    negative: harmonizeSemanticColor(
      baseColor,
      'negative',
      semanticHarmonizationOptions
    ).getColorSwatch(paletteSwatchOptions),
    warning: harmonizeSemanticColor(
      baseColor,
      'warning',
      semanticHarmonizationOptions
    ).getColorSwatch(paletteSwatchOptions),
    special: harmonizeSemanticColor(
      baseColor,
      'special',
      semanticHarmonizationOptions
    ).getColorSwatch(paletteSwatchOptions),
  };
}
