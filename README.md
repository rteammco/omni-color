# omni-color

> ⚠️ This is a work-in-progress library. API and structure may change before 1.0.0.

A modern color manipulation and color scheme generation library for TypeScript/JavaScript projects.

[![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)](./LICENSE) [![CI](https://github.com/rteammco/omni-color/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/rteammco/omni-color/actions/workflows/ci.yml) [![Demo Deployed](https://github.com/rteammco/omni-color/actions/workflows/pages.yml/badge.svg?branch=main)](https://github.com/rteammco/omni-color/actions/workflows/pages.yml)

**Live demo:** https://rteammco.github.io/omni-color/

## 📦 Install

```bash
npm install omni-color
```

## ℹ️ Documentation

**_omni-color_** is built around the [`Color`](#types-color) class. [`Color`](#types-color) is immutable - all operations will return a new instance. Import directly from the package:

```ts
import { Color } from 'omni-color';

const color = new Color('#ff7f50');
const translucent = color.setAlpha(0.5);
const darker = translucent.darken();
const hex8String = darker.toHex8();
```

### Initialize Colors

#### `new Color(color?: Color | ColorFormat | string | null): Color`

_`constructor`_

- <ins>Returns</ins> a new [`Color`](#types-color) instance of the specified color input.
- <ins>Inputs</ins>:
  - `color` (optional) - an existing [`Color`](#types-color), any valid [`ColorFormat`](#types-color-format), a named CSS color, or any parsable color format (e.g. `"rgb(0,255,255)"`) including partial or exact matches of a [`ColorTemperatureLabel`](#types-color-temperature-label).
    - No input or passing in `null`/`undefined` generates a random color.
    - **Invalid inputs throw an exception.**

```ts
const red = new Color('#ff0000');
const byName = new Color('red');
const fromObj = new Color({ h: 210, s: 80, l: 40 });
const parsed = new Color('rgba(255, 0, 0, 0.5)');
const fromTemperature = new Color('Incandescent lamp');
const random = new Color();
```

#### `Color.random(options?: RandomColorOptions): Color`

_`static`_

- <ins>Returns</ins> a new [`Color`](#types-color) instance of a randomly-generated color.
- <ins>Inputs</ins>:
  - `options` (optional) - customize how the color will be randomized with `RandomColorOptions`:
    - `alpha` - the alpha value of the random color (0-1). If not specified, it will default to 1 (opaque) unless `randomizeAlpha` is `true`.
    - `randomizeAlpha` - if `true`, the alpha value of the generated color will be randomized (0-1). This option is ignored if an `alpha` value is explicitly provided.
    - `anchorColor` - randomize within the specified hue / named color family ([`BaseColorName`](#types)).
    - `paletteSuitable` - if `true`, the generated color will have moderate lightness and sufficient saturation to make them suitable for creating color palettes. This option will be ignored if `anchorColor` is `"Black"`, `"White"`, or `"Gray"`.

```ts
const random = Color.random();
const punchy = Color.random({ anchorColor: 'Orange', paletteSuitable: true });
const translucent = Color.random({ randomizeAlpha: true });
```

#### `Color.fromTemperature(temperature: number | ColorTemperatureLabel): Color`

_`static`_

- <ins>Returns</ins> an off-white [`Color`](#types-color) reflecting the given color temperature.
  - Kelvin to RGB conversion algorithm: https://tannerhelland.com/2012/09/18/convert-temperature-rgb-algorithm-code.html.
- <ins>Inputs</ins>:
  - `temperature` - a color temperature value in Kelvin (valid range is ~1000 to ~40000) or a [`ColorTemperatureLabel`](#types-color-temperature-label).

```ts
const daylight = Color.fromTemperature(6500);
const cozy = Color.fromTemperature('Warm tungsten');
```

### Color Information and Utils

#### `getName(): { name: BaseColorName; lightness: ColorLightnessModifier }`

- <ins>Returns</ins> a human-friendly [`BaseColorName`](#types-base-color-name) paired with a lightness descriptor: `type ColorLightnessModifier = "Light" | "Normal" | "Dark"`.

```ts
new Color('#ff0000').getName(); // { name: 'Red', lightness: 'Normal' }
new Color('#006400').getName(); // { name: 'Green', lightness: 'Dark' }
```

#### `getNameAsString(): string`

- <ins>Returns</ins> the color name and lightness as a lowercase string (e.g., `"dark green"`).

```ts
new Color('#ff0000').getNameAsString(); // 'red'
new Color('#87cefa').getNameAsString(); // 'light blue'
```

#### `equals(color: Color | ColorFormat | string): boolean`

- <ins>Returns</ins> `true` if the color matches another color within rounding tolerance.
- <ins>Inputs</ins>:
  - `color` - another [`Color`](#types-color), any [`ColorFormat`](#types-color-format), or a parsable color string to compare against.

```ts
new Color('#ff0000').equals(new Color('rgb(255, 0, 0)')); // true
new Color('#ff0000').equals('red'); // true
new Color('#ff0000').equals({ r: 0, g: 255, b: 0 }); // false
```

#### `isDark(options?: IsColorDarkOptions): boolean`

- <ins>Returns</ins> `true` if the color is considered visually dark based on luminance checks.
- <ins>Inputs</ins>:
  - `options` (optional) - customize the darkness algorithm with `IsColorDarkOptions`:
    - `colorDarknessMode` - the algorithm to use, either `"WCAG"` (default / recommended) or `"YIQ"` (legacy).
    - `wcagThreshold` - the threshold (0 to 1) for considering a color "dark" when using the WCAG algorithm. Default is 0.179. Only applicable to `"WCAG"` mode.
    - `yiqThreshold` - the threshold (0 to 255) for considering a color "dark" when using the YIQ algorithm. Default is 128. Only applicable to `"YIQ"` mode.

```ts
new Color('#000000').isDark(); // true
new Color('#ffffff').isDark(); // false
new Color('#ff0000').isDark({ colorDarknessMode: 'YIQ' });
```

#### `isOffWhite(): boolean`

- <ins>Returns</ins> `true` if the color is pure white or a very light off-white.

```ts
new Color('#ffffff').isOffWhite(); // true
new Color('#cccccc').isOffWhite(); // false
```

#### `getTemperature(): { temperature: number; label: ColorTemperatureLabel }`

- <ins>Returns</ins> the estimated correlated color temperature in Kelvin plus a [`ColorTemperatureLabel`](#types-color-temperature-label) describing the closest standard lighting condition.

```ts
new Color('#ff0000').getTemperature(); // { temperature: 2655, label: 'Incandescent lamp' }
```

#### `getTemperatureAsString(options?: ColorTemperatureStringFormatOptions): string`

- <ins>Returns</ins> the color temperature formatted as a string in Kelvin, optionally including the label when the color is close to the Planckian locus.
- <ins>Inputs</ins>:
  - `options` (optional) - `ColorTemperatureStringFormatOptions`:
    - `formatNumber` - set to `true` to format the temperature value with locale separators.

```ts
new Color('#ffffff').getTemperatureAsString(); // '6504 K (cloudy sky)'
new Color('#ffffff').getTemperatureAsString({ formatNumber: true }); // '6,504 K (cloudy sky)'
```

#### `getAlpha(): number`

- <ins>Returns</ins> the current alpha value (0–1).

```ts
new Color('#ff0000').getAlpha(); // 1
new Color('#ff000080').getAlpha(); // 0.5
```

#### `setAlpha(value: number): Color`

- <ins>Returns</ins> a new [`Color`](#types-color) with the specified alpha. Out-of-bounds alpha values will be clamped between 0 and 1.

```ts
new Color('#ff0000').setAlpha(0.25).toRGBAString(); // 'rgb(255 0 0 / 0.25)'
```

#### `clone(): Color`

- <ins>Returns</ins> a new [`Color`](#types-color) identical to the source instance.

```ts
const original = new Color('#ff7f50');
const copy = original.clone();
original.equals(copy); // true
```

### Color Formats and Conversions

#### `toHex(): ColorHex`

- <ins>Returns</ins> a [`ColorHex`](#types-color-hex) string in 6-digit `"#rrggbb"` form (alpha is ignored).

```ts
new Color('red').toHex(); // #ff0000
```

#### `toHex(): ColorHex`

- <ins>Returns</ins> a [`ColorHex`](#types-color-hex) string in 8-digit `"#rrggbbaa"` form, including the alpha channel.

```ts
new Color('rgba(0, 0, 255, 0.5)').toHex8(); // #0000ff80
```

#### `toRGB(): { r: number; g: number; b: number }`

- <ins>Returns</ins> a [`ColorRGB`](#types-color-rgb) object with 0–255 channel values.

```ts
new Color('#33cc99').toRGB(); // { r: 51, g: 204, b: 153 }
```

#### `toRGBA(): { r: number; g: number; b: number; a: number }`

- <ins>Returns</ins> a [`ColorRGBA`](#types-color-rgba) object with 0–255 RGB channels and alpha 0–1.

```ts
new Color('#33cc99').toRGBA(); // { r: 51, g: 204, b: 153, a: 1 }
```

#### `toRGBString(): string`

- <ins>Returns</ins> a CSS `"rgb(r g b)"` string.

```ts
new Color('#33cc99').toRGBString(); // 'rgb(51 204 153)'
```

#### `toRGBAString(): string`

- <ins>Returns</ins> a CSS `"rgb(r g b / a)"` string.

```ts
new Color('#33cc99').setAlpha(0.5).toRGBAString(); // 'rgb(51 204 153 / 0.5)'
```

#### `toHSL(): { h: number; s: number; l: number }`

- <ins>Returns</ins> a [`ColorHSL`](#types-color-hsl) object with hue 0–360 and saturation/lightness 0–100.

```ts
new Color('#663399').toHSL(); // { h: 270, s: 50, l: 40 }
```

#### `toHSLA(): { h: number; s: number; l: number; a: number }`

- <ins>Returns</ins> a [`ColorHSLA`](#types-color-hsla) object with hue 0–360, saturation/lightness 0–100, and alpha 0–1.

```ts
new Color('#663399').toHSLA(); // { h: 270, s: 50, l: 40, a: 1 }
```

#### `toHSLString(): string`

- <ins>Returns</ins> a CSS `"hsl(h s% l%)"` string.

```ts
new Color('#663399').toHSLString(); // 'hsl(270 50% 40%)'
```

#### `toHSLAString(): string`

- <ins>Returns</ins> a CSS `"hsl(h s% l% / a)"` string.

```ts
new Color('#663399').toHSLAString(); // 'hsl(270 50% 40% / 1)'
```

#### `toHSV(): { h: number; s: number; v: number }`

- <ins>Returns</ins> a [`ColorHSV`](#types-color-hsv) object with hue 0–360 and saturation/value 0–100.

```ts
new Color('#1e90ff').toHSV(); // { h: 210, s: 88, v: 100 }
```

#### `toHSVA(): { h: number; s: number; v: number; a: number }`

- <ins>Returns</ins> a [`ColorHSVA`](#types-color-hsva) object with hue 0–360, saturation/value 0–100, and alpha 0–1.

```ts
new Color('#1e90ff').toHSVA(); // { h: 210, s: 88, v: 100, a: 1 }
```

#### `toCMYK(): { c: number; m: number; y: number; k: number }`

- <ins>Returns</ins> a [`ColorCMYK`](#types-color-cmyk) object with channel values 0–100.

```ts
new Color('#00b7eb').toCMYK(); // { c: 100, m: 22, y: 0, k: 8 }
```

#### `toCMYKString(): string`

- <ins>Returns</ins> a CSS `"device-cmyk(c% m% y% k%)"` string.

```ts
new Color('#00b7eb').toCMYKString(); // 'device-cmyk(100% 22% 0% 8%)'
```

#### `toLAB(): { l: number; a: number; b: number }`

- <ins>Returns</ins> a [`ColorLAB`](#types-color-lab) object (CIELAB values).

```ts
new Color('#00b7eb').toLAB(); // { l: 69.373, a: -20.411, b: -36.677 }
```

#### `toLABString(): string`

- <ins>Returns</ins> a CSS `"lab(l% a b)"` string.

```ts
new Color('#00b7eb').toLABString(); // 'lab(69.373% -20.411 -36.677)'
```

#### `toLCH(): { l: number; c: number; h: number }`

- <ins>Returns</ins> a [`ColorLCH`](#types-color-lch) object (CIELCh values).

```ts
new Color('#00b7eb').toLCH(); // { l: 69.373, c: 41.974, h: 240.903 }
```

#### `toLCHString(): string`

- <ins>Returns</ins> a CSS `"lch(l% c h)"` string.

```ts
new Color('#00b7eb').toLCHString(); // 'lch(69.373% 41.974 240.903)'
```

#### `toOKLCH(): { l: number; c: number; h: number }`

- <ins>Returns</ins> a [`ColorOKLCH`](#types-color-oklch) object (OKLCH values).

```ts
new Color('#00b7eb').toOKLCH(); // { l: 0.727148, c: 0.140767, h: 227.27 }
```

#### `toOKLCHString(): string`

- <ins>Returns</ins> a CSS `"oklch(l c h)"` string.

```ts
new Color('#00b7eb').toOKLCHString(); // 'oklch(0.727148 0.140767 227.27)'
```

### Color Manipulations

#### `spin(degrees: number): Color`

- <ins>Returns</ins> a new [`Color`](#types-color) with its hue rotated in HSL space (wraps at 0–360).
- <ins>Inputs</ins>:
  - `degrees` - amount to rotate the hue by in degrees.

```ts
new Color('#ff0000').spin(180).toHex(); // '#00ffff'
```

#### `brighten(percentage = 10): Color`

- <ins>Returns</ins> a new [`Color`](#types-color) with increased HSL lightness.
- <ins>Inputs</ins>:
  - `percentage` (optional) - percent to raise lightness (default `10`).

```ts
new Color('#808080').brighten(20).toHex(); // '#b3b3b3'
```

#### `darken(percentage = 10): Color`

- <ins>Returns</ins> a new [`Color`](#types-color) with decreased HSL lightness.
- <ins>Inputs</ins>:
  - `percentage` (optional) - percent to lower lightness (default `10`).

```ts
new Color('#808080').darken(20).toHex(); // '#4d4d4d'
```

#### `saturate(percentage = 10): Color`

- <ins>Returns</ins> a new [`Color`](#types-color) with increased HSL saturation.
- <ins>Inputs</ins>:
  - `percentage` (optional) - percent to raise saturation (default `10`).

```ts
new Color('hsl(200, 40%, 50%)').saturate(20).toHSLString(); // 'hsl(200, 60%, 50%)'
```

#### `desaturate(percentage = 10): Color`

- <ins>Returns</ins> a new [`Color`](#types-color) with decreased HSL saturation.
- <ins>Inputs</ins>:
  - `percentage` (optional) - percent to lower saturation (default `10`).

```ts
new Color('hsl(200, 40%, 50%)').desaturate(20).toHSLString(); // 'hsl(200, 20%, 50%)'
```

#### `grayscale(): Color`

- <ins>Returns</ins> a new [`Color`](#types-color) converted to grayscale while preserving lightness.

```ts
new Color('#ff7f50').grayscale().toHex(); // '#a8a8a8'
```

### Color Combinations

#### `mix(others: Array<Color | ColorFormat | string>, options?: MixColorsOptions): Color`

- <ins>Returns</ins> a new [`Color`](#types-color) created by additively or subtractively mixing this color with additional colors. If `others` is empty, the original color will be returned.
- <ins>Inputs</ins>:
  - `others` - one or more [`Color`](#types-color), [`ColorFormat`](#types-color-format), or parsable color inputs to mix with this color.
  - `options` (optional) - `MixColorsOptions`:
    - `space` - the mix space: `"LINEAR_RGB" | "RGB" | "HSL" | "LCH" | "OKLCH"`.
    - `type` - the mix type: `"ADDITIVE" | "SUBTRACTIVE"`.
    - `weights` - per-color weights for how much each color is weighted during mixing. Number of weights must match the number of colors being mixed (i.e. `others.length + 1`). Colors are weighted equally by default.

```ts
const coral = new Color('#ff7f50');
const mixed = coral.mix(['red', '#00ff00', new Color('blue')]);
const weightedMix = coral.mix([new Color()], { space: 'LCH', weights: [2, 1] } });
```

#### `blend(other: Color | ColorFormat | string, options?: BlendColorsOptions): Color`

- <ins>Returns</ins> a new [`Color`](#types-color) that blends this color with another.
- <ins>Inputs</ins>:
  - `other` - the [`Color`](#types-color), [`ColorFormat`](#types-color-format), or parsable color input to blend with.
  - `options` (optional) - `BlendColorsOptions`:
    - `mode` - the blend mode: `"NORMAL" | "MULTIPLY" | "SCREEN" | "OVERLAY"`.
    - `space` - the blend space: `"RGB" | "HSL"`.
    - `ratio` - the blend ratio between `0` and `1` (default is `0.5`).

```ts
new Color('#ff0000').blend('blue'), { space: 'HSL' });
new Color('#00ff00').blend(new Color('#00ffff'), { mode: 'SCREEN', ratio: 0.25 });
```

#### `average(others: Array<Color | ColorFormat | string>, options?: AverageColorsOptions): Color`

- <ins>Returns</ins> a new [`Color`](#types-color) averaging channel values with other colors.
- <ins>Inputs</ins>:
  - `others` - one or more [`Color`](#types-color), [`ColorFormat`](#types-color-format), or parsable color inputs to average with this color.
  - `options` (optional) - `AverageColorsOptions`:
    - `space` - the averaging space: `"LINEAR_RGB" | "RGB" | "HSL" | "LCH" | "OKLCH"`.
    - `weights` - per-color weights for how much each color is weighted during averaging. Number of weights must match the number of colors being averaged (i.e. `others.length + 1`). Colors are weighted equally by default.

```ts
const base = new Color('#ff0000');
base.average([new Color('#00ff00'), new Color('#0000ff')], { space: 'RGB' }).toHex();
```

### Perceptual Difference (Delta E)

Delta E calculations measure how visually different two colors appear.

#### `differenceFrom(other: Color | ColorFormat | string, options?: DeltaEOptions): number`

- <ins>Returns</ins> the Delta E value where higher numbers represent a more visible difference. The value depends on the algorithm used.
- <ins>Inputs</ins>:
  - `other` - the [`Color`](#types-color), [`ColorFormat`](#types-color-format), or parsable color input to compare against.
  - `options` (optional) - `DeltaEOptions`:
    - `method` - the algorithm to use, either `"CIE76"`, `"CIE94"`, or `"CIEDE2000"` (default is `"CIEDE2000"`).
    - `cie94Options` - optional inputs for the `"CIE94"` algorithm only (does not apply to any other selected `method`), `CIE94Options`:
      - `kL` - lightness weighting factor. Defaults to `1`.
      - `kC` - chroma weighting factor. Defaults to `1`.
      - `kH` - hue weighting factor. Defaults to `1`.
      - `K1` - chroma scaling constant. Defaults to `0.045`.
      - `kL` - hue scaling constant. Defaults to `0.015`.

```ts
const base = new Color('#e63946');

base.differenceFrom(new Color('#e5383b')); // ~2.81 (CIEDE2000)
base.differenceFrom(new Color('#14a085'), { method: 'CIE76' }); // ~110.91
base.differenceFrom(new Color({ l: 70, c: 40, h: 210 }), { method: 'CIE94' }); // ~71.40
base.differenceFrom(new Color('#aa0000'), {
  method: 'CIE94',
  cie94Options: { kL: 2, kC: 1, kH: 1.5 },
});
```

### Gradients and Color Scales

#### `Color.createInterpolatedGradient(colors: Array<Color | ColorFormat | string>, options?: ColorGradientOptions): Color[]`

_`static`_

- <ins>Returns</ins> an array of new [`Color`](#types-color) instances interpolated between the provided anchors.
- <ins>Inputs</ins>:
  - `colors` - two or more [`Color`](#types-color), [`ColorFormat`](#types-color-format), or parsable color inputs to interpolate between.
    - **Fewer than 2 color inputs will throw an exception.**
  - `options` (optional) - `ColorGradientOptions`:
    - `stops` - number of colors to return (anchors included, defaults to `5`).
    - `space` - interpolation space: `"RGB" | "HSL" | "HSV" | "LCH" | "OKLCH"`.
    - `hueInterpolationMode` - strategy for hue interpolation in polar spaces: `"SHORTEST" | "LONGEST" | "INCREASING" | "DECREASING" | "RAW" | "CARTESIAN"` (default is `"SHORTEST"`).
    - `interpolation` - `'LINEAR'` (segment-based) or `'BEZIER'` (uses anchors as control points).
    - `easing` - `"LINEAR" | "EASE_IN" | "EASE_OUT" | "EASE_IN_OUT"` or a custom `(t) => number` easing function.
    - `clamp` - keep intermediate stops inside the selected gamut (default `true`).

```ts
const linearGradient = Color.createInterpolatedGradient(['#ff0000', '#00ff00', '#0000ff'], {
  stops: 7,
  space: 'OKLCH',
  easing: 'EASE_IN_OUT',
});
linearGradient.map((color) => color.toHex());
// ['#ff0000', '#ef6c00', '#99da00', '#00ff00', '#00db86', '#006ee6', '#0000ff']

const bezierGradient = Color.createInterpolatedGradient(['#f43f5e', '#fbbf24', '#22d3ee'], {
  stops: 5,
  interpolation: 'BEZIER',
  space: 'HSL',
});
bezierGradient.map((color) => color.toHex());
// ['#f43e5c', '#e16647', '#c1995e', '#70a67c', '#20d3ee']
```

#### `createGradientThrough(colors: Array<Color | ColorFormat | string>, options?: ColorGradientOptions): Color[]`

- <ins>Returns</ins> an array of new [`Color`](#types-color) instances interpolated through the provided anchors, ensuring every anchor is included as a stop.
- <ins>Inputs</ins>:
  - `colors` - two or more [`Color`](#types-color), [`ColorFormat`](#types-color-format), or parsable color inputs to pass through.
  - `options` (optional) - `ColorGradientOptions` (same as [`Color.createInterpolatedGradient`](#colorcreateinterpolatedgradientcolors-arraycolor--colorformat--string-options-colorgradientoptions-color)).

```ts
const throughGradient = Color.createGradientThrough(['#ff7f50', '#1a73e8', '#10b981'], { stops: 6 });
throughGradient.map((color) => color.toHex());
// ['#ff7f50', '#d04e8d', '#9b44c4', '#4d66da', '#26a1b4', '#10b981']
```

#### `createGradientTo(color: Color | ColorFormat | string, options?: ColorGradientOptions): Color[]`

- <ins>Returns</ins> an array of new [`Color`](#types-color) instances interpolated from the current color to the target color.
- <ins>Inputs</ins>:
  - `color` - the destination [`Color`](#types-color), [`ColorFormat`](#types-color-format), or parsable color input.
  - `options` (optional) - gradient options excluding `interpolation`, forwarded to [`Color.createInterpolatedGradient`](#colorcreateinterpolatedgradientcolors-arraycolor--colorformat--string-options-colorgradientoptions-color).

```ts
const [start, end] = new Color('#3b82f6').createGradientTo('#f472b6', { stops: 2 });
start.toHex(); // '#3b82f6'
end.toHex(); // '#f472b6'
```

### Color Harmonies

#### `getComplementaryColors(): [Color, Color]`

- <ins>Returns</ins> the base [`Color`](#types-color) and its complementary [`Color`](#types-color) (hues 180° apart).

```ts
const [base, complement] = new Color('#ff0000').getComplementaryColors();
base.toHex(); // '#ff0000'
complement.toHex(); // '#00ffff'
```

#### `getSplitComplementaryColors(): [Color, Color, Color]`

- <ins>Returns</ins> the base [`Color`](#types-color) plus two [`Color`](#types-color) hues adjacent to its complement (rotated ±30° from 180°).

```ts
const [base, split1, split2] = new Color('#ff0000').getSplitComplementaryColors();
base.toHex(); // '#ff0000'
split1.toHex(); // '#0080ff'
split2.toHex(); // '#00ff80'
```

#### `getTriadicHarmonyColors(): [Color, Color, Color]`

- <ins>Returns</ins> three evenly spaced [`Color`](#types-color) hues 120° apart on the color wheel.

```ts
const [base, triad1, triad2] = new Color('#ff0000').getTriadicHarmonyColors();
base.toHex(); // '#ff0000'
triad1.toHex(); // '#0000ff'
triad2.toHex(); // '#00ff00'
```

#### `getSquareHarmonyColors(): [Color, Color, Color, Color]`

- <ins>Returns</ins> four [`Color`](#types-color) hues forming a square on the color wheel (90° apart).

```ts
const [base, square1, square2, square3] = new Color('#ff0000').getSquareHarmonyColors();
base.toHex(); // '#ff0000'
square1.toHex(); // '#80ff00'
square2.toHex(); // '#00ffff'
square3.toHex(); // '#8000ff'
```

#### `getTetradicHarmonyColors(): [Color, Color, Color, Color]`

- <ins>Returns</ins> a rectangular harmony of four [`Color`](#types-color) instances made of two complementary pairs.

```ts
const [base, tetrad1, tetrad2, tetrad3] = new Color('#ff0000').getTetradicHarmonyColors();
base.toHex(); // '#ff0000'
tetrad1.toHex(); // '#ffff00'
tetrad2.toHex(); // '#00ffff'
tetrad3.toHex(); // '#0000ff'
```

#### `getAnalogousHarmonyColors(): [Color, Color, Color, Color, Color]`

- <ins>Returns</ins> five neighboring [`Color`](#types-color) hues around the base color (±30° steps).

```ts
const [base, analogous1, analogous2, analogous3, analogous4] = new Color('#ff0000').getAnalogousHarmonyColors();
base.toHex(); // '#ff0000'
analogous1.toHex(); // '#ff0080'
analogous2.toHex(); // '#ff8000'
analogous3.toHex(); // '#ff00ff'
analogous4.toHex(); // '#ffff00'
```

#### `getMonochromaticHarmonyColors(): [Color, Color, Color, Color, Color]`

- <ins>Returns</ins> five [`Color`](#types-color) variants of the base hue with differing lightness and saturation.

```ts
const [base, mono1, mono2, mono3, mono4] = new Color('#ff0000').getMonochromaticHarmonyColors();
base.toHex(); // '#ff0000'
mono1.toHex(); // '#ff6666'
mono2.toHex(); // '#990000'
mono3.toHex(); // '#ff0000'
mono4.toHex(); // '#e61919'
```

#### `getHarmonyColors(harmony: ColorHarmony): Color[]`

- <ins>Returns</ins> new [`Color`](#types-color) instances generated by the specified `ColorHarmony` algorithm.
- <ins>Inputs</ins>:
  - `harmony` - one of `"COMPLEMENTARY" | "SPLIT_COMPLEMENTARY" | "TRIADIC" | "SQUARE" | "TETRADIC" | "ANALOGOUS" | "MONOCHROMATIC"`.

```ts
new Color('#ff7f50').getHarmonyColors('TRIADIC').map((color) => color.toHex());
// ['#ff7f50', '#507fff', '#50ff7f']
```

### Swatches and Palettes

#### `getColorSwatch(options?: ColorSwatchOptions): ColorSwatch`

- <ins>Returns</ins> a [`ColorSwatch`](#types-color-swatch) of lighter and darker variants keyed `100`–`900`, reporting the anchored stop via `mainStop`. When `extended` is `true`, returns instead an [`ExtendedColorSwatch`](#types-extended-color-swatch) with half-steps `50`–`950` are added without moving the base color to a half-stop; otherwise, [`BaseColorSwatch`](#types-base-color-swatch).
- <ins>Inputs</ins>:
  - `options` (optional) - `ColorSwatchOptions`:
    - `centerOn500` - force the original color onto the `500` stop instead of dynamically anchoring by lightness (default is `false`).
    - `extended` - set to `true` to include midpoint stops `50`–`950` and return an [`ExtendedColorSwatch`](#types-extended-color-swatch).

```ts
const green = new Color('green');
const swatch = green.getColorSwatch({ centerOn500: true });
swatch.mainStop; // 500
swatch[500].equals(green); // true
swatch[100].toHex(); // lightest
swatch[900].toHex(); // darkest

const extendedSwatch = new Color('#008000').getColorSwatch({ extended: true });
extendedSwatch.mainStop; // 700
extendedSwatch[700].equals('#008000'); // true
extendedSwatch[50].toHex(); // lightest
extendedSwatch[500].toHex(); // middle
extendedSwatch[950].toHex(); // darkest
```

#### `getColorPalette(harmony = 'COMPLEMENTARY', options?: GenerateColorPaletteOptions): ColorPalette`

- <ins>Returns</ins> a complete [`ColorPalette`](#types-color-palette) containing the primary swatch, secondary swatches from the chosen harmony, neutral/tinted neutrals, and semantic swatches (`info`, `positive`, `negative`, `warning`, `special`).
- <ins>Inputs</ins>:
  - `harmony` (optional) - [`ColorHarmony`](#types-color-harmony) used to generate secondary colors (defaults to `'COMPLEMENTARY'`).
  - `options` (optional) - `GenerateColorPaletteOptions`:
    - `neutralHarmonization` - `tintChromaFactor` (fraction of chroma applied to neutrals) and `maxTintChroma` cap.
    - `semanticHarmonization` - `huePull` (blend semantic hues toward the base hue) and `chromaRange` bounds for semantic swatches.
    - `swatchOptions` - forwarded to swatch generation for every palette color; palettes center the source color on `500` by default, override `centerOn500` to opt into dynamic anchoring.

```ts
const palette = new Color('#ff7f50').getColorPalette('ANALOGOUS', {
  neutralHarmonization: { tintChromaFactor: 0.12 },
  semanticHarmonization: { huePull: 0.35 },
  swatchOptions: { centerOn500: false },
});
palette.info[500].toHex();
```

### Readability and Accessibility

#### `getContrastRatio(color: Color | ColorFormat | string): number`

- <ins>Returns</ins> the WCAG contrast ratio against another color (alpha-aware).
- <ins>Inputs</ins>:
  - `color` - the background [`Color`](#types-color), [`ColorFormat`](#types-color-format), or parsable color input.

```ts
new Color('#000000').getContrastRatio('#ffffff'); // 21
```

#### `getReadabilityScore(background: Color | ColorFormat | string): number`

**Note:** This implementation uses the `0.0.98G-4g` constants from the draft APCA recommendations. As WCAG 3 is not yet finalized, this score is experimental and provided for advisory use only.

- <ins>Returns</ins> the APCA readability score (Lc) against a background color.
- <ins>Inputs</ins>:
  - `background` - the background [`Color`](#types-color), [`ColorFormat`](#types-color-format), or parsable color input.

```ts
new Color('#1a73e8').getReadabilityScore('#ffffff'); // e.g. 71.61
```

#### `getTextReadabilityReport(background: Color | ColorFormat | string, options?: TextReadabilityOptions): TextReadabilityReport`

- <ins>Returns</ins> `{ contrastRatio, requiredContrast, isReadable, shortfall }` for WCAG levels `"AA" | "AAA"` and text sizes `"SMALL" | "LARGE"`.
- <ins>Inputs</ins>:
  - `background` - the background [`Color`](#types-color), [`ColorFormat`](#types-color-format), or parsable color input.
  - `options` (optional) - `TextReadabilityOptions` specifying WCAG level (`"AA" | "AAA"`) and text size (`"SMALL" | "LARGE"`).

```ts
new Color('#444').getTextReadabilityReport(new Color('#bbb'), { level: 'AA', size: 'LARGE' });
```

#### `isReadableAsTextColor(background: Color | ColorFormat | string, options?: TextReadabilityOptions): boolean`

- <ins>Returns</ins> `true` if the color meets the specified WCAG contrast requirements against a background color.
- <ins>Inputs</ins>:
  - `background` - the background [`Color`](#types-color), [`ColorFormat`](#types-color-format), or parsable color input.
  - `options` (optional) - `TextReadabilityOptions` specifying WCAG level and text size.

```ts
new Color('#000000').isReadableAsTextColor('#ffffff'); // true
```

#### `getMostReadableTextColor(candidateTextColors: Array<Color | ColorFormat | string>, options?: ReadabilityComparisonOptions): Color`

- <ins>Returns</ins> the candidate [`Color`](#types-color) with the strongest readability against the current color used as the background.
- <ins>Inputs</ins>:
  - `candidateTextColors` - one or more candidate text colors as [`Color`](#types-color), [`ColorFormat`](#types-color-format), or parsable color inputs.
    - **Empty list of candidate colors will throw an exception.**
  - `options` (optional) - `ReadabilityComparisonOptions` to choose between `"WCAG"` contrast or `"APCA"` scoring and pass optional WCAG text readability inputs.

```ts
const background = new Color('#121212');
const text = background.getMostReadableTextColor(['#ffffff', '#bbbbbb', '#00ffd0']);
text.toHex();
```

#### `getBestBackgroundColor(candidateBackgroundColors: Array<Color | ColorFormat | string>, options?: ReadabilityComparisonOptions): Color`

- <ins>Returns</ins> the background [`Color`](#types-color) that maximizes readability for the current color used as text.
- <ins>Inputs</ins>:
  - `candidateBackgroundColors` - one or more candidate background colors as [`Color`](#types-color), [`ColorFormat`](#types-color-format), or parsable color inputs.
    - **Empty list of candidate colors will throw an exception.**
  - `options` (optional) - `ReadabilityComparisonOptions` to choose between `"WCAG"` contrast or `"APCA"` scoring and pass optional WCAG text readability inputs.

```ts
const textColor = new Color('#ff7f50');
const background = textColor.getBestBackgroundColor(['#0d0d0d', '#1c1c1c', '#2a2a2a']);
background.toHex();
```

### Types

- <span id="types-color">`Color`</span> - the main, immutable color instance.
- <span id="types-base-color-name">`BaseColorName`</span> - base hue color names: `"Red" | "Orange" | "Yellow" | "Green" | "Blue" | "Purple" | "Pink" | "Black" | "Gray" | "White"`.
- <span id="types-color-format">`ColorFormat`</span> - any of the following supported color formats:
  - <span id="types-color-hex">`ColorHex`</span> - a string of the form `#rrggbb` or `#rrggbbaa` (not case-sensitive).
  - <span id="types-color-rgb">`ColorRGB`</span> - red, green, and blue channels. `{ r: number; g: number; b: number }` where `r`, `g`, and `b` are integers between 0 and 255.
  - <span id="types-color-rgba">`ColorRGBA`</span> - same as [`ColorRGB`](#types-color-rgb) but with an alpha channel. `{ r: number; g: number; b: number; a: number }` where `r`, `g`, and `b` are integers between 0 and 255 and `a` is a number between 0 and 1.
  - <span id="types-color-hsl">`ColorHSL`</span> - hue, saturation, and lightness channels. `{ h: number; s: number; l: number }` where `h` is a number between 0 and 360 (degrees), and `s` and `l` are numbers between 0 and 100 (percentages).
  - <span id="types-color-hsla">`ColorHSLA`</span> - same as [`ColorHSL`](#types-color-hsl) but with an alpha channel. `{ h: number; s: number; l: number; a: number }` where `h` is a number between 0 and 360 (degrees), `s` and `l` are numbers between 0 and 100 (percentages), and `a` is a number between 0 and 1.
  - <span id="types-color-hsv">`ColorHSV`</span> - hue, saturation, and value channels. `{ h: number; s: number; v: number }` where `h` is a number between 0 and 360 (degrees), and `s` and `v` are numbers between 0 and 100 (percentages).
  - <span id="types-color-hsva">`ColorHSVA`</span> - same as [`ColorHSV`](#types-color-hsv) but with an alpha channel. `{ h: number; s: number; v: number; a: number }` where `h` is a number between 0 and 360 (degrees), `s` and `v` are numbers between 0 and 100 (percentages), and `a` is a number between 0 and 1.
  - <span id="types-color-cmyk">`ColorCMYK`</span> - cyan, magenta, yellow, and key (black) channels. `{ c: number; m: number; y: number; k: number }` where `c`, `m`, `y`, and `k` are numbers between 0 and 100 (percentages).
  - <span id="types-color-lab">`ColorLAB`</span> - CIELAB color space with lightness and color-opponent dimensions. `{ l: number; a: number; b: number }` where `l` is a number between 0 and 100 (lightness), and `a` and `b` are numbers typically between -128 and 127 (color-opponent dimensions).
  - <span id="types-color-lch">`ColorLCH`</span> - CIELCh color space with lightness, chroma, and hue. `{ l: number; c: number; h: number }` where `l` is a number between 0 and 100 (lightness), `c` is a number representing chroma (typically 0–150+), and `h` is a number between 0 and 360 (hue in degrees).
  - <span id="types-color-oklch">`ColorOKLCH`</span> - OKLCH color space with lightness, chroma, and hue. `{ l: number; c: number; h: number }` where `l` is a number between 0 and 1 (lightness), `c` is a number representing chroma (typically 0–0.4), and `h` is a number between 0 and 360 (hue in degrees).
- <span id="types-color-temperature-label">`ColorTemperatureLabel`</span> - color temperature options: `"Candlelight" | "Incandescent lamp" | "Halogen lamp" | "Fluorescent lamp" | "Daylight" | "Cloudy sky" | "Shade" | "Blue sky"`
- <span id="types-base-color-swatch">`BaseColorSwatch`</span> - a swatch representing shades of the same color from 100 to 900 `{ 100: number; 200 number; ... 900: number }` where `100` is the lightest shade and `900` is the darkest shade.
- <span id="types-extended-color-swatch">`ExtendedColorSwatch`</span> - same as a [`ColorSwatch`](#types-color-swatch) but includes half-shades at 50, 100, 150, ..., 950. It is a superset of [`ColorSwatch`](#types-color-swatch).
- <span id="types-color-swatch">`ColorSwatch`</span> - `BaseColorSwatch | ExtendedColorSwatch`.
- <span id="types-color-palette">`ColorPalette`</span> - a collection of [`ColorSwatch`](#types-color-swatch)es representing a color palette for a specified [`ColorHarmony`](#types-color-harmony). Includes a `primary` swatch for the main (base) color, `secondaryColors` swatches depending on the color harmony, and swatches for `neutrals`, `tintedNeutrals` (neutrals slightly tinted towards the main color), and swatches for semantic colors `info`, `negative`, `positive`, `special`, and `warning`.
- <span id="types-color-harmony">`ColorHarmony`</span> - a type of color harmony to generate [`ColorPalette`](#types-color-palette): `"COMPLEMENTARY" | "SPLIT_COMPLEMENTARY" | "TRIADIC" | "SQUARE" | "TETRADIC" | "ANALOGOUS" | "MONOCHROMATIC"`

---

## 🛠 Dev

### First-Time Setup

From the project's root directory:

1. `npx simple-git-hooks` - run once to initiate the pre-commit checks that will run automatically.

### Run Demo

From the `demo/` directory:

- `npm install` - install the omni-color library from the project's root directory.
- `npm run dev` - run the demo locally.

_GitHub actions will automatically update the live demo on merges to the `main` branch._

### Run Tests and Checks

From the project's root directory:

- `npm run test` - run all tests.
- `npm run test:watch` - run all tests in watch mode.
- `npm run test -- src/color/__test__/validations.test.ts` - run a specific test file.
- `npm run lint` - run linter.
- `npm run typecheck` - run type checker.
