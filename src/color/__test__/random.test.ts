import { Color } from '../color';
import { toHSLA, toRGBA } from '../conversions';
import { BASE_COLOR_HUE_RANGES, BaseColorName } from '../names';
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

  it.each([0, 0.37, 0.75])('respects Math.random results (%f)', (randomValue) => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(randomValue);
    const colorRGBA = getRandomColorRGBA();
    const expected = toRGBA({
      h: Math.floor(randomValue * 360),
      s: Math.floor(randomValue * 101),
      l: Math.floor(randomValue * 101),
      a: 1,
    });
    expect(colorRGBA).toEqual(expected);
    spy.mockRestore();
  });

  it.each([0, 0.45, 0.89])(
    'clamps provided alpha and overrides randomization (%f)',
    (randomValue) => {
      const spy = jest.spyOn(Math, 'random').mockReturnValue(randomValue);
      expect(getRandomColorRGBA({ alpha: -0.5 }).a).toBe(0);
      expect(getRandomColorRGBA({ alpha: 2 }).a).toBe(1);
      expect(getRandomColorRGBA({ alpha: 0.3, randomizeAlpha: true }).a).toBe(0.3);
      spy.mockRestore();
    },
  );

  it.each([0, 0.2, 0.5, 0.987])(
    'randomizes alpha when requested (%f)',
    (randomValue) => {
      const spy = jest.spyOn(Math, 'random').mockReturnValue(randomValue);
      const colorRGBA = getRandomColorRGBA({ randomizeAlpha: true });
      expect(colorRGBA.a).toBe(+randomValue.toFixed(3));
      spy.mockRestore();
    },
  );

  it.each([
    [0.1236, 0.124],
    [0.98765, 0.988],
    [0.9999, 1],
  ])('rounds randomized alpha to three decimal places', (randomValue, expected) => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(randomValue);
    const colorRGBA = getRandomColorRGBA({ randomizeAlpha: true });
    expect(colorRGBA.a).toBe(expected);
    spy.mockRestore();
  });

  it.each([0.1, 0.5, 0.9])('limits hue to specified base color (%f)', (randomValue) => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(randomValue);
    const coloredAnchors = Object.values(BaseColorName).filter(
      (name) => ![BaseColorName.BLACK, BaseColorName.GRAY, BaseColorName.WHITE].includes(name),
    );
    coloredAnchors.forEach((name) => {
      const colorRGBA = getRandomColorRGBA({ anchorColor: name });
      const ranges = BASE_COLOR_HUE_RANGES[name];
      const range = ranges[Math.floor(randomValue * ranges.length)];
      const expected = toRGBA({
        h: Math.floor(randomValue * (range.end - range.start + 1)) + range.start,
        s: Math.floor(randomValue * 101),
        l: Math.floor(randomValue * 101),
        a: 1,
      });
      expect(colorRGBA).toEqual(expected);
    });
    spy.mockRestore();
  });

  it.each([0.1, 0.5, 0.9])(
    'ignores paletteSuitable for grayscale anchor colors (%f)',
    (randomValue) => {
      const spy = jest.spyOn(Math, 'random').mockReturnValue(randomValue);
      [
        { anchor: BaseColorName.BLACK, min: 0, max: 10 },
        { anchor: BaseColorName.WHITE, min: 90, max: 100 },
        { anchor: BaseColorName.GRAY, min: 10, max: 90 },
      ].forEach(({ anchor, min, max }) => {
        const colorRGBA = getRandomColorRGBA({ anchorColor: anchor, paletteSuitable: true });
        const expectedH = Math.floor(randomValue * 360);
        const expectedS = Math.floor(randomValue * 11);
        let expectedL;
        if (anchor === BaseColorName.BLACK) {
          expectedL = Math.floor(randomValue * 11);
        } else if (anchor === BaseColorName.WHITE) {
          expectedL = Math.floor(randomValue * 11) + 90;
        } else {
          expectedL = Math.floor(randomValue * 81) + 10;
        }
        const expected = toRGBA({ h: expectedH, s: expectedS, l: expectedL, a: 1 });
        expect(colorRGBA).toEqual(expected);
        expect(expectedS).toBeLessThanOrEqual(10);
        expect(expectedL).toBeGreaterThanOrEqual(min);
        expect(expectedL).toBeLessThanOrEqual(max);
      });
      spy.mockRestore();
    },
  );

  it.each([0.1, 0.5, 0.9])(
    'generates palette-friendly colors when requested (%f)',
    (randomValue) => {
      const spy = jest.spyOn(Math, 'random').mockReturnValue(randomValue);
      const colorRGBA = getRandomColorRGBA({ paletteSuitable: true });
      const colorHSLA = toHSLA(colorRGBA);
      expect(colorHSLA.s).toBeGreaterThanOrEqual(40);
      expect(colorHSLA.l).toBeGreaterThanOrEqual(25);
      expect(colorHSLA.l).toBeLessThanOrEqual(75);
      spy.mockRestore();
    },
  );

  it.each([0.1, 0.5, 0.9])('combines hue and palette options (%f)', (randomValue) => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(randomValue);
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

  it('produces maximum component values when Math.random is near one', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.999999);
    const colorRGBA = getRandomColorRGBA();
    expect(colorRGBA).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    spy.mockRestore();
  });
});
