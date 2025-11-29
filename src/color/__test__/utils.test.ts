import { Color } from '../color';
import { getColorFromTemperatureLabel } from '../temperature';
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
  it('uses WCAG relative luminance by default', () => {
    // Pure Red #FF0000
    // Relative Luminance ~0.2126
    // Threshold 0.179
    // 0.2126 > 0.179 => Light (isDark = false)
    expect(isColorDark(new Color('#ff0000'))).toBe(false);

    // Pure Green #00FF00
    // Relative Luminance ~0.7152
    // 0.7152 > 0.179 => Light (isDark = false)
    expect(isColorDark(new Color('#00ff00'))).toBe(false);

    // Pure Blue #0000FF
    // Relative Luminance ~0.0722
    // 0.0722 < 0.179 => Dark (isDark = true)
    expect(isColorDark(new Color('#0000ff'))).toBe(true);

    // Black
    expect(isColorDark(new Color('#000000'))).toBe(true);

    // White
    expect(isColorDark(new Color('#ffffff'))).toBe(false);
  });

  it('allows customizing the WCAG threshold', () => {
    const red = new Color('#ff0000'); // Luminance ~0.2126

    // Default threshold 0.179 -> Not Dark
    expect(isColorDark(red)).toBe(false);

    // Higher threshold 0.3 -> Dark (0.2126 < 0.3)
    expect(isColorDark(red, { wcagThreshold: 0.3 })).toBe(true);

    // Lower threshold 0.1 -> Not Dark (0.2126 > 0.1)
    expect(isColorDark(red, { wcagThreshold: 0.1 })).toBe(false);
  });

  it('matches legacy behavior when using YIQ mode', () => {
    // Pure Red #FF0000
    // YIQ Brightness: (299*255 + 587*0 + 114*0)/1000 = 76.245
    // 76.245 < 128 => Dark
    // This contradicts WCAG (where Red is Light), proving the modes are different.
    expect(isColorDark(new Color('#ff0000'), { colorDarknessMode: 'YIQ' })).toBe(true);

    // Verify other YIQ behaviors from the previous implementation
    expect(isColorDark(new Color('#000000'), { colorDarknessMode: 'YIQ' })).toBe(true);
    expect(isColorDark(new Color('#ffffff'), { colorDarknessMode: 'YIQ' })).toBe(false);

    // Legacy edge case: red-dominant hue adjustment
    // Some colors between 120-128 brightness that are red-dominant are forced to be "light" (false)
    // Example needed: Brightness must be >= 120 and < 128.
    // Let's construct one.
    // R=255, G=50, B=50.
    // Brightness = (299*255 + 587*50 + 114*50)/1000 = (76245 + 29350 + 5700)/1000 = 111.295 (Too dark)
    // We need something brighter.
    // R=255, G=65, B=65.
    // Brightness = (76245 + 587*65 + 114*65)/1000 = (76245 + 38155 + 7410)/1000 = 121.81
    // 121.81 is within [120, 128).
    // R > G (255 > 65) and R > B (255 > 65) and G>0 and B>0.
    // Should return false (Light) despite brightness < 128.
    const trickyRed = new Color('rgb(255, 65, 65)');
    expect(isColorDark(trickyRed, { colorDarknessMode: 'YIQ' })).toBe(false);

    // Without the exception (if it wasn't red dominant), 121 brightness would be < 128 => Dark.
    // Let's try a non-red dominant color with similar brightness ~121.
    // R=65, G=65, B=255. (Blue dominant)
    // Brightness = (299*65 + 587*65 + 114*255)/1000 = (19435 + 38155 + 29070)/1000 = 86.6 (Too dark)
    // We need more green to be bright.
    // R=50, G=150, B=50.
    // Brightness = (299*50 + 587*150 + 114*50)/1000 = (14950 + 88050 + 5700)/1000 = 108.7 (Too dark)
    // R=120, G=120, B=120 => Brightness 120. < 128 => Dark. Not red dominant.
    const gray120 = new Color('rgb(120, 120, 120)');
    expect(isColorDark(gray120, { colorDarknessMode: 'YIQ' })).toBe(true);
  });

  it('allows customizing the YIQ threshold', () => {
    // Gray 120 is brightness 120.
    const gray120 = new Color('rgb(120, 120, 120)');

    // Default 128 -> Dark (120 < 128)
    expect(isColorDark(gray120, { colorDarknessMode: 'YIQ' })).toBe(true);

    // Threshold 100 -> Not Dark (120 > 100)
    expect(isColorDark(gray120, { colorDarknessMode: 'YIQ', yiqThreshold: 100 })).toBe(false);
  });

  // Re-verify the large list of legacy cases but using YIQ mode explicitly
  it('classifies colors correctly in YIQ mode (legacy compat)', () => {
    // Light color cases:
    expect(isColorDark(new Color('#00c0c0'), { colorDarknessMode: 'YIQ' })).toBe(false);
    expect(isColorDark(new Color('#00c0ff'), { colorDarknessMode: 'YIQ' })).toBe(false);
    // ... (sampled)
    expect(isColorDark(new Color('#ffffff'), { colorDarknessMode: 'YIQ' })).toBe(false);

    // Dark color cases:
    expect(isColorDark(new Color('#000000'), { colorDarknessMode: 'YIQ' })).toBe(true);
    expect(isColorDark(new Color('#ff0000'), { colorDarknessMode: 'YIQ' })).toBe(true); // Red is dark in YIQ
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
      getColorFromTemperatureLabel('Candlelight').toHex()
    );

    expect(new Color(getColorRGBAFromInput('incandescent')).toHex()).toBe(
      getColorFromTemperatureLabel('Incandescent lamp').toHex()
    );

    expect(new Color(getColorRGBAFromInput('  shade  ')).toHex()).toBe(
      getColorFromTemperatureLabel('Shade').toHex()
    );

    expect(new Color(getColorRGBAFromInput('cloudy sky')).toHex()).toBe(
      getColorFromTemperatureLabel('Cloudy sky').toHex()
    );
  });

  it('throws on unknown color names', () => {
    expect(() => getColorRGBAFromInput('notacolor')).toThrow();
  });
});
