import {
  toCMYK,
  toHex,
  toHex8,
  toHSL,
  toHSLA,
  toHSV,
  toHSVA,
  toLCH,
  toOKLCH,
  toRGB,
  toRGBA,
} from '../conversions';
import type {
  ColorCMYK,
  ColorHex,
  ColorHSL,
  ColorHSLA,
  ColorHSV,
  ColorHSVA,
  ColorLCH,
  ColorOKLCH,
  ColorRGB,
  ColorRGBA,
} from '../formats';

describe('conversions', () => {
  const BASE_HEX: ColorHex = '#ff0000';
  const SHORT_HEX: ColorHex = '#f00';
  const BASE_HEX8: ColorHex = '#ff0000ff';
  const SEMI_HEX8: ColorHex = '#ff000080';
  const BASE_RGB: ColorRGB = { r: 255, g: 0, b: 0 };
  const BASE_RGBA: ColorRGBA = { r: 255, g: 0, b: 0, a: 1 };
  const SEMI_RGBA: ColorRGBA = { r: 255, g: 0, b: 0, a: 0.5 };
  const BASE_HSL: ColorHSL = { h: 0, s: 100, l: 50 };
  const SEMI_HSLA: ColorHSLA = { h: 0, s: 100, l: 50, a: 0.5 };
  const BASE_HSV: ColorHSV = { h: 0, s: 100, v: 100 };
  const SEMI_HSVA: ColorHSVA = { h: 0, s: 100, v: 100, a: 0.5 };
  const BASE_CMYK: ColorCMYK = { c: 0, m: 100, y: 100, k: 0 };
  const BASE_LCH: ColorLCH = { l: 53.233, c: 104.576, h: 40 };
  const BASE_OKLCH: ColorOKLCH = { l: 0.627955, c: 0.257683, h: 29.234 };

  describe('toRGB', () => {
    const expected = BASE_RGB;
    const cases: Array<[string, any]> = [
      ['hex', BASE_HEX],
      ['short hex', SHORT_HEX],
      ['hex8', BASE_HEX8],
      ['hex8 with alpha', SEMI_HEX8],
      ['rgb', BASE_RGB],
      ['rgba', SEMI_RGBA],
      ['hsl', BASE_HSL],
      ['hsla', SEMI_HSLA],
      ['hsv', BASE_HSV],
      ['hsva', SEMI_HSVA],
      ['cmyk', BASE_CMYK],
      ['lch', BASE_LCH],
      ['oklch', BASE_OKLCH],
    ];
    it.each(cases)('from %s', (_, input) => {
      expect(toRGB(input)).toEqual(expected);
    });

    it('wraps hue values >=360 in HSL', () => {
      expect(toRGB({ h: 360, s: 100, l: 50 })).toEqual(expected);
    });

    it('rejects negative hue values in HSL', () => {
      expect(() => toRGB({ h: -720, s: 100, l: 50 } as ColorHSL)).toThrow();
    });

    it('handles grayscale HSV', () => {
      expect(toRGB({ h: 200, s: 0, v: 50 })).toEqual({ r: 128, g: 128, b: 128 });
    });

    it('handles zero value HSV as black', () => {
      expect(toRGB({ h: 120, s: 100, v: 0 })).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('throws on invalid input', () => {
      expect(() => toRGB('#zzzzzz' as ColorHex)).toThrow();
    });
  });

  describe('toRGBA', () => {
    it('converts formats without alpha to opaque RGBA', () => {
      const inputs = [
        BASE_HEX,
        SHORT_HEX,
        BASE_RGB,
        BASE_HSL,
        BASE_HSV,
        BASE_CMYK,
        BASE_LCH,
        BASE_OKLCH,
      ];
      for (const input of inputs) {
        expect(toRGBA(input)).toEqual(BASE_RGBA);
      }
    });

    it('preserves alpha where available', () => {
      const cases: Array<[string, any, number]> = [
        ['hex8', SEMI_HEX8, 0.502],
        ['rgba', SEMI_RGBA, 0.5],
        ['hsla', SEMI_HSLA, 0.5],
        ['hsva', SEMI_HSVA, 0.5],
      ];
      for (const [, input, alpha] of cases) {
        const { a, ...rgb } = toRGBA(input);
        expect(rgb).toEqual(BASE_RGB);
        expect(a).toBeCloseTo(alpha, 3);
      }
    });

    it('throws on invalid RGBA', () => {
      expect(() => toRGBA({ r: 256, g: 0, b: 0, a: 1 } as ColorRGBA)).toThrow();
    });

    it('throws on invalid alpha value', () => {
      expect(() => toRGBA({ r: 0, g: 0, b: 0, a: 1.1 } as ColorRGBA)).toThrow();
    });
  });

  describe('toHex', () => {
    const expected = BASE_HEX;
    const cases: Array<[string, any]> = [
      ['hex', BASE_HEX],
      ['short hex', SHORT_HEX],
      ['hex8', BASE_HEX8],
      ['hex8 with alpha', SEMI_HEX8],
      ['rgb', BASE_RGB],
      ['rgba', SEMI_RGBA],
      ['hsl', BASE_HSL],
      ['hsla', SEMI_HSLA],
      ['hsv', BASE_HSV],
      ['hsva', SEMI_HSVA],
      ['cmyk', BASE_CMYK],
      ['lch', BASE_LCH],
      ['oklch', BASE_OKLCH],
    ];
    it.each(cases)('from %s', (_, input) => {
      expect(toHex(input)).toBe(expected);
    });

    it('normalizes uppercase hex input', () => {
      expect(toHex('#FF0000')).toBe(expected);
    });

    it('drops alpha when converting from RGBA', () => {
      expect(toHex({ r: 255, g: 0, b: 0, a: 0.3 })).toBe(expected);
    });
  });

  describe('toHex8', () => {
    const opaque = BASE_HEX8;
    const semi = SEMI_HEX8;
    const casesOpaque: Array<[string, any]> = [
      ['hex', BASE_HEX],
      ['short hex', SHORT_HEX],
      ['hex8 opaque', BASE_HEX8],
      ['rgb', BASE_RGB],
      ['hsl', BASE_HSL],
      ['hsv', BASE_HSV],
      ['cmyk', BASE_CMYK],
      ['lch', BASE_LCH],
      ['oklch', BASE_OKLCH],
    ];
    it.each(casesOpaque)('to opaque hex8 from %s', (_, input) => {
      expect(toHex8(input)).toBe(opaque);
    });

    const casesSemi: Array<[string, any]> = [
      ['hex8', SEMI_HEX8],
      ['rgba', SEMI_RGBA],
      ['hsla', SEMI_HSLA],
      ['hsva', SEMI_HSVA],
    ];
    it.each(casesSemi)('preserves alpha when converting %s', (_, input) => {
      expect(toHex8(input)).toBe(semi);
    });

    it('handles fully transparent alpha', () => {
      expect(toHex8({ r: 255, g: 0, b: 0, a: 0 })).toBe('#ff000000');
    });

    it('normalizes uppercase hex8 input', () => {
      expect(toHex8('#FF0000CC' as ColorHex)).toBe('#ff0000cc');
    });
  });

  describe('toHSL', () => {
    const expected = BASE_HSL;
    const cases: Array<[string, any]> = [
      ['hex', BASE_HEX],
      ['hex8', BASE_HEX8],
      ['rgb', BASE_RGB],
      ['rgba', SEMI_RGBA],
      ['hsl', BASE_HSL],
      ['hsla', SEMI_HSLA],
      ['hsv', BASE_HSV],
      ['hsva', SEMI_HSVA],
      ['cmyk', BASE_CMYK],
      ['lch', BASE_LCH],
      ['oklch', BASE_OKLCH],
    ];
    it.each(cases)('from %s', (_, input) => {
      expect(toHSL(input)).toEqual(expected);
    });

    it('converts grayscale correctly', () => {
      expect(toHSL('#808080')).toEqual({ h: 0, s: 0, l: 50 });
    });

    it('converts arbitrary colors', () => {
      expect(toHSL('#123456')).toEqual({ h: 210, s: 65, l: 20 });
    });
  });

  describe('toHSLA', () => {
    const expectedOpaque = { ...BASE_HSL, a: 1 };
    const opaqueInputs = [
      BASE_HEX,
      BASE_HEX8,
      BASE_RGB,
      BASE_HSL,
      BASE_HSV,
      BASE_CMYK,
      BASE_LCH,
      BASE_OKLCH,
    ];
    for (const input of opaqueInputs) {
      it(`from ${
        typeof input === 'string' ? input : JSON.stringify(input)
      } produces opaque HSLA`, () => {
        expect(toHSLA(input)).toEqual(expectedOpaque);
      });
    }
    const semiInputs: Array<[any, number]> = [
      [SEMI_HEX8, 0.502],
      [SEMI_RGBA, 0.5],
      [SEMI_HSLA, 0.5],
      [SEMI_HSVA, 0.5],
    ];
    for (const [input, alpha] of semiInputs) {
      it(`from ${
        typeof input === 'string' ? input : JSON.stringify(input)
      } preserves alpha`, () => {
        const { a, h, s, l } = toHSLA(input);
        expect({ h, s, l }).toEqual(BASE_HSL);
        expect(a).toBeCloseTo(alpha, 3);
      });
    }

    it('throws on invalid alpha', () => {
      expect(() => toHSLA({ h: 0, s: 100, l: 50, a: 2 })).toThrow();
    });
  });

  describe('toHSV', () => {
    const expected = BASE_HSV;
    const cases: Array<[string, any]> = [
      ['hex', BASE_HEX],
      ['hex8', BASE_HEX8],
      ['rgb', BASE_RGB],
      ['rgba', SEMI_RGBA],
      ['hsl', BASE_HSL],
      ['hsla', SEMI_HSLA],
      ['hsv', BASE_HSV],
      ['hsva', SEMI_HSVA],
      ['cmyk', BASE_CMYK],
      ['lch', BASE_LCH],
      ['oklch', BASE_OKLCH],
    ];
    it.each(cases)('from %s', (_, input) => {
      expect(toHSV(input)).toEqual(expected);
    });

    it('converts arbitrary colors', () => {
      expect(toHSV('#123456')).toEqual({ h: 210, s: 79, v: 34 });
    });

    it('converts black correctly', () => {
      expect(toHSV('#000000')).toEqual({ h: 0, s: 0, v: 0 });
    });
  });

  describe('toHSVA', () => {
    const expectedOpaque = { ...BASE_HSV, a: 1 };
    const opaqueInputs = [
      BASE_HEX,
      BASE_HEX8,
      BASE_RGB,
      BASE_HSL,
      BASE_HSV,
      BASE_CMYK,
      BASE_LCH,
      BASE_OKLCH,
    ];
    for (const input of opaqueInputs) {
      it(`from ${
        typeof input === 'string' ? input : JSON.stringify(input)
      } produces opaque HSVA`, () => {
        expect(toHSVA(input)).toEqual(expectedOpaque);
      });
    }
    const semiInputs: Array<[any, number]> = [
      [SEMI_HEX8, 0.502],
      [SEMI_RGBA, 0.5],
      [SEMI_HSLA, 0.5],
      [SEMI_HSVA, 0.5],
    ];
    for (const [input, alpha] of semiInputs) {
      it(`from ${
        typeof input === 'string' ? input : JSON.stringify(input)
      } preserves alpha`, () => {
        const { a, h, s, v } = toHSVA(input);
        expect({ h, s, v }).toEqual(BASE_HSV);
        expect(a).toBeCloseTo(alpha, 3);
      });
    }

    it('throws on invalid alpha', () => {
      expect(() => toHSVA({ h: 0, s: 100, v: 100, a: 2 })).toThrow();
    });
  });

  describe('toCMYK', () => {
    const expected = BASE_CMYK;
    const cases: Array<[string, any]> = [
      ['hex', BASE_HEX],
      ['hex8', BASE_HEX8],
      ['rgb', BASE_RGB],
      ['rgba', SEMI_RGBA],
      ['hsl', BASE_HSL],
      ['hsla', SEMI_HSLA],
      ['hsv', BASE_HSV],
      ['hsva', SEMI_HSVA],
      ['cmyk', BASE_CMYK],
      ['lch', BASE_LCH],
      ['oklch', BASE_OKLCH],
    ];
    it.each(cases)('from %s', (_, input) => {
      expect(toCMYK(input)).toEqual(expected);
    });

    it('converts black correctly', () => {
      expect(toCMYK('#000000')).toEqual({ c: 0, m: 0, y: 0, k: 100 });
    });

    it('converts white correctly', () => {
      expect(toCMYK('#ffffff')).toEqual({ c: 0, m: 0, y: 0, k: 0 });
    });

    it('converts arbitrary colors', () => {
      expect(toCMYK('#123456')).toEqual({ c: 79, m: 40, y: 0, k: 66 });
    });
  });

  describe('toLCH', () => {
    const expected = BASE_LCH;
    const cases: Array<[string, any]> = [
      ['hex', BASE_HEX],
      ['hex8', BASE_HEX8],
      ['rgb', BASE_RGB],
      ['rgba', SEMI_RGBA],
      ['hsl', BASE_HSL],
      ['hsla', SEMI_HSLA],
      ['hsv', BASE_HSV],
      ['hsva', SEMI_HSVA],
      ['cmyk', BASE_CMYK],
      ['lch', BASE_LCH],
      ['oklch', BASE_OKLCH],
    ];
    it.each(cases)('from %s', (_, input) => {
      const lch = toLCH(input);
      expect(lch.l).toBeCloseTo(expected.l, 3);
      expect(lch.c).toBeCloseTo(expected.c, 3);
      expect(lch.h).toBeCloseTo(expected.h, 3);
    });

    it('handles zero chroma to produce grayscale', () => {
      const lch = toLCH('#808080');
      expect(lch.c).toBeCloseTo(0, 1);
    });

    it('handles black correctly', () => {
      const lch = toLCH('#000000');
      expect(lch.l).toBeCloseTo(0, 3);
      expect(lch.c).toBeCloseTo(0, 3);
    });
  });

  describe('toOKLCH', () => {
    const expected = BASE_OKLCH;
    const cases: Array<[string, any]> = [
      ['hex', BASE_HEX],
      ['hex8', BASE_HEX8],
      ['rgb', BASE_RGB],
      ['rgba', SEMI_RGBA],
      ['hsl', BASE_HSL],
      ['hsla', SEMI_HSLA],
      ['hsv', BASE_HSV],
      ['hsva', SEMI_HSVA],
      ['cmyk', BASE_CMYK],
      ['lch', BASE_LCH],
      ['oklch', BASE_OKLCH],
    ];
    it.each(cases)('from %s', (_, input) => {
      const oklch = toOKLCH(input);
      expect(oklch.l).toBeCloseTo(expected.l, 6);
      expect(oklch.c).toBeCloseTo(expected.c, 6);
      expect(oklch.h).toBeCloseTo(expected.h, 3);
    });

    it('handles white correctly', () => {
      const white = toOKLCH('#ffffff');
      expect(white.l).toBeCloseTo(1, 6);
      expect(white.c).toBeCloseTo(0, 6);
    });

    it('handles black correctly', () => {
      const black = toOKLCH('#000000');
      expect(black.l).toBeCloseTo(0, 6);
      expect(black.c).toBeCloseTo(0, 6);
    });
  });

  describe('roundtrip stability', () => {
    it('keeps colors within 2 RGB units after hex \u2194 HSL conversions', () => {
      const start1: ColorHex = '#123456';
      let color1: ColorHex = start1;
      for (let i = 0; i < 10; i++) {
        color1 = toHex(toHSL(color1));
      }
      const rgb1 = toRGB(color1);
      const rgbStart1 = toRGB(start1);
      expect(Math.abs(rgb1.r - rgbStart1.r)).toBeLessThanOrEqual(2);
      expect(Math.abs(rgb1.g - rgbStart1.g)).toBeLessThanOrEqual(2);
      expect(Math.abs(rgb1.b - rgbStart1.b)).toBeLessThanOrEqual(2);

      const start2: ColorHex = '#abcdef';
      let color2: ColorHex = start2;
      for (let i = 0; i < 10; i++) {
        color2 = toHex(toHSL(color2));
      }
      const rgb2 = toRGB(color2);
      const rgbStart2 = toRGB(start2);
      expect(Math.abs(rgb2.r - rgbStart2.r)).toBeLessThanOrEqual(2);
      expect(Math.abs(rgb2.g - rgbStart2.g)).toBeLessThanOrEqual(2);
      expect(Math.abs(rgb2.b - rgbStart2.b)).toBeLessThanOrEqual(2);
    });

    it('keeps colors within 2 RGB units after hex \u2192 HSV \u2192 RGB conversions', () => {
      const start1: ColorHex = '#123456';
      let color1: ColorHex = start1;
      for (let i = 0; i < 10; i++) {
        color1 = toHex(toRGB(toHSV(color1)));
      }
      const rgb1 = toRGB(color1);
      const rgbStart1 = toRGB(start1);
      expect(Math.abs(rgb1.r - rgbStart1.r)).toBeLessThanOrEqual(2);
      expect(Math.abs(rgb1.g - rgbStart1.g)).toBeLessThanOrEqual(2);
      expect(Math.abs(rgb1.b - rgbStart1.b)).toBeLessThanOrEqual(2);

      const start2: ColorHex = '#abcdef';
      let color2: ColorHex = start2;
      for (let i = 0; i < 10; i++) {
        color2 = toHex(toRGB(toHSV(color2)));
      }
      const rgb2 = toRGB(color2);
      const rgbStart2 = toRGB(start2);
      expect(Math.abs(rgb2.r - rgbStart2.r)).toBeLessThanOrEqual(2);
      expect(Math.abs(rgb2.g - rgbStart2.g)).toBeLessThanOrEqual(2);
      expect(Math.abs(rgb2.b - rgbStart2.b)).toBeLessThanOrEqual(2);
    });

    it('maintains hex through hex \u2194 OKLCH conversions', () => {
      const start1: ColorHex = '#123456';
      let color1: ColorHex = start1;
      for (let i = 0; i < 10; i++) {
        color1 = toHex(toOKLCH(color1));
      }
      expect(color1).toBe(start1);

      const start2: ColorHex = '#abcdef';
      let color2: ColorHex = start2;
      for (let i = 0; i < 10; i++) {
        color2 = toHex(toOKLCH(color2));
      }
      expect(color2).toBe(start2);
    });

    it('keeps colors within 3 RGB units through a circular chain', () => {
      const start1: ColorHex = '#123456';
      let color1: ColorHex = start1;
      for (let i = 0; i < 10; i++) {
        color1 = toHex(toRGB(toHSV(toRGB(toHSL(color1)))));
      }
      const rgb1 = toRGB(color1);
      const rgbStart1 = toRGB(start1);
      expect(Math.abs(rgb1.r - rgbStart1.r)).toBeLessThanOrEqual(2);
      expect(Math.abs(rgb1.g - rgbStart1.g)).toBeLessThanOrEqual(2);
      expect(Math.abs(rgb1.b - rgbStart1.b)).toBeLessThanOrEqual(2);

      const start2: ColorHex = '#abcdef';
      let color2: ColorHex = start2;
      for (let i = 0; i < 10; i++) {
        color2 = toHex(toRGB(toHSV(toRGB(toHSL(color2)))));
      }
      const rgb2 = toRGB(color2);
      const rgbStart2 = toRGB(start2);
      expect(Math.abs(rgb2.r - rgbStart2.r)).toBeLessThanOrEqual(3);
      expect(Math.abs(rgb2.g - rgbStart2.g)).toBeLessThanOrEqual(3);
      expect(Math.abs(rgb2.b - rgbStart2.b)).toBeLessThanOrEqual(3);
    });
  });
});
