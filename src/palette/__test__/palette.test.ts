import { Color } from '../../color/color';
import { generateColorPaletteFromBaseColor } from '../palette';

describe('generateColorPaletteFromBaseColor()', () => {
  it('harmonizes neutrals with the base color', () => {
    const baseColor = new Color('red');
    const palette = generateColorPaletteFromBaseColor(baseColor);

    const baseOKLCH = baseColor.toOKLCH();
    const neutralOKLCH = palette.neutrals[500].toOKLCH();
    expect(neutralOKLCH.c).toBeCloseTo(0, 5);
    expect(neutralOKLCH.l).toBeCloseTo(baseOKLCH.l, 2);

    const tintedOKLCH = palette.tintedNeutrals[500].toOKLCH();
    expect(tintedOKLCH.c).toBeGreaterThan(0);
    expect(tintedOKLCH.c).toBeLessThan(baseOKLCH.c);
    expect(Math.abs(tintedOKLCH.h - baseOKLCH.h)).toBeLessThan(5);
  });
});

