import { Color } from '../color';

describe('getPaletteColorVariations', () => {
  describe('black', () => {
    it('returns grayscale steps', () => {
      const base = new Color('#000000');
      const palette = base.getPaletteColorVariations();
      expect(palette[100].toHex()).toBe('#666666');
      expect(palette[200].toHex()).toBe('#4d4d4d');
      expect(palette[300].toHex()).toBe('#333333');
      expect(palette[400].toHex()).toBe('#1a1a1a');
      expect(palette[500].toHex()).toBe('#000000');
      expect(palette[600].toHex()).toBe('#000000');
      expect(palette[700].toHex()).toBe('#000000');
      expect(palette[800].toHex()).toBe('#000000');
      expect(palette[900].toHex()).toBe('#000000');
    });
  });

  describe('white', () => {
    it('returns darker grays for higher numbers', () => {
      const base = new Color('#ffffff');
      const palette = base.getPaletteColorVariations();
      expect(palette[100].toHex()).toBe('#ffffff');
      expect(palette[200].toHex()).toBe('#ffffff');
      expect(palette[300].toHex()).toBe('#ffffff');
      expect(palette[400].toHex()).toBe('#ffffff');
      expect(palette[500].toHex()).toBe('#ffffff');
      expect(palette[600].toHex()).toBe('#e6e6e6');
      expect(palette[700].toHex()).toBe('#cccccc');
      expect(palette[800].toHex()).toBe('#b3b3b3');
      expect(palette[900].toHex()).toBe('#999999');
    });
  });

  describe('gray', () => {
    it('keeps shades neutral', () => {
      const base = new Color('#808080');
      const palette = base.getPaletteColorVariations();
      expect(palette[100].toHex()).toBe('#e6e6e6');
      expect(palette[200].toHex()).toBe('#cccccc');
      expect(palette[300].toHex()).toBe('#b3b3b3');
      expect(palette[400].toHex()).toBe('#999999');
      expect(palette[500].toHex()).toBe('#808080');
      expect(palette[600].toHex()).toBe('#666666');
      expect(palette[700].toHex()).toBe('#4d4d4d');
      expect(palette[800].toHex()).toBe('#333333');
      expect(palette[900].toHex()).toBe('#1a1a1a');
    });
  });

  describe('dark navy', () => {
    it('spans from vibrant blue to black', () => {
      const base = new Color('#123456');
      const palette = base.getPaletteColorVariations();
      expect(palette[100].toHex()).toBe('#4299f0');
      expect(palette[200].toHex()).toBe('#1980e6');
      expect(palette[300].toHex()).toBe('#1966b3');
      expect(palette[400].toHex()).toBe('#174d82');
      expect(palette[500].toHex()).toBe('#123456');
      expect(palette[600].toHex()).toBe('#0a1a29');
      expect(palette[700].toHex()).toBe('#000000');
      expect(palette[800].toHex()).toBe('#000000');
      expect(palette[900].toHex()).toBe('#000000');
    });
  });

  describe('pastel blue', () => {
    it('lightens up to white and darkens gradually', () => {
      const base = new Color('#abcdef');
      const palette = base.getPaletteColorVariations();
      expect(palette[100].toHex()).toBe('#ffffff');
      expect(palette[200].toHex()).toBe('#ffffff');
      expect(palette[300].toHex()).toBe('#ffffff');
      expect(palette[400].toHex()).toBe('#d3e6f8');
      expect(palette[500].toHex()).toBe('#abcdef');
      expect(palette[600].toHex()).toBe('#82b3e3');
      expect(palette[700].toHex()).toBe('#5e99d4');
      expect(palette[800].toHex()).toBe('#3c80c3');
      expect(palette[900].toHex()).toBe('#356697');
    });
  });

  describe('red', () => {
    it('creates a classic red palette', () => {
      const base = new Color('#ff0000');
      const palette = base.getPaletteColorVariations();
      expect(palette[100].toHex()).toBe('#ffcccc');
      expect(palette[200].toHex()).toBe('#ff9999');
      expect(palette[300].toHex()).toBe('#ff6666');
      expect(palette[400].toHex()).toBe('#ff3333');
      expect(palette[500].toHex()).toBe('#ff0000');
      expect(palette[600].toHex()).toBe('#c70505');
      expect(palette[700].toHex()).toBe('#910808');
      expect(palette[800].toHex()).toBe('#5e0808');
      expect(palette[900].toHex()).toBe('#2e0505');
    });
  });

  describe('green', () => {
    it('creates a classic green palette', () => {
      const base = new Color('#00ff00');
      const palette = base.getPaletteColorVariations();
      expect(palette[100].toHex()).toBe('#ccffcc');
      expect(palette[200].toHex()).toBe('#99ff99');
      expect(palette[300].toHex()).toBe('#66ff66');
      expect(palette[400].toHex()).toBe('#33ff33');
      expect(palette[500].toHex()).toBe('#00ff00');
      expect(palette[600].toHex()).toBe('#05c705');
      expect(palette[700].toHex()).toBe('#089108');
      expect(palette[800].toHex()).toBe('#085e08');
      expect(palette[900].toHex()).toBe('#052e05');
    });
  });

  describe('blue', () => {
    it('creates a classic blue palette', () => {
      const base = new Color('#0000ff');
      const palette = base.getPaletteColorVariations();
      expect(palette[100].toHex()).toBe('#ccccff');
      expect(palette[200].toHex()).toBe('#9999ff');
      expect(palette[300].toHex()).toBe('#6666ff');
      expect(palette[400].toHex()).toBe('#3333ff');
      expect(palette[500].toHex()).toBe('#0000ff');
      expect(palette[600].toHex()).toBe('#0505c7');
      expect(palette[700].toHex()).toBe('#080891');
      expect(palette[800].toHex()).toBe('#08085e');
      expect(palette[900].toHex()).toBe('#05052e');
    });
  });

  describe('greyish teal', () => {
    it('retains its muted character', () => {
      const base = new Color('#7f8c8d');
      const palette = base.getPaletteColorVariations();
      expect(palette[100].toHex()).toBe('#e9f1f2');
      expect(palette[200].toHex()).toBe('#cbdcdd');
      expect(palette[300].toHex()).toBe('#afc4c5');
      expect(palette[400].toHex()).toBe('#96aaab');
      expect(palette[500].toHex()).toBe('#7f8c8d');
      expect(palette[600].toHex()).toBe('#6d6f6f');
      expect(palette[700].toHex()).toBe('#545454');
      expect(palette[800].toHex()).toBe('#3b3b3b');
      expect(palette[900].toHex()).toBe('#212121');
    });
  });

  describe('brand blue', () => {
    it('spans a useful design range', () => {
      const base = new Color('#3498db');
      const palette = base.getPaletteColorVariations();
      expect(palette[100].toHex()).toBe('#ddf0fd');
      expect(palette[200].toHex()).toBe('#afdbf8');
      expect(palette[300].toHex()).toBe('#83c5f1');
      expect(palette[400].toHex()).toBe('#5aafe7');
      expect(palette[500].toHex()).toBe('#3498db');
      expect(palette[600].toHex()).toBe('#267cb5');
      expect(palette[700].toHex()).toBe('#225e87');
      expect(palette[800].toHex()).toBe('#1a415b');
      expect(palette[900].toHex()).toBe('#112432');
    });
  });
});
