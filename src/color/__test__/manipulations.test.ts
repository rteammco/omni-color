import { Color } from '../color';
import { brighten, darken } from '../manipulations';

describe('brighten', () => {
  it('adjusts lightness by percentage and does not mutate original', () => {
    const gray = new Color('#808080');
    const brighter = brighten(gray, 10);
    const darker = brighten(gray, -10);

    expect(brighter.toHex()).toBe('#999999');
    expect(darker.toHex()).toBe('#666666');
    expect(gray.toHex()).toBe('#808080');
  });

  it('clamps at lightness bounds', () => {
    expect(brighten(new Color('#ffffff'), 10).toHex()).toBe('#ffffff');
    expect(brighten(new Color('#000000'), -10).toHex()).toBe('#000000');
  });

  it('uses the default 10% adjustment', () => {
    expect(brighten(new Color('#000000')).toHex()).toBe('#1a1a1a');
  });
});

describe('darken', () => {
  it('is the inverse of brighten', () => {
    const gray = new Color('#808080');
    const fromDarken = darken(gray, 10);
    const fromBrighten = brighten(gray, -10);

    expect(fromDarken.toHex()).toBe('#666666');
    expect(fromDarken.toHex()).toBe(fromBrighten.toHex());
    expect(gray.toHex()).toBe('#808080');
  });

  it('clamps at black', () => {
    expect(darken(new Color('#000000'), 10).toHex()).toBe('#000000');
  });
});
