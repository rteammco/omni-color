import { resolveCaseInsensitiveOption } from '../../utils';
import { Color } from '../color';
import { getColorFromTemperatureLabel } from '../temperature';
import { areColorsEqual, getColorRGBAFromInput, isColorDark, isColorOffWhite } from '../utils';

function getRGBA(color: Parameters<typeof getColorRGBAFromInput>[0]) {
  return getColorRGBAFromInput(color);
}

describe('areColorsEqual', () => {
  it('identifies identical colors across formats', () => {
    expect(areColorsEqual(getRGBA('#ff0000'), getRGBA('#ff0000'))).toBe(true);
    expect(areColorsEqual(getRGBA('#ffffff'), getRGBA('white'))).toBe(true);
    expect(areColorsEqual(getRGBA('rgb(0, 0, 255)'), getRGBA('#0000ff'))).toBe(true);
  });

  it('treats even small channel or alpha differences as unequal', () => {
    expect(areColorsEqual(getRGBA('rgba(0, 0, 0, 0.5)'), getRGBA('rgba(1, 0, 0, 0.5)'))).toBe(
      false,
    );
    expect(areColorsEqual(getRGBA('rgba(0, 0, 0, 0.5)'), getRGBA('rgba(0, 1, 0, 0.5)'))).toBe(
      false,
    );
    expect(areColorsEqual(getRGBA('rgba(0, 0, 0, 0.5)'), getRGBA('rgba(0, 0, 1, 0.5)'))).toBe(
      false,
    );
    expect(
      areColorsEqual(
        getRGBA({ r: 0, g: 0, b: 0, a: 0.5 }),
        getRGBA({ r: 0, g: 0, b: 0, a: 0.5005 }),
      ),
    ).toBe(false);
  });

  it('handles minor floating-point drift without a wide epsilon', () => {
    const nearlyExact = getRGBA({ r: 1.0000004, g: 2.0000004, b: 3.0000004 });
    expect(areColorsEqual(nearlyExact, getRGBA({ r: 1, g: 2, b: 3 }))).toBe(true);
  });

  it('compares colors parsed from multiple formats consistently', () => {
    const base = new Color('#2689d6');
    const preciseHsl = { h: 206.25, s: 69.841, l: 49.412 };
    const preciseHsv = { h: 206.25, s: 82.243, v: 83.922 };
    const formats = [
      new Color(preciseHsl),
      new Color(preciseHsv),
      new Color(base.toLAB()),
      new Color(base.toLCH()),
      new Color(base.toOKLCH()),
      new Color('#2689d6ff'),
    ];

    const baseRgba = base.toRGBA();
    const baseRgb = base.toRGB();

    const [hslColor, hsvColor, labColor, lchColor, oklchColor, hexColor] = formats;

    expect(hslColor.toRGB()).toEqual(baseRgb);
    expect(hslColor.toRGBA().a).toBeCloseTo(baseRgba.a, 5);
    expect(areColorsEqual(hslColor.toRGBA(), baseRgba)).toBe(true);
    expect(hslColor.toHex()).toBe('#2689d6');

    expect(hsvColor.toRGB()).toEqual(baseRgb);
    expect(hsvColor.toRGBA().a).toBeCloseTo(baseRgba.a, 5);
    expect(areColorsEqual(hsvColor.toRGBA(), baseRgba)).toBe(true);
    expect(hsvColor.toHex()).toBe('#2689d6');

    expect(labColor.toRGB()).toEqual(baseRgb);
    expect(labColor.toRGBA().a).toBeCloseTo(baseRgba.a, 5);
    expect(areColorsEqual(labColor.toRGBA(), baseRgba)).toBe(true);
    expect(labColor.toHex()).toBe('#2689d6');

    expect(lchColor.toRGB()).toEqual(baseRgb);
    expect(lchColor.toRGBA().a).toBeCloseTo(baseRgba.a, 5);
    expect(areColorsEqual(lchColor.toRGBA(), baseRgba)).toBe(true);
    expect(lchColor.toHex()).toBe('#2689d6');

    expect(oklchColor.toRGB()).toEqual(baseRgb);
    expect(oklchColor.toRGBA().a).toBeCloseTo(baseRgba.a, 5);
    expect(areColorsEqual(oklchColor.toRGBA(), baseRgba)).toBe(true);
    expect(oklchColor.toHex()).toBe('#2689d6');

    expect(areColorsEqual(hexColor.toRGBA(), baseRgba)).toBe(true);
  });

  it('returns false for different colors', () => {
    expect(areColorsEqual(getRGBA('#ff0000'), getRGBA('#00ff00'))).toBe(false);
    expect(areColorsEqual(getRGBA('#000000'), getRGBA('#0000ff'))).toBe(false);
  });
});

describe('isColorDark', () => {
  it('matches legacy behavior when using YIQ mode (full regression test)', () => {
    const opts = { colorDarknessMode: 'YIQ' } as const;
    // Light color cases:
    expect(isColorDark(getRGBA('#00c0c0'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#00c0ff'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#00ff00'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#00ff40'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#00ff80'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#00ffc0'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#00ffff'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#40c000'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#40c040'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#40c080'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#40c0c0'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#40c0ff'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#40ff00'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#40ff40'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#40ff80'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#40ffc0'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#40ffff'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#808080'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#8080c0'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#8080ff'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#80c000'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#80c040'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#80c080'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#80c0c0'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#80c0ff'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#80ff00'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#80ff40'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#80ff80'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#80ffc0'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#80ffff'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#c08000'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#c08040'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#c08080'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#c080c0'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#c080ff'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#c0c000'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#c0c040'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#c0c080'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#c0c0c0'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#c0c0ff'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#c0ff00'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#c0ff40'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#c0ff80'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#c0ffc0'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#c0ffff'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#ff4080'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#ff40c0'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#ff40ff'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#ff8000'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#ff8040'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#ff8080'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#ff80c0'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#ff80ff'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#ffc000'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#ffc040'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#ffc080'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#ffc0c0'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#ffc0ff'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#ffff00'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#ffff40'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#ffff80'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#ffffc0'), opts)).toBe(false);
    expect(isColorDark(getRGBA('#ffffff'), opts)).toBe(false);

    // Dark color cases:
    expect(isColorDark(getRGBA('#ff4040'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#000000'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#000001'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#000040'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#000080'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#0000c0'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#0000ff'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#000100'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#000101'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#004000'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#004040'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#004080'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#0040c0'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#0040ff'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#008000'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#008040'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#008080'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#0080c0'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#0080ff'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#00c000'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#00c040'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#00c080'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#010000'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#010100'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#010101'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#400000'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#400040'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#400080'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#4000c0'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#4000ff'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#404000'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#404040'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#404080'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#4040c0'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#4040ff'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#408000'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#408040'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#408080'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#4080c0'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#4080ff'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#800000'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#800040'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#800080'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#8000c0'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#8000ff'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#804000'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#804040'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#804080'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#8040c0'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#8040ff'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#808000'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#808040'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#c00000'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#c00040'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#c00080'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#c000c0'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#c000ff'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#c04000'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#c04040'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#c04080'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#c040c0'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#c040ff'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#ff0000'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#ff0040'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#ff0080'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#ff00c0'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#ff00ff'), opts)).toBe(true);
    expect(isColorDark(getRGBA('#ff4000'), opts)).toBe(true);
  });

  it('uses WCAG relative luminance by default', () => {
    // Pure Red #FF0000
    // Relative Luminance ~0.2126 > 0.179 => Light (isDark = false)
    expect(isColorDark(getRGBA('#ff0000'))).toBe(false);

    // Pure Green #00FF00
    // Relative Luminance ~0.7152 > 0.179 => Light (isDark = false)
    expect(isColorDark(getRGBA('#00ff00'))).toBe(false);

    // Pure Blue #0000FF
    // Relative Luminance ~0.0722 < 0.179 => Dark (isDark = true)
    expect(isColorDark(getRGBA('#0000ff'))).toBe(true);

    // Black
    expect(isColorDark(getRGBA('#000000'))).toBe(true);

    // White
    expect(isColorDark(getRGBA('#ffffff'))).toBe(false);

    // --- Extended WCAG Test Suite ---

    // Primary & Secondary Colors
    expect(isColorDark(getRGBA('#FFFF00'))).toBe(false); // Yellow (0.9278) -> Light
    expect(isColorDark(getRGBA('#00FFFF'))).toBe(false); // Cyan (0.7874) -> Light
    expect(isColorDark(getRGBA('#FF00FF'))).toBe(false); // Magenta (0.2848) -> Light

    // Grayscale
    expect(isColorDark(getRGBA('#101010'))).toBe(true);
    expect(isColorDark(getRGBA('#303030'))).toBe(true);
    expect(isColorDark(getRGBA('#505050'))).toBe(true);
    // #767676 is approx 0.179 relative luminance boundary
    // #757575 -> 0.175 (Dark)
    // #777777 -> 0.181 (Light)
    expect(isColorDark(getRGBA('#757575'))).toBe(true);
    expect(isColorDark(getRGBA('#777777'))).toBe(false);
    expect(isColorDark(getRGBA('#808080'))).toBe(false);
    expect(isColorDark(getRGBA('#A0A0A0'))).toBe(false);
    expect(isColorDark(getRGBA('#C0C0C0'))).toBe(false);
    expect(isColorDark(getRGBA('#E0E0E0'))).toBe(false);

    // Common UI Colors
    expect(isColorDark(getRGBA('#FFA500'))).toBe(false); // Orange (0.48) -> Light
    expect(isColorDark(getRGBA('#800080'))).toBe(true); // Purple (0.06) -> Dark
    expect(isColorDark(getRGBA('#008080'))).toBe(true); // Teal (0.17... wait, let's verify)
    // Teal #008080: R=0, G=128(0.50), B=128(0.50).
    // sRGB -> Linear: 0 -> 0; 0.5019 -> ~0.2158.
    // L = 0.7152*0.2158 + 0.0722*0.2158 = 0.169.
    // 0.169 < 0.179 -> Dark.
    expect(isColorDark(getRGBA('#008080'))).toBe(true);

    // Maroon #800000: R=128, G=0, B=0.
    // R_lin = ~0.2158. L = 0.2126*0.2158 = 0.045 -> Dark.
    expect(isColorDark(getRGBA('#800000'))).toBe(true);

    // Navy #000080: B=128. B_lin=0.2158. L=0.0722*0.2158=0.015 -> Dark.
    expect(isColorDark(getRGBA('#000080'))).toBe(true);

    // Olive #808000: R=128, G=128. L = 0.2126*0.215 + 0.7152*0.215 = 0.215*0.927 = 0.199.
    // 0.199 > 0.179 -> Light.
    expect(isColorDark(getRGBA('#808000'))).toBe(false);

    // Various Random Colors
    expect(isColorDark(getRGBA('#123456'))).toBe(true); // Dark Blue
    expect(isColorDark(getRGBA('#654321'))).toBe(true); // Dark Brown
    expect(isColorDark(getRGBA('#abcdef'))).toBe(false); // Light Blue
    expect(isColorDark(getRGBA('#fedcba'))).toBe(false); // Light Peach
    expect(isColorDark(getRGBA('#AA0000'))).toBe(true); // Dark Red
    expect(isColorDark(getRGBA('#00AA00'))).toBe(false); // Med Green (L ~ 0.28) -> Light
  });

  it('throws for invalid darkness mode option values', () => {
    expect(() =>
      isColorDark(getRGBA('#ffffff'), {
        colorDarknessMode: 'INVALID' as never,
      }),
    ).toThrow("Invalid 'colorDarknessMode'");
  });

  it('allows customizing the WCAG threshold', () => {
    const red = getRGBA('#ff0000'); // Luminance ~0.2126

    // Default threshold 0.179 -> Not Dark
    expect(isColorDark(red)).toBe(false);

    // Higher threshold 0.3 -> Dark (0.2126 < 0.3)
    expect(isColorDark(red, { wcagThreshold: 0.3 })).toBe(true);

    // Lower threshold 0.1 -> Not Dark (0.2126 > 0.1)
    expect(isColorDark(red, { wcagThreshold: 0.1 })).toBe(false);
  });

  it('allows customizing the YIQ threshold', () => {
    // Gray 120 is brightness 120.
    const gray120 = getRGBA('rgb(120, 120, 120)');

    // Default 128 -> Dark (120 < 128)
    expect(isColorDark(gray120, { colorDarknessMode: 'YIQ' })).toBe(true);

    // Threshold 100 -> Not Dark (120 > 100)
    expect(isColorDark(gray120, { colorDarknessMode: 'YIQ', yiqThreshold: 100 })).toBe(false);
  });

  it('handles standard YIQ behavior correctly', () => {
    // R=255, G=65, B=65 => Brightness 121.81 < 128. Should be Dark (true).
    const trickyRed = getRGBA('rgb(255, 65, 65)');
    expect(isColorDark(trickyRed, { colorDarknessMode: 'YIQ' })).toBe(true);

    // R=120, G=120, B=120 => Brightness 120 < 128. Should be Dark (true).
    const gray120 = getRGBA('rgb(120, 120, 120)');
    expect(isColorDark(gray120, { colorDarknessMode: 'YIQ' })).toBe(true);
  });

  it('accepts mixed case darkness mode', () => {
    // YIQ threshold 128
    // Red (255, 0, 0)
    // YIQ Brightness: (299*255 + 0 + 0) / 1000 = 76.245 < 128 => dark
    const c = getRGBA('red');
    const d1 = isColorDark(c, { colorDarknessMode: 'YIQ' });
    const d2 = isColorDark(c, { colorDarknessMode: 'yiq' });

    expect(d1).toBe(d2);
    expect(d1).toBe(true);
  });
});

describe('isColorOffWhite', () => {
  it('classifies colors correctly', () => {
    // Off-white color cases:
    expect(isColorOffWhite(getRGBA('#ffffff'))).toBe(true);
    expect(isColorOffWhite(getRGBA('#fefefe'))).toBe(true);
    expect(isColorOffWhite(getRGBA('#fdfdfd'))).toBe(true);
    expect(isColorOffWhite(getRGBA('#fcfcfc'))).toBe(true);
    expect(isColorOffWhite(getRGBA('#fafafa'))).toBe(true);
    expect(isColorOffWhite(getRGBA('#f5f5f5'))).toBe(true);
    expect(isColorOffWhite(getRGBA('#f0f0f0'))).toBe(true);
    expect(isColorOffWhite(getRGBA('#fffafa'))).toBe(true);
    expect(isColorOffWhite(getRGBA('#fffaf0'))).toBe(true);
    expect(isColorOffWhite(getRGBA('#f0fff0'))).toBe(true);
    expect(isColorOffWhite(getRGBA('#f0ffff'))).toBe(true);
    expect(isColorOffWhite(getRGBA('#f0f8ff'))).toBe(true);
    expect(isColorOffWhite(getRGBA('#fff5ee'))).toBe(true);
    expect(isColorOffWhite(getRGBA('#f8f8ff'))).toBe(true);
    expect(isColorOffWhite(getRGBA('#fffff0'))).toBe(true);

    // Not off-white color cases:
    expect(isColorOffWhite(getRGBA('#eeeeee'))).toBe(false);
    expect(isColorOffWhite(getRGBA('#dddddd'))).toBe(false);
    expect(isColorOffWhite(getRGBA('#cccccc'))).toBe(false);
    expect(isColorOffWhite(getRGBA('#fff0dd'))).toBe(false);
    expect(isColorOffWhite(getRGBA('#ffff00'))).toBe(false);
    expect(isColorOffWhite(getRGBA('#ff0000'))).toBe(false);
    expect(isColorOffWhite(getRGBA('#00ff00'))).toBe(false);
    expect(isColorOffWhite(getRGBA('#0000ff'))).toBe(false);
    expect(isColorOffWhite(getRGBA('#f5deb3'))).toBe(false);
    expect(isColorOffWhite(getRGBA('#e0ffff'))).toBe(false);
    expect(isColorOffWhite(getRGBA('#dcdcdc'))).toBe(false);
    expect(isColorOffWhite(getRGBA('#f0e68c'))).toBe(false);
    expect(isColorOffWhite(getRGBA('#fffacd'))).toBe(false);
    expect(isColorOffWhite(getRGBA('#ffebcd'))).toBe(false);
    expect(isColorOffWhite(getRGBA('#808080'))).toBe(false);
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
      new Color(getColorFromTemperatureLabel('Candlelight')).toHex(),
    );

    expect(new Color(getColorRGBAFromInput('incandescent')).toHex()).toBe(
      new Color(getColorFromTemperatureLabel('Incandescent lamp')).toHex(),
    );

    expect(new Color(getColorRGBAFromInput('  shade  ')).toHex()).toBe(
      new Color(getColorFromTemperatureLabel('Shade')).toHex(),
    );

    expect(new Color(getColorRGBAFromInput('cloudy sky')).toHex()).toBe(
      new Color(getColorFromTemperatureLabel('Cloudy sky')).toHex(),
    );
  });

  it('throws on unknown color names', () => {
    expect(() => getColorRGBAFromInput('notacolor')).toThrow();
  });
});

describe('resolveCaseInsensitiveOption', () => {
  it('normalizes mixed casing and trims whitespace', () => {
    const resolved = resolveCaseInsensitiveOption({
      allowedValues: ['WCAG', 'YIQ'],
      defaultValue: 'WCAG',
      key: 'colorDarknessMode',
      options: { colorDarknessMode: '  yiQ  ' },
    });
    expect(resolved).toBe('YIQ');
  });

  it('returns the canonical allowed value when allowed values are not uppercase', () => {
    const resolved = resolveCaseInsensitiveOption({
      allowedValues: ['camelCase', 'PascalCase'],
      defaultValue: 'camelCase',
      key: 'mode',
      options: { mode: '  PASCALcase ' },
    });
    expect(resolved).toBe('PascalCase');
  });

  it('returns the default when value is undefined', () => {
    const resolved = resolveCaseInsensitiveOption({
      allowedValues: ['WCAG', 'YIQ'],
      defaultValue: 'WCAG',
      key: 'colorDarknessMode',
      options: {} as { colorDarknessMode: 'WCAG' | 'YIQ' },
    });
    expect(resolved).toBe('WCAG');
  });

  it('throws for unknown values', () => {
    expect(() =>
      resolveCaseInsensitiveOption({
        allowedValues: ['WCAG', 'YIQ'],
        defaultValue: 'WCAG',
        key: 'colorDarknessMode',
        options: { colorDarknessMode: 'unknown' },
      }),
    ).toThrow("Invalid 'colorDarknessMode'");
  });

  it('throws for non-string values', () => {
    expect(() =>
      resolveCaseInsensitiveOption({
        allowedValues: ['WCAG', 'YIQ'],
        defaultValue: 'WCAG',
        key: 'colorDarknessMode',
        options: { colorDarknessMode: 123 as never as string }, // test different type
      }),
    ).toThrow("Invalid 'colorDarknessMode'");
  });
});
