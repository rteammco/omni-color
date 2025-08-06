import {
  toHex,
  toRGB,
  toRGBA,
  rgbaToHSL,
  rgbaToHSLA,
  rgbaToHSV,
  rgbaToCMYK,
  rgbaToLCH,
  rgbaToOKLCH,
} from './conversions';
import {
  ColorFormat,
  ColorHex,
  ColorRGB,
  ColorRGBA,
  ColorHSL,
  ColorHSLA,
  ColorHSV,
  ColorCMYK,
  ColorLCH,
  ColorOKLCH,
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

  toHSV(): ColorHSV {
    return rgbaToHSV(this.color);
  }

  toCMYK(): ColorCMYK {
    return rgbaToCMYK(this.color);
  }

  toLCH(): ColorLCH {
    return rgbaToLCH(this.color);
  }

  toOKLCH(): ColorOKLCH {
    return rgbaToOKLCH(this.color);
  }
}
