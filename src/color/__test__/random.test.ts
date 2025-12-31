import { Color } from '../color';
import { toHSLA, toRGBA } from '../conversions';
import type { BaseColorName } from '../names';
import {
  BASE_COLOR_HUE_RANGES,
  BLACK_MIN_LIGHTNESS_THRESHOLD,
  BLACK_MIN_LIGHTNESS_THRESHOLD_LOW_SATURATION,
  GRAYSCALE_MIN_SATURATION_THRESHOLD,
  WHITE_MAX_LIGHTNESS_THRESHOLD,
  WHITE_MAX_LIGHTNESS_THRESHOLD_LOW_SATURATION,
} from '../names';
import { getRandomColorRGBA } from '../random';

describe('getRandomColorRGBA', () => {
  function expectValidRandomColor(randomValue: number): void {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(randomValue);
    const colorRGBA = getRandomColorRGBA();
    expect(colorRGBA.r).toBeGreaterThanOrEqual(0);
    expect(colorRGBA.r).toBeLessThanOrEqual(255);
    expect(colorRGBA.g).toBeGreaterThanOrEqual(0);
    expect(colorRGBA.g).toBeLessThanOrEqual(255);
    expect(colorRGBA.b).toBeGreaterThanOrEqual(0);
    expect(colorRGBA.b).toBeLessThanOrEqual(255);
    expect(colorRGBA.a).toBe(1);
    spy.mockRestore();
  }

  it('generates valid random colors with no options for different Math.random values', () => {
    expectValidRandomColor(0);
    expectValidRandomColor(0.01);
    expectValidRandomColor(0.2);
    expectValidRandomColor(0.37);
    expectValidRandomColor(0.5);
    expectValidRandomColor(0.66);
    expectValidRandomColor(0.75);
    expectValidRandomColor(0.9);
    expectValidRandomColor(0.99);
    expectValidRandomColor(0.9999);
  });

  function expectDeterministicColor(randomValue: number): void {
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
  }

  describe('respects Math.random results', () => {
    it('when Math.random returns 0', () => {
      expectDeterministicColor(0);
    });

    it('when Math.random returns 0.37', () => {
      expectDeterministicColor(0.37);
    });

    it('when Math.random returns 0.75', () => {
      expectDeterministicColor(0.75);
    });
  });

  it('clamps provided alpha and overrides randomization (%f)', () => {
    expect(getRandomColorRGBA({ alpha: -0.5 }).a).toBe(0);
    expect(getRandomColorRGBA({ alpha: 2 }).a).toBe(1);
    expect(getRandomColorRGBA({ alpha: 0.3, randomizeAlpha: true }).a).toBe(0.3);
  });

  it('randomizes alpha when option is enabled', () => {
    const spy = jest
      .spyOn(Math, 'random')
      // First color:
      .mockReturnValueOnce(0) // h
      .mockReturnValueOnce(0) // s
      .mockReturnValueOnce(0) // l
      .mockReturnValueOnce(0) // a
      // Second color:
      .mockReturnValueOnce(0.2) // h
      .mockReturnValueOnce(0.5) // s
      .mockReturnValueOnce(0.7) // l
      .mockReturnValueOnce(0.2) // a
      // Third color:
      .mockReturnValueOnce(0.1) // h
      .mockReturnValueOnce(0.2) // s
      .mockReturnValueOnce(0.35) // l
      .mockReturnValueOnce(0.55555) // a
      // Fourth color:
      .mockReturnValueOnce(0.123) // h
      .mockReturnValueOnce(0.23456) // s
      .mockReturnValueOnce(0.999) // l
    .mockReturnValueOnce(0.987); // a
    const colorRGBA1 = getRandomColorRGBA({ randomizeAlpha: true });
    expect(colorRGBA1).toEqual({ r: 0, g: 0, b: 0, a: 0 });
    const colorRGBA2 = getRandomColorRGBA({ randomizeAlpha: true });
    expect(colorRGBA2.r).toBeCloseTo(201.45, 5);
    expect(colorRGBA2.g).toBeCloseTo(216.75, 5);
    expect(colorRGBA2.b).toBeCloseTo(140.25, 5);
    expect(colorRGBA2.a).toBe(0.2);
    const colorRGBA3 = getRandomColorRGBA({ randomizeAlpha: true });
    expect(colorRGBA3.r).toBeCloseTo(107, 0);
    expect(colorRGBA3.g).toBeCloseTo(93, 0);
    expect(colorRGBA3.b).toBeCloseTo(71, 0);
    expect(colorRGBA3.a).toBe(0.556);
    const colorRGBA4 = getRandomColorRGBA({ randomizeAlpha: true });
    expect(colorRGBA4).toEqual({ r: 255, g: 255, b: 255, a: 0.987 });
    spy.mockRestore();
  });

  function expectRoundedAlpha(randomValue: number, expected: number): void {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(randomValue);
    const colorRGBA = getRandomColorRGBA({ randomizeAlpha: true });
    expect(colorRGBA.a).toBe(expected);
    spy.mockRestore();
  }

  it('rounds randomized alpha to three decimal places', () => {
    expectRoundedAlpha(0.1236, 0.124);
    expectRoundedAlpha(0.98765, 0.988);
    expectRoundedAlpha(0.9999, 1);
  });

  function expectAnchoredColor(randomValue: number, anchor: BaseColorName): void {
    const colorRGBA = getRandomColorRGBA({ anchorColor: anchor });
    const ranges = BASE_COLOR_HUE_RANGES[anchor];
    const range = ranges[Math.floor(randomValue * ranges.length)];
    const expected = toRGBA({
      h: Math.floor(randomValue * (range.end - range.start + 1)) + range.start,
      s:
        Math.floor(randomValue * (101 - GRAYSCALE_MIN_SATURATION_THRESHOLD)) +
        GRAYSCALE_MIN_SATURATION_THRESHOLD,
      l:
        Math.floor(
          randomValue * (WHITE_MAX_LIGHTNESS_THRESHOLD - BLACK_MIN_LIGHTNESS_THRESHOLD + 1)
        ) + BLACK_MIN_LIGHTNESS_THRESHOLD,
      a: 1,
    });
    expect(colorRGBA).toEqual(expected);
    const { name: detectedName } = new Color(colorRGBA).getName();
    expect(detectedName).toBe(anchor);
    const colorHSLA = toHSLA(colorRGBA);
    expect(colorHSLA.s).toBeGreaterThanOrEqual(GRAYSCALE_MIN_SATURATION_THRESHOLD);
    expect(colorHSLA.l).toBeGreaterThanOrEqual(BLACK_MIN_LIGHTNESS_THRESHOLD);
    expect(colorHSLA.l).toBeLessThanOrEqual(WHITE_MAX_LIGHTNESS_THRESHOLD);
  }

  describe('limits hue to specified base color', () => {
    it('when Math.random returns 0.1', () => {
      const randomValue = 0.1;
      const spy = jest.spyOn(Math, 'random').mockReturnValue(randomValue);
      expectAnchoredColor(randomValue, 'Red');
      expectAnchoredColor(randomValue, 'Orange');
      expectAnchoredColor(randomValue, 'Yellow');
      expectAnchoredColor(randomValue, 'Green');
      expectAnchoredColor(randomValue, 'Blue');
      expectAnchoredColor(randomValue, 'Purple');
      expectAnchoredColor(randomValue, 'Pink');
      spy.mockRestore();
    });

    it('when Math.random returns 0.5', () => {
      const randomValue = 0.5;
      const spy = jest.spyOn(Math, 'random').mockReturnValue(randomValue);
      expectAnchoredColor(randomValue, 'Red');
      expectAnchoredColor(randomValue, 'Orange');
      expectAnchoredColor(randomValue, 'Yellow');
      expectAnchoredColor(randomValue, 'Green');
      expectAnchoredColor(randomValue, 'Blue');
      expectAnchoredColor(randomValue, 'Purple');
      expectAnchoredColor(randomValue, 'Pink');
      spy.mockRestore();
    });

    it('when Math.random returns 0.9', () => {
      const randomValue = 0.9;
      const spy = jest.spyOn(Math, 'random').mockReturnValue(randomValue);
      expectAnchoredColor(randomValue, 'Red');
      expectAnchoredColor(randomValue, 'Orange');
      expectAnchoredColor(randomValue, 'Yellow');
      expectAnchoredColor(randomValue, 'Green');
      expectAnchoredColor(randomValue, 'Blue');
      expectAnchoredColor(randomValue, 'Purple');
      expectAnchoredColor(randomValue, 'Pink');
      spy.mockRestore();
    });
  });

  function expectGrayscaleAnchor(
    randomValue: number,
    anchor: BaseColorName,
    min: number,
    max: number
  ): void {
    const colorRGBA = getRandomColorRGBA({ anchorColor: anchor, paletteSuitable: true });
    const expectedH = Math.floor(randomValue * 360);
    const expectedS = Math.floor(randomValue * GRAYSCALE_MIN_SATURATION_THRESHOLD);
    const expectedL = Math.floor(randomValue * (max - min + 1)) + min;
    const expected = toRGBA({ h: expectedH, s: expectedS, l: expectedL, a: 1 });
    expect(colorRGBA).toEqual(expected);
    const colorHSLA = toHSLA(colorRGBA);
    expect(colorHSLA.s).toBeLessThan(GRAYSCALE_MIN_SATURATION_THRESHOLD);
    expect(colorHSLA.l).toBeGreaterThanOrEqual(min);
    expect(colorHSLA.l).toBeLessThanOrEqual(max);
  }

  describe('ignores paletteSuitable for grayscale anchor colors', () => {
    it('when Math.random returns 0.1', () => {
      const randomValue = 0.1;
      const spy = jest.spyOn(Math, 'random').mockReturnValue(randomValue);
      expectGrayscaleAnchor(
        randomValue,
        'Black',
        0,
        BLACK_MIN_LIGHTNESS_THRESHOLD_LOW_SATURATION - 1
      );
      expectGrayscaleAnchor(
        randomValue,
        'White',
        WHITE_MAX_LIGHTNESS_THRESHOLD_LOW_SATURATION + 1,
        100
      );
      expectGrayscaleAnchor(
        randomValue,
        'Gray',
        BLACK_MIN_LIGHTNESS_THRESHOLD_LOW_SATURATION,
        WHITE_MAX_LIGHTNESS_THRESHOLD_LOW_SATURATION
      );
      spy.mockRestore();
    });

    it('when Math.random returns 0.5', () => {
      const randomValue = 0.5;
      const spy = jest.spyOn(Math, 'random').mockReturnValue(randomValue);
      expectGrayscaleAnchor(
        randomValue,
        'Black',
        0,
        BLACK_MIN_LIGHTNESS_THRESHOLD_LOW_SATURATION - 1
      );
      expectGrayscaleAnchor(
        randomValue,
        'White',
        WHITE_MAX_LIGHTNESS_THRESHOLD_LOW_SATURATION + 1,
        100
      );
      expectGrayscaleAnchor(
        randomValue,
        'Gray',
        BLACK_MIN_LIGHTNESS_THRESHOLD_LOW_SATURATION,
        WHITE_MAX_LIGHTNESS_THRESHOLD_LOW_SATURATION
      );
      spy.mockRestore();
    });

    it('when Math.random returns 0.9', () => {
      const randomValue = 0.9;
      const spy = jest.spyOn(Math, 'random').mockReturnValue(randomValue);
      expectGrayscaleAnchor(
        randomValue,
        'Black',
        0,
        BLACK_MIN_LIGHTNESS_THRESHOLD_LOW_SATURATION - 1
      );
      expectGrayscaleAnchor(
        randomValue,
        'White',
        WHITE_MAX_LIGHTNESS_THRESHOLD_LOW_SATURATION + 1,
        100
      );
      expectGrayscaleAnchor(
        randomValue,
        'Gray',
        BLACK_MIN_LIGHTNESS_THRESHOLD_LOW_SATURATION,
        WHITE_MAX_LIGHTNESS_THRESHOLD_LOW_SATURATION
      );
      spy.mockRestore();
    });
  });

  function expectPaletteColor(randomValue: number): void {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(randomValue);
    const colorRGBA = getRandomColorRGBA({ paletteSuitable: true });
    const colorHSLA = toHSLA(colorRGBA);
    expect(colorHSLA.s).toBeGreaterThanOrEqual(40);
    expect(colorHSLA.l).toBeGreaterThanOrEqual(25);
    expect(colorHSLA.l).toBeLessThanOrEqual(75);
    spy.mockRestore();
  }

  it('generates palette-friendly colors when requested', () => {
    expectPaletteColor(0.0001);
    expectPaletteColor(0.1);
    expectPaletteColor(0.23452346);
    expectPaletteColor(0.5);
    expectPaletteColor(0.6734253);
    expectPaletteColor(0.9);
    expectPaletteColor(0.9999);
  });

  function expectBluePalette(randomValue: number): void {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(randomValue);
    const colorRGBA = getRandomColorRGBA({ anchorColor: 'Blue', paletteSuitable: true });
    const { name } = new Color(colorRGBA).getName();
    expect(name).toBe('Blue');
    const colorHSLA = toHSLA(colorRGBA);
    expect(colorHSLA.s).toBeGreaterThanOrEqual(40);
    expect(colorHSLA.l).toBeGreaterThanOrEqual(25);
    expect(colorHSLA.l).toBeLessThanOrEqual(75);
    spy.mockRestore();
  }

  it('combines hue and palette options', () => {
    expectBluePalette(0.0001);
    expectBluePalette(0.1);
    expectBluePalette(0.23452346);
    expectBluePalette(0.5);
    expectBluePalette(0.6734253);
    expectBluePalette(0.9);
    expectBluePalette(0.9999);
  });

  it('accepts mixed case anchorColor', () => {
    // We can't easily verify the color itself is red since it's random,
    // but if it didn't throw, that's a good sign:
    getRandomColorRGBA({ anchorColor: 'Red' });
    getRandomColorRGBA({ anchorColor: 'red' });
    getRandomColorRGBA({ anchorColor: 'RED' });

    // anchorColor "Red" logic should be triggered
    // White is easier to check because of lightness constraints
    const white1 = getRandomColorRGBA({ anchorColor: 'White' });
    const white2 = getRandomColorRGBA({ anchorColor: 'white' });
    const white3 = getRandomColorRGBA({ anchorColor: 'WHITE' });

    expect(new Color(white1).toHSL().l).toBeGreaterThan(90);
    expect(new Color(white2).toHSL().l).toBeGreaterThan(90);
    expect(new Color(white3).toHSL().l).toBeGreaterThan(90);
  });

  it('produces maximum component values when Math.random is near one', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.999999);
    const colorRGBA = getRandomColorRGBA();
    expect(colorRGBA).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    spy.mockRestore();
  });
});
