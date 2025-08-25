import { Color } from '../color';
import { getBaseColorName } from '../names';

describe('getBaseColorName', () => {
  it('classifies base colors and lightness modifiers', () => {
    expect(getBaseColorName(new Color('#660000'))).toEqual({ name: 'Red', lightness: 'Dark' });
    expect(getBaseColorName(new Color('#ff0000'))).toEqual({ name: 'Red', lightness: 'Normal' });
    expect(getBaseColorName(new Color('#ff9999'))).toEqual({ name: 'Red', lightness: 'Light' });
    expect(getBaseColorName(new Color('#663300'))).toEqual({ name: 'Orange', lightness: 'Dark' });
    expect(getBaseColorName(new Color('#ff8000'))).toEqual({ name: 'Orange', lightness: 'Normal' });
    expect(getBaseColorName(new Color('#ffcc99'))).toEqual({ name: 'Orange', lightness: 'Light' });
    expect(getBaseColorName(new Color('#666600'))).toEqual({ name: 'Yellow', lightness: 'Dark' });
    expect(getBaseColorName(new Color('#ffff00'))).toEqual({ name: 'Yellow', lightness: 'Normal' });
    expect(getBaseColorName(new Color('#ffff99'))).toEqual({ name: 'Yellow', lightness: 'Light' });
    expect(getBaseColorName(new Color('#006600'))).toEqual({ name: 'Green', lightness: 'Dark' });
    expect(getBaseColorName(new Color('#00ff00'))).toEqual({ name: 'Green', lightness: 'Normal' });
    expect(getBaseColorName(new Color('#99ff99'))).toEqual({ name: 'Green', lightness: 'Light' });
    expect(getBaseColorName(new Color('#002266'))).toEqual({ name: 'Blue', lightness: 'Dark' });
    expect(getBaseColorName(new Color('#0055ff'))).toEqual({ name: 'Blue', lightness: 'Normal' });
    expect(getBaseColorName(new Color('#99bbff'))).toEqual({ name: 'Blue', lightness: 'Light' });
    expect(getBaseColorName(new Color('#330066'))).toEqual({ name: 'Purple', lightness: 'Dark' });
    expect(getBaseColorName(new Color('#8000ff'))).toEqual({ name: 'Purple', lightness: 'Normal' });
    expect(getBaseColorName(new Color('#cc99ff'))).toEqual({ name: 'Purple', lightness: 'Light' });
    expect(getBaseColorName(new Color('#660033'))).toEqual({ name: 'Pink', lightness: 'Dark' });
    expect(getBaseColorName(new Color('#ff0080'))).toEqual({ name: 'Pink', lightness: 'Normal' });
    expect(getBaseColorName(new Color('#ff99cc'))).toEqual({ name: 'Pink', lightness: 'Light' });
    expect(getBaseColorName(new Color('#333333'))).toEqual({ name: 'Gray', lightness: 'Dark' });
    expect(getBaseColorName(new Color('#808080'))).toEqual({ name: 'Gray', lightness: 'Normal' });
    expect(getBaseColorName(new Color('#cccccc'))).toEqual({ name: 'Gray', lightness: 'Light' });
    expect(getBaseColorName(new Color('#000000'))).toEqual({ name: 'Black', lightness: 'Normal' });
    expect(getBaseColorName(new Color('#ffffff'))).toEqual({ name: 'White', lightness: 'Normal' });
  });

  it('handles hues near boundaries', () => {
    expect(getBaseColorName(new Color('#ff4000')).name).toBe('Orange'); // h=15
    expect(getBaseColorName(new Color('#ffbb00')).name).toBe('Orange'); // h=44
    expect(getBaseColorName(new Color('#ffbf00')).name).toBe('Yellow'); // h=45
    expect(getBaseColorName(new Color('#c3ff00')).name).toBe('Yellow'); // h=74
    expect(getBaseColorName(new Color('#bfff00')).name).toBe('Green'); // h=75
    expect(getBaseColorName(new Color('#00ffbb')).name).toBe('Green'); // h=164
    expect(getBaseColorName(new Color('#00ffbf')).name).toBe('Blue'); // h=165
    expect(getBaseColorName(new Color('#3c00ff')).name).toBe('Blue'); // h=254
    expect(getBaseColorName(new Color('#4000ff')).name).toBe('Purple'); // h=255
    expect(getBaseColorName(new Color('#bb00ff')).name).toBe('Purple'); // h=284
    expect(getBaseColorName(new Color('#bf00ff')).name).toBe('Pink'); // h=285
    expect(getBaseColorName(new Color('#ff0044')).name).toBe('Pink'); // h=344
    expect(getBaseColorName(new Color('#ff0040')).name).toBe('Red'); // h=345
  });

  it('applies lightness modifier thresholds', () => {
    expect(getBaseColorName(new Color('#990000')).lightness).toBe('Dark'); // l=30
    expect(getBaseColorName(new Color('#9e0000')).lightness).toBe('Normal'); // l=31
    expect(getBaseColorName(new Color('#ff6161')).lightness).toBe('Normal'); // l=69
    expect(getBaseColorName(new Color('#ff6666')).lightness).toBe('Light'); // l=70
  });

  it('treats low saturation colors as gray, black, or white depending on lightness', () => {
    const aboveThreshold = getBaseColorName(new Color({ h: 120, s: 11, l: 50 }));
    expect(aboveThreshold.name).toBe('Green');

    const atThreshold = getBaseColorName(new Color({ h: 120, s: 10, l: 50 }));
    expect(atThreshold.name).toBe('Green');

    const grayish = getBaseColorName(new Color('#748b74'));
    expect(grayish.name).toBe('Gray');

    const darkGray = getBaseColorName(new Color('#171717'));
    expect(darkGray.name).toBe('Black');

    const nearWhiteGray = getBaseColorName(new Color('#e6e6e6'));
    expect(nearWhiteGray.name).toBe('Gray');

    const brightGray = getBaseColorName(new Color('#e8e8e8'));
    expect(brightGray.name).toBe('White');
  });
});
