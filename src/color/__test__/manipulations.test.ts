import chroma from 'chroma-js';

import { Color } from '../color';
import {
  brightenColor,
  colorToGrayscale,
  darkenColor,
  desaturateColor,
  saturateColor,
  spinColorHue,
} from '../manipulations';

function chromaHex(
  input: string,
  transform: (value: chroma.Color) => chroma.Color,
  includeAlpha = false
): string {
  const hex = transform(chroma(input)).hex(includeAlpha ? 'rgba' : undefined);
  return hex.toLowerCase();
}

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

  it('supports LAB adjustments that mirror chroma-js scaling', () => {
    const navy = new Color('#001f3f');
    const brightenedLab = brightenColor(navy, { space: 'LAB', amount: 25 });
    expect(brightenedLab.toHex8()).toBe(
      chromaHex('#001f3f', (value) => value.brighten(2.5), true)
    );
    expect(navy.toHex()).toBe('#001f3f');

    const translucentTeal = new Color('rgba(0, 128, 128, 0.35)');
    const brightenedDefaultLab = brightenColor(translucentTeal, { space: 'LAB' });
    expect(brightenedDefaultLab.toHex8()).toBe(
      chromaHex('rgba(0, 128, 128, 0.35)', (value) => value.brighten(), true)
    );
    expect(translucentTeal.toHex8()).toBe('#00808059');
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

  it('accepts LAB options and clamps when approaching black', () => {
    const coral = new Color('#ff7f50');
    const darkenedLab = darkenColor(coral, { space: 'LAB', amount: 15 });
    expect(darkenedLab.toHex()).toBe(chromaHex('#ff7f50', (value) => value.darken(1.5)));
    expect(coral.toHex()).toBe('#ff7f50');

    const deepCharcoal = darkenColor(new Color('#222222'), { space: 'LAB', amount: 120 });
    expect(deepCharcoal.toHex()).toBe('#000000');
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

  it('supports LCH saturation with chroma-js equivalent deltas', () => {
    const mutedTeal = new Color('hsl(190, 25%, 55%)');
    const saturatedLch = saturateColor(mutedTeal, { space: 'LCH', amount: 40 });
    expect(saturatedLch.toHex()).toBe(chromaHex('hsl(190, 25%, 55%)', (value) => value.saturate(4)));
    expect(mutedTeal.toHex()).toBe('#709fa9');
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

  it('handles LCH desaturation with clamping and preserved alpha', () => {
    const vividPink = new Color('#ff69b4');
    const desaturated = desaturateColor(vividPink, { space: 'LCH', amount: 50 });
    expect(desaturated.toHex()).toBe(chromaHex('#ff69b4', (value) => value.desaturate(5)));
    expect(vividPink.toHex()).toBe('#ff69b4');

    const translucentViolet = new Color('rgba(120, 80, 200, 0.5)');
    const heavilyDesaturated = desaturateColor(translucentViolet, { space: 'LCH', amount: 120 });
    expect(heavilyDesaturated.toHex8()).toBe(
      chromaHex('rgba(120, 80, 200, 0.5)', (value) => value.desaturate(12), true)
    );
    expect(translucentViolet.toHex8()).toBe('#7850c880');
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
