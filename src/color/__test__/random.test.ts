import { Color } from '../color';
import { toHSLA } from '../conversions';
import { BaseColorName, getBaseColorName } from '../names';
import { getRandomColorRGBA } from '../random';

describe('getRandomColorRGBA', () => {
  it('generates components within valid ranges', () => {
    const color = getRandomColorRGBA();
    expect(color.r).toBeGreaterThanOrEqual(0);
    expect(color.r).toBeLessThanOrEqual(255);
    expect(color.g).toBeGreaterThanOrEqual(0);
    expect(color.g).toBeLessThanOrEqual(255);
    expect(color.b).toBeGreaterThanOrEqual(0);
    expect(color.b).toBeLessThanOrEqual(255);
    expect(color.a).toBe(1);
  });

  it('respects Math.random results', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0);
    const color = getRandomColorRGBA();
    expect(color).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    spy.mockRestore();
  });

  it('clamps provided alpha and overrides randomization', () => {
    expect(getRandomColorRGBA({ alpha: -0.5 }).a).toBe(0);
    expect(getRandomColorRGBA({ alpha: 2 }).a).toBe(1);

    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(
      getRandomColorRGBA({ alpha: 0.3, shouldRandomizeAlpha: true }).a,
    ).toBe(0.3);
    spy.mockRestore();
  });

  it('randomizes alpha when requested', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const color = getRandomColorRGBA({ shouldRandomizeAlpha: true });
    expect(color.a).toBe(0.5);
    spy.mockRestore();
  });

  it('limits hue to specified base color', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    Object.values(BaseColorName).forEach((name) => {
      const color = getRandomColorRGBA({ hue: name });
      const { name: base } = getBaseColorName(new Color(color));
      expect(base).toBe(name);
    });
    spy.mockRestore();
  });

  it('generates palette‑friendly colors when requested', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const color = getRandomColorRGBA({ isPaletteColor: true });
    const hsla = toHSLA(color);
    expect(hsla.s).toBeGreaterThanOrEqual(40);
    expect(hsla.l).toBeGreaterThanOrEqual(25);
    expect(hsla.l).toBeLessThanOrEqual(75);
    spy.mockRestore();
  });

  it('combines hue and palette options', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const color = getRandomColorRGBA({
      hue: BaseColorName.BLUE,
      isPaletteColor: true,
    });
    const { name } = getBaseColorName(new Color(color));
    const hsla = toHSLA(color);
    expect(name).toBe(BaseColorName.BLUE);
    expect(hsla.s).toBeGreaterThanOrEqual(40);
    expect(hsla.l).toBeGreaterThanOrEqual(25);
    expect(hsla.l).toBeLessThanOrEqual(75);
    spy.mockRestore();
  });
});
