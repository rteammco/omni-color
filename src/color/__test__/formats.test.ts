import { Color } from '../color';
import {
  cmykToString,
  hslaToString,
  hslToString,
  lchToString,
  oklchToString,
  rgbaToString,
  rgbToString,
} from '../formats';

describe('format string helpers', () => {
  const color = new Color('#ff0000');

  it('generates rgb string', () => {
    expect(rgbToString(color.toRGB())).toBe('rgb(255, 0, 0)');
    expect(color.toRGBString()).toBe('rgb(255, 0, 0)');
  });

  it('generates rgba string', () => {
    expect(rgbaToString(color.toRGBA())).toBe('rgba(255, 0, 0, 1)');
    expect(color.toRGBAString()).toBe('rgba(255, 0, 0, 1)');
  });

  it('generates hsl string', () => {
    expect(hslToString(color.toHSL())).toBe('hsl(0, 100%, 50%)');
    expect(color.toHSLString()).toBe('hsl(0, 100%, 50%)');
  });

  it('generates hsla string', () => {
    expect(hslaToString(color.toHSLA())).toBe('hsla(0, 100%, 50%, 1)');
    expect(color.toHSLAString()).toBe('hsla(0, 100%, 50%, 1)');
  });

  it('generates cmyk string', () => {
    expect(cmykToString(color.toCMYK())).toBe('cmyk(0%, 100%, 100%, 0%)');
    expect(color.toCMYKString()).toBe('cmyk(0%, 100%, 100%, 0%)');
  });

  it('generates lch string', () => {
    expect(lchToString(color.toLCH())).toBe('lch(53.233% 104.576 40)');
    expect(color.toLCHString()).toBe('lch(53.233% 104.576 40)');
  });

  it('generates oklch string', () => {
    expect(oklchToString(color.toOKLCH())).toBe('oklch(0.627955 0.257683 29.234)');
    expect(color.toOKLCHString()).toBe('oklch(0.627955 0.257683 29.234)');
  });
});
