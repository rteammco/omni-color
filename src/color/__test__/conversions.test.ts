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

    it('handles grayscale HSV', () => {
      expect(toRGB({ h: 200, s: 0, v: 50 })).toEqual({ r: 128, g: 128, b: 128 });
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
  });
});
