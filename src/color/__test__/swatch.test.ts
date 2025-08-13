import { Color } from '../color';
import { getColorSwatch } from '../swatch';

describe('getPaletteColorVariations', () => {
  describe('black', () => {
    it('returns grayscale steps', () => {
      const baseColor = new Color('#000000');
      const swatch = getColorSwatch(baseColor);
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
      expect(swatch[100].toHex()).toBe('#e6e6e6');
      expect(swatch[200].toHex()).toBe('#cccccc');
      expect(swatch[300].toHex()).toBe('#b3b3b3');
      expect(swatch[400].toHex()).toBe('#999999');
      expect(swatch[500].toHex()).toBe('#808080');
      expect(swatch[600].toHex()).toBe('#666666');
      expect(swatch[700].toHex()).toBe('#4d4d4d');
      expect(swatch[800].toHex()).toBe('#333333');
      expect(swatch[900].toHex()).toBe('#1a1a1a');
    });
  });

  describe('dark navy', () => {
    it('spans from vibrant blue to black', () => {
      const baseColor = new Color('#123456');
      const swatch = getColorSwatch(baseColor);
      expect(swatch[100].toHex()).toBe('#4299f0');
      expect(swatch[200].toHex()).toBe('#1980e6');
      expect(swatch[300].toHex()).toBe('#1966b3');
      expect(swatch[400].toHex()).toBe('#174d82');
      expect(swatch[500].toHex()).toBe('#123456');
      expect(swatch[600].toHex()).toBe('#0a1a29');
      expect(swatch[700].toHex()).toBe('#000000');
      expect(swatch[800].toHex()).toBe('#000000');
      expect(swatch[900].toHex()).toBe('#000000');
    });
  });

  describe('pastel blue', () => {
    it('lightens up to white and darkens gradually', () => {
      const baseColor = new Color('#abcdef');
      const swatch = getColorSwatch(baseColor);
      expect(swatch[100].toHex()).toBe('#ffffff');
      expect(swatch[200].toHex()).toBe('#ffffff');
      expect(swatch[300].toHex()).toBe('#ffffff');
      expect(swatch[400].toHex()).toBe('#d3e6f8');
      expect(swatch[500].toHex()).toBe('#abcdef');
      expect(swatch[600].toHex()).toBe('#82b3e3');
      expect(swatch[700].toHex()).toBe('#5e99d4');
      expect(swatch[800].toHex()).toBe('#3c80c3');
      expect(swatch[900].toHex()).toBe('#356697');
    });
  });

  describe('red', () => {
    it('creates a classic red palette', () => {
      const baseColor = new Color('#ff0000');
      const swatch = getColorSwatch(baseColor);
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
      expect(swatch[100].toHex()).toBe('#e9f1f2');
      expect(swatch[200].toHex()).toBe('#cbdcdd');
      expect(swatch[300].toHex()).toBe('#afc4c5');
      expect(swatch[400].toHex()).toBe('#96aaab');
      expect(swatch[500].toHex()).toBe('#7f8c8d');
      expect(swatch[600].toHex()).toBe('#6d6f6f');
      expect(swatch[700].toHex()).toBe('#545454');
      expect(swatch[800].toHex()).toBe('#3b3b3b');
      expect(swatch[900].toHex()).toBe('#212121');
    });
  });

  describe('brand blue', () => {
    it('spans a useful design range', () => {
      const baseColor = new Color('#3498db');
      const swatch = getColorSwatch(baseColor);
      expect(swatch[100].toHex()).toBe('#ddf0fd');
      expect(swatch[200].toHex()).toBe('#afdbf8');
      expect(swatch[300].toHex()).toBe('#83c5f1');
      expect(swatch[400].toHex()).toBe('#5aafe7');
      expect(swatch[500].toHex()).toBe('#3498db');
      expect(swatch[600].toHex()).toBe('#267cb5');
      expect(swatch[700].toHex()).toBe('#225e87');
      expect(swatch[800].toHex()).toBe('#1a415b');
      expect(swatch[900].toHex()).toBe('#112432');
    });
  });
});
