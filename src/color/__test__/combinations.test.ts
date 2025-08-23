import { Color } from '../color';
import {
  averageColors,
  blendColors,
  BlendMode,
  BlendSpace,
  mixColors,
  MixSpace,
  MixType,
} from '../combinations';

describe('mixColors', () => {
  it('mixes colors additively in RGB space', () => {
    const red = new Color('#ff0000');
    const green = new Color('#00ff00');
    const result = mixColors([red, green], {
      type: MixType.ADDITIVE,
      space: MixSpace.RGB,
    });
    expect(result.toHex()).toBe('#ffff00');
  });

  it('mixes red, green, and blue additively to white', () => {
    const red = new Color('#ff0000');
    const green = new Color('#00ff00');
    const blue = new Color('#0000ff');
    const result = mixColors([red, green, blue], {
      type: MixType.ADDITIVE,
      space: MixSpace.RGB,
    });
    expect(result.toHex()).toBe('#ffffff');
  });

  it('mixes colors subtractively in CMYK space', () => {
    const cyan = new Color('#00ffff');
    const yellow = new Color('#ffff00');
    const result = mixColors([cyan, yellow], { type: MixType.SUBTRACTIVE });
    expect(result.toHex()).toBe('#00ff00');
  });

  it('mixes cyan, magenta, and yellow subtractively to black', () => {
    const cyan = new Color('#00ffff');
    const magenta = new Color('#ff00ff');
    const yellow = new Color('#ffff00');
    const result = mixColors([cyan, magenta, yellow], {
      type: MixType.SUBTRACTIVE,
    });
    expect(result.toHex()).toBe('#000000');
  });

  it('mixes colors in HSL space with weights', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = mixColors([red, blue], {
      space: MixSpace.HSL,
      weights: [1, 3],
    });
    expect(result.toHex()).toBe('#5100ff');
  });

  it('defaults to additive RGB mixing', () => {
    const red = new Color('#ff0000');
    const green = new Color('#00ff00');
    const result = mixColors([red, green]);
    expect(result.toHex()).toBe('#ffff00');
  });

  it('throws when fewer than two colors are provided', () => {
    const red = new Color('#ff0000');
    expect(() => mixColors([red])).toThrow(
      '[mixColors] at least two colors are required for mixing'
    );
  });

  it('defaults weights to 1 when provided weights sum to 0', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = mixColors([red, blue], { weights: [1, -1] });
    expect(result.toHex()).toBe('#ff00ff');
  });

  it('mixes colors with alpha channel in RGB space', () => {
    const semiRed = new Color({ r: 255, g: 0, b: 0, a: 0.5 });
    const blue = new Color({ r: 0, g: 0, b: 255, a: 1 });
    const result = mixColors([semiRed, blue], { type: MixType.ADDITIVE, space: MixSpace.RGB });
    expect(result.toHex()).toBe('#ff00ff');
    expect(result.toRGBA().a).toBe(0.75);
  });

  it('mixes colors in LCH space', () => {
    const black = new Color('#000000');
    const white = new Color('#ffffff');
    const result = mixColors([black, white], { space: MixSpace.LCH });
    expect(result.toHex()).toBe('#777777');
  });

  it('mixes colors in OKLCH space', () => {
    const black = new Color('#000000');
    const white = new Color('#ffffff');
    const result = mixColors([black, white], { space: MixSpace.OKLCH });
    expect(result.toHex()).toBe('#636363');
  });

  it('handles hue wrap-around in HSL space', () => {
    const h1 = new Color({ h: 350, s: 100, l: 50 });
    const h2 = new Color({ h: 10, s: 100, l: 50 });
    const result = mixColors([h1, h2], { space: MixSpace.HSL });
    expect(result.toHex()).toBe('#ff0000');
  });

  it('defaults to equal weights when weights length mismatches', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = mixColors([red, blue], { weights: [2] });
    expect(result.toHex()).toBe('#ff00ff');
  });

  it('ignores colors with zero weight', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = mixColors([red, blue], { weights: [0, 1] });
    expect(result.toHex()).toBe('#0000ff');
  });
});

describe('averageColors', () => {
  it('averages colors in RGB space', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = averageColors([red, blue], { space: MixSpace.RGB });
    expect(result.toHex()).toBe('#800080');
  });

  it('averages red, green, and blue to gray in RGB space', () => {
    const red = new Color('#ff0000');
    const green = new Color('#00ff00');
    const blue = new Color('#0000ff');
    const result = averageColors([red, green, blue], { space: MixSpace.RGB });
    expect(result.toHex()).toBe('#555555');
  });

  it('averages colors in HSL space with weights', () => {
    const red = new Color('#ff0000');
    const green = new Color('#00ff00');
    const result = averageColors([red, green], {
      space: MixSpace.HSL,
      weights: [1, 2],
    });
    expect(result.toHex()).toBe('#80ff00');
  });

  it('defaults to RGB averaging', () => {
    const red = new Color('#ff0000');
    const green = new Color('#00ff00');
    const result = averageColors([red, green]);
    expect(result.toHex()).toBe('#808000');
  });

  it('throws when fewer than two colors are provided', () => {
    const red = new Color('#ff0000');
    expect(() => averageColors([red])).toThrow(
      '[averageColors] at least two colors are required for averaging'
    );
  });

  it('averages colors with alpha channel', () => {
    const semiRed = new Color({ r: 255, g: 0, b: 0, a: 0.5 });
    const blue = new Color({ r: 0, g: 0, b: 255, a: 1 });
    const result = averageColors([semiRed, blue], { space: MixSpace.RGB });
    expect(result.toHex()).toBe('#800080');
    expect(result.toRGBA().a).toBe(0.75);
  });

  it('averages black and white in LCH space', () => {
    const black = new Color('#000000');
    const white = new Color('#ffffff');
    const result = averageColors([black, white], { space: MixSpace.LCH });
    expect(result.toHex()).toBe('#777777');
  });

  it('averages black and white in OKLCH space', () => {
    const black = new Color('#000000');
    const white = new Color('#ffffff');
    const result = averageColors([black, white], { space: MixSpace.OKLCH });
    expect(result.toHex()).toBe('#636363');
  });

  it('averages hues correctly across the 360° boundary', () => {
    const h1 = new Color({ h: 350, s: 100, l: 50 });
    const h2 = new Color({ h: 10, s: 100, l: 50 });
    const result = averageColors([h1, h2], { space: MixSpace.HSL });
    expect(result.toHex()).toBe('#ff0000');
  });

  it('defaults to equal weights when weights length mismatches', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = averageColors([red, blue], { weights: [2] });
    expect(result.toHex()).toBe('#800080');
  });

  it('defaults weights to equal when provided weights sum to 0', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = averageColors([red, blue], { weights: [1, -1] });
    expect(result.toHex()).toBe('#800080');
  });
});

describe('blendColors', () => {
  it('blends using multiply mode', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = blendColors(red, blue, { mode: BlendMode.MULTIPLY, ratio: 1 });
    expect(result.toHex()).toBe('#000000');
  });

  it('partially blends using multiply mode', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = blendColors(red, blue, {
      mode: BlendMode.MULTIPLY,
      ratio: 0.5,
    });
    expect(result.toHex()).toBe('#800000');
  });

  it('blends using screen mode', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = blendColors(red, blue, { mode: BlendMode.SCREEN, ratio: 1 });
    expect(result.toHex()).toBe('#ff00ff');
  });

  it('partially blends using screen mode', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = blendColors(red, blue, {
      mode: BlendMode.SCREEN,
      ratio: 0.5,
    });
    expect(result.toHex()).toBe('#ff0080');
  });

  it('blends using overlay mode', () => {
    const gray = new Color('#808080');
    const white = new Color('#ffffff');
    const result = blendColors(gray, white, { mode: BlendMode.OVERLAY, ratio: 1 });
    expect(result.toHex()).toBe('#ffffff');
  });

  it('returns base color when ratio is 0', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = blendColors(red, blue, { ratio: 0 });
    expect(result.toHex()).toBe('#ff0000');
  });

  it('returns blend color when ratio is 1 in normal mode', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = blendColors(red, blue, { mode: BlendMode.NORMAL, ratio: 1 });
    expect(result.toHex()).toBe('#0000ff');
  });

  it('blends in HSL space', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = blendColors(red, blue, {
      space: BlendSpace.HSL,
      ratio: 0.5,
    });
    expect(result.toHex()).toBe('#ff00ff');
  });

  it('clamps ratio outside of range 0-1', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    expect(blendColors(red, blue, { ratio: -1 }).toHex()).toBe('#ff0000');
    expect(blendColors(red, blue, { ratio: 2 }).toHex()).toBe('#0000ff');
  });

  it('blends colors with alpha channel in RGB space', () => {
    const semiRed = new Color({ r: 255, g: 0, b: 0, a: 0.5 });
    const blue = new Color({ r: 0, g: 0, b: 255, a: 0.2 });
    const result = blendColors(semiRed, blue, { ratio: 0.5 });
    expect(result.toHex()).toBe('#800080');
    expect(result.toRGBA().a).toBe(0.35);
  });

  it('handles hue wrap-around when blending in HSL space', () => {
    const h1 = new Color({ h: 350, s: 100, l: 50 });
    const h2 = new Color({ h: 10, s: 100, l: 50 });
    const result = blendColors(h1, h2, { space: BlendSpace.HSL, ratio: 0.5 });
    expect(result.toHex()).toBe('#ff0000');
  });

  it('blends using overlay mode with dark base color', () => {
    const darkGray = new Color('#404040');
    const red = new Color('#ff0000');
    const result = blendColors(darkGray, red, { mode: BlendMode.OVERLAY, ratio: 1 });
    expect(result.toHex()).toBe('#800000');
  });
});
