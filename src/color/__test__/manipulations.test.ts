import { Color } from '../color';
import { brightenColor, darkenColor } from '../manipulations';

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
