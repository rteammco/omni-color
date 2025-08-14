import {
  toCMYK,
  toHex,
  toHex8,
  toHSL,
  toHSLA,
  toHSV,
  toHSVA,
  toLCH,
  toOKLCH,
  toRGB,
} from './conversions';
import {
  ColorCMYK,
  ColorFormat,
  ColorHex,
  ColorHSL,
  ColorHSLA,
  ColorHSV,
  ColorHSVA,
  ColorLCH,
  ColorOKLCH,
  ColorRGB,
  ColorRGBA,
} from './formats';
import {
  ColorHarmony,
  getAnalogousHarmonyColors,
  getComplementaryColors,
  getHarmonyColors,
  getMonochromaticHarmonyColors,
  getSplitComplementaryColors,
  getSquareHarmonyColors,
  getTetradicHarmonyColors,
  getTriadicHarmonyColors,
} from './harmonies';
import {
  brightenColor,
  colorToGrayscale,
  darkenColor,
  desaturateColor,
  saturateColor,
  spinColorHue,
} from './manipulations';
import { ColorLightnessModifier, ColorNameAndLightness, getBaseColorName } from './names';
import { ColorSwatch, getColorSwatch } from './swatch';
import { getColorRGBAFromInput, isColorDark } from './utils';

export class Color {
  private color: ColorRGBA;

  constructor(color?: ColorFormat | string) {
    this.color = getColorRGBAFromInput(color);
  }

  toRGB(): ColorRGB {
    return toRGB(this.color);
  }

  toHex(): ColorHex {
    return toHex(this.color);
  }

  toHex8(): ColorHex {
    return toHex8(this.color);
  }

  toRGBA(): ColorRGBA {
    return this.color;
  }

  toHSL(): ColorHSL {
    return toHSL(this.color);
  }

  toHSLA(): ColorHSLA {
    return toHSLA(this.color);
  }

  toHSV(): ColorHSV {
    return toHSV(this.color);
  }

  toHSVA(): ColorHSVA {
    return toHSVA(this.color);
  }

  toCMYK(): ColorCMYK {
    return toCMYK(this.color);
  }

  toLCH(): ColorLCH {
    return toLCH(this.color);
  }

  toOKLCH(): ColorOKLCH {
    return toOKLCH(this.color);
  }

  getAlpha(): number {
    return this.color.a;
  }

  setAlpha(alpha: number): Color {
    if (typeof alpha !== 'number' || alpha < 0 || alpha > 1) {
      throw new Error('[setAlpha] alpha must be a number between 0 and 1');
    }
    this.color.a = +alpha.toFixed(3);
    return this;
  }

  spin(degrees: number): Color {
    return spinColorHue(this, degrees);
  }

  brighten(percentage?: number): Color {
    return brightenColor(this, percentage);
  }

  darken(percentage?: number): Color {
    return darkenColor(this, percentage);
  }

  saturate(percentage?: number): Color {
    return saturateColor(this, percentage);
  }

  desaturate(percentage?: number): Color {
    return desaturateColor(this, percentage);
  }

  grayscale(): Color {
    return colorToGrayscale(this);
  }

  getComplementaryColors(): [Color, Color] {
    return getComplementaryColors(this);
  }

  getSplitComplementaryColors(): [Color, Color, Color] {
    return getSplitComplementaryColors(this);
  }

  getTriadicHarmonyColors(): [Color, Color, Color] {
    return getTriadicHarmonyColors(this);
  }

  getSquareHarmonyColors(): [Color, Color, Color, Color] {
    return getSquareHarmonyColors(this);
  }

  getTetradicHarmonyColors(): [Color, Color, Color, Color] {
    return getTetradicHarmonyColors(this);
  }

  getAnalogousHarmonyColors(): [Color, Color, Color, Color, Color] {
    return getAnalogousHarmonyColors(this);
  }

  getMonochromaticHarmonyColors(): [Color, Color, Color, Color, Color] {
    return getMonochromaticHarmonyColors(this);
  }

  getHarmonyColors(harmony: ColorHarmony): Color[] {
    return getHarmonyColors(this, harmony);
  }

  getColorSwatch(): ColorSwatch {
    return getColorSwatch(this);
  }

  isDark(): boolean {
    return isColorDark(this);
  }

  getName(): ColorNameAndLightness {
    return getBaseColorName(this);
  }

  getNameAsString(): string {
    const { name, lightness } = this.getName();
    if (lightness === ColorLightnessModifier.NORMAL) {
      return name.toLowerCase();
    }
    return `${lightness} ${name}`.toLowerCase();
  }

  clone(): Color {
    return new Color(this.color);
  }
}
