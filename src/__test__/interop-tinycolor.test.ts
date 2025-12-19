import tinycolor from 'tinycolor2';

import type { ColorRGB, ColorRGBA } from '../index';
import { Color } from '../index';

function tinycolorRGBToObj(value: tinycolor.ColorFormats.RGBA): ColorRGB | ColorRGBA {
  const alpha = Number.isFinite(value.a) ? value.a : undefined;
  if (alpha === undefined || alpha === 1) {
    return {
      r: value.r,
      g: value.g,
      b: value.b,
    };
  }

  return {
    r: value.r,
    g: value.g,
    b: value.b,
    a: alpha,
  };
}

function expectSimilarRGBAValues(
  omniValues: ColorRGB | ColorRGBA,
  tiny: tinycolor.Instance,
  tolerance = 1
) {
  const { r, g, b, a } = tiny.toRgb();
  expect(Math.abs(omniValues.r - r)).toBeLessThanOrEqual(tolerance);
  expect(Math.abs(omniValues.g - g)).toBeLessThanOrEqual(tolerance);
  expect(Math.abs(omniValues.b - b)).toBeLessThanOrEqual(tolerance);
  if ('a' in omniValues && omniValues.a !== undefined) {
    expect(omniValues.a).toBeCloseTo(a, 2);
  }
}

const formatDecimal = (value: number) => Number(value.toFixed(3));

function expectRoundedMatch(omniValue: number, tinyValue: number, tolerance = 1) {
  expect(Math.abs(omniValue - tinyValue)).toBeLessThanOrEqual(tolerance);
}

function getNumericValuesFromString(value: string): number[] {
  return value.match(/-?\\d*\\.?\\d+/g)?.map(Number) ?? [];
}

function expectComponentArraysClose(
  omniValues: number[],
  tinyValues: number[],
  tolerance = 1,
  alphaTolerance = 0.02
) {
  const omniHasAlpha = omniValues.length > 3;
  const tinyHasAlpha = tinyValues.length > 3;

  const alignedTinyValues = (() => {
    if (omniHasAlpha && !tinyHasAlpha) {
      return [...tinyValues, 1];
    }

    if (!omniHasAlpha && tinyHasAlpha) {
      return tinyValues.slice(0, omniValues.length);
    }

    return tinyValues;
  })();

  expect(omniValues.length).toBe(alignedTinyValues.length);

  omniValues.forEach((component, index) => {
    const componentTolerance =
      omniHasAlpha && index === omniValues.length - 1 ? alphaTolerance : tolerance;
    expect(Math.abs(component - alignedTinyValues[index])).toBeLessThanOrEqual(componentTolerance);
  });
}

function getHexesFromColors(colors: Color[]): string[] {
  return colors.map((color) => color.toHex());
}

function getHexesFromTinyColors(colors: tinycolor.Instance[]): string[] {
  return colors.map((color) => color.toHexString().toLowerCase());
}

function sortHexesByHue(hexes: string[]): string[] {
  return hexes
    .map((hex) => ({ hex: hex.toLowerCase(), hue: tinycolor(hex).toHsl().h ?? 0 }))
    .sort((a, b) => a.hue - b.hue)
    .map(({ hex }) => hex);
}

function expectHexArraysClose(omniHexes: string[], tinyHexes: string[], tolerance = 1) {
  const omniSorted = sortHexesByHue(omniHexes);
  const tinySorted = sortHexesByHue(tinyHexes);
  expect(omniSorted).toHaveLength(tinySorted.length);

  omniSorted.forEach((hex, index) => {
    const omniRgb = tinycolor(hex).toRgb();
    const tinyRgb = tinycolor(tinySorted[index]).toRgb();

    expect(Math.abs(omniRgb.r - tinyRgb.r)).toBeLessThanOrEqual(tolerance);
    expect(Math.abs(omniRgb.g - tinyRgb.g)).toBeLessThanOrEqual(tolerance);
    expect(Math.abs(omniRgb.b - tinyRgb.b)).toBeLessThanOrEqual(tolerance);
  });
}

function getHueSteps(hexes: string[]): number[] {
  const hues = sortHexesByHue(hexes).map((hex) => tinycolor(hex).toHsl().h ?? 0);
  const steps: number[] = [];

  for (let index = 1; index < hues.length; index += 1) {
    steps.push(Math.round(hues[index] - hues[index - 1]));
  }

  return steps;
}

function getLightnesses(hexes: string[]): number[] {
  return hexes.map((hex) => tinycolor(hex).toHsl().l ?? 0);
}

describe('Color interoperability with tinycolor2', () => {
  describe('parses and normalizes common inputs', () => {
    it('matches tinycolor outputs for hex, named colors, and hsl strings', () => {
      const hex = new Color('#6495ed');
      const hexTiny = tinycolor('#6495ed');
      expect(hex.toHex()).toBe(hexTiny.toHexString().toLowerCase());
      expect(hex.toRGB()).toEqual(tinycolorRGBToObj(hexTiny.toRgb()));

      const named = new Color('indigo');
      const namedTiny = tinycolor('indigo');
      expect(named.toHex()).toBe(namedTiny.toHexString().toLowerCase());
      expect(named.toRGB()).toEqual(tinycolorRGBToObj(namedTiny.toRgb()));

      const hslString = new Color('hsl(200, 50%, 40%)');
      const hslTiny = tinycolor('hsl(200, 50%, 40%)');
      expect(hslString.toHex()).toBe(hslTiny.toHexString().toLowerCase());
      expect(hslString.toRGB()).toEqual(tinycolorRGBToObj(hslTiny.toRgb()));
    });

    it('matches tinycolor outputs for shorthand, uppercase, percent, and clamped inputs', () => {
      const shortHex = new Color('#abc');
      const shortHexTiny = tinycolor('#abc');
      expect(shortHex.toHex()).toBe(shortHexTiny.toHexString().toLowerCase());
      expect(shortHex.toRGBA()).toMatchObject(tinycolorRGBToObj(shortHexTiny.toRgb()));

      const uppercaseHex = new Color('#ABCDEF');
      const uppercaseHexTiny = tinycolor('#ABCDEF');
      expect(uppercaseHex.toHex()).toBe(uppercaseHexTiny.toHexString().toLowerCase());
      expect(uppercaseHex.toRGBA()).toMatchObject(tinycolorRGBToObj(uppercaseHexTiny.toRgb()));

      // CSS percentages clamp to 0–100%, while tinycolor wraps them.
      const rgbPercent = new Color('rgb(120%, 50%, -10%)');
      const rgbPercentTiny = tinycolor('rgb(120%, 50%, -10%)');
      expect(rgbPercent.toHex()).toBe('#ff8000');
      expect(rgbPercentTiny.toHexString().toLowerCase()).toBe('#338000');
      expect(rgbPercent.toRGBA()).toEqual({ r: 255, g: 128, b: 0, a: 1 });
      expect(rgbPercent.toRGBA()).not.toEqual(tinycolorRGBToObj(rgbPercentTiny.toRgb()));

      const rgbaPercent = new Color('rgba(110%, 10%, 50%, 120%)');
      const rgbaPercentTiny = tinycolor('rgba(110%, 10%, 50%, 120%)');
      expect(rgbaPercent.toHex8()).toBe('#ff1a80ff');
      expect(rgbaPercentTiny.toHex8String().toLowerCase()).toBe('#1a1a80ff');
      expect(rgbaPercent.toRGBA()).toEqual({ r: 255, g: 26, b: 128, a: 1 });
      expect(rgbaPercent.toRGBA()).not.toEqual(tinycolorRGBToObj(rgbaPercentTiny.toRgb()));

      const hslClamped = new Color('hsl(370, 110%, -5%)');
      const hslClampedTiny = tinycolor('hsl(370, 110%, -5%)');
      expect(hslClamped.toHex()).toBe(hslClampedTiny.toHexString().toLowerCase());
      expect(hslClamped.toRGBA()).toMatchObject(tinycolorRGBToObj(hslClampedTiny.toRgb()));

      // Hue is normalized and saturation/alpha are clamped to CSS limits.
      const hslaClamped = new Color('hsla(-15, 105%, 55%, 1.2)');
      const hslaClampedTiny = tinycolor('hsla(-15, 105%, 55%, 1.2)');
      expect(hslaClamped.toHex8()).toBe('#ff1a53ff');
      expect(hslaClampedTiny.toHex8String().toLowerCase()).toBe('#ff1a1aff');
      expect(hslaClamped.toRGBA()).toEqual({ r: 255, g: 26, b: 83, a: 1 });
      expect(hslaClamped.toRGBA()).not.toEqual(tinycolorRGBToObj(hslaClampedTiny.toRgb()));
    });
  });

  describe('handles alpha channels consistently', () => {
    it('preserves hex8 and rgba transparency', () => {
      const hex8 = new Color('#1e90ff80');
      const hex8Tiny = tinycolor('#1e90ff80');
      expect(hex8.toHex8()).toBe(hex8Tiny.toHex8String().toLowerCase());
      expect(hex8.toRGBA()).toEqual(tinycolorRGBToObj(hex8Tiny.toRgb()));

      const rgba = new Color('rgba(12, 200, 180, 0.35)');
      const rgbaTiny = tinycolor('rgba(12, 200, 180, 0.35)');
      expect(rgba.toHex8()).toBe(rgbaTiny.toHex8String().toLowerCase());
      expect(rgba.toRGBA()).toEqual(tinycolorRGBToObj(rgbaTiny.toRgb()));
    });

    it('updates alpha for opaque inputs while clamping more accurately than tinycolor', () => {
      const hex = '#336699';

      const inRange = new Color(hex).setAlpha(0.4);
      const inRangeTiny = tinycolor(hex).setAlpha(0.4);
      expect(inRange.getAlpha()).toBeCloseTo(inRangeTiny.getAlpha(), 3);
      expect(inRange.toHex8()).toBe(inRangeTiny.toHex8String().toLowerCase());
      expect(inRange.toRGBA()).toEqual(tinycolorRGBToObj(inRangeTiny.toRgb()));

      const aboveRange = new Color(hex).setAlpha(1.25);
      const aboveRangeTiny = tinycolor(hex).setAlpha(1.25);
      expect(aboveRange.getAlpha()).toBeCloseTo(aboveRangeTiny.getAlpha(), 3);
      expect(aboveRange.toHex8()).toBe(aboveRangeTiny.toHex8String().toLowerCase());
      expect(aboveRange.toRGBA()).toMatchObject(tinycolorRGBToObj(aboveRangeTiny.toRgb()));

      const belowRange = new Color(hex).setAlpha(-0.2);
      const belowRangeTiny = tinycolor(hex).setAlpha(-0.2);
      expect(belowRange.getAlpha()).toBe(0);
      expect(belowRange.toHex8()).toBe('#33669900');
      expect(belowRange.toRGBA()).toEqual({ r: 51, g: 102, b: 153, a: 0 });
      expect(belowRangeTiny.getAlpha()).toBe(1);
      expect(belowRangeTiny.toHex8String().toLowerCase()).toBe('#336699ff');
      expect(belowRange.toHex8()).not.toBe(belowRangeTiny.toHex8String().toLowerCase());

      const nonFinite = new Color(hex).setAlpha(Number.NaN);
      const nonFiniteTiny = tinycolor(hex).setAlpha(Number.NaN);
      expect(nonFinite.getAlpha()).toBe(1);
      expect(nonFinite.toHex8()).toBe(nonFiniteTiny.toHex8String().toLowerCase());
      expect(nonFinite.toRGBA()).toMatchObject(tinycolorRGBToObj(nonFiniteTiny.toRgb()));

      const infinite = new Color(hex).setAlpha(Number.POSITIVE_INFINITY);
      const infiniteTiny = tinycolor(hex).setAlpha(Number.POSITIVE_INFINITY);
      expect(infinite.getAlpha()).toBe(1);
      expect(infinite.toHex8()).toBe(infiniteTiny.toHex8String().toLowerCase());
      expect(infinite.toRGBA()).toMatchObject(tinycolorRGBToObj(infiniteTiny.toRgb()));
    });

    it('adjusts alpha on transparent colors with clamping that mirrors valid tinycolor outputs', () => {
      const base = 'rgba(120, 80, 200, 0.35)';

      const inRange = new Color(base).setAlpha(0.6);
      const inRangeTiny = tinycolor(base).setAlpha(0.6);
      expect(inRange.getAlpha()).toBeCloseTo(inRangeTiny.getAlpha(), 3);
      expect(inRange.toHex8()).toBe(inRangeTiny.toHex8String().toLowerCase());
      expect(inRange.toRGBA()).toEqual(tinycolorRGBToObj(inRangeTiny.toRgb()));

      const aboveRange = new Color(base).setAlpha(2.4);
      const aboveRangeTiny = tinycolor(base).setAlpha(2.4);
      expect(aboveRange.getAlpha()).toBeCloseTo(aboveRangeTiny.getAlpha(), 3);
      expect(aboveRange.toHex8()).toBe(aboveRangeTiny.toHex8String().toLowerCase());
      expect(aboveRange.toRGBA()).toMatchObject(tinycolorRGBToObj(aboveRangeTiny.toRgb()));

      const nonFinite = new Color(base).setAlpha(Number.NEGATIVE_INFINITY);
      const nonFiniteTiny = tinycolor(base).setAlpha(Number.NEGATIVE_INFINITY);
      expect(nonFinite.getAlpha()).toBe(1);
      expect(nonFinite.toHex8()).toBe(nonFiniteTiny.toHex8String().toLowerCase());
      expect(nonFinite.toRGBA()).toMatchObject(tinycolorRGBToObj(nonFiniteTiny.toRgb()));
    });
  });

  describe('aligns basic HSL manipulations', () => {
    it('lightens and darkens in step with tinycolor defaults', () => {
      const base = new Color('#556b2f');
      const lightened = base.brighten();
      const darkened = base.darken();

      const tinyLightened = tinycolor('#556b2f').lighten();
      const tinyDarkened = tinycolor('#556b2f').darken();

      expectSimilarRGBAValues(lightened.toRGB(), tinyLightened);
      expectSimilarRGBAValues(darkened.toRGB(), tinyDarkened);
    });

    it('keeps saturation adjustments aligned for straightforward cases', () => {
      const base = new Color('hsl(210, 30%, 50%)');
      const saturated = base.saturate();
      const desaturated = base.desaturate();

      const tinySaturated = tinycolor('hsl(210, 30%, 50%)').saturate();
      const tinyDesaturated = tinycolor('hsl(210, 30%, 50%)').desaturate();

      expectSimilarRGBAValues(saturated.toRGB(), tinySaturated);
      expectSimilarRGBAValues(desaturated.toRGB(), tinyDesaturated);
    });

    it('spins hue similarly when moving around the wheel', () => {
      const base = new Color('#ff4500');
      const spun = base.spin(120);
      const spunTiny = tinycolor('#ff4500').spin(120);

      expectSimilarRGBAValues(spun.toRGB(), spunTiny);
      expect(spun.getAlpha()).toBeCloseTo(spunTiny.getAlpha(), 5);
    });

    it('tracks tinycolor manipulation amounts while maintaining alpha', () => {
      const opaqueBase = new Color('#4682b4');
      const translucentBase = new Color('rgba(70, 130, 180, 0.42)');

      const lightened = opaqueBase.brighten({ amount: 18 });
      const darkened = opaqueBase.darken({ amount: 22 });
      const saturated = opaqueBase.saturate({ amount: 35 });
      const desaturated = opaqueBase.desaturate({ amount: 48 });
      const grayscaled = opaqueBase.grayscale();
      const spun = opaqueBase.spin(-75);

      const tinyLightened = tinycolor('#4682b4').lighten(18);
      const tinyDarkened = tinycolor('#4682b4').darken(22);
      const tinySaturated = tinycolor('#4682b4').saturate(35);
      const tinyDesaturated = tinycolor('#4682b4').desaturate(48);
      const tinyGrayscaled = tinycolor('#4682b4').greyscale();
      const tinySpun = tinycolor('#4682b4').spin(-75);

      expectSimilarRGBAValues(lightened.toRGB(), tinyLightened);
      expectSimilarRGBAValues(darkened.toRGB(), tinyDarkened);
      expectSimilarRGBAValues(saturated.toRGB(), tinySaturated);
      expectSimilarRGBAValues(desaturated.toRGB(), tinyDesaturated);
      expectSimilarRGBAValues(grayscaled.toRGB(), tinyGrayscaled);
      expectSimilarRGBAValues(spun.toRGB(), tinySpun);

      const translucentLightened = translucentBase.brighten({ amount: 12 });
      const translucentDarkened = translucentBase.darken({ amount: 14 });
      const translucentSaturated = translucentBase.saturate({ amount: 20 });
      const translucentDesaturated = translucentBase.desaturate({ amount: 26 });
      const translucentGrayscaled = translucentBase.grayscale();
      const translucentSpun = translucentBase.spin(40);

      const tinyTranslucentLightened = tinycolor('rgba(70, 130, 180, 0.42)').lighten(12);
      const tinyTranslucentDarkened = tinycolor('rgba(70, 130, 180, 0.42)').darken(14);
      const tinyTranslucentSaturated = tinycolor('rgba(70, 130, 180, 0.42)').saturate(20);
      const tinyTranslucentDesaturated = tinycolor('rgba(70, 130, 180, 0.42)').desaturate(26);
      const tinyTranslucentGrayscaled = tinycolor('rgba(70, 130, 180, 0.42)').greyscale();
      const tinyTranslucentSpun = tinycolor('rgba(70, 130, 180, 0.42)').spin(40);

      expectSimilarRGBAValues(translucentLightened.toRGBA(), tinyTranslucentLightened);
      expectSimilarRGBAValues(translucentDarkened.toRGBA(), tinyTranslucentDarkened);
      expectSimilarRGBAValues(translucentSaturated.toRGBA(), tinyTranslucentSaturated);
      expectSimilarRGBAValues(translucentDesaturated.toRGBA(), tinyTranslucentDesaturated);
      expectSimilarRGBAValues(translucentGrayscaled.toRGBA(), tinyTranslucentGrayscaled);
      expectSimilarRGBAValues(translucentSpun.toRGBA(), tinyTranslucentSpun);

      expect(translucentLightened.getAlpha()).toBeCloseTo(translucentBase.getAlpha(), 5);
      expect(translucentDarkened.getAlpha()).toBeCloseTo(translucentBase.getAlpha(), 5);
      expect(translucentSaturated.getAlpha()).toBeCloseTo(translucentBase.getAlpha(), 5);
      expect(translucentDesaturated.getAlpha()).toBeCloseTo(translucentBase.getAlpha(), 5);
      expect(translucentGrayscaled.getAlpha()).toBeCloseTo(translucentBase.getAlpha(), 5);
      expect(translucentSpun.getAlpha()).toBeCloseTo(translucentBase.getAlpha(), 5);
    });
  });

  describe('keeps HSL/HSV conversions closely aligned with tinycolor', () => {
    it('matches tinycolor HSL/HSV outputs for opaque colors', () => {
      const color = new Color('#3498db');
      const tiny = tinycolor('#3498db');

      const hsl = color.toHSL();
      const hsla = color.toHSLA();
      const tinyHsl = tiny.toHsl();

      expectRoundedMatch(hsl.h, tinyHsl.h);
      expectRoundedMatch(hsl.s, tinyHsl.s * 100);
      expectRoundedMatch(hsl.l, tinyHsl.l * 100);

      expectRoundedMatch(hsla.h, tinyHsl.h);
      expectRoundedMatch(hsla.s, tinyHsl.s * 100);
      expectRoundedMatch(hsla.l, tinyHsl.l * 100);
      expect(hsla.a).toBeCloseTo(tinyHsl.a ?? 1, 2);

      const hsv = color.toHSV();
      const hsva = color.toHSVA();
      const tinyHsv = tiny.toHsv();

      expectRoundedMatch(hsv.h, tinyHsv.h);
      expectRoundedMatch(hsv.s, tinyHsv.s * 100);
      expectRoundedMatch(hsv.v, tinyHsv.v * 100);

      expectRoundedMatch(hsva.h, tinyHsv.h);
      expectRoundedMatch(hsva.s, tinyHsv.s * 100);
      expectRoundedMatch(hsva.v, tinyHsv.v * 100);
      expect(hsva.a).toBeCloseTo(tinyHsv.a ?? 1, 2);

      const tinyHslStringValues = getNumericValuesFromString(tiny.toHslString());
      const tinyHsvStringValues = getNumericValuesFromString(tiny.toHsvString());

      expectComponentArraysClose(
        getNumericValuesFromString(color.toHSLString()),
        tinyHslStringValues
      );
      expectComponentArraysClose(
        getNumericValuesFromString(color.toHSLAString()),
        tinyHslStringValues
      );
      expectComponentArraysClose(
        getNumericValuesFromString(
          `hsv(${formatDecimal(hsva.h)} ${formatDecimal(hsva.s)}% ${formatDecimal(hsva.v)}%)`
        ),
        tinyHsvStringValues
      );
      expectComponentArraysClose(
        getNumericValuesFromString(color.toRGBAString()),
        getNumericValuesFromString(tiny.toRgbString())
      );
    });

    it('matches tinycolor HSL/HSV outputs for colors with alpha', () => {
      const color = new Color('rgba(50, 100, 150, 0.42)');
      const tiny = tinycolor('rgba(50, 100, 150, 0.42)');

      const hsl = color.toHSL();
      const hsla = color.toHSLA();
      const tinyHsl = tiny.toHsl();

      expectRoundedMatch(hsl.h, tinyHsl.h);
      expectRoundedMatch(hsl.s, tinyHsl.s * 100);
      expectRoundedMatch(hsl.l, tinyHsl.l * 100);

      expectRoundedMatch(hsla.h, tinyHsl.h);
      expectRoundedMatch(hsla.s, tinyHsl.s * 100);
      expectRoundedMatch(hsla.l, tinyHsl.l * 100);
      expect(hsla.a).toBeCloseTo(tinyHsl.a ?? 1, 2);

      const hsv = color.toHSV();
      const hsva = color.toHSVA();
      const tinyHsv = tiny.toHsv();

      expectRoundedMatch(hsv.h, tinyHsv.h);
      expectRoundedMatch(hsv.s, tinyHsv.s * 100);
      expectRoundedMatch(hsv.v, tinyHsv.v * 100);

      expectRoundedMatch(hsva.h, tinyHsv.h);
      expectRoundedMatch(hsva.s, tinyHsv.s * 100);
      expectRoundedMatch(hsva.v, tinyHsv.v * 100);
      expect(hsva.a).toBeCloseTo(tinyHsv.a ?? 1, 2);

      const tinyHslStringValues = getNumericValuesFromString(tiny.toHslString());
      const tinyHsvStringValues = getNumericValuesFromString(tiny.toHsvString());

      expectComponentArraysClose(
        getNumericValuesFromString(color.toHSLAString()),
        tinyHslStringValues
      );
      expectComponentArraysClose(
        getNumericValuesFromString(
          `hsv(${formatDecimal(hsva.h)} ${formatDecimal(hsva.s)}% ${formatDecimal(
            hsva.v
          )}% / ${formatDecimal(hsva.a)})`
        ),
        tinyHsvStringValues
      );
      expectComponentArraysClose(
        getNumericValuesFromString(color.toRGBAString()),
        getNumericValuesFromString(tiny.toRgbString())
      );
    });
  });

  describe('keeps harmony helpers aligned with tinycolor where intended', () => {
    const baseHex = '#3498db';
    const baseColor = new Color(baseHex);
    const tinyBase = tinycolor(baseHex);

    it('tracks complement and triad variants within rounding tolerance', () => {
      expectHexArraysClose(
        getHexesFromColors(baseColor.getComplementaryColors()),
        [baseHex, tinyBase.complement().toHexString()]
      );

      expectHexArraysClose(
        getHexesFromColors(baseColor.getTriadicHarmonyColors()),
        getHexesFromTinyColors(tinyBase.triad())
      );
    });

    it('keeps analogous spreads evenly spaced instead of tinycolor’s tighter slices', () => {
      const analogousHexes = getHexesFromColors(baseColor.getAnalogousHarmonyColors());
      const tinyAnalogousHexes = getHexesFromTinyColors(tinyBase.analogous(5));

      getHueSteps(analogousHexes).forEach((step) => {
        expect(Math.abs(step - 30)).toBeLessThanOrEqual(1);
      });

      getHueSteps(tinyAnalogousHexes).forEach((step) => {
        expect(step).toBeLessThanOrEqual(15);
      });

      expect(sortHexesByHue(analogousHexes)).not.toEqual(sortHexesByHue(tinyAnalogousHexes));
    });

    it('avoids tinycolor monochromatic wrap-around that drops to near-black', () => {
      const monochromaticHexes = getHexesFromColors(baseColor.getMonochromaticHarmonyColors());
      const tinyMonochromaticHexes = getHexesFromTinyColors(tinyBase.monochromatic(5));

      const baseLightness = tinyBase.toHsl().l ?? 0;
      const omniLightnesses = getLightnesses(monochromaticHexes);
      const tinyLightnesses = getLightnesses(tinyMonochromaticHexes);

      expect(Math.min(...omniLightnesses)).toBeGreaterThan(baseLightness - 0.25);
      expect(Math.min(...tinyLightnesses)).toBeLessThan(Math.min(...omniLightnesses));

      // Tinycolor cycles lightness upward after wrapping through black, while omni-color
      // intentionally keeps the series centered around the base lightness without wrap-around.
      expect(Math.max(...tinyLightnesses)).toBeCloseTo(baseLightness, 3);

      expect(sortHexesByHue(monochromaticHexes)).not.toEqual(sortHexesByHue(tinyMonochromaticHexes));
    });

    it('retains rectangular tetrad spacing instead of tinycolor’s square polyad', () => {
      const tetradHexes = getHexesFromColors(baseColor.getTetradicHarmonyColors());
      const tinyTetradHexes = getHexesFromTinyColors(tinyBase.tetrad());

      const tetradSteps = getHueSteps(tetradHexes);
      expect(tetradSteps[0]).toBeCloseTo(60, 0);
      expect(tetradSteps[1]).toBeCloseTo(120, 0);
      expect(tetradSteps[2]).toBeCloseTo(60, 0);

      getHueSteps(tinyTetradHexes).forEach((step) => {
        expect(step).toBeCloseTo(90, 0);
      });
    });
  });
});
