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

function expectSimilarRGB(
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

      expectSimilarRGB(lightened.toRGB(), tinyLightened);
      expectSimilarRGB(darkened.toRGB(), tinyDarkened);
    });

    it('keeps saturation adjustments aligned for straightforward cases', () => {
      const base = new Color('hsl(210, 30%, 50%)');
      const saturated = base.saturate();
      const desaturated = base.desaturate();

      const tinySaturated = tinycolor('hsl(210, 30%, 50%)').saturate();
      const tinyDesaturated = tinycolor('hsl(210, 30%, 50%)').desaturate();

      expectSimilarRGB(saturated.toRGB(), tinySaturated);
      expectSimilarRGB(desaturated.toRGB(), tinyDesaturated);
    });

    it('spins hue similarly when moving around the wheel', () => {
      const base = new Color('#ff4500');
      const spun = base.spin(120);
      const spunTiny = tinycolor('#ff4500').spin(120);

      expectSimilarRGB(spun.toRGB(), spunTiny);
      expect(spun.getAlpha()).toBeCloseTo(spunTiny.getAlpha(), 5);
    });
  });
});
