import { clampValue } from '../utils';
import { toRGBA } from './conversions';
import { ColorRGBA } from './formats';
import { BASE_COLOR_HUE_RANGES, BaseColorName } from './names';

export interface RandomColorOptions {
  /**
   * The alpha value of the random color (0-1). If not specified, it will default to 1 (opaque)
   * unless `randomizeAlpha` is `true`.
   */
  alpha?: number;
  /**
   * Randomize within range of the anchor color. For example, if `anchorColor` is `BaseColorName.GREEN`,
   * the generated color will have a random hue in the green range (75° to 164°). Grayscale anchor
   * colors will restrict the random color's lightness and saturation to the appropriate ranges.
   */
  anchorColor?: BaseColorName;
  /**
   * If `paletteSuitable` is `true`, generated colors will have moderate lightness and
   * sufficient saturation to make them suitable for creating color palettes.
   *
   * This option will be ignored if `anchorColor` is `BaseColorName.BLACK`, `BaseColorName.WHITE`,
   * or `BaseColorName.GRAY`.
   */
  paletteSuitable?: boolean;
  /**
   * If `randomizeAlpha` is `true`, the alpha value of the generated color will be randomized (0-1).
   * This option is ignored if an `alpha` value is explicitly provided.
   */
  randomizeAlpha?: boolean;
}

function getRandomIntInclusive(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomAnchoredHueValue(name: BaseColorName): number {
  const ranges = BASE_COLOR_HUE_RANGES[name];
  const range = ranges[Math.floor(Math.random() * ranges.length)];
  return getRandomIntInclusive(range.start, range.end);
}

export function getRandomColorRGBA(options: RandomColorOptions = {}): ColorRGBA {
  const { alpha, anchorColor, paletteSuitable, randomizeAlpha } = options;

  let h: number;
  let s: number;
  let l: number;

  if (
    anchorColor &&
    [BaseColorName.BLACK, BaseColorName.WHITE, BaseColorName.GRAY].includes(anchorColor)
  ) {
    h = getRandomIntInclusive(0, 359);
    s = getRandomIntInclusive(0, 10);
    if (anchorColor === BaseColorName.BLACK) {
      l = getRandomIntInclusive(0, 10); // black-ish
    } else if (anchorColor === BaseColorName.WHITE) {
      l = getRandomIntInclusive(90, 100); // white-ish
    } else {
      l = getRandomIntInclusive(10, 90); // gray
    }
  } else {
    h = anchorColor ? getRandomAnchoredHueValue(anchorColor) : getRandomIntInclusive(0, 359);
    if (paletteSuitable) {
      s = getRandomIntInclusive(40, 100);
      l = getRandomIntInclusive(25, 75);
    } else {
      s = getRandomIntInclusive(0, 100);
      l = getRandomIntInclusive(0, 100);
    }
  }

  let a: number;
  if (alpha !== undefined) {
    a = clampValue(alpha, 0, 1);
  } else if (randomizeAlpha) {
    a = +Math.random().toFixed(3);
  } else {
    a = 1;
  }

  return toRGBA({ h, s, l, a });
}
