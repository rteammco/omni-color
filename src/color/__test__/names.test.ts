import { Color } from '../color';
import { BaseColorName, ColorLightnessModifier, getBaseColorName } from '../names';

describe('getBaseColorName', () => {
  it('classifies base colors and lightness modifiers', () => {
    expect(getBaseColorName(new Color('#660000'))).toEqual({
      name: BaseColorName.RED,
      lightness: ColorLightnessModifier.DARK,
    });
    expect(getBaseColorName(new Color('#ff0000'))).toEqual({
      name: BaseColorName.RED,
      lightness: ColorLightnessModifier.NORMAL,
    });
    expect(getBaseColorName(new Color('#ff9999'))).toEqual({
      name: BaseColorName.RED,
      lightness: ColorLightnessModifier.LIGHT,
    });
    expect(getBaseColorName(new Color('#663300'))).toEqual({
      name: BaseColorName.ORANGE,
      lightness: ColorLightnessModifier.DARK,
    });
    expect(getBaseColorName(new Color('#ff8000'))).toEqual({
      name: BaseColorName.ORANGE,
      lightness: ColorLightnessModifier.NORMAL,
    });
    expect(getBaseColorName(new Color('#ffcc99'))).toEqual({
      name: BaseColorName.ORANGE,
      lightness: ColorLightnessModifier.LIGHT,
    });
    expect(getBaseColorName(new Color('#666600'))).toEqual({
      name: BaseColorName.YELLOW,
      lightness: ColorLightnessModifier.DARK,
    });
    expect(getBaseColorName(new Color('#ffff00'))).toEqual({
      name: BaseColorName.YELLOW,
      lightness: ColorLightnessModifier.NORMAL,
    });
    expect(getBaseColorName(new Color('#ffff99'))).toEqual({
      name: BaseColorName.YELLOW,
      lightness: ColorLightnessModifier.LIGHT,
    });
    expect(getBaseColorName(new Color('#006600'))).toEqual({
      name: BaseColorName.GREEN,
      lightness: ColorLightnessModifier.DARK,
    });
    expect(getBaseColorName(new Color('#00ff00'))).toEqual({
      name: BaseColorName.GREEN,
      lightness: ColorLightnessModifier.NORMAL,
    });
    expect(getBaseColorName(new Color('#99ff99'))).toEqual({
      name: BaseColorName.GREEN,
      lightness: ColorLightnessModifier.LIGHT,
    });
    expect(getBaseColorName(new Color('#002266'))).toEqual({
      name: BaseColorName.BLUE,
      lightness: ColorLightnessModifier.DARK,
    });
    expect(getBaseColorName(new Color('#0055ff'))).toEqual({
      name: BaseColorName.BLUE,
      lightness: ColorLightnessModifier.NORMAL,
    });
    expect(getBaseColorName(new Color('#99bbff'))).toEqual({
      name: BaseColorName.BLUE,
      lightness: ColorLightnessModifier.LIGHT,
    });
    expect(getBaseColorName(new Color('#330066'))).toEqual({
      name: BaseColorName.PURPLE,
      lightness: ColorLightnessModifier.DARK,
    });
    expect(getBaseColorName(new Color('#8000ff'))).toEqual({
      name: BaseColorName.PURPLE,
      lightness: ColorLightnessModifier.NORMAL,
    });
    expect(getBaseColorName(new Color('#cc99ff'))).toEqual({
      name: BaseColorName.PURPLE,
      lightness: ColorLightnessModifier.LIGHT,
    });
    expect(getBaseColorName(new Color('#660033'))).toEqual({
      name: BaseColorName.PINK,
      lightness: ColorLightnessModifier.DARK,
    });
    expect(getBaseColorName(new Color('#ff0080'))).toEqual({
      name: BaseColorName.PINK,
      lightness: ColorLightnessModifier.NORMAL,
    });
    expect(getBaseColorName(new Color('#ff99cc'))).toEqual({
      name: BaseColorName.PINK,
      lightness: ColorLightnessModifier.LIGHT,
    });
    expect(getBaseColorName(new Color('#333333'))).toEqual({
      name: BaseColorName.GRAY,
      lightness: ColorLightnessModifier.DARK,
    });
    expect(getBaseColorName(new Color('#808080'))).toEqual({
      name: BaseColorName.GRAY,
      lightness: ColorLightnessModifier.NORMAL,
    });
    expect(getBaseColorName(new Color('#cccccc'))).toEqual({
      name: BaseColorName.GRAY,
      lightness: ColorLightnessModifier.LIGHT,
    });
    expect(getBaseColorName(new Color('#000000'))).toEqual({
      name: BaseColorName.BLACK,
      lightness: ColorLightnessModifier.NORMAL,
    });
    expect(getBaseColorName(new Color('#ffffff'))).toEqual({
      name: BaseColorName.WHITE,
      lightness: ColorLightnessModifier.NORMAL,
    });
  });

  it('handles hues near boundaries', () => {
    expect(getBaseColorName(new Color('#ff4000')).name).toBe(BaseColorName.ORANGE); // h=15
    expect(getBaseColorName(new Color('#ffbb00')).name).toBe(BaseColorName.ORANGE); // h=44
    expect(getBaseColorName(new Color('#ffbf00')).name).toBe(BaseColorName.YELLOW); // h=45
    expect(getBaseColorName(new Color('#c3ff00')).name).toBe(BaseColorName.YELLOW); // h=74
    expect(getBaseColorName(new Color('#bfff00')).name).toBe(BaseColorName.GREEN); // h=75
    expect(getBaseColorName(new Color('#00ffbb')).name).toBe(BaseColorName.GREEN); // h=164
    expect(getBaseColorName(new Color('#00ffbf')).name).toBe(BaseColorName.BLUE); // h=165
    expect(getBaseColorName(new Color('#3c00ff')).name).toBe(BaseColorName.BLUE); // h=254
    expect(getBaseColorName(new Color('#4000ff')).name).toBe(BaseColorName.PURPLE); // h=255
    expect(getBaseColorName(new Color('#bb00ff')).name).toBe(BaseColorName.PURPLE); // h=284
    expect(getBaseColorName(new Color('#bf00ff')).name).toBe(BaseColorName.PINK); // h=285
    expect(getBaseColorName(new Color('#ff0044')).name).toBe(BaseColorName.PINK); // h=344
    expect(getBaseColorName(new Color('#ff0040')).name).toBe(BaseColorName.RED); // h=345
  });

  it('applies lightness modifier thresholds', () => {
    expect(getBaseColorName(new Color('#990000')).lightness).toBe(ColorLightnessModifier.DARK); // l=30
    expect(getBaseColorName(new Color('#9e0000')).lightness).toBe(ColorLightnessModifier.NORMAL); // l=31
    expect(getBaseColorName(new Color('#ff6161')).lightness).toBe(ColorLightnessModifier.NORMAL); // l=69
    expect(getBaseColorName(new Color('#ff6666')).lightness).toBe(ColorLightnessModifier.LIGHT); // l=70
  });

  it('treats low saturation colors as gray, black, or white depending on lightness', () => {
    const aboveThreshold = getBaseColorName(new Color({ h: 120, s: 11, l: 50 }));
    expect(aboveThreshold.name).toBe(BaseColorName.GREEN);

    const atThreshold = getBaseColorName(new Color({ h: 120, s: 10, l: 50 }));
    expect(atThreshold.name).toBe(BaseColorName.GREEN);

    const grayish = getBaseColorName(new Color('#748b74'));
    expect(grayish.name).toBe(BaseColorName.GRAY);

    const darkGray = getBaseColorName(new Color('#171717'));
    expect(darkGray.name).toBe(BaseColorName.BLACK);

    const nearWhiteGray = getBaseColorName(new Color('#e6e6e6'));
    expect(nearWhiteGray.name).toBe(BaseColorName.GRAY);

    const brightGray = getBaseColorName(new Color('#e8e8e8'));
    expect(brightGray.name).toBe(BaseColorName.WHITE);
  });
});
