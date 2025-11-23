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

Use the `Color` class to create colors, convert between formats, manipulate channels, evaluate readability, and generate production-ready palettes.

```ts
import { Color } from 'omni-color';

const base = new Color('#ff7f50');
const mix = base.mix([new Color('rebeccapurple')], { space: 'LCH', weights: [2, 1] });
const palette = base.getColorPalette('ANALOGOUS', {
  neutralHarmonization: { tintChromaFactor: 0.12 },
});

mix.toOKLCHString(); // 'oklch(0.73 0.15 42)'
palette.primary[500].toHex(); // '#ff7f50'
palette.info[500].toHex(); // palette-ready status colors
```

### Create colors
- Instantiate with any CSS color string, short/long hex (with or without alpha), RGB(A)/HSL(A)/HSV(A)/CMYK/LCH/OKLCH objects, another `Color`, or a named CSS color. Invalid input throws.
- Generate colors programmatically with `Color.random(options?)`, supporting:
  - `anchorColor` to bias hue toward a base color family (including grayscale options).
  - `paletteSuitable` to keep saturation/lightness in palette-friendly ranges.
  - `alpha` or `randomizeAlpha` to control transparency.
- Create temperature-based off-whites with `Color.fromTemperature(kelvinOrLabel)`.

### Convert and format
- Extract data in any supported model: `toHex()`, `toHex8()`, `toRGB()`, `toRGBA()`, `toHSL()`, `toHSLA()`, `toHSV()`, `toHSVA()`, `toCMYK()`, `toLCH()`, `toOKLCH()`.
- Get CSS-ready strings via `toRGBString()`, `toRGBAString()`, `toHSLString()`, `toHSLAString()`, `toCMYKString()`, `toLCHString()`, and `toOKLCHString()`.
- Read and set opacity with `getAlpha()` and `setAlpha()` (clamped to 0–1).
- Clone the current instance with `clone()`.

### Manipulate individual colors
- Rotate hue with `spin(degrees)`; lighten/darken with `brighten(percent?)` and `darken(percent?)`.
- Adjust saturation with `saturate(percent?)` and `desaturate(percent?)`, or remove chroma entirely with `grayscale()`.
- Test properties with `equals(color)`, `isDark()`, and `isOffWhite()`.
- Retrieve semantics: `getName()` / `getNameAsString()` for human-friendly names and `getTemperature()` / `getTemperatureAsString()` for correlated color temperature estimates.

### Mix, blend, and average
- `mix(colors, options?)` supports additive or subtractive mixing (`type`), color spaces (`space`: `RGB`, `HSL`, `LCH`, `OKLCH`), and per-color `weights`.
- `blend(color, options?)` blends in `RGB` or `HSL` space with modes `NORMAL`, `MULTIPLY`, `SCREEN`, or `OVERLAY`, and an adjustable `ratio`.
- `average(colors, options?)` averages channels in a chosen `space` with optional `weights`.

### Harmonies, swatches, and palettes
- Harmony helpers: `getComplementaryColors()`, `getSplitComplementaryColors()`, `getTriadicHarmonyColors()`, `getSquareHarmonyColors()`, `getTetradicHarmonyColors()`, `getAnalogousHarmonyColors()`, `getMonochromaticHarmonyColors()`, and the generic `getHarmonyColors(harmony)`.
- Swatches: `getColorSwatch({ extended?: boolean })` returns lighter/darker stops (`100`–`900`, plus midpoint stops when `extended` is true). `ExtendedColorSwatch` keys include half-steps like `150`, `250`, …, `950`.
- Palettes: `getColorPalette(harmony?, options?)` builds a comprehensive `ColorPalette` with primary/secondary swatches, neutrals, tinted neutrals, and semantic swatches (`info`, `positive`, `negative`, `warning`, `special`).
  - Configure palette generation with `GenerateColorPaletteOptions`:
    - `neutralHarmonization`: `tintChromaFactor` (fraction of chroma to apply to neutrals) and `maxTintChroma` cap.
    - `semanticHarmonization`: `huePull` (blend semantic hues toward the base hue) and `chromaRange` bounds for semantic swatches.

### Readability and accessibility
- `getContrastRatio(color)` returns WCAG contrast ratios (alpha-aware).
- `getReadabilityScore(backgroundColor)` computes APCA draft readability (Lc) values.
- `getTextReadabilityReport(backgroundColor, options?)` returns contrast ratio, required ratio, readability flag, and shortfall for WCAG `level` (`AA`/`AAA`) and text `size` (`SMALL`/`LARGE`).
- `isReadableAsTextColor(backgroundColor, options?)` is a convenience boolean wrapper around the report.

### Public types and exports
- All conversion interfaces are exported for typing: `ColorRGB`, `ColorRGBA`, `ColorHSL`, `ColorHSLA`, `ColorHSV`, `ColorHSVA`, `ColorCMYK`, `ColorLCH`, `ColorOKLCH`, `ColorHex`, `ColorFormat`.
- Combinations and palette options are exported as TypeScript types: `MixColorsOptions`, `BlendColorsOptions`, `AverageColorsOptions`, `MixType`, `MixSpace`, `BlendMode`, `BlendSpace`, `ColorHarmony`, `ColorSwatch`, `ExtendedColorSwatch`, `ColorSwatchOptions`, `ColorPalette`, `GenerateColorPaletteOptions`.
- Naming, randomness, temperature, and readability helpers are typed via `BaseColorName`, `ColorLightnessModifier`, `ColorNameAndLightness`, `RandomColorOptions`, `ColorTemperatureAndLabel`, `ColorTemperatureLabel`, `ColorTemperatureStringFormatOptions`, `TextReadabilityConformanceLevel`, `TextReadabilityTextSizeOptions`, `TextReadabilityOptions`, and `TextReadabilityReport`.


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