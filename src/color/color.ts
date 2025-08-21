import {
  ColorPalette,
  generateColorPaletteFromBaseColor,
  GenerateColorPaletteOptions,
} from '../palette/palette';
import { clampValue } from '../utils';
import { averageColors, blendColors, mixColors, MixColorsOptions } from './combinations';
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
import { getRandomColorRGBA, RandomColorOptions } from './random';
import { ColorSwatch, getColorSwatch } from './swatch';
import { getColorRGBAFromInput, isColorDark } from './utils';

/**
 * The base omni-color object.
 *
 * The {@link Color} class represents a specific color and provides methods for
 * converting between formats, performing manipulations like darkening or desaturating,
 * and generating harmonies and color palettes.
 *
 * {@link Color} instances are immutable - all operations except `setAlpha()` will return
 * a new {@link Color} instance representing the modified color.
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
  constructor(color?: ColorFormat | Color | string | null) {
    this.color = getColorRGBAFromInput(color);
  }

  /**
   * Create a {@link Color} with a random RGB value.
   *
   * @param options - Optional {@link RandomColorOptions} for extra controls on alpha, hue, and palette suitability.
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
    return this.color;
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
   * Get the color as a {@link ColorLCH} (CIELCh) `{ l, c, h }` object.
   */
  toLCH(): ColorLCH {
    return toLCH(this.color);
  }

  /**
   * Get the color as an `lch(l% c h)` string.
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
   * Get the color as an `oklch(l c h)` string.
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
   */
  setAlpha(alpha: number): Color {
    this.color.a = +clampValue(alpha, 0, 1).toFixed(3);
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
   * Convert the color to a grayscale equivalent. The color's lightness is preserved,
   * but saturation is reduced to 0.
   */
  grayscale(): Color {
    return colorToGrayscale(this);
  }

  /**
   * Mix this color with one or more other colors.
   *
   * @param others - Array of one or more other colors to mix with.
   * @param options - optional {@link MixColorsOptions} mixing options and weights.
   * @returns A new color that is the result of the mix.
   */
  mix(others: Color[], options?: MixColorsOptions): Color {
    if (others.length === 0) {
      return this.clone();
    }
    return mixColors([this, ...others], options);
  }

  blend(other: Color): Color {
    return blendColors(this, other);
  }

  average(others: Color[]): Color {
    if (others.length === 0) {
      return this.clone();
    }
    return averageColors([this, ...others]);
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
   * color and the two colors adjacent to its complement on the color wheel
   * (hues rotated by 150° and 210°).
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
   */
  getHarmonyColors(harmony: ColorHarmony): Color[] {
    return getHarmonyColors(this, harmony);
  }

  /**
   * Returns a {@link ColorSwatch} of lighter and darker variants of the color. The
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
   * Returns a {@link ColorPalette} built around the current color. The palette
   * includes a primary swatch, additional swatches derived from the selected
   * harmony as secondary colors, neutral colors, and color-matched semantic
   * swatches for statuses like info or warning.
   *
   * @param harmony - {@link ColorHarmony} used to generate secondary colors (default `ColorHarmony.COMPLEMENTARY`).
   * @param options - Optional {@link GenerateColorPaletteOptions} options for harmonizing neutral and semantic colors.
   *
   * @example
   * ```ts
   * const palette = new Color('#ff0000').getColorPalette();
   * palette.primary[500].toHex(); // base color
   * ```
   */
  getColorPalette(
    harmony: ColorHarmony = ColorHarmony.COMPLEMENTARY,
    options?: GenerateColorPaletteOptions
  ): ColorPalette {
    return generateColorPaletteFromBaseColor(this, harmony, options);
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
   * new Color('#ff0000').getName(); // { name: 'Red', lightness: ColorLightnessModifier.NORMAL }
   * new Color('#006400').getName(); // { name: 'Green', lightness: ColorLightnessModifier.DARK }
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
