import { Color } from '../color';
import { getRandomColorRGBA, isColorDark } from '../utils';
import type { ColorHex } from '../formats';

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
    const spy = jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.999999);

    const color = getRandomColorRGBA();
    expect(color).toEqual({ r: 0, g: 128, b: 255, a: 1 });

    spy.mockRestore();
  });
});

describe('isColorDark', () => {
  const cases: Array<[ColorHex, boolean]> = [
    ['#000000', true],
    ['#000040', false],
    ['#000080', false],
    ['#0000c0', false],
    ['#0000ff', false],
    ['#004000', false],
    ['#004040', false],
    ['#004080', false],
    ['#0040c0', false],
    ['#0040ff', false],
    ['#008000', false],
    ['#008040', false],
    ['#008080', false],
    ['#0080c0', false],
    ['#0080ff', false],
    ['#00c000', false],
    ['#00c040', false],
    ['#00c080', false],
    ['#00c0c0', false],
    ['#00c0ff', false],
    ['#00ff00', false],
    ['#00ff40', false],
    ['#00ff80', false],
    ['#00ffc0', false],
    ['#00ffff', false],
    ['#400000', false],
    ['#400040', false],
    ['#400080', false],
    ['#4000c0', false],
    ['#4000ff', false],
    ['#404000', false],
    ['#404040', false],
    ['#404080', false],
    ['#4040c0', false],
    ['#4040ff', false],
    ['#408000', false],
    ['#408040', false],
    ['#408080', false],
    ['#4080c0', false],
    ['#4080ff', false],
    ['#40c000', false],
    ['#40c040', false],
    ['#40c080', false],
    ['#40c0c0', false],
    ['#40c0ff', false],
    ['#40ff00', false],
    ['#40ff40', false],
    ['#40ff80', false],
    ['#40ffc0', false],
    ['#40ffff', false],
    ['#800000', false],
    ['#800040', false],
    ['#800080', false],
    ['#8000c0', false],
    ['#8000ff', false],
    ['#804000', false],
    ['#804040', false],
    ['#804080', false],
    ['#8040c0', false],
    ['#8040ff', false],
    ['#808000', false],
    ['#808040', false],
    ['#808080', false],
    ['#8080c0', false],
    ['#8080ff', false],
    ['#80c000', false],
    ['#80c040', false],
    ['#80c080', false],
    ['#80c0c0', false],
    ['#80c0ff', false],
    ['#80ff00', false],
    ['#80ff40', false],
    ['#80ff80', false],
    ['#80ffc0', false],
    ['#80ffff', false],
    ['#c00000', false],
    ['#c00040', false],
    ['#c00080', false],
    ['#c000c0', false],
    ['#c000ff', false],
    ['#c04000', false],
    ['#c04040', false],
    ['#c04080', false],
    ['#c040c0', false],
    ['#c040ff', false],
    ['#c08000', false],
    ['#c08040', false],
    ['#c08080', false],
    ['#c080c0', false],
    ['#c080ff', false],
    ['#c0c000', false],
    ['#c0c040', false],
    ['#c0c080', false],
    ['#c0c0c0', false],
    ['#c0c0ff', false],
    ['#c0ff00', false],
    ['#c0ff40', false],
    ['#c0ff80', false],
    ['#c0ffc0', false],
    ['#c0ffff', false],
    ['#ff0000', false],
    ['#ff0040', false],
    ['#ff0080', false],
    ['#ff00c0', false],
    ['#ff00ff', false],
    ['#ff4000', false],
    ['#ff4040', false],
    ['#ff4080', false],
    ['#ff40c0', false],
    ['#ff40ff', false],
    ['#ff8000', false],
    ['#ff8040', false],
    ['#ff8080', false],
    ['#ff80c0', false],
    ['#ff80ff', false],
    ['#ffc000', false],
    ['#ffc040', false],
    ['#ffc080', false],
    ['#ffc0c0', false],
    ['#ffc0ff', false],
    ['#ffff00', false],
    ['#ffff40', false],
    ['#ffff80', false],
    ['#ffffc0', false],
    ['#ffffff', false],
    ['#000001', true],
    ['#000100', true],
    ['#000101', true],
    ['#010000', true],
    ['#010100', true],
    ['#010101', true],
  ];

  it.each(cases)('classifies %s correctly', (hex, expected) => {
    expect(isColorDark(new Color(hex))).toBe(expected);
  });
});
