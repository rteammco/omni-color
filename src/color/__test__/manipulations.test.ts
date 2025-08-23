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
    expect(brightenColor(gray, 10).toHex()).toBe('#999999');
    expect(brightenColor(gray, -10).toHex()).toBe('#666666');
    expect(gray.toHex()).toBe('#808080');
  });

  it('clamps at lightness bounds', () => {
    expect(brightenColor(new Color('#ffffff'), 10).toHex()).toBe('#ffffff');
    expect(brightenColor(new Color('#000000'), -10).toHex()).toBe('#000000');
    expect(brightenColor(new Color('#000000'), 200).toHex()).toBe('#ffffff');
    expect(brightenColor(new Color('#ffffff'), -200).toHex()).toBe('#000000');
  });

  it('uses the default 10% increase', () => {
    expect(brightenColor(new Color('#000000')).toHex()).toBe('#1a1a1a');
  });
});

describe('darkenColor', () => {
  it('reduces lightness by the given percentage', () => {
    const gray = new Color('#808080');
    expect(darkenColor(gray, 10).toHex()).toBe('#666666');
    expect(darkenColor(gray, -10).toHex()).toBe('#999999');
    expect(gray.toHex()).toBe('#808080');
  });

  it('clamps at black', () => {
    expect(darkenColor(new Color('#000000'), 10).toHex()).toBe('#000000');
    expect(darkenColor(new Color('#ffffff'), 200).toHex()).toBe('#000000');
  });

  it('uses the default 10% decrease', () => {
    expect(darkenColor(new Color('#ffffff')).toHex()).toBe('#e6e6e6');
  });
});

describe('saturateColor', () => {
  it('adjusts saturation by the requested amount', () => {
    const base = new Color('#6699cc');
    expect(saturateColor(base, 20).toHex()).toBe('#5299e0');
    expect(saturateColor(base, -20).toHex()).toBe('#7a99b8');
    expect(base.toHex()).toBe('#6699cc');
  });

  it('clamps saturation between 0% and 100%', () => {
    expect(saturateColor(new Color('#f90606'), 10).toHex()).toBe('#ff0000');
    expect(saturateColor(new Color('#867979'), -10).toHex()).toBe('#808080');
    expect(saturateColor(new Color('#4080bf'), 300).toHex()).toBe('#0080ff');
    expect(saturateColor(new Color('#808080'), 10).toHex()).toBe('#8c7373');
  });

  it('uses the default 10% increase', () => {
    expect(saturateColor(new Color('#4080bf')).toHex()).toBe('#3380cc');
  });
});

describe('desaturateColor', () => {
  it('reduces saturation', () => {
    const base = new Color('#6699cc');
    expect(desaturateColor(base, 20).toHex()).toBe('#7a99b8');
    expect(desaturateColor(base, -20).toHex()).toBe('#5299e0');
    expect(base.toHex()).toBe('#6699cc');
  });

  it('clamps at zero and uses default reduction', () => {
    expect(desaturateColor(new Color('#867979'), 10).toHex()).toBe('#808080');
    expect(desaturateColor(new Color('#6699cc')).toHex()).toBe('#7099c2');
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
