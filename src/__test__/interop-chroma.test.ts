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
    // TODO: omni-color LINEAR_RGB mixing currently returns #ff00ff versus chroma-js #b400b4; enable once implementations align.
    it.skip('matches LINEAR_RGB mixing output from chroma-js lrgb', () => {
      const omniLinear = new Color('#ff0000').mix(['#0000ff'], { space: 'LINEAR_RGB' });
      const chromaLinear = chroma.mix('#ff0000', '#0000ff', 0.5, 'lrgb');

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
      const averagedCmyk = cyanCmyk.map((channel, index) => 0.5 * channel + 0.5 * yellowCmyk[index]);
      const [c, m, y, k] = averagedCmyk;
      const chromaSubtractiveApproximation = chroma.cmyk(c, m, y, k);

      expect(omniSubtractive.toHex()).toBe('#00ff00');
      expect(chromaSubtractiveApproximation.hex().toLowerCase()).toBe('#80ff80');
      expect(omniSubtractive.toHex()).not.toBe(chromaSubtractiveApproximation.hex().toLowerCase());
    });
  });

  describe('blend parity with chroma-js', () => {
    it('aligns RGB blend modes with chroma-js outputs', () => {
      const multiplyBlend = new Color('#336699').blend(new Color('#ffcc00'), { mode: 'MULTIPLY', ratio: 1 });
      const chromaMultiply = chroma.blend('#336699', '#ffcc00', 'multiply');
      expect(multiplyBlend.toRGBA()).toEqual(chromaRGBArrayToObj(chromaMultiply.rgba()));

      const screenBlend = new Color('#336699').blend(new Color('#ffcc00'), { mode: 'SCREEN', ratio: 1 });
      const chromaScreen = chroma.blend('#336699', '#ffcc00', 'screen');
      expect(screenBlend.toRGBA()).toEqual(chromaRGBArrayToObj(chromaScreen.rgba()));

      const overlayBlend = new Color('#336699').blend(new Color('#ffcc00'), { mode: 'OVERLAY', ratio: 1 });
      const chromaOverlay = chroma.blend('#336699', '#ffcc00', 'overlay');
      expect(overlayBlend.toRGBA()).toEqual(chromaRGBArrayToObj(chromaOverlay.rgba()));

      const normalBlend = new Color('#336699').blend(new Color('#ffcc00'), { mode: 'NORMAL', ratio: 1 });
      const chromaNormal = chroma.mix('#336699', '#ffcc00', 1, 'rgb');
      expect(normalBlend.toRGBA()).toEqual(chromaRGBArrayToObj(chromaNormal.rgba()));
    });

    it('matches blend modes for a secondary palette at partial ratios', () => {
      const expectChannelNear = (omni: number, chromaChannel: number) =>
        expect(Math.abs(omni - chromaChannel)).toBeLessThanOrEqual(1);

      const multiplyBlend = new Color('#112233')
        .blend(new Color('#ffaaff'), { mode: 'MULTIPLY', ratio: 0.4 })
        .toRGBA();
      const chromaMultiply = chroma
        .mix('#112233', chroma.blend('#112233', '#ffaaff', 'multiply').hex(), 0.4, 'rgb')
        .rgba();
      expectChannelNear(multiplyBlend.r, chromaMultiply[0]);
      expectChannelNear(multiplyBlend.g, chromaMultiply[1]);
      expectChannelNear(multiplyBlend.b, chromaMultiply[2]);
      expect(multiplyBlend.a ?? 1).toBeCloseTo(chromaMultiply[3] ?? 1, 2);

      const screenBlend = new Color('#112233')
        .blend(new Color('#ffaaff'), { mode: 'SCREEN', ratio: 0.4 })
        .toRGBA();
      const chromaScreen = chroma
        .mix('#112233', chroma.blend('#112233', '#ffaaff', 'screen').hex(), 0.4, 'rgb')
        .rgba();
      expectChannelNear(screenBlend.r, chromaScreen[0]);
      expectChannelNear(screenBlend.g, chromaScreen[1]);
      expectChannelNear(screenBlend.b, chromaScreen[2]);
      expect(screenBlend.a ?? 1).toBeCloseTo(chromaScreen[3] ?? 1, 2);

      const overlayBlend = new Color('#112233')
        .blend(new Color('#ffaaff'), { mode: 'OVERLAY', ratio: 0.4 })
        .toRGBA();
      const chromaOverlay = chroma
        .mix('#112233', chroma.blend('#112233', '#ffaaff', 'overlay').hex(), 0.4, 'rgb')
        .rgba();
      expectChannelNear(overlayBlend.r, chromaOverlay[0]);
      expectChannelNear(overlayBlend.g, chromaOverlay[1]);
      expectChannelNear(overlayBlend.b, chromaOverlay[2]);
      expect(overlayBlend.a ?? 1).toBeCloseTo(chromaOverlay[3] ?? 1, 2);
    });

    it('aligns blend modes for a high-contrast neutral and light pair', () => {
      const expectChannelNear = (omni: number, chromaChannel: number) =>
        expect(Math.abs(omni - chromaChannel)).toBeLessThanOrEqual(1);

      const multiplyBlend = new Color('#0f0f0f').blend(new Color('#fefefe'), { mode: 'MULTIPLY', ratio: 0.5 });
      const chromaMultiply = chroma
        .mix('#0f0f0f', chroma.blend('#0f0f0f', '#fefefe', 'multiply').hex(), 0.5, 'rgb')
        .rgba();
      expectChannelNear(multiplyBlend.toRGBA().r, chromaMultiply[0]);
      expectChannelNear(multiplyBlend.toRGBA().g, chromaMultiply[1]);
      expectChannelNear(multiplyBlend.toRGBA().b, chromaMultiply[2]);

      const screenBlend = new Color('#0f0f0f').blend(new Color('#fefefe'), { mode: 'SCREEN', ratio: 0.5 });
      const chromaScreen = chroma
        .mix('#0f0f0f', chroma.blend('#0f0f0f', '#fefefe', 'screen').hex(), 0.5, 'rgb')
        .rgba();
      expectChannelNear(screenBlend.toRGBA().r, chromaScreen[0]);
      expectChannelNear(screenBlend.toRGBA().g, chromaScreen[1]);
      expectChannelNear(screenBlend.toRGBA().b, chromaScreen[2]);

      const overlayBlend = new Color('#0f0f0f').blend(new Color('#fefefe'), { mode: 'OVERLAY', ratio: 0.5 });
      const chromaOverlay = chroma
        .mix('#0f0f0f', chroma.blend('#0f0f0f', '#fefefe', 'overlay').hex(), 0.5, 'rgb')
        .rgba();
      expectChannelNear(overlayBlend.toRGBA().r, chromaOverlay[0]);
      expectChannelNear(overlayBlend.toRGBA().g, chromaOverlay[1]);
      expectChannelNear(overlayBlend.toRGBA().b, chromaOverlay[2]);
    });

    it('preserves blend ratio weighting compared to chroma-js', () => {
      const multiplyBlend = new Color('#336699').blend(new Color('#ffcc00'), { mode: 'MULTIPLY', ratio: 0.25 });
      const chromaMultiply = chroma.blend('#336699', '#ffcc00', 'multiply');
      const chromaWeighted = chroma.mix('#336699', chromaMultiply.hex(), 0.25, 'rgb');

      expect(multiplyBlend.toRGBA()).toEqual(chromaRGBArrayToObj(chromaWeighted.rgba()));
    });

    it('preserves HSL hue interpolation relative to chroma-js mix', () => {
      const hslBlend = new Color('#336699').blend(new Color('#ffcc00'), { space: 'HSL', ratio: 0.35 });
      const chromaHslBlend = chroma.mix('#336699', '#ffcc00', 0.35, 'hsl');
      const hslFromOmni = hslBlend.toHSL();
      const chromaHsl = chromaHslBlend.hsl();
      const roundedChromaHue = Math.round(chromaHsl[0]);
      const roundedChromaSaturation = Math.round(chromaHsl[1] * 100);
      const roundedChromaLightness = Math.round(chromaHsl[2] * 100);

      expect(hslFromOmni.h).toBe(roundedChromaHue);
      expect(hslFromOmni.s).toBe(roundedChromaSaturation);
      expect(hslFromOmni.l).toBe(roundedChromaLightness);
    });

    it('handles hue wrapping consistently when interpolating in HSL space', () => {
      const base = new Color('#ff0000');
      const blend = new Color('#00ff00');
      const hslBlend = base.blend(blend, { space: 'HSL', ratio: 0.75 });
      const chromaHslBlend = chroma.mix('#ff0000', '#00ff00', 0.75, 'hsl');
      const omniHsl = hslBlend.toHSL();
      const chromaHsl = chromaHslBlend.hsl();

      expect(omniHsl.h).toBeCloseTo(chromaHsl[0], 0);
      expect(omniHsl.s).toBeCloseTo(chromaHsl[1] * 100, 0);
      expect(omniHsl.l).toBeCloseTo(chromaHsl[2] * 100, 0);
    });

    it('keeps hue alignment when blending across the 360° boundary', () => {
      const base = new Color('#ff00ff');
      const blend = new Color('#00ffff');
      const omniHsl = base.blend(blend, { space: 'HSL', ratio: 0.6 }).toHSL();
      const chromaHsl = chroma.mix('#ff00ff', '#00ffff', 0.6, 'hsl').hsl();

      expect(omniHsl.h).toBeCloseTo(chromaHsl[0], 0);
      expect(omniHsl.s).toBeCloseTo(chromaHsl[1] * 100, 0);
      expect(omniHsl.l).toBeCloseTo(chromaHsl[2] * 100, 0);
    });

    it('keeps alpha ratios consistent with chroma-js expectations', () => {
      const omniAlphaBlend = new Color('rgba(51, 102, 153, 0.6)').blend(new Color('rgba(255, 204, 0, 0.3)'), {
        mode: 'NORMAL',
        ratio: 0.65,
      }).toRGBA();
      const chromaAlphaBlend = chroma.mix('rgba(51, 102, 153, 0.6)', 'rgba(255, 204, 0, 0.3)', 0.65, 'rgb').rgba();

      expect(omniAlphaBlend).toEqual(chromaRGBArrayToObj(chromaAlphaBlend));
      expect(omniAlphaBlend.a).toBeCloseTo((1 - 0.65) * 0.6 + 0.65 * 0.3, 3);
    });

    it('blends when the top color is fully transparent', () => {
      const omniBlend = new Color('rgba(51, 102, 153, 0.8)')
        .blend(new Color('rgba(255, 204, 0, 0)'), { mode: 'NORMAL', ratio: 0.4 })
        .toRGBA();
      const chromaBlend = chroma
        .mix('rgba(51, 102, 153, 0.8)', 'rgba(255, 204, 0, 0)', 0.4, 'rgb')
        .rgba();

      expect(omniBlend).toEqual(chromaRGBArrayToObj(chromaBlend));
      expect(omniBlend.a).toBeCloseTo(0.8 * (1 - 0.4), 3);
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
    // TODO: `chroma` uses LAB space, `omni-color` uses HSL. These tests will fail until we implement the LAB space manipulations.
    describe.skip('brightens colors by the same HSL lightness delta', () => {
      it('brightens deep navy by 25%', () => {
        const omniRgba = new Color('#001f3f').brighten(25).toRGBA();
        const chromaRgba = chroma('#001f3f').brighten(2.5).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('brightens pure black significantly', () => {
        const omniRgba = new Color('#000000').brighten(50).toRGBA();
        const chromaRgba = chroma('#000000').brighten(5).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('brightens a nearly white tone without overshooting', () => {
        const omniRgba = new Color('#fafafa').brighten(30).toRGBA();
        const chromaRgba = chroma('#fafafa').brighten(3).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('brightens a translucent teal with the default amount', () => {
        const omniRgba = new Color('rgba(0, 128, 128, 0.35)').brighten().toRGBA();
        const chromaRgba = chroma('rgba(0, 128, 128, 0.35)').brighten().rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });
    });

    // TODO: `chroma` uses LAB space, `omni-color` uses HSL. These tests will fail until we implement the LAB space manipulations.
    describe.skip('darkens colors by decreasing HSL lightness identically', () => {
      it('darkens a coral shade slightly', () => {
        const omniRgba = new Color('#ff7f50').darken(15).toRGBA();
        const chromaRgba = chroma('#ff7f50').darken(1.5).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('darkens a near-black charcoal heavily', () => {
        const omniRgba = new Color('#222222').darken(60).toRGBA();
        const chromaRgba = chroma('#222222').darken(6).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('darkens pure white dramatically', () => {
        const omniRgba = new Color('#ffffff').darken(80).toRGBA();
        const chromaRgba = chroma('#ffffff').darken(8).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('darkens a warm translucent yellow with the default delta', () => {
        const omniRgba = new Color('rgba(255, 200, 0, 0.75)').darken().toRGBA();
        const chromaRgba = chroma('rgba(255, 200, 0, 0.75)').darken().rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });
    });

    // TODO: `chroma` uses LAB space, `omni-color` uses HSL. These tests will fail until we implement the LAB space manipulations.
    describe.skip('saturates colors by increasing HSL saturation with clamping', () => {
      it('saturates a muted teal by 40%', () => {
        const omniRgba = new Color('hsl(190, 25%, 55%)').saturate(40).toRGBA();
        const chromaRgba = chroma('hsl(190, 25%, 55%)').saturate(4).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('saturates a flat gray noticeably', () => {
        const omniRgba = new Color('#808080').saturate(30).toRGBA();
        const chromaRgba = chroma('#808080').saturate(3).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('attempts to saturate pure black', () => {
        const omniRgba = new Color('#000000').saturate(90).toRGBA();
        const chromaRgba = chroma('#000000').saturate(9).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('saturates a translucent violet using the default amount', () => {
        const omniRgba = new Color('rgba(120, 80, 200, 0.5)').saturate().toRGBA();
        const chromaRgba = chroma('rgba(120, 80, 200, 0.5)').saturate().rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });
    });

    // TODO: `chroma` uses LAB space, `omni-color` uses HSL. These tests will fail until we implement the LAB space manipulations.
    describe.skip('desaturates colors by decreasing HSL saturation identically', () => {
      it('desaturates a vivid pink by half', () => {
        const omniRgba = new Color('#ff69b4').desaturate(50).toRGBA();
        const chromaRgba = chroma('#ff69b4').desaturate(5).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('desaturates pure green with the default amount', () => {
        const omniRgba = new Color('#00ff00').desaturate().toRGBA();
        const chromaRgba = chroma('#00ff00').desaturate().rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('desaturates pure blue completely', () => {
        const omniRgba = new Color('#0000ff').desaturate(100).toRGBA();
        const chromaRgba = chroma('#0000ff').desaturate(10).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });

      it('desaturates a neutral gray slightly', () => {
        const omniRgba = new Color('#7a7a7a').desaturate(25).toRGBA();
        const chromaRgba = chroma('#7a7a7a').desaturate(2.5).rgba();
        expect(omniRgba).toEqual(chromaRGBArrayToObj(chromaRgba));
      });
    });
  });
});
