import { Color } from '../color';
import {
  getComplementaryColors,
  getSplitComplementaryColors,
  getTriadicHarmonyColors,
  getTetradicHarmonyColors,
  getAnalogousHarmonyColors,
  getMonochromaticHarmonyColors,
} from '../harmonies';

describe('color harmonies', () => {
  const base = new Color('#ff0000');

  it('computes complementary colors', () => {
    const [orig, comp] = getComplementaryColors(base);
    expect(orig.toHex()).toBe('#ff0000');
    expect(comp.toHex()).toBe('#00ffff');
  });

  it('computes split complementary colors', () => {
    const [orig, c2, c3] = getSplitComplementaryColors(base);
    expect(orig.toHex()).toBe('#ff0000');
    expect(c2.toHex()).toBe('#00ff80');
    expect(c3.toHex()).toBe('#0080ff');
  });

  it('computes triadic harmony colors', () => {
    const [orig, c2, c3] = getTriadicHarmonyColors(base);
    expect(orig.toHex()).toBe('#ff0000');
    expect(c2.toHex()).toBe('#00ff00');
    expect(c3.toHex()).toBe('#0000ff');
  });

  it('computes tetradic harmony colors', () => {
    const [orig, c2, c3, c4] = getTetradicHarmonyColors(base);
    expect(orig.toHex()).toBe('#ff0000');
    expect(c2.toHex()).toBe('#ffff00');
    expect(c3.toHex()).toBe('#00ffff');
    expect(c4.toHex()).toBe('#0000ff');
  });

  it('computes analogous harmony colors', () => {
    const [orig, c2, c3] = getAnalogousHarmonyColors(base);
    expect(orig.toHex()).toBe('#ff0000');
    expect(c2.toHex()).toBe('#ff0080');
    expect(c3.toHex()).toBe('#ff8000');
  });

  it('computes monochromatic harmony colors', () => {
    const start = new Color({ h: 210, s: 60, l: 50 });
    const [baseColor, lighter, darker, saturated, desaturated] =
      getMonochromaticHarmonyColors(start);
    expect(baseColor.toHSL()).toEqual({ h: 210, s: 60, l: 50 });
    expect(lighter.toHSL()).toEqual({ h: 210, s: 59, l: 70 });
    expect(darker.toHSL()).toEqual({ h: 210, s: 59, l: 30 });
    expect(saturated.toHSL()).toEqual({ h: 210, s: 80, l: 50 });
    expect(desaturated.toHSL()).toEqual({ h: 210, s: 40, l: 50 });
  });
});
