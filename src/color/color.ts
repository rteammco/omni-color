import {
  ColorPalette,
  generateColorPaletteFromBaseColor,
  SemanticColorHarmonizationOptions,
} from '../palette/palette';
import {
  toCMYK,
  toHex,
  toHex8,
  toHSL,
  toHSLA,
  toHSV,
  toHSVA,
  toLCH,
  toOKLCH,
  toRGB,
} from './conversions';
import {
  cmykToString,
  ColorCMYK,
  ColorFormat,
  ColorHex,
  ColorHSL,
  ColorHSLA,
  ColorHSV,
  ColorHSVA,
  ColorLCH,
  ColorOKLCH,
  ColorRGB,
  ColorRGBA,
  hslaToString,
  hslToString,
  lchToString,
  oklchToString,
  rgbaToString,
  rgbToString,
} from './formats';
import {
  ColorHarmony,
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
import { ColorLightnessModifier, ColorNameAndLightness, getBaseColorName } from './names';
import { ColorSwatch, getColorSwatch } from './swatch';
import { getColorRGBAFromInput, getRandomColorRGBA, isColorDark } from './utils';

export class Color {
  private color: ColorRGBA;

  /**
   * Create a new {@link Color} instance.
   *
   * The input can be any CSS color format: a hex string, color object,
   * {@link Color} instance, or a named color such as `'lightblue'` or
   * `'green'`. Passing `null` or `undefined` results in a random color.
   * Invalid input will throw an error.
   *
   * @param color - Initial color value.
   *
   * @example
   * ```ts
   * const red = new Color('#ff0000');
   * const named = new Color('lightblue');
   * const sameRed = new Color(red.toRGB());
   * const random = new Color();
   * ```
   */
  constructor(color?: ColorFormat | Color | string | null) {
    this.color = getColorRGBAFromInput(color);
  }

  /**
   * Create a {@link Color} with a random RGB value.
   *
   * @example
   * ```ts
   * const color = Color.random();
   * ```
   */
  static random(): Color {
    return new Color(getRandomColorRGBA());
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
   */
  toHex8(): ColorHex {
    return toHex8(this.color);
  }

  /**
   * Get the color as an `{ r, g, b }` object.
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
   * Get the color as an `{ r, g, b, a }` object.
   */
  toRGBA(): ColorRGBA {
    return this.color;
  }

  /**
   * Get the color as a CSS `rgba(r, g, b, a)` string.
   */
  toRGBAString(): string {
    return rgbaToString(this.toRGBA());
  }

  /**
   * Get the color as an `{ h, s, l }` object.
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
   * Get the color as an `{ h, s, l, a }` object.
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
   * Get the color as an HSV object `{ h, s, v }` where `h` is 0–360 and `s`
   * and `v` are 0–100.
   */
  toHSV(): ColorHSV {
    return toHSV(this.color);
  }

  /**
   * Get the color as an HSVA object `{ h, s, v, a }`.
   */
  toHSVA(): ColorHSVA {
    return toHSVA(this.color);
  }

  /**
   * Get the color as a CMYK object `{ c, m, y, k }` where each channel is
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
   * Get the color as a CIELCH object `{ l, c, h }`.
   */
  toLCH(): ColorLCH {
    return toLCH(this.color);
  }

  /**
   * Get the color as an `lch(l c h / a)` string.
   */
  toLCHString(): string {
    return lchToString(this.toLCH());
  }

  /**
   * Get the color as an OKLCH object `{ l, c, h }`.
   */
  toOKLCH(): ColorOKLCH {
    return toOKLCH(this.color);
  }

  /**
   * Get the color as an `oklch(l c h / a)` string.
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
   * Set the alpha channel of the color.
   *
   * @param alpha - New alpha value between `0` and `1`.
   * @throws If `alpha` is outside the valid range.
   */
  setAlpha(alpha: number): Color {
    if (typeof alpha !== 'number' || alpha < 0 || alpha > 1) {
      throw new Error('[setAlpha] alpha must be a number between 0 and 1');
    }
    this.color.a = +alpha.toFixed(3);
    return this;
  }

  /**
   * Rotate the hue of the color by a number of degrees. Hue values range
   * from 0–360 where 0 is red, 120 is green and 240 is blue. Values wrap
   * around the circle when they exceed that range.
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
   * Convert the color to a grayscale equivalent.
   */
  grayscale(): Color {
    return colorToGrayscale(this);
  }

  /**
   * Get the base color and its complementary color (hues 180° apart).
   * The first element is the original color; the second is its complement.
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
   * color and the two colors adjacent to its complement on the color wheel.
   *
   * @example
   * ```ts
   * const [base, left, right] = new Color('#ff0000').getSplitComplementaryColors();
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
   * @example
   * ```ts
   * const [a, b, c] = new Color('#ff0000').getTriadicHarmonyColors();
   * ```
   */
  getTriadicHarmonyColors(): [Color, Color, Color] {
    return getTriadicHarmonyColors(this);
  }

  /**
   * Get the square harmony for the color. Square harmonies use four colors
   * 90° apart, forming a square on the color wheel.
   *
   * @example
   * ```ts
   * const [a, b, c, d] = new Color('#ff0000').getSquareHarmonyColors();
   * ```
   */
  getSquareHarmonyColors(): [Color, Color, Color, Color] {
    return getSquareHarmonyColors(this);
  }

  /**
   * Get the tetradic harmony for the color, consisting of two complementary
   * color pairs forming a rectangle on the color wheel.
   *
   * @example
   * ```ts
   * const [a, b, c, d] = new Color('#ff0000').getTetradicHarmonyColors();
   * ```
   */
  getTetradicHarmonyColors(): [Color, Color, Color, Color] {
    return getTetradicHarmonyColors(this);
  }

  /**
   * Get the analogous harmony for the color. These are colors adjacent to
   * the base hue, offering subtle contrast.
   *
   * @example
   * ```ts
   * const [a, b, c, d, e] = new Color('#ff0000').getAnalogousHarmonyColors();
   * ```
   */
  getAnalogousHarmonyColors(): [Color, Color, Color, Color, Color] {
    return getAnalogousHarmonyColors(this);
  }

  /**
   * Get a monochromatic harmony based on variations in lightness and
   * saturation of the base hue.
   *
   * @example
   * ```ts
   * const [a, b, c, d, e] = new Color('#ff0000').getMonochromaticHarmonyColors();
   * ```
   */
  getMonochromaticHarmonyColors(): [Color, Color, Color, Color, Color] {
    return getMonochromaticHarmonyColors(this);
  }

  /**
   * Get harmony colors based on the given {@link ColorHarmony} type.
   *
   * @param harmony - Harmony algorithm to use.
   */
  getHarmonyColors(harmony: ColorHarmony): Color[] {
    return getHarmonyColors(this, harmony);
  }

  /**
   * Generate a swatch of lighter and darker variants of the color. The
   * returned object has keys `100`–`900` where `500` is the base color, lower
   * numbers are lighter and higher numbers are darker.
   *
   * @example
   * ```ts
   * const swatch = new Color('#ff0000').getColorSwatch();
   * const light = swatch[100]; // lightest shade
   * const dark = swatch[900];  // darkest shade
   * ```
   */
  getColorSwatch(): ColorSwatch {
    return getColorSwatch(this);
  }

  /**
   * Build a semantic color palette based on the current color. The palette
   * includes a primary swatch, additional swatches derived from the selected
   * harmony as secondary colors, neutral colors, background/foreground colors
   * and semantic swatches for statuses like info or warning.
   *
   * @param harmony - Harmony type to generate from (default `ColorHarmony.COMPLEMENTARY`).
   * @param semanticColorHarmonizationOptions - Optional semantic adjustments.
   *
   * @example
   * ```ts
   * const palette = new Color('#ff0000').getColorPalette();
   * palette.primary[500].toHex(); // base color
   * ```
   */
  getColorPalette(
    harmony: ColorHarmony = ColorHarmony.COMPLEMENTARY,
    semanticColorHarmonizationOptions?: SemanticColorHarmonizationOptions
  ): ColorPalette {
    return generateColorPaletteFromBaseColor(this, harmony, semanticColorHarmonizationOptions);
  }

  /**
   * Determine if the color is visually dark using luminance.
   *
   * @example
   * ```ts
   * new Color('#000000').isDark(); // true
   * new Color('#ffffff').isDark(); // false
   * new Color('#7f7f7f').isDark(); // true (just below the threshold)
   * ```
   */
  isDark(): boolean {
    return isColorDark(this);
  }

  /**
   * Approximate the human-friendly name of the color and its lightness.
   * Returns an object with a `name` (e.g. `'Red'`) and a
   * {@link ColorLightnessModifier} describing its lightness.
   *
   * @example
   * ```ts
   * new Color('#ff0000').getName();
   * // { name: 'Red', lightness: ColorLightnessModifier.NORMAL }
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
    if (lightness === ColorLightnessModifier.NORMAL) {
      return name.toLowerCase();
    }
    return `${lightness} ${name}`.toLowerCase();
  }

  /**
   * Create a copy of the color.
   */
  clone(): Color {
    return new Color(this.color);
  }
}
