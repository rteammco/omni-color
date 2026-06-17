import { toHex, toHex8, toHSL, toLAB, toLCH, toRGBA } from '../conversions';
import type { ColorRGBA } from '../formats.types';
import {
  brightenColor,
  colorToGrayscale,
  darkenColor,
  desaturateColor,
  saturateColor,
  spinColorHue,
} from '../manipulations';

/** Shorthand: parse a hex string into a ColorRGBA. */
function rgba(hex: string): ColorRGBA {
  return toRGBA(hex as `#${string}`);
}

/** Shorthand: convert a ColorRGBA to a 6-digit hex string. */
function hex(color: ColorRGBA): string {
  return toHex(color);
}

/** Shorthand: convert a ColorRGBA to an 8-digit hex string. */
function hex8(color: ColorRGBA): string {
  return toHex8(color);
}

describe('spinColorHue', () => {
  it('rotates hue forward around the wheel', () => {
    expect(hex(spinColorHue(rgba('#ff0000'), 0))).toBe('#ff0000');
    expect(hex(spinColorHue(rgba('#ff0000'), 30))).toBe('#ff8000');
    expect(hex(spinColorHue(rgba('#ff0000'), 120))).toBe('#00ff00');
    expect(hex(spinColorHue(rgba('#ff0000'), 240))).toBe('#0000ff');
  });

  it('wraps hue for large positive or negative rotations', () => {
    expect(hex(spinColorHue(rgba('#ff0000'), 400))).toBe('#ffaa00');
    expect(hex(spinColorHue(rgba('#ff0000'), 720))).toBe('#ff0000');
    expect(hex(spinColorHue(rgba('#ff0000'), -390))).toBe('#ff0080');
    expect(hex(spinColorHue(rgba('#ff0000'), -420))).toBe('#ff00ff');
  });

  it('preserves fractional degree values without truncating', () => {
    expect(hex(spinColorHue(rgba('#ff0000'), 30.5))).toBe('#ff8200');
    expect(hex(spinColorHue(rgba('#ff0000'), 12.34))).toBe('#ff3400');
    expect(hex(spinColorHue(rgba('#ff0000'), -30.7))).toBe('#ff0082');
  });

  it('keeps hues in the expected range for negative fractional rotations', () => {
    const input = toRGBA({ h: 210, s: 70, l: 60, a: 1 });
    const rotated = spinColorHue(input, -420.25);
    expect(hex(rotated)).toBe('#52e098');
    expect(toHSL(rotated).h).toBeCloseTo(150, 0);
  });

  it('works with different base colors', () => {
    expect(hex(spinColorHue(rgba('#00ff00'), 120))).toBe('#0000ff');
    expect(hex(spinColorHue(rgba('#00ff00'), -240))).toBe('#0000ff');
    expect(hex(spinColorHue(rgba('#0000ff'), 240))).toBe('#00ff00');
    expect(hex(spinColorHue(rgba('#ffff00'), 450))).toBe('#00ff80');
    expect(hex(spinColorHue(rgba('#00ffff'), 60))).toBe('#0000ff');
    expect(hex(spinColorHue(rgba('#ff00ff'), 120))).toBe('#ffff00');
  });

  it('does not mutate the original color', () => {
    const red = rgba('#ff0000');
    const spun = spinColorHue(red, 120);
    expect(hex(spun)).toBe('#00ff00');
    expect(hex(red)).toBe('#ff0000');
  });

  it('preserves alpha while rotating hue', () => {
    const translucentRed: ColorRGBA = { r: 255, g: 0, b: 0, a: 0.42 };
    const spun = spinColorHue(translucentRed, 60);

    expect(hex8(spun)).toBe('#ffff006b');
    expect(spun.a).toBeCloseTo(0.42, 5);
    expect(translucentRed.a).toBeCloseTo(0.42, 5);
  });
});

describe('brightenColor', () => {
  it('adjusts lightness relative to the base color', () => {
    const gray = rgba('#808080');
    expect(hex(brightenColor(gray))).toBe('#9a9a9a');
    expect(hex(brightenColor(gray, { amount: -10 }))).toBe('#676767');
    expect(hex(gray)).toBe('#808080');
  });

  it('clamps at lightness bounds', () => {
    expect(hex(brightenColor(rgba('#ffffff'), { amount: 10 }))).toBe('#ffffff');
    expect(hex(brightenColor(rgba('#000000'), { amount: -10 }))).toBe('#000000');
    expect(hex(brightenColor(rgba('#000000'), { amount: 200 }))).toBe('#ffffff');
    expect(hex(brightenColor(rgba('#ffffff'), { amount: -200 }))).toBe('#000000');
  });

  it('uses the default 10% increase', () => {
    expect(hex(brightenColor(rgba('#000000')))).toBe('#1a1a1a');
  });

  it('supports LAB adjustments with configurable LAB-like scaling', () => {
    const translucentTeal: ColorRGBA = { r: 0, g: 128, b: 128, a: 0.4 };
    const defaultScale = brightenColor(translucentTeal, { space: 'LAB', amount: 30 });
    const smallerScale = brightenColor(translucentTeal, {
      space: 'LAB',
      amount: 30,
      labScale: 12,
    });

    expect(hex(defaultScale)).toBe('#aeffff');
    expect(defaultScale.a).toBeCloseTo(0.4, 5);
    expect(hex(smallerScale)).toBe('#81e2e1');
    expect(smallerScale.a).toBeCloseTo(0.4, 5);
  });

  it('honors fractional HSL adjustments when options are explicitly provided', () => {
    const base = rgba('#123456');
    const brightened = brightenColor(base, { amount: 7.5, space: 'HSL' });

    expect(hex(brightened)).toBe('#194776');
    expect(hex(base)).toBe('#123456');
  });

  it('applies LAB deltas scaled by labScale while keeping alpha intact', () => {
    const base: ColorRGBA = { ...toRGBA({ l: 50, a: 0, b: 0 }), a: 0.8 };
    const brightened = brightenColor(base, { space: 'LAB', amount: 5, labScale: 10 });
    const brightenedLAB = toLAB(brightened);

    expect(brightenedLAB.l).toBeCloseTo(55.148, 3);
    expect(hex(brightened)).toBe('#848484');
    expect(brightened.a).toBeCloseTo(0.8, 5);
    expect(hex(base)).toBe('#777777');
  });

  it('supports LCH adjustments with custom LAB-like scaling', () => {
    const base: ColorRGBA = toRGBA({ l: 40, c: 20, h: 250, format: 'LCH' });
    const brightened = brightenColor(base, { space: 'LCH', amount: 25, labScale: 8 });
    const brightenedLCH = toLCH(brightened);

    expect(hex(brightened)).toBe('#6d96b1');
    expect(brightenedLCH.l).toBeCloseTo(60.103, 3);
    expect(brightenedLCH.c).toBeCloseTo(19.843, 3);
    expect(brightenedLCH.h).toBeCloseTo(249.226, 3);
  });

  it('normalizes near-neutral inputs before brightening in LCH space', () => {
    const gray = rgba('#808080');
    const brightened = brightenColor(gray, { space: 'LCH', amount: 10 });
    const lch = toLCH(brightened);

    expect(lch.c).toBeLessThan(0.02);
    expect(Number.isFinite(lch.h)).toBe(true);
    expect(hex(gray)).toBe('#808080');
  });
});

describe('darkenColor', () => {
  it('reduces lightness by the given percentage', () => {
    const gray = rgba('#808080');
    expect(hex(darkenColor(gray))).toBe('#676767');
    expect(hex(darkenColor(gray, { amount: -10 }))).toBe('#9a9a9a');
    expect(hex(gray)).toBe('#808080');
  });

  it('clamps at black', () => {
    expect(hex(darkenColor(rgba('#000000'), { amount: 10 }))).toBe('#000000');
    expect(hex(darkenColor(rgba('#ffffff'), { amount: 200 }))).toBe('#000000');
  });

  it('uses the default 10% decrease', () => {
    expect(hex(darkenColor(rgba('#ffffff')))).toBe('#e6e6e6');
  });

  it('accepts LAB options and clamps when approaching black', () => {
    expect(hex(darkenColor(rgba('#ffffff'), { amount: 200, space: 'LAB' }))).toBe('#000000');
    expect(hex(darkenColor(rgba('#000000'), { amount: 25, space: 'LAB' }))).toBe('#000000');
  });

  it('scales LAB/LCH deltas using the provided labScale', () => {
    const gray = rgba('#808080');
    expect(hex(darkenColor(gray, { space: 'LCH', amount: 20 }))).toBe('#2b2b2b');
    expect(hex(darkenColor(gray, { space: 'LCH', amount: 20, labScale: 10 }))).toBe('#4f4f4f');
  });

  it('handles fractional HSL adjustments without mutating the source color', () => {
    const parchment = rgba('#f0eedd');
    const darkened = darkenColor(parchment, { amount: 12.5 });

    expect(hex(darkened)).toBe('#dcd8b1');
    expect(hex(parchment)).toBe('#f0eedd');
  });

  it('applies LAB deltas with custom scaling and preserves transparency', () => {
    const base: ColorRGBA = { ...toRGBA({ l: 45, a: -5, b: 15 }), a: 0.65 };
    const darkened = darkenColor(base, { space: 'LAB', amount: 15, labScale: 5 });
    const darkenedLAB = toLAB(darkened);

    expect(darkenedLAB.l).toBeCloseTo(37.583, 3);
    expect(hex8(darkened)).toBe('#5a5a40a6');
    expect(hex8(base)).toBe('#6c6c51a6');
  });

  it('normalizes near-grayscale hues before darkening in LCH space', () => {
    const gray = rgba('#808080');
    const darkened = darkenColor(gray, { space: 'LCH', amount: 25 });
    const lch = toLCH(darkened);

    expect(lch.c).toBeLessThan(0.01);
    expect(Number.isFinite(lch.h)).toBe(true);
    expect(hex(gray)).toBe('#808080');
  });
});

describe('saturateColor', () => {
  it('adjusts saturation by the requested amount', () => {
    const base = rgba('#6699cc');
    expect(hex(saturateColor(base, { amount: 20 }))).toBe('#5299e0');
    expect(hex(saturateColor(base, { amount: -20 }))).toBe('#7a99b8');
    expect(hex(base)).toBe('#6699cc');
  });

  it('clamps saturation between 0% and 100%', () => {
    expect(hex(saturateColor(rgba('#f90606'), { amount: 10 }))).toBe('#ff0000');
    expect(hex(saturateColor(rgba('#867979'), { amount: -10 }))).toBe('#808080');
    expect(hex(saturateColor(rgba('#4080bf'), { amount: 300 }))).toBe('#0081ff');
    expect(hex(saturateColor(rgba('#808080'), { amount: 10 }))).toBe('#8d7373');
  });

  it('uses the default 10% increase', () => {
    expect(hex(saturateColor(rgba('#4080bf')))).toBe('#3380cc');
  });

  it('supports LCH saturation with adjustable LAB-like scaling', () => {
    const mutedTeal = toRGBA({ h: 190, s: 25, l: 55, a: 1 });
    expect(hex(saturateColor(mutedTeal, { space: 'LCH', amount: 40 }))).toBe('#00b8f7');
    expect(hex(saturateColor(mutedTeal, { space: 'LCH', amount: 40, labScale: 12 }))).toBe(
      '#00b1dd',
    );
  });

  it('returns a new RGBA when the HSL delta is zero while keeping alpha', () => {
    const base: ColorRGBA = { r: 170, g: 119, b: 51, a: 0.4 };
    const saturated = saturateColor(base, { amount: 0, space: 'HSL' });

    expect(hex8(saturated)).toBe('#aa773366');
    expect(hex8(base)).toBe('#aa773366');
    expect(saturated).not.toBe(base);
  });

  it('clamps LCH chroma to zero for large negative adjustments', () => {
    const paleGreen: ColorRGBA = toRGBA({ l: 60, c: 5, h: 120, format: 'LCH' });
    const saturated = saturateColor(paleGreen, { space: 'LCH', amount: -60 });
    const saturatedLCH = toLCH(saturated);

    expect(hex(saturated)).toBe('#919191');
    expect(saturatedLCH.c).toBeLessThan(0.02);
    expect(Number.isFinite(saturatedLCH.h)).toBe(true);
  });

  it('scales LCH chroma shifts based on labScale', () => {
    const base = toRGBA({ h: 200, s: 35, l: 50, a: 1 });
    const defaultScale = saturateColor(base, { space: 'LCH', amount: 30 });
    const smallScale = saturateColor(base, { space: 'LCH', amount: 30, labScale: 8 });

    expect(hex(defaultScale)).toBe('#009dff');
    expect(hex(smallScale)).toBe('#0095d2');
    expect(hex(base)).toBe('#538eac');
  });
});

describe('desaturateColor', () => {
  it('reduces saturation', () => {
    const base = rgba('#6699cc');
    expect(hex(desaturateColor(base, { amount: 20 }))).toBe('#7a99b8');
    expect(hex(desaturateColor(base, { amount: -20 }))).toBe('#5299e0');
    expect(hex(base)).toBe('#6699cc');
  });

  it('clamps at zero and uses default reduction', () => {
    expect(hex(desaturateColor(rgba('#867979'), { amount: 10 }))).toBe('#808080');
    expect(hex(desaturateColor(rgba('#6699cc')))).toBe('#7099c2');
  });

  it('handles LCH desaturation with clamping, preserved alpha, and adjustable scaling', () => {
    const translucentViolet: ColorRGBA = { r: 120, g: 80, b: 200, a: 0.5 };
    const defaultDesaturation = desaturateColor(translucentViolet, {
      space: 'LCH',
      amount: 30,
    });
    const smallerScale = desaturateColor(translucentViolet, {
      space: 'LCH',
      amount: 30,
      labScale: 8,
    });

    expect(hex(defaultDesaturation)).toBe('#6f637f');
    expect(defaultDesaturation.a).toBeCloseTo(0.5, 5);
    expect(hex(smallerScale)).toBe('#7659a7');
    expect(smallerScale.a).toBeCloseTo(0.5, 5);
  });

  it('clamps saturation to gray for extreme HSL reductions', () => {
    const vividOrange = rgba('#ff8800');
    const desaturated = desaturateColor(vividOrange, { amount: 200 });

    expect(hex(desaturated)).toBe('#808080');
    expect(hex(vividOrange)).toBe('#ff8800');
  });

  it('normalizes hue after chroma collapses in LCH space', () => {
    const mutedCyan: ColorRGBA = toRGBA({ l: 55, c: 2, h: 180, format: 'LCH' });
    const desaturated = desaturateColor(mutedCyan, { space: 'LCH', amount: 15 });
    const desaturatedLCH = toLCH(desaturated);

    expect(hex(desaturated)).toBe('#848484');
    expect(desaturatedLCH.c).toBeLessThan(0.02);
    expect(Number.isFinite(desaturatedLCH.h)).toBe(true);
  });

  it('preserves alpha when desaturating translucent colors', () => {
    const translucentBrown: ColorRGBA = { r: 120, g: 60, b: 30, a: 0.2 };
    const desaturated = desaturateColor(translucentBrown, { amount: 20 });

    expect(hex8(desaturated)).toBe('#69412d33');
    expect(hex8(translucentBrown)).toBe('#783c1e33');
  });
});

describe('colorToGrayscale', () => {
  it('converts different colors to grayscale', () => {
    expect(hex(colorToGrayscale(rgba('#ff0000')))).toBe('#808080');
    expect(hex(colorToGrayscale(rgba('#00ff00')))).toBe('#808080');
    expect(hex(colorToGrayscale(rgba('#0000ff')))).toBe('#808080');
  });

  it('handles white and black and does not mutate the originals', () => {
    const white = rgba('#ffffff');
    const black = rgba('#000000');
    expect(hex(colorToGrayscale(white))).toBe('#ffffff');
    expect(hex(colorToGrayscale(black))).toBe('#000000');
    expect(hex(white)).toBe('#ffffff');
    expect(hex(black)).toBe('#000000');
  });

  it('preserves alpha while removing saturation', () => {
    const translucentBlue: ColorRGBA = { r: 50, g: 100, b: 150, a: 0.25 };
    const gray = colorToGrayscale(translucentBlue);

    expect(hex(gray)).toBe('#646464');
    expect(gray.a).toBeCloseTo(0.25, 5);
    expect(hex8(translucentBlue)).toBe('#32649640');
  });
});
