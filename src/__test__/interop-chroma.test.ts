import chroma from 'chroma-js';

import type { ColorRGB, ColorRGBA } from '../index';
import { Color } from '../index';

function chromaRGBArrayToObj(values: number[]): ColorRGB | ColorRGBA {
  if (values.length < 3) {
    throw new Error('Invalid RGB array from chroma-js');
  }
  return {
    r: values[0],
    g: values[1],
    b: values[2],
    a: values.length > 3 ? expect.closeTo(values[3], 2) : undefined,
  };
}

describe('Color interoperability with chroma-js', () => {
  describe('parses and normalizes inputs the same way', () => {
    it('matches chroma-js hex and rgb outputs across formats', () => {
      const baseHex = new Color('#336699');
      const baseHexChroma = chroma('#336699');
      expect(baseHex.toHex()).toBe(baseHexChroma.hex().toLowerCase());
      expect(baseHex.toRGB()).toEqual(chromaRGBArrayToObj(baseHexChroma.rgb()));

      const namedColor = new Color('rebeccapurple');
      const namedColorChroma = chroma('rebeccapurple');
      expect(namedColor.toHex()).toBe(namedColorChroma.hex().toLowerCase());
      expect(namedColor.toRGB()).toEqual(chromaRGBArrayToObj(namedColorChroma.rgb()));

      const hslStringColor = new Color('hsl(210, 50%, 40%)');
      const hslStringChroma = chroma('hsl(210, 50%, 40%)');
      expect(hslStringColor.toHex()).toBe(hslStringChroma.hex().toLowerCase());
      expect(hslStringColor.toRGB()).toEqual(chromaRGBArrayToObj(hslStringChroma.rgb()));
    });
  });

  describe('handles alpha channels similarly', () => {
    it('keeps alpha values aligned for hex8 and rgba inputs', () => {
      const hexWithAlpha = new Color('#1e90ff80');
      const hexWithAlphaChroma = chroma('#1e90ff80');
      expect(hexWithAlpha.toHex8()).toBe(hexWithAlphaChroma.hex('rgba').toLowerCase());
      expect(hexWithAlpha.toRGBA()).toEqual(chromaRGBArrayToObj(hexWithAlphaChroma.rgba()));

      const rgbaStringColor = new Color('rgba(12, 200, 180, 0.35)');
      const rgbaStringChroma = chroma('rgba(12, 200, 180, 0.35)');
      expect(rgbaStringColor.toHex8()).toBe(rgbaStringChroma.hex('rgba').toLowerCase());
      expect(rgbaStringColor.toRGBA()).toEqual(chromaRGBArrayToObj(rgbaStringChroma.rgba()));
    });
  });

  describe('mixing parity with chroma-js', () => {
    it('matches LINEAR_RGB mixing output from chroma-js lrgb', () => {
      const omniLinear = new Color('#ff0000').mix(['#0000ff'], { space: 'LINEAR_RGB' });
      const chromaLinear = chroma.mix('#ff0000', '#0000ff', 0.5, 'lrgb');

      expect(omniLinear.toHex()).toBe('#b400b4');
      expect(omniLinear.toHex()).toBe(chromaLinear.hex().toLowerCase());
      expect(omniLinear.toRGBA()).toEqual(chromaRGBArrayToObj(chromaLinear.rgba()));
    });

    it('aligns LINEAR_RGB weight handling with chroma-js lrgb interpolation', () => {
      const omniLinear = new Color('#ff0000').mix(['#0000ff'], {
        space: 'LINEAR_RGB',
        weights: [3, 1],
      });
      const chromaLinear = chroma.mix('#ff0000', '#0000ff', 0.25, 'lrgb');

      expect(omniLinear.toHex()).toBe(chromaLinear.hex().toLowerCase());
      expect(omniLinear.toRGBA()).toEqual(chromaRGBArrayToObj(chromaLinear.rgba()));
    });

    it('matches chroma-js LINEAR_RGB averaging across multiple inputs', () => {
      const omniLinear = new Color('#ff0000').mix(['#00ff00', '#0000ff'], {
        space: 'LINEAR_RGB',
        weights: [0.5, 0.25, 0.25],
      });
      const chromaLinear = chroma.average(
        ['#ff0000', '#00ff00', '#0000ff'],
        'lrgb',
        [0.5, 0.25, 0.25]
      );

      expect(omniLinear.toHex()).toBe(chromaLinear.hex().toLowerCase());
      expect(omniLinear.toRGBA()).toEqual(chromaRGBArrayToObj(chromaLinear.rgba()));
    });

    it('matches chroma-js sRGB mixing when the same weights are provided', () => {
      const omniRgb = new Color('#ff0000').mix(['#0000ff'], { space: 'RGB', weights: [0.5, 0.5] });
      const chromaRgb = chroma.mix('#ff0000', '#0000ff', 0.5, 'rgb');

      expect(omniRgb.toHex()).toBe(chromaRgb.hex().toLowerCase());
      expect(omniRgb.toRGBA()).toEqual(chromaRGBArrayToObj(chromaRgb.rgba()));
    });

    it('aligns multi-input weight handling with chroma average calculations in RGB space', () => {
      const omniMix = new Color('#ff0000').mix(['#00ff00', '#0000ff'], {
        space: 'RGB',
        weights: [0.5, 0.25, 0.25],
      });
      const chromaMix = chroma.average(['#ff0000', '#00ff00', '#0000ff'], 'rgb', [0.5, 0.25, 0.25]);

      expect(omniMix.toHex()).toBe(chromaMix.hex().toLowerCase());
      expect(omniMix.toRGBA()).toEqual(chromaRGBArrayToObj(chromaMix.rgba()));
    });

    it('documents the deliberate divergence between subtractive mixing approaches', () => {
      const omniSubtractive = new Color('#00ffff').mix(['#ffff00'], { type: 'SUBTRACTIVE' });

      const cyanCmyk = chroma('#00ffff').cmyk();
      const yellowCmyk = chroma('#ffff00').cmyk();
      const averagedCmyk = cyanCmyk.map(
        (channel, index) => 0.5 * channel + 0.5 * yellowCmyk[index]
      );
      const [c, m, y, k] = averagedCmyk;
      const chromaSubtractiveApproximation = chroma.cmyk(c, m, y, k);

      expect(omniSubtractive.toHex()).toBe('#00ff00');
      expect(chromaSubtractiveApproximation.hex().toLowerCase()).toBe('#80ff80');
      expect(omniSubtractive.toHex()).not.toBe(chromaSubtractiveApproximation.hex().toLowerCase());
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

  describe('manipulation helpers align with chroma-js LAB-backed operations', () => {
    describe('brightens colors by the same HSL lightness delta', () => {
      it('brightens deep navy by 25%', () => {
        const omniRgba = new Color('#001f3f').brighten({ space: 'LAB', amount: 25 }).toRGBA();
        const chromaRgba = chroma('#001f3f').brighten(2.5).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('brightens pure black significantly', () => {
        const omniRgba = new Color('#000000').brighten({ space: 'LAB', amount: 50 }).toRGBA();
        const chromaRgba = chroma('#000000').brighten(5).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('brightens a nearly white tone without overshooting', () => {
        const omniRgba = new Color('#fafafa').brighten({ space: 'LAB', amount: 30 }).toRGBA();
        const chromaRgba = chroma('#fafafa').brighten(3).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('brightens a translucent teal with the default amount', () => {
        const omniRgba = new Color('rgba(0, 128, 128, 0.35)').brighten({ space: 'LAB' }).toRGBA();
        const chromaRgba = chroma('rgba(0, 128, 128, 0.35)').brighten().rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });
    });

    describe('darkens colors by decreasing HSL lightness identically', () => {
      it('darkens a coral shade slightly', () => {
        const omniRgba = new Color('#ff7f50').darken({ space: 'LAB', amount: 15 }).toRGBA();
        const chromaRgba = chroma('#ff7f50').darken(1.5).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('darkens a near-black charcoal heavily', () => {
        const omniRgba = new Color('#222222').darken({ space: 'LAB', amount: 60 }).toRGBA();
        const chromaRgba = chroma('#222222').darken(6).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('darkens pure white dramatically', () => {
        const omniRgba = new Color('#ffffff').darken({ space: 'LAB', amount: 80 }).toRGBA();
        const chromaRgba = chroma('#ffffff').darken(8).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('darkens a warm translucent yellow with the default delta', () => {
        const omniRgba = new Color('rgba(255, 200, 0, 0.75)').darken({ space: 'LAB' }).toRGBA();
        const chromaRgba = chroma('rgba(255, 200, 0, 0.75)').darken().rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });
    });

    describe('saturates colors by increasing HSL saturation with clamping', () => {
      it('saturates a muted teal by 40%', () => {
        const omniRgba = new Color('hsl(190, 25%, 55%)')
          .saturate({ space: 'LCH', amount: 40 })
          .toRGBA();
        const chromaRgba = chroma('hsl(190, 25%, 55%)').saturate(4).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('saturates a flat gray noticeably', () => {
        const omniRgba = new Color('#808080').saturate({ space: 'LCH', amount: 30 }).toRGBA();
        const chromaRgba = chroma('#808080').saturate(3).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('attempts to saturate pure black', () => {
        const omniRgba = new Color('#000000').saturate({ space: 'LCH', amount: 90 }).toRGBA();
        const chromaRgba = chroma('#000000').saturate(9).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('saturates a translucent violet using the default amount', () => {
        const omniRgba = new Color('rgba(120, 80, 200, 0.5)').saturate({ space: 'LCH' }).toRGBA();
        const chromaRgba = chroma('rgba(120, 80, 200, 0.5)').saturate().rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });
    });

    describe('desaturates colors by decreasing HSL saturation identically', () => {
      it('desaturates a vivid pink by half', () => {
        const omniRgba = new Color('#ff69b4').desaturate({ space: 'LCH', amount: 50 }).toRGBA();
        const chromaRgba = chroma('#ff69b4').desaturate(5).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('desaturates pure green with the default amount', () => {
        const omniRgba = new Color('#00ff00').desaturate({ space: 'LCH' }).toRGBA();
        const chromaRgba = chroma('#00ff00').desaturate().rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('desaturates pure blue completely', () => {
        const omniRgba = new Color('#0000ff').desaturate({ space: 'LCH', amount: 100 }).toRGBA();
        const chromaRgba = chroma('#0000ff').desaturate(10).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('desaturates a neutral gray slightly', () => {
        const omniRgba = new Color('#7a7a7a').desaturate({ space: 'LCH', amount: 25 }).toRGBA();
        const chromaRgba = chroma('#7a7a7a').desaturate(2.5).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });
    });
  });
});
