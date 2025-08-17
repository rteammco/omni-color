import { parseCSSColorFormatString } from '../parse';

describe('parseCSSColorFormatString', () => {
  describe('rgb and rgba', () => {
    it('parses rgb with integers', () => {
      const color = parseCSSColorFormatString('rgb(255, 0, 0)');
      expect(color?.toRGB()).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('parses rgb with percentages and whitespace', () => {
      const color = parseCSSColorFormatString(' rgb(100% , 0% , 0% ) ');
      expect(color?.toRGB()).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('parses rgba with decimal alpha', () => {
      const color = parseCSSColorFormatString('rgba(255,0,0,0.5)');
      expect(color?.toRGBA()).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
    });

    it('parses rgba with percentage alpha and is case insensitive', () => {
      const color = parseCSSColorFormatString('RGBA(255,0,0,50%)');
      expect(color?.toRGBA()).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
    });
  });

  describe('hsl and hsla', () => {
    it('parses hsl with degree unit', () => {
      const color = parseCSSColorFormatString('hsl(120deg, 100%, 25%)');
      expect(color?.toHSL()).toEqual({ h: 120, s: 100, l: 25 });
    });

    it('parses hsla with percentage alpha', () => {
      const color = parseCSSColorFormatString('hsla(240,100%,50%,25%)');
      expect(color?.toHSLA()).toEqual({ h: 240, s: 100, l: 50, a: 0.25 });
    });
  });

  describe('cmyk', () => {
    it('parses cmyk format', () => {
      const color = parseCSSColorFormatString('cmyk(0%,100%,100%,0%)');
      expect(color?.toHex()).toBe('#ff0000');
    });
  });

  describe('hsv and hsva', () => {
    it('parses hsv format', () => {
      const color = parseCSSColorFormatString('hsv(0,100%,100%)');
      expect(color?.toHex()).toBe('#ff0000');
    });

    it('parses hsva format with alpha', () => {
      const color = parseCSSColorFormatString('hsva(0,100%,100%,50%)');
      expect(color?.toRGBA()).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
    });
  });

  describe('lch', () => {
    it('parses lch format with percentage lightness', () => {
      const color = parseCSSColorFormatString('lch(53.233% 104.576 40)');
      expect(color?.toHex()).toBe('#ff0000');
    });
  });

  describe('oklch', () => {
    it('parses oklch format', () => {
      const color = parseCSSColorFormatString('oklch(0.627955 0.257683 29.234)');
      expect(color?.toHex()).toBe('#ff0000');
    });
  });

  describe('invalid inputs', () => {
    const invalidStrings = [
      'rgb(300,0,0)',
      'rgba(0,0,0,2)',
      'hsl(400,50%,50%)',
      'hsla(0,0%,0%,200%)',
      'cmyk(0%,0%,0%,101%)',
      'lch(120% 0 0)',
      'oklch(1.1 0 0)',
      'foo(1,2,3)',
    ];

    invalidStrings.forEach((str) => {
      it(`returns null for "${str}"`, () => {
        expect(parseCSSColorFormatString(str)).toBeNull();
      });
    });
  });
});

