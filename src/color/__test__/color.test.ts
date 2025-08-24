import { Color } from '../color';
import { CSS_COLOR_NAME_TO_HEX_MAP } from '../color.constants';
import type {
  ColorCMYK,
  ColorHex,
  ColorHSL,
  ColorHSLA,
  ColorHSV,
  ColorHSVA,
  ColorLCH,
  ColorOKLCH,
  ColorRGB,
} from '../formats';
import { ColorHarmony } from '../harmonies';
import { BaseColorName, ColorLightnessModifier } from '../names';
import { getRandomColorRGBA } from '../random';
import { ColorTemperatureLabel, getColorFromTemperatureLabel } from '../temperature';

jest.mock('../random', () => {
  const actual = jest.requireActual('../random');
  return {
    ...actual,
    getRandomColorRGBA: jest.fn(actual.getRandomColorRGBA),
  };
});

const BASE_HEX: ColorHex = '#ff0000';
const BASE_RGB: ColorRGB = { r: 255, g: 0, b: 0 };
const BASE_HSL: ColorHSL = { h: 0, s: 100, l: 50 };
const BASE_HSV: ColorHSV = { h: 0, s: 100, v: 100 };
const BASE_CMYK: ColorCMYK = { c: 0, m: 100, y: 100, k: 0 };
const BASE_LCH: ColorLCH = { l: 53.233, c: 104.576, h: 40 };
const BASE_OKLCH: ColorOKLCH = { l: 0.627955, c: 0.257683, h: 29.234 };

const HEX8_OPAQUE: ColorHex = '#ff0000ff';
const HEX8_SEMI_TRANSPARENT: ColorHex = '#ff000080';

function checkAllConversions(color: Color, alpha: number, hex8: ColorHex) {
  expect(color.toHex()).toBe(BASE_HEX);
  expect(color.toHex8()).toBe(hex8);
  expect(color.toRGB()).toEqual(BASE_RGB);
  expect(color.toRGBA()).toEqual({ ...BASE_RGB, a: alpha });
  expect(color.toHSL()).toEqual(BASE_HSL);
  expect(color.toHSLA()).toEqual({ ...BASE_HSL, a: alpha });
  expect(color.toHSV()).toEqual(BASE_HSV);
  expect(color.toHSVA()).toEqual({ ...BASE_HSV, a: alpha });
  expect(color.toCMYK()).toEqual(BASE_CMYK);
  const lch = color.toLCH();
  expect(lch.l).toBeCloseTo(BASE_LCH.l, 3);
  expect(lch.c).toBeCloseTo(BASE_LCH.c, 3);
  expect(lch.h).toBeCloseTo(BASE_LCH.h, 3);
  const oklch = color.toOKLCH();
  expect(oklch.l).toBeCloseTo(BASE_OKLCH.l, 6);
  expect(oklch.c).toBeCloseTo(BASE_OKLCH.c, 6);
  expect(oklch.h).toBeCloseTo(BASE_OKLCH.h, 3);
}

describe('Color constructor and conversion tests', () => {
  it('correctly initializes from and converts hex input', () => {
    const color = new Color(BASE_HEX);
    checkAllConversions(color, 1, HEX8_OPAQUE);
  });

  it('correctly initializes from color name input', () => {
    const color = new Color('red');
    checkAllConversions(color, 1, HEX8_OPAQUE);
  });

  it('correctly initializes from and converts short hex input', () => {
    const shortHex: ColorHex = '#fff';
    const color = new Color(shortHex);
    expect(color.toHex()).toBe('#ffffff');
    expect(color.toHex8()).toBe('#ffffffff');
    const rgb: ColorRGB = { r: 255, g: 255, b: 255 };
    expect(color.toRGB()).toEqual(rgb);
    expect(color.toRGBA()).toEqual({ ...rgb, a: 1 });
    const hsl: ColorHSL = { h: 0, s: 0, l: 100 };
    expect(color.toHSL()).toEqual(hsl);
    expect(color.toHSLA()).toEqual({ ...hsl, a: 1 });
    const hsv: ColorHSV = { h: 0, s: 0, v: 100 };
    expect(color.toHSV()).toEqual(hsv);
    expect(color.toHSVA()).toEqual({ ...hsv, a: 1 });
    const cmyk: ColorCMYK = { c: 0, m: 0, y: 0, k: 0 };
    expect(color.toCMYK()).toEqual(cmyk);
    const lch = color.toLCH();
    expect(lch.l).toBeCloseTo(100, 3);
    expect(lch.c).toBeCloseTo(0, 1);
    const oklch = color.toOKLCH();
    expect(oklch.l).toBeCloseTo(1, 6);
    expect(oklch.c).toBeCloseTo(0, 6);
  });

  it('correctly initializes from and converts hex8 input', () => {
    const color = new Color(HEX8_SEMI_TRANSPARENT);
    checkAllConversions(color, 0.502, HEX8_SEMI_TRANSPARENT);
  });

  it('correctly initializes from and converts rgb input', () => {
    const color = new Color(BASE_RGB);
    checkAllConversions(color, 1, HEX8_OPAQUE);
  });

  it('correctly initializes from and converts rgba input', () => {
    const color = new Color({ ...BASE_RGB, a: 0.5 });
    checkAllConversions(color, 0.5, HEX8_SEMI_TRANSPARENT);
  });

  it('correctly initializes from and converts hsl input', () => {
    const color = new Color(BASE_HSL);
    checkAllConversions(color, 1, HEX8_OPAQUE);
  });

  it('correctly initializes from and converts hsla input', () => {
    const color = new Color({ ...BASE_HSL, a: 0.5 });
    checkAllConversions(color, 0.5, HEX8_SEMI_TRANSPARENT);
  });

  it('correctly initializes from and converts hsv input', () => {
    const color = new Color(BASE_HSV);
    checkAllConversions(color, 1, HEX8_OPAQUE);
  });

  it('correctly initializes from and converts hsva input', () => {
    const color = new Color({ ...BASE_HSV, a: 0.5 });
    checkAllConversions(color, 0.5, HEX8_SEMI_TRANSPARENT);
  });

  it('correctly initializes from and converts cmyk input', () => {
    const color = new Color(BASE_CMYK);
    checkAllConversions(color, 1, HEX8_OPAQUE);
  });

  it('correctly initializes from and converts lch input', () => {
    const color = new Color(BASE_LCH);
    checkAllConversions(color, 1, HEX8_OPAQUE);
  });

  it('correctly initializes from and converts oklch input', () => {
    const color = new Color(BASE_OKLCH);
    checkAllConversions(color, 1, HEX8_OPAQUE);
  });

  it('correctly initializes from another color instance', () => {
    const color1 = new Color('#7c74f0');
    const color2 = new Color(color1);
    expect(color2.toRGB()).toEqual(color1.toRGB());
    expect(color1).not.toBe(color2);
  });

  it('accepts color temperature label strings', () => {
    let color = new Color('fluorescent');
    expect(color.toHex()).toBe(
      getColorFromTemperatureLabel(ColorTemperatureLabel.FLUORESCENT).toHex()
    );

    color = new Color('Daylight');
    expect(color.toHex()).toBe(
      getColorFromTemperatureLabel(ColorTemperatureLabel.DAYLIGHT).toHex()
    );

    color = new Color('  shade ');
    expect(color.toHex()).toBe(getColorFromTemperatureLabel(ColorTemperatureLabel.SHADE).toHex());

    color = new Color('blue sky');
    expect(color.toHex()).toBe(
      getColorFromTemperatureLabel(ColorTemperatureLabel.BLUE_SKY).toHex()
    );
  });
});

describe('Color.random', () => {
  it('creates a Color instance with default options', () => {
    const color = Color.random();
    expect(color).toBeInstanceOf(Color);
  });

  it('respects provided options', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const anchoredColor = Color.random({ anchorColor: BaseColorName.BLUE });
    expect(anchoredColor.getName().name).toBe(BaseColorName.BLUE);

    const paletteSuitableColor = Color.random({ paletteSuitable: true });
    const paletteSuitableHSL = paletteSuitableColor.toHSL();
    expect(paletteSuitableHSL.s).toBeGreaterThanOrEqual(40);
    expect(paletteSuitableHSL.l).toBeGreaterThanOrEqual(25);
    expect(paletteSuitableHSL.l).toBeLessThanOrEqual(75);

    const alphaColor = Color.random({ alpha: 0.25 });
    expect(alphaColor.getAlpha()).toBe(0.25);

    const randomizedAlpha = Color.random({ randomizeAlpha: true });
    expect(randomizedAlpha.getAlpha()).toBe(0.5);

    spy.mockRestore();
  });
});

describe('Random color pathways', () => {
  const mockColor = { r: 10, g: 20, b: 30, a: 0.4 };
  const randomSpy = getRandomColorRGBA as jest.Mock;
  const actualRandom = (jest.requireActual('../random') as typeof import('../random'))
    .getRandomColorRGBA;

  beforeEach(() => {
    randomSpy.mockImplementation(actualRandom);
    randomSpy.mockClear();
  });

  afterEach(() => {
    randomSpy.mockImplementation(actualRandom);
    randomSpy.mockClear();
  });

  it('uses getRandomColorRGBA when constructed without arguments', () => {
    randomSpy.mockReturnValue(mockColor);
    const color = new Color();
    expect(randomSpy).toHaveBeenCalledTimes(1);
    expect(color.toRGB()).toEqual({ r: 10, g: 20, b: 30 });
    expect(color.getAlpha()).toBe(0.4);
  });

  it('uses getRandomColorRGBA when constructed with null', () => {
    randomSpy.mockReturnValue(mockColor);
    const color = new Color(null);
    expect(randomSpy).toHaveBeenCalledTimes(1);
    expect(color.toRGB()).toEqual({ r: 10, g: 20, b: 30 });
    expect(color.getAlpha()).toBe(0.4);
  });

  it('Color.random uses getRandomColorRGBA', () => {
    randomSpy.mockReturnValue(mockColor);
    const color = Color.random();
    expect(randomSpy).toHaveBeenCalledTimes(1);
    expect(color.toRGB()).toEqual({ r: 10, g: 20, b: 30 });
    expect(color.getAlpha()).toBe(0.4);
  });
});

describe('Color.toXString methods', () => {
  it('returns string representations of the color', () => {
    const color = new Color({ ...BASE_RGB, a: 0.5 });
    expect(color.toRGBString()).toBe('rgb(255, 0, 0)');
    expect(color.toRGBAString()).toBe('rgba(255, 0, 0, 0.5)');
    expect(color.toHSLString()).toBe('hsl(0, 100%, 50%)');
    expect(color.toHSLAString()).toBe('hsla(0, 100%, 50%, 0.5)');
    expect(color.toCMYKString()).toBe('cmyk(0%, 100%, 100%, 0%)');
    expect(color.toLCHString()).toBe('lch(53.233% 104.576 40)');
    expect(color.toOKLCHString()).toBe('oklch(0.627955 0.257683 29.234)');
  });
});

describe('Named color support', () => {
  it('initializes from all named colors (case insensitive)', () => {
    for (const [name, hex] of Object.entries(CSS_COLOR_NAME_TO_HEX_MAP)) {
      expect(new Color(name).toHex()).toEqual(hex);
      expect(new Color(name.toUpperCase()).toHex()).toEqual(hex);
    }

    // Check other named input formatting (ignore caps, whitespace):
    expect(new Color('Red').toRGBA()).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(new Color('blACK').toRGB()).toEqual({ r: 0, g: 0, b: 0 });
    expect(new Color('light blue').toHex()).toEqual('#add8e6');
    expect(new Color('light Golden rod YELLOW').toHex()).toEqual('#fafad2');
  });

  it('throws on unknown color names', () => {
    expect(() => new Color('notacolor')).toThrow();
  });

  it('accepts CSS color format strings', () => {
    expect(new Color('rgb(255, 0, 0)').toHex()).toEqual('#ff0000');
    expect(new Color('hsla(0, 100%, 50%, 0.5)').toHex8()).toEqual('#ff000080');
  });

  it('throws on invalid color format strings', () => {
    expect(() => new Color('rgb(255, 0)')).toThrow();
  });
});

describe('Color.getAlpha', () => {
  it('returns the alpha channel value', () => {
    const color = new Color({ ...BASE_RGB, a: 0.5 });
    expect(color.getAlpha()).toBe(0.5);
  });

  it('parses alpha from hex8 strings', () => {
    const opaque: ColorHex = '#ffffffff';
    const transparent: ColorHex = '#00000000';
    const semiTransparent: ColorHex = '#123456cc';

    expect(new Color(opaque).getAlpha()).toBe(1);
    expect(new Color(transparent).getAlpha()).toBe(0);
    expect(new Color(semiTransparent).getAlpha()).toBeCloseTo(0.8, 3);
  });

  it('handles alpha in hsla and hsva inputs', () => {
    const hsla: ColorHSLA = { h: 210, s: 40, l: 60, a: 0.25 };
    const hsva: ColorHSVA = { h: 120, s: 70, v: 80, a: 0.75 };

    expect(new Color(hsla).getAlpha()).toBe(0.25);
    expect(new Color(hsva).getAlpha()).toBe(0.75);
  });

  it('accepts fully transparent rgba values', () => {
    const color = new Color({ r: 10, g: 20, b: 30, a: 0 });
    expect(color.getAlpha()).toBe(0);
  });
});

describe('Color.setAlpha', () => {
  it('updates the alpha channel', () => {
    const color = new Color(BASE_RGB);
    color.setAlpha(0.5);
    expect(color.getAlpha()).toBe(0.5);
    expect(color.toHex8()).toBe(HEX8_SEMI_TRANSPARENT);
  });

  it('clamps correctly when alpha is out of range', () => {
    const color = new Color({ ...BASE_RGB, a: 0.5 });
    expect(color.getAlpha()).toBe(0.5);
    color.setAlpha(1.5);
    expect(color.getAlpha()).toBe(1);
    expect(color.toRGBA()).toEqual({ ...BASE_RGB, a: 1 });
    color.setAlpha(-0.1);
    expect(color.getAlpha()).toBe(0);
    expect(color.toRGBA()).toEqual({ ...BASE_RGB, a: 0 });
  });

  it('defaults to full opacity for non-finite alpha values', () => {
    const invalidValues = [undefined, NaN, 'foo'];
    for (const value of invalidValues) {
      const color = new Color({ ...BASE_RGB, a: 0 });
      color.setAlpha(value as unknown as number);
      expect(color.getAlpha()).toBe(1);
    }
  });

  it('is chainable', () => {
    const color = new Color(BASE_RGB).setAlpha(0.25);
    expect(color.toRGBA()).toEqual({ ...BASE_RGB, a: 0.25 });
  });
});

describe('Color.spin', () => {
  it('returns a new color with the hue rotated', () => {
    const red = new Color('#ff0000');

    const spunForward = red.spin(180);
    expect(spunForward).not.toBe(red);
    expect(spunForward.toHex()).toBe('#00ffff');
    expect(red.toHex()).toBe('#ff0000');

    const spunBackward = red.spin(-180);
    expect(spunBackward).not.toBe(red);
    expect(spunBackward.toHex()).toBe('#00ffff');
    expect(red.toHex()).toBe('#ff0000');
  });
});

describe('Color.brighten', () => {
  it('lightens the color without mutating the original', () => {
    const base = new Color('#808080');
    const brighter = base.brighten(10);
    expect(brighter.toHex()).toBe('#999999');
    expect(base.toHex()).toBe('#808080');
  });
});

describe('Color.darken', () => {
  it('darkens the color without mutating the original', () => {
    const base = new Color('#808080');
    const darker = base.darken(10);
    expect(darker.toHex()).toBe('#666666');
    expect(base.toHex()).toBe('#808080');
  });
});

describe('Color.saturate', () => {
  it('increases saturation without mutating the original', () => {
    const base = new Color('#6699cc');
    const saturated = base.saturate(20);
    expect(saturated.toHex()).toBe('#5299e0');
    expect(base.toHex()).toBe('#6699cc');
  });
});

describe('Color.desaturate', () => {
  it('decreases saturation without mutating the original', () => {
    const base = new Color('#6699cc');
    const desaturated = base.desaturate(20);
    expect(desaturated.toHex()).toBe('#7a99b8');
    expect(base.toHex()).toBe('#6699cc');
  });
});

describe('Color.grayscale', () => {
  it('converts the color to grayscale', () => {
    const red = new Color('#ff0000');
    const gray = red.grayscale();
    expect(gray.toHex()).toBe('#808080');
    expect(red.toHex()).toBe('#ff0000');
  });
});

describe('Color.getComplementaryColors', () => {
  it('returns the original color and its complement', () => {
    const red = new Color('#ff0000');
    const [orig, comp] = red.getComplementaryColors();
    expect(orig.toHex()).toBe('#ff0000');
    expect(comp.toHex()).toBe('#00ffff');
    expect(orig).not.toBe(red);
    expect(comp).not.toBe(red);
  });
});

describe('Color.getSplitComplementaryColors', () => {
  it('returns the split complementary colors', () => {
    const red = new Color('#ff0000');
    const [orig, comp1, comp2] = red.getSplitComplementaryColors();
    expect(orig.toHex()).toBe('#ff0000');
    expect(comp1.toHex()).toBe('#0080ff');
    expect(comp2.toHex()).toBe('#00ff80');
  });
});

describe('Color.getTriadicHarmonyColors', () => {
  it('returns the triadic harmony colors', () => {
    const red = new Color('#ff0000');
    const [orig, triad1, triad2] = red.getTriadicHarmonyColors();
    expect(orig.toHex()).toBe('#ff0000');
    expect(triad1.toHex()).toBe('#0000ff');
    expect(triad2.toHex()).toBe('#00ff00');
  });
});

describe('Color.getSquareHarmonyColors', () => {
  it('returns the square harmony colors', () => {
    const red = new Color('#ff0000');
    const [orig, sq1, sq2, sq3] = red.getSquareHarmonyColors();
    expect(orig.toHex()).toBe('#ff0000');
    expect(sq1.toHex()).toBe('#80ff00');
    expect(sq2.toHex()).toBe('#00ffff');
    expect(sq3.toHex()).toBe('#8000ff');
  });
});

describe('Color.getTetradicHarmonyColors', () => {
  it('returns the tetradic harmony colors', () => {
    const red = new Color('#ff0000');
    const [orig, t2, t3, t4] = red.getTetradicHarmonyColors();
    expect(orig.toHex()).toBe('#ff0000');
    expect(t2.toHex()).toBe('#ffff00');
    expect(t3.toHex()).toBe('#00ffff');
    expect(t4.toHex()).toBe('#0000ff');
  });
});

describe('Color.getAnalogousHarmonyColors', () => {
  it('returns the analogous harmony colors', () => {
    const red = new Color('#ff0000');
    const [orig, a2, a3, a4, a5] = red.getAnalogousHarmonyColors();
    expect(orig.toHex()).toBe('#ff0000');
    expect(a2.toHex()).toBe('#ff0080');
    expect(a3.toHex()).toBe('#ff8000');
    expect(a4.toHex()).toBe('#ff00ff');
    expect(a5.toHex()).toBe('#ffff00');
  });
});

describe('Color.getMonochromaticHarmonyColors', () => {
  it('returns the monochromatic harmony colors', () => {
    const red = new Color('#ff0000');
    const [orig, mono2, mono3, mono4, mono5] = red.getMonochromaticHarmonyColors();
    expect(orig.toHex()).toBe('#ff0000');
    expect(mono2.toHex()).toBe('#ff6666');
    expect(mono3.toHex()).toBe('#990000');
    expect(mono4.toHex()).toBe('#ff0000');
    expect(mono5.toHex()).toBe('#e61919');
  });
});

describe('Color.getColorSwatch', () => {
  it('returns the correct swatch for a color', () => {
    const baseColor = new Color('#625aa5');
    const swatch = baseColor.getColorSwatch();
    expect(swatch[100].toHex()).toBe('#dcd9f2');
    expect(swatch[200].toHex()).toBe('#bab6e2');
    expect(swatch[300].toHex()).toBe('#9b95d0');
    expect(swatch[400].toHex()).toBe('#7d76bc');
    expect(swatch[500].toHex()).toBe('#625aa5');
    expect(swatch[600].toHex()).toBe('#524e7e');
    expect(swatch[700].toHex()).toBe('#413e5b');
    expect(swatch[800].toHex()).toBe('#2d2c3a');
    expect(swatch[900].toHex()).toBe('#18171c');
  });
});

describe('Color.getColorPalette', () => {
  it('generates palettes with different harmonies and options', () => {
    const baseColor = new Color('#625aa5');

    // Default complementary palette
    const defaultPalette = baseColor.getColorPalette();
    expect(defaultPalette.secondaryColors).toHaveLength(1);
    const complement = baseColor.spin(180);
    expect(defaultPalette.secondaryColors[0][500].toHex()).toBe(complement.toHex());

    // Triadic palette
    const triadicPalette = baseColor.getColorPalette(ColorHarmony.TRIADIC);
    expect(triadicPalette.secondaryColors).toHaveLength(2);
    const triadic1 = baseColor.spin(-120);
    const triadic2 = baseColor.spin(120);
    expect(triadicPalette.secondaryColors[0][500].toHex()).toBe(triadic1.toHex());
    expect(triadicPalette.secondaryColors[1][500].toHex()).toBe(triadic2.toHex());

    // Semantic color harmonization options
    const noPullPalette = baseColor.getColorPalette(ColorHarmony.COMPLEMENTARY, {
      semanticHarmonization: {
        huePull: 0,
        chromaRange: [0.02, 0.25],
      },
    });
    const fullPullPalette = baseColor.getColorPalette(ColorHarmony.COMPLEMENTARY, {
      semanticHarmonization: {
        huePull: 1,
        chromaRange: [0.02, 0.25],
      },
    });
    const baseHue = baseColor.toOKLCH().h;
    const infoHueDefault = noPullPalette.info[500].toOKLCH().h;
    const infoHuePulled = fullPullPalette.info[500].toOKLCH().h;
    expect(infoHueDefault).toBeCloseTo(265, 0);
    expect(infoHuePulled).toBeCloseTo(baseHue, 0);

    // Neutral color harmonization options
    const neutralMatchPalette = baseColor.getColorPalette(ColorHarmony.COMPLEMENTARY, {
      neutralHarmonization: {
        tintChromaFactor: 0,
        maxTintChroma: 0.04,
      },
    });
    expect(neutralMatchPalette.tintedNeutrals[500].toHex()).toBe(
      neutralMatchPalette.neutrals[500].toHex()
    );

    const cappedTintPalette = baseColor.getColorPalette(ColorHarmony.COMPLEMENTARY, {
      neutralHarmonization: {
        tintChromaFactor: 1,
        maxTintChroma: 0.02,
      },
    });
    const cappedTintChroma = cappedTintPalette.tintedNeutrals[500].toOKLCH().c;
    expect(cappedTintChroma).toBeGreaterThan(0);
    expect(cappedTintChroma).toBeLessThanOrEqual(0.02);

    // Semantic chroma range option
    const defaultInfoChroma = defaultPalette.info[500].toOKLCH().c;
    const limitedChromaPalette = baseColor.getColorPalette(ColorHarmony.COMPLEMENTARY, {
      semanticHarmonization: {
        huePull: 0,
        chromaRange: [0.02, 0.05],
      },
    });
    const limitedInfoChroma = limitedChromaPalette.info[500].toOKLCH().c;
    expect(limitedInfoChroma).toBeGreaterThanOrEqual(0.02);
    expect(limitedInfoChroma).toBeLessThanOrEqual(0.05);
    expect(limitedInfoChroma).toBeLessThan(defaultInfoChroma);
  });
});

describe('Color.isDark sanity check', () => {
  it('identifies dark and light colors', () => {
    expect(new Color('#000000').isDark()).toBe(true);
    expect(new Color('#ffffff').isDark()).toBe(false);
  });
});

describe('Color.isOffWhite sanity check', () => {
  it('identifies off-white and non-off-white colors', () => {
    expect(new Color('#ffffff').isOffWhite()).toBe(true);
    expect(new Color('#f0f0f0').isOffWhite()).toBe(true);
    expect(new Color('#dddddd').isOffWhite()).toBe(false);
  });
});

describe('Color temperature methods', () => {
  it('estimates temperature and label', () => {
    const color = new Color('#ffa757');
    expect(color.getTemperature().label).toBe(ColorTemperatureLabel.INCANDESCENT);
  });

  it('returns a temperature string for off-white colors', () => {
    expect(new Color('#ffffff').getTemperatureAsString()).toBe('6504 K (cloudy sky)');
  });

  it('creates colors from temperature values or labels', () => {
    expect(Color.fromTemperature(1500).toHex()).toBe('#ff8400');
    expect(Color.fromTemperature(ColorTemperatureLabel.SHADE).toHex()).toBe('#dde6ff');
  });
});

describe('Color.getName', () => {
  it('returns the base color name and lightness modifier', () => {
    const red = new Color(BASE_HEX);
    expect(red.getName()).toEqual({
      name: BaseColorName.RED,
      lightness: ColorLightnessModifier.NORMAL,
    });

    const lightGray: ColorHSL = { h: 0, s: 0, l: 80 };
    const gray = new Color(lightGray);
    expect(gray.getName()).toEqual({
      name: BaseColorName.GRAY,
      lightness: ColorLightnessModifier.LIGHT,
    });
  });
});

describe('Color.getNameAsString', () => {
  it('formats the color name as a string', () => {
    const red = new Color(BASE_HEX);
    expect(red.getNameAsString()).toBe('red');

    const darkGreen: ColorHSL = { h: 120, s: 100, l: 20 };
    const green = new Color(darkGreen);
    expect(green.getNameAsString()).toBe('dark green');

    const lightGray: ColorHSL = { h: 0, s: 0, l: 80 };
    const gray = new Color(lightGray);
    expect(gray.getNameAsString()).toBe('light gray');
  });
});

describe('Color.clone', () => {
  it('creates a copy of the color instance', () => {
    const color = new Color(BASE_HEX);
    const cloned = color.clone();
    expect(cloned).toEqual(color);
    expect(cloned).not.toBe(color);
  });
});
