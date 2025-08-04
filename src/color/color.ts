import { toHex, toRGBA } from './conversions';
import { ColorFormat, ColorHex, ColorRGBA } from './formats';
import { getRandomColorRGBA } from './utils';

export class Color {
  private color: ColorRGBA;

  constructor(color?: ColorFormat) {
    this.color = color ? toRGBA(color) : getRandomColorRGBA();
  }

  toRGBA(): ColorRGBA {
    return this.color;
  }

  toHex(): ColorHex {
    return toHex(this.color);
  }
}
