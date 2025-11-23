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

Every `Color` instance is immutable: all operations return a new `Color` rather than mutating the original. Import directly from the package:

```ts
import { Color } from 'omni-color';

const brand = new Color('#ff7f50');
const accessibleText = new Color('#1a1a1a').isReadableAsTextColor(brand);
```

### Constructing colors

#### `new Color(input?)`
- Accepts any CSS color string, hex (3/4/6/8 digit), RGB(A)/HSL(A)/HSV(A)/CMYK/LCH/OKLCH objects, another `Color`, or a named CSS color. Passing `null`/`undefined` generates a random color. Invalid input throws.
- Example:
  ```ts
  const red = new Color('#ff0000');
  const fromObj = new Color({ h: 210, s: 80, l: 40 });
  const parsed = new Color('rgba(255, 0, 0, 0.5)');
  ```

#### `Color.random(options?)`
- Returns a random color. Options include:
  - `anchorColor`: bias hue toward a named family (`'red'`, `'blue'`, `'green'`, `'gray'`, etc.).
  - `paletteSuitable`: keep saturation/lightness in palette-friendly ranges.
  - `alpha` / `randomizeAlpha`: force or randomize the alpha channel.
- Example:
  ```ts
  const punchy = Color.random({ anchorColor: 'orange', paletteSuitable: true });
  const translucent = Color.random({ randomizeAlpha: true });
  ```

#### `Color.fromTemperature(kelvinOrLabel)`
- Returns an off-white representing a color temperature (Kelvin or label such as `'Cloudy sky'` or `'Warm tungsten'`).
  ```ts
  const daylight = Color.fromTemperature(6500);
  const cozy = Color.fromTemperature('Warm tungsten');
  ```

### Conversions and formatting

Each converter returns a new representation without mutating the original color.

#### `toHex()` / `toHex8()`
- `toHex()` returns `#rrggbb`; `toHex8()` returns `#rrggbbaa`.
  ```ts
  new Color('rgba(255, 0, 0, 0.5)').toHex8(); // '#ff000080'
  ```

#### `toRGB()` / `toRGBA()` / `toRGBString()` / `toRGBAString()`
- Object getters return `{ r, g, b }` or `{ r, g, b, a }`; string versions return CSS `rgb(...)`/`rgba(...)`.
  ```ts
  const c = new Color('#33cc99');
  c.toRGBString(); // 'rgb(51, 204, 153)'
  c.toRGBA().a; // 1
  ```

#### `toHSL()` / `toHSLA()` / `toHSLString()` / `toHSLAString()`
- Returns HSL(A) object or CSS `hsl(...)`/`hsla(...)` string.
  ```ts
  new Color('#663399').toHSLAString(); // 'hsla(270, 50%, 40%, 1)'
  ```

#### `toHSV()` / `toHSVA()`
- Returns HSV or HSVA objects with hue 0–360 and saturation/value 0–100.

#### `toCMYK()` / `toCMYKString()`
- Returns CMYK object or `cmyk(c, m, y, k)` string.

#### `toLCH()` / `toLCHString()`
- Returns CIELCh object or `lch(l% c h)` string.

#### `toOKLCH()` / `toOKLCHString()`
- Returns OKLCH object or `oklch(l c h)` string.

#### `getAlpha()` / `setAlpha(value)`
- Read or update the alpha channel (clamped 0–1). `setAlpha` returns a new `Color`.
  ```ts
  new Color('#ff0000').setAlpha(0.25).toRGBAString(); // 'rgba(255, 0, 0, 0.25)'
  ```

#### `clone()`
- Returns an identical `Color` instance for safe reuse.

### Channel adjustments

#### `spin(degrees)`
- Rotates hue around the HSL wheel (wraps at 0/360).
  ```ts
  new Color('#ff0000').spin(180).toHex(); // '#00ffff'
  ```

#### `brighten(percent = 10)` / `darken(percent = 10)`
- Lighten or darken HSL lightness by a percentage.
  ```ts
  new Color('#808080').brighten(20).toHex(); // '#b3b3b3'
  new Color('#808080').darken(20).toHex();   // '#4d4d4d'
  ```

#### `saturate(percent = 10)` / `desaturate(percent = 10)`
- Increase or decrease HSL saturation.
  ```ts
  new Color('hsl(200, 40%, 50%)').saturate(20).toHSLString();   // 'hsl(200, 60%, 50%)'
  new Color('hsl(200, 40%, 50%)').desaturate(20).toHSLString(); // 'hsl(200, 20%, 50%)'
  ```

#### `grayscale()`
- Removes chroma while preserving lightness.

### Mixing, blending, and averaging

#### `mix(colors, options?)`
- Additively or subtractively mixes this color with one or more others.
- Options: `type` (`'ADDITIVE' | 'SUBTRACTIVE'`), `space` (`'RGB' | 'HSL' | 'LCH' | 'OKLCH'`), and per-color `weights`.
  ```ts
  const coral = new Color('#ff7f50');
  const mixed = coral.mix([new Color('rebeccapurple')], { space: 'LCH', weights: [2, 1] });
  mixed.toOKLCHString(); // stable mid-hue blend
  ```

#### `blend(color, options?)`
- Blends with another color in `RGB` or `HSL` using `NORMAL`, `MULTIPLY`, `SCREEN`, or `OVERLAY` modes; `ratio` controls weighting (defaults to 0.5).
  ```ts
  new Color('#ff0000').blend(new Color('#0000ff'), { mode: 'SCREEN', ratio: 0.25 }).toHex();
  ```

#### `average(colors, options?)`
- Averages channel values with optional `weights` in a selected `space`.
  ```ts
  const base = new Color('#ff0000');
  base.average([new Color('#00ff00'), new Color('#0000ff')], { space: 'RGB' }).toHex();
  ```

### Harmonies

All harmony helpers return arrays of new `Color` instances. Use the specialized helpers or the generic `getHarmonyColors(harmony)`.

#### Complementary schemes
- `getComplementaryColors()` returns `[base, complement]` (hues 180° apart).
- `getSplitComplementaryColors()` returns `[base, split1, split2]` (hues at ±150°/210°).

#### Triads and quads
- `getTriadicHarmonyColors()` → three evenly spaced hues.
- `getSquareHarmonyColors()` → four hues 90° apart.
- `getTetradicHarmonyColors()` → rectangular four-color harmony.

#### Analogous and monochromatic
- `getAnalogousHarmonyColors()` → five neighboring hues (±30° steps) around the base.
- `getMonochromaticHarmonyColors()` → five lightness variants of a single hue.

#### Generic helper
- `getHarmonyColors(harmony)` accepts any `ColorHarmony` enum (`'COMPLEMENTARY'`, `'SPLIT_COMPLEMENTARY'`, `'TRIADIC'`, `'SQUARE'`, `'TETRADIC'`, `'ANALOGOUS'`, `'MONOCHROMATIC'`).

### Swatches and palettes

#### `getColorSwatch(options?)`
- Generates lighter/darker stops keyed `100`–`900` (base at `500`). `{ extended: true }` adds half-steps `50`–`950`.
  ```ts
  const swatch = new Color('#ff0000').getColorSwatch({ extended: true });
  swatch[150].toHex(); // midway between 100 and 200
  ```

#### `getColorPalette(harmony = 'COMPLEMENTARY', options?)`
- Builds a full `ColorPalette`: primary swatch, secondary swatches from the chosen harmony, neutral and tinted neutrals, plus semantic swatches (`info`, `positive`, `negative`, `warning`, `special`).
- `GenerateColorPaletteOptions` let you tune:
  - `neutralHarmonization`: `tintChromaFactor` (fraction of chroma applied to neutrals) and `maxTintChroma` cap.
  - `semanticHarmonization`: `huePull` (blend semantic hues toward the base hue) and `chromaRange` bounds for semantic swatches.
  ```ts
  const palette = new Color('#ff7f50').getColorPalette('ANALOGOUS', {
    neutralHarmonization: { tintChromaFactor: 0.12 },
    semanticHarmonization: { huePull: 0.35 },
  });
  palette.info[500].toHex();
  ```

### Readability and accessibility

#### `getContrastRatio(color)`
- Returns the WCAG contrast ratio against another color (alpha-aware).

#### `getReadabilityScore(background)`
- Returns the APCA draft readability score (Lc) against a background color.

#### `getTextReadabilityReport(background, options?)`
- Returns `{ contrastRatio, requiredContrast, isReadable, shortfall }` for WCAG levels `AA`/`AAA` and text sizes `SMALL`/`LARGE`.
  ```ts
  new Color('#444').getTextReadabilityReport(new Color('#bbb'), { level: 'AA', size: 'LARGE' });
  ```

#### `isReadableAsTextColor(background, options?)`
- Convenience boolean wrapper around the readability report.

#### `getMostReadableTextColor(candidateTextColors, options?)`
- Returns the candidate text color with the strongest readability against the current color used as the background. Accepts `ReadabilityComparisonOptions` to choose between `WCAG` contrast or `APCA` scoring and pass optional WCAG text readability inputs.

#### `getBestBackgroundColor(candidateBackgroundColors, options?)`
- Returns the candidate background color that maximizes readability for the current color as text, using the same `ReadabilityComparisonOptions` as above.

### Perceptual difference (Delta E)

Use Delta E calculations to measure how visually different two colors appear. `Color.differenceFrom` compares against another `Color` or any accepted color input and defaults to the CIEDE2000 method. The optional `method` parameter accepts `'CIE76'`, `'CIE94'`, or `'CIEDE2000'`.

```ts
const reference = new Color('#e63946');

reference.differenceFrom('#e5383b'); // ~2.81 (CIEDE2000)
reference.differenceFrom('#14a085', 'CIE76'); // ~110.91
reference.differenceFrom({ l: 70, c: 40, h: 210 }, 'CIE94'); // ~71.40
```

### Names, temperature, and metadata

#### `getTemperature()` / `getTemperatureAsString(options?)`
- Estimate correlated color temperature (Kelvin plus label) or format it as a string.

#### `getName()` / `getNameAsString()`
- Returns a human-friendly color name and lightness descriptor; `getNameAsString` flattens to a lowercase string (e.g., `'dark green'`).

#### `equals(color)`
- Compares colors with rounding tolerance.

#### `isDark()` / `isOffWhite()`
- Luminance-based helpers for contrast decisions and off-white detection.

#### `clone()`
- Returns an identical `Color` instance.

### Types and exports

Import these TypeScript types from `omni-color` for safe typings:

- Color formats: `ColorFormat`, `ColorHex`, `ColorRGB`, `ColorRGBA`, `ColorHSL`, `ColorHSLA`, `ColorHSV`, `ColorHSVA`, `ColorCMYK`, `ColorLCH`, `ColorOKLCH`.
- Combination utilities: `MixColorsOptions`, `BlendColorsOptions`, `AverageColorsOptions`, `MixType`, `MixSpace`, `BlendMode`, `BlendSpace`.
- Harmonies, swatches, and palettes: `ColorHarmony`, `ColorSwatch`, `ExtendedColorSwatch`, `ColorSwatchOptions`, `ColorPalette`, `GenerateColorPaletteOptions`.
- Naming and temperature: `BaseColorName`, `ColorLightnessModifier`, `ColorNameAndLightness`, `ColorTemperatureAndLabel`, `ColorTemperatureLabel`, `ColorTemperatureStringFormatOptions`.
- Randomness and readability: `RandomColorOptions`, `TextReadabilityConformanceLevel`, `TextReadabilityTextSizeOptions`, `TextReadabilityOptions`, `TextReadabilityReport`, `ReadabilityAlgorithm`, `ReadabilityComparisonOptions`.


---


## 🛠 Dev

### First-Time Setup

From the project's root directory:

1. `npx simple-git-hooks` - run once to initiate the pre-commit checks that will run automatically.

### Run Demo

From the `demo/` directory:

* `npm install` - install the omni-color library from the project's root directory.
* `npm run dev` - run the demo locally.

*GitHub actions will automatically update the live demo on merges to the `main` branch.*

### Run Tests and Checks

From the project's root directory:

* `npm run test` - run all tests.
* `npm run test:watch` - run all tests in watch mode.
* `npm run test -- src/color/__test__/validations.test.ts` - run a specific test file.
* `npm run lint` - run linter.
* `npm run typecheck` - run type checker.
