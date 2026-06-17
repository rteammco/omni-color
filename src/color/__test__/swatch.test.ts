import { toHex, toRGBA } from '../conversions';
import { getColorSwatch } from '../swatch';

describe('getPaletteColorVariations', () => {
  describe('black', () => {
    it('returns grayscale steps', () => {
      const baseColor = toRGBA('#000000');
      const swatch = getColorSwatch(baseColor, {});
      expect(swatch.baseShade).toBe(500);
      expect(toHex(swatch[100])).toBe('#666666');
      expect(toHex(swatch[200])).toBe('#4d4d4d');
      expect(toHex(swatch[300])).toBe('#333333');
      expect(toHex(swatch[400])).toBe('#1a1a1a');
      expect(toHex(swatch[500])).toBe('#000000');
      expect(toHex(swatch[600])).toBe('#000000');
      expect(toHex(swatch[700])).toBe('#000000');
      expect(toHex(swatch[800])).toBe('#000000');
      expect(toHex(swatch[900])).toBe('#000000');
    });
  });

  describe('white', () => {
    it('returns darker grays for higher numbers', () => {
      const baseColor = toRGBA('#ffffff');
      const swatch = getColorSwatch(baseColor, undefined);
      expect(swatch.baseShade).toBe(500);
      expect(toHex(swatch[100])).toBe('#ffffff');
      expect(toHex(swatch[200])).toBe('#ffffff');
      expect(toHex(swatch[300])).toBe('#ffffff');
      expect(toHex(swatch[400])).toBe('#ffffff');
      expect(toHex(swatch[500])).toBe('#ffffff');
      expect(toHex(swatch[600])).toBe('#e6e6e6');
      expect(toHex(swatch[700])).toBe('#cccccc');
      expect(toHex(swatch[800])).toBe('#b3b3b3');
      expect(toHex(swatch[900])).toBe('#999999');
    });
  });

  describe('gray', () => {
    it('keeps shades neutral', () => {
      const baseColor = toRGBA('#808080');
      const swatch = getColorSwatch(baseColor, undefined);
      expect(swatch.baseShade).toBe(500);
      expect(toHex(swatch[100])).toBe('#e6e6e6');
      expect(toHex(swatch[200])).toBe('#cccccc');
      expect(toHex(swatch[300])).toBe('#b3b3b3');
      expect(toHex(swatch[400])).toBe('#9a9a9a');
      expect(toHex(swatch[500])).toBe('#808080');
      expect(toHex(swatch[600])).toBe('#676767');
      expect(toHex(swatch[700])).toBe('#4d4d4d');
      expect(toHex(swatch[800])).toBe('#343434');
      expect(toHex(swatch[900])).toBe('#1a1a1a');
    });
  });

  describe('dark navy', () => {
    it('spans from vibrant blue to black', () => {
      const baseColor = toRGBA('#123456');
      const swatch = getColorSwatch(baseColor, {});
      expect(swatch.baseShade).toBe(700);
      expect(toHex(swatch[100])).toBe('#9dcdfd');
      expect(toHex(swatch[200])).toBe('#6fb3f8');
      expect(toHex(swatch[300])).toBe('#449af0');
      expect(toHex(swatch[400])).toBe('#1b81e6');
      expect(toHex(swatch[500])).toBe('#1967b5');
      expect(toHex(swatch[600])).toBe('#174e84');
      expect(toHex(swatch[700])).toBe('#123456');
      expect(toHex(swatch[800])).toBe('#0a1a2b');
      expect(toHex(swatch[900])).toBe('#000102');
    });
  });

  describe('pastel blue', () => {
    it('lightens up to white and darkens gradually', () => {
      const baseColor = toRGBA('#abcdef');
      const swatch = getColorSwatch(baseColor, undefined);
      expect(swatch.baseShade).toBe(300);
      expect(toHex(swatch[100])).toBe('#ffffff');
      expect(toHex(swatch[200])).toBe('#d5e7f8');
      expect(toHex(swatch[300])).toBe('#abcdef');
      expect(toHex(swatch[400])).toBe('#84b3e3');
      expect(toHex(swatch[500])).toBe('#5f9ad5');
      expect(toHex(swatch[600])).toBe('#3d81c4');
      expect(toHex(swatch[700])).toBe('#366798');
      expect(toHex(swatch[800])).toBe('#2c4e6f');
      expect(toHex(swatch[900])).toBe('#203448');
    });
  });

  describe('red', () => {
    it('creates a classic red palette', () => {
      const baseColor = toRGBA('#ff0000');
      const swatch = getColorSwatch(baseColor, {});
      expect(swatch.baseShade).toBe(500);
      expect(toHex(swatch[100])).toBe('#ffcccc');
      expect(toHex(swatch[200])).toBe('#ff9999');
      expect(toHex(swatch[300])).toBe('#ff6666');
      expect(toHex(swatch[400])).toBe('#ff3333');
      expect(toHex(swatch[500])).toBe('#ff0000');
      expect(toHex(swatch[600])).toBe('#c70505');
      expect(toHex(swatch[700])).toBe('#910808');
      expect(toHex(swatch[800])).toBe('#5e0808');
      expect(toHex(swatch[900])).toBe('#2e0505');
    });
  });

  describe('green', () => {
    it('creates a classic green palette', () => {
      const baseColor = toRGBA('#00ff00');
      const swatch = getColorSwatch(baseColor, undefined);
      expect(swatch.baseShade).toBe(500);
      expect(toHex(swatch[100])).toBe('#ccffcc');
      expect(toHex(swatch[200])).toBe('#99ff99');
      expect(toHex(swatch[300])).toBe('#66ff66');
      expect(toHex(swatch[400])).toBe('#33ff33');
      expect(toHex(swatch[500])).toBe('#00ff00');
      expect(toHex(swatch[600])).toBe('#05c705');
      expect(toHex(swatch[700])).toBe('#089108');
      expect(toHex(swatch[800])).toBe('#085e08');
      expect(toHex(swatch[900])).toBe('#052e05');
    });
  });

  describe('blue', () => {
    it('creates a classic blue palette', () => {
      const baseColor = toRGBA('#0000ff');
      const swatch = getColorSwatch(baseColor, undefined);
      expect(swatch.baseShade).toBe(500);
      expect(toHex(swatch[100])).toBe('#ccccff');
      expect(toHex(swatch[200])).toBe('#9999ff');
      expect(toHex(swatch[300])).toBe('#6666ff');
      expect(toHex(swatch[400])).toBe('#3333ff');
      expect(toHex(swatch[500])).toBe('#0000ff');
      expect(toHex(swatch[600])).toBe('#0505c7');
      expect(toHex(swatch[700])).toBe('#080891');
      expect(toHex(swatch[800])).toBe('#08085e');
      expect(toHex(swatch[900])).toBe('#05052e');
    });
  });

  describe('greyish teal', () => {
    it('retains its muted character', () => {
      const baseColor = toRGBA('#7f8c8d');
      const swatch = getColorSwatch(baseColor, undefined);
      expect(swatch.baseShade).toBe(500);
      expect(toHex(swatch[100])).toBe('#e7f0f1');
      expect(toHex(swatch[200])).toBe('#c9dadc');
      expect(toHex(swatch[300])).toBe('#aec2c4');
      expect(toHex(swatch[400])).toBe('#95a8aa');
      expect(toHex(swatch[500])).toBe('#7f8c8d');
      expect(toHex(swatch[600])).toBe('#6c6d6d');
      expect(toHex(swatch[700])).toBe('#535353');
      expect(toHex(swatch[800])).toBe('#3a3a3a');
      expect(toHex(swatch[900])).toBe('#202020');
    });
  });

  describe('brand blue', () => {
    it('spans a useful design range', () => {
      const baseColor = toRGBA('#3498db');
      const swatch = getColorSwatch(baseColor, {});
      expect(swatch.baseShade).toBe(500);
      expect(toHex(swatch[100])).toBe('#def1fd');
      expect(toHex(swatch[200])).toBe('#b0dbf8');
      expect(toHex(swatch[300])).toBe('#84c5f1');
      expect(toHex(swatch[400])).toBe('#5bafe7');
      expect(toHex(swatch[500])).toBe('#3498db');
      expect(toHex(swatch[600])).toBe('#277cb5');
      expect(toHex(swatch[700])).toBe('#225e87');
      expect(toHex(swatch[800])).toBe('#1b415b');
      expect(toHex(swatch[900])).toBe('#112532');
    });
  });

  describe('swatch metadata', () => {
    it('labels swatches by type', () => {
      const baseColor = toRGBA('#3498db');
      const baseSwatch = getColorSwatch(baseColor, undefined);
      const extendedSwatch = getColorSwatch(baseColor, { extended: true });

      expect(baseSwatch.type).toBe('BASE');
      expect(baseSwatch.baseShade).toBe(500);
      expect(extendedSwatch.type).toBe('EXTENDED');
      expect(extendedSwatch.baseShade).toBe(500);
    });
  });

  describe('centering options', () => {
    it('can force centering on 500 even for very dark colors', () => {
      const baseColor = toRGBA('#123456');
      const swatch = getColorSwatch(baseColor, { centerOn500: true });

      expect(swatch.baseShade).toBe(500);
      expect(toHex(swatch[100])).toBe('#449af0');
      expect(toHex(swatch[200])).toBe('#1b81e6');
      expect(toHex(swatch[300])).toBe('#1967b5');
      expect(toHex(swatch[400])).toBe('#174e84');
      expect(toHex(swatch[500])).toBe('#123456');
      expect(toHex(swatch[600])).toBe('#0a1a2b');
      expect(toHex(swatch[700])).toBe('#000102');
      expect(toHex(swatch[800])).toBe('#000000');
      expect(toHex(swatch[900])).toBe('#000000');
    });
  });

  describe('extended swatches', () => {
    it('includes intermediate stops while preserving the base anchors', () => {
      const baseColor = toRGBA('#ff0000');
      const swatch = getColorSwatch(baseColor, { extended: true });

      expect(swatch.baseShade).toBe(500);
      expect(toHex(swatch[50])).toBe('#ffe5e5');
      expect(toHex(swatch[100])).toBe('#ffcccc');
      expect(toHex(swatch[150])).toBe('#ffb3b3');
      expect(toHex(swatch[200])).toBe('#ff9999');
      expect(toHex(swatch[250])).toBe('#ff8080');
      expect(toHex(swatch[300])).toBe('#ff6666');
      expect(toHex(swatch[350])).toBe('#ff4d4d');
      expect(toHex(swatch[400])).toBe('#ff3333');
      expect(toHex(swatch[450])).toBe('#ff1a1a');
      expect(toHex(swatch[500])).toBe('#ff0000');
      expect(toHex(swatch[550])).toBe('#e30303');
      expect(toHex(swatch[600])).toBe('#c70505');
      expect(toHex(swatch[650])).toBe('#ac0707');
      expect(toHex(swatch[700])).toBe('#910808');
      expect(toHex(swatch[750])).toBe('#780808');
      expect(toHex(swatch[800])).toBe('#5e0808');
      expect(toHex(swatch[850])).toBe('#460707');
      expect(toHex(swatch[900])).toBe('#2e0505');
      expect(toHex(swatch[950])).toBe('#170303');
    });

    it('smoothly interpolates neutral colors', () => {
      const baseColor = toRGBA('#808080');
      const swatch = getColorSwatch(baseColor, { extended: true });

      expect(swatch.baseShade).toBe(500);
      expect(toHex(swatch[50])).toBe('#f3f3f3');
      expect(toHex(swatch[100])).toBe('#e6e6e6');
      expect(toHex(swatch[150])).toBe('#d9d9d9');
      expect(toHex(swatch[200])).toBe('#cccccc');
      expect(toHex(swatch[250])).toBe('#c0c0c0');
      expect(toHex(swatch[300])).toBe('#b3b3b3');
      expect(toHex(swatch[350])).toBe('#a6a6a6');
      expect(toHex(swatch[400])).toBe('#9a9a9a');
      expect(toHex(swatch[450])).toBe('#8d8d8d');
      expect(toHex(swatch[500])).toBe('#808080');
      expect(toHex(swatch[550])).toBe('#737373');
      expect(toHex(swatch[600])).toBe('#676767');
      expect(toHex(swatch[650])).toBe('#5a5a5a');
      expect(toHex(swatch[700])).toBe('#4d4d4d');
      expect(toHex(swatch[750])).toBe('#404040');
      expect(toHex(swatch[800])).toBe('#343434');
      expect(toHex(swatch[850])).toBe('#272727');
      expect(toHex(swatch[900])).toBe('#1a1a1a');
      expect(toHex(swatch[950])).toBe('#0d0d0d');
    });

    it('matches anchor shades between base and extended swatches', () => {
      const baseColor = toRGBA('#3498db');
      const baseSwatch = getColorSwatch(baseColor, {});
      const extendedSwatch = getColorSwatch(baseColor, { extended: true });

      expect(extendedSwatch.baseShade).toBe(baseSwatch.baseShade);
      expect(toHex(extendedSwatch[100])).toBe(toHex(baseSwatch[100]));
      expect(toHex(extendedSwatch[200])).toBe(toHex(baseSwatch[200]));
      expect(toHex(extendedSwatch[300])).toBe(toHex(baseSwatch[300]));
      expect(toHex(extendedSwatch[400])).toBe(toHex(baseSwatch[400]));
      expect(toHex(extendedSwatch[500])).toBe(toHex(baseSwatch[500]));
      expect(toHex(extendedSwatch[600])).toBe(toHex(baseSwatch[600]));
      expect(toHex(extendedSwatch[700])).toBe(toHex(baseSwatch[700]));
      expect(toHex(extendedSwatch[800])).toBe(toHex(baseSwatch[800]));
      expect(toHex(extendedSwatch[900])).toBe(toHex(baseSwatch[900]));
    });
  });

  describe('alpha preservation', () => {
    it('keeps the base alpha for all generated stops', () => {
      const baseColor = toRGBA({ r: 52, g: 152, b: 219, a: 0.4 });
      const swatch = getColorSwatch(baseColor, { extended: true });

      expect(swatch.baseShade).toBe(500);
      expect(swatch[300].a).toBeCloseTo(0.4, 5);
      expect(swatch[500].a).toBeCloseTo(0.4, 5);
      expect(swatch[700].a).toBeCloseTo(0.4, 5);
      expect(swatch[900].a).toBeCloseTo(0.4, 5);
    });
  });
});
