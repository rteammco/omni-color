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
  });
});
