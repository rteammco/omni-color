import { getBaseColorName } from '../names';
import { getColorRGBAFromInput } from '../utils';

describe('getBaseColorName', () => {
  it('classifies base colors and lightness modifiers', () => {
    expect(getBaseColorName(getColorRGBAFromInput('#660000'))).toEqual({
      name: 'Red',
      lightness: 'Dark',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#ff0000'))).toEqual({
      name: 'Red',
      lightness: 'Normal',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#ff9999'))).toEqual({
      name: 'Red',
      lightness: 'Light',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#663300'))).toEqual({
      name: 'Orange',
      lightness: 'Dark',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#ff8000'))).toEqual({
      name: 'Orange',
      lightness: 'Normal',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#ffcc99'))).toEqual({
      name: 'Orange',
      lightness: 'Light',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#666600'))).toEqual({
      name: 'Yellow',
      lightness: 'Dark',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#ffff00'))).toEqual({
      name: 'Yellow',
      lightness: 'Normal',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#ffff99'))).toEqual({
      name: 'Yellow',
      lightness: 'Light',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#006600'))).toEqual({
      name: 'Green',
      lightness: 'Dark',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#00ff00'))).toEqual({
      name: 'Green',
      lightness: 'Normal',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#99ff99'))).toEqual({
      name: 'Green',
      lightness: 'Light',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#002266'))).toEqual({
      name: 'Blue',
      lightness: 'Dark',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#0055ff'))).toEqual({
      name: 'Blue',
      lightness: 'Normal',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#99bbff'))).toEqual({
      name: 'Blue',
      lightness: 'Light',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#330066'))).toEqual({
      name: 'Purple',
      lightness: 'Dark',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#8000ff'))).toEqual({
      name: 'Purple',
      lightness: 'Normal',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#cc99ff'))).toEqual({
      name: 'Purple',
      lightness: 'Light',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#660033'))).toEqual({
      name: 'Pink',
      lightness: 'Dark',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#ff0080'))).toEqual({
      name: 'Pink',
      lightness: 'Normal',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#ff99cc'))).toEqual({
      name: 'Pink',
      lightness: 'Light',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#333333'))).toEqual({
      name: 'Gray',
      lightness: 'Dark',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#808080'))).toEqual({
      name: 'Gray',
      lightness: 'Normal',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#cccccc'))).toEqual({
      name: 'Gray',
      lightness: 'Light',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#000000'))).toEqual({
      name: 'Black',
      lightness: 'Normal',
    });
    expect(getBaseColorName(getColorRGBAFromInput('#ffffff'))).toEqual({
      name: 'White',
      lightness: 'Normal',
    });
  });

  it('handles hues near boundaries', () => {
    expect(getBaseColorName(getColorRGBAFromInput('#ff4000')).name).toBe('Orange'); // h=15
    expect(getBaseColorName(getColorRGBAFromInput('#ffbb00')).name).toBe('Orange'); // h=44
    expect(getBaseColorName(getColorRGBAFromInput('#ffbf00')).name).toBe('Yellow'); // h=45
    expect(getBaseColorName(getColorRGBAFromInput('#c3ff00')).name).toBe('Yellow'); // h=74
    expect(getBaseColorName(getColorRGBAFromInput('#bfff00')).name).toBe('Green'); // h=75
    expect(getBaseColorName(getColorRGBAFromInput('#00ffbb')).name).toBe('Green'); // h=164
    expect(getBaseColorName(getColorRGBAFromInput('#00ffbf')).name).toBe('Blue'); // h=165
    expect(getBaseColorName(getColorRGBAFromInput('#3c00ff')).name).toBe('Blue'); // h=254
    expect(getBaseColorName(getColorRGBAFromInput('#4000ff')).name).toBe('Purple'); // h=255
    expect(getBaseColorName(getColorRGBAFromInput('#bb00ff')).name).toBe('Purple'); // h=284
    expect(getBaseColorName(getColorRGBAFromInput('#bf00ff')).name).toBe('Pink'); // h=285
    expect(getBaseColorName(getColorRGBAFromInput('#ff0044')).name).toBe('Pink'); // h=344
    expect(getBaseColorName(getColorRGBAFromInput('#ff0040')).name).toBe('Red'); // h=345
  });

  it('applies lightness modifier thresholds', () => {
    expect(getBaseColorName(getColorRGBAFromInput('#990000')).lightness).toBe('Dark'); // l=30
    expect(getBaseColorName(getColorRGBAFromInput('#9e0000')).lightness).toBe('Normal'); // l=31
    expect(getBaseColorName(getColorRGBAFromInput('#ff6161')).lightness).toBe('Normal'); // l=69
    expect(getBaseColorName(getColorRGBAFromInput('#ff6666')).lightness).toBe('Light'); // l=70
  });

  it('treats low saturation colors as gray, black, or white depending on lightness', () => {
    const aboveThreshold = getBaseColorName(getColorRGBAFromInput({ h: 120, s: 11, l: 50 }));
    expect(aboveThreshold.name).toBe('Green');

    const atThreshold = getBaseColorName(getColorRGBAFromInput({ h: 120, s: 10, l: 50 }));
    expect(atThreshold.name).toBe('Green');

    const grayish = getBaseColorName(getColorRGBAFromInput('#748b74'));
    expect(grayish.name).toBe('Gray');

    const darkGray = getBaseColorName(getColorRGBAFromInput('#171717'));
    expect(darkGray.name).toBe('Black');

    const nearWhiteGray = getBaseColorName(getColorRGBAFromInput('#e6e6e6'));
    expect(nearWhiteGray.name).toBe('Gray');

    const brightGray = getBaseColorName(getColorRGBAFromInput('#e8e8e8'));
    expect(brightGray.name).toBe('White');
  });
});
