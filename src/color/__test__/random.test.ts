import { Color } from '../color';
import { toHSLA } from '../conversions';
import { BaseColorName } from '../names';
import { getRandomColorRGBA } from '../random';

describe('getRandomColorRGBA', () => {
  it('generates components within valid ranges', () => {
    const colorRGBA = getRandomColorRGBA();
    expect(colorRGBA.r).toBeGreaterThanOrEqual(0);
    expect(colorRGBA.r).toBeLessThanOrEqual(255);
    expect(colorRGBA.g).toBeGreaterThanOrEqual(0);
    expect(colorRGBA.g).toBeLessThanOrEqual(255);
    expect(colorRGBA.b).toBeGreaterThanOrEqual(0);
    expect(colorRGBA.b).toBeLessThanOrEqual(255);
    expect(colorRGBA.a).toBe(1);
  });

  it('respects Math.random results', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0);
    const colorRGBA = getRandomColorRGBA();
    expect(colorRGBA).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    spy.mockRestore();
  });

  it('clamps provided alpha and overrides randomization', () => {
    expect(getRandomColorRGBA({ alpha: -0.5 }).a).toBe(0);
    expect(getRandomColorRGBA({ alpha: 2 }).a).toBe(1);

    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(getRandomColorRGBA({ alpha: 0.3, randomizeAlpha: true }).a).toBe(0.3);
    spy.mockRestore();
  });

  it('randomizes alpha when requested', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const colorRGBA = getRandomColorRGBA({ randomizeAlpha: true });
    expect(colorRGBA.a).toBe(0.5);
    spy.mockRestore();
  });

  it('limits hue to specified base color', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    Object.values(BaseColorName).forEach((name) => {
      const colorRGBA = getRandomColorRGBA({ anchorColor: name });
      const { name: generatedColorName } = new Color(colorRGBA).getName();
      expect(generatedColorName).toBe(name);
    });
    spy.mockRestore();
  });

  it('generates palette-friendly colors when requested', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const colorRGBA = getRandomColorRGBA({ paletteSuitable: true });
    const colorHSLA = toHSLA(colorRGBA);
    expect(colorHSLA.s).toBeGreaterThanOrEqual(40);
    expect(colorHSLA.l).toBeGreaterThanOrEqual(25);
    expect(colorHSLA.l).toBeLessThanOrEqual(75);
    spy.mockRestore();
  });

  it('combines hue and palette options', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const colorRGBA = getRandomColorRGBA({
      anchorColor: BaseColorName.BLUE,
      paletteSuitable: true,
    });
    const { name } = new Color(colorRGBA).getName();
    expect(name).toBe(BaseColorName.BLUE);
    const colorHSLA = toHSLA(colorRGBA);
    expect(colorHSLA.s).toBeGreaterThanOrEqual(40);
    expect(colorHSLA.l).toBeGreaterThanOrEqual(25);
    expect(colorHSLA.l).toBeLessThanOrEqual(75);
    spy.mockRestore();
  });
});
