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
  const colors = [
    {
      hex: '#000000',
      rgb: 'rgb(0, 0, 0)',
      hsl: 'hsl(0, 0%, 0%)',
      cmyk: 'cmyk(0%, 0%, 0%, 100%)',
      lch: 'lch(0% 0 0)',
      oklch: 'oklch(0 0 0)',
    },
    {
      hex: '#ffffff',
      rgb: 'rgb(255, 255, 255)',
      hsl: 'hsl(0, 0%, 100%)',
      cmyk: 'cmyk(0%, 0%, 0%, 0%)',
      lch: 'lch(100% 0.012 296.813)',
      oklch: 'oklch(1 0 89.876)',
    },
    {
      hex: '#808080',
      rgb: 'rgb(128, 128, 128)',
      hsl: 'hsl(0, 0%, 50%)',
      cmyk: 'cmyk(0%, 0%, 0%, 50%)',
      lch: 'lch(53.585% 0.007 296.813)',
      oklch: 'oklch(0.599871 0 89.876)',
    },
    {
      hex: '#ff0000',
      rgb: 'rgb(255, 0, 0)',
      hsl: 'hsl(0, 100%, 50%)',
      cmyk: 'cmyk(0%, 100%, 100%, 0%)',
      lch: 'lch(53.233% 104.576 40)',
      oklch: 'oklch(0.627955 0.257683 29.234)',
    },
    {
      hex: '#00ff00',
      rgb: 'rgb(0, 255, 0)',
      hsl: 'hsl(120, 100%, 50%)',
      cmyk: 'cmyk(100%, 0%, 100%, 0%)',
      lch: 'lch(87.737% 119.779 136.016)',
      oklch: 'oklch(0.86644 0.294827 142.495)',
    },
    {
      hex: '#0000ff',
      rgb: 'rgb(0, 0, 255)',
      hsl: 'hsl(240, 100%, 50%)',
      cmyk: 'cmyk(100%, 100%, 0%, 0%)',
      lch: 'lch(32.303% 133.816 306.287)',
      oklch: 'oklch(0.452014 0.313214 264.052)',
    },
    {
      hex: '#ffff00',
      rgb: 'rgb(255, 255, 0)',
      hsl: 'hsl(60, 100%, 50%)',
      cmyk: 'cmyk(0%, 0%, 100%, 0%)',
      lch: 'lch(97.138% 96.91 102.852)',
      oklch: 'oklch(0.967983 0.211006 109.769)',
    },
    {
      hex: '#00ffff',
      rgb: 'rgb(0, 255, 255)',
      hsl: 'hsl(180, 100%, 50%)',
      cmyk: 'cmyk(100%, 0%, 0%, 0%)',
      lch: 'lch(91.117% 50.115 196.386)',
      oklch: 'oklch(0.905399 0.15455 194.769)',
    },
    {
      hex: '#ff00ff',
      rgb: 'rgb(255, 0, 255)',
      hsl: 'hsl(300, 100%, 50%)',
      cmyk: 'cmyk(0%, 100%, 0%, 0%)',
      lch: 'lch(60.32% 115.567 328.233)',
      oklch: 'oklch(0.701674 0.322491 328.363)',
    },
    {
      hex: '#abc123',
      rgb: 'rgb(171, 193, 35)',
      hsl: 'hsl(68, 69%, 45%)',
      cmyk: 'cmyk(11%, 0%, 82%, 24%)',
      lch: 'lch(74.138% 73.934 110.756)',
      oklch: 'oklch(0.768123 0.169623 117.914)',
    },
  ];

  const alphaColors = [
    { hex: '#00000000', rgba: 'rgba(0, 0, 0, 0)', hsla: 'hsla(0, 0%, 0%, 0)' },
    { hex: '#ffffffff', rgba: 'rgba(255, 255, 255, 1)', hsla: 'hsla(0, 0%, 100%, 1)' },
    { hex: '#80808080', rgba: 'rgba(128, 128, 128, 0.502)', hsla: 'hsla(0, 0%, 50%, 0.502)' },
    { hex: '#ff000080', rgba: 'rgba(255, 0, 0, 0.502)', hsla: 'hsla(0, 100%, 50%, 0.502)' },
    { hex: '#00ff007f', rgba: 'rgba(0, 255, 0, 0.498)', hsla: 'hsla(120, 100%, 50%, 0.498)' },
    { hex: '#0000ff40', rgba: 'rgba(0, 0, 255, 0.251)', hsla: 'hsla(240, 100%, 50%, 0.251)' },
    { hex: '#ffff00c0', rgba: 'rgba(255, 255, 0, 0.753)', hsla: 'hsla(60, 100%, 50%, 0.753)' },
    { hex: '#00ffff20', rgba: 'rgba(0, 255, 255, 0.125)', hsla: 'hsla(180, 100%, 50%, 0.125)' },
    { hex: '#ff00ff99', rgba: 'rgba(255, 0, 255, 0.6)', hsla: 'hsla(300, 100%, 50%, 0.6)' },
    { hex: '#abc123d6', rgba: 'rgba(171, 193, 35, 0.839)', hsla: 'hsla(68, 69%, 45%, 0.839)' },
  ];

  it('generates rgb string', () => {
    colors.forEach(({ hex, rgb }) => {
      const color = new Color(hex);
      expect(rgbToString(color.toRGB())).toBe(rgb);
      expect(color.toRGBString()).toBe(rgb);
    });
  });

  it('generates rgba string', () => {
    alphaColors.forEach(({ hex, rgba }) => {
      const color = new Color(hex);
      expect(rgbaToString(color.toRGBA())).toBe(rgba);
      expect(color.toRGBAString()).toBe(rgba);
    });
  });

  it('generates hsl string', () => {
    colors.forEach(({ hex, hsl }) => {
      const color = new Color(hex);
      expect(hslToString(color.toHSL())).toBe(hsl);
      expect(color.toHSLString()).toBe(hsl);
    });
  });

  it('generates hsla string', () => {
    alphaColors.forEach(({ hex, hsla }) => {
      const color = new Color(hex);
      expect(hslaToString(color.toHSLA())).toBe(hsla);
      expect(color.toHSLAString()).toBe(hsla);
    });
  });

  it('generates cmyk string', () => {
    colors.forEach(({ hex, cmyk }) => {
      const color = new Color(hex);
      expect(cmykToString(color.toCMYK())).toBe(cmyk);
      expect(color.toCMYKString()).toBe(cmyk);
    });
  });

  it('generates lch string', () => {
    colors.forEach(({ hex, lch }) => {
      const color = new Color(hex);
      expect(lchToString(color.toLCH())).toBe(lch);
      expect(color.toLCHString()).toBe(lch);
    });
  });

  it('generates oklch string', () => {
    colors.forEach(({ hex, oklch }) => {
      const color = new Color(hex);
      expect(oklchToString(color.toOKLCH())).toBe(oklch);
      expect(color.toOKLCHString()).toBe(oklch);
    });
  });
});
