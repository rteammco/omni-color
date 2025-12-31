import { Color } from '../color';
import { getColorSwatch } from '../swatch';

describe('getPaletteColorVariations', () => {
  describe('black', () => {
    it('returns grayscale steps', () => {
      const baseColor = new Color('#000000');
      const swatch = getColorSwatch(baseColor);
      expect(swatch.mainStop).toBe(500);
      expect(swatch[100].toHex()).toBe('#666666');
      expect(swatch[200].toHex()).toBe('#4d4d4d');
      expect(swatch[300].toHex()).toBe('#333333');
      expect(swatch[400].toHex()).toBe('#1a1a1a');
      expect(swatch[500].toHex()).toBe('#000000');
      expect(swatch[600].toHex()).toBe('#000000');
      expect(swatch[700].toHex()).toBe('#000000');
      expect(swatch[800].toHex()).toBe('#000000');
      expect(swatch[900].toHex()).toBe('#000000');
    });
  });

  describe('white', () => {
    it('returns darker grays for higher numbers', () => {
      const baseColor = new Color('#ffffff');
      const swatch = getColorSwatch(baseColor);
      expect(swatch.mainStop).toBe(500);
      expect(swatch[100].toHex()).toBe('#ffffff');
      expect(swatch[200].toHex()).toBe('#ffffff');
      expect(swatch[300].toHex()).toBe('#ffffff');
      expect(swatch[400].toHex()).toBe('#ffffff');
      expect(swatch[500].toHex()).toBe('#ffffff');
      expect(swatch[600].toHex()).toBe('#e6e6e6');
      expect(swatch[700].toHex()).toBe('#cccccc');
      expect(swatch[800].toHex()).toBe('#b3b3b3');
      expect(swatch[900].toHex()).toBe('#999999');
    });
  });

  describe('gray', () => {
    it('keeps shades neutral', () => {
      const baseColor = new Color('#808080');
      const swatch = getColorSwatch(baseColor);
      expect(swatch.mainStop).toBe(500);
      expect(swatch[100].toHex()).toBe('#e6e6e6');
      expect(swatch[200].toHex()).toBe('#cccccc');
      expect(swatch[300].toHex()).toBe('#b3b3b3');
      expect(swatch[400].toHex()).toBe('#9a9a9a');
      expect(swatch[500].toHex()).toBe('#808080');
      expect(swatch[600].toHex()).toBe('#676767');
      expect(swatch[700].toHex()).toBe('#4d4d4d');
      expect(swatch[800].toHex()).toBe('#343434');
      expect(swatch[900].toHex()).toBe('#1a1a1a');
    });
  });

  describe('dark navy', () => {
    it('spans from vibrant blue to black', () => {
      const baseColor = new Color('#123456');
      const swatch = getColorSwatch(baseColor);
      expect(swatch.mainStop).toBe(700);
      expect(swatch[100].toHex()).toBe('#9dcdfd');
      expect(swatch[200].toHex()).toBe('#6fb3f8');
      expect(swatch[300].toHex()).toBe('#449af0');
      expect(swatch[400].toHex()).toBe('#1b81e6');
      expect(swatch[500].toHex()).toBe('#1967b5');
      expect(swatch[600].toHex()).toBe('#174e84');
      expect(swatch[700].toHex()).toBe('#123456');
      expect(swatch[800].toHex()).toBe('#0a1a2b');
      expect(swatch[900].toHex()).toBe('#000102');
    });
  });

  describe('pastel blue', () => {
    it('lightens up to white and darkens gradually', () => {
      const baseColor = new Color('#abcdef');
      const swatch = getColorSwatch(baseColor);
      expect(swatch.mainStop).toBe(300);
      expect(swatch[100].toHex()).toBe('#ffffff');
      expect(swatch[200].toHex()).toBe('#d5e7f8');
      expect(swatch[300].toHex()).toBe('#abcdef');
      expect(swatch[400].toHex()).toBe('#84b3e3');
      expect(swatch[500].toHex()).toBe('#5f9ad5');
      expect(swatch[600].toHex()).toBe('#3d81c4');
      expect(swatch[700].toHex()).toBe('#366798');
      expect(swatch[800].toHex()).toBe('#2c4e6f');
      expect(swatch[900].toHex()).toBe('#203448');
    });
  });

  describe('red', () => {
    it('creates a classic red palette', () => {
      const baseColor = new Color('#ff0000');
      const swatch = getColorSwatch(baseColor);
      expect(swatch.mainStop).toBe(500);
      expect(swatch[100].toHex()).toBe('#ffcccc');
      expect(swatch[200].toHex()).toBe('#ff9999');
      expect(swatch[300].toHex()).toBe('#ff6666');
      expect(swatch[400].toHex()).toBe('#ff3333');
      expect(swatch[500].toHex()).toBe('#ff0000');
      expect(swatch[600].toHex()).toBe('#c70505');
      expect(swatch[700].toHex()).toBe('#910808');
      expect(swatch[800].toHex()).toBe('#5e0808');
      expect(swatch[900].toHex()).toBe('#2e0505');
    });
  });

  describe('green', () => {
    it('creates a classic green palette', () => {
      const baseColor = new Color('#00ff00');
      const swatch = getColorSwatch(baseColor);
      expect(swatch.mainStop).toBe(500);
      expect(swatch[100].toHex()).toBe('#ccffcc');
      expect(swatch[200].toHex()).toBe('#99ff99');
      expect(swatch[300].toHex()).toBe('#66ff66');
      expect(swatch[400].toHex()).toBe('#33ff33');
      expect(swatch[500].toHex()).toBe('#00ff00');
      expect(swatch[600].toHex()).toBe('#05c705');
      expect(swatch[700].toHex()).toBe('#089108');
      expect(swatch[800].toHex()).toBe('#085e08');
      expect(swatch[900].toHex()).toBe('#052e05');
    });
  });

  describe('blue', () => {
    it('creates a classic blue palette', () => {
      const baseColor = new Color('#0000ff');
      const swatch = getColorSwatch(baseColor);
      expect(swatch.mainStop).toBe(500);
      expect(swatch[100].toHex()).toBe('#ccccff');
      expect(swatch[200].toHex()).toBe('#9999ff');
      expect(swatch[300].toHex()).toBe('#6666ff');
      expect(swatch[400].toHex()).toBe('#3333ff');
      expect(swatch[500].toHex()).toBe('#0000ff');
      expect(swatch[600].toHex()).toBe('#0505c7');
      expect(swatch[700].toHex()).toBe('#080891');
      expect(swatch[800].toHex()).toBe('#08085e');
      expect(swatch[900].toHex()).toBe('#05052e');
    });
  });

  describe('greyish teal', () => {
    it('retains its muted character', () => {
      const baseColor = new Color('#7f8c8d');
      const swatch = getColorSwatch(baseColor);
      expect(swatch.mainStop).toBe(500);
      expect(swatch[100].toHex()).toBe('#e7f0f1');
      expect(swatch[200].toHex()).toBe('#c9dadc');
      expect(swatch[300].toHex()).toBe('#aec2c4');
      expect(swatch[400].toHex()).toBe('#95a8aa');
      expect(swatch[500].toHex()).toBe('#7f8c8d');
      expect(swatch[600].toHex()).toBe('#6c6d6d');
      expect(swatch[700].toHex()).toBe('#535353');
      expect(swatch[800].toHex()).toBe('#3a3a3a');
      expect(swatch[900].toHex()).toBe('#202020');
    });
  });

  describe('brand blue', () => {
    it('spans a useful design range', () => {
      const baseColor = new Color('#3498db');
      const swatch = getColorSwatch(baseColor);
      expect(swatch.mainStop).toBe(500);
      expect(swatch[100].toHex()).toBe('#def1fd');
      expect(swatch[200].toHex()).toBe('#b0dbf8');
      expect(swatch[300].toHex()).toBe('#84c5f1');
      expect(swatch[400].toHex()).toBe('#5bafe7');
      expect(swatch[500].toHex()).toBe('#3498db');
      expect(swatch[600].toHex()).toBe('#277cb5');
      expect(swatch[700].toHex()).toBe('#225e87');
      expect(swatch[800].toHex()).toBe('#1b415b');
      expect(swatch[900].toHex()).toBe('#112532');
    });
  });

  describe('swatch metadata', () => {
    it('labels swatches by type', () => {
      const baseColor = new Color('#3498db');
      const basicSwatch = getColorSwatch(baseColor);
      const extendedSwatch = getColorSwatch(baseColor, { extended: true });

      expect(basicSwatch.type).toBe('BASIC');
      expect(basicSwatch.mainStop).toBe(500);
      expect(extendedSwatch.type).toBe('EXTENDED');
      expect(extendedSwatch.mainStop).toBe(500);
    });
  });

  describe('centering options', () => {
    it('can force centering on 500 even for very dark colors', () => {
      const baseColor = new Color('#123456');
      const swatch = getColorSwatch(baseColor, { centerOn500: true });

      expect(swatch.mainStop).toBe(500);
      expect(swatch[100].toHex()).toBe('#449af0');
      expect(swatch[200].toHex()).toBe('#1b81e6');
      expect(swatch[300].toHex()).toBe('#1967b5');
      expect(swatch[400].toHex()).toBe('#174e84');
      expect(swatch[500].toHex()).toBe('#123456');
      expect(swatch[600].toHex()).toBe('#0a1a2b');
      expect(swatch[700].toHex()).toBe('#000102');
      expect(swatch[800].toHex()).toBe('#000000');
      expect(swatch[900].toHex()).toBe('#000000');
    });
  });

  describe('extended swatches', () => {
    it('includes intermediate stops while preserving the base anchors', () => {
      const baseColor = new Color('#ff0000');
      const swatch = getColorSwatch(baseColor, { extended: true });

      expect(swatch.mainStop).toBe(500);
      expect(swatch[50].toHex()).toBe('#ffe5e5');
      expect(swatch[100].toHex()).toBe('#ffcccc');
      expect(swatch[150].toHex()).toBe('#ffb3b3');
      expect(swatch[200].toHex()).toBe('#ff9999');
      expect(swatch[250].toHex()).toBe('#ff8080');
      expect(swatch[300].toHex()).toBe('#ff6666');
      expect(swatch[350].toHex()).toBe('#ff4d4d');
      expect(swatch[400].toHex()).toBe('#ff3333');
      expect(swatch[450].toHex()).toBe('#ff1a1a');
      expect(swatch[500].toHex()).toBe('#ff0000');
      expect(swatch[550].toHex()).toBe('#e30303');
      expect(swatch[600].toHex()).toBe('#c70505');
      expect(swatch[650].toHex()).toBe('#ac0707');
      expect(swatch[700].toHex()).toBe('#910808');
      expect(swatch[750].toHex()).toBe('#780808');
      expect(swatch[800].toHex()).toBe('#5e0808');
      expect(swatch[850].toHex()).toBe('#460707');
      expect(swatch[900].toHex()).toBe('#2e0505');
      expect(swatch[950].toHex()).toBe('#170303');
    });

    it('smoothly interpolates neutral colors', () => {
      const baseColor = new Color('#808080');
      const swatch = getColorSwatch(baseColor, { extended: true });

      expect(swatch.mainStop).toBe(500);
      expect(swatch[50].toHex()).toBe('#f3f3f3');
      expect(swatch[100].toHex()).toBe('#e6e6e6');
      expect(swatch[150].toHex()).toBe('#d9d9d9');
      expect(swatch[200].toHex()).toBe('#cccccc');
      expect(swatch[250].toHex()).toBe('#c0c0c0');
      expect(swatch[300].toHex()).toBe('#b3b3b3');
      expect(swatch[350].toHex()).toBe('#a6a6a6');
      expect(swatch[400].toHex()).toBe('#9a9a9a');
      expect(swatch[450].toHex()).toBe('#8d8d8d');
      expect(swatch[500].toHex()).toBe('#808080');
      expect(swatch[550].toHex()).toBe('#737373');
      expect(swatch[600].toHex()).toBe('#676767');
      expect(swatch[650].toHex()).toBe('#5a5a5a');
      expect(swatch[700].toHex()).toBe('#4d4d4d');
      expect(swatch[750].toHex()).toBe('#404040');
      expect(swatch[800].toHex()).toBe('#343434');
      expect(swatch[850].toHex()).toBe('#272727');
      expect(swatch[900].toHex()).toBe('#1a1a1a');
      expect(swatch[950].toHex()).toBe('#0d0d0d');
    });

    it('matches anchor shades between base and extended swatches', () => {
      const baseColor = new Color('#3498db');
      const baseSwatch = getColorSwatch(baseColor);
      const extendedSwatch = getColorSwatch(baseColor, { extended: true });

      expect(extendedSwatch.mainStop).toBe(baseSwatch.mainStop);
      expect(extendedSwatch[100].toHex()).toBe(baseSwatch[100].toHex());
      expect(extendedSwatch[200].toHex()).toBe(baseSwatch[200].toHex());
      expect(extendedSwatch[300].toHex()).toBe(baseSwatch[300].toHex());
      expect(extendedSwatch[400].toHex()).toBe(baseSwatch[400].toHex());
      expect(extendedSwatch[500].toHex()).toBe(baseSwatch[500].toHex());
      expect(extendedSwatch[600].toHex()).toBe(baseSwatch[600].toHex());
      expect(extendedSwatch[700].toHex()).toBe(baseSwatch[700].toHex());
      expect(extendedSwatch[800].toHex()).toBe(baseSwatch[800].toHex());
      expect(extendedSwatch[900].toHex()).toBe(baseSwatch[900].toHex());
    });
  });

  describe('alpha preservation', () => {
    it('keeps the base alpha for all generated stops', () => {
      const baseColor = new Color('rgba(52, 152, 219, 0.4)');
      const swatch = getColorSwatch(baseColor, { extended: true });

      expect(swatch.mainStop).toBe(500);
      expect(swatch[300].toRGBA().a).toBeCloseTo(0.4, 5);
      expect(swatch[500].toRGBA().a).toBeCloseTo(0.4, 5);
      expect(swatch[700].toRGBA().a).toBeCloseTo(0.4, 5);
      expect(swatch[900].toRGBA().a).toBeCloseTo(0.4, 5);
    });
  });
});
