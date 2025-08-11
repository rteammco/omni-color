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
  ColorHSL,
  ColorHSLA,
  ColorHSV,
  ColorHSVA,
  ColorHex,
  ColorLCH,
  ColorOKLCH,
  ColorRGB,
  ColorRGBA,
} from './formats';
import { getComplementaryColors } from './harmonies';
import { spinColorHue } from './manipulations';
import { ColorLightnessModifier, ColorNameAndLightness, getBaseColorName } from './names';
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

  getComplementaryColors(): [Color, Color] {
    return getComplementaryColors(this);
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
