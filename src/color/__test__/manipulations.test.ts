import { Color } from '../color';
import {
  brightenColor,
  colorToGrayscale,
  darkenColor,
  desaturateColor,
  saturateColor,
  spinColorHue,
} from '../manipulations';

describe('spinColorHue', () => {
  it('rotates hue forward around the wheel', () => {
    expect(spinColorHue(new Color('#ff0000'), 0).toHex()).toBe('#ff0000');
    expect(spinColorHue(new Color('#ff0000'), 30).toHex()).toBe('#ff8000');
    expect(spinColorHue(new Color('#ff0000'), 120).toHex()).toBe('#00ff00');
    expect(spinColorHue(new Color('#ff0000'), 240).toHex()).toBe('#0000ff');
  });

  it('wraps hue for large positive or negative rotations', () => {
    expect(spinColorHue(new Color('#ff0000'), 400).toHex()).toBe('#ffaa00');
    expect(spinColorHue(new Color('#ff0000'), 720).toHex()).toBe('#ff0000');
    expect(spinColorHue(new Color('#ff0000'), -390).toHex()).toBe('#ff0080');
    expect(spinColorHue(new Color('#ff0000'), -420).toHex()).toBe('#ff00ff');
  });

  it('floors fractional degree values', () => {
    expect(spinColorHue(new Color('#ff0000'), 30.5).toHex()).toBe('#ff8000');
    expect(spinColorHue(new Color('#ff0000'), 12.34).toHex()).toBe('#ff3300');
    expect(spinColorHue(new Color('#ff0000'), -30.7).toHex()).toBe('#ff0084');
  });

  it('works with different base colors', () => {
    expect(spinColorHue(new Color('#00ff00'), 120).toHex()).toBe('#0000ff');
    expect(spinColorHue(new Color('#00ff00'), -240).toHex()).toBe('#0000ff');
    expect(spinColorHue(new Color('#0000ff'), 240).toHex()).toBe('#00ff00');
    expect(spinColorHue(new Color('#ffff00'), 450).toHex()).toBe('#00ff80');
    expect(spinColorHue(new Color('#00ffff'), 60).toHex()).toBe('#0000ff');
    expect(spinColorHue(new Color('#ff00ff'), 120).toHex()).toBe('#ffff00');
  });

  it('does not mutate the original color', () => {
    const red = new Color('#ff0000');
    const spun = spinColorHue(red, 120);
    expect(spun.toHex()).toBe('#00ff00');
    expect(red.toHex()).toBe('#ff0000');
  });
});

describe('brightenColor', () => {
  it('adjusts lightness relative to the base color', () => {
    const gray = new Color('#808080');
    expect(brightenColor(gray).toHex()).toBe('#999999');
    expect(brightenColor(gray, { amount: -10 }).toHex()).toBe('#666666');
    expect(gray.toHex()).toBe('#808080');
  });

  it('clamps at lightness bounds', () => {
    expect(brightenColor(new Color('#ffffff'), { amount: 10 }).toHex()).toBe('#ffffff');
    expect(brightenColor(new Color('#000000'), { amount: -10 }).toHex()).toBe('#000000');
    expect(brightenColor(new Color('#000000'), { amount: 200 }).toHex()).toBe('#ffffff');
    expect(brightenColor(new Color('#ffffff'), { amount: -200 }).toHex()).toBe('#000000');
  });

  it('uses the default 10% increase', () => {
    expect(brightenColor(new Color('#000000')).toHex()).toBe('#1a1a1a');
  });

  it('supports LAB adjustments with configurable LAB-like scaling', () => {
    const translucentTeal = new Color('rgba(0, 128, 128, 0.4)');
    const defaultScale = brightenColor(translucentTeal, { space: 'LAB', amount: 30 });
    const smallerScale = brightenColor(translucentTeal, { space: 'LAB', amount: 30, labScale: 12 });

    expect(defaultScale.toHex()).toBe('#aeffff');
    expect(defaultScale.toRGBA().a).toBeCloseTo(0.4, 5);
    expect(smallerScale.toHex()).toBe('#81e2e1');
    expect(smallerScale.toRGBA().a).toBeCloseTo(0.4, 5);
  });
});

describe('darkenColor', () => {
  it('reduces lightness by the given percentage', () => {
    const gray = new Color('#808080');
    expect(darkenColor(gray).toHex()).toBe('#666666');
    expect(darkenColor(gray, { amount: -10 }).toHex()).toBe('#999999');
    expect(gray.toHex()).toBe('#808080');
  });

  it('clamps at black', () => {
    expect(darkenColor(new Color('#000000'), { amount: 10 }).toHex()).toBe('#000000');
    expect(darkenColor(new Color('#ffffff'), { amount: 200 }).toHex()).toBe('#000000');
  });

  it('uses the default 10% decrease', () => {
    expect(darkenColor(new Color('#ffffff')).toHex()).toBe('#e6e6e6');
  });

  it('accepts LAB options and clamps when approaching black', () => {
    expect(darkenColor(new Color('#ffffff'), { amount: 200, space: 'LAB' }).toHex()).toBe('#000000');
    expect(darkenColor(new Color('#000000'), { amount: 25, space: 'LAB' }).toHex()).toBe('#000000');
  });

  it('scales LAB/LCH deltas using the provided labScale', () => {
    const gray = new Color('#808080');
    expect(darkenColor(gray, { space: 'LCH', amount: 20 }).toHex()).toBe('#2b2b2b');
    expect(darkenColor(gray, { space: 'LCH', amount: 20, labScale: 10 }).toHex()).toBe('#4f4f4f');
  });
});

describe('saturateColor', () => {
  it('adjusts saturation by the requested amount', () => {
    const base = new Color('#6699cc');
    expect(saturateColor(base, { amount: 20 }).toHex()).toBe('#5299e0');
    expect(saturateColor(base, { amount: -20 }).toHex()).toBe('#7a99b8');
    expect(base.toHex()).toBe('#6699cc');
  });

  it('clamps saturation between 0% and 100%', () => {
    expect(saturateColor(new Color('#f90606'), { amount: 10 }).toHex()).toBe('#ff0000');
    expect(saturateColor(new Color('#867979'), { amount: -10 }).toHex()).toBe('#808080');
    expect(saturateColor(new Color('#4080bf'), { amount: 300 }).toHex()).toBe('#0080ff');
    expect(saturateColor(new Color('#808080'), { amount: 10 }).toHex()).toBe('#8c7373');
  });

  it('uses the default 10% increase', () => {
    expect(saturateColor(new Color('#4080bf')).toHex()).toBe('#3380cc');
  });

  it('supports LCH saturation with adjustable LAB-like scaling', () => {
    const mutedTeal = new Color('hsl(190, 25%, 55%)');
    expect(saturateColor(mutedTeal, { space: 'LCH', amount: 40 }).toHex()).toBe('#00b8f7');
    expect(saturateColor(mutedTeal, { space: 'LCH', amount: 40, labScale: 12 }).toHex()).toBe(
      '#00b1dd'
    );
  });
});

describe('desaturateColor', () => {
  it('reduces saturation', () => {
    const base = new Color('#6699cc');
    expect(desaturateColor(base, { amount: 20 }).toHex()).toBe('#7a99b8');
    expect(desaturateColor(base, { amount: -20 }).toHex()).toBe('#5299e0');
    expect(base.toHex()).toBe('#6699cc');
  });

  it('clamps at zero and uses default reduction', () => {
    expect(desaturateColor(new Color('#867979'), { amount: 10 }).toHex()).toBe('#808080');
    expect(desaturateColor(new Color('#6699cc')).toHex()).toBe('#7099c2');
  });

  it('handles LCH desaturation with clamping, preserved alpha, and adjustable scaling', () => {
    const translucentViolet = new Color('rgba(120, 80, 200, 0.5)');
    const defaultDesaturation = desaturateColor(translucentViolet, { space: 'LCH', amount: 30 });
    const smallerScale = desaturateColor(translucentViolet, { space: 'LCH', amount: 30, labScale: 8 });

    expect(defaultDesaturation.toHex()).toBe('#6f637f');
    expect(defaultDesaturation.toRGBA().a).toBeCloseTo(0.5, 5);
    expect(smallerScale.toHex()).toBe('#7659a7');
    expect(smallerScale.toRGBA().a).toBeCloseTo(0.5, 5);
  });
});

describe('colorToGrayscale', () => {
  it('converts different colors to grayscale', () => {
    expect(colorToGrayscale(new Color('#ff0000')).toHex()).toBe('#808080');
    expect(colorToGrayscale(new Color('#00ff00')).toHex()).toBe('#808080');
    expect(colorToGrayscale(new Color('#0000ff')).toHex()).toBe('#808080');
  });

  it('handles white and black and does not mutate the originals', () => {
    const white = new Color('#ffffff');
    const black = new Color('#000000');
    expect(colorToGrayscale(white).toHex()).toBe('#ffffff');
    expect(colorToGrayscale(black).toHex()).toBe('#000000');
    expect(white.toHex()).toBe('#ffffff');
    expect(black.toHex()).toBe('#000000');
  });
});
