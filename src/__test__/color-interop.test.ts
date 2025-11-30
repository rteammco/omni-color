import chroma from 'chroma-js';

import { Color } from '../index';

describe('Color interoperability with chroma-js', () => {
  describe('parses and normalizes inputs the same way', () => {
    it('matches chroma-js hex and rgb outputs across formats', () => {
      const baseHex = new Color('#336699');
      const baseHexChroma = chroma('#336699');
      expect(baseHex.toHex()).toBe(baseHexChroma.hex().toLowerCase());
      expect(baseHex.toRGB()).toEqual({
        r: baseHexChroma.rgb()[0],
        g: baseHexChroma.rgb()[1],
        b: baseHexChroma.rgb()[2],
      });

      const namedColor = new Color('rebeccapurple');
      const namedColorChroma = chroma('rebeccapurple');
      expect(namedColor.toHex()).toBe(namedColorChroma.hex().toLowerCase());
      expect(namedColor.toRGB()).toEqual({
        r: namedColorChroma.rgb()[0],
        g: namedColorChroma.rgb()[1],
        b: namedColorChroma.rgb()[2],
      });

      const hslStringColor = new Color('hsl(210, 50%, 40%)');
      const hslStringChroma = chroma('hsl(210, 50%, 40%)');
      expect(hslStringColor.toHex()).toBe(hslStringChroma.hex().toLowerCase());
      expect(hslStringColor.toRGB()).toEqual({
        r: hslStringChroma.rgb()[0],
        g: hslStringChroma.rgb()[1],
        b: hslStringChroma.rgb()[2],
      });
    });
  });

  describe('handles alpha channels similarly', () => {
    it('keeps alpha values aligned for hex8 and rgba inputs', () => {
      const hexWithAlpha = new Color('#1e90ff80');
      const hexWithAlphaChroma = chroma('#1e90ff80');
      expect(hexWithAlpha.toHex8()).toBe(hexWithAlphaChroma.hex('rgba').toLowerCase());
      expect(hexWithAlpha.toRGBA()).toEqual({
        r: hexWithAlphaChroma.rgba()[0],
        g: hexWithAlphaChroma.rgba()[1],
        b: hexWithAlphaChroma.rgba()[2],
        a: expect.closeTo(hexWithAlphaChroma.rgba()[3], 2),
      });

      const rgbaStringColor = new Color('rgba(12, 200, 180, 0.35)');
      const rgbaStringChroma = chroma('rgba(12, 200, 180, 0.35)');
      expect(rgbaStringColor.toHex8()).toBe(rgbaStringChroma.hex('rgba').toLowerCase());
      expect(rgbaStringColor.toRGBA()).toEqual({
        r: rgbaStringChroma.rgba()[0],
        g: rgbaStringChroma.rgba()[1],
        b: rgbaStringChroma.rgba()[2],
        a: expect.closeTo(rgbaStringChroma.rgba()[3], 2),
      });
    });
  });

  describe('agrees on HSL and HSV math', () => {
    it('matches hue, saturation, and lightness/brightness values', () => {
      const vividOrange = new Color('#ff7f0e');
      const vividOrangeChroma = chroma('#ff7f0e');
      const vividOrangeHsl = vividOrangeChroma.hsl();
      const vividOrangeHslFromOmniColor = vividOrange.toHSL();
      expect(vividOrangeHslFromOmniColor.h).toBeCloseTo(vividOrangeHsl[0], 0);
      expect(vividOrangeHslFromOmniColor.s).toBeCloseTo(vividOrangeHsl[1] * 100, 0);
      expect(vividOrangeHslFromOmniColor.l).toBeCloseTo(vividOrangeHsl[2] * 100, 0);
      const vividOrangeHsv = vividOrangeChroma.hsv();
      const vividOrangeHsvFromOmniColor = vividOrange.toHSV();
      expect(vividOrangeHsvFromOmniColor.h).toBeCloseTo(vividOrangeHsv[0], 0);
      expect(vividOrangeHsvFromOmniColor.s).toBeCloseTo(vividOrangeHsv[1] * 100, 0);
      expect(vividOrangeHsvFromOmniColor.v).toBeCloseTo(vividOrangeHsv[2] * 100, 0);

      const mutedTeal = new Color('rgb(32, 160, 150)');
      const mutedTealChroma = chroma('rgb(32, 160, 150)');
      const mutedTealHsl = mutedTealChroma.hsl();
      const mutedTealHslFromOmniColor = mutedTeal.toHSL();
      expect(mutedTealHslFromOmniColor.h).toBeCloseTo(mutedTealHsl[0], 0);
      expect(mutedTealHslFromOmniColor.s).toBeCloseTo(mutedTealHsl[1] * 100, 0);
      expect(mutedTealHslFromOmniColor.l).toBeCloseTo(mutedTealHsl[2] * 100, 0);
      const mutedTealHsv = mutedTealChroma.hsv();
      const mutedTealHsvFromOmniColor = mutedTeal.toHSV();
      expect(mutedTealHsvFromOmniColor.h).toBeCloseTo(mutedTealHsv[0], 0);
      expect(mutedTealHsvFromOmniColor.s).toBeCloseTo(mutedTealHsv[1] * 100, 0);
      expect(mutedTealHsvFromOmniColor.v).toBeCloseTo(mutedTealHsv[2] * 100, 0);
    });
  });
});
