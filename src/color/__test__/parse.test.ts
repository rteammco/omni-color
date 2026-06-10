import { Color } from '../color';
import { parseCSSColorFormatString } from '../parse';

function parse(colorFormatString: string): Color | null {
  const color = parseCSSColorFormatString(colorFormatString);
  return color ? new Color(color) : null;
}

describe('parseCSSColorFormatString', () => {
  it('parses RGB inputs', () => {
    expect(parse('rgb(0, 0, 0)')?.toHex()).toBe('#000000');
    expect(parse('rgb(255, 255, 255)')?.toHex()).toBe('#ffffff');
    expect(parse('rgb(128, 128, 128)')?.toHex()).toBe('#808080');
    expect(parse('rgb(255, 0, 0)')?.toHex()).toBe('#ff0000');
    expect(parse('rgb(0, 255, 0)')?.toHex()).toBe('#00ff00');
    expect(parse('rgb(0, 0, 255)')?.toHex()).toBe('#0000ff');
    expect(parse('rgb(255, 255, 0)')?.toHex()).toBe('#ffff00');
    expect(parse('rgb(0, 255, 255)')?.toHex()).toBe('#00ffff');
    expect(parse('rgb(255, 0, 255)')?.toHex()).toBe('#ff00ff');
    expect(parse('rgb(0%, 0%, 0%)')?.toHex()).toBe('#000000');
    expect(parse('rgb(100%, 100%, 100%)')?.toHex()).toBe('#ffffff');
    expect(parse('rgb(50%, 50%, 50%)')?.toHex()).toBe('#808080');
    expect(parse('rgb(100%, 0%, 0%)')?.toHex()).toBe('#ff0000');
    expect(parse('rgb(0%, 100%, 0%)')?.toHex()).toBe('#00ff00');
    expect(parse('rgb(0%, 0%, 100%)')?.toHex()).toBe('#0000ff');
    expect(parse('rgb(100%, 100%, 0%)')?.toHex()).toBe('#ffff00');
  });

  it('parses RGBA inputs', () => {
    expect(parse('rgba(0, 0, 0, 0)')?.toHex8()).toBe('#00000000');
    expect(parse('rgba(255, 255, 255, 1)')?.toHex8()).toBe('#ffffffff');
    expect(parse('rgba(128, 128, 128, 0.502)')?.toHex8()).toBe('#80808080');
    expect(parse('rgba(255, 0, 0, 0.502)')?.toHex8()).toBe('#ff000080');
    expect(parse('rgba(0, 255, 0, 0.498)')?.toHex8()).toBe('#00ff007f');
    expect(parse('rgba(0, 0, 255, 0.251)')?.toHex8()).toBe('#0000ff40');
    expect(parse('rgba(255, 255, 0, 0.753)')?.toHex8()).toBe('#ffff00c0');
    expect(parse('rgba(0, 255, 255, 0.125)')?.toHex8()).toBe('#00ffff20');
    expect(parse('rgba(255, 0, 255, 0.6)')?.toHex8()).toBe('#ff00ff99');
    expect(parse('RGBA(255,0,0,50%)')?.toHex8()).toBe('#ff000080');
    expect(parse('rgba(0,255,0,25%)')?.toHex8()).toBe('#00ff0040');
    expect(parse('rgba(0,0,255,0%)')?.toHex8()).toBe('#0000ff00');
  });

  it('parses flexible RGB-style inputs', () => {
    expect(parse('rgb(100 200 150)')?.toRGB()).toEqual({
      r: 100,
      g: 200,
      b: 150,
    });
    expect(parse('rgb(100,200 150)')?.toRGB()).toEqual({
      r: 100,
      g: 200,
      b: 150,
    });
    expect(parse('rgb(0 0 0.5)')?.toRGB()).toEqual({
      r: 0,
      g: 0,
      b: 128,
    });
    expect(parse('rgb(10% 20% 30% / 50%)')?.toRGBA()).toEqual({
      r: 26,
      g: 51,
      b: 77,
      a: 0.5,
    });
    expect(parse('rgba(0.1 0.2 0.3 / 0.4)')?.toRGBA()).toEqual({
      r: 26,
      g: 51,
      b: 77,
      a: 0.4,
    });
    expect(parse('rgba(5 10 15 / 25%)')?.toRGBA()).toEqual({
      r: 5,
      g: 10,
      b: 15,
      a: 0.25,
    });
  });

  it('parses color() inputs', () => {
    expect(parse('color(srgb 1 0 0)')?.toHex()).toBe('#ff0000');
    expect(parse('color(srgb 100% 0% 0% / 25%)')?.toHex8()).toBe('#ff000040');
    expect(parse('color(srgb, 1, 1, 1, 50%)')?.toHex8()).toBe('#ffffff80');
    expect(parse('color(display-p3 0 100% 0 / 75%)')?.toHex8()).toBe('#00ff00bf');
    expect(parse('color(display-p3, 50%, 20%, 10% / 0.5)')?.toHex8()).toBe('#8a2c0d80');
    expect(parse('color(rec2020 25% 50% 75%)')?.toHex()).toBe('#0090cc');
    expect(parse('color(rec2020 0 0.5 1 / 0.25)')?.toHex8()).toBe('#0092ff40');
    expect(parse('color(REC2020 0% 0% 0% / 100%)')?.toHex()).toBe('#000000');
  });

  it('parses HSL inputs', () => {
    expect(parse('hsl(0, 0%, 0%)')?.toHex()).toBe('#000000');
    expect(parse('hsl(0, 0%, 100%)')?.toHex()).toBe('#ffffff');
    expect(parse('hsl(0, 0%, 50%)')?.toHex()).toBe('#808080');
    expect(parse('hsl(0, 100%, 50%)')?.toHex()).toBe('#ff0000');
    expect(parse('hsl(120, 100%, 50%)')?.toHex()).toBe('#00ff00');
    expect(parse('hsl(240, 100%, 50%)')?.toHex()).toBe('#0000ff');
    expect(parse('hsl(60, 100%, 50%)')?.toHex()).toBe('#ffff00');
    expect(parse('hsl(180, 100%, 50%)')?.toHex()).toBe('#00ffff');
    expect(parse('hsl(300, 100%, 50%)')?.toHex()).toBe('#ff00ff');
    expect(parse('hsl(120deg, 100%, 25%)')?.toHex()).toBe('#008000');
    expect(parse('hsl(0.5turn 100% 50%)')?.toHex()).toBe('#00ffff');
    expect(parse('hsl(3.141592653589793rad 100% 50%)')?.toHex()).toBe('#00ffff');
    expect(parse('hsl(200grad 100% 50%)')?.toHex()).toBe('#00ffff');
  });

  it('parses HSLA inputs', () => {
    expect(parse('hsla(0, 0%, 0%, 0)')?.toHex8()).toBe('#00000000');
    expect(parse('hsla(0, 0%, 100%, 1)')?.toHex8()).toBe('#ffffffff');
    expect(parse('hsla(0, 0%, 50%, 0.502)')?.toHex8()).toBe('#80808080');
    expect(parse('hsla(0, 100%, 50%, 0.502)')?.toHex8()).toBe('#ff000080');
    expect(parse('hsla(120, 100%, 50%, 0.498)')?.toHex8()).toBe('#00ff007f');
    expect(parse('hsla(240, 100%, 50%, 0.251)')?.toHex8()).toBe('#0000ff40');
    expect(parse('hsla(60, 100%, 50%, 0.753)')?.toHex8()).toBe('#ffff00c0');
    expect(parse('hsla(180, 100%, 50%, 0.125)')?.toHex8()).toBe('#00ffff20');
    expect(parse('hsla(300, 100%, 50%, 0.6)')?.toHex8()).toBe('#ff00ff99');
    expect(parse('hsla(0,100%,50%,50%)')?.toHex8()).toBe('#ff000080');
    expect(parse('hsla(120,100%,50%,25%)')?.toHex8()).toBe('#00ff0040');
    expect(parse('hsla(240,100%,50%,0%)')?.toHex8()).toBe('#0000ff00');
  });

  it('parses HSV inputs', () => {
    expect(parse('hsv(0,0%,0%)')?.toHex()).toBe('#000000');
    expect(parse('hsv(0,0%,100%)')?.toHex()).toBe('#ffffff');
    expect(parse('hsv(0,0%,50%)')?.toHex()).toBe('#808080');
    expect(parse('hsv(0,100%,100%)')?.toHex()).toBe('#ff0000');
    expect(parse('hsv(120,100%,100%)')?.toHex()).toBe('#00ff00');
    expect(parse('hsv(240,100%,100%)')?.toHex()).toBe('#0000ff');
    expect(parse('hsv(60,100%,100%)')?.toHex()).toBe('#ffff00');
    expect(parse('hsv(180,100%,100%)')?.toHex()).toBe('#00ffff');
    expect(parse('hsv(300,100%,100%)')?.toHex()).toBe('#ff00ff');
  });

  it('parses HSVA inputs', () => {
    expect(parse('hsva(0,0%,0%,0)')?.toHex8()).toBe('#00000000');
    expect(parse('hsva(0,0%,100%,1)')?.toHex8()).toBe('#ffffffff');
    expect(parse('hsva(0,0%,50%,0.502)')?.toHex8()).toBe('#80808080');
    expect(parse('hsva(0,100%,100%,0.502)')?.toHex8()).toBe('#ff000080');
    expect(parse('hsva(120,100%,100%,0.498)')?.toHex8()).toBe('#00ff007f');
    expect(parse('hsva(240,100%,100%,0.251)')?.toHex8()).toBe('#0000ff40');
    expect(parse('hsva(60,100%,100%,0.753)')?.toHex8()).toBe('#ffff00c0');
    expect(parse('hsva(180,100%,100%,0.125)')?.toHex8()).toBe('#00ffff20');
    expect(parse('hsva(300,100%,100%,0.6)')?.toHex8()).toBe('#ff00ff99');
    expect(parse('hsva(0,100%,100%,50%)')?.toHex8()).toBe('#ff000080');
    expect(parse('hsva(120,100%,100%,25%)')?.toHex8()).toBe('#00ff0040');
    expect(parse('hsva(240,100%,100%,0%)')?.toHex8()).toBe('#0000ff00');
  });

  it('parses HWB inputs', () => {
    expect(parse('hwb(0 0% 0%)')?.toHex()).toBe('#ff0000');
    expect(parse('hwb(120 40% 20%)')?.toHex()).toBe('#66cc66');
    expect(parse('hwb(210 10% 30% / 0.25)')?.toHex8()).toBe('#1a66b340');
    expect(parse('hwb(210 10% 30% 25%)')?.toHex8()).toBe('#1a66b340');
    expect(parse('hwb(480 0% 0%)')?.toHex()).toBe('#00ff00');
    expect(parse('hwb(0.5turn 0% 0%)')?.toHex()).toBe('#00ffff');
    expect(parse('hwb(3.141592653589793rad 0% 0%)')?.toHex()).toBe('#00ffff');
    expect(parse('hwb(200grad 0% 0%)')?.toHex()).toBe('#00ffff');
  });

  it('parses flexible HSL and HSV inputs', () => {
    expect(parse('hsl(180 100% 50%)')?.toHex()).toBe('#00ffff');
    expect(parse('hsl(180 100% 50% / 0.25)')?.toHex8()).toBe('#00ffff40');
    expect(parse('hsv(300 100% 100% / 0.5)')?.toHex8()).toBe('#ff00ff80');
  });

  it('parses CMYK inputs', () => {
    expect(parse('cmyk(0%, 0%, 0%, 100%)')?.toHex()).toBe('#000000');
    expect(parse('cmyk(0%, 0%, 0%, 0%)')?.toHex()).toBe('#ffffff');
    expect(parse('cmyk(0%, 0%, 0%, 50%)')?.toHex()).toBe('#808080');
    expect(parse('cmyk(0%,100%,100%,0%)')?.toHex()).toBe('#ff0000');
    expect(parse('cmyk(100%, 0%, 100%, 0%)')?.toHex()).toBe('#00ff00');
    expect(parse('cmyk(100%, 100%, 0%, 0%)')?.toHex()).toBe('#0000ff');
    expect(parse('cmyk(0%, 0%, 100%, 0%)')?.toHex()).toBe('#ffff00');
    expect(parse('cmyk(100%, 0%, 0%, 0%)')?.toHex()).toBe('#00ffff');
    expect(parse('cmyk(0%, 100%, 0%, 0%)')?.toHex()).toBe('#ff00ff');
  });

  it('parses LAB inputs', () => {
    expect(parse('lab(0% 0 0)')?.toHex()).toBe('#000000');
    expect(parse('lab(100% 0.005 -0.01)')?.toHex()).toBe('#ffffff');
    expect(parse('lab(53.585% 0.003 -0.006)')?.toHex()).toBe('#808080');
    expect(parse('lab(53.233% 80.109 67.22)')?.toHex()).toBe('#ff0000');
    expect(parse('lab(87.737% -86.185 83.181)')?.toHex()).toBe('#00ff00');
    expect(parse('lab(32.303% 79.197 -107.864)')?.toHex()).toBe('#0000ff');
    expect(parse('lab(97.138% -21.556 94.482)')?.toHex()).toBe('#ffff00');
    expect(parse('lab(91.117% -48.08 -14.138)')?.toHex()).toBe('#00ffff');
    expect(parse('lab(60.32% 98.254 -60.843)')?.toHex()).toBe('#ff00ff');
  });

  it('parses LCH inputs', () => {
    expect(parse('lch(0% 0 0)')?.toHex()).toBe('#000000');
    expect(parse('lch(100% 0.012 296.813)')?.toHex()).toBe('#ffffff');
    expect(parse('lch(53.585% 0.007 296.813)')?.toHex()).toBe('#808080');
    expect(parse('lch(53.233% 104.576 40)')?.toHex()).toBe('#ff0000');
    expect(parse('lch(87.737% 119.779 136.016)')?.toHex()).toBe('#00ff00');
    expect(parse('lch(32.303% 133.816 306.287)')?.toHex()).toBe('#0000ff');
    expect(parse('lch(97.138% 96.91 102.852)')?.toHex()).toBe('#ffff00');
    expect(parse('lch(91.117% 50.115 196.386)')?.toHex()).toBe('#00ffff');
    expect(parse('lch(60.32% 115.567 328.233)')?.toHex()).toBe('#ff00ff');
    expect(parse('lch(91.117% 50.115 0.5455166667turn)')?.toHex()).toBe('#00ffff');
    expect(parse('lch(91.117% 50.115 3.427586338rad)')?.toHex()).toBe('#00ffff');
    expect(parse('lch(91.117% 50.115 218.2066667grad)')?.toHex()).toBe('#00ffff');
  });

  it('parses very small LAB/LCH percentage lightness like canonical LAB/LCH (not OKLAB/OKLCH)', () => {
    const labHalfPercent = parse('lab(0.5% 0 0)')?.toHex();
    const labHalfUnit = parse('lab(0.5 0 0)')?.toHex();
    expect(labHalfPercent).toBe(labHalfUnit);

    const lchHalfPercent = parse('lch(0.5% 0 0)')?.toHex();
    const lchHalfUnit = parse('lch(0.5 0 0)')?.toHex();
    expect(lchHalfPercent).toBe(lchHalfUnit);

    expect(labHalfPercent).not.toBe(parse('oklab(0.5 0 0)')?.toHex());
    expect(lchHalfPercent).not.toBe(parse('oklch(0.5 0 0)')?.toHex());
  });

  it('parses OKLCH inputs', () => {
    expect(parse('oklch(0 0 0)')?.toHex()).toBe('#000000');
    expect(parse('oklch(1 0 89.876)')?.toHex()).toBe('#ffffff');
    expect(parse('oklch(0.599871 0 89.876)')?.toHex()).toBe('#808080');
    expect(parse('oklch(0.627955 0.257683 29.234)')?.toHex()).toBe('#ff0000');
    expect(parse('oklch(0.86644 0.294827 142.495)')?.toHex()).toBe('#00ff00');
    expect(parse('oklch(0.452014 0.313214 264.052)')?.toHex()).toBe('#0000ff');
    expect(parse('oklch(0.967983 0.211006 109.769)')?.toHex()).toBe('#ffff00');
    expect(parse('oklch(0.905399 0.15455 194.769)')?.toHex()).toBe('#00ffff');
    expect(parse('oklch(0.701674 0.322491 328.363)')?.toHex()).toBe('#ff00ff');
    expect(parse('oklch(0.905399 0.15455 0.541025turn)')?.toHex()).toBe('#00ffff');
    expect(parse('oklch(0.905399 0.15455 3.399358831rad)')?.toHex()).toBe('#00ffff');
    expect(parse('oklch(0.905399 0.15455 216.41grad)')?.toHex()).toBe('#00ffff');
  });

  it('parses OKLAB inputs', () => {
    expect(parse('oklab(0 0 0)')?.toHex()).toBe('#000000');
    expect(parse('oklab(1 0 0)')?.toHex()).toBe('#ffffff');
    expect(parse('oklab(0.599871 0 0)')?.toHex()).toBe('#808080');
    expect(parse('oklab(0.627955 0.224863 0.125846)')?.toHex()).toBe('#ff0000');
    expect(parse('oklab(0.86644 -0.233888 0.179498)')?.toHex()).toBe('#00ff00');
    expect(parse('oklab(0.452014 -0.032457 -0.311528)')?.toHex()).toBe('#0000ff');
  });

  it('parses OKLAB inputs with optional alpha', () => {
    expect(parse('oklab(0.627955 0.224863 0.125846 / 0.5)')?.toHex8()).toBe('#ff000080');
    expect(parse('oklab(0.86644 -0.233888 0.179498 / 25%)')?.toHex8()).toBe('#00ff0040');
    expect(parse('oklab(0.452014 -0.032457 -0.311528 0.75)')?.toHex8()).toBe('#0000ffbf');
    expect(parse('oklab(0.599871 0 0 / 0%)')?.toHex8()).toBe('#80808000');
  });

  it('parses additional forgiving input variations', () => {
    expect(parse('cmyk(0% 100% 100% 0%)')?.toHex()).toBe('#ff0000');
    expect(parse('lab(53.233%, 80.109, 67.22)')?.toHex()).toBe('#ff0000');
    expect(parse('lch(53.233%,104.576,40)')?.toHex()).toBe('#ff0000');
  });

  it('clamps out-of-range channel values for supported CSS formats', () => {
    expect(parse('rgb(300,0,0)')?.toHex()).toBe('#ff0000');
    expect(parse('rgb(-1,0,0)')?.toHex()).toBe('#000000');
    expect(parse('rgba(0,0,0,2)')?.toHex8()).toBe('#000000ff');
    expect(parse('rgba(0,0,0,-0.1)')?.toHex8()).toBe('#00000000');
    expect(parse('hsl(400,50%,50%)')?.toHex()).toBe('#bf9540');
    expect(parse('hsla(0,0%,0%,200%)')?.toHex8()).toBe('#000000ff');
  });

  it('returns null on invalid inputs', () => {
    expect(parse('hsva(0,0%,0%)')).toBeNull();
    expect(parse('cmyk(0%,0%,0%)')).toBeNull();
    expect(parse('cmyk(0%,0%,0%,101%)')).toBeNull();
    expect(parse('lab(120% 0 0)')).toBeNull();
    expect(parse('lab(50% 0)')).toBeNull();
    expect(parse('lch(120% 0 0)')).toBeNull();
    expect(parse('lch(50% 30)')).toBeNull();
    expect(parse('oklab(1.1 0 0)')).toBeNull();
    expect(parse('oklab(-0.1 0 0)')).toBeNull();
    expect(parse('oklab(0.5 0)')).toBeNull();
    expect(parse('oklab(0.5 0 0 / foo)')).toBeNull();
    expect(parse('oklch(1.1 0 0)')).toBeNull();
    expect(parse('oklch(-0.1 0 0)')).toBeNull();
    expect(parse('hwb(0 0%)')).toBeNull();
    expect(parse('foo(1,2,3)')).toBeNull();
    expect(parse('color(foo 1 0 0)')).toBeNull();
    expect(parse('color(display-p3 1 0)')).toBeNull();
  });
});
