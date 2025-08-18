import { clampValue } from '../utils';
import { toRGBA } from './conversions';
import { ColorRGBA } from './formats';
import { BaseColorName } from './names';

export interface RandomColorOptions {
  alpha?: number;
  hue?: BaseColorName;
  /**
   * When `true`, generated colors will have moderate lightness and
   * sufficient saturation to make them suitable for creating color palettes.
   */
  isPaletteColor?: boolean;
  shouldRandomizeAlpha?: boolean;
}

interface HueRange {
  start: number;
  end: number;
}

const BASE_COLOR_HUE_RANGES: Record<BaseColorName, HueRange[]> = {
  [BaseColorName.RED]: [
    { start: 345, end: 360 },
    { start: 0, end: 15 },
  ],
  [BaseColorName.ORANGE]: [{ start: 15, end: 45 }],
  [BaseColorName.YELLOW]: [{ start: 45, end: 75 }],
  [BaseColorName.GREEN]: [{ start: 75, end: 165 }],
  [BaseColorName.BLUE]: [{ start: 165, end: 255 }],
  [BaseColorName.PURPLE]: [{ start: 255, end: 285 }],
  [BaseColorName.PINK]: [{ start: 285, end: 345 }],
  // Hue doesn't matter for neutrals, but keep a default full range.
  [BaseColorName.BLACK]: [{ start: 0, end: 360 }],
  [BaseColorName.GRAY]: [{ start: 0, end: 360 }],
  [BaseColorName.WHITE]: [{ start: 0, end: 360 }],
};

function randomIntInclusive(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomHue(name: BaseColorName): number {
  const ranges = BASE_COLOR_HUE_RANGES[name];
  const range = ranges[Math.floor(Math.random() * ranges.length)];
  // Treat range end as exclusive
  return randomIntInclusive(range.start, range.end - 1);
}

export function getRandomColorRGBA(options: RandomColorOptions = {}): ColorRGBA {
  const { alpha, hue, isPaletteColor, shouldRandomizeAlpha } = options;

  let h: number;
  let s: number;
  let l: number;

  if (hue === BaseColorName.BLACK || hue === BaseColorName.GRAY || hue === BaseColorName.WHITE) {
    h = randomIntInclusive(0, 359);
    s = randomIntInclusive(0, 10);
    if (hue === BaseColorName.BLACK) {
      l = randomIntInclusive(0, 10);
    } else if (hue === BaseColorName.WHITE) {
      l = randomIntInclusive(90, 100);
    } else {
      // GRAY
      l = randomIntInclusive(10, 90);
    }
  } else {
    h = hue ? getRandomHue(hue) : randomIntInclusive(0, 359);
    if (isPaletteColor) {
      s = randomIntInclusive(40, 100);
      l = randomIntInclusive(25, 75);
    } else {
      s = randomIntInclusive(0, 100);
      l = randomIntInclusive(0, 100);
    }
  }

  let a: number;
  if (alpha !== undefined) {
    a = clampValue(alpha, 0, 1);
  } else if (shouldRandomizeAlpha) {
    a = Math.random();
  } else {
    a = 1;
  }

  return toRGBA({ h, s, l, a });
}
