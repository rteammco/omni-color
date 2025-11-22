import { Color } from '../color';
import {
  cmykToString,
  getColorFormatType,
  hslaToString,
  hslToString,
  lchToString,
  oklchToString,
  rgbaToString,
  rgbToString,
} from '../formats';

describe('rgbToString', () => {
  it('generates rgb strings', () => {
    const black = new Color('#000000');
    expect(rgbToString(black.toRGB())).toBe('rgb(0, 0, 0)');
    expect(black.toRGBString()).toBe('rgb(0, 0, 0)');

    const white = new Color('#ffffff');
    expect(rgbToString(white.toRGB())).toBe('rgb(255, 255, 255)');
    expect(white.toRGBString()).toBe('rgb(255, 255, 255)');

    const gray = new Color('#808080');
    expect(rgbToString(gray.toRGB())).toBe('rgb(128, 128, 128)');
    expect(gray.toRGBString()).toBe('rgb(128, 128, 128)');

    const red = new Color('#ff0000');
    expect(rgbToString(red.toRGB())).toBe('rgb(255, 0, 0)');
    expect(red.toRGBString()).toBe('rgb(255, 0, 0)');

    const green = new Color('#00ff00');
    expect(rgbToString(green.toRGB())).toBe('rgb(0, 255, 0)');
    expect(green.toRGBString()).toBe('rgb(0, 255, 0)');

    const blue = new Color('#0000ff');
    expect(rgbToString(blue.toRGB())).toBe('rgb(0, 0, 255)');
    expect(blue.toRGBString()).toBe('rgb(0, 0, 255)');

    const yellow = new Color('#ffff00');
    expect(rgbToString(yellow.toRGB())).toBe('rgb(255, 255, 0)');
    expect(yellow.toRGBString()).toBe('rgb(255, 255, 0)');

    const cyan = new Color('#00ffff');
    expect(rgbToString(cyan.toRGB())).toBe('rgb(0, 255, 255)');
    expect(cyan.toRGBString()).toBe('rgb(0, 255, 255)');

    const magenta = new Color('#ff00ff');
    expect(rgbToString(magenta.toRGB())).toBe('rgb(255, 0, 255)');
    expect(magenta.toRGBString()).toBe('rgb(255, 0, 255)');

    const custom = new Color('#abc123');
    expect(rgbToString(custom.toRGB())).toBe('rgb(171, 193, 35)');
    expect(custom.toRGBString()).toBe('rgb(171, 193, 35)');
  });
});

describe('rgbaToString', () => {
  it('generates rgba strings', () => {
    const transparentBlack = new Color('#00000000');
    expect(rgbaToString(transparentBlack.toRGBA())).toBe('rgba(0, 0, 0, 0)');
    expect(transparentBlack.toRGBAString()).toBe('rgba(0, 0, 0, 0)');

    const opaqueWhite = new Color('#ffffffff');
    expect(rgbaToString(opaqueWhite.toRGBA())).toBe('rgba(255, 255, 255, 1)');
    expect(opaqueWhite.toRGBAString()).toBe('rgba(255, 255, 255, 1)');

    const gray = new Color('#80808080');
    expect(rgbaToString(gray.toRGBA())).toBe('rgba(128, 128, 128, 0.502)');
    expect(gray.toRGBAString()).toBe('rgba(128, 128, 128, 0.502)');

    const red = new Color('#ff000080');
    expect(rgbaToString(red.toRGBA())).toBe('rgba(255, 0, 0, 0.502)');
    expect(red.toRGBAString()).toBe('rgba(255, 0, 0, 0.502)');

    const green = new Color('#00ff007f');
    expect(rgbaToString(green.toRGBA())).toBe('rgba(0, 255, 0, 0.498)');
    expect(green.toRGBAString()).toBe('rgba(0, 255, 0, 0.498)');

    const blue = new Color('#0000ff40');
    expect(rgbaToString(blue.toRGBA())).toBe('rgba(0, 0, 255, 0.251)');
    expect(blue.toRGBAString()).toBe('rgba(0, 0, 255, 0.251)');

    const yellow = new Color('#ffff00c0');
    expect(rgbaToString(yellow.toRGBA())).toBe('rgba(255, 255, 0, 0.753)');
    expect(yellow.toRGBAString()).toBe('rgba(255, 255, 0, 0.753)');

    const cyan = new Color('#00ffff20');
    expect(rgbaToString(cyan.toRGBA())).toBe('rgba(0, 255, 255, 0.125)');
    expect(cyan.toRGBAString()).toBe('rgba(0, 255, 255, 0.125)');

    const magenta = new Color('#ff00ff99');
    expect(rgbaToString(magenta.toRGBA())).toBe('rgba(255, 0, 255, 0.6)');
    expect(magenta.toRGBAString()).toBe('rgba(255, 0, 255, 0.6)');

    const custom = new Color('#abc123d6');
    expect(rgbaToString(custom.toRGBA())).toBe('rgba(171, 193, 35, 0.839)');
    expect(custom.toRGBAString()).toBe('rgba(171, 193, 35, 0.839)');
  });

  it('rounds alpha to three decimals', () => {
    expect(rgbaToString({ r: 1, g: 2, b: 3, a: 0.123456 })).toBe('rgba(1, 2, 3, 0.123)');
    expect(rgbaToString({ r: 1, g: 2, b: 3, a: 0.98765 })).toBe('rgba(1, 2, 3, 0.988)');
  });
});

describe('hslToString', () => {
  it('generates hsl strings', () => {
    const black = new Color('#000000');
    expect(hslToString(black.toHSL())).toBe('hsl(0, 0%, 0%)');
    expect(black.toHSLString()).toBe('hsl(0, 0%, 0%)');

    const white = new Color('#ffffff');
    expect(hslToString(white.toHSL())).toBe('hsl(0, 0%, 100%)');
    expect(white.toHSLString()).toBe('hsl(0, 0%, 100%)');

    const gray = new Color('#808080');
    expect(hslToString(gray.toHSL())).toBe('hsl(0, 0%, 50%)');
    expect(gray.toHSLString()).toBe('hsl(0, 0%, 50%)');

    const red = new Color('#ff0000');
    expect(hslToString(red.toHSL())).toBe('hsl(0, 100%, 50%)');
    expect(red.toHSLString()).toBe('hsl(0, 100%, 50%)');

    const green = new Color('#00ff00');
    expect(hslToString(green.toHSL())).toBe('hsl(120, 100%, 50%)');
    expect(green.toHSLString()).toBe('hsl(120, 100%, 50%)');

    const blue = new Color('#0000ff');
    expect(hslToString(blue.toHSL())).toBe('hsl(240, 100%, 50%)');
    expect(blue.toHSLString()).toBe('hsl(240, 100%, 50%)');

    const yellow = new Color('#ffff00');
    expect(hslToString(yellow.toHSL())).toBe('hsl(60, 100%, 50%)');
    expect(yellow.toHSLString()).toBe('hsl(60, 100%, 50%)');

    const cyan = new Color('#00ffff');
    expect(hslToString(cyan.toHSL())).toBe('hsl(180, 100%, 50%)');
    expect(cyan.toHSLString()).toBe('hsl(180, 100%, 50%)');

    const magenta = new Color('#ff00ff');
    expect(hslToString(magenta.toHSL())).toBe('hsl(300, 100%, 50%)');
    expect(magenta.toHSLString()).toBe('hsl(300, 100%, 50%)');

    const custom = new Color('#abc123');
    expect(hslToString(custom.toHSL())).toBe('hsl(68, 69%, 45%)');
    expect(custom.toHSLString()).toBe('hsl(68, 69%, 45%)');
  });

  it('rounds component values to three decimals', () => {
    expect(hslToString({ h: 123.4567, s: 50.5555, l: 10.1234 })).toBe(
      'hsl(123.457, 50.556%, 10.123%)'
    );
  });
});

describe('hslaToString', () => {
  it('generates hsla strings', () => {
    const transparentBlack = new Color('#00000000');
    expect(hslaToString(transparentBlack.toHSLA())).toBe('hsla(0, 0%, 0%, 0)');
    expect(transparentBlack.toHSLAString()).toBe('hsla(0, 0%, 0%, 0)');

    const opaqueWhite = new Color('#ffffffff');
    expect(hslaToString(opaqueWhite.toHSLA())).toBe('hsla(0, 0%, 100%, 1)');
    expect(opaqueWhite.toHSLAString()).toBe('hsla(0, 0%, 100%, 1)');

    const gray = new Color('#80808080');
    expect(hslaToString(gray.toHSLA())).toBe('hsla(0, 0%, 50%, 0.502)');
    expect(gray.toHSLAString()).toBe('hsla(0, 0%, 50%, 0.502)');

    const red = new Color('#ff000080');
    expect(hslaToString(red.toHSLA())).toBe('hsla(0, 100%, 50%, 0.502)');
    expect(red.toHSLAString()).toBe('hsla(0, 100%, 50%, 0.502)');

    const green = new Color('#00ff007f');
    expect(hslaToString(green.toHSLA())).toBe('hsla(120, 100%, 50%, 0.498)');
    expect(green.toHSLAString()).toBe('hsla(120, 100%, 50%, 0.498)');

    const blue = new Color('#0000ff40');
    expect(hslaToString(blue.toHSLA())).toBe('hsla(240, 100%, 50%, 0.251)');
    expect(blue.toHSLAString()).toBe('hsla(240, 100%, 50%, 0.251)');

    const yellow = new Color('#ffff00c0');
    expect(hslaToString(yellow.toHSLA())).toBe('hsla(60, 100%, 50%, 0.753)');
    expect(yellow.toHSLAString()).toBe('hsla(60, 100%, 50%, 0.753)');

    const cyan = new Color('#00ffff20');
    expect(hslaToString(cyan.toHSLA())).toBe('hsla(180, 100%, 50%, 0.125)');
    expect(cyan.toHSLAString()).toBe('hsla(180, 100%, 50%, 0.125)');

    const magenta = new Color('#ff00ff99');
    expect(hslaToString(magenta.toHSLA())).toBe('hsla(300, 100%, 50%, 0.6)');
    expect(magenta.toHSLAString()).toBe('hsla(300, 100%, 50%, 0.6)');

    const custom = new Color('#abc123d6');
    expect(hslaToString(custom.toHSLA())).toBe('hsla(68, 69%, 45%, 0.839)');
    expect(custom.toHSLAString()).toBe('hsla(68, 69%, 45%, 0.839)');
  });

  it('rounds hsla components to three decimals', () => {
    expect(hslaToString({ h: 123.4567, s: 50.5555, l: 10.1234, a: 0.98765 })).toBe(
      'hsla(123.457, 50.556%, 10.123%, 0.988)'
    );
  });
});

describe('cmykToString', () => {
  it('generates cmyk strings', () => {
    const black = new Color('#000000');
    expect(cmykToString(black.toCMYK())).toBe('cmyk(0%, 0%, 0%, 100%)');
    expect(black.toCMYKString()).toBe('cmyk(0%, 0%, 0%, 100%)');

    const white = new Color('#ffffff');
    expect(cmykToString(white.toCMYK())).toBe('cmyk(0%, 0%, 0%, 0%)');
    expect(white.toCMYKString()).toBe('cmyk(0%, 0%, 0%, 0%)');

    const gray = new Color('#808080');
    expect(cmykToString(gray.toCMYK())).toBe('cmyk(0%, 0%, 0%, 50%)');
    expect(gray.toCMYKString()).toBe('cmyk(0%, 0%, 0%, 50%)');

    const red = new Color('#ff0000');
    expect(cmykToString(red.toCMYK())).toBe('cmyk(0%, 100%, 100%, 0%)');
    expect(red.toCMYKString()).toBe('cmyk(0%, 100%, 100%, 0%)');

    const green = new Color('#00ff00');
    expect(cmykToString(green.toCMYK())).toBe('cmyk(100%, 0%, 100%, 0%)');
    expect(green.toCMYKString()).toBe('cmyk(100%, 0%, 100%, 0%)');

    const blue = new Color('#0000ff');
    expect(cmykToString(blue.toCMYK())).toBe('cmyk(100%, 100%, 0%, 0%)');
    expect(blue.toCMYKString()).toBe('cmyk(100%, 100%, 0%, 0%)');

    const yellow = new Color('#ffff00');
    expect(cmykToString(yellow.toCMYK())).toBe('cmyk(0%, 0%, 100%, 0%)');
    expect(yellow.toCMYKString()).toBe('cmyk(0%, 0%, 100%, 0%)');

    const cyan = new Color('#00ffff');
    expect(cmykToString(cyan.toCMYK())).toBe('cmyk(100%, 0%, 0%, 0%)');
    expect(cyan.toCMYKString()).toBe('cmyk(100%, 0%, 0%, 0%)');

    const magenta = new Color('#ff00ff');
    expect(cmykToString(magenta.toCMYK())).toBe('cmyk(0%, 100%, 0%, 0%)');
    expect(magenta.toCMYKString()).toBe('cmyk(0%, 100%, 0%, 0%)');

    const custom = new Color('#abc123');
    expect(cmykToString(custom.toCMYK())).toBe('cmyk(11%, 0%, 82%, 24%)');
    expect(custom.toCMYKString()).toBe('cmyk(11%, 0%, 82%, 24%)');
  });

  it('rounds cmyk components to three decimals', () => {
    expect(cmykToString({ c: 12.3456, m: 0.9876, y: 54.321, k: 10.5555 })).toBe(
      'cmyk(12.346%, 0.988%, 54.321%, 10.556%)'
    );
  });
});

describe('lchToString', () => {
  it('generates lch strings', () => {
    const black = new Color('#000000');
    expect(lchToString(black.toLCH())).toBe('lch(0% 0 0)');
    expect(black.toLCHString()).toBe('lch(0% 0 0)');

    const white = new Color('#ffffff');
    expect(lchToString(white.toLCH())).toBe('lch(100% 0.012 296.813)');
    expect(white.toLCHString()).toBe('lch(100% 0.012 296.813)');

    const gray = new Color('#808080');
    expect(lchToString(gray.toLCH())).toBe('lch(53.585% 0.007 296.813)');
    expect(gray.toLCHString()).toBe('lch(53.585% 0.007 296.813)');

    const red = new Color('#ff0000');
    expect(lchToString(red.toLCH())).toBe('lch(53.233% 104.576 40)');
    expect(red.toLCHString()).toBe('lch(53.233% 104.576 40)');

    const green = new Color('#00ff00');
    expect(lchToString(green.toLCH())).toBe('lch(87.737% 119.779 136.016)');
    expect(green.toLCHString()).toBe('lch(87.737% 119.779 136.016)');

    const blue = new Color('#0000ff');
    expect(lchToString(blue.toLCH())).toBe('lch(32.303% 133.816 306.287)');
    expect(blue.toLCHString()).toBe('lch(32.303% 133.816 306.287)');

    const yellow = new Color('#ffff00');
    expect(lchToString(yellow.toLCH())).toBe('lch(97.138% 96.91 102.852)');
    expect(yellow.toLCHString()).toBe('lch(97.138% 96.91 102.852)');

    const cyan = new Color('#00ffff');
    expect(lchToString(cyan.toLCH())).toBe('lch(91.117% 50.115 196.386)');
    expect(cyan.toLCHString()).toBe('lch(91.117% 50.115 196.386)');

    const magenta = new Color('#ff00ff');
    expect(lchToString(magenta.toLCH())).toBe('lch(60.32% 115.567 328.233)');
    expect(magenta.toLCHString()).toBe('lch(60.32% 115.567 328.233)');

    const custom = new Color('#abc123');
    expect(lchToString(custom.toLCH())).toBe('lch(74.138% 73.934 110.756)');
    expect(custom.toLCHString()).toBe('lch(74.138% 73.934 110.756)');
  });

  it('rounds lch components to three decimals', () => {
    expect(lchToString({ l: 12.3456, c: 7.654321, h: 123.4567 })).toBe(
      'lch(12.346% 7.654 123.457)'
    );
  });
});

describe('oklchToString', () => {
  it('generates oklch strings', () => {
    const black = new Color('#000000');
    expect(oklchToString(black.toOKLCH())).toBe('oklch(0 0 0)');
    expect(black.toOKLCHString()).toBe('oklch(0 0 0)');

    const white = new Color('#ffffff');
    expect(oklchToString(white.toOKLCH())).toBe('oklch(1 0 89.876)');
    expect(white.toOKLCHString()).toBe('oklch(1 0 89.876)');

    const gray = new Color('#808080');
    expect(oklchToString(gray.toOKLCH())).toBe('oklch(0.599871 0 89.876)');
    expect(gray.toOKLCHString()).toBe('oklch(0.599871 0 89.876)');

    const red = new Color('#ff0000');
    expect(oklchToString(red.toOKLCH())).toBe('oklch(0.627955 0.257683 29.234)');
    expect(red.toOKLCHString()).toBe('oklch(0.627955 0.257683 29.234)');

    const green = new Color('#00ff00');
    expect(oklchToString(green.toOKLCH())).toBe('oklch(0.86644 0.294827 142.495)');
    expect(green.toOKLCHString()).toBe('oklch(0.86644 0.294827 142.495)');

    const blue = new Color('#0000ff');
    expect(oklchToString(blue.toOKLCH())).toBe('oklch(0.452014 0.313214 264.052)');
    expect(blue.toOKLCHString()).toBe('oklch(0.452014 0.313214 264.052)');

    const yellow = new Color('#ffff00');
    expect(oklchToString(yellow.toOKLCH())).toBe('oklch(0.967983 0.211006 109.769)');
    expect(yellow.toOKLCHString()).toBe('oklch(0.967983 0.211006 109.769)');

    const cyan = new Color('#00ffff');
    expect(oklchToString(cyan.toOKLCH())).toBe('oklch(0.905399 0.15455 194.769)');
    expect(cyan.toOKLCHString()).toBe('oklch(0.905399 0.15455 194.769)');

    const magenta = new Color('#ff00ff');
    expect(oklchToString(magenta.toOKLCH())).toBe('oklch(0.701674 0.322491 328.363)');
    expect(magenta.toOKLCHString()).toBe('oklch(0.701674 0.322491 328.363)');

    const custom = new Color('#abc123');
    expect(oklchToString(custom.toOKLCH())).toBe('oklch(0.768123 0.169623 117.914)');
    expect(custom.toOKLCHString()).toBe('oklch(0.768123 0.169623 117.914)');
  });

  it('rounds oklch components to six decimals', () => {
    expect(oklchToString({ l: 0.123456789, c: 0.987654321, h: 123.456789 })).toBe(
      'oklch(0.123457 0.987654 123.457)'
    );
  });
});

describe('getColorFormatType', () => {
  it('detects hex values', () => {
    expect(getColorFormatType('#000').formatType).toBe('HEX');
    expect(getColorFormatType('#000')).toEqual({
      formatType: 'HEX',
      value: '#000000',
    });

    expect(getColorFormatType('#abcdef')).toEqual({
      formatType: 'HEX',
      value: '#abcdef',
    });

    expect(getColorFormatType('#ABCDEF')).toEqual({
      formatType: 'HEX',
      value: '#abcdef',
    });

    expect(getColorFormatType('#11223344')).toEqual({
      formatType: 'HEX8',
      value: '#11223344',
    });
  });

  it('detects object formats', () => {
    expect(getColorFormatType({ r: 1, g: 2, b: 3 })).toEqual({
      formatType: 'RGB',
      value: { r: 1, g: 2, b: 3 },
    });

    expect(getColorFormatType({ r: 1, g: 2, b: 3, a: 0.4 })).toEqual({
      formatType: 'RGBA',
      value: { r: 1, g: 2, b: 3, a: 0.4 },
    });

    expect(getColorFormatType({ h: 10, s: 20, l: 30 })).toEqual({
      formatType: 'HSL',
      value: { h: 10, s: 20, l: 30 },
    });

    expect(getColorFormatType({ h: 10, s: 20, l: 30, a: 0.5 })).toEqual({
      formatType: 'HSLA',
      value: { h: 10, s: 20, l: 30, a: 0.5 },
    });

    expect(getColorFormatType({ h: 10, s: 20, v: 30 })).toEqual({
      formatType: 'HSV',
      value: { h: 10, s: 20, v: 30 },
    });

    expect(getColorFormatType({ h: 10, s: 20, v: 30, a: 0.5 })).toEqual({
      formatType: 'HSVA',
      value: { h: 10, s: 20, v: 30, a: 0.5 },
    });

    expect(getColorFormatType({ c: 1, m: 2, y: 3, k: 4 })).toEqual({
      formatType: 'CMYK',
      value: { c: 1, m: 2, y: 3, k: 4 },
    });

    expect(getColorFormatType({ l: 50, c: 20, h: 100 })).toEqual({
      formatType: 'LCH',
      value: { l: 50, c: 20, h: 100 },
    });

    expect(getColorFormatType({ l: 0.5, c: 0.2, h: 100 })).toEqual({
      formatType: 'OKLCH',
      value: { l: 0.5, c: 0.2, h: 100 },
    });
  });

  it('disambiguates lch and oklch based on expected ranges', () => {
    expect(getColorFormatType({ l: 0.5, c: 50, h: 120 })).toEqual({
      formatType: 'LCH',
      value: { l: 0.5, c: 50, h: 120 },
    });

    expect(getColorFormatType({ l: 0.5, c: 0.1, h: 120 })).toEqual({
      formatType: 'OKLCH',
      value: { l: 0.5, c: 0.1, h: 120 },
    });

    expect(getColorFormatType({ l: 1, c: 0.4, h: 90 })).toEqual({
      formatType: 'OKLCH',
      value: { l: 1, c: 0.4, h: 90 },
    });

    expect(getColorFormatType({ l: 1.0001, c: 0.4, h: 90 })).toEqual({
      formatType: 'LCH',
      value: { l: 1.0001, c: 0.4, h: 90 },
    });

    expect(getColorFormatType({ l: 99.999, c: 0.6, h: 270 })).toEqual({
      formatType: 'LCH',
      value: { l: 99.999, c: 0.6, h: 270 },
    });
  });

  it('throws on unknown formats', () => {
    expect(() => getColorFormatType('abc' as any)).toThrow(/unknown color format/);
    expect(() => getColorFormatType({} as any)).toThrow(/unknown color format/);
  });
});
