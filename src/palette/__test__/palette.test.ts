import { Color } from '../../color/color';
import { toHex, toOKLCH } from '../../color/conversions';
import {
  generateColorPaletteFromBaseColor,
  isColorPaletteSuitable,
  SUITABLE_PALETTE_MAX_LIGHTNESS,
  SUITABLE_PALETTE_MIN_LIGHTNESS,
  SUITABLE_PALETTE_MIN_SATURATION,
} from '../palette';

describe('isColorPaletteSuitable()', () => {
  it('returns true when saturation and lightness are within palette-suitable ranges', () => {
    expect(
      isColorPaletteSuitable(
        new Color({ h: 0, s: SUITABLE_PALETTE_MIN_SATURATION, l: 50 }).toRGBA(),
      ),
    ).toBe(true);
    expect(
      isColorPaletteSuitable(
        new Color({ h: 220, s: 85, l: SUITABLE_PALETTE_MIN_LIGHTNESS }).toRGBA(),
      ),
    ).toBe(true);
    expect(
      isColorPaletteSuitable(
        new Color({ h: 120, s: 60, l: SUITABLE_PALETTE_MAX_LIGHTNESS }).toRGBA(),
      ),
    ).toBe(true);
  });

  it('returns false when saturation or lightness are outside palette-suitable ranges', () => {
    expect(
      isColorPaletteSuitable(
        new Color({
          h: 0,
          s: SUITABLE_PALETTE_MIN_SATURATION - 1,
          l: SUITABLE_PALETTE_MIN_LIGHTNESS,
        }).toRGBA(),
      ),
    ).toBe(false);
    expect(
      isColorPaletteSuitable(
        new Color({
          h: 0,
          s: SUITABLE_PALETTE_MIN_SATURATION,
          l: SUITABLE_PALETTE_MIN_LIGHTNESS - 1,
        }).toRGBA(),
      ),
    ).toBe(false);
    expect(
      isColorPaletteSuitable(
        new Color({
          h: 0,
          s: SUITABLE_PALETTE_MIN_SATURATION,
          l: SUITABLE_PALETTE_MAX_LIGHTNESS + 1,
        }).toRGBA(),
      ),
    ).toBe(false);
  });
});

describe('generateColorPaletteFromBaseColor()', () => {
  it('harmonizes neutrals with the base color', () => {
    const baseColor = new Color('#ff0000');
    const palette = generateColorPaletteFromBaseColor(baseColor.toRGBA(), undefined, {});

    expect(toHex(palette.neutrals[100])).toBe('#eeeeee');
    expect(toHex(palette.neutrals[500])).toBe('#888888');
    expect(toHex(palette.neutrals[900])).toBe('#222222');

    expect(toHex(palette.tintedNeutrals[100])).toBe('#f6efee');
    expect(toHex(palette.tintedNeutrals[500])).toBe('#988380');
    expect(toHex(palette.tintedNeutrals[900])).toBe('#262626');

    expect(palette.secondaryTintedNeutrals).toHaveLength(1);
    expect(toHex(palette.secondaryTintedNeutrals[0][100])).toBe('#ffffff');
    expect(toHex(palette.secondaryTintedNeutrals[0][500])).toBe('#d5e3e3');
    expect(toHex(palette.secondaryTintedNeutrals[0][900])).toBe('#767676');
  });

  describe('neutral harmonization across many base colors', () => {
    it('creates neutrals and tinted neutrals for a broad spectrum', () => {
      const red = new Color('#ff0000');
      const redPalette = generateColorPaletteFromBaseColor(red.toRGBA(), undefined, {});
      expect(toHex(redPalette.neutrals[500])).toBe('#888888');
      expect(toHex(redPalette.tintedNeutrals[500])).toBe('#988380');

      const orange = new Color('#ffa500');
      const orangePalette = generateColorPaletteFromBaseColor(
        orange.toRGBA(),
        undefined,
        undefined,
      );
      expect(toHex(orangePalette.neutrals[500])).toBe('#bbbbbb');
      expect(toHex(orangePalette.tintedNeutrals[500])).toBe('#c3bab0');

      const yellow = new Color('#ffff00');
      const yellowPalette = generateColorPaletteFromBaseColor(yellow.toRGBA(), undefined, {});
      expect(toHex(yellowPalette.neutrals[500])).toBe('#f4f4f4');
      expect(toHex(yellowPalette.tintedNeutrals[500])).toBe('#f5f6e6');

      const green = new Color('#00ff00');
      const greenPalette = generateColorPaletteFromBaseColor(green.toRGBA(), undefined, undefined);
      expect(toHex(greenPalette.neutrals[500])).toBe('#d3d3d3');
      expect(toHex(greenPalette.tintedNeutrals[500])).toBe('#c8d8c7');

      const cyan = new Color('#00ffff');
      const cyanPalette = generateColorPaletteFromBaseColor(cyan.toRGBA(), undefined, {});
      expect(toHex(cyanPalette.neutrals[500])).toBe('#e0e0e0');
      expect(toHex(cyanPalette.tintedNeutrals[500])).toBe('#d5e3e3');

      const blue = new Color('#0000ff');
      const bluePalette = generateColorPaletteFromBaseColor(blue.toRGBA(), undefined, undefined);
      expect(toHex(bluePalette.neutrals[500])).toBe('#565656');
      expect(toHex(bluePalette.tintedNeutrals[500])).toBe('#4d5668');

      const magenta = new Color('#ff00ff');
      const magentaPalette = generateColorPaletteFromBaseColor(magenta.toRGBA(), undefined, {});
      expect(toHex(magentaPalette.neutrals[500])).toBe('#9f9f9f');
      expect(toHex(magentaPalette.tintedNeutrals[500])).toBe('#ab98a9');

      const purple = new Color('#800080');
      const purplePalette = generateColorPaletteFromBaseColor(
        purple.toRGBA(),
        undefined,
        undefined,
      );
      expect(toHex(purplePalette.neutrals[500])).toBe('#4d4d4d');
      expect(toHex(purplePalette.tintedNeutrals[500])).toBe('#534a53');

      const teal = new Color('#008080');
      const tealPalette = generateColorPaletteFromBaseColor(teal.toRGBA(), undefined, {});
      expect(toHex(tealPalette.neutrals[500])).toBe('#6f6f6f');
      expect(toHex(tealPalette.tintedNeutrals[500])).toBe('#6a7171');

      const olive = new Color('#808000');
      const olivePalette = generateColorPaletteFromBaseColor(olive.toRGBA(), undefined, undefined);
      expect(toHex(olivePalette.neutrals[500])).toBe('#7a7a7a');
      expect(toHex(olivePalette.tintedNeutrals[500])).toBe('#7b7b73');

      const hotpink = new Color('#ff69b4');
      const hotpinkPalette = generateColorPaletteFromBaseColor(hotpink.toRGBA(), undefined, {});
      expect(toHex(hotpinkPalette.neutrals[500])).toBe('#a7a7a7');
      expect(toHex(hotpinkPalette.tintedNeutrals[500])).toBe('#b2a2a8');

      const maroon = new Color('#800000');
      const maroonPalette = generateColorPaletteFromBaseColor(
        maroon.toRGBA(),
        undefined,
        undefined,
      );
      expect(toHex(maroonPalette.neutrals[500])).toBe('#414141');
      expect(toHex(maroonPalette.tintedNeutrals[500])).toBe('#493f3d');

      const gray = new Color('#808080');
      const grayPalette = generateColorPaletteFromBaseColor(gray.toRGBA(), undefined, {});
      expect(toHex(grayPalette.neutrals[500])).toBe('#808080');
      expect(toHex(grayPalette.tintedNeutrals[500])).toBe('#808080');

      const black = new Color('#000000');
      const blackPalette = generateColorPaletteFromBaseColor(black.toRGBA(), undefined, undefined);
      expect(toHex(blackPalette.neutrals[500])).toBe('#000000');
      expect(toHex(blackPalette.tintedNeutrals[500])).toBe('#000000');

      const white = new Color('#ffffff');
      const whitePalette = generateColorPaletteFromBaseColor(white.toRGBA(), undefined, {});
      expect(toHex(whitePalette.neutrals[500])).toBe('#ffffff');
      expect(toHex(whitePalette.tintedNeutrals[500])).toBe('#ffffff');
    });
  });

  describe('neutral harmonization options', () => {
    it('clamps tint chroma factor and maximum chroma', () => {
      const base = new Color('#00ff00');
      const palette = generateColorPaletteFromBaseColor(base.toRGBA(), undefined, {
        neutralHarmonization: {
          tintChromaFactor: -1,
          maxTintChroma: -0.5,
        },
      });
      expect(toHex(palette.tintedNeutrals[500])).toBe('#d3d3d3');
    });

    it('respects tint chroma factor and maximum', () => {
      const base = new Color('#00ffff');
      const palette = generateColorPaletteFromBaseColor(base.toRGBA(), undefined, {
        neutralHarmonization: {
          tintChromaFactor: 1,
          maxTintChroma: 0.02,
        },
      });
      expect(toHex(palette.tintedNeutrals[500])).toBe('#d1e4e4');
    });
  });

  describe('swatch options', () => {
    it('forwards swatch options to palette swatches', () => {
      const baseColor = new Color('#111111');
      const palette = generateColorPaletteFromBaseColor(baseColor.toRGBA(), 'COMPLEMENTARY', {
        swatchOptions: { extended: true, centerOn500: false },
      });

      const expected = baseColor.getColorSwatch({ extended: true, centerOn500: false });

      expect(palette.primary.type).toBe('EXTENDED');

      const primarySwatch = palette.primary.type === 'EXTENDED' ? palette.primary : null;
      if (!primarySwatch) {
        throw new Error('expected extended primary swatch');
      }

      expect(primarySwatch.baseShade).toBe(expected.baseShade);
      expect(toHex(primarySwatch[950])).toBe(expected[950].toHex());
    });

    it('centers palette swatches on 500 by default', () => {
      const baseColor = new Color('#222222');
      const palette = generateColorPaletteFromBaseColor(baseColor.toRGBA(), undefined, {});

      expect(palette.primary.baseShade).toBe(500);
    });
  });

  describe('neutral harmonization across the full swatch', () => {
    it('produces a complete range for red', () => {
      const palette = generateColorPaletteFromBaseColor(
        new Color('#ff0000').toRGBA(),
        undefined,
        undefined,
      );
      expect(toHex(palette.neutrals[100])).toBe('#eeeeee');
      expect(toHex(palette.neutrals[300])).toBe('#bbbbbb');
      expect(toHex(palette.neutrals[700])).toBe('#555555');
      expect(toHex(palette.neutrals[900])).toBe('#222222');
      expect(toHex(palette.tintedNeutrals[100])).toBe('#f6efee');
      expect(toHex(palette.tintedNeutrals[300])).toBe('#ccb5b2');
      expect(toHex(palette.tintedNeutrals[700])).toBe('#595959');
      expect(toHex(palette.tintedNeutrals[900])).toBe('#262626');
    });

    it('produces a complete range for blue', () => {
      const palette = generateColorPaletteFromBaseColor(
        new Color('#0000ff').toRGBA(),
        undefined,
        {},
      );
      expect(toHex(palette.neutrals[100])).toBe('#bcbcbc');
      expect(toHex(palette.neutrals[300])).toBe('#898989');
      expect(toHex(palette.neutrals[700])).toBe('#232323');
      expect(toHex(palette.neutrals[900])).toBe('#000000');
      expect(toHex(palette.tintedNeutrals[100])).toBe('#abb9d6');
      expect(toHex(palette.tintedNeutrals[300])).toBe('#7184aa');
      expect(toHex(palette.tintedNeutrals[700])).toBe('#262729');
      expect(toHex(palette.tintedNeutrals[900])).toBe('#000000');
    });

    it('produces a complete range for green', () => {
      const palette = generateColorPaletteFromBaseColor(
        new Color('#00ff00').toRGBA(),
        undefined,
        undefined,
      );
      expect(toHex(palette.neutrals[100])).toBe('#ffffff');
      expect(toHex(palette.neutrals[300])).toBe('#ffffff');
      expect(toHex(palette.neutrals[700])).toBe('#a0a0a0');
      expect(toHex(palette.neutrals[900])).toBe('#6d6d6d');
      expect(toHex(palette.tintedNeutrals[100])).toBe('#ffffff');
      expect(toHex(palette.tintedNeutrals[300])).toBe('#ffffff');
      expect(toHex(palette.tintedNeutrals[700])).toBe('#96a495');
      expect(toHex(palette.tintedNeutrals[900])).toBe('#6a6a6a');
    });

    it('keeps tinted neutrals identical for achromatic bases', () => {
      const white = generateColorPaletteFromBaseColor(new Color('#ffffff').toRGBA(), undefined, {});
      expect(toHex(white.neutrals[100])).toBe('#ffffff');
      expect(toHex(white.tintedNeutrals[100])).toBe('#ffffff');
      expect(toHex(white.neutrals[900])).toBe('#999999');
      expect(toHex(white.tintedNeutrals[900])).toBe('#999999');

      const black = generateColorPaletteFromBaseColor(
        new Color('#000000').toRGBA(),
        undefined,
        undefined,
      );
      expect(toHex(black.neutrals[100])).toBe('#666666');
      expect(toHex(black.tintedNeutrals[100])).toBe('#666666');
      expect(toHex(black.neutrals[900])).toBe('#000000');
      expect(toHex(black.tintedNeutrals[900])).toBe('#000000');
    });
  });

  describe('neutral harmonization edge cases', () => {
    it('clamps excessive tint chroma factor and honors maxTintChroma', () => {
      const palette = generateColorPaletteFromBaseColor(new Color('#ff00ff').toRGBA(), undefined, {
        neutralHarmonization: {
          tintChromaFactor: 2,
          maxTintChroma: 0.5,
        },
      });
      expect(toHex(palette.tintedNeutrals[100])).toBe('#ffccff');
      expect(toHex(palette.tintedNeutrals[500])).toBe('#ff00ff');
      expect(toHex(palette.tintedNeutrals[900])).toBe('#2e052e');
    });

    it('falls back to neutral swatches when maxTintChroma is zero', () => {
      const palette = generateColorPaletteFromBaseColor(new Color('#123456').toRGBA(), undefined, {
        neutralHarmonization: {
          tintChromaFactor: 0.5,
          maxTintChroma: 0,
        },
      });
      expect(toHex(palette.neutrals[100])).toBe('#999999');
      expect(toHex(palette.tintedNeutrals[100])).toBe('#999999');
      expect(toHex(palette.neutrals[500])).toBe('#333333');
      expect(toHex(palette.tintedNeutrals[500])).toBe('#333333');
      expect(toHex(palette.neutrals[900])).toBe('#000000');
      expect(toHex(palette.tintedNeutrals[900])).toBe('#000000');
    });

    it('throws for NaN neutral harmonization options', () => {
      const base = new Color('#00ff00');
      expect(() =>
        generateColorPaletteFromBaseColor(base.toRGBA(), undefined, {
          neutralHarmonization: {
            tintChromaFactor: NaN,
            maxTintChroma: NaN,
          },
        }),
      ).toThrow();
    });
  });

  describe('semantic harmonization options', () => {
    it('produces semantic swatches with stable hex values for a red base', () => {
      const palette = generateColorPaletteFromBaseColor(
        new Color('#ff0000').toRGBA(),
        undefined,
        {},
      );
      expect(toHex(palette.info[300])).toBe('#d3d3ff');
      expect(toHex(palette.positive[700])).toBe('#073e03');
      expect(toHex(palette.negative[500])).toBe('#fc0940');
      expect(toHex(palette.warning[400])).toBe('#ff8b01');
      expect(toHex(palette.special[600])).toBe('#a21deb');
    });

    it('pulls semantic hues toward the base color', () => {
      const base = new Color('#ff0000');
      const noPull = generateColorPaletteFromBaseColor(base.toRGBA(), undefined, {
        semanticHarmonization: {
          huePull: 0,
          chromaRange: [0.02, 0.25],
        },
      });
      const fullPull = generateColorPaletteFromBaseColor(base.toRGBA(), undefined, {
        semanticHarmonization: {
          huePull: 1,
          chromaRange: [0.02, 0.25],
        },
      });
      const noPullHue = toOKLCH(noPull.info[500]).h;
      expect(noPullHue).toBeGreaterThan(263);
      expect(noPullHue).toBeLessThan(267);
      expect(toOKLCH(fullPull.info[500]).h).toBeCloseTo(base.toOKLCH().h, 0);
      expect(toHex(noPull.info[500])).toBe('#4179ff');
      expect(toHex(fullPull.info[500])).toBe('#f53023');
    });

    it('clamps hue pull outside of the 0–1 range', () => {
      const base = new Color('#ff0000');
      const under = generateColorPaletteFromBaseColor(base.toRGBA(), undefined, {
        semanticHarmonization: {
          huePull: -1,
          chromaRange: [0.02, 0.25],
        },
      });
      const over = generateColorPaletteFromBaseColor(base.toRGBA(), undefined, {
        semanticHarmonization: {
          huePull: 2,
          chromaRange: [0.02, 0.25],
        },
      });
      const underHue = toOKLCH(under.info[500]).h;
      expect(underHue).toBeGreaterThan(263);
      expect(underHue).toBeLessThan(267);
      expect(toOKLCH(over.info[500]).h).toBeCloseTo(base.toOKLCH().h, 0);
      expect(toHex(under.info[500])).toBe('#4179ff');
      expect(toHex(over.info[500])).toBe('#f53023');
    });

    it('uses default hues for low chroma base colors', () => {
      const gray = new Color('#808080');
      const palette = generateColorPaletteFromBaseColor(gray.toRGBA(), undefined, undefined);
      const infoHue = toOKLCH(palette.info[500]).h;
      const positiveHue = toOKLCH(palette.positive[500]).h;
      expect(infoHue).toBeGreaterThan(263);
      expect(infoHue).toBeLessThan(267);
      expect(positiveHue).toBeGreaterThan(148);
      expect(positiveHue).toBeLessThan(152);
      expect(toHex(palette.info[500])).toBe('#758099');
      expect(toHex(palette.positive[500])).toBe('#6b8971');
    });

    it('keeps semantic chroma within the provided range', () => {
      const base = new Color('#0000ff');
      const palette = generateColorPaletteFromBaseColor(base.toRGBA(), undefined, {
        semanticHarmonization: {
          huePull: 0.5,
          chromaRange: [0.1, 0.12],
        },
      });
      const c = toOKLCH(palette.info[500]).c;
      expect(c).toBeGreaterThanOrEqual(0.1);
      expect(c).toBeLessThanOrEqual(0.121);
      expect(toHex(palette.info[500])).toBe('#335298');
    });

    it('enforces minimum allowable chroma even when max is low', () => {
      const base = new Color('#ff0000');
      const palette = generateColorPaletteFromBaseColor(base.toRGBA(), undefined, {
        semanticHarmonization: {
          huePull: 0.2,
          chromaRange: [-1, 0],
        },
      });
      const c = toOKLCH(palette.info[500]).c;
      expect(c).toBeCloseTo(0.04, 3);
      expect(toHex(palette.info[500])).toBe('#8885a0');
    });

    it('generates semantic colors for white and black bases', () => {
      const white = new Color('#ffffff');
      const whitePalette = generateColorPaletteFromBaseColor(white.toRGBA(), undefined, {});
      expect(toHex(whitePalette.info[500])).not.toBe('#ffffff');
      const black = new Color('#000000');
      const blackPalette = generateColorPaletteFromBaseColor(black.toRGBA(), undefined, undefined);
      expect(toHex(blackPalette.info[500])).not.toBe('#000000');
    });

    it('handles reversed chroma ranges by clamping to the higher bound', () => {
      const palette = generateColorPaletteFromBaseColor(new Color('#ff0000').toRGBA(), undefined, {
        semanticHarmonization: {
          huePull: 0.5,
          chromaRange: [0.3, 0.1],
        },
      });
      const c = toOKLCH(palette.info[500]).c;
      expect(c).toBeGreaterThan(0.29);
      expect(c).toBeLessThan(0.3);
      expect(toHex(palette.info[500])).toBe('#dd00e3');
    });

    it('clamps negative chroma ranges to the minimum allowable', () => {
      const palette = generateColorPaletteFromBaseColor(new Color('#ff0000').toRGBA(), undefined, {
        semanticHarmonization: {
          chromaRange: [-0.5, -0.1],
        },
      });
      const c = toOKLCH(palette.info[500]).c;
      expect(c).toBeCloseTo(0.0395, 3);
      expect(toHex(palette.info[500])).toBe('#8287a1');
    });

    it('throws for NaN semantic harmonization options', () => {
      const base = new Color('#ff0000');
      expect(() =>
        generateColorPaletteFromBaseColor(base.toRGBA(), undefined, {
          semanticHarmonization: { huePull: NaN, chromaRange: [NaN, NaN] },
        }),
      ).toThrow();
    });

    it('creates positive and negative swatches across the spectrum', () => {
      const palette = generateColorPaletteFromBaseColor(
        new Color('#ff0000').toRGBA(),
        undefined,
        undefined,
      );
      expect(toHex(palette.positive[100])).toBe('#7dff74');
      expect(toHex(palette.positive[500])).toBe('#0ba700');
      expect(toHex(palette.positive[700])).toBe('#073e03');
      expect(toHex(palette.negative[100])).toBe('#ffd2dc');
      expect(toHex(palette.negative[500])).toBe('#fc0940');
      expect(toHex(palette.negative[700])).toBe('#950a29');
    });

    it('provides full semantic colors for grayscale bases', () => {
      const palette = generateColorPaletteFromBaseColor(
        new Color('#808080').toRGBA(),
        undefined,
        {},
      );
      expect(toHex(palette.info[500])).toBe('#758099');
      expect(toHex(palette.positive[500])).toBe('#6b8971');
      expect(toHex(palette.negative[500])).toBe('#a17271');
      expect(toHex(palette.warning[500])).toBe('#8e7f56');
      expect(toHex(palette.special[500])).toBe('#85799a');
    });
  });

  describe('color harmony generation', () => {
    it('creates complementary swatches with proper secondary colors', () => {
      const palette = generateColorPaletteFromBaseColor(
        new Color('#ff0000').toRGBA(),
        'COMPLEMENTARY',
        undefined,
      );
      expect(palette.secondaryColors.length).toBe(1);
      expect(palette.secondaryTintedNeutrals.length).toBe(palette.secondaryColors.length);
      expect(toHex(palette.primary[100])).toBe('#ffcccc');
      expect(toHex(palette.primary[900])).toBe('#2e0505');
      expect(toHex(palette.secondaryColors[0][100])).toBe('#ccffff');
      expect(toHex(palette.secondaryColors[0][500])).toBe('#00ffff');
      expect(toHex(palette.secondaryColors[0][900])).toBe('#052e2e');
      expect(toHex(palette.secondaryTintedNeutrals[0][100])).toBe('#ffffff');
      expect(toHex(palette.secondaryTintedNeutrals[0][500])).toBe('#d5e3e3');
      expect(toHex(palette.secondaryTintedNeutrals[0][900])).toBe('#767676');
    });

    it('creates a full triadic harmony', () => {
      const palette = generateColorPaletteFromBaseColor(
        new Color('#ff0000').toRGBA(),
        'TRIADIC',
        {},
      );
      expect(palette.secondaryColors.length).toBe(2);
      expect(palette.secondaryTintedNeutrals.length).toBe(palette.secondaryColors.length);
      expect(toHex(palette.primary[500])).toBe('#ff0000');
      expect(toHex(palette.secondaryColors[0][500])).toBe('#0000ff');
      expect(toHex(palette.secondaryColors[1][500])).toBe('#00ff00');
      expect(toHex(palette.secondaryColors[0][100])).toBe('#ccccff');
      expect(toHex(palette.secondaryColors[1][900])).toBe('#052e05');
      expect(toHex(palette.secondaryTintedNeutrals[0][100])).toBe('#abb9d6');
      expect(toHex(palette.secondaryTintedNeutrals[0][500])).toBe('#4d5668');
      expect(toHex(palette.secondaryTintedNeutrals[0][900])).toBe('#000000');
      expect(toHex(palette.secondaryTintedNeutrals[1][100])).toBe('#ffffff');
      expect(toHex(palette.secondaryTintedNeutrals[1][500])).toBe('#c8d8c7');
      expect(toHex(palette.secondaryTintedNeutrals[1][900])).toBe('#6a6a6a');
    });

    it('produces the expected number of secondary colors for other harmonies', () => {
      const analogous = generateColorPaletteFromBaseColor(
        new Color('#336699').toRGBA(),
        'ANALOGOUS',
        undefined,
      );
      expect(analogous.secondaryColors.length).toBe(4);
      expect(analogous.secondaryTintedNeutrals.length).toBe(analogous.secondaryColors.length);
      expect(toHex(analogous.secondaryColors[0][500])).toBe('#339999');
      expect(toHex(analogous.secondaryColors[3][500])).toBe('#663399');
      expect(toHex(analogous.secondaryTintedNeutrals[0][500])).toBe('#828a89');
      expect(toHex(analogous.secondaryTintedNeutrals[3][500])).toBe('#54515a');

      const monochromatic = generateColorPaletteFromBaseColor(
        new Color('#336699').toRGBA(),
        'MONOCHROMATIC',
        {},
      );
      expect(monochromatic.secondaryColors.length).toBe(4);
      expect(monochromatic.secondaryTintedNeutrals.length).toBe(
        monochromatic.secondaryColors.length,
      );
      expect(toHex(monochromatic.secondaryColors[0][500])).toBe('#6699cc');
      expect(toHex(monochromatic.secondaryColors[3][500])).toBe('#476685');
      expect(toHex(monochromatic.secondaryTintedNeutrals[0][500])).toBe('#90959a');
      expect(toHex(monochromatic.secondaryTintedNeutrals[3][500])).toBe('#606366');
    });
  });
});
