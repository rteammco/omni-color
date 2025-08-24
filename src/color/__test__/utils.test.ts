import { Color } from '../color';
import { ColorTemperatureLabel, getColorFromTemperatureLabel } from '../temperature';
import { areColorsEqual, getColorRGBAFromInput, isColorDark, isColorOffWhite } from '../utils';

describe('areColorsEqual', () => {
  it('identifies identical colors across formats', () => {
    expect(areColorsEqual(new Color('#ff0000'), new Color('#ff0000'))).toBe(true);
    expect(areColorsEqual(new Color('#ffffff'), new Color('white'))).toBe(true);
    expect(areColorsEqual(new Color('rgb(0, 0, 255)'), new Color('#0000ff'))).toBe(true);
  });

  it('allows small rounding differences', () => {
    expect(
      areColorsEqual(new Color('rgba(0, 0, 0, 0.333)'), new Color('rgba(1, 0, 0, 0.333)'))
    ).toBe(true);
    expect(
      areColorsEqual(new Color('rgba(0, 0, 0, 0.333)'), new Color('rgba(0, 1, 0, 0.333)'))
    ).toBe(true);
    expect(
      areColorsEqual(new Color('rgba(0, 0, 0, 0.333)'), new Color('rgba(0, 0, 1, 0.333)'))
    ).toBe(true);
    expect(
      areColorsEqual(new Color('rgba(0, 0, 0, 0.333)'), new Color('rgba(0, 0, 0, 0.334)'))
    ).toBe(true);

    expect(
      areColorsEqual(new Color('rgba(0, 0, 0, 0.333)'), new Color('rgba(2, 0, 0, 0.333)'))
    ).toBe(false);
    expect(
      areColorsEqual(new Color('rgba(0, 0, 0, 0.333)'), new Color('rgba(0, 0, 0, 0.335)'))
    ).toBe(false);
  });

  it('returns false for different colors', () => {
    expect(areColorsEqual(new Color('#ff0000'), new Color('#00ff00'))).toBe(false);
    expect(areColorsEqual(new Color('#000000'), new Color('#0000ff'))).toBe(false);
  });
});

describe('isColorDark', () => {
  it('classifies colors correctly', () => {
    // Light color cases:
    expect(isColorDark(new Color('#00c0c0'))).toBe(false);
    expect(isColorDark(new Color('#00c0ff'))).toBe(false);
    expect(isColorDark(new Color('#00ff00'))).toBe(false);
    expect(isColorDark(new Color('#00ff40'))).toBe(false);
    expect(isColorDark(new Color('#00ff80'))).toBe(false);
    expect(isColorDark(new Color('#00ffc0'))).toBe(false);
    expect(isColorDark(new Color('#00ffff'))).toBe(false);
    expect(isColorDark(new Color('#40c000'))).toBe(false);
    expect(isColorDark(new Color('#40c040'))).toBe(false);
    expect(isColorDark(new Color('#40c080'))).toBe(false);
    expect(isColorDark(new Color('#40c0c0'))).toBe(false);
    expect(isColorDark(new Color('#40c0ff'))).toBe(false);
    expect(isColorDark(new Color('#40ff00'))).toBe(false);
    expect(isColorDark(new Color('#40ff40'))).toBe(false);
    expect(isColorDark(new Color('#40ff80'))).toBe(false);
    expect(isColorDark(new Color('#40ffc0'))).toBe(false);
    expect(isColorDark(new Color('#40ffff'))).toBe(false);
    expect(isColorDark(new Color('#808080'))).toBe(false);
    expect(isColorDark(new Color('#8080c0'))).toBe(false);
    expect(isColorDark(new Color('#8080ff'))).toBe(false);
    expect(isColorDark(new Color('#80c000'))).toBe(false);
    expect(isColorDark(new Color('#80c040'))).toBe(false);
    expect(isColorDark(new Color('#80c080'))).toBe(false);
    expect(isColorDark(new Color('#80c0c0'))).toBe(false);
    expect(isColorDark(new Color('#80c0ff'))).toBe(false);
    expect(isColorDark(new Color('#80ff00'))).toBe(false);
    expect(isColorDark(new Color('#80ff40'))).toBe(false);
    expect(isColorDark(new Color('#80ff80'))).toBe(false);
    expect(isColorDark(new Color('#80ffc0'))).toBe(false);
    expect(isColorDark(new Color('#80ffff'))).toBe(false);
    expect(isColorDark(new Color('#c08000'))).toBe(false);
    expect(isColorDark(new Color('#c08040'))).toBe(false);
    expect(isColorDark(new Color('#c08080'))).toBe(false);
    expect(isColorDark(new Color('#c080c0'))).toBe(false);
    expect(isColorDark(new Color('#c080ff'))).toBe(false);
    expect(isColorDark(new Color('#c0c000'))).toBe(false);
    expect(isColorDark(new Color('#c0c040'))).toBe(false);
    expect(isColorDark(new Color('#c0c080'))).toBe(false);
    expect(isColorDark(new Color('#c0c0c0'))).toBe(false);
    expect(isColorDark(new Color('#c0c0ff'))).toBe(false);
    expect(isColorDark(new Color('#c0ff00'))).toBe(false);
    expect(isColorDark(new Color('#c0ff40'))).toBe(false);
    expect(isColorDark(new Color('#c0ff80'))).toBe(false);
    expect(isColorDark(new Color('#c0ffc0'))).toBe(false);
    expect(isColorDark(new Color('#c0ffff'))).toBe(false);
    expect(isColorDark(new Color('#ff4040'))).toBe(false);
    expect(isColorDark(new Color('#ff4080'))).toBe(false);
    expect(isColorDark(new Color('#ff40c0'))).toBe(false);
    expect(isColorDark(new Color('#ff40ff'))).toBe(false);
    expect(isColorDark(new Color('#ff8000'))).toBe(false);
    expect(isColorDark(new Color('#ff8040'))).toBe(false);
    expect(isColorDark(new Color('#ff8080'))).toBe(false);
    expect(isColorDark(new Color('#ff80c0'))).toBe(false);
    expect(isColorDark(new Color('#ff80ff'))).toBe(false);
    expect(isColorDark(new Color('#ffc000'))).toBe(false);
    expect(isColorDark(new Color('#ffc040'))).toBe(false);
    expect(isColorDark(new Color('#ffc080'))).toBe(false);
    expect(isColorDark(new Color('#ffc0c0'))).toBe(false);
    expect(isColorDark(new Color('#ffc0ff'))).toBe(false);
    expect(isColorDark(new Color('#ffff00'))).toBe(false);
    expect(isColorDark(new Color('#ffff40'))).toBe(false);
    expect(isColorDark(new Color('#ffff80'))).toBe(false);
    expect(isColorDark(new Color('#ffffc0'))).toBe(false);
    expect(isColorDark(new Color('#ffffff'))).toBe(false);

    // Dark color cases:
    expect(isColorDark(new Color('#000000'))).toBe(true);
    expect(isColorDark(new Color('#000001'))).toBe(true);
    expect(isColorDark(new Color('#000040'))).toBe(true);
    expect(isColorDark(new Color('#000080'))).toBe(true);
    expect(isColorDark(new Color('#0000c0'))).toBe(true);
    expect(isColorDark(new Color('#0000ff'))).toBe(true);
    expect(isColorDark(new Color('#000100'))).toBe(true);
    expect(isColorDark(new Color('#000101'))).toBe(true);
    expect(isColorDark(new Color('#004000'))).toBe(true);
    expect(isColorDark(new Color('#004040'))).toBe(true);
    expect(isColorDark(new Color('#004080'))).toBe(true);
    expect(isColorDark(new Color('#0040c0'))).toBe(true);
    expect(isColorDark(new Color('#0040ff'))).toBe(true);
    expect(isColorDark(new Color('#008000'))).toBe(true);
    expect(isColorDark(new Color('#008040'))).toBe(true);
    expect(isColorDark(new Color('#008080'))).toBe(true);
    expect(isColorDark(new Color('#0080c0'))).toBe(true);
    expect(isColorDark(new Color('#0080ff'))).toBe(true);
    expect(isColorDark(new Color('#00c000'))).toBe(true);
    expect(isColorDark(new Color('#00c040'))).toBe(true);
    expect(isColorDark(new Color('#00c080'))).toBe(true);
    expect(isColorDark(new Color('#010000'))).toBe(true);
    expect(isColorDark(new Color('#010100'))).toBe(true);
    expect(isColorDark(new Color('#010101'))).toBe(true);
    expect(isColorDark(new Color('#400000'))).toBe(true);
    expect(isColorDark(new Color('#400040'))).toBe(true);
    expect(isColorDark(new Color('#400080'))).toBe(true);
    expect(isColorDark(new Color('#4000c0'))).toBe(true);
    expect(isColorDark(new Color('#4000ff'))).toBe(true);
    expect(isColorDark(new Color('#404000'))).toBe(true);
    expect(isColorDark(new Color('#404040'))).toBe(true);
    expect(isColorDark(new Color('#404080'))).toBe(true);
    expect(isColorDark(new Color('#4040c0'))).toBe(true);
    expect(isColorDark(new Color('#4040ff'))).toBe(true);
    expect(isColorDark(new Color('#408000'))).toBe(true);
    expect(isColorDark(new Color('#408040'))).toBe(true);
    expect(isColorDark(new Color('#408080'))).toBe(true);
    expect(isColorDark(new Color('#4080c0'))).toBe(true);
    expect(isColorDark(new Color('#4080ff'))).toBe(true);
    expect(isColorDark(new Color('#800000'))).toBe(true);
    expect(isColorDark(new Color('#800040'))).toBe(true);
    expect(isColorDark(new Color('#800080'))).toBe(true);
    expect(isColorDark(new Color('#8000c0'))).toBe(true);
    expect(isColorDark(new Color('#8000ff'))).toBe(true);
    expect(isColorDark(new Color('#804000'))).toBe(true);
    expect(isColorDark(new Color('#804040'))).toBe(true);
    expect(isColorDark(new Color('#804080'))).toBe(true);
    expect(isColorDark(new Color('#8040c0'))).toBe(true);
    expect(isColorDark(new Color('#8040ff'))).toBe(true);
    expect(isColorDark(new Color('#808000'))).toBe(true);
    expect(isColorDark(new Color('#808040'))).toBe(true);
    expect(isColorDark(new Color('#c00000'))).toBe(true);
    expect(isColorDark(new Color('#c00040'))).toBe(true);
    expect(isColorDark(new Color('#c00080'))).toBe(true);
    expect(isColorDark(new Color('#c000c0'))).toBe(true);
    expect(isColorDark(new Color('#c000ff'))).toBe(true);
    expect(isColorDark(new Color('#c04000'))).toBe(true);
    expect(isColorDark(new Color('#c04040'))).toBe(true);
    expect(isColorDark(new Color('#c04080'))).toBe(true);
    expect(isColorDark(new Color('#c040c0'))).toBe(true);
    expect(isColorDark(new Color('#c040ff'))).toBe(true);
    expect(isColorDark(new Color('#ff0000'))).toBe(true);
    expect(isColorDark(new Color('#ff0040'))).toBe(true);
    expect(isColorDark(new Color('#ff0080'))).toBe(true);
    expect(isColorDark(new Color('#ff00c0'))).toBe(true);
    expect(isColorDark(new Color('#ff00ff'))).toBe(true);
    expect(isColorDark(new Color('#ff4000'))).toBe(true);
  });
});

describe('isColorOffWhite', () => {
  it('classifies colors correctly', () => {
    // Off-white color cases:
    expect(isColorOffWhite(new Color('#ffffff'))).toBe(true);
    expect(isColorOffWhite(new Color('#fefefe'))).toBe(true);
    expect(isColorOffWhite(new Color('#fdfdfd'))).toBe(true);
    expect(isColorOffWhite(new Color('#fcfcfc'))).toBe(true);
    expect(isColorOffWhite(new Color('#fafafa'))).toBe(true);
    expect(isColorOffWhite(new Color('#f5f5f5'))).toBe(true);
    expect(isColorOffWhite(new Color('#f0f0f0'))).toBe(true);
    expect(isColorOffWhite(new Color('#fffafa'))).toBe(true);
    expect(isColorOffWhite(new Color('#fffaf0'))).toBe(true);
    expect(isColorOffWhite(new Color('#f0fff0'))).toBe(true);
    expect(isColorOffWhite(new Color('#f0ffff'))).toBe(true);
    expect(isColorOffWhite(new Color('#f0f8ff'))).toBe(true);
    expect(isColorOffWhite(new Color('#fff5ee'))).toBe(true);
    expect(isColorOffWhite(new Color('#f8f8ff'))).toBe(true);
    expect(isColorOffWhite(new Color('#fffff0'))).toBe(true);

    // Not off-white color cases:
    expect(isColorOffWhite(new Color('#eeeeee'))).toBe(false);
    expect(isColorOffWhite(new Color('#dddddd'))).toBe(false);
    expect(isColorOffWhite(new Color('#cccccc'))).toBe(false);
    expect(isColorOffWhite(new Color('#fff0dd'))).toBe(false);
    expect(isColorOffWhite(new Color('#ffff00'))).toBe(false);
    expect(isColorOffWhite(new Color('#ff0000'))).toBe(false);
    expect(isColorOffWhite(new Color('#00ff00'))).toBe(false);
    expect(isColorOffWhite(new Color('#0000ff'))).toBe(false);
    expect(isColorOffWhite(new Color('#f5deb3'))).toBe(false);
    expect(isColorOffWhite(new Color('#e0ffff'))).toBe(false);
    expect(isColorOffWhite(new Color('#dcdcdc'))).toBe(false);
    expect(isColorOffWhite(new Color('#f0e68c'))).toBe(false);
    expect(isColorOffWhite(new Color('#fffacd'))).toBe(false);
    expect(isColorOffWhite(new Color('#ffebcd'))).toBe(false);
    expect(isColorOffWhite(new Color('#808080'))).toBe(false);
  });
});

describe('getColorRGBAFromInput', () => {
  it('parses hex strings with leading/trailing spaces', () => {
    expect(getColorRGBAFromInput('  #ff0000  ')).toEqual({
      r: 255,
      g: 0,
      b: 0,
      a: 1,
    });
  });

  it('parses CSS color strings with leading/trailing spaces', () => {
    expect(getColorRGBAFromInput('  rgb(255, 0, 0)  ')).toEqual({
      r: 255,
      g: 0,
      b: 0,
      a: 1,
    });
  });

  it('parses named colors with or without spaces', () => {
    expect(new Color(getColorRGBAFromInput('lightblue')).toHex()).toBe('#add8e6');
    expect(new Color(getColorRGBAFromInput('light blue')).toHex()).toBe('#add8e6');
  });

  it('parses full and partial color temperature strings', () => {
    expect(new Color(getColorRGBAFromInput('candlelight')).toHex()).toBe(
      getColorFromTemperatureLabel(ColorTemperatureLabel.CANDLELIGHT).toHex()
    );

    expect(new Color(getColorRGBAFromInput('incandescent')).toHex()).toBe(
      getColorFromTemperatureLabel(ColorTemperatureLabel.INCANDESCENT).toHex()
    );

    expect(new Color(getColorRGBAFromInput('  shade  ')).toHex()).toBe(
      getColorFromTemperatureLabel(ColorTemperatureLabel.SHADE).toHex()
    );

    expect(new Color(getColorRGBAFromInput('cloudy sky')).toHex()).toBe(
      getColorFromTemperatureLabel(ColorTemperatureLabel.CLOUDY).toHex()
    );
  });

  it('throws on unknown color names', () => {
    expect(() => getColorRGBAFromInput('notacolor')).toThrow();
  });
});
