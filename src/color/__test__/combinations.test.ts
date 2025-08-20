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

  it('mixes colors subtractively in CMYK space', () => {
    const cyan = new Color('#00ffff');
    const yellow = new Color('#ffff00');
    const result = mixColors([cyan, yellow], { type: MixType.SUBTRACTIVE });
    expect(result.toHex()).toBe('#00ff00');
  });

  it('mixes colors in HSL space with weights', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = mixColors([red, blue], {
      space: MixSpace.HSL,
      weights: [1, 3],
    });
    expect(result.toHex()).toBe('#00ffff');
  });

  it('defaults to additive RGB mixing', () => {
    const red = new Color('#ff0000');
    const green = new Color('#00ff00');
    const result = mixColors([red, green]);
    expect(result.toHex()).toBe('#ffff00');
  });

  it('throws when fewer than two colors are provided', () => {
    const red = new Color('#ff0000');
    expect(() => mixColors([red])).toThrow('mixColors requires at least two colors');
  });
});

describe('averageColors', () => {
  it('averages colors in RGB space', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = averageColors([red, blue], { space: MixSpace.RGB });
    expect(result.toHex()).toBe('#800080');
  });

  it('averages colors in HSL space with weights', () => {
    const red = new Color('#ff0000');
    const green = new Color('#00ff00');
    const result = averageColors([red, green], {
      space: MixSpace.HSL,
      weights: [1, 2],
    });
    expect(result.toHex()).toBe('#aaff00');
  });

  it('defaults to RGB averaging', () => {
    const red = new Color('#ff0000');
    const green = new Color('#00ff00');
    const result = averageColors([red, green]);
    expect(result.toHex()).toBe('#808000');
  });

  it('throws when fewer than two colors are provided', () => {
    const red = new Color('#ff0000');
    expect(() => averageColors([red])).toThrow('averageColors requires at least two colors');
  });
});

describe('blendColors', () => {
  it('blends using multiply mode', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = blendColors(red, blue, { mode: BlendMode.MULTIPLY, ratio: 1 });
    expect(result.toHex()).toBe('#000000');
  });

  it('blends using screen mode', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = blendColors(red, blue, { mode: BlendMode.SCREEN, ratio: 1 });
    expect(result.toHex()).toBe('#ff00ff');
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
    expect(result.toHex()).toBe('#00ff00');
  });
});

