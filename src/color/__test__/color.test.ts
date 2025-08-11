import { Color } from '../color';
import { BaseColorName, ColorLightnessModifier } from '../names';
import type {
  ColorHex,
  ColorRGB,
  ColorHSL,
  ColorHSLA,
  ColorHSV,
  ColorHSVA,
  ColorCMYK,
  ColorLCH,
  ColorOKLCH,
} from '../formats';

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
});

describe('Color.isDark sanity check', () => {
  it('identifies dark and light colors', () => {
    expect(new Color('#000000').isDark()).toBe(true);
    expect(new Color('#ffffff').isDark()).toBe(false);
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
