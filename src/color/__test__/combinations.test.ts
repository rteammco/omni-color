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

const red = new Color('#ff0000');
const green = new Color('#00ff00');
const blue = new Color('#0000ff');
const gray = new Color('#808080');
const white = new Color('#ffffff');
const halfRed = new Color({ r: 255, g: 0, b: 0, a: 0.5 });
const magenta = new Color('#ff00ff');

describe('mixColors', () => {
  it('defaults to additive RGB', () => {
    const result = mixColors([red, green]);
    expect(result.toHex()).toBe('#ffff00');
  });

  it('ignores mismatched weights', () => {
    const result = mixColors([red, green], { weights: [2] as any });
    expect(result.toHex()).toBe('#ffff00');
  });

  it('respects zero weight', () => {
    const result = mixColors([red, blue], { weights: [1, 0] });
    expect(result.toHex()).toBe('#ff0000');
  });

  it('mixes in HSL space', () => {
    const result = mixColors([red, blue], { space: MixSpace.HSL, weights: [0, 1] });
    expect(result.toHex()).toBe('#0000ff');
  });

  it('mixes across hue boundaries in HSL space', () => {
    const result = mixColors([red, magenta], { space: MixSpace.HSL });
    expect(result.toHex()).toBe('#ff0080');
  });

  it('mixes in LCH space', () => {
    const result = mixColors([red, blue], { space: MixSpace.LCH });
    expect(result.toHex()).toBe('#fb0080');
  });

  it('mixes in OKLCH space', () => {
    const result = mixColors([red, blue], { space: MixSpace.OKLCH });
    expect(result.toHex()).toBe('#ba00c2');
  });

  it('handles alpha channels', () => {
    const result = mixColors([halfRed, blue]);
    expect(result.toRGBA()).toEqual({ r: 255, g: 0, b: 255, a: 0.75 });
  });

  it('subtractive mixing of two colors', () => {
    const result = mixColors([red, blue], { type: MixType.SUBTRACTIVE });
    expect(result.toHex()).toBe('#000000');
  });

  it('subtractive mixing of multiple colors', () => {
    const result = mixColors([red, blue, green], { type: MixType.SUBTRACTIVE });
    expect(result.toHex()).toBe('#000000');
  });

  it('subtractive mixing respects weights', () => {
    const result = mixColors(
      [new Color('#00ffff'), new Color('#ffff00')],
      { type: MixType.SUBTRACTIVE, weights: [2, 1] }
    );
    expect(result.toHex()).toBe('#00ff00');
  });

  it('throws when fewer than two colors are provided', () => {
    expect(() => mixColors([red])).toThrow(
      '[mixColors] at least two colors are required for mixing'
    );
  });
});

describe('averageColors', () => {
  it('defaults to RGB averaging', () => {
    const result = averageColors([red, blue]);
    expect(result.toHex()).toBe('#800080');
  });

  it('ignores mismatched weights', () => {
    const result = averageColors([red, blue], { weights: [2] as any });
    expect(result.toHex()).toBe('#800080');
  });

  it('respects zero weight', () => {
    const result = averageColors([red, blue], { weights: [1, 0] });
    expect(result.toHex()).toBe('#ff0000');
  });

  it('averages in HSL space with weights', () => {
    const result = averageColors([red, green], { space: MixSpace.HSL, weights: [2, 1] });
    expect(result.toHex()).toBe('#ff8000');
  });

  it('averages across hue boundaries in HSL space', () => {
    const result = averageColors([red, magenta], { space: MixSpace.HSL });
    expect(result.toHex()).toBe('#ff0080');
  });

  it('averages in LCH space', () => {
    const result = averageColors([red, blue], { space: MixSpace.LCH });
    expect(result.toHex()).toBe('#fb0080');
  });

  it('averages in OKLCH space', () => {
    const result = averageColors([red, blue], { space: MixSpace.OKLCH });
    expect(result.toHex()).toBe('#ba00c2');
  });

  it('handles alpha channels', () => {
    const result = averageColors([halfRed, blue]);
    expect(result.toRGBA()).toEqual({ r: 128, g: 0, b: 128, a: 0.75 });
  });

  it('throws when fewer than two colors are provided', () => {
    expect(() => averageColors([red])).toThrow(
      '[averageColors] at least two colors are required for averaging'
    );
  });
});

describe('blendColors', () => {
  it('defaults to normal mode at ratio 0.5', () => {
    const result = blendColors(red, blue);
    expect(result.toHex()).toBe('#800080');
  });

  it('ratio 0 returns base color', () => {
    const result = blendColors(red, blue, { ratio: 0 });
    expect(result.toHex()).toBe('#ff0000');
  });

  it('ratio 1 returns blend color', () => {
    const result = blendColors(red, blue, { ratio: 1 });
    expect(result.toHex()).toBe('#0000ff');
  });

  it('ratio above 1 is clamped', () => {
    const result = blendColors(red, blue, { ratio: 1.5 });
    expect(result.toHex()).toBe('#0000ff');
  });

  it('ratio below 0 is clamped', () => {
    const result = blendColors(red, blue, { ratio: -0.5 });
    expect(result.toHex()).toBe('#ff0000');
  });

  it('multiply mode', () => {
    const result = blendColors(red, blue, { mode: BlendMode.MULTIPLY });
    expect(result.toHex()).toBe('#800000');
  });

  it('screen mode', () => {
    const result = blendColors(red, blue, { mode: BlendMode.SCREEN });
    expect(result.toHex()).toBe('#ff0080');
  });

  it('overlay mode fully applied', () => {
    const result = blendColors(gray, white, { mode: BlendMode.OVERLAY, ratio: 1 });
    expect(result.toHex()).toBe('#ffffff');
  });

  it('blends in HSL space regardless of mode', () => {
    const result = blendColors(red, blue, {
      space: BlendSpace.HSL,
      mode: BlendMode.MULTIPLY,
      ratio: 0.5,
    });
    expect(result.toHex()).toBe('#ff00ff');
  });

  it('wraps hue when blending in HSL space', () => {
    const result = blendColors(red, magenta, { space: BlendSpace.HSL, ratio: 0.5 });
    expect(result.toHex()).toBe('#ff0080');
  });

  it('handles alpha channels', () => {
    const result = blendColors(halfRed, blue, { ratio: 0.5 });
    expect(result.toRGBA()).toEqual({ r: 128, g: 0, b: 128, a: 0.75 });
  });
});
