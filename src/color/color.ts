import type { ColorPalette, GenerateColorPaletteOptions } from '../palette/palette';
import { generateColorPaletteFromBaseColor } from '../palette/palette';
import { clampValue } from '../utils';
import type { AverageColorsOptions, BlendColorsOptions, MixColorsOptions } from './combinations';
import { averageColors, blendColors, mixColors } from './combinations';
import {
  toCMYK,
  toHex,
  toHex8,
  toHSL,
  toHSLA,
  toHSV,
  toHSVA,
  toLAB,
  toLCH,
  toOKLCH,
  toRGB,
} from './conversions';
import type { DeltaEOptions } from './deltaE';
import { getDeltaE } from './deltaE';
import type {
  ColorCMYK,
  ColorFormat,
  ColorHex,
  ColorHSL,
  ColorHSLA,
  ColorHSV,
  ColorHSVA,
  ColorLAB,
  ColorLCH,
  ColorOKLCH,
  ColorRGB,
  ColorRGBA,
} from './formats';
import {
  cmykToString,
  hslaToString,
  hslToString,
  labToString,
  lchToString,
  oklchToString,
  rgbaToString,
  rgbToString,
} from './formats';
import type { ColorGradientOptions } from './gradients';
import { createColorGradient } from './gradients';
import type { ColorHarmony } from './harmonies';
import {
  getAnalogousHarmonyColors,
  getComplementaryColors,
  getHarmonyColors,
  getMonochromaticHarmonyColors,
  getSplitComplementaryColors,
  getSquareHarmonyColors,
  getTetradicHarmonyColors,
  getTriadicHarmonyColors,
} from './harmonies';
import {
  brightenColor,
  colorToGrayscale,
  darkenColor,
  desaturateColor,
  saturateColor,
  spinColorHue,
} from './manipulations';
import type { ColorNameAndLightness } from './names';
import { getBaseColorName } from './names';
import type { RandomColorOptions } from './random';
import { getRandomColorRGBA } from './random';
import type {
  ReadabilityComparisonOptions,
  TextReadabilityOptions,
  TextReadabilityReport,
} from './readability';
import {
  getAPCAReadabilityScore,
  getBestBackgroundColorForText,
  getMostReadableTextColorForBackground,
  getTextReadabilityReport,
  getWCAGContrastRatio,
  isTextReadable,
} from './readability';
import type { ColorSwatch, ColorSwatchOptions, ExtendedColorSwatch } from './swatch';
import { getColorSwatch } from './swatch';
import type {
  ColorTemperatureAndLabel,
  ColorTemperatureLabel,
  ColorTemperatureStringFormatOptions,
} from './temperature';
import {
  getColorFromTemperature,
  getColorFromTemperatureLabel,
  getColorTemperature,
  getColorTemperatureString,
} from './temperature';
import type { IsColorDarkOptions } from './utils';
import { areColorsEqual, getColorRGBAFromInput, isColorDark, isColorOffWhite } from './utils';

type ValidColorInputFormat = Color | ColorFormat | string;

/**
 * The base omni-color object.
 *
 * The {@link Color} class represents a specific color and provides methods for
 * converting between formats, performing manipulations like darkening or desaturating,
 * and generating harmonies and color palettes.
 *
 * {@link Color} instances are immutable - all operations will return a new {@link Color} instance representing the modified color.
 *
 * @example
 * ```ts
 * const red = new Color('#ff0000');
 * red.toHSL(); // { h: 0, s: 100, l: 50 }
 * const darker = red.darken(20); // new Color
 * red.toHex(); // '#ff0000'
 * ```
 */
export class Color {
  private color: ColorRGBA;

  /**
   * Create a new {@link Color} instance.
   *
   * The input can be any CSS color string, a hex string, any {@link ColorFormat} object,
   * {@link Color} instance, or a named color such as `'lightblue'` or
   * `'green'`. Passing `null` or `undefined` results in a random color.
   * Invalid input will throw an error.
   *
   * @param color - Initial color value.
   *
   * @throws If `color` input is invalid.
   *
   * @example
   * ```ts
   * const red = new Color('#ff0000');
   * const sameRed = new Color(red.toRGB());
   * const fromObj = new Color({ h: 0, s: 100, l: 50 });
   * const parsed = new Color('rgb(255, 0, 0)');
   * const named = new Color('lightblue');
   * const random = new Color();
   * ```
   */
  constructor(color?: ValidColorInputFormat | null) {
    // getColorRGBAFromInput always returns a fresh object
    this.color = getColorRGBAFromInput(color);
  }

  /**
   * Create a {@link Color} with a random RGB value.
   *
   * @param options - Optional {@link RandomColorOptions} for extra controls on alpha, hue, and palette suitability.
   * @returns A new randomly-generated {@link Color}.
   *
   * @example
   * ```ts
   * const color = Color.random();
   * ```
   */
  static random(options?: RandomColorOptions): Color {
    return new Color(getRandomColorRGBA(options));
  }

  /**
   * Create an off-white {@link Color} representing the given color temperature.
   *
   * @param temperature - Temperature in Kelvin or a {@link ColorTemperatureLabel}.
   * @returns A new {@link Color} representing the off-white color at the given temperature.
   *
   * @example
   * ```ts
   * const daylight = Color.fromTemperature(6500);
   * const cloudy = Color.fromTemperature('Cloudy sky');
   * ```
   */
  static fromTemperature(temperature: number | ColorTemperatureLabel): Color {
    if (typeof temperature === 'number') {
      return getColorFromTemperature(temperature);
    }
    return getColorFromTemperatureLabel(temperature);
  }

  /**
   * Create an interpolated gradient between two or more colors.
   *
   * @param colors - Array of {@link Color}s or color inputs to interpolate between.
   * @param options - Optional {@link ColorGradientOptions} for space, easing, interpolation style, hue interpolation mode, and stop count.
   * @returns An array of new {@link Color}s representing the generated gradient.
   *
   * @example
   * ```ts
   * const gradient = Color.createInterpolatedGradient([
   *   '#ff0000',
   *   '#00ff00',
   *   '#0000ff',
   * ], { stops: 7, interpolation: 'LINEAR', space: 'OKLCH' });
   * gradient.map((color) => color.toHex());
   * // ['#ff0000', '#ef6c00', '#99da00', '#00ff00', '#00db86', '#006ee6', '#0000ff']
   * ```
  */
  static createInterpolatedGradient(
    colors: readonly ValidColorInputFormat[],
    options?: ColorGradientOptions
  ): Color[] {
    return createColorGradient(
      colors.map((c) => new Color(c)),
      options
    );
  }

  /**
   * Get the color as a hex string (`#rrggbb`).
   *
   * @example
   * ```ts
   * new Color('rgb(255, 0, 0)').toHex(); // '#ff0000'
   * ```
   */
  toHex(): ColorHex {
    return toHex(this.color);
  }

  /**
   * Get the color as an 8-digit hex string including alpha (`#rrggbbaa`).
   *
   * @example
   * ```ts
   * new Color('rgba(255, 0, 0, 0.5)').toHex(); // '#ff000080'
   * ```
   */
  toHex8(): ColorHex {
    return toHex8(this.color);
  }

  /**
   * Get the color as a {@link ColorRGB} `{ r, g, b }` object.
   */
  toRGB(): ColorRGB {
    return toRGB(this.color);
  }

  /**
   * Get the color as a CSS `rgb(r, g, b)` string.
   */
  toRGBString(): string {
    return rgbToString(this.toRGB());
  }

  /**
   * Get the color as a {@link ColorRGBA} `{ r, g, b, a }` object.
   */
  toRGBA(): ColorRGBA {
    return { ...this.color };
  }

  /**
   * Get the color as a CSS `rgba(r, g, b, a)` string.
   */
  toRGBAString(): string {
    return rgbaToString(this.toRGBA());
  }

  /**
   * Get the color as a {@link ColorHSL} `{ h, s, l }` object where `h` is 0–360 and `s`
   * and `l` are 0–100.
   */
  toHSL(): ColorHSL {
    return toHSL(this.color);
  }

  /**
   * Get the color as a CSS `hsl(h, s%, l%)` string.
   */
  toHSLString(): string {
    return hslToString(this.toHSL());
  }

  /**
   * Get the color as a {@link ColorHSLA} `{ h, s, l, a }` object.
   */
  toHSLA(): ColorHSLA {
    return toHSLA(this.color);
  }

  /**
   * Get the color as a CSS `hsla(h, s%, l%, a)` string.
   */
  toHSLAString(): string {
    return hslaToString(this.toHSLA());
  }

  /**
   * Get the color as a {@link ColorHSV} `{ h, s, v }` object where `h` is 0–360 and `s`
   * and `v` are 0–100.
   */
  toHSV(): ColorHSV {
    return toHSV(this.color);
  }

  /**
   * Get the color as a {@link ColorHSVA} `{ h, s, v, a }` object.
   */
  toHSVA(): ColorHSVA {
    return toHSVA(this.color);
  }

  /**
   * Get the color as a {@link ColorCMYK} `{ c, m, y, k }` where each channel is
   * 0–100.
   */
  toCMYK(): ColorCMYK {
    return toCMYK(this.color);
  }

  /**
   * Get the color as a CSS `cmyk(c, m, y, k)` string.
   */
  toCMYKString(): string {
    return cmykToString(this.toCMYK());
  }

  /**
   * Get the color as a {@link ColorLAB} `{ l, a, b }` object.
   */
  toLAB(): ColorLAB {
    return toLAB(this.color);
  }

  /**
   * Get the color as a CSS `lab(l% a b)` string.
   */
  toLABString(): string {
    return labToString(this.toLAB());
  }

  /**
   * Get the color as a {@link ColorLCH} (CIELCh) `{ l, c, h }` object.
   */
  toLCH(): ColorLCH {
    return toLCH(this.color);
  }

  /**
   * Get the color as a CSS `lch(l% c h)` string.
   */
  toLCHString(): string {
    return lchToString(this.toLCH());
  }

  /**
   * Get the color as a {@link ColorOKLCH} `{ l, c, h }` object.
   */
  toOKLCH(): ColorOKLCH {
    return toOKLCH(this.color);
  }

  /**
   * Get the color as a CSS `oklch(l c h)` string.
   */
  toOKLCHString(): string {
    return oklchToString(this.toOKLCH());
  }

  /**
   * Return the alpha channel of the color (0–1).
   */
  getAlpha(): number {
    return this.color.a;
  }

  /**
   * Changes the alpha channel of any color, including fully-opaque colors.
   *
   * @returns A new {@link Color} with the modified alpha channel.
   *
   * @param alpha - New alpha value between `0` and `1`; defaults to `1` when the input is not a finite number.
   * Values out of range will be clamped to the nearest valid value.
   */
  setAlpha(alpha: number): Color {
    return new Color({
      ...this.color,
      a: Number.isFinite(alpha) ? +clampValue(alpha, 0, 1).toFixed(3) : 1,
    });
  }

  /**
   * Rotate the hue of the color by the given number of degrees in HSL space. Hue values range
   * from 0–360 where 0 is red, 120 is green and 240 is blue. Values wrap
   * around the circle when they exceed that range.
   *
   * @returns A new {@link Color} with the modified hue.
   *
   * @example
   * ```ts
   * new Color('#ff0000').spin(180).toHex(); // '#00ffff'
   * ```
   */
  spin(degrees: number): Color {
    return spinColorHue(this, degrees);
  }

  /**
   * Increase the lightness of the color.
   *
   * @param percentage - Amount to increase in HSL lightness (default `10`).
   * @returns A new {@link Color} with the modified lightness.
   *
   * @example
   * ```ts
   * new Color('#808080').brighten(20).toHex(); // '#b3b3b3'
   * ```
   */
  brighten(percentage?: number): Color {
    return brightenColor(this, percentage);
  }

  /**
   * Decrease the lightness of the color.
   *
   * @param percentage - Amount to decrease in HSL lightness (default `10`).
   * @returns A new {@link Color} with the modified lightness.
   *
   * @example
   * ```ts
   * new Color('#808080').darken(20).toHex(); // '#4d4d4d'
   * ```
   */
  darken(percentage?: number): Color {
    return darkenColor(this, percentage);
  }

  /**
   * Increase the saturation of the color.
   *
   * @param percentage - Amount to increase in HSL saturation (default `10`).
   * @returns A new {@link Color} with the modified saturation.
   *
   * @example
   * ```ts
   * new Color('hsl(0, 50%, 50%)').saturate(20).toHSLString();
   * // 'hsl(0, 70%, 50%)'
   * ```
   */
  saturate(percentage?: number): Color {
    return saturateColor(this, percentage);
  }

  /**
   * Decrease the saturation of the color.
   *
   * @param percentage - Amount to decrease in HSL saturation (default `10`).
   * @returns A new {@link Color} with the modified saturation.
   *
   * @example
   * ```ts
   * new Color('hsl(0, 50%, 50%)').desaturate(20).toHSLString();
   * // 'hsl(0, 30%, 50%)'
   * ```
   */
  desaturate(percentage?: number): Color {
    return desaturateColor(this, percentage);
  }

  /**
   * Convert the color to a grayscale equivalent. The color's lightness is preserved,
   * but saturation is reduced to 0.
   *
   * @returns A new {@link Color} with the modified saturation.
   */
  grayscale(): Color {
    return colorToGrayscale(this);
  }

  /**
   * Mix this color with one or more other colors.
   *
   * @param others - Array of one or more other {@link Color}s or color inputs to mix with.
   * @param options - Optional {@link MixColorsOptions} mixing options and weights.
   * @returns A new {@link Color} that is the result of the mixing.
   */
  mix(others: readonly ValidColorInputFormat[], options?: MixColorsOptions): Color {
    if (others.length === 0) {
      return this.clone();
    }
    return mixColors([this, ...others.map((c) => new Color(c))], options);
  }

  /**
   * Blend this color with another color.
   *
   * @param other - The {@link Color} or color input to blend with.
   * @param options - Optional {@link BlendColorsOptions} for blend mode, space, and ratio.
   * @returns A new {@link Color} that is the result of the blending.
   */
  blend(other: ValidColorInputFormat, options?: BlendColorsOptions): Color {
    return blendColors(this, new Color(other), options);
  }

  /**
   * Average this color with one or more other colors by averaging their channels in the selected color space.
   *
   * @param others - Array of one or more other {@link Color}s or color inputs to average with.
   * @param options - Optional {@link AverageColorsOptions} mix space and weights.
   * @returns A new {@link Color} that is the result of the averaging.
   */
  average(others: readonly ValidColorInputFormat[], options?: AverageColorsOptions): Color {
    if (others.length === 0) {
      return this.clone();
    }
    return averageColors([this, ...others.map((c) => new Color(c))], options);
  }

  /**
   * Generate an interpolated gradient that begins with this color.
   *
   * @param stops - Additional {@link Color}s or color inputs to interpolate through.
   * @param options - Optional {@link ColorGradientOptions} for space, easing, interpolation, hue interpolation mode, and stop count.
   * @returns An array of {@link Color}s representing the full gradient including this color and the provided stops.
   */
  createGradientThrough(
    stops: readonly ValidColorInputFormat[],
    options?: ColorGradientOptions
  ): Color[] {
    return Color.createInterpolatedGradient([this, ...stops], options);
  }

  /**
   * Generate a gradient between this color and a target color.
   *
   * @param target - The final color ({@link Color} or color input) for the gradient.
   * @param options - Optional {@link ColorGradientOptions} for space, easing, interpolation, hue interpolation mode, and stop count.
   * @returns An array of {@link Color}s beginning with this color and ending with `target`.
   */
  createGradientTo(target: ValidColorInputFormat, options?: ColorGradientOptions): Color[] {
    return Color.createInterpolatedGradient([this, target], options);
  }

  /**
   * Get the base color and its complementary color (hues 180° apart).
   * The first element is the original color; the second is its complement.
   *
   * @returns Two new {@link Color}s representing the original color and its complement.
   *
   * @example
   * ```ts
   * const [base, comp] = new Color('#ff0000').getComplementaryColors();
   * base.toHex(); // '#ff0000'
   * comp.toHex(); // '#00ffff'
   * ```
   */
  getComplementaryColors(): [Color, Color] {
    return getComplementaryColors(this);
  }

  /**
   * Get the split-complementary harmony for the color. Returns the base
   * color and the two colors adjacent to its complement on the color wheel
   * (hues rotated by 150° and 210°).
   *
   * @returns Three new {@link Color}s representing the original color and its split-complementary colors.
   *
   * @example
   * ```ts
   * const [a, b, c] = new Color('#ff0000').getSplitComplementaryColors();
   * a.toHex(); // '#ff0000'
   * b.toHex(); // '#0080ff'
   * c.toHex(); // '#00ff80'
   * ```
   */
  getSplitComplementaryColors(): [Color, Color, Color] {
    return getSplitComplementaryColors(this);
  }

  /**
   * Get the triadic harmony for the color. Triadic colors are evenly spaced
   * 120° apart on the color wheel and provide strong contrast while
   * retaining balance.
   *
   * @returns Three new {@link Color}s representing the original color and its triadic harmony colors.
   *
   * @example
   * ```ts
   * const [a, b, c] = new Color('#ff0000').getTriadicHarmonyColors();
   * a.toHex(); // '#ff0000'
   * b.toHex(); // '#0000ff'
   * c.toHex(); // '#00ff00'
   * ```
   */
  getTriadicHarmonyColors(): [Color, Color, Color] {
    return getTriadicHarmonyColors(this);
  }

  /**
   * Get the square harmony for the color. Square harmonies use four colors
   * 90° apart, forming a square on the color wheel.
   *
   * @returns Four new {@link Color}s representing the original color and its square harmony colors.
   *
   * @example
   * ```ts
   * const [a, b, c, d] = new Color('#ff0000').getSquareHarmonyColors();
   * a.toHex(); // '#ff0000'
   * b.toHex(); // '#80ff00'
   * c.toHex(); // '#00ffff'
   * d.toHex(); // '#8000ff'
   * ```
   */
  getSquareHarmonyColors(): [Color, Color, Color, Color] {
    return getSquareHarmonyColors(this);
  }

  /**
   * Get the tetradic harmony for the color, consisting of two complementary
   * color pairs forming a rectangle on the color wheel.
   *
   * @returns Four new {@link Color}s representing the original color and its tetradic harmony colors.
   *
   * @example
   * ```ts
   * const [a, b, c, d] = new Color('#ff0000').getTetradicHarmonyColors();
   * a.toHex(); // '#ff0000'
   * b.toHex(); // '#ffff00'
   * c.toHex(); // '#00ffff'
   * d.toHex(); // '#0000ff'
   * ```
   */
  getTetradicHarmonyColors(): [Color, Color, Color, Color] {
    return getTetradicHarmonyColors(this);
  }

  /**
   * Get the analogous harmony for the color. These are colors adjacent to
   * the base hue, offering subtle contrast.
   *
   * @returns Five new {@link Color}s representing the original color and its analogous harmony colors.
   *
   * @example
   * ```ts
   * const [a, b, c, d, e] = new Color('#ff0000').getAnalogousHarmonyColors();
   * a.toHex(); // '#ff0000'
   * b.toHex(); // '#ff0080'
   * c.toHex(); // '#ff8000'
   * d.toHex(); // '#ff00ff'
   * e.toHex(); // '#ffff00'
   * ```
   */
  getAnalogousHarmonyColors(): [Color, Color, Color, Color, Color] {
    return getAnalogousHarmonyColors(this);
  }

  /**
   * Get a monochromatic harmony based on variations in lightness and
   * saturation of the base hue.
   *
   * @returns Five new {@link Color}s representing the original color and its monochromatic harmony colors.
   *
   * @example
   * ```ts
   * const [a, b, c, d, e] = new Color('#ff0000').getMonochromaticHarmonyColors();
   * a.toHex(); // '#ff0000'
   * b.toHex(); // '#ff6666'
   * c.toHex(); // '#990000'
   * d.toHex(); // '#ff0000'
   * e.toHex(); // '#e61919'
   * ```
   */
  getMonochromaticHarmonyColors(): [Color, Color, Color, Color, Color] {
    return getMonochromaticHarmonyColors(this);
  }

  /**
   * Get harmony colors based on the given {@link ColorHarmony} type.
   *
   * @param harmony - Harmony algorithm to use.
   * @returns A list of new {@link Color}s representing the original color and its harmony colors for the specified `harmony` option.
   */
  getHarmonyColors(harmony: ColorHarmony): Color[] {
    return getHarmonyColors(this, harmony);
  }

  /**
   * Returns a {@link ColorSwatch} of lighter and darker variants of the color. The
   * swatch has keys `100`–`900` and, by default, anchors the original color on the
   * stop that best matches its lightness (reported via the `mainStop` property).
   * Lower numbers are lighter and higher numbers are darker, with black and white
   * always centered on `500`. Passing `{ centerOn500: true }` forces the original
   * color onto the `500` stop regardless of its brightness. Passing
   * `{ extended: true }` adds midpoint stops (`50`, `150`, `250`, ... `950`) that
   * are interpolated between the base swatch colors while still anchoring the
   * base color on a `100`–`900` stop.
   *
   * @param options - Optional {@link ColorSwatchOptions} for requesting the extended swatch or customizing the anchor stop.
   * @returns A {@link ColorSwatch} containing lighter and darker {@link Color}s ranging from lightest to darkest.
   *
   * @example
   * ```ts
   * const swatch = new Color('#ff0000').getColorSwatch();
   * swatch.mainStop; // e.g. 500
   * const light = swatch[100]; // lightest shade
   * const dark = swatch[900];  // darkest shade
   *
   * const extendedSwatch = new Color('#ff0000').getColorSwatch({ extended: true, centerOn500: true });
   * extendedSwatch.mainStop; // 500
   * const midLight = extendedSwatch[150]; // halfway between 100 and 200
   * const darkest = extendedSwatch[950];  // darker than 900
   * ```
   */
  getColorSwatch(): ColorSwatch;
  getColorSwatch(options?: ColorSwatchOptions & { extended: true }): ExtendedColorSwatch;
  getColorSwatch(options?: ColorSwatchOptions): ColorSwatch;
  getColorSwatch(options?: ColorSwatchOptions): ColorSwatch {
    return getColorSwatch(this, options);
  }

  /**
   * Returns a {@link ColorPalette} built around the current color. The palette
   * includes a primary swatch, additional swatches derived from the selected
   * harmony as secondary colors, neutral colors, and color-matched semantic
   * swatches for statuses like info or warning.
   *
   * @param harmony - {@link ColorHarmony} used to generate secondary colors (default `'COMPLEMENTARY'`).
   * @param options - Optional {@link GenerateColorPaletteOptions} options for harmonizing neutral and semantic colors and
   * customizing swatch generation. Palette swatches default to centering the source color on the `500` stop; override
   * `options.swatchOptions.centerOn500` to change that anchoring if needed.
   * @returns A {@link ColorPalette} containing {@link ColorSwatch}s and different palette values, each with new {@link Color}s.
   *
   * @example
   * ```ts
   * const palette = new Color('#ff0000').getColorPalette();
   * palette.primary[500].toHex(); // base color
   * ```
   */
  getColorPalette(
    harmony: ColorHarmony = 'COMPLEMENTARY',
    options?: GenerateColorPaletteOptions
  ): ColorPalette {
    return generateColorPaletteFromBaseColor(this, harmony, options);
  }

  /**
   * Determine if this color is equal to another color. Allows for minor rounding differences.
   *
   * @param other The other {@link Color} or color input to compare against.
   * @returns `true` if the colors are equal within rounding tolerance.
   *
   * @example
   * ```ts
   * new Color('#ff0000').equals(new Color('rgb(255, 0, 0)')); // true
   * new Color('#ff0000').equals(new Color('#00ff00')); // false
   * ```
   */
  equals(other: ValidColorInputFormat): boolean {
    return areColorsEqual(this, new Color(other));
  }

  /**
   * Get the Delta E (perceptual difference) between this color and another color.
   * Uses CIEDE2000 by default but supports additional calculation methods and
   * configurable weighting for CIE94.
   *
   * @param other The other {@link Color} or color input to compare against.
   * @param options Optional {@link DeltaEOptions} to control the calculation.
   * Defaults to `'CIEDE2000'`. Configure `method` and related options to customize behavior.
   * @returns The Delta E value where higher numbers represent more visible difference.
   *
   * @example
   * ```ts
   * new Color('#ff0000').differenceFrom(new Color('#ff0100')); // ~0.034 (CIEDE2000)
   * new Color('#ff0000').differenceFrom(new Color('#00ff00'), { method: 'CIE76' }); // ~170.585
   * new Color('#ff6666').differenceFrom(new Color('#aa0000'), {
   *   method: 'CIE94',
   *   cie94Options: { kL: 2, kC: 1, kH: 1.5 },
   * });
   * ```
   */
  differenceFrom(other: ValidColorInputFormat, options?: DeltaEOptions): number {
    return getDeltaE(this, new Color(other), options);
  }

  /**
   * Determine if the color is visually dark using luminance.
   *
   * @param options - Optional {@link IsColorDarkOptions} to control the algorithm and threshold.
   *
   * @example
   * ```ts
   * new Color('#000000').isDark(); // true
   * new Color('#ffffff').isDark(); // false
   * new Color('#7f7f7f').isDark(); // true (just below the threshold)
   *
   * // Use legacy YIQ formula:
   * new Color('#ff0000').isDark({ colorDarknessMode: 'YIQ' });
   * ```
   */
  isDark(options?: IsColorDarkOptions): boolean {
    return isColorDark(this, options);
  }

  /**
   * Determine if the color is pure white or a very light off-white.
   *
   * @example
   * ```ts
   * new Color('#ffffff').isOffWhite(); // true
   * new Color('#f0f0f0').isOffWhite(); // true
   * new Color('#cccccc').isOffWhite(); // false
   * ```
   */
  isOffWhite(): boolean {
    return isColorOffWhite(this);
  }

  /**
   * Get the contrast ratio between this color and another color.
   *
   * @param other The other {@link Color} or color input to compare against.
   * @returns The WCAG contrast ratio between the two colors.
   */
  getContrastRatio(other: ValidColorInputFormat): number {
    return getWCAGContrastRatio(this, new Color(other));
  }

  /**
   * Get the readability score of this color against a given background color.
   *
   * NOTE: This is based on draft recommendations and is provided for advisory use only as WCAG 3 is not finalized.
   *
   * @param backgroundColor The background {@link Color} or color input to compare against.
   * @returns The APCA readability score as a number.
   */
  getReadabilityScore(backgroundColor: ValidColorInputFormat): number {
    return getAPCAReadabilityScore(this, new Color(backgroundColor));
  }

  /**
   * Get detailed readability metrics against a background color.
   *
   * Calculates the WCAG contrast ratio and determines whether this color meets
   * the specified conformance level and text size requirements.
   *
   * @param backgroundColor The background {@link Color} or color input to compare against.
   * @param options Optional {@link TextReadabilityOptions} for conformance level and text size.
   * @returns A {@link TextReadabilityReport} with the contrast ratio, required contrast, readability flag, and shortfall.
   *
   * @example
   * ```ts
   * new Color('#444444').getTextReadabilityReport(new Color('#bbbbbb'));
   * // { contrastRatio: 5.07, requiredContrast: 4.5, isReadable: true, shortfall: 0 }
   * ```
   */
  getTextReadabilityReport(
    backgroundColor: ValidColorInputFormat,
    options?: TextReadabilityOptions
  ): TextReadabilityReport {
    return getTextReadabilityReport(this, new Color(backgroundColor), options);
  }

  /**
   * Find the most readable text color against this color as a background.
   *
   * @param textColors A non-empty list of {@link Color} or color input candidate text colors.
   * @param options Optional {@link ReadabilityComparisonOptions} to pick the readability algorithm and WCAG inputs.
   * @returns The candidate color with the strongest readability against this color.
   */
  getMostReadableTextColor(
    textColors: readonly ValidColorInputFormat[],
    options?: ReadabilityComparisonOptions
  ): Color {
    return getMostReadableTextColorForBackground(
      this,
      textColors.map((c) => new Color(c)),
      options
    );
  }

  /**
   * Determine if this color meets WCAG contrast guidelines against a background color.
   *
   * @param backgroundColor The background {@link Color} or color input to compare against.
   * @param options Optional {@link TextReadabilityOptions} for conformance level and text size.
   * @returns `true` if the contrast ratio meets the specified requirements.
   *
   * @example
   * ```ts
   * new Color('#000000').isReadable(new Color('#ffffff')); // true
   * new Color('#777777').isReadable(new Color('#888888')); // false
   * ```
   */
  isReadableAsTextColor(
    backgroundColor: ValidColorInputFormat,
    options?: TextReadabilityOptions
  ): boolean {
    return isTextReadable(this, new Color(backgroundColor), options);
  }

  /**
   * Find the best background color for this color as foreground text.
   *
   * @param backgroundColors A non-empty list of candidate background {@link Color}s or color inputs.
   * @param options Optional {@link ReadabilityComparisonOptions} to pick the readability algorithm and WCAG inputs.
   * @returns The candidate background color that maximizes readability for this color.
   */
  getBestBackgroundColor(
    backgroundColors: readonly ValidColorInputFormat[],
    options?: ReadabilityComparisonOptions
  ): Color {
    return getBestBackgroundColorForText(
      this,
      backgroundColors.map((c) => new Color(c)),
      options
    );
  }

  /**
   * Estimate the color's correlated color temperature and descriptive label.
   *
   * @returns A {@link ColorTemperatureAndLabel} object with the temperature in Kelvin and a {@link ColorTemperatureLabel}.
   */
  getTemperature(): ColorTemperatureAndLabel {
    return getColorTemperature(this);
  }

  /**
   * Get the color's temperature as a string in Kelvin, optionally including a label for off-white colors.
   */
  getTemperatureAsString(options?: ColorTemperatureStringFormatOptions): string {
    return getColorTemperatureString(this, options);
  }

  /**
   * Approximate the human-friendly name of the color and its lightness.
   * Returns an object with a `name` (e.g. `'Red'`) and a
   * {@link ColorLightnessModifier} describing its lightness.
   *
   * @example
   * ```ts
   * new Color('#ff0000').getName(); // { name: 'Red', lightness: 'Normal' }
   * new Color('#006400').getName(); // { name: 'Green', lightness: 'Dark' }
   * ```
   */
  getName(): ColorNameAndLightness {
    return getBaseColorName(this);
  }

  /**
   * Get the color name and lightness as a single lowercase string.
   *
   * @example
   * ```ts
   * new Color('#ff0000').getNameAsString(); // 'red'
   * new Color('#87cefa').getNameAsString(); // 'light blue'
   * new Color('#006400').getNameAsString(); // 'dark green'
   * ```
   */
  getNameAsString(): string {
    const { name, lightness } = this.getName();
    if (lightness === 'Normal') {
      return name.toLowerCase();
    }
    return `${lightness} ${name}`.toLowerCase();
  }

  /**
   * Create a copy of the color.
   *
   * @returns A new {@link Color} instance with the same color value.
   */
  clone(): Color {
    return new Color({ ...this.color });
  }
}
