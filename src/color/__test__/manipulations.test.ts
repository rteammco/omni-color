import { Color } from '../color';
import { ColorHex } from '../formats';
import { brightenColor, darkenColor, spinColorHue } from '../manipulations';

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
