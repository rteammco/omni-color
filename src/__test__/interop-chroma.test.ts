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

  describe('manipulation helpers align with chroma-js HSL operations', () => {
    describe('brightens colors by the same HSL lightness delta', () => {
      it('brightens deep navy by 25%', () => {
        const omniRgba = new Color('#001f3f').brighten(25).toRGBA();
        const chromaRgba = chroma('#001f3f').brighten(2.5).rgba();

        expect(omniRgba).toEqual({
          r: chromaRgba[0],
          g: chromaRgba[1],
          b: chromaRgba[2],
          a: chromaRgba[3],
        });
      });

      it('brightens pure black significantly', () => {
        const omniRgba = new Color('#000000').brighten(50).toRGBA();
        const chromaRgba = chroma('#000000').brighten(5).rgba();

        expect(omniRgba).toEqual({
          r: chromaRgba[0],
          g: chromaRgba[1],
          b: chromaRgba[2],
          a: chromaRgba[3],
        });
      });

      it('brightens a nearly white tone without overshooting', () => {
        const omniRgba = new Color('#fafafa').brighten(30).toRGBA();
        const chromaRgba = chroma('#fafafa').brighten(3).rgba();

        expect(omniRgba).toEqual({
          r: chromaRgba[0],
          g: chromaRgba[1],
          b: chromaRgba[2],
          a: chromaRgba[3],
        });
      });

      it('brightens a translucent teal with the default amount', () => {
        const omniRgba = new Color('rgba(0, 128, 128, 0.35)').brighten().toRGBA();
        const chromaRgba = chroma('rgba(0, 128, 128, 0.35)').brighten().rgba();

        expect(omniRgba).toEqual({
          r: chromaRgba[0],
          g: chromaRgba[1],
          b: chromaRgba[2],
          a: chromaRgba[3],
        });
      });
    });

    describe('darkens colors by decreasing HSL lightness identically', () => {
      it('darkens a coral shade slightly', () => {
        const omniRgba = new Color('#ff7f50').darken(15).toRGBA();
        const chromaRgba = chroma('#ff7f50').darken(1.5).rgba();

        expect(omniRgba).toEqual({
          r: chromaRgba[0],
          g: chromaRgba[1],
          b: chromaRgba[2],
          a: chromaRgba[3],
        });
      });

      it('darkens a near-black charcoal heavily', () => {
        const omniRgba = new Color('#222222').darken(60).toRGBA();
        const chromaRgba = chroma('#222222').darken(6).rgba();

        expect(omniRgba).toEqual({
          r: chromaRgba[0],
          g: chromaRgba[1],
          b: chromaRgba[2],
          a: chromaRgba[3],
        });
      });

      it('darkens pure white dramatically', () => {
        const omniRgba = new Color('#ffffff').darken(80).toRGBA();
        const chromaRgba = chroma('#ffffff').darken(8).rgba();

        expect(omniRgba).toEqual({
          r: chromaRgba[0],
          g: chromaRgba[1],
          b: chromaRgba[2],
          a: chromaRgba[3],
        });
      });

      it('darkens a warm translucent yellow with the default delta', () => {
        const omniRgba = new Color('rgba(255, 200, 0, 0.75)').darken().toRGBA();
        const chromaRgba = chroma('rgba(255, 200, 0, 0.75)').darken().rgba();

        expect(omniRgba).toEqual({
          r: chromaRgba[0],
          g: chromaRgba[1],
          b: chromaRgba[2],
          a: chromaRgba[3],
        });
      });
    });

    describe('saturates colors by increasing HSL saturation with clamping', () => {
      it('saturates a muted teal by 40%', () => {
        const omniRgba = new Color('hsl(190, 25%, 55%)').saturate(40).toRGBA();
        const chromaRgba = chroma('hsl(190, 25%, 55%)').saturate(4).rgba();

        expect(omniRgba).toEqual({
          r: chromaRgba[0],
          g: chromaRgba[1],
          b: chromaRgba[2],
          a: chromaRgba[3],
        });
      });

      it('saturates a flat gray noticeably', () => {
        const omniRgba = new Color('#808080').saturate(30).toRGBA();
        const chromaRgba = chroma('#808080').saturate(3).rgba();

        expect(omniRgba).toEqual({
          r: chromaRgba[0],
          g: chromaRgba[1],
          b: chromaRgba[2],
          a: chromaRgba[3],
        });
      });

      it('attempts to saturate pure black', () => {
        const omniRgba = new Color('#000000').saturate(90).toRGBA();
        const chromaRgba = chroma('#000000').saturate(9).rgba();

        expect(omniRgba).toEqual({
          r: chromaRgba[0],
          g: chromaRgba[1],
          b: chromaRgba[2],
          a: chromaRgba[3],
        });
      });

      it('saturates a translucent violet using the default amount', () => {
        const omniRgba = new Color('rgba(120, 80, 200, 0.5)').saturate().toRGBA();
        const chromaRgba = chroma('rgba(120, 80, 200, 0.5)').saturate().rgba();

        expect(omniRgba).toEqual({
          r: chromaRgba[0],
          g: chromaRgba[1],
          b: chromaRgba[2],
          a: chromaRgba[3],
        });
      });
    });

    describe('desaturates colors by decreasing HSL saturation identically', () => {
      it('desaturates a vivid pink by half', () => {
        const omniRgba = new Color('#ff69b4').desaturate(50).toRGBA();
        const chromaRgba = chroma('#ff69b4').desaturate(5).rgba();

        expect(omniRgba).toEqual({
          r: chromaRgba[0],
          g: chromaRgba[1],
          b: chromaRgba[2],
          a: chromaRgba[3],
        });
      });

      it('desaturates pure green with the default amount', () => {
        const omniRgba = new Color('#00ff00').desaturate().toRGBA();
        const chromaRgba = chroma('#00ff00').desaturate().rgba();

        expect(omniRgba).toEqual({
          r: chromaRgba[0],
          g: chromaRgba[1],
          b: chromaRgba[2],
          a: chromaRgba[3],
        });
      });

      it('desaturates pure blue completely', () => {
        const omniRgba = new Color('#0000ff').desaturate(100).toRGBA();
        const chromaRgba = chroma('#0000ff').desaturate(10).rgba();

        expect(omniRgba).toEqual({
          r: chromaRgba[0],
          g: chromaRgba[1],
          b: chromaRgba[2],
          a: chromaRgba[3],
        });
      });

      it('desaturates a neutral gray slightly', () => {
        const omniRgba = new Color('#7a7a7a').desaturate(25).toRGBA();
        const chromaRgba = chroma('#7a7a7a').desaturate(2.5).rgba();

        expect(omniRgba).toEqual({
          r: chromaRgba[0],
          g: chromaRgba[1],
          b: chromaRgba[2],
          a: chromaRgba[3],
        });
      });
    });

    describe('matches chroma-js grayscale conversion', () => {
      it('converts red to grayscale', () => {
        const omniRgba = new Color('#ff0000').grayscale().toRGBA();
        const chromaRgba = chroma('#ff0000').desaturate(100).rgba();

        expect(omniRgba).toEqual({
          r: chromaRgba[0],
          g: chromaRgba[1],
          b: chromaRgba[2],
          a: chromaRgba[3],
        });
      });

      it('converts a warm tan to grayscale', () => {
        const omniRgba = new Color('#bca27f').grayscale().toRGBA();
        const chromaRgba = chroma('#bca27f').desaturate(100).rgba();

        expect(omniRgba).toEqual({
          r: chromaRgba[0],
          g: chromaRgba[1],
          b: chromaRgba[2],
          a: chromaRgba[3],
        });
      });

      it('converts translucent purple to grayscale while retaining alpha', () => {
        const omniRgba = new Color('rgba(128, 0, 128, 0.4)').grayscale().toRGBA();
        const chromaRgba = chroma('rgba(128, 0, 128, 0.4)').desaturate(100).rgba();

        expect(omniRgba).toEqual({
          r: chromaRgba[0],
          g: chromaRgba[1],
          b: chromaRgba[2],
          a: chromaRgba[3],
        });
      });

      it('converts near-black to grayscale without changing channel values', () => {
        const omniRgba = new Color('#050505').grayscale().toRGBA();
        const chromaRgba = chroma('#050505').desaturate(100).rgba();

        expect(omniRgba).toEqual({
          r: chromaRgba[0],
          g: chromaRgba[1],
          b: chromaRgba[2],
          a: chromaRgba[3],
        });
      });
    });
  });
});
