import { Color } from '../color';

describe('spin', () => {
  it('rotates hue forward around the wheel', () => {
    expect(new Color('#ff0000').spin(0).toHex()).toBe('#ff0000');
    expect(new Color('#ff0000').spin(30).toHex()).toBe('#ff8000');
    expect(new Color('#ff0000').spin(120).toHex()).toBe('#00ff00');
    expect(new Color('#ff0000').spin(240).toHex()).toBe('#0000ff');
  });

  it('wraps hue for large positive or negative rotations', () => {
    expect(new Color('#ff0000').spin(400).toHex()).toBe('#ffaa00');
    expect(new Color('#ff0000').spin(720).toHex()).toBe('#ff0000');
    expect(new Color('#ff0000').spin(-390).toHex()).toBe('#ff0080');
    expect(new Color('#ff0000').spin(-420).toHex()).toBe('#ff00ff');
  });

  it('preserves fractional degree values without truncating', () => {
    expect(new Color('#ff0000').spin(30.5).toHex()).toBe('#ff8200');
    expect(new Color('#ff0000').spin(12.34).toHex()).toBe('#ff3400');
    expect(new Color('#ff0000').spin(-30.7).toHex()).toBe('#ff0082');
  });

  it('keeps hues in the expected range for negative fractional rotations', () => {
    const rotated = new Color('hsl(210, 70%, 60%)').spin(-420.25);
    expect(rotated.toHex()).toBe('#52e098');
    expect(rotated.toHSL().h).toBeCloseTo(150, 0);
  });

  it('works with different base colors', () => {
    expect(new Color('#00ff00').spin(120).toHex()).toBe('#0000ff');
    expect(new Color('#00ff00').spin(-240).toHex()).toBe('#0000ff');
    expect(new Color('#0000ff').spin(240).toHex()).toBe('#00ff00');
    expect(new Color('#ffff00').spin(450).toHex()).toBe('#00ff80');
    expect(new Color('#00ffff').spin(60).toHex()).toBe('#0000ff');
    expect(new Color('#ff00ff').spin(120).toHex()).toBe('#ffff00');
  });

  it('does not mutate the original color', () => {
    const red = new Color('#ff0000');
    const spun = red.spin(120);
    expect(spun.toHex()).toBe('#00ff00');
    expect(red.toHex()).toBe('#ff0000');
  });

  it('preserves alpha while rotating hue', () => {
    const translucentRed = new Color('rgba(255, 0, 0, 0.42)');
    const spun = translucentRed.spin(60);

    expect(spun.toHex8()).toBe('#ffff006b');
    expect(spun.toRGBA().a).toBeCloseTo(0.42, 5);
    expect(translucentRed.toRGBA().a).toBeCloseTo(0.42, 5);
  });
});

describe('brighten', () => {
  it('adjusts lightness relative to the base color', () => {
    const gray = new Color('#808080');
    expect(gray.brighten({}).toHex()).toBe('#9a9a9a');
    expect(gray.brighten({ amount: -10 }).toHex()).toBe('#676767');
    expect(gray.toHex()).toBe('#808080');
  });

  it('clamps at lightness bounds', () => {
    expect(new Color('#ffffff').brighten({ amount: 10 }).toHex()).toBe('#ffffff');
    expect(new Color('#000000').brighten({ amount: -10 }).toHex()).toBe('#000000');
    expect(new Color('#000000').brighten({ amount: 200 }).toHex()).toBe('#ffffff');
    expect(new Color('#ffffff').brighten({ amount: -200 }).toHex()).toBe('#000000');
  });

  it('uses the default 10% increase', () => {
    expect(new Color('#000000').brighten().toHex()).toBe('#1a1a1a');
  });

  it('supports LAB adjustments with configurable LAB-like scaling', () => {
    const translucentTeal = new Color('rgba(0, 128, 128, 0.4)');
    const defaultScale = translucentTeal.brighten({ space: 'LAB', amount: 30 });
    const smallerScale = translucentTeal.brighten({ space: 'LAB', amount: 30, labScale: 12 });

    expect(defaultScale.toHex()).toBe('#aeffff');
    expect(defaultScale.toRGBA().a).toBeCloseTo(0.4, 5);
    expect(smallerScale.toHex()).toBe('#81e2e1');
    expect(smallerScale.toRGBA().a).toBeCloseTo(0.4, 5);
  });

  it('honors fractional HSL adjustments when options are explicitly provided', () => {
    const base = new Color('#123456');
    const brightened = base.brighten({ amount: 7.5, space: 'HSL' });

    expect(brightened.toHex()).toBe('#194776');
    expect(brightened).not.toBe(base);
    expect(base.toHex()).toBe('#123456');
  });

  it('applies LAB deltas scaled by labScale while keeping alpha intact', () => {
    const base = new Color({ l: 50, a: 0, b: 0 }).setAlpha(0.8);
    const brightened = base.brighten({ space: 'LAB', amount: 5, labScale: 10 });
    const brightenedLAB = brightened.toLAB();

    expect(brightenedLAB.l).toBeCloseTo(55.148, 3);
    expect(brightened.toHex()).toBe('#848484');
    expect(brightened.toRGBA().a).toBeCloseTo(0.8, 5);
    expect(base.toHex()).toBe('#777777');
  });

  it('supports LCH adjustments with custom LAB-like scaling', () => {
    const base = new Color({ l: 40, c: 20, h: 250 });
    const brightened = base.brighten({ space: 'LCH', amount: 25, labScale: 8 });
    const brightenedLCH = brightened.toLCH();

    expect(brightened.toHex()).toBe('#6d96b1');
    expect(brightenedLCH.l).toBeCloseTo(60.103, 3);
    expect(brightenedLCH.c).toBeCloseTo(19.843, 3);
    expect(brightenedLCH.h).toBeCloseTo(249.226, 3);
  });

  it('normalizes near-neutral inputs before brightening in LCH space', () => {
    const gray = new Color('#808080');
    const brightened = gray.brighten({ space: 'LCH', amount: 10 });
    const lch = brightened.toLCH();

    expect(lch.c).toBeLessThan(0.02);
    expect(Number.isFinite(lch.h)).toBe(true);
    expect(gray.toHex()).toBe('#808080');
  });
});

describe('darken', () => {
  it('reduces lightness by the given percentage', () => {
    const gray = new Color('#808080');
    expect(gray.darken().toHex()).toBe('#676767');
    expect(gray.darken({ amount: -10 }).toHex()).toBe('#9a9a9a');
    expect(gray.toHex()).toBe('#808080');
  });

  it('clamps at black', () => {
    expect(new Color('#000000').darken({ amount: 10 }).toHex()).toBe('#000000');
    expect(new Color('#ffffff').darken({ amount: 200 }).toHex()).toBe('#000000');
  });

  it('uses the default 10% decrease', () => {
    expect(new Color('#ffffff').darken({}).toHex()).toBe('#e6e6e6');
  });

  it('accepts LAB options and clamps when approaching black', () => {
    expect(new Color('#ffffff').darken({ amount: 200, space: 'LAB' }).toHex()).toBe('#000000');
    expect(new Color('#000000').darken({ amount: 25, space: 'LAB' }).toHex()).toBe('#000000');
  });

  it('scales LAB/LCH deltas using the provided labScale', () => {
    const gray = new Color('#808080');
    expect(gray.darken({ space: 'LCH', amount: 20 }).toHex()).toBe('#2b2b2b');
    expect(gray.darken({ space: 'LCH', amount: 20, labScale: 10 }).toHex()).toBe('#4f4f4f');
  });

  it('handles fractional HSL adjustments without mutating the source color', () => {
    const parchment = new Color('#f0eedd');
    const darkened = parchment.darken({ amount: 12.5 });

    expect(darkened.toHex()).toBe('#dcd8b1');
    expect(parchment.toHex()).toBe('#f0eedd');
  });

  it('applies LAB deltas with custom scaling and preserves transparency', () => {
    const base = new Color({ l: 45, a: -5, b: 15 }).setAlpha(0.65);
    const darkened = base.darken({ space: 'LAB', amount: 15, labScale: 5 });
    const darkenedLAB = darkened.toLAB();

    expect(darkenedLAB.l).toBeCloseTo(37.583, 3);
    expect(darkened.toHex8()).toBe('#5a5a40a6');
    expect(base.toHex8()).toBe('#6c6c51a6');
  });

  it('normalizes near-grayscale hues before darkening in LCH space', () => {
    const gray = new Color('#808080');
    const darkened = gray.darken({ space: 'LCH', amount: 25 });
    const lch = darkened.toLCH();

    expect(lch.c).toBeLessThan(0.01);
    expect(Number.isFinite(lch.h)).toBe(true);
    expect(gray.toHex()).toBe('#808080');
  });
});

describe('saturate', () => {
  it('adjusts saturation by the requested amount', () => {
    const base = new Color('#6699cc');
    expect(base.saturate({ amount: 20 }).toHex()).toBe('#5299e0');
    expect(base.saturate({ amount: -20 }).toHex()).toBe('#7a99b8');
    expect(base.toHex()).toBe('#6699cc');
  });

  it('clamps saturation between 0% and 100%', () => {
    expect(new Color('#f90606').saturate({ amount: 10 }).toHex()).toBe('#ff0000');
    expect(new Color('#867979').saturate({ amount: -10 }).toHex()).toBe('#808080');
    expect(new Color('#4080bf').saturate({ amount: 300 }).toHex()).toBe('#0081ff');
    expect(new Color('#808080').saturate({ amount: 10 }).toHex()).toBe('#8d7373');
  });

  it('uses the default 10% increase', () => {
    expect(new Color('#4080bf').saturate().toHex()).toBe('#3380cc');
  });

  it('supports LCH saturation with adjustable LAB-like scaling', () => {
    const mutedTeal = new Color('hsl(190, 25%, 55%)');
    expect(mutedTeal.saturate({ space: 'LCH', amount: 40 }).toHex()).toBe('#00b8f7');
    expect(mutedTeal.saturate({ space: 'LCH', amount: 40, labScale: 12 }).toHex()).toBe('#00b1dd');
  });

  it('returns a new color when the HSL delta is zero while keeping alpha', () => {
    const base = new Color('rgba(170, 119, 51, 0.4)');
    const saturated = base.saturate({ amount: 0, space: 'HSL' });

    expect(saturated.toHex8()).toBe('#aa773366');
    expect(base.toHex8()).toBe('#aa773366');
    expect(saturated).not.toBe(base);
  });

  it('clamps LCH chroma to zero for large negative adjustments', () => {
    const paleGreen = new Color({ l: 60, c: 5, h: 120 });
    const saturated = paleGreen.saturate({ space: 'LCH', amount: -60 });
    const saturatedLCH = saturated.toLCH();

    expect(saturated.toHex()).toBe('#919191');
    expect(saturatedLCH.c).toBeLessThan(0.02);
    expect(Number.isFinite(saturatedLCH.h)).toBe(true);
  });

  it('scales LCH chroma shifts based on labScale', () => {
    const base = new Color('hsl(200, 35%, 50%)');
    const defaultScale = base.saturate({ space: 'LCH', amount: 30 });
    const smallScale = base.saturate({ space: 'LCH', amount: 30, labScale: 8 });

    expect(defaultScale.toHex()).toBe('#009dff');
    expect(smallScale.toHex()).toBe('#0095d2');
    expect(base.toHex()).toBe('#538eac');
  });
});

describe('desaturate', () => {
  it('reduces saturation', () => {
    const base = new Color('#6699cc');
    expect(base.desaturate({ amount: 20 }).toHex()).toBe('#7a99b8');
    expect(base.desaturate({ amount: -20 }).toHex()).toBe('#5299e0');
    expect(base.toHex()).toBe('#6699cc');
  });

  it('clamps at zero and uses default reduction', () => {
    expect(new Color('#867979').desaturate({ amount: 10 }).toHex()).toBe('#808080');
    expect(new Color('#6699cc').desaturate().toHex()).toBe('#7099c2');
  });

  it('handles LCH desaturation with clamping, preserved alpha, and adjustable scaling', () => {
    const translucentViolet = new Color('rgba(120, 80, 200, 0.5)');
    const defaultDesaturation = translucentViolet.desaturate({ space: 'LCH', amount: 30 });
    const smallerScale = translucentViolet.desaturate({ space: 'LCH', amount: 30, labScale: 8 });

    expect(defaultDesaturation.toHex()).toBe('#6f637f');
    expect(defaultDesaturation.toRGBA().a).toBeCloseTo(0.5, 5);
    expect(smallerScale.toHex()).toBe('#7659a7');
    expect(smallerScale.toRGBA().a).toBeCloseTo(0.5, 5);
  });

  it('clamps saturation to gray for extreme HSL reductions', () => {
    const vividOrange = new Color('#ff8800');
    const desaturated = vividOrange.desaturate({ amount: 200 });

    expect(desaturated.toHex()).toBe('#808080');
    expect(vividOrange.toHex()).toBe('#ff8800');
  });

  it('normalizes hue after chroma collapses in LCH space', () => {
    const mutedCyan = new Color({ l: 55, c: 2, h: 180 });
    const desaturated = mutedCyan.desaturate({ space: 'LCH', amount: 15 });
    const desaturatedLCH = desaturated.toLCH();

    expect(desaturated.toHex()).toBe('#848484');
    expect(desaturatedLCH.c).toBeLessThan(0.02);
    expect(Number.isFinite(desaturatedLCH.h)).toBe(true);
  });

  it('preserves alpha when desaturating translucent colors', () => {
    const translucentBrown = new Color('rgba(120, 60, 30, 0.2)');
    const desaturated = translucentBrown.desaturate({ amount: 20 });

    expect(desaturated.toHex8()).toBe('#69412d33');
    expect(translucentBrown.toHex8()).toBe('#783c1e33');
  });
});

describe('grayscale', () => {
  it('converts different colors to grayscale', () => {
    expect(new Color('#ff0000').grayscale().toHex()).toBe('#808080');
    expect(new Color('#00ff00').grayscale().toHex()).toBe('#808080');
    expect(new Color('#0000ff').grayscale().toHex()).toBe('#808080');
  });

  it('handles white and black and does not mutate the originals', () => {
    const white = new Color('#ffffff');
    const black = new Color('#000000');
    expect(white.grayscale().toHex()).toBe('#ffffff');
    expect(black.grayscale().toHex()).toBe('#000000');
    expect(white.toHex()).toBe('#ffffff');
    expect(black.toHex()).toBe('#000000');
  });

  it('preserves alpha while removing saturation', () => {
    const translucentBlue = new Color('rgba(50, 100, 150, 0.25)');
    const gray = translucentBlue.grayscale();

    expect(gray.toHex()).toBe('#646464');
    expect(gray.toRGBA().a).toBeCloseTo(0.25, 5);
    expect(translucentBlue.toHex8()).toBe('#32649640');
  });
});
