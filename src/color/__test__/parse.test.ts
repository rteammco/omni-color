import { parseCSSColorFormatString } from '../parse';

describe('parseCSSColorFormatString', () => {
  describe('rgb', () => {
    it('parses black', () => {
      expect(parseCSSColorFormatString('rgb(0, 0, 0)')?.toHex()).toBe('#000000');
    });

    it('parses white', () => {
      expect(parseCSSColorFormatString('rgb(255, 255, 255)')?.toHex()).toBe('#ffffff');
    });

    it('parses gray', () => {
      expect(parseCSSColorFormatString('rgb(128, 128, 128)')?.toHex()).toBe('#808080');
    });

    it('parses red', () => {
      expect(parseCSSColorFormatString('rgb(255, 0, 0)')?.toHex()).toBe('#ff0000');
    });

    it('parses green', () => {
      expect(parseCSSColorFormatString('rgb(0, 255, 0)')?.toHex()).toBe('#00ff00');
    });

    it('parses blue', () => {
      expect(parseCSSColorFormatString('rgb(0, 0, 255)')?.toHex()).toBe('#0000ff');
    });

    it('parses yellow', () => {
      expect(parseCSSColorFormatString('rgb(255, 255, 0)')?.toHex()).toBe('#ffff00');
    });

    it('parses cyan', () => {
      expect(parseCSSColorFormatString('rgb(0, 255, 255)')?.toHex()).toBe('#00ffff');
    });

    it('parses magenta', () => {
      expect(parseCSSColorFormatString('rgb(255, 0, 255)')?.toHex()).toBe('#ff00ff');
    });

    it('parses percentage black', () => {
      expect(parseCSSColorFormatString('rgb(0%, 0%, 0%)')?.toHex()).toBe('#000000');
    });

    it('parses percentage white', () => {
      expect(parseCSSColorFormatString('rgb(100%, 100%, 100%)')?.toHex()).toBe('#ffffff');
    });

    it('parses percentage gray', () => {
      expect(parseCSSColorFormatString('rgb(50%, 50%, 50%)')?.toHex()).toBe('#808080');
    });

    it('parses percentage red', () => {
      expect(parseCSSColorFormatString('rgb(100%, 0%, 0%)')?.toHex()).toBe('#ff0000');
    });

    it('parses percentage green', () => {
      expect(parseCSSColorFormatString('rgb(0%, 100%, 0%)')?.toHex()).toBe('#00ff00');
    });

    it('parses percentage blue', () => {
      expect(parseCSSColorFormatString('rgb(0%, 0%, 100%)')?.toHex()).toBe('#0000ff');
    });

    it('parses percentage yellow', () => {
      expect(parseCSSColorFormatString('rgb(100%, 100%, 0%)')?.toHex()).toBe('#ffff00');
    });
  });

  describe('rgba', () => {
    it('parses transparent black', () => {
      expect(parseCSSColorFormatString('rgba(0, 0, 0, 0)')?.toHex8()).toBe('#00000000');
    });

    it('parses opaque white', () => {
      expect(parseCSSColorFormatString('rgba(255, 255, 255, 1)')?.toHex8()).toBe('#ffffffff');
    });

    it('parses gray with alpha', () => {
      expect(parseCSSColorFormatString('rgba(128, 128, 128, 0.502)')?.toHex8()).toBe('#80808080');
    });

    it('parses red with alpha', () => {
      expect(parseCSSColorFormatString('rgba(255, 0, 0, 0.502)')?.toHex8()).toBe('#ff000080');
    });

    it('parses green with alpha', () => {
      expect(parseCSSColorFormatString('rgba(0, 255, 0, 0.498)')?.toHex8()).toBe('#00ff007f');
    });

    it('parses blue with alpha', () => {
      expect(parseCSSColorFormatString('rgba(0, 0, 255, 0.251)')?.toHex8()).toBe('#0000ff40');
    });

    it('parses yellow with alpha', () => {
      expect(parseCSSColorFormatString('rgba(255, 255, 0, 0.753)')?.toHex8()).toBe('#ffff00c0');
    });

    it('parses cyan with alpha', () => {
      expect(parseCSSColorFormatString('rgba(0, 255, 255, 0.125)')?.toHex8()).toBe('#00ffff20');
    });

    it('parses magenta with alpha', () => {
      expect(parseCSSColorFormatString('rgba(255, 0, 255, 0.6)')?.toHex8()).toBe('#ff00ff99');
    });

    it('parses percentage alpha red', () => {
      expect(parseCSSColorFormatString('RGBA(255,0,0,50%)')?.toHex8()).toBe('#ff000080');
    });

    it('parses percentage alpha green', () => {
      expect(parseCSSColorFormatString('rgba(0,255,0,25%)')?.toHex8()).toBe('#00ff0040');
    });

    it('parses percentage alpha blue', () => {
      expect(parseCSSColorFormatString('rgba(0,0,255,0%)')?.toHex8()).toBe('#0000ff00');
    });
  });

  describe('hsl', () => {
    it('parses black', () => {
      expect(parseCSSColorFormatString('hsl(0, 0%, 0%)')?.toHex()).toBe('#000000');
    });

    it('parses white', () => {
      expect(parseCSSColorFormatString('hsl(0, 0%, 100%)')?.toHex()).toBe('#ffffff');
    });

    it('parses gray', () => {
      expect(parseCSSColorFormatString('hsl(0, 0%, 50%)')?.toHex()).toBe('#808080');
    });

    it('parses red', () => {
      expect(parseCSSColorFormatString('hsl(0, 100%, 50%)')?.toHex()).toBe('#ff0000');
    });

    it('parses green', () => {
      expect(parseCSSColorFormatString('hsl(120, 100%, 50%)')?.toHex()).toBe('#00ff00');
    });

    it('parses blue', () => {
      expect(parseCSSColorFormatString('hsl(240, 100%, 50%)')?.toHex()).toBe('#0000ff');
    });

    it('parses yellow', () => {
      expect(parseCSSColorFormatString('hsl(60, 100%, 50%)')?.toHex()).toBe('#ffff00');
    });

    it('parses cyan', () => {
      expect(parseCSSColorFormatString('hsl(180, 100%, 50%)')?.toHex()).toBe('#00ffff');
    });

    it('parses magenta', () => {
      expect(parseCSSColorFormatString('hsl(300, 100%, 50%)')?.toHex()).toBe('#ff00ff');
    });

    it('parses hsl with degree unit', () => {
      expect(parseCSSColorFormatString('hsl(120deg, 100%, 25%)')?.toHex()).toBe('#008000');
    });
  });

  describe('hsla', () => {
    it('parses black with alpha', () => {
      expect(parseCSSColorFormatString('hsla(0, 0%, 0%, 0)')?.toHex8()).toBe('#00000000');
    });

    it('parses white with alpha', () => {
      expect(parseCSSColorFormatString('hsla(0, 0%, 100%, 1)')?.toHex8()).toBe('#ffffffff');
    });

    it('parses gray with alpha', () => {
      expect(parseCSSColorFormatString('hsla(0, 0%, 50%, 0.502)')?.toHex8()).toBe('#80808080');
    });

    it('parses red with alpha', () => {
      expect(parseCSSColorFormatString('hsla(0, 100%, 50%, 0.502)')?.toHex8()).toBe('#ff000080');
    });

    it('parses green with alpha', () => {
      expect(parseCSSColorFormatString('hsla(120, 100%, 50%, 0.498)')?.toHex8()).toBe('#00ff007f');
    });

    it('parses blue with alpha', () => {
      expect(parseCSSColorFormatString('hsla(240, 100%, 50%, 0.251)')?.toHex8()).toBe('#0000ff40');
    });

    it('parses yellow with alpha', () => {
      expect(parseCSSColorFormatString('hsla(60, 100%, 50%, 0.753)')?.toHex8()).toBe('#ffff00c0');
    });

    it('parses cyan with alpha', () => {
      expect(parseCSSColorFormatString('hsla(180, 100%, 50%, 0.125)')?.toHex8()).toBe('#00ffff20');
    });

    it('parses magenta with alpha', () => {
      expect(parseCSSColorFormatString('hsla(300, 100%, 50%, 0.6)')?.toHex8()).toBe('#ff00ff99');
    });

    it('parses percentage alpha red', () => {
      expect(parseCSSColorFormatString('hsla(0,100%,50%,50%)')?.toHex8()).toBe('#ff000080');
    });

    it('parses percentage alpha green', () => {
      expect(parseCSSColorFormatString('hsla(120,100%,50%,25%)')?.toHex8()).toBe('#00ff0040');
    });

    it('parses percentage alpha blue', () => {
      expect(parseCSSColorFormatString('hsla(240,100%,50%,0%)')?.toHex8()).toBe('#0000ff00');
    });
  });

  describe('cmyk', () => {
    it('parses black', () => {
      expect(parseCSSColorFormatString('cmyk(0%, 0%, 0%, 100%)')?.toHex()).toBe('#000000');
    });

    it('parses white', () => {
      expect(parseCSSColorFormatString('cmyk(0%, 0%, 0%, 0%)')?.toHex()).toBe('#ffffff');
    });

    it('parses gray', () => {
      expect(parseCSSColorFormatString('cmyk(0%, 0%, 0%, 50%)')?.toHex()).toBe('#808080');
    });

    it('parses red', () => {
      expect(parseCSSColorFormatString('cmyk(0%,100%,100%,0%)')?.toHex()).toBe('#ff0000');
    });

    it('parses green', () => {
      expect(parseCSSColorFormatString('cmyk(100%, 0%, 100%, 0%)')?.toHex()).toBe('#00ff00');
    });

    it('parses blue', () => {
      expect(parseCSSColorFormatString('cmyk(100%, 100%, 0%, 0%)')?.toHex()).toBe('#0000ff');
    });

    it('parses yellow', () => {
      expect(parseCSSColorFormatString('cmyk(0%, 0%, 100%, 0%)')?.toHex()).toBe('#ffff00');
    });

    it('parses cyan', () => {
      expect(parseCSSColorFormatString('cmyk(100%, 0%, 0%, 0%)')?.toHex()).toBe('#00ffff');
    });

    it('parses magenta', () => {
      expect(parseCSSColorFormatString('cmyk(0%, 100%, 0%, 0%)')?.toHex()).toBe('#ff00ff');
    });
  });

  describe('hsv', () => {
    it('parses black', () => {
      expect(parseCSSColorFormatString('hsv(0,0%,0%)')?.toHex()).toBe('#000000');
    });

    it('parses white', () => {
      expect(parseCSSColorFormatString('hsv(0,0%,100%)')?.toHex()).toBe('#ffffff');
    });

    it('parses gray', () => {
      expect(parseCSSColorFormatString('hsv(0,0%,50%)')?.toHex()).toBe('#808080');
    });

    it('parses red', () => {
      expect(parseCSSColorFormatString('hsv(0,100%,100%)')?.toHex()).toBe('#ff0000');
    });

    it('parses green', () => {
      expect(parseCSSColorFormatString('hsv(120,100%,100%)')?.toHex()).toBe('#00ff00');
    });

    it('parses blue', () => {
      expect(parseCSSColorFormatString('hsv(240,100%,100%)')?.toHex()).toBe('#0000ff');
    });

    it('parses yellow', () => {
      expect(parseCSSColorFormatString('hsv(60,100%,100%)')?.toHex()).toBe('#ffff00');
    });

    it('parses cyan', () => {
      expect(parseCSSColorFormatString('hsv(180,100%,100%)')?.toHex()).toBe('#00ffff');
    });

    it('parses magenta', () => {
      expect(parseCSSColorFormatString('hsv(300,100%,100%)')?.toHex()).toBe('#ff00ff');
    });
  });

  describe('hsva', () => {
    it('parses black with alpha', () => {
      expect(parseCSSColorFormatString('hsva(0,0%,0%,0)')?.toHex8()).toBe('#00000000');
    });

    it('parses white with alpha', () => {
      expect(parseCSSColorFormatString('hsva(0,0%,100%,1)')?.toHex8()).toBe('#ffffffff');
    });

    it('parses gray with alpha', () => {
      expect(parseCSSColorFormatString('hsva(0,0%,50%,0.502)')?.toHex8()).toBe('#80808080');
    });

    it('parses red with alpha', () => {
      expect(parseCSSColorFormatString('hsva(0,100%,100%,0.502)')?.toHex8()).toBe('#ff000080');
    });

    it('parses green with alpha', () => {
      expect(parseCSSColorFormatString('hsva(120,100%,100%,0.498)')?.toHex8()).toBe('#00ff007f');
    });

    it('parses blue with alpha', () => {
      expect(parseCSSColorFormatString('hsva(240,100%,100%,0.251)')?.toHex8()).toBe('#0000ff40');
    });

    it('parses yellow with alpha', () => {
      expect(parseCSSColorFormatString('hsva(60,100%,100%,0.753)')?.toHex8()).toBe('#ffff00c0');
    });

    it('parses cyan with alpha', () => {
      expect(parseCSSColorFormatString('hsva(180,100%,100%,0.125)')?.toHex8()).toBe('#00ffff20');
    });

    it('parses magenta with alpha', () => {
      expect(parseCSSColorFormatString('hsva(300,100%,100%,0.6)')?.toHex8()).toBe('#ff00ff99');
    });

    it('parses percentage alpha red', () => {
      expect(parseCSSColorFormatString('hsva(0,100%,100%,50%)')?.toHex8()).toBe('#ff000080');
    });

    it('parses percentage alpha green', () => {
      expect(parseCSSColorFormatString('hsva(120,100%,100%,25%)')?.toHex8()).toBe('#00ff0040');
    });

    it('parses percentage alpha blue', () => {
      expect(parseCSSColorFormatString('hsva(240,100%,100%,0%)')?.toHex8()).toBe('#0000ff00');
    });
  });

  describe('lch', () => {
    it('parses black', () => {
      expect(parseCSSColorFormatString('lch(0% 0 0)')?.toHex()).toBe('#000000');
    });

    it('parses white', () => {
      expect(parseCSSColorFormatString('lch(100% 0.012 296.813)')?.toHex()).toBe('#ffffff');
    });

    it('parses gray', () => {
      expect(parseCSSColorFormatString('lch(53.585% 0.007 296.813)')?.toHex()).toBe('#808080');
    });

    it('parses red', () => {
      expect(parseCSSColorFormatString('lch(53.233% 104.576 40)')?.toHex()).toBe('#ff0000');
    });

    it('parses green', () => {
      expect(parseCSSColorFormatString('lch(87.737% 119.779 136.016)')?.toHex()).toBe('#00ff00');
    });

    it('parses blue', () => {
      expect(parseCSSColorFormatString('lch(32.303% 133.816 306.287)')?.toHex()).toBe('#0000ff');
    });

    it('parses yellow', () => {
      expect(parseCSSColorFormatString('lch(97.138% 96.91 102.852)')?.toHex()).toBe('#ffff00');
    });

    it('parses cyan', () => {
      expect(parseCSSColorFormatString('lch(91.117% 50.115 196.386)')?.toHex()).toBe('#00ffff');
    });

    it('parses magenta', () => {
      expect(parseCSSColorFormatString('lch(60.32% 115.567 328.233)')?.toHex()).toBe('#ff00ff');
    });
  });

  describe('oklch', () => {
    it('parses black', () => {
      expect(parseCSSColorFormatString('oklch(0 0 0)')?.toHex()).toBe('#000000');
    });

    it('parses white', () => {
      expect(parseCSSColorFormatString('oklch(1 0 89.876)')?.toHex()).toBe('#ffffff');
    });

    it('parses gray', () => {
      expect(parseCSSColorFormatString('oklch(0.599871 0 89.876)')?.toHex()).toBe('#808080');
    });

    it('parses red', () => {
      expect(parseCSSColorFormatString('oklch(0.627955 0.257683 29.234)')?.toHex()).toBe('#ff0000');
    });

    it('parses green', () => {
      expect(parseCSSColorFormatString('oklch(0.86644 0.294827 142.495)')?.toHex()).toBe('#00ff00');
    });

    it('parses blue', () => {
      expect(parseCSSColorFormatString('oklch(0.452014 0.313214 264.052)')?.toHex()).toBe('#0000ff');
    });

    it('parses yellow', () => {
      expect(parseCSSColorFormatString('oklch(0.967983 0.211006 109.769)')?.toHex()).toBe('#ffff00');
    });

    it('parses cyan', () => {
      expect(parseCSSColorFormatString('oklch(0.905399 0.15455 194.769)')?.toHex()).toBe('#00ffff');
    });

    it('parses magenta', () => {
      expect(parseCSSColorFormatString('oklch(0.701674 0.322491 328.363)')?.toHex()).toBe('#ff00ff');
    });
  });

  describe('invalid inputs', () => {
    it('returns null for rgb(300,0,0)', () => {
      expect(parseCSSColorFormatString('rgb(300,0,0)')).toBeNull();
    });

    it('returns null for rgb(-1,0,0)', () => {
      expect(parseCSSColorFormatString('rgb(-1,0,0)')).toBeNull();
    });

    it('returns null for rgba(0,0,0,2)', () => {
      expect(parseCSSColorFormatString('rgba(0,0,0,2)')).toBeNull();
    });

    it('returns null for rgba(0,0,0,-0.1)', () => {
      expect(parseCSSColorFormatString('rgba(0,0,0,-0.1)')).toBeNull();
    });

    it('returns null for hsl(400,50%,50%)', () => {
      expect(parseCSSColorFormatString('hsl(400,50%,50%)')).toBeNull();
    });

    it('returns null for hsla(0,0%,0%,200%)', () => {
      expect(parseCSSColorFormatString('hsla(0,0%,0%,200%)')).toBeNull();
    });

    it('returns null for hsva(0,0%,0%)', () => {
      expect(parseCSSColorFormatString('hsva(0,0%,0%)')).toBeNull();
    });

    it('returns null for cmyk(0%,0%,0%)', () => {
      expect(parseCSSColorFormatString('cmyk(0%,0%,0%)')).toBeNull();
    });

    it('returns null for cmyk(0%,0%,0%,101%)', () => {
      expect(parseCSSColorFormatString('cmyk(0%,0%,0%,101%)')).toBeNull();
    });

    it('returns null for lch(120% 0 0)', () => {
      expect(parseCSSColorFormatString('lch(120% 0 0)')).toBeNull();
    });

    it('returns null for lch(50% 30)', () => {
      expect(parseCSSColorFormatString('lch(50% 30)')).toBeNull();
    });

    it('returns null for oklch(1.1 0 0)', () => {
      expect(parseCSSColorFormatString('oklch(1.1 0 0)')).toBeNull();
    });

    it('returns null for oklch(-0.1 0 0)', () => {
      expect(parseCSSColorFormatString('oklch(-0.1 0 0)')).toBeNull();
    });

    it('returns null for foo(1,2,3)', () => {
      expect(parseCSSColorFormatString('foo(1,2,3)')).toBeNull();
    });
  });
});

