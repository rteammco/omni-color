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

  describe('swatch options', () => {
    it('forwards swatch options to palette swatches', () => {
      const baseColor = new Color('#111111');
      const palette = generateColorPaletteFromBaseColor(baseColor, 'COMPLEMENTARY', {
        swatchOptions: { extended: true, centerOn500: false },
      });

      const expected = baseColor.getColorSwatch({ extended: true, centerOn500: false });

      expect(palette.primary.type).toBe('EXTENDED');

      const primarySwatch = palette.primary.type === 'EXTENDED' ? palette.primary : null;

      expect(primarySwatch?.mainStop).toBe(expected.mainStop);
      expect(primarySwatch?.[950].toHex()).toBe(expected[950].toHex());
    });

    it('centers palette swatches on 500 by default', () => {
      const baseColor = new Color('#222222');
      const palette = generateColorPaletteFromBaseColor(baseColor);

      expect(palette.primary.mainStop).toBe(500);
    });
  });

  describe('neutral harmonization across the full swatch', () => {
    it('produces a complete range for red', () => {
      const palette = generateColorPaletteFromBaseColor(new Color('#ff0000'));
      expect(palette.neutrals[100].toHex()).toBe('#ededed');
      expect(palette.neutrals[300].toHex()).toBe('#bababa');
      expect(palette.neutrals[700].toHex()).toBe('#545454');
      expect(palette.neutrals[900].toHex()).toBe('#212121');
      expect(palette.tintedNeutrals[100].toHex()).toBe('#f6efee');
      expect(palette.tintedNeutrals[300].toHex()).toBe('#ccb5b3');
      expect(palette.tintedNeutrals[700].toHex()).toBe('#595959');
      expect(palette.tintedNeutrals[900].toHex()).toBe('#262626');
    });

    it('produces a complete range for blue', () => {
      const palette = generateColorPaletteFromBaseColor(new Color('#0000ff'));
      expect(palette.neutrals[100].toHex()).toBe('#bdbdbd');
      expect(palette.neutrals[300].toHex()).toBe('#8a8a8a');
      expect(palette.neutrals[700].toHex()).toBe('#242424');
      expect(palette.neutrals[900].toHex()).toBe('#000000');
      expect(palette.tintedNeutrals[100].toHex()).toBe('#a9b8d6');
      expect(palette.tintedNeutrals[300].toHex()).toBe('#7083a9');
      expect(palette.tintedNeutrals[700].toHex()).toBe('#242628');
      expect(palette.tintedNeutrals[900].toHex()).toBe('#000000');
    });

    it('produces a complete range for green', () => {
      const palette = generateColorPaletteFromBaseColor(new Color('#00ff00'));
      expect(palette.neutrals[100].toHex()).toBe('#ffffff');
      expect(palette.neutrals[300].toHex()).toBe('#ffffff');
      expect(palette.neutrals[700].toHex()).toBe('#a1a1a1');
      expect(palette.neutrals[900].toHex()).toBe('#6e6e6e');
      expect(palette.tintedNeutrals[100].toHex()).toBe('#ffffff');
      expect(palette.tintedNeutrals[300].toHex()).toBe('#ffffff');
      expect(palette.tintedNeutrals[700].toHex()).toBe('#95a494');
      expect(palette.tintedNeutrals[900].toHex()).toBe('#696969');
    });

    it('keeps tinted neutrals identical for achromatic bases', () => {
      const white = generateColorPaletteFromBaseColor(new Color('#ffffff'));
      expect(white.neutrals[100].toHex()).toBe('#ffffff');
      expect(white.tintedNeutrals[100].toHex()).toBe('#ffffff');
      expect(white.neutrals[900].toHex()).toBe('#999999');
      expect(white.tintedNeutrals[900].toHex()).toBe('#999999');

      const black = generateColorPaletteFromBaseColor(new Color('#000000'));
      expect(black.neutrals[100].toHex()).toBe('#666666');
      expect(black.tintedNeutrals[100].toHex()).toBe('#666666');
      expect(black.neutrals[900].toHex()).toBe('#000000');
      expect(black.tintedNeutrals[900].toHex()).toBe('#000000');
    });
  });

  describe('neutral harmonization edge cases', () => {
    it('clamps excessive tint chroma factor and honors maxTintChroma', () => {
      const palette = generateColorPaletteFromBaseColor(new Color('#ff00ff'), undefined, {
        neutralHarmonization: {
          tintChromaFactor: 2,
          maxTintChroma: 0.5,
        },
      });
      expect(palette.tintedNeutrals[100].toHex()).toBe('#ffccff');
      expect(palette.tintedNeutrals[500].toHex()).toBe('#ff00ff');
      expect(palette.tintedNeutrals[900].toHex()).toBe('#2e052e');
    });

    it('falls back to neutral swatches when maxTintChroma is zero', () => {
      const palette = generateColorPaletteFromBaseColor(new Color('#123456'), undefined, {
        neutralHarmonization: {
          tintChromaFactor: 0.5,
          maxTintChroma: 0,
        },
      });
      expect(palette.neutrals[100].toHex()).toBe('#999999');
      expect(palette.tintedNeutrals[100].toHex()).toBe('#999999');
      expect(palette.neutrals[500].toHex()).toBe('#333333');
      expect(palette.tintedNeutrals[500].toHex()).toBe('#333333');
      expect(palette.neutrals[900].toHex()).toBe('#000000');
      expect(palette.tintedNeutrals[900].toHex()).toBe('#000000');
    });

    it('throws for NaN neutral harmonization options', () => {
      const base = new Color('#00ff00');
      expect(() =>
        generateColorPaletteFromBaseColor(base, undefined, {
          neutralHarmonization: {
            tintChromaFactor: NaN,
            maxTintChroma: NaN,
          },
        })
      ).toThrow();
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

    it('handles reversed chroma ranges by clamping to the higher bound', () => {
      const palette = generateColorPaletteFromBaseColor(new Color('#ff0000'), undefined, {
        semanticHarmonization: {
          huePull: 0.5,
          chromaRange: [0.3, 0.1],
        },
      });
      const c = palette.info[500].toOKLCH().c;
      expect(c).toBeGreaterThan(0.29);
      expect(c).toBeLessThan(0.3);
      expect(palette.info[500].toHex()).toBe('#dd00e3');
    });

    it('clamps negative chroma ranges to the minimum allowable', () => {
      const palette = generateColorPaletteFromBaseColor(new Color('#ff0000'), undefined, {
        semanticHarmonization: {
          chromaRange: [-0.5, -0.1],
        },
      });
      const c = palette.info[500].toOKLCH().c;
      expect(c).toBeCloseTo(0.0395, 3);
      expect(palette.info[500].toHex()).toBe('#8287a1');
    });

    it('throws for NaN semantic harmonization options', () => {
      const base = new Color('#ff0000');
      expect(() =>
        generateColorPaletteFromBaseColor(base, undefined, {
          semanticHarmonization: { huePull: NaN, chromaRange: [NaN, NaN] },
        })
      ).toThrow();
    });

    it('creates positive and negative swatches across the spectrum', () => {
      const palette = generateColorPaletteFromBaseColor(new Color('#ff0000'));
      expect(palette.positive[100].toHex()).toBe('#7eff75');
      expect(palette.positive[500].toHex()).toBe('#0ba700');
      expect(palette.positive[700].toHex()).toBe('#073f03');
      expect(palette.negative[100].toHex()).toBe('#ffd1dc');
      expect(palette.negative[500].toHex()).toBe('#fc0940');
      expect(palette.negative[700].toHex()).toBe('#95092a');
    });

    it('provides full semantic colors for grayscale bases', () => {
      const palette = generateColorPaletteFromBaseColor(new Color('#808080'));
      expect(palette.info[500].toHex()).toBe('#758099');
      expect(palette.positive[500].toHex()).toBe('#6b8971');
      expect(palette.negative[500].toHex()).toBe('#a17271');
      expect(palette.warning[500].toHex()).toBe('#8e7f56');
      expect(palette.special[500].toHex()).toBe('#85799a');
    });
  });

  describe('color harmony generation', () => {
    it('creates complementary swatches with proper secondary colors', () => {
      const palette = generateColorPaletteFromBaseColor(new Color('#ff0000'), 'COMPLEMENTARY');
      expect(palette.secondaryColors.length).toBe(1);
      expect(palette.primary[100].toHex()).toBe('#ffcccc');
      expect(palette.primary[900].toHex()).toBe('#2e0505');
      expect(palette.secondaryColors[0][100].toHex()).toBe('#ccffff');
      expect(palette.secondaryColors[0][500].toHex()).toBe('#00ffff');
      expect(palette.secondaryColors[0][900].toHex()).toBe('#052e2e');
    });

    it('creates a full triadic harmony', () => {
      const palette = generateColorPaletteFromBaseColor(new Color('#ff0000'), 'TRIADIC');
      expect(palette.secondaryColors.length).toBe(2);
      expect(palette.primary[500].toHex()).toBe('#ff0000');
      expect(palette.secondaryColors[0][500].toHex()).toBe('#0000ff');
      expect(palette.secondaryColors[1][500].toHex()).toBe('#00ff00');
      expect(palette.secondaryColors[0][100].toHex()).toBe('#ccccff');
      expect(palette.secondaryColors[1][900].toHex()).toBe('#052e05');
    });

    it('produces the expected number of secondary colors for other harmonies', () => {
      const analogous = generateColorPaletteFromBaseColor(new Color('#336699'), 'ANALOGOUS');
      expect(analogous.secondaryColors.length).toBe(4);
      expect(analogous.secondaryColors[0][500].toHex()).toBe('#339999');
      expect(analogous.secondaryColors[3][500].toHex()).toBe('#663399');

      const monochromatic = generateColorPaletteFromBaseColor(
        new Color('#336699'),
        'MONOCHROMATIC'
      );
      expect(monochromatic.secondaryColors.length).toBe(4);
      expect(monochromatic.secondaryColors[0][500].toHex()).toBe('#6699cc');
      expect(monochromatic.secondaryColors[3][500].toHex()).toBe('#476685');
    });
  });
});
