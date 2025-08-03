import { BLACK } from './color.constants';
import { toRGBA } from './conversions';
import { ColorFormat, ColorRGBA } from './formats';
import { getRandomColorRGBA } from './utils';

export class Color {
  private color: ColorRGBA;

  constructor(color?: ColorFormat) {
    this.color = color ? toRGBA(color) : getRandomColorRGBA();
  }

  asRGBA(): ColorRGBA {
    return this.color;
  }
}
