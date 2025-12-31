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

function expectSimilarRGBAValues(omniValues: ColorRGBA, chromaValues: number[], tolerance = 1) {
  const epsilon = 1e-6;
  expect(Math.abs(omniValues.r - chromaValues[0])).toBeLessThanOrEqual(tolerance + epsilon);
  expect(Math.abs(omniValues.g - chromaValues[1])).toBeLessThanOrEqual(tolerance + epsilon);
  expect(Math.abs(omniValues.b - chromaValues[2])).toBeLessThanOrEqual(tolerance + epsilon);
  expect(omniValues.a ?? 1).toBeCloseTo(chromaValues[3] ?? 1, 2);
}

function compositeRgba(foreground: ColorRGBA, background: ColorRGBA): ColorRGBA {
  const compositeAlpha = foreground.a + background.a * (1 - foreground.a);
  if (compositeAlpha === 0) {
    return { ...background, a: 0 };
  }

  const r =
    (foreground.r * foreground.a + background.r * background.a * (1 - foreground.a)) /
    compositeAlpha;
  const g =
    (foreground.g * foreground.a + background.g * background.a * (1 - foreground.a)) /
    compositeAlpha;
  const b =
    (foreground.b * foreground.a + background.b * background.a * (1 - foreground.a)) /
    compositeAlpha;

  return { r, g, b, a: compositeAlpha };
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

  describe('CMYK parity with chroma-js', () => {
    it('keeps CMYK channels and string output aligned for representative hex inputs', () => {
      const pastelBlue = new Color('#abcdef');
      const pastelBlueChroma = chroma('#abcdef');
      const pastelBlueCmyk = pastelBlue.toCMYK();
      const pastelBlueChromaCmyk = pastelBlueChroma.cmyk();

      expect(pastelBlueCmyk.c).toBeCloseTo(pastelBlueChromaCmyk[0] * 100, 0);
      expect(pastelBlueCmyk.m).toBeCloseTo(pastelBlueChromaCmyk[1] * 100, 0);
      expect(pastelBlueCmyk.y).toBeCloseTo(pastelBlueChromaCmyk[2] * 100, 0);
      expect(pastelBlueCmyk.k).toBeCloseTo(pastelBlueChromaCmyk[3] * 100, 0);
      const pastelBlueChromaCmykString = `device-cmyk(${Math.round(
        pastelBlueChromaCmyk[0] * 100
      )}% ${Math.round(pastelBlueChromaCmyk[1] * 100)}% ${Math.round(
        pastelBlueChromaCmyk[2] * 100
      )}% ${Math.round(pastelBlueChromaCmyk[3] * 100)}%)`;
      expect(pastelBlue.toCMYKString()).toBe(pastelBlueChromaCmykString);

      const warmYellow = new Color('#ffcc00');
      const warmYellowChroma = chroma('#ffcc00');
      const warmYellowCmyk = warmYellow.toCMYK();
      const warmYellowChromaCmyk = warmYellowChroma.cmyk();

      expect(warmYellowCmyk.c).toBeCloseTo(warmYellowChromaCmyk[0] * 100, 0);
      expect(warmYellowCmyk.m).toBeCloseTo(warmYellowChromaCmyk[1] * 100, 0);
      expect(warmYellowCmyk.y).toBeCloseTo(warmYellowChromaCmyk[2] * 100, 0);
      expect(warmYellowCmyk.k).toBeCloseTo(warmYellowChromaCmyk[3] * 100, 0);
      const warmYellowChromaCmykString = `device-cmyk(${Math.round(
        warmYellowChromaCmyk[0] * 100
      )}% ${Math.round(warmYellowChromaCmyk[1] * 100)}% ${Math.round(
        warmYellowChromaCmyk[2] * 100
      )}% ${Math.round(warmYellowChromaCmyk[3] * 100)}%)`;
      expect(warmYellow.toCMYKString()).toBe(warmYellowChromaCmykString);
    });

    it('parses CMYK strings consistently when converting back to hex', () => {
      const lightCmykString = 'cmyk(20%, 10%, 0%, 0%)';
      const lightCmykColor = new Color(lightCmykString);
      const chromaLightCmyk = chroma.cmyk(0.2, 0.1, 0, 0);
      expect(lightCmykColor.toHex()).toBe(chromaLightCmyk.hex().toLowerCase());
      expect(lightCmykColor.toHex8()).toBe(chromaLightCmyk.hex('rgba').toLowerCase());

      const richCmykString = 'cmyk(5% 0% 60% 20%)';
      const richCmykColor = new Color(richCmykString);
      const chromaRichCmyk = chroma.cmyk(0.05, 0, 0.6, 0.2);
      expect(richCmykColor.toHex()).toBe(chromaRichCmyk.hex().toLowerCase());
      expect(richCmykColor.toHex8()).toBe(chromaRichCmyk.hex('rgba').toLowerCase());
    });
  });

  describe('mixing parity with chroma-js', () => {
    it('mixes LINEAR_RGB colors using sRGB companding (close to chroma-js lrgb)', () => {
      // chroma-js uses an lrgb approximation (gamma ≈ 2.2 power curve) instead of the sRGB
      // piecewise transfer function (gamma 2.4 with a linear toe below 0.04045). Our LINEAR_RGB
      // path follows the sRGB spec, so results are slightly brighter than chroma’s approximation.
      const omniLinear = new Color('#ff0000').mix(['#0000ff'], { space: 'LINEAR_RGB' });
      const chromaLinear = chroma.mix('#ff0000', '#0000ff', 0.5, 'lrgb');

      expect(omniLinear.toHex()).toBe('#bc00bc');
      expectSimilarRGBAValues(omniLinear.toRGBA(), chromaLinear.rgba(), 10);
    });

    it('aligns LINEAR_RGB weight handling with chroma-js lrgb interpolation within tolerance', () => {
      // Using the sRGB transfer function means omni-color prioritizes physical correctness; we keep
      // loose tolerances here because chroma’s simplified gamma curve yields slightly darker values.
      const omniLinear = new Color('#ff0000').mix(['#0000ff'], {
        space: 'LINEAR_RGB',
        weights: [3, 1],
      });
      const chromaLinear = chroma.mix('#ff0000', '#0000ff', 0.25, 'lrgb');

      expect(omniLinear.toHex()).toBe('#e10089');
      expectSimilarRGBAValues(omniLinear.toRGBA(), chromaLinear.rgba(), 10);
    });

    it('mixes multiple LINEAR_RGB inputs with normalized weights (brighter than chroma-js)', () => {
      // The same spec-accurate companding vs. approximation difference applies to multi-input mixes.
      // We assert brightness within a generous tolerance to document the expected divergence.
      const omniLinear = new Color('#ff0000').mix(['#00ff00', '#0000ff'], {
        space: 'LINEAR_RGB',
        weights: [0.5, 0.25, 0.25],
      });
      const chromaLinear = chroma.average(
        ['#ff0000', '#00ff00', '#0000ff'],
        'lrgb',
        [0.5, 0.25, 0.25]
      );

      expect(omniLinear.toHex()).toBe('#bc8989');
      expectSimilarRGBAValues(omniLinear.toRGBA(), chromaLinear.rgba(), 70);
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

  describe('gradient parity with chroma-js', () => {
    it('matches linear LCH gradients for two-stop anchors', () => {
      const twoStopOmniGradient = Color.createInterpolatedGradient(['#ff0000', '#0000ff'], {
        space: 'LCH',
        stops: 5,
      });
      const twoStopChromaGradient = chroma.scale(['#ff0000', '#0000ff']).mode('lch').colors(5);

      twoStopOmniGradient.forEach((color, index) => {
        expectSimilarRGBAValues(color.toRGBA(), chroma(twoStopChromaGradient[index]).rgba(), 1);
      });
    });

    it('matches linear LCH gradients for three-stop anchors', () => {
      const threeStopOmniGradient = Color.createInterpolatedGradient(
        ['#ff0000', '#00ff00', '#0000ff'],
        { space: 'LCH', stops: 7 }
      );
      const threeStopChromaGradient = chroma
        .scale(['#ff0000', '#00ff00', '#0000ff'])
        .mode('lch')
        .colors(7);

      expect(threeStopOmniGradient.map((color) => color.toHex())).toEqual(
        threeStopChromaGradient.map((hex) => hex.toLowerCase())
      );
    });

    it('matches LCH bezier gradients against chroma-js bezier scale', () => {
      const bezierAnchors = ['#f43f5e', '#fbbf24', '#22d3ee'];
      const bezierOmniGradient = Color.createInterpolatedGradient(bezierAnchors, {
        interpolation: 'BEZIER',
        space: 'LCH',
        stops: 6,
      });
      const bezierChromaGradient = chroma.bezier(bezierAnchors).scale().mode('lch').colors(6);

      expect(bezierOmniGradient.map((color) => color.toHex())).toEqual(
        bezierChromaGradient.map((hex) => hex.toLowerCase())
      );
    });

    it('wraps hues across 0° when using shortest-path HSL interpolation', () => {
      const hueWrappedAnchors = ['hsl(350, 100%, 50%)', 'hsl(10, 100%, 50%)'];
      const wrappedOmniGradient = Color.createInterpolatedGradient(hueWrappedAnchors, {
        space: 'HSL',
        stops: 5,
        hueInterpolationMode: 'SHORTEST',
      });
      const wrappedChromaGradient = chroma.scale(hueWrappedAnchors).mode('hsl').colors(5);

      wrappedOmniGradient.forEach((color, index) => {
        expectSimilarRGBAValues(color.toRGBA(), chroma(wrappedChromaGradient[index]).rgba(), 1);
      });
    });
  });

  describe('delta E parity with chroma-js', () => {
    it('matches chroma-js deltaE for near-match, midrange, and high-contrast pairs', () => {
      const nearMatchOmniDelta = new Color('#ededee').differenceFrom('#edeeed');
      const nearMatchChromaDelta = chroma.deltaE('#ededee', '#edeeed');
      expect(nearMatchOmniDelta).toBeCloseTo(nearMatchChromaDelta, 2);

      const midrangeOmniDelta = new Color('#0f4c81').differenceFrom('#f97316');
      const midrangeChromaDelta = chroma.deltaE('#0f4c81', '#f97316');
      expect(midrangeOmniDelta).toBeCloseTo(midrangeChromaDelta, 2);

      const highContrastOmniDelta = new Color('#000000').differenceFrom('#ffffff');
      const highContrastChromaDelta = chroma.deltaE('#000000', '#ffffff');
      expect(highContrastOmniDelta).toBeCloseTo(highContrastChromaDelta, 5);
    });

    it('honors CIE94 weighting factors comparable to chroma-js Kl/Kc/Kh inputs', () => {
      const weightedOmniDelta = new Color('#ff6666').differenceFrom('#aa0000', {
        method: 'CIE94',
        cie94Options: { kL: 1.5, kC: 1, kH: 1 },
      });
      const weightedChromaDelta = chroma.deltaE('#ff6666', '#aa0000', 1.5, 1, 1);

      expect(weightedOmniDelta).toBeCloseTo(weightedChromaDelta, 0);
    });
  });

  describe('temperature parity with chroma-js', () => {
    it('produces similar Kelvin-to-hex conversions for warm and cool temperatures', () => {
      const warmKelvin = 3000;
      const warmFromTemperature = Color.fromTemperature(warmKelvin);
      const warmChromaTemperature = chroma.temperature(warmKelvin);
      expect(warmFromTemperature.differenceFrom(warmChromaTemperature.hex())).toBeLessThan(2);

      const coolKelvin = 9000;
      const coolFromTemperature = Color.fromTemperature(coolKelvin);
      const coolChromaTemperature = chroma.temperature(coolKelvin);
      expect(coolFromTemperature.differenceFrom(coolChromaTemperature.hex())).toBeLessThan(2);
    });

    it('estimates correlated color temperature similarly for representative colors', () => {
      const warmNeutralHex = '#ffdabb';
      const warmNeutralOmni = new Color(warmNeutralHex).getTemperature().temperature;
      const warmNeutralChroma = Math.round(chroma(warmNeutralHex).temperature());
      expect(Math.abs(warmNeutralOmni - warmNeutralChroma)).toBeLessThan(120);

      const coolNeutralHex = '#f3f2ff';
      const coolNeutralOmni = new Color(coolNeutralHex).getTemperature().temperature;
      const coolNeutralChroma = Math.round(chroma(coolNeutralHex).temperature());
      expect(Math.abs(coolNeutralOmni - coolNeutralChroma)).toBeLessThan(50);
    });
  });

  describe('readability and contrast interoperability', () => {
    it('matches chroma-js contrast ratios for opaque colors', () => {
      const foreground = new Color('#1a1a1a');
      const background = new Color('#fafafa');

      const omniContrast = foreground.getContrastRatio(background);
      const chromaContrast = chroma.contrast('#1a1a1a', '#fafafa');

      expect(omniContrast).toBeCloseTo(chromaContrast, 2);
    });

    it('composites transparent inputs before calculating contrast', () => {
      const foreground = new Color('rgba(0, 0, 0, 0.5)');
      const background = new Color('rgba(255, 255, 255, 0.6)');

      const omniContrast = foreground.getContrastRatio(background);
      const chromaDirectContrast = chroma.contrast(
        'rgba(0, 0, 0, 0.5)',
        'rgba(255, 255, 255, 0.6)'
      );

      const compositeForeground = compositeRgba(foreground.toRGBA(), background.toRGBA());
      const compositeBackground = compositeRgba(background.toRGBA(), foreground.toRGBA());
      const chromaCompositedContrast = chroma.contrast(
        chroma.rgb(compositeForeground.r, compositeForeground.g, compositeForeground.b),
        chroma.rgb(compositeBackground.r, compositeBackground.g, compositeBackground.b)
      );

      expect(omniContrast).toBeCloseTo(chromaCompositedContrast, 2);
      expect(omniContrast).not.toBeCloseTo(chromaDirectContrast, 2);
    });

    it('selects the most readable text and background colors by chroma contrast', () => {
      const background = new Color('#102542');
      const textCandidates = ['#f8fafc', '#0f172a', '#f97316', '#16a34a'];

      let bestTextCandidate = textCandidates[0];
      let bestTextContrast = chroma.contrast(textCandidates[0], background.toHex());
      textCandidates.slice(1).forEach((candidate) => {
        const contrast = chroma.contrast(candidate, background.toHex());
        if (contrast > bestTextContrast) {
          bestTextContrast = contrast;
          bestTextCandidate = candidate;
        }
      });

      const mostReadableTextColor = background.getMostReadableTextColor(textCandidates).toHex();
      expect(mostReadableTextColor).toBe(new Color(bestTextCandidate).toHex());

      const textColor = new Color('#0b1221');
      const backgroundCandidates = ['#f8fafc', '#111827', '#334155', '#e11d48'];

      let bestBackgroundCandidate = backgroundCandidates[0];
      let bestBackgroundContrast = chroma.contrast(textColor.toHex(), backgroundCandidates[0]);
      backgroundCandidates.slice(1).forEach((candidate) => {
        const contrast = chroma.contrast(textColor.toHex(), candidate);
        if (contrast > bestBackgroundContrast) {
          bestBackgroundContrast = contrast;
          bestBackgroundCandidate = candidate;
        }
      });

      const mostReadableBackgroundColor = textColor
        .getBestBackgroundColor(backgroundCandidates)
        .toHex();
      expect(mostReadableBackgroundColor).toBe(new Color(bestBackgroundCandidate).toHex());
    });

    it('applies WCAG thresholds consistently across AA/AAA and text sizes', () => {
      const background = new Color('#ffffff');
      const midGray = new Color('#7a7a7a');
      const darkGray = new Color('#555555');

      const midGrayContrast = chroma.contrast(midGray.toHex(), background.toHex());
      const darkGrayContrast = chroma.contrast(darkGray.toHex(), background.toHex());

      const aaSmallReport = midGray.getTextReadabilityReport(background, {
        level: 'AA',
        size: 'SMALL',
      });
      expect(aaSmallReport.contrastRatio).toBeCloseTo(midGrayContrast, 2);
      expect(aaSmallReport.requiredContrast).toBe(4.5);
      expect(aaSmallReport.isReadable).toBe(false);

      const aaLargeReport = midGray.getTextReadabilityReport(background, {
        level: 'AA',
        size: 'LARGE',
      });
      expect(aaLargeReport.contrastRatio).toBeCloseTo(midGrayContrast, 2);
      expect(aaLargeReport.requiredContrast).toBe(3);
      expect(aaLargeReport.isReadable).toBe(true);

      const aaaSmallReport = darkGray.getTextReadabilityReport(background, {
        level: 'AAA',
        size: 'SMALL',
      });
      expect(aaaSmallReport.contrastRatio).toBeCloseTo(darkGrayContrast, 2);
      expect(aaaSmallReport.requiredContrast).toBe(7);
      expect(aaaSmallReport.isReadable).toBe(true);

      const aaaLargeReport = midGray.getTextReadabilityReport(background, {
        level: 'AAA',
        size: 'LARGE',
      });
      expect(aaaLargeReport.contrastRatio).toBeCloseTo(midGrayContrast, 2);
      expect(aaaLargeReport.requiredContrast).toBe(4.5);
      expect(aaaLargeReport.isReadable).toBe(false);
    });
  });

  describe('average parity with chroma-js', () => {
    it('keeps circular HSL averaging close to chroma-js while weighting saturation', () => {
      const omniAverage = new Color('hsl(350, 100%, 50%)').average(
        ['hsl(10, 100%, 50%)', 'hsl(30, 60%, 50%)'],
        { space: 'HSL' }
      );
      const chromaAverage = chroma.average(
        ['hsl(350, 100%, 50%)', 'hsl(10, 100%, 50%)', 'hsl(30, 60%, 50%)'],
        'hsl'
      );

      expect(omniAverage.toHex()).toBe('#eb2d14');
      const omniHsl = omniAverage.toHSL();
      const chromaHsl = chromaAverage.hsl();
      const hueDelta = Math.min(
        Math.abs(omniHsl.h - chromaHsl[0]),
        360 - Math.abs(omniHsl.h - chromaHsl[0])
      );
      expect(hueDelta).toBeLessThan(5);
      expect(Math.abs(omniHsl.s - chromaHsl[1] * 100)).toBeLessThan(5);
      expect(Math.abs(omniHsl.l - chromaHsl[2] * 100)).toBeLessThan(1);
    });
  });

  describe('blend parity with chroma-js', () => {
    it('aligns RGB blend modes with chroma-js outputs', () => {
      const multiplyBlend = new Color('#336699').blend(new Color('#ffcc00'), {
        mode: 'MULTIPLY',
        ratio: 1,
      });
      const chromaMultiply = chroma.blend('#336699', '#ffcc00', 'multiply');
      expect(multiplyBlend.toRGBA()).toEqual(chromaRGBArrayToObj(chromaMultiply.rgba()));

      const screenBlend = new Color('#336699').blend(new Color('#ffcc00'), {
        mode: 'SCREEN',
        ratio: 1,
      });
      const chromaScreen = chroma.blend('#336699', '#ffcc00', 'screen');
      expect(screenBlend.toRGBA()).toEqual(chromaRGBArrayToObj(chromaScreen.rgba()));

      const overlayBlend = new Color('#336699').blend(new Color('#ffcc00'), {
        mode: 'OVERLAY',
        ratio: 1,
      });
      const chromaOverlay = chroma.blend('#336699', '#ffcc00', 'overlay');
      expect(overlayBlend.toRGBA()).toEqual(chromaRGBArrayToObj(chromaOverlay.rgba()));

      const normalBlend = new Color('#336699').blend(new Color('#ffcc00'), {
        mode: 'NORMAL',
        ratio: 1,
      });
      const chromaNormal = chroma.mix('#336699', '#ffcc00', 1, 'rgb');
      expect(normalBlend.toRGBA()).toEqual(chromaRGBArrayToObj(chromaNormal.rgba()));
    });

    it('matches blend modes for a secondary palette at partial ratios', () => {
      const multiplyBlend = new Color('#112233')
        .blend(new Color('#ffaaff'), { mode: 'MULTIPLY', ratio: 0.4 })
        .toRGBA();
      const chromaMultiply = chroma
        .mix('#112233', chroma.blend('#112233', '#ffaaff', 'multiply').hex(), 0.4, 'rgb')
        .rgba();
      expectSimilarRGBAValues(multiplyBlend, chromaMultiply);

      const screenBlend = new Color('#112233')
        .blend(new Color('#ffaaff'), { mode: 'SCREEN', ratio: 0.4 })
        .toRGBA();
      const chromaScreen = chroma
        .mix('#112233', chroma.blend('#112233', '#ffaaff', 'screen').hex(), 0.4, 'rgb')
        .rgba();
      expectSimilarRGBAValues(screenBlend, chromaScreen);

      const overlayBlend = new Color('#112233')
        .blend(new Color('#ffaaff'), { mode: 'OVERLAY', ratio: 0.4 })
        .toRGBA();
      const chromaOverlay = chroma
        .mix('#112233', chroma.blend('#112233', '#ffaaff', 'overlay').hex(), 0.4, 'rgb')
        .rgba();
      expectSimilarRGBAValues(overlayBlend, chromaOverlay);
    });

    it('aligns blend modes for a high-contrast neutral and light pair', () => {
      const multiplyBlend = new Color('#0f0f0f').blend(new Color('#fefefe'), {
        mode: 'MULTIPLY',
        ratio: 0.5,
      });
      const chromaMultiply = chroma
        .mix('#0f0f0f', chroma.blend('#0f0f0f', '#fefefe', 'multiply').hex(), 0.5, 'rgb')
        .rgba();
      expectSimilarRGBAValues(multiplyBlend.toRGBA(), chromaMultiply);

      const screenBlend = new Color('#0f0f0f').blend(new Color('#fefefe'), {
        mode: 'SCREEN',
        ratio: 0.5,
      });
      const chromaScreen = chroma
        .mix('#0f0f0f', chroma.blend('#0f0f0f', '#fefefe', 'screen').hex(), 0.5, 'rgb')
        .rgba();
      expectSimilarRGBAValues(screenBlend.toRGBA(), chromaScreen);

      const overlayBlend = new Color('#0f0f0f').blend(new Color('#fefefe'), {
        mode: 'OVERLAY',
        ratio: 0.5,
      });
      const chromaOverlay = chroma
        .mix('#0f0f0f', chroma.blend('#0f0f0f', '#fefefe', 'overlay').hex(), 0.5, 'rgb')
        .rgba();
      expectSimilarRGBAValues(overlayBlend.toRGBA(), chromaOverlay);
    });

    it('preserves blend ratio weighting compared to chroma-js', () => {
      const multiplyBlend = new Color('#336699').blend(new Color('#ffcc00'), {
        mode: 'MULTIPLY',
        ratio: 0.25,
      });
      const chromaMultiply = chroma.blend('#336699', '#ffcc00', 'multiply');
      const chromaWeighted = chroma.mix('#336699', chromaMultiply.hex(), 0.25, 'rgb');

      expect(multiplyBlend.toRGBA()).toEqual(chromaRGBArrayToObj(chromaWeighted.rgba()));
    });

    it('preserves HSL hue interpolation relative to chroma-js mix', () => {
      const hslBlend = new Color('#336699').blend(new Color('#ffcc00'), {
        space: 'HSL',
        ratio: 0.35,
      });
      const chromaHslBlend = chroma.mix('#336699', '#ffcc00', 0.35, 'hsl');
      const hslFromOmni = hslBlend.toHSL();
      const chromaHsl = chromaHslBlend.hsl();
      const roundedChromaHue = Math.round(chromaHsl[0]);
      const roundedChromaSaturation = Math.round(chromaHsl[1] * 100);
      const roundedChromaLightness = Math.round(chromaHsl[2] * 100);

      expect(hslFromOmni.h).toBeCloseTo(roundedChromaHue, 0);
      expect(Math.abs(hslFromOmni.s - roundedChromaSaturation)).toBeLessThanOrEqual(0.5);
      expect(Math.abs(hslFromOmni.l - roundedChromaLightness)).toBeLessThanOrEqual(0.5);
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
      const omniAlphaBlend = new Color('rgba(51, 102, 153, 0.6)')
        .blend(new Color('rgba(255, 204, 0, 0.3)'), {
          mode: 'NORMAL',
          ratio: 0.65,
        })
        .toRGBA();
      const chromaAlphaBlend = chroma
        .mix('rgba(51, 102, 153, 0.6)', 'rgba(255, 204, 0, 0.3)', 0.65, 'rgb')
        .rgba();

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

  describe('LAB/LCH conversions align with chroma-js', () => {
    const labTolerance = 0.5;
    const chromaTolerance = 0.5;
    const hueTolerance = 1;

    it('keeps LAB/LCH outputs aligned for #1a73e8', () => {
      const omniColor = new Color('#1a73e8');
      const chromaColor = chroma('#1a73e8');

      const labFromOmni = omniColor.toLAB();
      const chromaLab = chromaColor.lab();
      expect(Math.abs(labFromOmni.l - chromaLab[0])).toBeLessThanOrEqual(labTolerance);
      expect(Math.abs(labFromOmni.a - chromaLab[1])).toBeLessThanOrEqual(labTolerance);
      expect(Math.abs(labFromOmni.b - chromaLab[2])).toBeLessThanOrEqual(labTolerance);

      const lchFromOmni = omniColor.toLCH();
      const chromaLch = chromaColor.lch();
      expect(Math.abs(lchFromOmni.l - chromaLch[0])).toBeLessThanOrEqual(labTolerance);
      expect(Math.abs(lchFromOmni.c - chromaLch[1])).toBeLessThanOrEqual(chromaTolerance);
      const lchHueDelta = Math.min(
        Math.abs(lchFromOmni.h - chromaLch[2]),
        360 - Math.abs(lchFromOmni.h - chromaLch[2])
      );
      expect(lchHueDelta).toBeLessThanOrEqual(hueTolerance);

      const oklchFromOmni = omniColor.toOKLCH();
      const chromaOklch = chromaColor.oklch();
      expect(Math.abs(oklchFromOmni.l - chromaOklch[0])).toBeLessThanOrEqual(0.001);
      expect(Math.abs(oklchFromOmni.c - chromaOklch[1])).toBeLessThanOrEqual(0.001);
      const oklchHueDelta = Math.min(
        Math.abs(oklchFromOmni.h - chromaOklch[2]),
        360 - Math.abs(oklchFromOmni.h - chromaOklch[2])
      );
      expect(oklchHueDelta).toBeLessThanOrEqual(hueTolerance);
    });

    it('keeps LAB/LCH outputs aligned for #f43f5e', () => {
      const omniColor = new Color('#f43f5e');
      const chromaColor = chroma('#f43f5e');

      const labFromOmni = omniColor.toLAB();
      const chromaLab = chromaColor.lab();
      expect(Math.abs(labFromOmni.l - chromaLab[0])).toBeLessThanOrEqual(labTolerance);
      expect(Math.abs(labFromOmni.a - chromaLab[1])).toBeLessThanOrEqual(labTolerance);
      expect(Math.abs(labFromOmni.b - chromaLab[2])).toBeLessThanOrEqual(labTolerance);

      const lchFromOmni = omniColor.toLCH();
      const chromaLch = chromaColor.lch();
      expect(Math.abs(lchFromOmni.l - chromaLch[0])).toBeLessThanOrEqual(labTolerance);
      expect(Math.abs(lchFromOmni.c - chromaLch[1])).toBeLessThanOrEqual(chromaTolerance);
      const lchHueDelta = Math.min(
        Math.abs(lchFromOmni.h - chromaLch[2]),
        360 - Math.abs(lchFromOmni.h - chromaLch[2])
      );
      expect(lchHueDelta).toBeLessThanOrEqual(hueTolerance);

      const oklchFromOmni = omniColor.toOKLCH();
      const chromaOklch = chromaColor.oklch();
      expect(Math.abs(oklchFromOmni.l - chromaOklch[0])).toBeLessThanOrEqual(0.001);
      expect(Math.abs(oklchFromOmni.c - chromaOklch[1])).toBeLessThanOrEqual(0.001);
      const oklchHueDelta = Math.min(
        Math.abs(oklchFromOmni.h - chromaOklch[2]),
        360 - Math.abs(oklchFromOmni.h - chromaOklch[2])
      );
      expect(oklchHueDelta).toBeLessThanOrEqual(hueTolerance);
    });

    it('keeps LAB/LCH outputs aligned for #00aa88', () => {
      const omniColor = new Color('#00aa88');
      const chromaColor = chroma('#00aa88');

      const labFromOmni = omniColor.toLAB();
      const chromaLab = chromaColor.lab();
      expect(Math.abs(labFromOmni.l - chromaLab[0])).toBeLessThanOrEqual(labTolerance);
      expect(Math.abs(labFromOmni.a - chromaLab[1])).toBeLessThanOrEqual(labTolerance);
      expect(Math.abs(labFromOmni.b - chromaLab[2])).toBeLessThanOrEqual(labTolerance);

      const lchFromOmni = omniColor.toLCH();
      const chromaLch = chromaColor.lch();
      expect(Math.abs(lchFromOmni.l - chromaLch[0])).toBeLessThanOrEqual(labTolerance);
      expect(Math.abs(lchFromOmni.c - chromaLch[1])).toBeLessThanOrEqual(chromaTolerance);
      const lchHueDelta = Math.min(
        Math.abs(lchFromOmni.h - chromaLch[2]),
        360 - Math.abs(lchFromOmni.h - chromaLch[2])
      );
      expect(lchHueDelta).toBeLessThanOrEqual(hueTolerance);

      const oklchFromOmni = omniColor.toOKLCH();
      const chromaOklch = chromaColor.oklch();
      expect(Math.abs(oklchFromOmni.l - chromaOklch[0])).toBeLessThanOrEqual(0.001);
      expect(Math.abs(oklchFromOmni.c - chromaOklch[1])).toBeLessThanOrEqual(0.001);
      const oklchHueDelta = Math.min(
        Math.abs(oklchFromOmni.h - chromaOklch[2]),
        360 - Math.abs(oklchFromOmni.h - chromaOklch[2])
      );
      expect(oklchHueDelta).toBeLessThanOrEqual(hueTolerance);
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
