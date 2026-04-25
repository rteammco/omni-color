import { Color } from '../color';
import { parseCSSColorFormatString } from '../parse';

const createColor = (input: ConstructorParameters<typeof Color>[0]) => new Color(input);

describe('parseCSSColorFormatString', () => {
  it('parses RGB inputs', () => {
    expect(parseCSSColorFormatString('rgb(0, 0, 0)', createColor)?.toHex()).toBe('#000000');
    expect(parseCSSColorFormatString('rgb(255, 255, 255)', createColor)?.toHex()).toBe('#ffffff');
    expect(parseCSSColorFormatString('rgb(128, 128, 128)', createColor)?.toHex()).toBe('#808080');
    expect(parseCSSColorFormatString('rgb(255, 0, 0)', createColor)?.toHex()).toBe('#ff0000');
    expect(parseCSSColorFormatString('rgb(0, 255, 0)', createColor)?.toHex()).toBe('#00ff00');
    expect(parseCSSColorFormatString('rgb(0, 0, 255)', createColor)?.toHex()).toBe('#0000ff');
    expect(parseCSSColorFormatString('rgb(255, 255, 0)', createColor)?.toHex()).toBe('#ffff00');
    expect(parseCSSColorFormatString('rgb(0, 255, 255)', createColor)?.toHex()).toBe('#00ffff');
    expect(parseCSSColorFormatString('rgb(255, 0, 255)', createColor)?.toHex()).toBe('#ff00ff');
    expect(parseCSSColorFormatString('rgb(0%, 0%, 0%)', createColor)?.toHex()).toBe('#000000');
    expect(parseCSSColorFormatString('rgb(100%, 100%, 100%)', createColor)?.toHex()).toBe(
      '#ffffff',
    );
    expect(parseCSSColorFormatString('rgb(50%, 50%, 50%)', createColor)?.toHex()).toBe('#808080');
    expect(parseCSSColorFormatString('rgb(100%, 0%, 0%)', createColor)?.toHex()).toBe('#ff0000');
    expect(parseCSSColorFormatString('rgb(0%, 100%, 0%)', createColor)?.toHex()).toBe('#00ff00');
    expect(parseCSSColorFormatString('rgb(0%, 0%, 100%)', createColor)?.toHex()).toBe('#0000ff');
    expect(parseCSSColorFormatString('rgb(100%, 100%, 0%)', createColor)?.toHex()).toBe('#ffff00');
  });

  it('parses RGBA inputs', () => {
    expect(parseCSSColorFormatString('rgba(0, 0, 0, 0)', createColor)?.toHex8()).toBe('#00000000');
    expect(parseCSSColorFormatString('rgba(255, 255, 255, 1)', createColor)?.toHex8()).toBe(
      '#ffffffff',
    );
    expect(parseCSSColorFormatString('rgba(128, 128, 128, 0.502)', createColor)?.toHex8()).toBe(
      '#80808080',
    );
    expect(parseCSSColorFormatString('rgba(255, 0, 0, 0.502)', createColor)?.toHex8()).toBe(
      '#ff000080',
    );
    expect(parseCSSColorFormatString('rgba(0, 255, 0, 0.498)', createColor)?.toHex8()).toBe(
      '#00ff007f',
    );
    expect(parseCSSColorFormatString('rgba(0, 0, 255, 0.251)', createColor)?.toHex8()).toBe(
      '#0000ff40',
    );
    expect(parseCSSColorFormatString('rgba(255, 255, 0, 0.753)', createColor)?.toHex8()).toBe(
      '#ffff00c0',
    );
    expect(parseCSSColorFormatString('rgba(0, 255, 255, 0.125)', createColor)?.toHex8()).toBe(
      '#00ffff20',
    );
    expect(parseCSSColorFormatString('rgba(255, 0, 255, 0.6)', createColor)?.toHex8()).toBe(
      '#ff00ff99',
    );
    expect(parseCSSColorFormatString('RGBA(255,0,0,50%)', createColor)?.toHex8()).toBe('#ff000080');
    expect(parseCSSColorFormatString('rgba(0,255,0,25%)', createColor)?.toHex8()).toBe('#00ff0040');
    expect(parseCSSColorFormatString('rgba(0,0,255,0%)', createColor)?.toHex8()).toBe('#0000ff00');
  });

  it('parses flexible RGB-style inputs', () => {
    expect(parseCSSColorFormatString('rgb(100 200 150)', createColor)?.toRGB()).toEqual({
      r: 100,
      g: 200,
      b: 150,
    });
    expect(parseCSSColorFormatString('rgb(100,200 150)', createColor)?.toRGB()).toEqual({
      r: 100,
      g: 200,
      b: 150,
    });
    expect(parseCSSColorFormatString('rgb(0 0 0.5)', createColor)?.toRGB()).toEqual({
      r: 0,
      g: 0,
      b: 128,
    });
    expect(parseCSSColorFormatString('rgb(10% 20% 30% / 50%)', createColor)?.toRGBA()).toEqual({
      r: 26,
      g: 51,
      b: 77,
      a: 0.5,
    });
    expect(parseCSSColorFormatString('rgba(0.1 0.2 0.3 / 0.4)', createColor)?.toRGBA()).toEqual({
      r: 26,
      g: 51,
      b: 77,
      a: 0.4,
    });
    expect(parseCSSColorFormatString('rgba(5 10 15 / 25%)', createColor)?.toRGBA()).toEqual({
      r: 5,
      g: 10,
      b: 15,
      a: 0.25,
    });
  });

  it('parses color() inputs', () => {
    expect(parseCSSColorFormatString('color(srgb 1 0 0)', createColor)?.toHex()).toBe('#ff0000');
    expect(parseCSSColorFormatString('color(srgb 100% 0% 0% / 25%)', createColor)?.toHex8()).toBe(
      '#ff000040',
    );
    expect(parseCSSColorFormatString('color(srgb, 1, 1, 1, 50%)', createColor)?.toHex8()).toBe(
      '#ffffff80',
    );
    expect(
      parseCSSColorFormatString('color(display-p3 0 100% 0 / 75%)', createColor)?.toHex8(),
    ).toBe('#00ff00bf');
    expect(
      parseCSSColorFormatString('color(display-p3, 50%, 20%, 10% / 0.5)', createColor)?.toHex8(),
    ).toBe('#8a2c0d80');
    expect(parseCSSColorFormatString('color(rec2020 25% 50% 75%)', createColor)?.toHex()).toBe(
      '#0090cc',
    );
    expect(parseCSSColorFormatString('color(rec2020 0 0.5 1 / 0.25)', createColor)?.toHex8()).toBe(
      '#0092ff40',
    );
    expect(parseCSSColorFormatString('color(REC2020 0% 0% 0% / 100%)', createColor)?.toHex()).toBe(
      '#000000',
    );
  });

  it('parses HSL inputs', () => {
    expect(parseCSSColorFormatString('hsl(0, 0%, 0%)', createColor)?.toHex()).toBe('#000000');
    expect(parseCSSColorFormatString('hsl(0, 0%, 100%)', createColor)?.toHex()).toBe('#ffffff');
    expect(parseCSSColorFormatString('hsl(0, 0%, 50%)', createColor)?.toHex()).toBe('#808080');
    expect(parseCSSColorFormatString('hsl(0, 100%, 50%)', createColor)?.toHex()).toBe('#ff0000');
    expect(parseCSSColorFormatString('hsl(120, 100%, 50%)', createColor)?.toHex()).toBe('#00ff00');
    expect(parseCSSColorFormatString('hsl(240, 100%, 50%)', createColor)?.toHex()).toBe('#0000ff');
    expect(parseCSSColorFormatString('hsl(60, 100%, 50%)', createColor)?.toHex()).toBe('#ffff00');
    expect(parseCSSColorFormatString('hsl(180, 100%, 50%)', createColor)?.toHex()).toBe('#00ffff');
    expect(parseCSSColorFormatString('hsl(300, 100%, 50%)', createColor)?.toHex()).toBe('#ff00ff');
    expect(parseCSSColorFormatString('hsl(120deg, 100%, 25%)', createColor)?.toHex()).toBe(
      '#008000',
    );
    expect(parseCSSColorFormatString('hsl(0.5turn 100% 50%)', createColor)?.toHex()).toBe(
      '#00ffff',
    );
    expect(
      parseCSSColorFormatString('hsl(3.141592653589793rad 100% 50%)', createColor)?.toHex(),
    ).toBe('#00ffff');
    expect(parseCSSColorFormatString('hsl(200grad 100% 50%)', createColor)?.toHex()).toBe(
      '#00ffff',
    );
  });

  it('parses HSLA inputs', () => {
    expect(parseCSSColorFormatString('hsla(0, 0%, 0%, 0)', createColor)?.toHex8()).toBe(
      '#00000000',
    );
    expect(parseCSSColorFormatString('hsla(0, 0%, 100%, 1)', createColor)?.toHex8()).toBe(
      '#ffffffff',
    );
    expect(parseCSSColorFormatString('hsla(0, 0%, 50%, 0.502)', createColor)?.toHex8()).toBe(
      '#80808080',
    );
    expect(parseCSSColorFormatString('hsla(0, 100%, 50%, 0.502)', createColor)?.toHex8()).toBe(
      '#ff000080',
    );
    expect(parseCSSColorFormatString('hsla(120, 100%, 50%, 0.498)', createColor)?.toHex8()).toBe(
      '#00ff007f',
    );
    expect(parseCSSColorFormatString('hsla(240, 100%, 50%, 0.251)', createColor)?.toHex8()).toBe(
      '#0000ff40',
    );
    expect(parseCSSColorFormatString('hsla(60, 100%, 50%, 0.753)', createColor)?.toHex8()).toBe(
      '#ffff00c0',
    );
    expect(parseCSSColorFormatString('hsla(180, 100%, 50%, 0.125)', createColor)?.toHex8()).toBe(
      '#00ffff20',
    );
    expect(parseCSSColorFormatString('hsla(300, 100%, 50%, 0.6)', createColor)?.toHex8()).toBe(
      '#ff00ff99',
    );
    expect(parseCSSColorFormatString('hsla(0,100%,50%,50%)', createColor)?.toHex8()).toBe(
      '#ff000080',
    );
    expect(parseCSSColorFormatString('hsla(120,100%,50%,25%)', createColor)?.toHex8()).toBe(
      '#00ff0040',
    );
    expect(parseCSSColorFormatString('hsla(240,100%,50%,0%)', createColor)?.toHex8()).toBe(
      '#0000ff00',
    );
  });

  it('parses HSV inputs', () => {
    expect(parseCSSColorFormatString('hsv(0,0%,0%)', createColor)?.toHex()).toBe('#000000');
    expect(parseCSSColorFormatString('hsv(0,0%,100%)', createColor)?.toHex()).toBe('#ffffff');
    expect(parseCSSColorFormatString('hsv(0,0%,50%)', createColor)?.toHex()).toBe('#808080');
    expect(parseCSSColorFormatString('hsv(0,100%,100%)', createColor)?.toHex()).toBe('#ff0000');
    expect(parseCSSColorFormatString('hsv(120,100%,100%)', createColor)?.toHex()).toBe('#00ff00');
    expect(parseCSSColorFormatString('hsv(240,100%,100%)', createColor)?.toHex()).toBe('#0000ff');
    expect(parseCSSColorFormatString('hsv(60,100%,100%)', createColor)?.toHex()).toBe('#ffff00');
    expect(parseCSSColorFormatString('hsv(180,100%,100%)', createColor)?.toHex()).toBe('#00ffff');
    expect(parseCSSColorFormatString('hsv(300,100%,100%)', createColor)?.toHex()).toBe('#ff00ff');
  });

  it('parses HSVA inputs', () => {
    expect(parseCSSColorFormatString('hsva(0,0%,0%,0)', createColor)?.toHex8()).toBe('#00000000');
    expect(parseCSSColorFormatString('hsva(0,0%,100%,1)', createColor)?.toHex8()).toBe('#ffffffff');
    expect(parseCSSColorFormatString('hsva(0,0%,50%,0.502)', createColor)?.toHex8()).toBe(
      '#80808080',
    );
    expect(parseCSSColorFormatString('hsva(0,100%,100%,0.502)', createColor)?.toHex8()).toBe(
      '#ff000080',
    );
    expect(parseCSSColorFormatString('hsva(120,100%,100%,0.498)', createColor)?.toHex8()).toBe(
      '#00ff007f',
    );
    expect(parseCSSColorFormatString('hsva(240,100%,100%,0.251)', createColor)?.toHex8()).toBe(
      '#0000ff40',
    );
    expect(parseCSSColorFormatString('hsva(60,100%,100%,0.753)', createColor)?.toHex8()).toBe(
      '#ffff00c0',
    );
    expect(parseCSSColorFormatString('hsva(180,100%,100%,0.125)', createColor)?.toHex8()).toBe(
      '#00ffff20',
    );
    expect(parseCSSColorFormatString('hsva(300,100%,100%,0.6)', createColor)?.toHex8()).toBe(
      '#ff00ff99',
    );
    expect(parseCSSColorFormatString('hsva(0,100%,100%,50%)', createColor)?.toHex8()).toBe(
      '#ff000080',
    );
    expect(parseCSSColorFormatString('hsva(120,100%,100%,25%)', createColor)?.toHex8()).toBe(
      '#00ff0040',
    );
    expect(parseCSSColorFormatString('hsva(240,100%,100%,0%)', createColor)?.toHex8()).toBe(
      '#0000ff00',
    );
  });

  it('parses HWB inputs', () => {
    expect(parseCSSColorFormatString('hwb(0 0% 0%)', createColor)?.toHex()).toBe('#ff0000');
    expect(parseCSSColorFormatString('hwb(120 40% 20%)', createColor)?.toHex()).toBe('#66cc66');
    expect(parseCSSColorFormatString('hwb(210 10% 30% / 0.25)', createColor)?.toHex8()).toBe(
      '#1a66b340',
    );
    expect(parseCSSColorFormatString('hwb(210 10% 30% 25%)', createColor)?.toHex8()).toBe(
      '#1a66b340',
    );
    expect(parseCSSColorFormatString('hwb(480 0% 0%)', createColor)?.toHex()).toBe('#00ff00');
    expect(parseCSSColorFormatString('hwb(0.5turn 0% 0%)', createColor)?.toHex()).toBe('#00ffff');
    expect(parseCSSColorFormatString('hwb(3.141592653589793rad 0% 0%)', createColor)?.toHex()).toBe(
      '#00ffff',
    );
    expect(parseCSSColorFormatString('hwb(200grad 0% 0%)', createColor)?.toHex()).toBe('#00ffff');
  });

  it('parses flexible HSL and HSV inputs', () => {
    expect(parseCSSColorFormatString('hsl(180 100% 50%)', createColor)?.toHex()).toBe('#00ffff');
    expect(parseCSSColorFormatString('hsl(180 100% 50% / 0.25)', createColor)?.toHex8()).toBe(
      '#00ffff40',
    );
    expect(parseCSSColorFormatString('hsv(300 100% 100% / 0.5)', createColor)?.toHex8()).toBe(
      '#ff00ff80',
    );
  });

  it('parses CMYK inputs', () => {
    expect(parseCSSColorFormatString('cmyk(0%, 0%, 0%, 100%)', createColor)?.toHex()).toBe(
      '#000000',
    );
    expect(parseCSSColorFormatString('cmyk(0%, 0%, 0%, 0%)', createColor)?.toHex()).toBe('#ffffff');
    expect(parseCSSColorFormatString('cmyk(0%, 0%, 0%, 50%)', createColor)?.toHex()).toBe(
      '#808080',
    );
    expect(parseCSSColorFormatString('cmyk(0%,100%,100%,0%)', createColor)?.toHex()).toBe(
      '#ff0000',
    );
    expect(parseCSSColorFormatString('cmyk(100%, 0%, 100%, 0%)', createColor)?.toHex()).toBe(
      '#00ff00',
    );
    expect(parseCSSColorFormatString('cmyk(100%, 100%, 0%, 0%)', createColor)?.toHex()).toBe(
      '#0000ff',
    );
    expect(parseCSSColorFormatString('cmyk(0%, 0%, 100%, 0%)', createColor)?.toHex()).toBe(
      '#ffff00',
    );
    expect(parseCSSColorFormatString('cmyk(100%, 0%, 0%, 0%)', createColor)?.toHex()).toBe(
      '#00ffff',
    );
    expect(parseCSSColorFormatString('cmyk(0%, 100%, 0%, 0%)', createColor)?.toHex()).toBe(
      '#ff00ff',
    );
  });

  it('parses LAB inputs', () => {
    expect(parseCSSColorFormatString('lab(0% 0 0)', createColor)?.toHex()).toBe('#000000');
    expect(parseCSSColorFormatString('lab(100% 0.005 -0.01)', createColor)?.toHex()).toBe(
      '#ffffff',
    );
    expect(parseCSSColorFormatString('lab(53.585% 0.003 -0.006)', createColor)?.toHex()).toBe(
      '#808080',
    );
    expect(parseCSSColorFormatString('lab(53.233% 80.109 67.22)', createColor)?.toHex()).toBe(
      '#ff0000',
    );
    expect(parseCSSColorFormatString('lab(87.737% -86.185 83.181)', createColor)?.toHex()).toBe(
      '#00ff00',
    );
    expect(parseCSSColorFormatString('lab(32.303% 79.197 -107.864)', createColor)?.toHex()).toBe(
      '#0000ff',
    );
    expect(parseCSSColorFormatString('lab(97.138% -21.556 94.482)', createColor)?.toHex()).toBe(
      '#ffff00',
    );
    expect(parseCSSColorFormatString('lab(91.117% -48.08 -14.138)', createColor)?.toHex()).toBe(
      '#00ffff',
    );
    expect(parseCSSColorFormatString('lab(60.32% 98.254 -60.843)', createColor)?.toHex()).toBe(
      '#ff00ff',
    );
  });

  it('parses LCH inputs', () => {
    expect(parseCSSColorFormatString('lch(0% 0 0)', createColor)?.toHex()).toBe('#000000');
    expect(parseCSSColorFormatString('lch(100% 0.012 296.813)', createColor)?.toHex()).toBe(
      '#ffffff',
    );
    expect(parseCSSColorFormatString('lch(53.585% 0.007 296.813)', createColor)?.toHex()).toBe(
      '#808080',
    );
    expect(parseCSSColorFormatString('lch(53.233% 104.576 40)', createColor)?.toHex()).toBe(
      '#ff0000',
    );
    expect(parseCSSColorFormatString('lch(87.737% 119.779 136.016)', createColor)?.toHex()).toBe(
      '#00ff00',
    );
    expect(parseCSSColorFormatString('lch(32.303% 133.816 306.287)', createColor)?.toHex()).toBe(
      '#0000ff',
    );
    expect(parseCSSColorFormatString('lch(97.138% 96.91 102.852)', createColor)?.toHex()).toBe(
      '#ffff00',
    );
    expect(parseCSSColorFormatString('lch(91.117% 50.115 196.386)', createColor)?.toHex()).toBe(
      '#00ffff',
    );
    expect(parseCSSColorFormatString('lch(60.32% 115.567 328.233)', createColor)?.toHex()).toBe(
      '#ff00ff',
    );
    expect(
      parseCSSColorFormatString('lch(91.117% 50.115 0.5455166667turn)', createColor)?.toHex(),
    ).toBe('#00ffff');
    expect(
      parseCSSColorFormatString('lch(91.117% 50.115 3.427586338rad)', createColor)?.toHex(),
    ).toBe('#00ffff');
    expect(
      parseCSSColorFormatString('lch(91.117% 50.115 218.2066667grad)', createColor)?.toHex(),
    ).toBe('#00ffff');
  });

  it('parses very small LAB/LCH percentage lightness like canonical LAB/LCH (not OKLAB/OKLCH)', () => {
    const labHalfPercent = parseCSSColorFormatString('lab(0.5% 0 0)', createColor)?.toHex();
    const labHalfUnit = parseCSSColorFormatString('lab(0.5 0 0)', createColor)?.toHex();
    expect(labHalfPercent).toBe(labHalfUnit);

    const lchHalfPercent = parseCSSColorFormatString('lch(0.5% 0 0)', createColor)?.toHex();
    const lchHalfUnit = parseCSSColorFormatString('lch(0.5 0 0)', createColor)?.toHex();
    expect(lchHalfPercent).toBe(lchHalfUnit);

    expect(labHalfPercent).not.toBe(
      parseCSSColorFormatString('oklab(0.5 0 0)', createColor)?.toHex(),
    );
    expect(lchHalfPercent).not.toBe(
      parseCSSColorFormatString('oklch(0.5 0 0)', createColor)?.toHex(),
    );
  });

  it('parses OKLCH inputs', () => {
    expect(parseCSSColorFormatString('oklch(0 0 0)', createColor)?.toHex()).toBe('#000000');
    expect(parseCSSColorFormatString('oklch(1 0 89.876)', createColor)?.toHex()).toBe('#ffffff');
    expect(parseCSSColorFormatString('oklch(0.599871 0 89.876)', createColor)?.toHex()).toBe(
      '#808080',
    );
    expect(parseCSSColorFormatString('oklch(0.627955 0.257683 29.234)', createColor)?.toHex()).toBe(
      '#ff0000',
    );
    expect(parseCSSColorFormatString('oklch(0.86644 0.294827 142.495)', createColor)?.toHex()).toBe(
      '#00ff00',
    );
    expect(
      parseCSSColorFormatString('oklch(0.452014 0.313214 264.052)', createColor)?.toHex(),
    ).toBe('#0000ff');
    expect(
      parseCSSColorFormatString('oklch(0.967983 0.211006 109.769)', createColor)?.toHex(),
    ).toBe('#ffff00');
    expect(parseCSSColorFormatString('oklch(0.905399 0.15455 194.769)', createColor)?.toHex()).toBe(
      '#00ffff',
    );
    expect(
      parseCSSColorFormatString('oklch(0.701674 0.322491 328.363)', createColor)?.toHex(),
    ).toBe('#ff00ff');
    expect(
      parseCSSColorFormatString('oklch(0.905399 0.15455 0.541025turn)', createColor)?.toHex(),
    ).toBe('#00ffff');
    expect(
      parseCSSColorFormatString('oklch(0.905399 0.15455 3.399358831rad)', createColor)?.toHex(),
    ).toBe('#00ffff');
    expect(
      parseCSSColorFormatString('oklch(0.905399 0.15455 216.41grad)', createColor)?.toHex(),
    ).toBe('#00ffff');
  });

  it('parses OKLAB inputs', () => {
    expect(parseCSSColorFormatString('oklab(0 0 0)', createColor)?.toHex()).toBe('#000000');
    expect(parseCSSColorFormatString('oklab(1 0 0)', createColor)?.toHex()).toBe('#ffffff');
    expect(parseCSSColorFormatString('oklab(0.599871 0 0)', createColor)?.toHex()).toBe('#808080');
    expect(
      parseCSSColorFormatString('oklab(0.627955 0.224863 0.125846)', createColor)?.toHex(),
    ).toBe('#ff0000');
    expect(
      parseCSSColorFormatString('oklab(0.86644 -0.233888 0.179498)', createColor)?.toHex(),
    ).toBe('#00ff00');
    expect(
      parseCSSColorFormatString('oklab(0.452014 -0.032457 -0.311528)', createColor)?.toHex(),
    ).toBe('#0000ff');
  });

  it('parses OKLAB inputs with optional alpha', () => {
    expect(
      parseCSSColorFormatString('oklab(0.627955 0.224863 0.125846 / 0.5)', createColor)?.toHex8(),
    ).toBe('#ff000080');
    expect(
      parseCSSColorFormatString('oklab(0.86644 -0.233888 0.179498 / 25%)', createColor)?.toHex8(),
    ).toBe('#00ff0040');
    expect(
      parseCSSColorFormatString('oklab(0.452014 -0.032457 -0.311528 0.75)', createColor)?.toHex8(),
    ).toBe('#0000ffbf');
    expect(parseCSSColorFormatString('oklab(0.599871 0 0 / 0%)', createColor)?.toHex8()).toBe(
      '#80808000',
    );
  });

  it('parses additional forgiving input variations', () => {
    expect(parseCSSColorFormatString('cmyk(0% 100% 100% 0%)', createColor)?.toHex()).toBe(
      '#ff0000',
    );
    expect(parseCSSColorFormatString('lab(53.233%, 80.109, 67.22)', createColor)?.toHex()).toBe(
      '#ff0000',
    );
    expect(parseCSSColorFormatString('lch(53.233%,104.576,40)', createColor)?.toHex()).toBe(
      '#ff0000',
    );
  });

  it('clamps out-of-range channel values for supported CSS formats', () => {
    expect(parseCSSColorFormatString('rgb(300,0,0)', createColor)?.toHex()).toBe('#ff0000');
    expect(parseCSSColorFormatString('rgb(-1,0,0)', createColor)?.toHex()).toBe('#000000');
    expect(parseCSSColorFormatString('rgba(0,0,0,2)', createColor)?.toHex8()).toBe('#000000ff');
    expect(parseCSSColorFormatString('rgba(0,0,0,-0.1)', createColor)?.toHex8()).toBe('#00000000');
    expect(parseCSSColorFormatString('hsl(400,50%,50%)', createColor)?.toHex()).toBe('#bf9540');
    expect(parseCSSColorFormatString('hsla(0,0%,0%,200%)', createColor)?.toHex8()).toBe(
      '#000000ff',
    );
  });

  it('returns null on invalid inputs', () => {
    expect(parseCSSColorFormatString('hsva(0,0%,0%)', createColor)).toBeNull();
    expect(parseCSSColorFormatString('cmyk(0%,0%,0%)', createColor)).toBeNull();
    expect(parseCSSColorFormatString('cmyk(0%,0%,0%,101%)', createColor)).toBeNull();
    expect(parseCSSColorFormatString('lab(120% 0 0)', createColor)).toBeNull();
    expect(parseCSSColorFormatString('lab(50% 0)', createColor)).toBeNull();
    expect(parseCSSColorFormatString('lch(120% 0 0)', createColor)).toBeNull();
    expect(parseCSSColorFormatString('lch(50% 30)', createColor)).toBeNull();
    expect(parseCSSColorFormatString('oklab(1.1 0 0)', createColor)).toBeNull();
    expect(parseCSSColorFormatString('oklab(-0.1 0 0)', createColor)).toBeNull();
    expect(parseCSSColorFormatString('oklab(0.5 0)', createColor)).toBeNull();
    expect(parseCSSColorFormatString('oklab(0.5 0 0 / foo)', createColor)).toBeNull();
    expect(parseCSSColorFormatString('oklch(1.1 0 0)', createColor)).toBeNull();
    expect(parseCSSColorFormatString('oklch(-0.1 0 0)', createColor)).toBeNull();
    expect(parseCSSColorFormatString('hwb(0 0%)', createColor)).toBeNull();
    expect(parseCSSColorFormatString('foo(1,2,3)', createColor)).toBeNull();
    expect(parseCSSColorFormatString('color(foo 1 0 0)', createColor)).toBeNull();
    expect(parseCSSColorFormatString('color(display-p3 1 0)', createColor)).toBeNull();
  });
});
