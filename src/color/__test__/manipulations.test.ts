import { Color } from '../color';
import {
  brightenColor,
  colorToGrayscale,
  darkenColor,
  desaturateColor,
  saturateColor,
  spinColorHue,
} from '../manipulations';

const createColor = (input: ConstructorParameters<typeof Color>[0]) => new Color(input);

describe('spinColorHue', () => {
  it('rotates hue forward around the wheel', () => {
    expect(spinColorHue(new Color('#ff0000'), 0, createColor).toHex()).toBe('#ff0000');
    expect(spinColorHue(new Color('#ff0000'), 30, createColor).toHex()).toBe('#ff8000');
    expect(spinColorHue(new Color('#ff0000'), 120, createColor).toHex()).toBe('#00ff00');
    expect(spinColorHue(new Color('#ff0000'), 240, createColor).toHex()).toBe('#0000ff');
  });

  it('wraps hue for large positive or negative rotations', () => {
    expect(spinColorHue(new Color('#ff0000'), 400, createColor).toHex()).toBe('#ffaa00');
    expect(spinColorHue(new Color('#ff0000'), 720, createColor).toHex()).toBe('#ff0000');
    expect(spinColorHue(new Color('#ff0000'), -390, createColor).toHex()).toBe('#ff0080');
    expect(spinColorHue(new Color('#ff0000'), -420, createColor).toHex()).toBe('#ff00ff');
  });

  it('preserves fractional degree values without truncating', () => {
    expect(spinColorHue(new Color('#ff0000'), 30.5, createColor).toHex()).toBe('#ff8200');
    expect(spinColorHue(new Color('#ff0000'), 12.34, createColor).toHex()).toBe('#ff3400');
    expect(spinColorHue(new Color('#ff0000'), -30.7, createColor).toHex()).toBe('#ff0082');
  });

  it('keeps hues in the expected range for negative fractional rotations', () => {
    const rotated = spinColorHue(new Color('hsl(210, 70%, 60%)'), -420.25, createColor);
    expect(rotated.toHex()).toBe('#52e098');
    expect(rotated.toHSL().h).toBeCloseTo(150, 0);
  });

  it('works with different base colors', () => {
    expect(spinColorHue(new Color('#00ff00'), 120, createColor).toHex()).toBe('#0000ff');
    expect(spinColorHue(new Color('#00ff00'), -240, createColor).toHex()).toBe('#0000ff');
    expect(spinColorHue(new Color('#0000ff'), 240, createColor).toHex()).toBe('#00ff00');
    expect(spinColorHue(new Color('#ffff00'), 450, createColor).toHex()).toBe('#00ff80');
    expect(spinColorHue(new Color('#00ffff'), 60, createColor).toHex()).toBe('#0000ff');
    expect(spinColorHue(new Color('#ff00ff'), 120, createColor).toHex()).toBe('#ffff00');
  });

  it('does not mutate the original color', () => {
    const red = new Color('#ff0000');
    const spun = spinColorHue(red, 120, createColor);
    expect(spun.toHex()).toBe('#00ff00');
    expect(red.toHex()).toBe('#ff0000');
  });

  it('preserves alpha while rotating hue', () => {
    const translucentRed = new Color('rgba(255, 0, 0, 0.42)');
    const spun = spinColorHue(translucentRed, 60, createColor);

    expect(spun.toHex8()).toBe('#ffff006b');
    expect(spun.toRGBA().a).toBeCloseTo(0.42, 5);
    expect(translucentRed.toRGBA().a).toBeCloseTo(0.42, 5);
  });
});

describe('brightenColor', () => {
  it('adjusts lightness relative to the base color', () => {
    const gray = new Color('#808080');
    expect(brightenColor(gray, createColor).toHex()).toBe('#9a9a9a');
    expect(brightenColor(gray, { amount: -10 }, createColor).toHex()).toBe('#676767');
    expect(gray.toHex()).toBe('#808080');
  });

  it('clamps at lightness bounds', () => {
    expect(brightenColor(new Color('#ffffff'), { amount: 10 }, createColor).toHex()).toBe(
      '#ffffff',
    );
    expect(brightenColor(new Color('#000000'), { amount: -10 }, createColor).toHex()).toBe(
      '#000000',
    );
    expect(brightenColor(new Color('#000000'), { amount: 200 }, createColor).toHex()).toBe(
      '#ffffff',
    );
    expect(brightenColor(new Color('#ffffff'), { amount: -200 }, createColor).toHex()).toBe(
      '#000000',
    );
  });

  it('uses the default 10% increase', () => {
    expect(brightenColor(new Color('#000000'), createColor).toHex()).toBe('#1a1a1a');
  });

  it('supports LAB adjustments with configurable LAB-like scaling', () => {
    const translucentTeal = new Color('rgba(0, 128, 128, 0.4)');
    const defaultScale = brightenColor(translucentTeal, { space: 'LAB', amount: 30 }, createColor);
    const smallerScale = brightenColor(
      translucentTeal,
      { space: 'LAB', amount: 30, labScale: 12 },
      createColor,
    );

    expect(defaultScale.toHex()).toBe('#aeffff');
    expect(defaultScale.toRGBA().a).toBeCloseTo(0.4, 5);
    expect(smallerScale.toHex()).toBe('#81e2e1');
    expect(smallerScale.toRGBA().a).toBeCloseTo(0.4, 5);
  });

  it('honors fractional HSL adjustments when options are explicitly provided', () => {
    const base = new Color('#123456');
    const brightened = brightenColor(base, { amount: 7.5, space: 'HSL' }, createColor);

    expect(brightened.toHex()).toBe('#194776');
    expect(brightened).not.toBe(base);
    expect(base.toHex()).toBe('#123456');
  });

  it('applies LAB deltas scaled by labScale while keeping alpha intact', () => {
    const base = new Color({ l: 50, a: 0, b: 0 }).setAlpha(0.8);
    const brightened = brightenColor(base, { space: 'LAB', amount: 5, labScale: 10 }, createColor);
    const brightenedLAB = brightened.toLAB();

    expect(brightenedLAB.l).toBeCloseTo(55.148, 3);
    expect(brightened.toHex()).toBe('#848484');
    expect(brightened.toRGBA().a).toBeCloseTo(0.8, 5);
    expect(base.toHex()).toBe('#777777');
  });

  it('supports LCH adjustments with custom LAB-like scaling', () => {
    const base = new Color({ l: 40, c: 20, h: 250 });
    const brightened = brightenColor(base, { space: 'LCH', amount: 25, labScale: 8 }, createColor);
    const brightenedLCH = brightened.toLCH();

    expect(brightened.toHex()).toBe('#6d96b1');
    expect(brightenedLCH.l).toBeCloseTo(60.103, 3);
    expect(brightenedLCH.c).toBeCloseTo(19.843, 3);
    expect(brightenedLCH.h).toBeCloseTo(249.226, 3);
  });

  it('normalizes near-neutral inputs before brightening in LCH space', () => {
    const gray = new Color('#808080');
    const brightened = brightenColor(gray, { space: 'LCH', amount: 10 }, createColor);
    const lch = brightened.toLCH();

    expect(lch.c).toBeLessThan(0.02);
    expect(Number.isFinite(lch.h)).toBe(true);
    expect(gray.toHex()).toBe('#808080');
  });
});

describe('darkenColor', () => {
  it('reduces lightness by the given percentage', () => {
    const gray = new Color('#808080');
    expect(darkenColor(gray, createColor).toHex()).toBe('#676767');
    expect(darkenColor(gray, { amount: -10 }, createColor).toHex()).toBe('#9a9a9a');
    expect(gray.toHex()).toBe('#808080');
  });

  it('clamps at black', () => {
    expect(darkenColor(new Color('#000000'), { amount: 10 }, createColor).toHex()).toBe('#000000');
    expect(darkenColor(new Color('#ffffff'), { amount: 200 }, createColor).toHex()).toBe('#000000');
  });

  it('uses the default 10% decrease', () => {
    expect(darkenColor(new Color('#ffffff'), createColor).toHex()).toBe('#e6e6e6');
  });

  it('accepts LAB options and clamps when approaching black', () => {
    expect(
      darkenColor(new Color('#ffffff'), { amount: 200, space: 'LAB' }, createColor).toHex(),
    ).toBe('#000000');
    expect(
      darkenColor(new Color('#000000'), { amount: 25, space: 'LAB' }, createColor).toHex(),
    ).toBe('#000000');
  });

  it('scales LAB/LCH deltas using the provided labScale', () => {
    const gray = new Color('#808080');
    expect(darkenColor(gray, { space: 'LCH', amount: 20 }, createColor).toHex()).toBe('#2b2b2b');
    expect(darkenColor(gray, { space: 'LCH', amount: 20, labScale: 10 }, createColor).toHex()).toBe(
      '#4f4f4f',
    );
  });

  it('handles fractional HSL adjustments without mutating the source color', () => {
    const parchment = new Color('#f0eedd');
    const darkened = darkenColor(parchment, { amount: 12.5 }, createColor);

    expect(darkened.toHex()).toBe('#dcd8b1');
    expect(parchment.toHex()).toBe('#f0eedd');
  });

  it('applies LAB deltas with custom scaling and preserves transparency', () => {
    const base = new Color({ l: 45, a: -5, b: 15 }).setAlpha(0.65);
    const darkened = darkenColor(base, { space: 'LAB', amount: 15, labScale: 5 }, createColor);
    const darkenedLAB = darkened.toLAB();

    expect(darkenedLAB.l).toBeCloseTo(37.583, 3);
    expect(darkened.toHex8()).toBe('#5a5a40a6');
    expect(base.toHex8()).toBe('#6c6c51a6');
  });

  it('normalizes near-grayscale hues before darkening in LCH space', () => {
    const gray = new Color('#808080');
    const darkened = darkenColor(gray, { space: 'LCH', amount: 25 }, createColor);
    const lch = darkened.toLCH();

    expect(lch.c).toBeLessThan(0.01);
    expect(Number.isFinite(lch.h)).toBe(true);
    expect(gray.toHex()).toBe('#808080');
  });
});

describe('saturateColor', () => {
  it('adjusts saturation by the requested amount', () => {
    const base = new Color('#6699cc');
    expect(saturateColor(base, { amount: 20 }, createColor).toHex()).toBe('#5299e0');
    expect(saturateColor(base, { amount: -20 }, createColor).toHex()).toBe('#7a99b8');
    expect(base.toHex()).toBe('#6699cc');
  });

  it('clamps saturation between 0% and 100%', () => {
    expect(saturateColor(new Color('#f90606'), { amount: 10 }, createColor).toHex()).toBe(
      '#ff0000',
    );
    expect(saturateColor(new Color('#867979'), { amount: -10 }, createColor).toHex()).toBe(
      '#808080',
    );
    expect(saturateColor(new Color('#4080bf'), { amount: 300 }, createColor).toHex()).toBe(
      '#0081ff',
    );
    expect(saturateColor(new Color('#808080'), { amount: 10 }, createColor).toHex()).toBe(
      '#8d7373',
    );
  });

  it('uses the default 10% increase', () => {
    expect(saturateColor(new Color('#4080bf'), createColor).toHex()).toBe('#3380cc');
  });

  it('supports LCH saturation with adjustable LAB-like scaling', () => {
    const mutedTeal = new Color('hsl(190, 25%, 55%)');
    expect(saturateColor(mutedTeal, { space: 'LCH', amount: 40 }, createColor).toHex()).toBe(
      '#00b8f7',
    );
    expect(
      saturateColor(mutedTeal, { space: 'LCH', amount: 40, labScale: 12 }, createColor).toHex(),
    ).toBe('#00b1dd');
  });

  it('returns a new color when the HSL delta is zero while keeping alpha', () => {
    const base = new Color('rgba(170, 119, 51, 0.4)');
    const saturated = saturateColor(base, { amount: 0, space: 'HSL' }, createColor);

    expect(saturated.toHex8()).toBe('#aa773366');
    expect(base.toHex8()).toBe('#aa773366');
    expect(saturated).not.toBe(base);
  });

  it('clamps LCH chroma to zero for large negative adjustments', () => {
    const paleGreen = new Color({ l: 60, c: 5, h: 120 });
    const saturated = saturateColor(paleGreen, { space: 'LCH', amount: -60 }, createColor);
    const saturatedLCH = saturated.toLCH();

    expect(saturated.toHex()).toBe('#919191');
    expect(saturatedLCH.c).toBeLessThan(0.02);
    expect(Number.isFinite(saturatedLCH.h)).toBe(true);
  });

  it('scales LCH chroma shifts based on labScale', () => {
    const base = new Color('hsl(200, 35%, 50%)');
    const defaultScale = saturateColor(base, { space: 'LCH', amount: 30 }, createColor);
    const smallScale = saturateColor(base, { space: 'LCH', amount: 30, labScale: 8 }, createColor);

    expect(defaultScale.toHex()).toBe('#009dff');
    expect(smallScale.toHex()).toBe('#0095d2');
    expect(base.toHex()).toBe('#538eac');
  });
});

describe('desaturateColor', () => {
  it('reduces saturation', () => {
    const base = new Color('#6699cc');
    expect(desaturateColor(base, { amount: 20 }, createColor).toHex()).toBe('#7a99b8');
    expect(desaturateColor(base, { amount: -20 }, createColor).toHex()).toBe('#5299e0');
    expect(base.toHex()).toBe('#6699cc');
  });

  it('clamps at zero and uses default reduction', () => {
    expect(desaturateColor(new Color('#867979'), { amount: 10 }, createColor).toHex()).toBe(
      '#808080',
    );
    expect(desaturateColor(new Color('#6699cc'), createColor).toHex()).toBe('#7099c2');
  });

  it('handles LCH desaturation with clamping, preserved alpha, and adjustable scaling', () => {
    const translucentViolet = new Color('rgba(120, 80, 200, 0.5)');
    const defaultDesaturation = desaturateColor(
      translucentViolet,
      { space: 'LCH', amount: 30 },
      createColor,
    );
    const smallerScale = desaturateColor(
      translucentViolet,
      {
        space: 'LCH',
        amount: 30,
        labScale: 8,
      },
      createColor,
    );

    expect(defaultDesaturation.toHex()).toBe('#6f637f');
    expect(defaultDesaturation.toRGBA().a).toBeCloseTo(0.5, 5);
    expect(smallerScale.toHex()).toBe('#7659a7');
    expect(smallerScale.toRGBA().a).toBeCloseTo(0.5, 5);
  });

  it('clamps saturation to gray for extreme HSL reductions', () => {
    const vividOrange = new Color('#ff8800');
    const desaturated = desaturateColor(vividOrange, { amount: 200 }, createColor);

    expect(desaturated.toHex()).toBe('#808080');
    expect(vividOrange.toHex()).toBe('#ff8800');
  });

  it('normalizes hue after chroma collapses in LCH space', () => {
    const mutedCyan = new Color({ l: 55, c: 2, h: 180 });
    const desaturated = desaturateColor(mutedCyan, { space: 'LCH', amount: 15 }, createColor);
    const desaturatedLCH = desaturated.toLCH();

    expect(desaturated.toHex()).toBe('#848484');
    expect(desaturatedLCH.c).toBeLessThan(0.02);
    expect(Number.isFinite(desaturatedLCH.h)).toBe(true);
  });

  it('preserves alpha when desaturating translucent colors', () => {
    const translucentBrown = new Color('rgba(120, 60, 30, 0.2)');
    const desaturated = desaturateColor(translucentBrown, { amount: 20 }, createColor);

    expect(desaturated.toHex8()).toBe('#69412d33');
    expect(translucentBrown.toHex8()).toBe('#783c1e33');
  });
});

describe('colorToGrayscale', () => {
  it('converts different colors to grayscale', () => {
    expect(colorToGrayscale(new Color('#ff0000'), createColor).toHex()).toBe('#808080');
    expect(colorToGrayscale(new Color('#00ff00'), createColor).toHex()).toBe('#808080');
    expect(colorToGrayscale(new Color('#0000ff'), createColor).toHex()).toBe('#808080');
  });

  it('handles white and black and does not mutate the originals', () => {
    const white = new Color('#ffffff');
    const black = new Color('#000000');
    expect(colorToGrayscale(white, createColor).toHex()).toBe('#ffffff');
    expect(colorToGrayscale(black, createColor).toHex()).toBe('#000000');
    expect(white.toHex()).toBe('#ffffff');
    expect(black.toHex()).toBe('#000000');
  });

  it('preserves alpha while removing saturation', () => {
    const translucentBlue = new Color('rgba(50, 100, 150, 0.25)');
    const gray = colorToGrayscale(translucentBlue, createColor);

    expect(gray.toHex()).toBe('#646464');
    expect(gray.toRGBA().a).toBeCloseTo(0.25, 5);
    expect(translucentBlue.toHex8()).toBe('#32649640');
  });
});
