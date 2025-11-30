import { parseCSSColorFormatString } from '../parse';

describe('parseCSSColorFormatString', () => {
  it('parses RGB inputs', () => {
    expect(parseCSSColorFormatString('rgb(0, 0, 0)')?.toHex()).toBe('#000000');
    expect(parseCSSColorFormatString('rgb(255, 255, 255)')?.toHex()).toBe('#ffffff');
    expect(parseCSSColorFormatString('rgb(128, 128, 128)')?.toHex()).toBe('#808080');
    expect(parseCSSColorFormatString('rgb(255, 0, 0)')?.toHex()).toBe('#ff0000');
    expect(parseCSSColorFormatString('rgb(0, 255, 0)')?.toHex()).toBe('#00ff00');
    expect(parseCSSColorFormatString('rgb(0, 0, 255)')?.toHex()).toBe('#0000ff');
    expect(parseCSSColorFormatString('rgb(255, 255, 0)')?.toHex()).toBe('#ffff00');
    expect(parseCSSColorFormatString('rgb(0, 255, 255)')?.toHex()).toBe('#00ffff');
    expect(parseCSSColorFormatString('rgb(255, 0, 255)')?.toHex()).toBe('#ff00ff');
    expect(parseCSSColorFormatString('rgb(0%, 0%, 0%)')?.toHex()).toBe('#000000');
    expect(parseCSSColorFormatString('rgb(100%, 100%, 100%)')?.toHex()).toBe('#ffffff');
    expect(parseCSSColorFormatString('rgb(50%, 50%, 50%)')?.toHex()).toBe('#808080');
    expect(parseCSSColorFormatString('rgb(100%, 0%, 0%)')?.toHex()).toBe('#ff0000');
    expect(parseCSSColorFormatString('rgb(0%, 100%, 0%)')?.toHex()).toBe('#00ff00');
    expect(parseCSSColorFormatString('rgb(0%, 0%, 100%)')?.toHex()).toBe('#0000ff');
    expect(parseCSSColorFormatString('rgb(100%, 100%, 0%)')?.toHex()).toBe('#ffff00');
  });

  it('parses RGBA inputs', () => {
    expect(parseCSSColorFormatString('rgba(0, 0, 0, 0)')?.toHex8()).toBe('#00000000');
    expect(parseCSSColorFormatString('rgba(255, 255, 255, 1)')?.toHex8()).toBe('#ffffffff');
    expect(parseCSSColorFormatString('rgba(128, 128, 128, 0.502)')?.toHex8()).toBe('#80808080');
    expect(parseCSSColorFormatString('rgba(255, 0, 0, 0.502)')?.toHex8()).toBe('#ff000080');
    expect(parseCSSColorFormatString('rgba(0, 255, 0, 0.498)')?.toHex8()).toBe('#00ff007f');
    expect(parseCSSColorFormatString('rgba(0, 0, 255, 0.251)')?.toHex8()).toBe('#0000ff40');
    expect(parseCSSColorFormatString('rgba(255, 255, 0, 0.753)')?.toHex8()).toBe('#ffff00c0');
    expect(parseCSSColorFormatString('rgba(0, 255, 255, 0.125)')?.toHex8()).toBe('#00ffff20');
    expect(parseCSSColorFormatString('rgba(255, 0, 255, 0.6)')?.toHex8()).toBe('#ff00ff99');
    expect(parseCSSColorFormatString('RGBA(255,0,0,50%)')?.toHex8()).toBe('#ff000080');
    expect(parseCSSColorFormatString('rgba(0,255,0,25%)')?.toHex8()).toBe('#00ff0040');
    expect(parseCSSColorFormatString('rgba(0,0,255,0%)')?.toHex8()).toBe('#0000ff00');
  });

  it('parses flexible RGB-style inputs', () => {
    expect(parseCSSColorFormatString('rgb(100 200 150)')?.toRGB()).toEqual({
      r: 100,
      g: 200,
      b: 150,
    });
    expect(parseCSSColorFormatString('rgb(100,200 150)')?.toRGB()).toEqual({
      r: 100,
      g: 200,
      b: 150,
    });
    expect(parseCSSColorFormatString('rgb(0 0 0.5)')?.toRGB()).toEqual({ r: 0, g: 0, b: 128 });
    expect(parseCSSColorFormatString('rgb(10% 20% 30% / 50%)')?.toRGBA()).toEqual({
      r: 26,
      g: 51,
      b: 77,
      a: 0.5,
    });
    expect(parseCSSColorFormatString('rgba(0.1 0.2 0.3 / 0.4)')?.toRGBA()).toEqual({
      r: 26,
      g: 51,
      b: 77,
      a: 0.4,
    });
    expect(parseCSSColorFormatString('rgba(5 10 15 / 25%)')?.toRGBA()).toEqual({
      r: 5,
      g: 10,
      b: 15,
      a: 0.25,
    });
  });

  it('parses HSL inputs', () => {
    expect(parseCSSColorFormatString('hsl(0, 0%, 0%)')?.toHex()).toBe('#000000');
    expect(parseCSSColorFormatString('hsl(0, 0%, 100%)')?.toHex()).toBe('#ffffff');
    expect(parseCSSColorFormatString('hsl(0, 0%, 50%)')?.toHex()).toBe('#808080');
    expect(parseCSSColorFormatString('hsl(0, 100%, 50%)')?.toHex()).toBe('#ff0000');
    expect(parseCSSColorFormatString('hsl(120, 100%, 50%)')?.toHex()).toBe('#00ff00');
    expect(parseCSSColorFormatString('hsl(240, 100%, 50%)')?.toHex()).toBe('#0000ff');
    expect(parseCSSColorFormatString('hsl(60, 100%, 50%)')?.toHex()).toBe('#ffff00');
    expect(parseCSSColorFormatString('hsl(180, 100%, 50%)')?.toHex()).toBe('#00ffff');
    expect(parseCSSColorFormatString('hsl(300, 100%, 50%)')?.toHex()).toBe('#ff00ff');
    expect(parseCSSColorFormatString('hsl(120deg, 100%, 25%)')?.toHex()).toBe('#008000');
  });

  it('parses HSLA inputs', () => {
    expect(parseCSSColorFormatString('hsla(0, 0%, 0%, 0)')?.toHex8()).toBe('#00000000');
    expect(parseCSSColorFormatString('hsla(0, 0%, 100%, 1)')?.toHex8()).toBe('#ffffffff');
    expect(parseCSSColorFormatString('hsla(0, 0%, 50%, 0.502)')?.toHex8()).toBe('#80808080');
    expect(parseCSSColorFormatString('hsla(0, 100%, 50%, 0.502)')?.toHex8()).toBe('#ff000080');
    expect(parseCSSColorFormatString('hsla(120, 100%, 50%, 0.498)')?.toHex8()).toBe('#00ff007f');
    expect(parseCSSColorFormatString('hsla(240, 100%, 50%, 0.251)')?.toHex8()).toBe('#0000ff40');
    expect(parseCSSColorFormatString('hsla(60, 100%, 50%, 0.753)')?.toHex8()).toBe('#ffff00c0');
    expect(parseCSSColorFormatString('hsla(180, 100%, 50%, 0.125)')?.toHex8()).toBe('#00ffff20');
    expect(parseCSSColorFormatString('hsla(300, 100%, 50%, 0.6)')?.toHex8()).toBe('#ff00ff99');
    expect(parseCSSColorFormatString('hsla(0,100%,50%,50%)')?.toHex8()).toBe('#ff000080');
    expect(parseCSSColorFormatString('hsla(120,100%,50%,25%)')?.toHex8()).toBe('#00ff0040');
    expect(parseCSSColorFormatString('hsla(240,100%,50%,0%)')?.toHex8()).toBe('#0000ff00');
  });

  it('parses HSV inputs', () => {
    expect(parseCSSColorFormatString('hsv(0,0%,0%)')?.toHex()).toBe('#000000');
    expect(parseCSSColorFormatString('hsv(0,0%,100%)')?.toHex()).toBe('#ffffff');
    expect(parseCSSColorFormatString('hsv(0,0%,50%)')?.toHex()).toBe('#808080');
    expect(parseCSSColorFormatString('hsv(0,100%,100%)')?.toHex()).toBe('#ff0000');
    expect(parseCSSColorFormatString('hsv(120,100%,100%)')?.toHex()).toBe('#00ff00');
    expect(parseCSSColorFormatString('hsv(240,100%,100%)')?.toHex()).toBe('#0000ff');
    expect(parseCSSColorFormatString('hsv(60,100%,100%)')?.toHex()).toBe('#ffff00');
    expect(parseCSSColorFormatString('hsv(180,100%,100%)')?.toHex()).toBe('#00ffff');
    expect(parseCSSColorFormatString('hsv(300,100%,100%)')?.toHex()).toBe('#ff00ff');
  });

  it('parses HSVA inputs', () => {
    expect(parseCSSColorFormatString('hsva(0,0%,0%,0)')?.toHex8()).toBe('#00000000');
    expect(parseCSSColorFormatString('hsva(0,0%,100%,1)')?.toHex8()).toBe('#ffffffff');
    expect(parseCSSColorFormatString('hsva(0,0%,50%,0.502)')?.toHex8()).toBe('#80808080');
    expect(parseCSSColorFormatString('hsva(0,100%,100%,0.502)')?.toHex8()).toBe('#ff000080');
    expect(parseCSSColorFormatString('hsva(120,100%,100%,0.498)')?.toHex8()).toBe('#00ff007f');
    expect(parseCSSColorFormatString('hsva(240,100%,100%,0.251)')?.toHex8()).toBe('#0000ff40');
    expect(parseCSSColorFormatString('hsva(60,100%,100%,0.753)')?.toHex8()).toBe('#ffff00c0');
    expect(parseCSSColorFormatString('hsva(180,100%,100%,0.125)')?.toHex8()).toBe('#00ffff20');
    expect(parseCSSColorFormatString('hsva(300,100%,100%,0.6)')?.toHex8()).toBe('#ff00ff99');
    expect(parseCSSColorFormatString('hsva(0,100%,100%,50%)')?.toHex8()).toBe('#ff000080');
    expect(parseCSSColorFormatString('hsva(120,100%,100%,25%)')?.toHex8()).toBe('#00ff0040');
    expect(parseCSSColorFormatString('hsva(240,100%,100%,0%)')?.toHex8()).toBe('#0000ff00');
  });

  it('parses flexible HSL and HSV inputs', () => {
    expect(parseCSSColorFormatString('hsl(180 100% 50%)')?.toHex()).toBe('#00ffff');
    expect(parseCSSColorFormatString('hsl(180 100% 50% / 0.25)')?.toHex8()).toBe('#00ffff40');
    expect(parseCSSColorFormatString('hsv(300 100% 100% / 0.5)')?.toHex8()).toBe('#ff00ff80');
  });

  it('parses CMYK inputs', () => {
    expect(parseCSSColorFormatString('cmyk(0%, 0%, 0%, 100%)')?.toHex()).toBe('#000000');
    expect(parseCSSColorFormatString('cmyk(0%, 0%, 0%, 0%)')?.toHex()).toBe('#ffffff');
    expect(parseCSSColorFormatString('cmyk(0%, 0%, 0%, 50%)')?.toHex()).toBe('#808080');
    expect(parseCSSColorFormatString('cmyk(0%,100%,100%,0%)')?.toHex()).toBe('#ff0000');
    expect(parseCSSColorFormatString('cmyk(100%, 0%, 100%, 0%)')?.toHex()).toBe('#00ff00');
    expect(parseCSSColorFormatString('cmyk(100%, 100%, 0%, 0%)')?.toHex()).toBe('#0000ff');
    expect(parseCSSColorFormatString('cmyk(0%, 0%, 100%, 0%)')?.toHex()).toBe('#ffff00');
    expect(parseCSSColorFormatString('cmyk(100%, 0%, 0%, 0%)')?.toHex()).toBe('#00ffff');
    expect(parseCSSColorFormatString('cmyk(0%, 100%, 0%, 0%)')?.toHex()).toBe('#ff00ff');
  });

  it('parses LAB inputs', () => {
    expect(parseCSSColorFormatString('lab(0% 0 0)')?.toHex()).toBe('#000000');
    expect(parseCSSColorFormatString('lab(100% 0.005 -0.01)')?.toHex()).toBe('#ffffff');
    expect(parseCSSColorFormatString('lab(53.585% 0.003 -0.006)')?.toHex()).toBe('#808080');
    expect(parseCSSColorFormatString('lab(53.233% 80.109 67.22)')?.toHex()).toBe('#ff0000');
    expect(parseCSSColorFormatString('lab(87.737% -86.185 83.181)')?.toHex()).toBe('#00ff00');
    expect(parseCSSColorFormatString('lab(32.303% 79.197 -107.864)')?.toHex()).toBe('#0000ff');
    expect(parseCSSColorFormatString('lab(97.138% -21.556 94.482)')?.toHex()).toBe('#ffff00');
    expect(parseCSSColorFormatString('lab(91.117% -48.08 -14.138)')?.toHex()).toBe('#00ffff');
    expect(parseCSSColorFormatString('lab(60.32% 98.254 -60.843)')?.toHex()).toBe('#ff00ff');
  });

  it('parses LCH inputs', () => {
    expect(parseCSSColorFormatString('lch(0% 0 0)')?.toHex()).toBe('#000000');
    expect(parseCSSColorFormatString('lch(100% 0.012 296.813)')?.toHex()).toBe('#ffffff');
    expect(parseCSSColorFormatString('lch(53.585% 0.007 296.813)')?.toHex()).toBe('#808080');
    expect(parseCSSColorFormatString('lch(53.233% 104.576 40)')?.toHex()).toBe('#ff0000');
    expect(parseCSSColorFormatString('lch(87.737% 119.779 136.016)')?.toHex()).toBe('#00ff00');
    expect(parseCSSColorFormatString('lch(32.303% 133.816 306.287)')?.toHex()).toBe('#0000ff');
    expect(parseCSSColorFormatString('lch(97.138% 96.91 102.852)')?.toHex()).toBe('#ffff00');
    expect(parseCSSColorFormatString('lch(91.117% 50.115 196.386)')?.toHex()).toBe('#00ffff');
    expect(parseCSSColorFormatString('lch(60.32% 115.567 328.233)')?.toHex()).toBe('#ff00ff');
  });

  it('parses OKLCH inputs', () => {
    expect(parseCSSColorFormatString('oklch(0 0 0)')?.toHex()).toBe('#000000');
    expect(parseCSSColorFormatString('oklch(1 0 89.876)')?.toHex()).toBe('#ffffff');
    expect(parseCSSColorFormatString('oklch(0.599871 0 89.876)')?.toHex()).toBe('#808080');
    expect(parseCSSColorFormatString('oklch(0.627955 0.257683 29.234)')?.toHex()).toBe('#ff0000');
    expect(parseCSSColorFormatString('oklch(0.86644 0.294827 142.495)')?.toHex()).toBe('#00ff00');
    expect(parseCSSColorFormatString('oklch(0.452014 0.313214 264.052)')?.toHex()).toBe('#0000ff');
    expect(parseCSSColorFormatString('oklch(0.967983 0.211006 109.769)')?.toHex()).toBe('#ffff00');
    expect(parseCSSColorFormatString('oklch(0.905399 0.15455 194.769)')?.toHex()).toBe('#00ffff');
    expect(parseCSSColorFormatString('oklch(0.701674 0.322491 328.363)')?.toHex()).toBe('#ff00ff');
  });

  it('parses additional forgiving input variations', () => {
    expect(parseCSSColorFormatString('cmyk(0% 100% 100% 0%)')?.toHex()).toBe('#ff0000');
    expect(parseCSSColorFormatString('lab(53.233%, 80.109, 67.22)')?.toHex()).toBe('#ff0000');
    expect(parseCSSColorFormatString('lch(53.233%,104.576,40)')?.toHex()).toBe('#ff0000');
  });

  it('returns null on invalid inputs', () => {
    expect(parseCSSColorFormatString('rgb(300,0,0)')).toBeNull();
    expect(parseCSSColorFormatString('rgb(-1,0,0)')).toBeNull();
    expect(parseCSSColorFormatString('rgba(0,0,0,2)')).toBeNull();
    expect(parseCSSColorFormatString('rgba(0,0,0,-0.1)')).toBeNull();
    expect(parseCSSColorFormatString('hsl(400,50%,50%)')).toBeNull();
    expect(parseCSSColorFormatString('hsla(0,0%,0%,200%)')).toBeNull();
    expect(parseCSSColorFormatString('hsva(0,0%,0%)')).toBeNull();
    expect(parseCSSColorFormatString('cmyk(0%,0%,0%)')).toBeNull();
    expect(parseCSSColorFormatString('cmyk(0%,0%,0%,101%)')).toBeNull();
    expect(parseCSSColorFormatString('lab(120% 0 0)')).toBeNull();
    expect(parseCSSColorFormatString('lab(50% 0)')).toBeNull();
    expect(parseCSSColorFormatString('lch(120% 0 0)')).toBeNull();
    expect(parseCSSColorFormatString('lch(50% 30)')).toBeNull();
    expect(parseCSSColorFormatString('oklch(1.1 0 0)')).toBeNull();
    expect(parseCSSColorFormatString('oklch(-0.1 0 0)')).toBeNull();
    expect(parseCSSColorFormatString('foo(1,2,3)')).toBeNull();
  });
});
