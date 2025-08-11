import { Color } from '../color';
import { ColorHex } from '../formats';
import {
  brightenColor,
  darkenColor,
  desaturateColor,
  grayscaleColor,
  saturateColor,
  spinColorHue,
} from '../manipulations';

describe('spinColorHue', () => {
  const rotationCases: Array<[ColorHex, number, ColorHex]> = [
    ['#ff0000', 0, '#ff0000'],
    ['#ff0000', 30, '#ff8000'],
    ['#ff0000', -30, '#ff0080'],
    ['#ff0000', 30.5, '#ff8000'],
    ['#ff0000', 12.34, '#ff3300'],
    ['#ff0000', -30.7, '#ff0084'],
    ['#ff0000', 360, '#ff0000'],
    ['#ff0000', 360.9, '#ff0000'],
    ['#ff0000', 400, '#ffaa00'],
    ['#ff0000', -390, '#ff0080'],
    ['#ff0000', 480, '#00ff00'],
    ['#ff0000', 720, '#ff0000'],
    ['#ff0000', 750, '#ff8000'],
    ['#ff0000', -420, '#ff00ff'],
    ['#00ff00', 120, '#0000ff'],
    ['#00ff00', -240, '#0000ff'],
    ['#00ff00', 240, '#ff0000'],
    ['#0000ff', 240, '#00ff00'],
    ['#ffff00', 450, '#00ff80'],
    ['#00ffff', 60, '#0000ff'],
    ['#ff00ff', 120, '#ffff00'],
  ];

  it.each(rotationCases)('spins %s by %d° to %s', (hex, deg, expected) => {
    const color = new Color(hex);
    const spun = spinColorHue(color, deg);
    expect(spun.toHex()).toBe(expected);
    expect(spun).not.toBe(color);
  });

  it('does not mutate the original color', () => {
    const red = new Color('#ff0000');
    const spun = spinColorHue(red, 120);
    expect(spun.toHex()).toBe('#00ff00');
    expect(red.toHex()).toBe('#ff0000');
  });
});

describe('brightenColor', () => {
  it('adjusts lightness by percentage and does not mutate original', () => {
    const gray = new Color('#808080');
    const brighter = brightenColor(gray, 10);
    const darker = brightenColor(gray, -10);

    expect(brighter.toHex()).toBe('#999999');
    expect(darker.toHex()).toBe('#666666');
    expect(gray.toHex()).toBe('#808080');
  });

  it('clamps at lightness bounds (white or black)', () => {
    expect(brightenColor(new Color('#ffffff'), 10).toHex()).toBe('#ffffff');
    expect(brightenColor(new Color('#000000'), -10).toHex()).toBe('#000000');
  });

  it('uses the default 10% adjustment', () => {
    expect(brightenColor(new Color('#000000')).toHex()).toBe('#1a1a1a');
  });
});

describe('darkenColor', () => {
  it('is the inverse of brightenColor', () => {
    const gray = new Color('#808080');
    const fromDarken = darkenColor(gray, 10);
    const fromBrighten = brightenColor(gray, -10);

    expect(fromDarken.toHex()).toBe('#666666');
    expect(fromDarken.toHex()).toBe(fromBrighten.toHex());
    expect(gray.toHex()).toBe('#808080');
  });

  it('clamps at black', () => {
    expect(darkenColor(new Color('#000000'), 10).toHex()).toBe('#000000');
  });
});

describe('saturateColor', () => {
  it('adjusts saturation by percentage and does not mutate original', () => {
    const base = new Color('#6699cc');
    const saturated = saturateColor(base, 20);
    const desaturated = saturateColor(base, -20);

    expect(saturated.toHex()).toBe('#5299e0');
    expect(desaturated.toHex()).toBe('#7a99b8');
    expect(base.toHex()).toBe('#6699cc');
  });

  it('clamps at saturation bounds (fully saturated or grayscale)', () => {
    expect(saturateColor(new Color('#f90606'), 10).toHex()).toBe('#ff0000');
    expect(saturateColor(new Color('#867979'), -10).toHex()).toBe('#808080');
  });

  it('uses the default 10% adjustment', () => {
    expect(saturateColor(new Color('#4080bf')).toHex()).toBe('#3380cc');
  });
});

describe('desaturateColor', () => {
  it('is the inverse of saturateColor', () => {
    const base = new Color('#6699cc');
    const fromDesaturate = desaturateColor(base, 20);
    const fromSaturate = saturateColor(base, -20);

    expect(fromDesaturate.toHex()).toBe('#7a99b8');
    expect(fromDesaturate.toHex()).toBe(fromSaturate.toHex());
    expect(base.toHex()).toBe('#6699cc');
  });

  it('clamps at zero', () => {
    expect(desaturateColor(new Color('#867979'), 10).toHex()).toBe('#808080');
  });
});

describe('grayscaleColor', () => {
  it('converts to grayscale and does not mutate original', () => {
    const red = new Color('#ff0000');
    const gray = grayscaleColor(red);
    expect(gray.toHex()).toBe('#808080');
    expect(red.toHex()).toBe('#ff0000');
  });
});
