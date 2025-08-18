import { ColorRGBA } from './formats';
import { BaseColorName } from './names';

export interface RandomColorOptions {
  alpha?: number;
  hue?: BaseColorName;
  shouldBeReadable?: boolean;
  shouldRandomizeAlpha?: boolean;
}

export function getRandomColorRGBA(_?: RandomColorOptions): ColorRGBA {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
    a: 1,
  };
}
