import { toHex, toRGB, toRGBA, rgbaToHSL, rgbaToHSLA } from './conversions';
import {
  ColorFormat,
  ColorHex,
  ColorRGB,
  ColorRGBA,
  ColorHSL,
  ColorHSLA,
} from './formats';
import { getRandomColorRGBA } from './utils';

export class Color {
  private color: ColorRGBA;

  constructor(color?: ColorFormat) {
    this.color = color ? toRGBA(color) : getRandomColorRGBA();
  }

  toRGBA(): ColorRGBA {
    return this.color;
  }

  toRGB(): ColorRGB {
    return toRGB(this.color);
  }

  toHex(): ColorHex {
    return toHex(this.color);
  }

  toHSL(): ColorHSL {
    return rgbaToHSL(this.color);
  }

  toHSLA(): ColorHSLA {
    return rgbaToHSLA(this.color);
  }
}
