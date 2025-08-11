import { Color } from '../color';
import {
  getRandomColorRGBA,
  isColorDark,
  getBaseColorName,
  BaseColorName,
  ColorLightnessModifier,
} from '../utils';
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
    // Light color cases:
    ['#00c0c0', false],
    ['#00c0ff', false],
    ['#00ff00', false],
    ['#00ff40', false],
    ['#00ff80', false],
    ['#00ffc0', false],
    ['#00ffff', false],
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
    // Dark color cases:
    ['#000000', true],
    ['#000001', true],
    ['#000040', true],
    ['#000080', true],
    ['#0000c0', true],
    ['#0000ff', true],
    ['#000100', true],
    ['#000101', true],
    ['#004000', true],
    ['#004040', true],
    ['#004080', true],
    ['#0040c0', true],
    ['#0040ff', true],
    ['#008000', true],
    ['#008040', true],
    ['#008080', true],
    ['#0080c0', true],
    ['#0080ff', true],
    ['#00c000', true],
    ['#00c040', true],
    ['#00c080', true],
    ['#010000', true],
    ['#010100', true],
    ['#010101', true],
    ['#400000', true],
    ['#400040', true],
    ['#400080', true],
    ['#4000c0', true],
    ['#4000ff', true],
    ['#404000', true],
    ['#404040', true],
    ['#404080', true],
    ['#4040c0', true],
    ['#4040ff', true],
    ['#408000', true],
    ['#408040', true],
    ['#408080', true],
    ['#4080c0', true],
    ['#4080ff', true],
    ['#800000', true],
    ['#800040', true],
    ['#800080', true],
    ['#8000c0', true],
    ['#8000ff', true],
    ['#804000', true],
    ['#804040', true],
    ['#804080', true],
    ['#8040c0', true],
    ['#8040ff', true],
    ['#808000', true],
    ['#808040', true],
    ['#c00000', true],
    ['#c00040', true],
    ['#c00080', true],
    ['#c000c0', true],
    ['#c000ff', true],
    ['#c04000', true],
    ['#c04040', true],
    ['#c04080', true],
    ['#c040c0', true],
    ['#c040ff', true],
    ['#ff0000', true],
    ['#ff0040', true],
    ['#ff0080', true],
    ['#ff00c0', true],
    ['#ff00ff', true],
    ['#ff4000', true],
  ];

  it.each(cases)('classifies %s correctly', (hex, expected) => {
    expect(isColorDark(new Color(hex))).toBe(expected);
  });
});

describe('getBaseColorName', () => {
  const cases: Array<[ColorHex, BaseColorName, ColorLightnessModifier]> = [
    ['#660000', BaseColorName.Red, ColorLightnessModifier.Dark],
    ['#ff0000', BaseColorName.Red, ColorLightnessModifier.Normal],
    ['#ff9999', BaseColorName.Red, ColorLightnessModifier.Light],
    ['#663300', BaseColorName.Orange, ColorLightnessModifier.Dark],
    ['#ff8000', BaseColorName.Orange, ColorLightnessModifier.Normal],
    ['#ffcc99', BaseColorName.Orange, ColorLightnessModifier.Light],
    ['#666600', BaseColorName.Yellow, ColorLightnessModifier.Dark],
    ['#ffff00', BaseColorName.Yellow, ColorLightnessModifier.Normal],
    ['#ffff99', BaseColorName.Yellow, ColorLightnessModifier.Light],
    ['#006600', BaseColorName.Green, ColorLightnessModifier.Dark],
    ['#00ff00', BaseColorName.Green, ColorLightnessModifier.Normal],
    ['#99ff99', BaseColorName.Green, ColorLightnessModifier.Light],
    ['#002266', BaseColorName.Blue, ColorLightnessModifier.Dark],
    ['#0055ff', BaseColorName.Blue, ColorLightnessModifier.Normal],
    ['#99bbff', BaseColorName.Blue, ColorLightnessModifier.Light],
    ['#330066', BaseColorName.Purple, ColorLightnessModifier.Dark],
    ['#8000ff', BaseColorName.Purple, ColorLightnessModifier.Normal],
    ['#cc99ff', BaseColorName.Purple, ColorLightnessModifier.Light],
    ['#660033', BaseColorName.Pink, ColorLightnessModifier.Dark],
    ['#ff0080', BaseColorName.Pink, ColorLightnessModifier.Normal],
    ['#ff99cc', BaseColorName.Pink, ColorLightnessModifier.Light],
    ['#333333', BaseColorName.Gray, ColorLightnessModifier.Dark],
    ['#808080', BaseColorName.Gray, ColorLightnessModifier.Normal],
    ['#cccccc', BaseColorName.Gray, ColorLightnessModifier.Light],
    ['#000000', BaseColorName.Black, ColorLightnessModifier.Normal],
    ['#ffffff', BaseColorName.White, ColorLightnessModifier.Normal],
  ];

  it.each(cases)(
    'classifies %s correctly',
    (hex, expectedName, expectedLightness) => {
      const result = getBaseColorName(new Color(hex));
      expect(result).toEqual({ name: expectedName, lightness: expectedLightness });
    },
  );

  const boundaryCases: Array<[ColorHex, BaseColorName]> = [
    ['#ff4000', BaseColorName.Orange], // h=15 -> Orange
    ['#ffbb00', BaseColorName.Orange], // h=44 -> Orange
    ['#ffbf00', BaseColorName.Yellow], // h=45 -> Yellow
    ['#c3ff00', BaseColorName.Yellow], // h=74 -> Yellow
    ['#bfff00', BaseColorName.Green], // h=75 -> Green
    ['#00ffbb', BaseColorName.Green], // h=164 -> Green
    ['#00ffbf', BaseColorName.Blue], // h=165 -> Blue
    ['#3c00ff', BaseColorName.Blue], // h=254 -> Blue
    ['#4000ff', BaseColorName.Purple], // h=255 -> Purple
    ['#bb00ff', BaseColorName.Purple], // h=284 -> Purple
    ['#bf00ff', BaseColorName.Pink], // h=285 -> Pink
    ['#ff0044', BaseColorName.Pink], // h=344 -> Pink
    ['#ff0040', BaseColorName.Red], // h=345 -> Red
  ];

  it.each(boundaryCases)('handles boundary color %s', (hex, expectedName) => {
    const result = getBaseColorName(new Color(hex));
    expect(result.name).toBe(expectedName);
  });

  it('treats low saturation as gray', () => {
    const colorful = getBaseColorName(new Color('#718e71')); // s=11
    expect(colorful.name).toBe(BaseColorName.Green);

    const grayish = getBaseColorName(new Color('#738c73')); // s=10
    expect(grayish.name).toBe(BaseColorName.Gray);
  });
});
