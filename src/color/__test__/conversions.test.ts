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
import type { ColorHex, ColorHSL, ColorRGBA } from '../formats';

describe('conversions', () => {
  describe('toRGB', () => {
    it('converts all types to RGB', () => {
      expect(toRGB('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(toRGB('#f00')).toEqual({ r: 255, g: 0, b: 0 });
      expect(toRGB('#ff0000ff')).toEqual({ r: 255, g: 0, b: 0 });
      expect(toRGB('#ff000080')).toEqual({ r: 255, g: 0, b: 0 });
      expect(toRGB('#f008')).toEqual({ r: 255, g: 0, b: 0 });
      expect(toRGB({ r: 255, g: 0, b: 0 })).toEqual({ r: 255, g: 0, b: 0 });
      expect(toRGB({ r: 255, g: 0, b: 0, a: 0.5 })).toEqual({ r: 255, g: 0, b: 0 });
      expect(toRGB({ h: 0, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0 });
      expect(toRGB({ h: 0, s: 100, l: 50, a: 0.5 })).toEqual({ r: 255, g: 0, b: 0 });
      expect(toRGB({ h: 0, s: 100, v: 100 })).toEqual({ r: 255, g: 0, b: 0 });
      expect(toRGB({ h: 0, s: 100, v: 100, a: 0.5 })).toEqual({ r: 255, g: 0, b: 0 });
      expect(toRGB({ c: 0, m: 100, y: 100, k: 0 })).toEqual({ r: 255, g: 0, b: 0 });
      expect(toRGB({ l: 53.233, c: 104.576, h: 40 })).toEqual({ r: 255, g: 0, b: 0 });
      expect(toRGB({ l: 0.627955, c: 0.257683, h: 29.234 })).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('wraps hue values >=360 in HSL', () => {
      expect(toRGB({ h: 360, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0 });
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
      expect(toRGBA('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(toRGBA('#f00')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(toRGBA({ r: 255, g: 0, b: 0 })).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(toRGBA({ h: 0, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(toRGBA({ h: 0, s: 100, v: 100 })).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(toRGBA({ c: 0, m: 100, y: 100, k: 0 })).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(toRGBA({ l: 53.233, c: 104.576, h: 40 })).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(toRGBA({ l: 0.627955, c: 0.257683, h: 29.234 })).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    });

    it('preserves alpha where available', () => {
      const fromHex8 = toRGBA('#ff000080');
      expect(fromHex8.r).toBe(255);
      expect(fromHex8.g).toBe(0);
      expect(fromHex8.b).toBe(0);
      expect(fromHex8.a).toBeCloseTo(0.502, 3);

      const fromShortHex8 = toRGBA('#f008');
      expect(fromShortHex8.r).toBe(255);
      expect(fromShortHex8.g).toBe(0);
      expect(fromShortHex8.b).toBe(0);
      expect(fromShortHex8.a).toBeCloseTo(0.533, 3);

      const fromRGBA = toRGBA({ r: 255, g: 0, b: 0, a: 0.5 });
      expect(fromRGBA.r).toBe(255);
      expect(fromRGBA.g).toBe(0);
      expect(fromRGBA.b).toBe(0);
      expect(fromRGBA.a).toBeCloseTo(0.5, 3);

      const fromHSLA = toRGBA({ h: 0, s: 100, l: 50, a: 0.5 });
      expect(fromHSLA.r).toBe(255);
      expect(fromHSLA.g).toBe(0);
      expect(fromHSLA.b).toBe(0);
      expect(fromHSLA.a).toBeCloseTo(0.5, 3);

      const fromHSVA = toRGBA({ h: 0, s: 100, v: 100, a: 0.5 });
      expect(fromHSVA.r).toBe(255);
      expect(fromHSVA.g).toBe(0);
      expect(fromHSVA.b).toBe(0);
      expect(fromHSVA.a).toBeCloseTo(0.5, 3);
    });

    it('#RGBA converts to hex8 and back', () => {
      const roundTrip = toHex8(toRGBA('#f008'));
      expect(roundTrip).toBe('#ff000088');
    });

    it('throws on invalid RGBA', () => {
      expect(() => toRGBA({ r: 256, g: 0, b: 0, a: 1 } as ColorRGBA)).toThrow();
    });

    it('throws on invalid alpha value', () => {
      expect(() => toRGBA({ r: 0, g: 0, b: 0, a: 1.1 } as ColorRGBA)).toThrow();
    });
  });

  describe('toHex', () => {
    it('converts all inputs to hex', () => {
      expect(toHex('#ff0000')).toBe('#ff0000');
      expect(toHex('#f00')).toBe('#ff0000');
      expect(toHex('#ff0000ff')).toBe('#ff0000');
      expect(toHex('#ff000080')).toBe('#ff0000');
      expect(toHex('#f008')).toBe('#ff0000');
      expect(toHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000');
      expect(toHex({ r: 255, g: 0, b: 0, a: 0.5 })).toBe('#ff0000');
      expect(toHex({ h: 0, s: 100, l: 50 })).toBe('#ff0000');
      expect(toHex({ h: 0, s: 100, l: 50, a: 0.5 })).toBe('#ff0000');
      expect(toHex({ h: 0, s: 100, v: 100 })).toBe('#ff0000');
      expect(toHex({ h: 0, s: 100, v: 100, a: 0.5 })).toBe('#ff0000');
      expect(toHex({ c: 0, m: 100, y: 100, k: 0 })).toBe('#ff0000');
      expect(toHex({ l: 53.233, c: 104.576, h: 40 })).toBe('#ff0000');
      expect(toHex({ l: 0.627955, c: 0.257683, h: 29.234 })).toBe('#ff0000');
    });

    it('normalizes uppercase hex input', () => {
      expect(toHex('#FF0000')).toBe('#ff0000');
    });

    it('drops alpha when converting from RGBA', () => {
      expect(toHex({ r: 255, g: 0, b: 0, a: 0.3 })).toBe('#ff0000');
    });
  });

  describe('toHex8', () => {
    it('converts formats without alpha to opaque hex8', () => {
      expect(toHex8('#ff0000')).toBe('#ff0000ff');
      expect(toHex8('#f00')).toBe('#ff0000ff');
      expect(toHex8('#ff0000ff')).toBe('#ff0000ff');
      expect(toHex8({ r: 255, g: 0, b: 0 })).toBe('#ff0000ff');
      expect(toHex8({ h: 0, s: 100, l: 50 })).toBe('#ff0000ff');
      expect(toHex8({ h: 0, s: 100, v: 100 })).toBe('#ff0000ff');
      expect(toHex8({ c: 0, m: 100, y: 100, k: 0 })).toBe('#ff0000ff');
      expect(toHex8({ l: 53.233, c: 104.576, h: 40 })).toBe('#ff0000ff');
      expect(toHex8({ l: 0.627955, c: 0.257683, h: 29.234 })).toBe('#ff0000ff');
    });

    it('preserves alpha when converting', () => {
      expect(toHex8('#ff000080')).toBe('#ff000080');
      expect(toHex8('#f008')).toBe('#ff000088');
      expect(toHex8({ r: 255, g: 0, b: 0, a: 0.5 })).toBe('#ff000080');
      expect(toHex8({ h: 0, s: 100, l: 50, a: 0.5 })).toBe('#ff000080');
      expect(toHex8({ h: 0, s: 100, v: 100, a: 0.5 })).toBe('#ff000080');
    });

    it('handles fully transparent alpha', () => {
      expect(toHex8({ r: 255, g: 0, b: 0, a: 0 })).toBe('#ff000000');
    });

    it('normalizes uppercase hex8 input', () => {
      expect(toHex8('#FF0000CC' as ColorHex)).toBe('#ff0000cc');
    });
  });

  describe('toHSL', () => {
    it('converts all inputs to HSL', () => {
      expect(toHSL('#ff0000')).toEqual({ h: 0, s: 100, l: 50 });
      expect(toHSL('#ff0000ff')).toEqual({ h: 0, s: 100, l: 50 });
      expect(toHSL({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 });
      expect(toHSL({ r: 255, g: 0, b: 0, a: 0.5 })).toEqual({ h: 0, s: 100, l: 50 });
      expect(toHSL({ h: 0, s: 100, l: 50 })).toEqual({ h: 0, s: 100, l: 50 });
      expect(toHSL({ h: 0, s: 100, l: 50, a: 0.5 })).toEqual({ h: 0, s: 100, l: 50 });
      expect(toHSL({ h: 0, s: 100, v: 100 })).toEqual({ h: 0, s: 100, l: 50 });
      expect(toHSL({ h: 0, s: 100, v: 100, a: 0.5 })).toEqual({ h: 0, s: 100, l: 50 });
      expect(toHSL({ c: 0, m: 100, y: 100, k: 0 })).toEqual({ h: 0, s: 100, l: 50 });
      expect(toHSL({ l: 53.233, c: 104.576, h: 40 })).toEqual({ h: 0, s: 100, l: 50 });
      expect(toHSL({ l: 0.627955, c: 0.257683, h: 29.234 })).toEqual({ h: 0, s: 100, l: 50 });
    });

    it('converts grayscale correctly', () => {
      expect(toHSL('#808080')).toEqual({ h: 0, s: 0, l: 50 });
    });

    it('converts arbitrary colors', () => {
      expect(toHSL('#123456')).toEqual({ h: 210, s: 65, l: 20 });
    });
  });

  describe('toHSLA', () => {
    it('converts formats without alpha to opaque HSLA', () => {
      expect(toHSLA('#ff0000')).toEqual({ h: 0, s: 100, l: 50, a: 1 });
      expect(toHSLA('#ff0000ff')).toEqual({ h: 0, s: 100, l: 50, a: 1 });
      expect(toHSLA({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50, a: 1 });
      expect(toHSLA({ h: 0, s: 100, l: 50 })).toEqual({ h: 0, s: 100, l: 50, a: 1 });
      expect(toHSLA({ h: 0, s: 100, v: 100 })).toEqual({ h: 0, s: 100, l: 50, a: 1 });
      expect(toHSLA({ c: 0, m: 100, y: 100, k: 0 })).toEqual({ h: 0, s: 100, l: 50, a: 1 });
      expect(toHSLA({ l: 53.233, c: 104.576, h: 40 })).toEqual({ h: 0, s: 100, l: 50, a: 1 });
      expect(toHSLA({ l: 0.627955, c: 0.257683, h: 29.234 })).toEqual({
        h: 0,
        s: 100,
        l: 50,
        a: 1,
      });
    });

    it('preserves alpha where available', () => {
      const fromHex8 = toHSLA('#ff000080');
      expect(fromHex8.h).toBe(0);
      expect(fromHex8.s).toBe(100);
      expect(fromHex8.l).toBe(50);
      expect(fromHex8.a).toBeCloseTo(0.502, 3);

      const fromRGBA = toHSLA({ r: 255, g: 0, b: 0, a: 0.5 });
      expect(fromRGBA.h).toBe(0);
      expect(fromRGBA.s).toBe(100);
      expect(fromRGBA.l).toBe(50);
      expect(fromRGBA.a).toBeCloseTo(0.5, 3);

      const fromHSLA = toHSLA({ h: 0, s: 100, l: 50, a: 0.5 });
      expect(fromHSLA.h).toBe(0);
      expect(fromHSLA.s).toBe(100);
      expect(fromHSLA.l).toBe(50);
      expect(fromHSLA.a).toBeCloseTo(0.5, 3);

      const fromHSVA = toHSLA({ h: 0, s: 100, v: 100, a: 0.5 });
      expect(fromHSVA.h).toBe(0);
      expect(fromHSVA.s).toBe(100);
      expect(fromHSVA.l).toBe(50);
      expect(fromHSVA.a).toBeCloseTo(0.5, 3);
    });

    it('throws on invalid alpha', () => {
      expect(() => toHSLA({ h: 0, s: 100, l: 50, a: 2 })).toThrow();
    });
  });

  describe('toHSV', () => {
    it('converts all inputs to HSV', () => {
      expect(toHSV('#ff0000')).toEqual({ h: 0, s: 100, v: 100 });
      expect(toHSV('#ff0000ff')).toEqual({ h: 0, s: 100, v: 100 });
      expect(toHSV({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, v: 100 });
      expect(toHSV({ r: 255, g: 0, b: 0, a: 0.5 })).toEqual({ h: 0, s: 100, v: 100 });
      expect(toHSV({ h: 0, s: 100, l: 50 })).toEqual({ h: 0, s: 100, v: 100 });
      expect(toHSV({ h: 0, s: 100, l: 50, a: 0.5 })).toEqual({ h: 0, s: 100, v: 100 });
      expect(toHSV({ h: 0, s: 100, v: 100 })).toEqual({ h: 0, s: 100, v: 100 });
      expect(toHSV({ h: 0, s: 100, v: 100, a: 0.5 })).toEqual({ h: 0, s: 100, v: 100 });
      expect(toHSV({ c: 0, m: 100, y: 100, k: 0 })).toEqual({ h: 0, s: 100, v: 100 });
      expect(toHSV({ l: 53.233, c: 104.576, h: 40 })).toEqual({ h: 0, s: 100, v: 100 });
      expect(toHSV({ l: 0.627955, c: 0.257683, h: 29.234 })).toEqual({ h: 0, s: 100, v: 100 });
    });

    it('converts arbitrary colors', () => {
      expect(toHSV('#123456')).toEqual({ h: 210, s: 79, v: 34 });
    });

    it('converts black correctly', () => {
      expect(toHSV('#000000')).toEqual({ h: 0, s: 0, v: 0 });
    });
  });

  describe('toHSVA', () => {
    it('converts formats without alpha to opaque HSVA', () => {
      expect(toHSVA('#ff0000')).toEqual({ h: 0, s: 100, v: 100, a: 1 });
      expect(toHSVA('#ff0000ff')).toEqual({ h: 0, s: 100, v: 100, a: 1 });
      expect(toHSVA({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, v: 100, a: 1 });
      expect(toHSVA({ h: 0, s: 100, l: 50 })).toEqual({ h: 0, s: 100, v: 100, a: 1 });
      expect(toHSVA({ h: 0, s: 100, v: 100 })).toEqual({ h: 0, s: 100, v: 100, a: 1 });
      expect(toHSVA({ c: 0, m: 100, y: 100, k: 0 })).toEqual({ h: 0, s: 100, v: 100, a: 1 });
      expect(toHSVA({ l: 53.233, c: 104.576, h: 40 })).toEqual({ h: 0, s: 100, v: 100, a: 1 });
      expect(toHSVA({ l: 0.627955, c: 0.257683, h: 29.234 })).toEqual({
        h: 0,
        s: 100,
        v: 100,
        a: 1,
      });
    });

    it('preserves alpha where available', () => {
      const fromHex8 = toHSVA('#ff000080');
      expect(fromHex8.h).toBe(0);
      expect(fromHex8.s).toBe(100);
      expect(fromHex8.v).toBe(100);
      expect(fromHex8.a).toBeCloseTo(0.502, 3);

      const fromRGBA = toHSVA({ r: 255, g: 0, b: 0, a: 0.5 });
      expect(fromRGBA.h).toBe(0);
      expect(fromRGBA.s).toBe(100);
      expect(fromRGBA.v).toBe(100);
      expect(fromRGBA.a).toBeCloseTo(0.5, 3);

      const fromHSLA = toHSVA({ h: 0, s: 100, l: 50, a: 0.5 });
      expect(fromHSLA.h).toBe(0);
      expect(fromHSLA.s).toBe(100);
      expect(fromHSLA.v).toBe(100);
      expect(fromHSLA.a).toBeCloseTo(0.5, 3);

      const fromHSVA = toHSVA({ h: 0, s: 100, v: 100, a: 0.5 });
      expect(fromHSVA.h).toBe(0);
      expect(fromHSVA.s).toBe(100);
      expect(fromHSVA.v).toBe(100);
      expect(fromHSVA.a).toBeCloseTo(0.5, 3);
    });

    it('throws on invalid alpha', () => {
      expect(() => toHSVA({ h: 0, s: 100, v: 100, a: 2 })).toThrow();
    });
  });

  describe('toCMYK', () => {
    it('converts all inputs to CMYK', () => {
      expect(toCMYK('#ff0000')).toEqual({ c: 0, m: 100, y: 100, k: 0 });
      expect(toCMYK('#ff0000ff')).toEqual({ c: 0, m: 100, y: 100, k: 0 });
      expect(toCMYK({ r: 255, g: 0, b: 0 })).toEqual({ c: 0, m: 100, y: 100, k: 0 });
      expect(toCMYK({ r: 255, g: 0, b: 0, a: 0.5 })).toEqual({ c: 0, m: 100, y: 100, k: 0 });
      expect(toCMYK({ h: 0, s: 100, l: 50 })).toEqual({ c: 0, m: 100, y: 100, k: 0 });
      expect(toCMYK({ h: 0, s: 100, l: 50, a: 0.5 })).toEqual({ c: 0, m: 100, y: 100, k: 0 });
      expect(toCMYK({ h: 0, s: 100, v: 100 })).toEqual({ c: 0, m: 100, y: 100, k: 0 });
      expect(toCMYK({ h: 0, s: 100, v: 100, a: 0.5 })).toEqual({ c: 0, m: 100, y: 100, k: 0 });
      expect(toCMYK({ c: 0, m: 100, y: 100, k: 0 })).toEqual({ c: 0, m: 100, y: 100, k: 0 });
      expect(toCMYK({ l: 53.233, c: 104.576, h: 40 })).toEqual({ c: 0, m: 100, y: 100, k: 0 });
      expect(toCMYK({ l: 0.627955, c: 0.257683, h: 29.234 })).toEqual({
        c: 0,
        m: 100,
        y: 100,
        k: 0,
      });
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
    it('converts all inputs to LCH', () => {
      const fromHex = toLCH('#ff0000');
      expect(fromHex.l).toBeCloseTo(53.233, 3);
      expect(fromHex.c).toBeCloseTo(104.576, 3);
      expect(fromHex.h).toBeCloseTo(40, 3);

      const fromHex8 = toLCH('#ff0000ff');
      expect(fromHex8.l).toBeCloseTo(53.233, 3);
      expect(fromHex8.c).toBeCloseTo(104.576, 3);
      expect(fromHex8.h).toBeCloseTo(40, 3);

      const fromRGB = toLCH({ r: 255, g: 0, b: 0 });
      expect(fromRGB.l).toBeCloseTo(53.233, 3);
      expect(fromRGB.c).toBeCloseTo(104.576, 3);
      expect(fromRGB.h).toBeCloseTo(40, 3);

      const fromRGBA = toLCH({ r: 255, g: 0, b: 0, a: 0.5 });
      expect(fromRGBA.l).toBeCloseTo(53.233, 3);
      expect(fromRGBA.c).toBeCloseTo(104.576, 3);
      expect(fromRGBA.h).toBeCloseTo(40, 3);

      const fromHSL = toLCH({ h: 0, s: 100, l: 50 });
      expect(fromHSL.l).toBeCloseTo(53.233, 3);
      expect(fromHSL.c).toBeCloseTo(104.576, 3);
      expect(fromHSL.h).toBeCloseTo(40, 3);

      const fromHSLA = toLCH({ h: 0, s: 100, l: 50, a: 0.5 });
      expect(fromHSLA.l).toBeCloseTo(53.233, 3);
      expect(fromHSLA.c).toBeCloseTo(104.576, 3);
      expect(fromHSLA.h).toBeCloseTo(40, 3);

      const fromHSV = toLCH({ h: 0, s: 100, v: 100 });
      expect(fromHSV.l).toBeCloseTo(53.233, 3);
      expect(fromHSV.c).toBeCloseTo(104.576, 3);
      expect(fromHSV.h).toBeCloseTo(40, 3);

      const fromHSVA = toLCH({ h: 0, s: 100, v: 100, a: 0.5 });
      expect(fromHSVA.l).toBeCloseTo(53.233, 3);
      expect(fromHSVA.c).toBeCloseTo(104.576, 3);
      expect(fromHSVA.h).toBeCloseTo(40, 3);

      const fromCMYK = toLCH({ c: 0, m: 100, y: 100, k: 0 });
      expect(fromCMYK.l).toBeCloseTo(53.233, 3);
      expect(fromCMYK.c).toBeCloseTo(104.576, 3);
      expect(fromCMYK.h).toBeCloseTo(40, 3);

      const fromLCH = toLCH({ l: 53.233, c: 104.576, h: 40 });
      expect(fromLCH.l).toBeCloseTo(53.233, 3);
      expect(fromLCH.c).toBeCloseTo(104.576, 3);
      expect(fromLCH.h).toBeCloseTo(40, 3);

      const fromOKLCH = toLCH({ l: 0.627955, c: 0.257683, h: 29.234 });
      expect(fromOKLCH.l).toBeCloseTo(53.233, 3);
      expect(fromOKLCH.c).toBeCloseTo(104.576, 3);
      expect(fromOKLCH.h).toBeCloseTo(40, 3);
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
    it('converts all inputs to OKLCH', () => {
      const fromHex = toOKLCH('#ff0000');
      expect(fromHex.l).toBeCloseTo(0.627955, 6);
      expect(fromHex.c).toBeCloseTo(0.257683, 6);
      expect(fromHex.h).toBeCloseTo(29.234, 3);

      const fromHex8 = toOKLCH('#ff0000ff');
      expect(fromHex8.l).toBeCloseTo(0.627955, 6);
      expect(fromHex8.c).toBeCloseTo(0.257683, 6);
      expect(fromHex8.h).toBeCloseTo(29.234, 3);

      const fromRGB = toOKLCH({ r: 255, g: 0, b: 0 });
      expect(fromRGB.l).toBeCloseTo(0.627955, 6);
      expect(fromRGB.c).toBeCloseTo(0.257683, 6);
      expect(fromRGB.h).toBeCloseTo(29.234, 3);

      const fromRGBA = toOKLCH({ r: 255, g: 0, b: 0, a: 0.5 });
      expect(fromRGBA.l).toBeCloseTo(0.627955, 6);
      expect(fromRGBA.c).toBeCloseTo(0.257683, 6);
      expect(fromRGBA.h).toBeCloseTo(29.234, 3);

      const fromHSL = toOKLCH({ h: 0, s: 100, l: 50 });
      expect(fromHSL.l).toBeCloseTo(0.627955, 6);
      expect(fromHSL.c).toBeCloseTo(0.257683, 6);
      expect(fromHSL.h).toBeCloseTo(29.234, 3);

      const fromHSLA = toOKLCH({ h: 0, s: 100, l: 50, a: 0.5 });
      expect(fromHSLA.l).toBeCloseTo(0.627955, 6);
      expect(fromHSLA.c).toBeCloseTo(0.257683, 6);
      expect(fromHSLA.h).toBeCloseTo(29.234, 3);

      const fromHSV = toOKLCH({ h: 0, s: 100, v: 100 });
      expect(fromHSV.l).toBeCloseTo(0.627955, 6);
      expect(fromHSV.c).toBeCloseTo(0.257683, 6);
      expect(fromHSV.h).toBeCloseTo(29.234, 3);

      const fromHSVA = toOKLCH({ h: 0, s: 100, v: 100, a: 0.5 });
      expect(fromHSVA.l).toBeCloseTo(0.627955, 6);
      expect(fromHSVA.c).toBeCloseTo(0.257683, 6);
      expect(fromHSVA.h).toBeCloseTo(29.234, 3);

      const fromCMYK = toOKLCH({ c: 0, m: 100, y: 100, k: 0 });
      expect(fromCMYK.l).toBeCloseTo(0.627955, 6);
      expect(fromCMYK.c).toBeCloseTo(0.257683, 6);
      expect(fromCMYK.h).toBeCloseTo(29.234, 3);

      const fromLCH = toOKLCH({ l: 53.233, c: 104.576, h: 40 });
      expect(fromLCH.l).toBeCloseTo(0.627955, 6);
      expect(fromLCH.c).toBeCloseTo(0.257683, 6);
      expect(fromLCH.h).toBeCloseTo(29.234, 3);

      const fromOKLCH = toOKLCH({ l: 0.627955, c: 0.257683, h: 29.234 });
      expect(fromOKLCH.l).toBeCloseTo(0.627955, 6);
      expect(fromOKLCH.c).toBeCloseTo(0.257683, 6);
      expect(fromOKLCH.h).toBeCloseTo(29.234, 3);
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
