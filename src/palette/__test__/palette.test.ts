import { Color } from '../../color/color';
import { generateColorPaletteFromBaseColor } from '../palette';

describe('generateColorPaletteFromBaseColor()', () => {
  it('harmonizes neutrals with the base color', () => {
    const baseColor = new Color('#ff0000');
    const palette = generateColorPaletteFromBaseColor(baseColor);

    expect(palette.neutrals[100].toHex()).toBe('#ededed');
    expect(palette.neutrals[500].toHex()).toBe('#888888');
    expect(palette.neutrals[900].toHex()).toBe('#212121');

    expect(palette.tintedNeutrals[100].toHex()).toBe('#f6efee');
    expect(palette.tintedNeutrals[500].toHex()).toBe('#988380');
    expect(palette.tintedNeutrals[900].toHex()).toBe('#262626');
  });

  describe('neutral harmonization across many base colors', () => {
    it('creates neutrals and tinted neutrals for a broad spectrum', () => {
      const red = new Color('#ff0000');
      const redPalette = generateColorPaletteFromBaseColor(red);
      expect(redPalette.neutrals[500].toHex()).toBe('#888888');
      expect(redPalette.tintedNeutrals[500].toHex()).toBe('#988380');

      const orange = new Color('#ffa500');
      const orangePalette = generateColorPaletteFromBaseColor(orange);
      expect(orangePalette.neutrals[500].toHex()).toBe('#bbbbbb');
      expect(orangePalette.tintedNeutrals[500].toHex()).toBe('#c3bab0');

      const yellow = new Color('#ffff00');
      const yellowPalette = generateColorPaletteFromBaseColor(yellow);
      expect(yellowPalette.neutrals[500].toHex()).toBe('#f4f4f4');
      expect(yellowPalette.tintedNeutrals[500].toHex()).toBe('#f5f6e6');

      const green = new Color('#00ff00');
      const greenPalette = generateColorPaletteFromBaseColor(green);
      expect(greenPalette.neutrals[500].toHex()).toBe('#d3d3d3');
      expect(greenPalette.tintedNeutrals[500].toHex()).toBe('#c8d8c7');

      const cyan = new Color('#00ffff');
      const cyanPalette = generateColorPaletteFromBaseColor(cyan);
      expect(cyanPalette.neutrals[500].toHex()).toBe('#e0e0e0');
      expect(cyanPalette.tintedNeutrals[500].toHex()).toBe('#d5e3e3');

      const blue = new Color('#0000ff');
      const bluePalette = generateColorPaletteFromBaseColor(blue);
      expect(bluePalette.neutrals[500].toHex()).toBe('#565656');
      expect(bluePalette.tintedNeutrals[500].toHex()).toBe('#4d5668');

      const magenta = new Color('#ff00ff');
      const magentaPalette = generateColorPaletteFromBaseColor(magenta);
      expect(magentaPalette.neutrals[500].toHex()).toBe('#9f9f9f');
      expect(magentaPalette.tintedNeutrals[500].toHex()).toBe('#ab98a9');

      const purple = new Color('#800080');
      const purplePalette = generateColorPaletteFromBaseColor(purple);
      expect(purplePalette.neutrals[500].toHex()).toBe('#4d4d4d');
      expect(purplePalette.tintedNeutrals[500].toHex()).toBe('#534a53');

      const teal = new Color('#008080');
      const tealPalette = generateColorPaletteFromBaseColor(teal);
      expect(tealPalette.neutrals[500].toHex()).toBe('#6f6f6f');
      expect(tealPalette.tintedNeutrals[500].toHex()).toBe('#6a7171');

      const olive = new Color('#808000');
      const olivePalette = generateColorPaletteFromBaseColor(olive);
      expect(olivePalette.neutrals[500].toHex()).toBe('#7a7a7a');
      expect(olivePalette.tintedNeutrals[500].toHex()).toBe('#7b7b73');

      const hotpink = new Color('#ff69b4');
      const hotpinkPalette = generateColorPaletteFromBaseColor(hotpink);
      expect(hotpinkPalette.neutrals[500].toHex()).toBe('#a7a7a7');
      expect(hotpinkPalette.tintedNeutrals[500].toHex()).toBe('#b2a2a8');

      const maroon = new Color('#800000');
      const maroonPalette = generateColorPaletteFromBaseColor(maroon);
      expect(maroonPalette.neutrals[500].toHex()).toBe('#414141');
      expect(maroonPalette.tintedNeutrals[500].toHex()).toBe('#493f3d');

      const gray = new Color('#808080');
      const grayPalette = generateColorPaletteFromBaseColor(gray);
      expect(grayPalette.neutrals[500].toHex()).toBe('#808080');
      expect(grayPalette.tintedNeutrals[500].toHex()).toBe('#808080');

      const black = new Color('#000000');
      const blackPalette = generateColorPaletteFromBaseColor(black);
      expect(blackPalette.neutrals[500].toHex()).toBe('#000000');
      expect(blackPalette.tintedNeutrals[500].toHex()).toBe('#000000');

      const white = new Color('#ffffff');
      const whitePalette = generateColorPaletteFromBaseColor(white);
      expect(whitePalette.neutrals[500].toHex()).toBe('#ffffff');
      expect(whitePalette.tintedNeutrals[500].toHex()).toBe('#ffffff');
    });
  });

  describe('neutral harmonization options', () => {
    it('clamps tint chroma factor and maximum chroma', () => {
      const base = new Color('#00ff00');
      const palette = generateColorPaletteFromBaseColor(base, undefined, {
        neutralHarmonization: {
          tintChromaFactor: -1,
          maxTintChroma: -0.5,
        },
      });
      expect(palette.tintedNeutrals[500].toHex()).toBe('#d3d3d3');
    });

    it('respects tint chroma factor and maximum', () => {
      const base = new Color('#00ffff');
      const palette = generateColorPaletteFromBaseColor(base, undefined, {
        neutralHarmonization: {
          tintChromaFactor: 1,
          maxTintChroma: 0.02,
        },
      });
      expect(palette.tintedNeutrals[500].toHex()).toBe('#d1e4e4');
    });
  });

  describe('semantic harmonization options', () => {
    it('produces semantic swatches with stable hex values for a red base', () => {
      const palette = generateColorPaletteFromBaseColor(new Color('#ff0000'));
      expect(palette.info[300].toHex()).toBe('#d1d1ff');
      expect(palette.positive[700].toHex()).toBe('#073f03');
      expect(palette.negative[500].toHex()).toBe('#fc0940');
      expect(palette.warning[400].toHex()).toBe('#ff8800');
      expect(palette.special[600].toHex()).toBe('#a31eeb');
    });

    it('pulls semantic hues toward the base color', () => {
      const base = new Color('#ff0000');
      const noPull = generateColorPaletteFromBaseColor(base, undefined, {
        semanticHarmonization: {
          huePull: 0,
          chromaRange: [0.02, 0.25],
        },
      });
      const fullPull = generateColorPaletteFromBaseColor(base, undefined, {
        semanticHarmonization: {
          huePull: 1,
          chromaRange: [0.02, 0.25],
        },
      });
      const noPullHue = noPull.info[500].toOKLCH().h;
      expect(noPullHue).toBeGreaterThan(263);
      expect(noPullHue).toBeLessThan(267);
      expect(fullPull.info[500].toOKLCH().h).toBeCloseTo(base.toOKLCH().h, 0);
      expect(noPull.info[500].toHex()).toBe('#4179ff');
      expect(fullPull.info[500].toHex()).toBe('#f53023');
    });

    it('clamps hue pull outside of the 0–1 range', () => {
      const base = new Color('#ff0000');
      const under = generateColorPaletteFromBaseColor(base, undefined, {
        semanticHarmonization: {
          huePull: -1,
          chromaRange: [0.02, 0.25],
        },
      });
      const over = generateColorPaletteFromBaseColor(base, undefined, {
        semanticHarmonization: {
          huePull: 2,
          chromaRange: [0.02, 0.25],
        },
      });
      const underHue = under.info[500].toOKLCH().h;
      expect(underHue).toBeGreaterThan(263);
      expect(underHue).toBeLessThan(267);
      expect(over.info[500].toOKLCH().h).toBeCloseTo(base.toOKLCH().h, 0);
      expect(under.info[500].toHex()).toBe('#4179ff');
      expect(over.info[500].toHex()).toBe('#f53023');
    });

    it('uses default hues for low chroma base colors', () => {
      const gray = new Color('#808080');
      const palette = generateColorPaletteFromBaseColor(gray);
      const infoHue = palette.info[500].toOKLCH().h;
      const positiveHue = palette.positive[500].toOKLCH().h;
      expect(infoHue).toBeGreaterThan(263);
      expect(infoHue).toBeLessThan(267);
      expect(positiveHue).toBeGreaterThan(148);
      expect(positiveHue).toBeLessThan(152);
      expect(palette.info[500].toHex()).toBe('#758099');
      expect(palette.positive[500].toHex()).toBe('#6b8971');
    });

    it('keeps semantic chroma within the provided range', () => {
      const base = new Color('#0000ff');
      const palette = generateColorPaletteFromBaseColor(base, undefined, {
        semanticHarmonization: {
          huePull: 0.5,
          chromaRange: [0.1, 0.12],
        },
      });
      const c = palette.info[500].toOKLCH().c;
      expect(c).toBeGreaterThanOrEqual(0.1);
      expect(c).toBeLessThanOrEqual(0.121);
      expect(palette.info[500].toHex()).toBe('#335298');
    });

    it('enforces minimum allowable chroma even when max is low', () => {
      const base = new Color('#ff0000');
      const palette = generateColorPaletteFromBaseColor(base, undefined, {
        semanticHarmonization: {
          huePull: 0.2,
          chromaRange: [-1, 0],
        },
      });
      const c = palette.info[500].toOKLCH().c;
      expect(c).toBeCloseTo(0.04, 3);
      expect(palette.info[500].toHex()).toBe('#8885a0');
    });

    it('generates semantic colors for white and black bases', () => {
      const white = new Color('#ffffff');
      const whitePalette = generateColorPaletteFromBaseColor(white);
      expect(whitePalette.info[500].toHex()).not.toBe('#ffffff');
      const black = new Color('#000000');
      const blackPalette = generateColorPaletteFromBaseColor(black);
      expect(blackPalette.info[500].toHex()).not.toBe('#000000');
    });
  });
});
