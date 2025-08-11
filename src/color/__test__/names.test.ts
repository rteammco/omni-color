import { Color } from '../color';
import { ColorHex } from '../formats';
import { BaseColorName, ColorLightnessModifier, getBaseColorName } from '../names';

describe('getBaseColorName', () => {
  const cases: Array<[ColorHex, BaseColorName, ColorLightnessModifier]> = [
    ['#660000', BaseColorName.RED, ColorLightnessModifier.DARK],
    ['#ff0000', BaseColorName.RED, ColorLightnessModifier.NORMAL],
    ['#ff9999', BaseColorName.RED, ColorLightnessModifier.LIGHT],
    ['#663300', BaseColorName.ORANGE, ColorLightnessModifier.DARK],
    ['#ff8000', BaseColorName.ORANGE, ColorLightnessModifier.NORMAL],
    ['#ffcc99', BaseColorName.ORANGE, ColorLightnessModifier.LIGHT],
    ['#666600', BaseColorName.YELLOW, ColorLightnessModifier.DARK],
    ['#ffff00', BaseColorName.YELLOW, ColorLightnessModifier.NORMAL],
    ['#ffff99', BaseColorName.YELLOW, ColorLightnessModifier.LIGHT],
    ['#006600', BaseColorName.GREEN, ColorLightnessModifier.DARK],
    ['#00ff00', BaseColorName.GREEN, ColorLightnessModifier.NORMAL],
    ['#99ff99', BaseColorName.GREEN, ColorLightnessModifier.LIGHT],
    ['#002266', BaseColorName.BLUE, ColorLightnessModifier.DARK],
    ['#0055ff', BaseColorName.BLUE, ColorLightnessModifier.NORMAL],
    ['#99bbff', BaseColorName.BLUE, ColorLightnessModifier.LIGHT],
    ['#330066', BaseColorName.PURPLE, ColorLightnessModifier.DARK],
    ['#8000ff', BaseColorName.PURPLE, ColorLightnessModifier.NORMAL],
    ['#cc99ff', BaseColorName.PURPLE, ColorLightnessModifier.LIGHT],
    ['#660033', BaseColorName.PINK, ColorLightnessModifier.DARK],
    ['#ff0080', BaseColorName.PINK, ColorLightnessModifier.NORMAL],
    ['#ff99cc', BaseColorName.PINK, ColorLightnessModifier.LIGHT],
    ['#333333', BaseColorName.GRAY, ColorLightnessModifier.DARK],
    ['#808080', BaseColorName.GRAY, ColorLightnessModifier.NORMAL],
    ['#cccccc', BaseColorName.GRAY, ColorLightnessModifier.LIGHT],
    ['#000000', BaseColorName.BLACK, ColorLightnessModifier.NORMAL],
    ['#ffffff', BaseColorName.WHITE, ColorLightnessModifier.NORMAL],
  ];

  it.each(cases)('classifies %s correctly', (hex, expectedName, expectedLightness) => {
    const result = getBaseColorName(new Color(hex));
    expect(result).toEqual({ name: expectedName, lightness: expectedLightness });
  });

  const boundaryCases: Array<[ColorHex, BaseColorName]> = [
    ['#ff4000', BaseColorName.ORANGE], // h=15 -> Orange
    ['#ffbb00', BaseColorName.ORANGE], // h=44 -> Orange
    ['#ffbf00', BaseColorName.YELLOW], // h=45 -> Yellow
    ['#c3ff00', BaseColorName.YELLOW], // h=74 -> Yellow
    ['#bfff00', BaseColorName.GREEN], // h=75 -> Green
    ['#00ffbb', BaseColorName.GREEN], // h=164 -> Green
    ['#00ffbf', BaseColorName.BLUE], // h=165 -> Blue
    ['#3c00ff', BaseColorName.BLUE], // h=254 -> Blue
    ['#4000ff', BaseColorName.PURPLE], // h=255 -> Purple
    ['#bb00ff', BaseColorName.PURPLE], // h=284 -> Purple
    ['#bf00ff', BaseColorName.PINK], // h=285 -> Pink
    ['#ff0044', BaseColorName.PINK], // h=344 -> Pink
    ['#ff0040', BaseColorName.RED], // h=345 -> Red
  ];

  it.each(boundaryCases)('handles boundary color %s', (hex, expectedName) => {
    const result = getBaseColorName(new Color(hex));
    expect(result.name).toBe(expectedName);
  });

  it('treats low saturation as gray', () => {
    const colorful = getBaseColorName(new Color('#718e71')); // s=11
    expect(colorful.name).toBe(BaseColorName.GREEN);

    const grayish = getBaseColorName(new Color('#738c73')); // s=10
    expect(grayish.name).toBe(BaseColorName.GRAY);
  });
});
