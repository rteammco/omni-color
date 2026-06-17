import { Color } from '../color';
import {
  getAPCAReadabilityReport,
  getAPCAReadabilityScore,
  getBestBackgroundColorForText,
  getMostReadableTextColorForBackground,
  getWCAGContrastRatio,
  getWCAGReadabilityReport,
  isTextReadable,
} from '../readability';

describe('getWCAGContrastRatio', () => {
  it('red dark on #000000 alpha 1', () => {
    const fg = new Color('#990000');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.35, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.35, 2);
  });

  it('red dark on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 153, g: 0, b: 0, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.31, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.31, 2);
  });

  it('red dark on #000000 alpha 0', () => {
    const fg = new Color({ r: 153, g: 0, b: 0, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('red dark on #ffffff alpha 1', () => {
    const fg = new Color('#990000');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(8.92, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(8.92, 2);
  });

  it('red dark on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 153, g: 0, b: 0, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(3.03, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(3.03, 2);
  });

  it('red dark on #ffffff alpha 0', () => {
    const fg = new Color({ r: 153, g: 0, b: 0, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('red dark on #777777 alpha 1', () => {
    const fg = new Color('#990000');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.99, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.99, 2);
  });

  it('red dark on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 153, g: 0, b: 0, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.71, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.71, 2);
  });

  it('red dark on #777777 alpha 0', () => {
    const fg = new Color({ r: 153, g: 0, b: 0, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('red normal on #000000 alpha 1', () => {
    const fg = new Color('#ff0000');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(5.25, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(5.25, 2);
  });

  it('red normal on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 0, b: 0, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.91, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.91, 2);
  });

  it('red normal on #000000 alpha 0', () => {
    const fg = new Color({ r: 255, g: 0, b: 0, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('red normal on #ffffff alpha 1', () => {
    const fg = new Color('#ff0000');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(4.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(4.0, 2);
  });

  it('red normal on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 0, b: 0, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.44, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.44, 2);
  });

  it('red normal on #ffffff alpha 0', () => {
    const fg = new Color({ r: 255, g: 0, b: 0, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('red normal on #777777 alpha 1', () => {
    const fg = new Color('#ff0000');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.12, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.12, 2);
  });

  it('red normal on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 0, b: 0, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.23, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.23, 2);
  });

  it('red normal on #777777 alpha 0', () => {
    const fg = new Color({ r: 255, g: 0, b: 0, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('red light on #000000 alpha 1', () => {
    const fg = new Color('#ff9999');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(10.27, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(10.27, 2);
  });

  it('red light on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 153, b: 153, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(3.06, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(3.06, 2);
  });

  it('red light on #000000 alpha 0', () => {
    const fg = new Color({ r: 255, g: 153, b: 153, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('red light on #ffffff alpha 1', () => {
    const fg = new Color('#ff9999');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.05, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.05, 2);
  });

  it('red light on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 153, b: 153, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.42, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.42, 2);
  });

  it('red light on #ffffff alpha 0', () => {
    const fg = new Color({ r: 255, g: 153, b: 153, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('red light on #777777 alpha 1', () => {
    const fg = new Color('#ff9999');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.19, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.19, 2);
  });

  it('red light on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 153, b: 153, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.49, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.49, 2);
  });

  it('red light on #777777 alpha 0', () => {
    const fg = new Color({ r: 255, g: 153, b: 153, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('orange dark on #000000 alpha 1', () => {
    const fg = new Color('#994c00');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(3.39, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(3.39, 2);
  });

  it('orange dark on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 153, g: 76, b: 0, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.59, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.59, 2);
  });

  it('orange dark on #000000 alpha 0', () => {
    const fg = new Color({ r: 153, g: 76, b: 0, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('orange dark on #ffffff alpha 1', () => {
    const fg = new Color('#994c00');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(6.2, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(6.2, 2);
  });

  it('orange dark on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 153, g: 76, b: 0, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.26, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.26, 2);
  });

  it('orange dark on #ffffff alpha 0', () => {
    const fg = new Color({ r: 153, g: 76, b: 0, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('orange dark on #777777 alpha 1', () => {
    const fg = new Color('#994c00');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.38, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.38, 2);
  });

  it('orange dark on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 153, g: 76, b: 0, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.22, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.22, 2);
  });

  it('orange dark on #777777 alpha 0', () => {
    const fg = new Color({ r: 153, g: 76, b: 0, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('orange normal on #000000 alpha 1', () => {
    const fg = new Color('#ff7f00');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(8.29, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(8.29, 2);
  });

  it('orange normal on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 127, b: 0, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.63, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.63, 2);
  });

  it('orange normal on #000000 alpha 0', () => {
    const fg = new Color({ r: 255, g: 127, b: 0, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('orange normal on #ffffff alpha 1', () => {
    const fg = new Color('#ff7f00');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.53, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.53, 2);
  });

  it('orange normal on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 127, b: 0, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.61, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.61, 2);
  });

  it('orange normal on #ffffff alpha 0', () => {
    const fg = new Color({ r: 255, g: 127, b: 0, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('orange normal on #777777 alpha 1', () => {
    const fg = new Color('#ff7f00');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.77, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.77, 2);
  });

  it('orange normal on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 127, b: 0, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.28, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.28, 2);
  });

  it('orange normal on #777777 alpha 0', () => {
    const fg = new Color({ r: 255, g: 127, b: 0, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('orange light on #000000 alpha 1', () => {
    const fg = new Color('#ffb266');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(11.81, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(11.81, 2);
  });

  it('orange light on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 178, b: 102, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(3.39, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(3.39, 2);
  });

  it('orange light on #000000 alpha 0', () => {
    const fg = new Color({ r: 255, g: 178, b: 102, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('orange light on #ffffff alpha 1', () => {
    const fg = new Color('#ffb266');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.78, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.78, 2);
  });

  it('orange light on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 178, b: 102, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.33, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.33, 2);
  });

  it('orange light on #ffffff alpha 0', () => {
    const fg = new Color({ r: 255, g: 178, b: 102, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('orange light on #777777 alpha 1', () => {
    const fg = new Color('#ffb266');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.52, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.52, 2);
  });

  it('orange light on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 178, b: 102, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.62, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.62, 2);
  });

  it('orange light on #777777 alpha 0', () => {
    const fg = new Color({ r: 255, g: 178, b: 102, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('yellow dark on #000000 alpha 1', () => {
    const fg = new Color('#999900');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(6.91, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(6.91, 2);
  });

  it('yellow dark on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 153, g: 153, b: 0, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.36, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.36, 2);
  });

  it('yellow dark on #000000 alpha 0', () => {
    const fg = new Color({ r: 153, g: 153, b: 0, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('yellow dark on #ffffff alpha 1', () => {
    const fg = new Color('#999900');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(3.04, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(3.04, 2);
  });

  it('yellow dark on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 153, g: 153, b: 0, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.68, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.68, 2);
  });

  it('yellow dark on #ffffff alpha 0', () => {
    const fg = new Color({ r: 153, g: 153, b: 0, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('yellow dark on #777777 alpha 1', () => {
    const fg = new Color('#999900');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.47, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.47, 2);
  });

  it('yellow dark on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 153, g: 153, b: 0, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.2, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.2, 2);
  });

  it('yellow dark on #777777 alpha 0', () => {
    const fg = new Color({ r: 153, g: 153, b: 0, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('yellow normal on #000000 alpha 1', () => {
    const fg = new Color('#ffff00');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(19.56, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(19.56, 2);
  });

  it('yellow normal on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 255, b: 0, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(4.97, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(4.97, 2);
  });

  it('yellow normal on #000000 alpha 0', () => {
    const fg = new Color({ r: 255, g: 255, b: 0, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('yellow normal on #ffffff alpha 1', () => {
    const fg = new Color('#ffff00');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.07, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.07, 2);
  });

  it('yellow normal on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 255, b: 0, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.06, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.06, 2);
  });

  it('yellow normal on #ffffff alpha 0', () => {
    const fg = new Color({ r: 255, g: 255, b: 0, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('yellow normal on #777777 alpha 1', () => {
    const fg = new Color('#ffff00');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(4.17, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(4.17, 2);
  });

  it('yellow normal on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 255, b: 0, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.19, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.19, 2);
  });

  it('yellow normal on #777777 alpha 0', () => {
    const fg = new Color({ r: 255, g: 255, b: 0, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('yellow light on #000000 alpha 1', () => {
    const fg = new Color('#ffff99');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(20.02, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(20.02, 2);
  });

  it('yellow light on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 255, b: 153, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(5.08, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(5.08, 2);
  });

  it('yellow light on #000000 alpha 0', () => {
    const fg = new Color({ r: 255, g: 255, b: 153, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('yellow light on #ffffff alpha 1', () => {
    const fg = new Color('#ffff99');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.05, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.05, 2);
  });

  it('yellow light on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 255, b: 153, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.03, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.03, 2);
  });

  it('yellow light on #ffffff alpha 0', () => {
    const fg = new Color({ r: 255, g: 255, b: 153, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('yellow light on #777777 alpha 1', () => {
    const fg = new Color('#ffff99');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(4.27, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(4.27, 2);
  });

  it('yellow light on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 255, b: 153, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.26, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.26, 2);
  });

  it('yellow light on #777777 alpha 0', () => {
    const fg = new Color({ r: 255, g: 255, b: 153, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('green dark on #000000 alpha 1', () => {
    const fg = new Color('#006600');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.9, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.9, 2);
  });

  it('green dark on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 102, b: 0, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.47, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.47, 2);
  });

  it('green dark on #000000 alpha 0', () => {
    const fg = new Color({ r: 0, g: 102, b: 0, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('green dark on #ffffff alpha 1', () => {
    const fg = new Color('#006600');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(7.24, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(7.24, 2);
  });

  it('green dark on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 102, b: 0, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.43, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.43, 2);
  });

  it('green dark on #ffffff alpha 0', () => {
    const fg = new Color({ r: 0, g: 102, b: 0, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('green dark on #777777 alpha 1', () => {
    const fg = new Color('#006600');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.62, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.62, 2);
  });

  it('green dark on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 102, b: 0, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.34, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.34, 2);
  });

  it('green dark on #777777 alpha 0', () => {
    const fg = new Color({ r: 0, g: 102, b: 0, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('green normal on #000000 alpha 1', () => {
    const fg = new Color('#00ff00');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(15.3, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(15.3, 2);
  });

  it('green normal on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 255, b: 0, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(4.06, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(4.06, 2);
  });

  it('green normal on #000000 alpha 0', () => {
    const fg = new Color({ r: 0, g: 255, b: 0, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('green normal on #ffffff alpha 1', () => {
    const fg = new Color('#00ff00');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.37, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.37, 2);
  });

  it('green normal on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 255, b: 0, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.27, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.27, 2);
  });

  it('green normal on #ffffff alpha 0', () => {
    const fg = new Color({ r: 0, g: 255, b: 0, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('green normal on #777777 alpha 1', () => {
    const fg = new Color('#00ff00');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(3.26, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(3.26, 2);
  });

  it('green normal on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 255, b: 0, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.78, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.78, 2);
  });

  it('green normal on #777777 alpha 0', () => {
    const fg = new Color({ r: 0, g: 255, b: 0, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('green light on #000000 alpha 1', () => {
    const fg = new Color('#66ff66');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(16.06, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(16.06, 2);
  });

  it('green light on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 102, g: 255, b: 102, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(4.25, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(4.25, 2);
  });

  it('green light on #000000 alpha 0', () => {
    const fg = new Color({ r: 102, g: 255, b: 102, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('green light on #ffffff alpha 1', () => {
    const fg = new Color('#66ff66');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.31, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.31, 2);
  });

  it('green light on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 102, g: 255, b: 102, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.18, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.18, 2);
  });

  it('green light on #ffffff alpha 0', () => {
    const fg = new Color({ r: 102, g: 255, b: 102, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('green light on #777777 alpha 1', () => {
    const fg = new Color('#66ff66');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(3.42, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(3.42, 2);
  });

  it('green light on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 102, g: 255, b: 102, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.92, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.92, 2);
  });

  it('green light on #777777 alpha 0', () => {
    const fg = new Color({ r: 102, g: 255, b: 102, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('blue dark on #000000 alpha 1', () => {
    const fg = new Color('#000099');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.46, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.46, 2);
  });

  it('blue dark on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 0, b: 153, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.11, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.11, 2);
  });

  it('blue dark on #000000 alpha 0', () => {
    const fg = new Color({ r: 0, g: 0, b: 153, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('blue dark on #ffffff alpha 1', () => {
    const fg = new Color('#000099');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(14.38, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(14.38, 2);
  });

  it('blue dark on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 0, b: 153, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(3.59, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(3.59, 2);
  });

  it('blue dark on #ffffff alpha 0', () => {
    const fg = new Color({ r: 0, g: 0, b: 153, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('blue dark on #777777 alpha 1', () => {
    const fg = new Color('#000099');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(3.21, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(3.21, 2);
  });

  it('blue dark on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 0, b: 153, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.15, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.15, 2);
  });

  it('blue dark on #777777 alpha 0', () => {
    const fg = new Color({ r: 0, g: 0, b: 153, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('blue normal on #000000 alpha 1', () => {
    const fg = new Color('#0000ff');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.44, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.44, 2);
  });

  it('blue normal on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 0, b: 255, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.31, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.31, 2);
  });

  it('blue normal on #000000 alpha 0', () => {
    const fg = new Color({ r: 0, g: 0, b: 255, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('blue normal on #ffffff alpha 1', () => {
    const fg = new Color('#0000ff');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(8.59, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(8.59, 2);
  });

  it('blue normal on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 0, b: 255, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(3.27, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(3.27, 2);
  });

  it('blue normal on #ffffff alpha 0', () => {
    const fg = new Color({ r: 0, g: 0, b: 255, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('blue normal on #777777 alpha 1', () => {
    const fg = new Color('#0000ff');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.92, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.92, 2);
  });

  it('blue normal on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 0, b: 255, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.84, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.84, 2);
  });

  it('blue normal on #777777 alpha 0', () => {
    const fg = new Color({ r: 0, g: 0, b: 255, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('blue light on #000000 alpha 1', () => {
    const fg = new Color('#6666ff');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(4.91, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(4.91, 2);
  });

  it('blue light on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 102, g: 102, b: 255, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.92, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.92, 2);
  });

  it('blue light on #000000 alpha 0', () => {
    const fg = new Color({ r: 102, g: 102, b: 255, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('blue light on #ffffff alpha 1', () => {
    const fg = new Color('#6666ff');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(4.28, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(4.28, 2);
  });

  it('blue light on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 102, g: 102, b: 255, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.95, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.95, 2);
  });

  it('blue light on #ffffff alpha 0', () => {
    const fg = new Color({ r: 102, g: 102, b: 255, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('blue light on #777777 alpha 1', () => {
    const fg = new Color('#6666ff');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.05, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.05, 2);
  });

  it('blue light on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 102, g: 102, b: 255, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.01, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.01, 2);
  });

  it('blue light on #777777 alpha 0', () => {
    const fg = new Color({ r: 102, g: 102, b: 255, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('indigo dark on #000000 alpha 1', () => {
    const fg = new Color('#2e004f');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.23, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.23, 2);
  });

  it('indigo dark on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 46, g: 0, b: 79, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.07, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.07, 2);
  });

  it('indigo dark on #000000 alpha 0', () => {
    const fg = new Color({ r: 46, g: 0, b: 79, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('indigo dark on #ffffff alpha 1', () => {
    const fg = new Color('#2e004f');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(17.09, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(17.09, 2);
  });

  it('indigo dark on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 46, g: 0, b: 79, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(3.54, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(3.54, 2);
  });

  it('indigo dark on #ffffff alpha 0', () => {
    const fg = new Color({ r: 46, g: 0, b: 79, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('indigo dark on #777777 alpha 1', () => {
    const fg = new Color('#2e004f');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(3.82, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(3.82, 2);
  });

  it('indigo dark on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 46, g: 0, b: 79, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.15, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.15, 2);
  });

  it('indigo dark on #777777 alpha 0', () => {
    const fg = new Color({ r: 46, g: 0, b: 79, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('indigo normal on #000000 alpha 1', () => {
    const fg = new Color('#4b0082');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.62, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.62, 2);
  });

  it('indigo normal on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 75, g: 0, b: 130, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.16, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.16, 2);
  });

  it('indigo normal on #000000 alpha 0', () => {
    const fg = new Color({ r: 75, g: 0, b: 130, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('indigo normal on #ffffff alpha 1', () => {
    const fg = new Color('#4b0082');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(12.95, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(12.95, 2);
  });

  it('indigo normal on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 75, g: 0, b: 130, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(3.27, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(3.27, 2);
  });

  it('indigo normal on #ffffff alpha 0', () => {
    const fg = new Color({ r: 75, g: 0, b: 130, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('indigo normal on #777777 alpha 1', () => {
    const fg = new Color('#4b0082');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.89, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.89, 2);
  });

  it('indigo normal on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 75, g: 0, b: 130, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.92, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.92, 2);
  });

  it('indigo normal on #777777 alpha 0', () => {
    const fg = new Color({ r: 75, g: 0, b: 130, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('indigo light on #000000 alpha 1', () => {
    const fg = new Color('#9370ff');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(6.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(6.0, 2);
  });

  it('indigo light on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 147, g: 112, b: 255, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.16, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.16, 2);
  });

  it('indigo light on #000000 alpha 0', () => {
    const fg = new Color({ r: 147, g: 112, b: 255, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('indigo light on #ffffff alpha 1', () => {
    const fg = new Color('#9370ff');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(3.5, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(3.5, 2);
  });

  it('indigo light on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 147, g: 112, b: 255, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.79, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.79, 2);
  });

  it('indigo light on #ffffff alpha 0', () => {
    const fg = new Color({ r: 147, g: 112, b: 255, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('indigo light on #777777 alpha 1', () => {
    const fg = new Color('#9370ff');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.28, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.28, 2);
  });

  it('indigo light on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 147, g: 112, b: 255, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.11, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.11, 2);
  });

  it('indigo light on #777777 alpha 0', () => {
    const fg = new Color({ r: 147, g: 112, b: 255, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('violet dark on #000000 alpha 1', () => {
    const fg = new Color('#4c0073');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.55, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.55, 2);
  });

  it('violet dark on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 76, g: 0, b: 115, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.14, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.14, 2);
  });

  it('violet dark on #000000 alpha 0', () => {
    const fg = new Color({ r: 76, g: 0, b: 115, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('violet dark on #ffffff alpha 1', () => {
    const fg = new Color('#4c0073');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(13.51, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(13.51, 2);
  });

  it('violet dark on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 76, g: 0, b: 115, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(3.3, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(3.3, 2);
  });

  it('violet dark on #ffffff alpha 0', () => {
    const fg = new Color({ r: 76, g: 0, b: 115, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('violet dark on #777777 alpha 1', () => {
    const fg = new Color('#4c0073');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(3.02, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(3.02, 2);
  });

  it('violet dark on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 76, g: 0, b: 115, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.95, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.95, 2);
  });

  it('violet dark on #777777 alpha 0', () => {
    const fg = new Color({ r: 76, g: 0, b: 115, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('violet normal on #000000 alpha 1', () => {
    const fg = new Color('#ee82ee');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(9.06, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(9.06, 2);
  });

  it('violet normal on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 238, g: 130, b: 238, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.81, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.81, 2);
  });

  it('violet normal on #000000 alpha 0', () => {
    const fg = new Color({ r: 238, g: 130, b: 238, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('violet normal on #ffffff alpha 1', () => {
    const fg = new Color('#ee82ee');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.32, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.32, 2);
  });

  it('violet normal on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 238, g: 130, b: 238, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.52, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.52, 2);
  });

  it('violet normal on #ffffff alpha 0', () => {
    const fg = new Color({ r: 238, g: 130, b: 238, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('violet normal on #777777 alpha 1', () => {
    const fg = new Color('#ee82ee');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.93, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.93, 2);
  });

  it('violet normal on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 238, g: 130, b: 238, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.38, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.38, 2);
  });

  it('violet normal on #777777 alpha 0', () => {
    const fg = new Color({ r: 238, g: 130, b: 238, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('violet light on #000000 alpha 1', () => {
    const fg = new Color('#f2b3f2');
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(12.51, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(12.51, 2);
  });

  it('violet light on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 242, g: 179, b: 242, a: 0.5 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(3.53, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(3.53, 2);
  });

  it('violet light on #000000 alpha 0', () => {
    const fg = new Color({ r: 242, g: 179, b: 242, a: 0 });
    const bg = new Color('#000000');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('violet light on #ffffff alpha 1', () => {
    const fg = new Color('#f2b3f2');
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.68, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.68, 2);
  });

  it('violet light on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 242, g: 179, b: 242, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.29, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.29, 2);
  });

  it('violet light on #ffffff alpha 0', () => {
    const fg = new Color({ r: 242, g: 179, b: 242, a: 0 });
    const bg = new Color('#ffffff');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('violet light on #777777 alpha 1', () => {
    const fg = new Color('#f2b3f2');
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(2.67, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(2.67, 2);
  });

  it('violet light on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 242, g: 179, b: 242, a: 0.5 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.69, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.69, 2);
  });

  it('violet light on #777777 alpha 0', () => {
    const fg = new Color({ r: 242, g: 179, b: 242, a: 0 });
    const bg = new Color('#777777');
    expect(getWCAGContrastRatio(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(1.0, 2);
    expect(getWCAGContrastRatio(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(1.0, 2);
  });

  it('#000000 vs #ffffff', () => {
    const c1 = new Color('#000000');
    const c2 = new Color('#ffffff');
    expect(getWCAGContrastRatio(c1.toRGBA(), c2.toRGBA())).toBeCloseTo(21.0, 2);
    expect(getWCAGContrastRatio(c2.toRGBA(), c1.toRGBA())).toBeCloseTo(21.0, 2);
  });

  it('#111111 vs #eeeeee', () => {
    const c1 = new Color('#111111');
    const c2 = new Color('#eeeeee');
    expect(getWCAGContrastRatio(c1.toRGBA(), c2.toRGBA())).toBeCloseTo(16.28, 2);
    expect(getWCAGContrastRatio(c2.toRGBA(), c1.toRGBA())).toBeCloseTo(16.28, 2);
  });

  it('#222222 vs #dddddd', () => {
    const c1 = new Color('#222222');
    const c2 = new Color('#dddddd');
    expect(getWCAGContrastRatio(c1.toRGBA(), c2.toRGBA())).toBeCloseTo(11.71, 2);
    expect(getWCAGContrastRatio(c2.toRGBA(), c1.toRGBA())).toBeCloseTo(11.71, 2);
  });

  it('#333333 vs #cccccc', () => {
    const c1 = new Color('#333333');
    const c2 = new Color('#cccccc');
    expect(getWCAGContrastRatio(c1.toRGBA(), c2.toRGBA())).toBeCloseTo(7.87, 2);
    expect(getWCAGContrastRatio(c2.toRGBA(), c1.toRGBA())).toBeCloseTo(7.87, 2);
  });

  it('#444444 vs #bbbbbb', () => {
    const c1 = new Color('#444444');
    const c2 = new Color('#bbbbbb');
    expect(getWCAGContrastRatio(c1.toRGBA(), c2.toRGBA())).toBeCloseTo(5.07, 2);
    expect(getWCAGContrastRatio(c2.toRGBA(), c1.toRGBA())).toBeCloseTo(5.07, 2);
  });

  it('#555555 vs #aaaaaa', () => {
    const c1 = new Color('#555555');
    const c2 = new Color('#aaaaaa');
    expect(getWCAGContrastRatio(c1.toRGBA(), c2.toRGBA())).toBeCloseTo(3.21, 2);
    expect(getWCAGContrastRatio(c2.toRGBA(), c1.toRGBA())).toBeCloseTo(3.21, 2);
  });

  it('#666666 vs #999999', () => {
    const c1 = new Color('#666666');
    const c2 = new Color('#999999');
    expect(getWCAGContrastRatio(c1.toRGBA(), c2.toRGBA())).toBeCloseTo(2.02, 2);
    expect(getWCAGContrastRatio(c2.toRGBA(), c1.toRGBA())).toBeCloseTo(2.02, 2);
  });

  it('#777777 vs #888888', () => {
    const c1 = new Color('#777777');
    const c2 = new Color('#888888');
    expect(getWCAGContrastRatio(c1.toRGBA(), c2.toRGBA())).toBeCloseTo(1.26, 2);
    expect(getWCAGContrastRatio(c2.toRGBA(), c1.toRGBA())).toBeCloseTo(1.26, 2);
  });
});

describe('getWCAGReadabilityReport', () => {
  it('returns contrast ratio and shortfall information', () => {
    const fg = new Color('#555555');
    const bg = new Color('#aaaaaa');
    const report = getWCAGReadabilityReport(fg.toRGBA(), bg.toRGBA());
    expect(report.contrastRatio).toBeCloseTo(3.21, 2);
    expect(report.requiredContrast).toBe(4.5);
    expect(report.isReadable).toBe(false);
    expect(report.shortfall).toBeCloseTo(1.29, 2);
  });

  it('respects text size options', () => {
    const fg = new Color('#555555');
    const bg = new Color('#aaaaaa');
    const report = getWCAGReadabilityReport(fg.toRGBA(), bg.toRGBA(), { size: 'LARGE' });
    expect(report.contrastRatio).toBeCloseTo(3.21, 2);
    expect(report.requiredContrast).toBe(3);
    expect(report.isReadable).toBe(true);
    expect(report.shortfall).toBeCloseTo(0, 2);
  });
});

describe('isTextReadable', () => {
  it('#444444 vs #bbbbbb AA small', () => {
    const c1 = new Color('#444444');
    const c2 = new Color('#bbbbbb');
    expect(isTextReadable(c1.toRGBA(), c2.toRGBA())).toBe(true);
    expect(isTextReadable(c2.toRGBA(), c1.toRGBA())).toBe(true);
  });

  it('#555555 vs #aaaaaa AA small', () => {
    const c1 = new Color('#555555');
    const c2 = new Color('#aaaaaa');
    expect(isTextReadable(c1.toRGBA(), c2.toRGBA())).toBe(false);
    expect(isTextReadable(c2.toRGBA(), c1.toRGBA())).toBe(false);
  });

  it('#555555 vs #aaaaaa AA large', () => {
    const c1 = new Color('#555555');
    const c2 = new Color('#aaaaaa');
    expect(isTextReadable(c1.toRGBA(), c2.toRGBA(), { wcagOptions: { size: 'LARGE' } })).toBe(true);
    expect(isTextReadable(c2.toRGBA(), c1.toRGBA(), { wcagOptions: { size: 'LARGE' } })).toBe(true);
  });

  it('#666666 vs #999999 AA large', () => {
    const c1 = new Color('#666666');
    const c2 = new Color('#999999');
    expect(isTextReadable(c1.toRGBA(), c2.toRGBA(), { wcagOptions: { size: 'LARGE' } })).toBe(
      false,
    );
    expect(isTextReadable(c2.toRGBA(), c1.toRGBA(), { wcagOptions: { size: 'LARGE' } })).toBe(
      false,
    );
  });

  it('#333333 vs #cccccc AAA small', () => {
    const c1 = new Color('#333333');
    const c2 = new Color('#cccccc');
    expect(isTextReadable(c1.toRGBA(), c2.toRGBA(), { wcagOptions: { level: 'AAA' } })).toBe(true);
    expect(isTextReadable(c2.toRGBA(), c1.toRGBA(), { wcagOptions: { level: 'AAA' } })).toBe(true);
  });

  it('#444444 vs #bbbbbb AAA small', () => {
    const c1 = new Color('#444444');
    const c2 = new Color('#bbbbbb');
    expect(isTextReadable(c1.toRGBA(), c2.toRGBA(), { wcagOptions: { level: 'AAA' } })).toBe(false);
    expect(isTextReadable(c2.toRGBA(), c1.toRGBA(), { wcagOptions: { level: 'AAA' } })).toBe(false);
  });

  it('#444444 vs #bbbbbb AAA large', () => {
    const c1 = new Color('#444444');
    const c2 = new Color('#bbbbbb');
    expect(
      isTextReadable(c1.toRGBA(), c2.toRGBA(), { wcagOptions: { level: 'AAA', size: 'LARGE' } }),
    ).toBe(true);
    expect(
      isTextReadable(c2.toRGBA(), c1.toRGBA(), { wcagOptions: { level: 'AAA', size: 'LARGE' } }),
    ).toBe(true);
  });

  it('#555555 vs #aaaaaa AAA large', () => {
    const c1 = new Color('#555555');
    const c2 = new Color('#aaaaaa');
    expect(
      isTextReadable(c1.toRGBA(), c2.toRGBA(), { wcagOptions: { level: 'AAA', size: 'LARGE' } }),
    ).toBe(false);
    expect(
      isTextReadable(c2.toRGBA(), c1.toRGBA(), { wcagOptions: { level: 'AAA', size: 'LARGE' } }),
    ).toBe(false);
  });

  it('red dark 0.5 alpha on #ffffff', () => {
    const fg = new Color({ r: 153, g: 0, b: 0, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(isTextReadable(fg.toRGBA(), bg.toRGBA())).toBe(false);
    expect(isTextReadable(fg.toRGBA(), bg.toRGBA(), { wcagOptions: { size: 'LARGE' } })).toBe(true);
  });
});

describe('getAPCAReadabilityScore', () => {
  it('red dark on #000000 alpha 1', () => {
    const fg = new Color('#990000');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-14.3, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(16.15, 2);
  });

  it('red dark on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 153, g: 0, b: 0, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(47.22, 2);
  });

  it('red dark on #000000 alpha 0', () => {
    const fg = new Color({ r: 153, g: 0, b: 0, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('red dark on #ffffff alpha 1', () => {
    const fg = new Color('#990000');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(87.85, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-92.51, 2);
  });

  it('red dark on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 153, g: 0, b: 0, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(56.84, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-62.2, 2);
  });

  it('red dark on #ffffff alpha 0', () => {
    const fg = new Color({ r: 153, g: 0, b: 0, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('red dark on #777777 alpha 1', () => {
    const fg = new Color('#990000');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(14.78, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-15.19, 2);
  });

  it('red dark on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 153, g: 0, b: 0, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(12.99, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(12.29, 2);
  });

  it('red dark on #777777 alpha 0', () => {
    const fg = new Color({ r: 153, g: 0, b: 0, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('red normal on #000000 alpha 1', () => {
    const fg = new Color('#ff0000');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-37.54, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(39.95, 2);
  });

  it('red normal on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 0, b: 0, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-9.45, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(56.56, 2);
  });

  it('red normal on #000000 alpha 0', () => {
    const fg = new Color({ r: 255, g: 0, b: 0, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('red normal on #ffffff alpha 1', () => {
    const fg = new Color('#ff0000');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(64.13, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-69.62, 2);
  });

  it('red normal on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 0, b: 0, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(47.44, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-52.42, 2);
  });

  it('red normal on #ffffff alpha 0', () => {
    const fg = new Color({ r: 255, g: 0, b: 0, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('red normal on #777777 alpha 1', () => {
    const fg = new Color('#ff0000');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('red normal on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 0, b: 0, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(21.63, 2);
  });

  it('red normal on #777777 alpha 0', () => {
    const fg = new Color({ r: 255, g: 0, b: 0, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('red light on #000000 alpha 1', () => {
    const fg = new Color('#ff9999');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-62.77, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(64.37, 2);
  });

  it('red light on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 153, b: 153, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-18.44, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(83.41, 2);
  });

  it('red light on #000000 alpha 0', () => {
    const fg = new Color({ r: 255, g: 153, b: 153, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('red light on #ffffff alpha 1', () => {
    const fg = new Color('#ff9999');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(39.56, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-44.07, 2);
  });

  it('red light on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 153, b: 153, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(20.29, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-23.13, 2);
  });

  it('red light on #ffffff alpha 0', () => {
    const fg = new Color({ r: 255, g: 153, b: 153, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('red light on #777777 alpha 1', () => {
    const fg = new Color('#ff9999');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-31.47, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(29.44, 2);
  });

  it('red light on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 153, b: 153, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-13.81, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(48.48, 2);
  });

  it('red light on #777777 alpha 0', () => {
    const fg = new Color({ r: 255, g: 153, b: 153, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('orange dark on #000000 alpha 1', () => {
    const fg = new Color('#994c00');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-21.49, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(23.71, 2);
  });

  it('orange dark on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 153, g: 76, b: 0, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(59.47, 2);
  });

  it('orange dark on #000000 alpha 0', () => {
    const fg = new Color({ r: 153, g: 76, b: 0, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('orange dark on #ffffff alpha 1', () => {
    const fg = new Color('#994c00');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(80.35, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-85.52, 2);
  });

  it('orange dark on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 153, g: 76, b: 0, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(44.5, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-49.32, 2);
  });

  it('orange dark on #ffffff alpha 0', () => {
    const fg = new Color({ r: 153, g: 76, b: 0, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('orange dark on #777777 alpha 1', () => {
    const fg = new Color('#994c00');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-8.2, 2);
  });

  it('orange dark on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 153, g: 76, b: 0, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(24.54, 2);
  });

  it('orange dark on #777777 alpha 0', () => {
    const fg = new Color({ r: 153, g: 76, b: 0, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('orange normal on #000000 alpha 1', () => {
    const fg = new Color('#ff7f00');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-53.02, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(55.05, 2);
  });

  it('orange normal on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 127, b: 0, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-14.97, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(76.37, 2);
  });

  it('orange normal on #000000 alpha 0', () => {
    const fg = new Color({ r: 255, g: 127, b: 0, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('orange normal on #ffffff alpha 1', () => {
    const fg = new Color('#ff7f00');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(48.95, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-54.02, 2);
  });

  it('orange normal on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 127, b: 0, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(27.42, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-30.95, 2);
  });

  it('orange normal on #ffffff alpha 0', () => {
    const fg = new Color({ r: 255, g: 127, b: 0, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('orange normal on #777777 alpha 1', () => {
    const fg = new Color('#ff7f00');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-21.71, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(20.12, 2);
  });

  it('orange normal on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 127, b: 0, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-8.11, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(41.44, 2);
  });

  it('orange normal on #777777 alpha 0', () => {
    const fg = new Color({ r: 255, g: 127, b: 0, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('orange light on #000000 alpha 1', () => {
    const fg = new Color('#ffb266');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-70.11, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.29, 2);
  });

  it('orange light on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 178, b: 102, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-21.06, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(87.34, 2);
  });

  it('orange light on #000000 alpha 0', () => {
    const fg = new Color({ r: 255, g: 178, b: 102, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('orange light on #ffffff alpha 1', () => {
    const fg = new Color('#ffb266');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(32.56, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-36.54, 2);
  });

  it('orange light on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 178, b: 102, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(16.31, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-18.71, 2);
  });

  it('orange light on #ffffff alpha 0', () => {
    const fg = new Color({ r: 255, g: 178, b: 102, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('orange light on #777777 alpha 1', () => {
    const fg = new Color('#ffb266');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-38.81, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(36.36, 2);
  });

  it('orange light on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 178, b: 102, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-17.3, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(52.41, 2);
  });

  it('orange light on #777777 alpha 0', () => {
    const fg = new Color({ r: 255, g: 178, b: 102, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('yellow dark on #000000 alpha 1', () => {
    const fg = new Color('#999900');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-44.77, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(47.06, 2);
  });

  it('yellow dark on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 153, g: 153, b: 0, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-12.03, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(74.17, 2);
  });

  it('yellow dark on #000000 alpha 0', () => {
    const fg = new Color({ r: 153, g: 153, b: 0, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('yellow dark on #ffffff alpha 1', () => {
    const fg = new Color('#999900');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(56.99, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-62.36, 2);
  });

  it('yellow dark on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 153, g: 153, b: 0, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(29.65, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-33.39, 2);
  });

  it('yellow dark on #ffffff alpha 0', () => {
    const fg = new Color({ r: 153, g: 153, b: 0, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('yellow dark on #777777 alpha 1', () => {
    const fg = new Color('#999900');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-13.47, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(12.13, 2);
  });

  it('yellow dark on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 153, g: 153, b: 0, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(39.24, 2);
  });

  it('yellow dark on #777777 alpha 0', () => {
    const fg = new Color({ r: 153, g: 153, b: 0, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('yellow normal on #000000 alpha 1', () => {
    const fg = new Color('#ffff00');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-102.71, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(101.36, 2);
  });

  it('yellow normal on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 255, b: 0, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-32.68, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(102.26, 2);
  });

  it('yellow normal on #000000 alpha 0', () => {
    const fg = new Color({ r: 255, g: 255, b: 0, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('yellow normal on #ffffff alpha 1', () => {
    const fg = new Color('#ffff00');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('yellow normal on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 255, b: 0, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('yellow normal on #ffffff alpha 0', () => {
    const fg = new Color({ r: 255, g: 255, b: 0, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('yellow normal on #777777 alpha 1', () => {
    const fg = new Color('#ffff00');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-71.41, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(66.43, 2);
  });

  it('yellow normal on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 255, b: 0, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-31.39, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(67.33, 2);
  });

  it('yellow normal on #777777 alpha 0', () => {
    const fg = new Color({ r: 255, g: 255, b: 0, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('yellow light on #000000 alpha 1', () => {
    const fg = new Color('#ffff99');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-104.24, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(102.75, 2);
  });

  it('yellow light on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 255, b: 153, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-33.23, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(104.12, 2);
  });

  it('yellow light on #000000 alpha 0', () => {
    const fg = new Color({ r: 255, g: 255, b: 153, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('yellow light on #ffffff alpha 1', () => {
    const fg = new Color('#ffff99');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('yellow light on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 255, b: 153, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('yellow light on #ffffff alpha 0', () => {
    const fg = new Color({ r: 255, g: 255, b: 153, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('yellow light on #777777 alpha 1', () => {
    const fg = new Color('#ffff99');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-72.94, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(67.82, 2);
  });

  it('yellow light on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 255, g: 255, b: 153, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-32.71, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(69.19, 2);
  });

  it('yellow light on #777777 alpha 0', () => {
    const fg = new Color({ r: 255, g: 255, b: 153, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('green dark on #000000 alpha 1', () => {
    const fg = new Color('#006600');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-17.57, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(19.62, 2);
  });

  it('green dark on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 102, b: 0, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(56.15, 2);
  });

  it('green dark on #000000 alpha 0', () => {
    const fg = new Color({ r: 0, g: 102, b: 0, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('green dark on #ffffff alpha 1', () => {
    const fg = new Color('#006600');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(84.41, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-89.35, 2);
  });

  it('green dark on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 102, b: 0, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(47.84, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-52.85, 2);
  });

  it('green dark on #ffffff alpha 0', () => {
    const fg = new Color({ r: 0, g: 102, b: 0, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('green dark on #777777 alpha 1', () => {
    const fg = new Color('#006600');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(11.34, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-12.02, 2);
  });

  it('green dark on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 102, b: 0, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(21.22, 2);
  });

  it('green dark on #777777 alpha 0', () => {
    const fg = new Color({ r: 0, g: 102, b: 0, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('green normal on #000000 alpha 1', () => {
    const fg = new Color('#00ff00');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-86.49, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(86.53, 2);
  });

  it('green normal on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 255, b: 0, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-26.9, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(90.46, 2);
  });

  it('green normal on #000000 alpha 0', () => {
    const fg = new Color({ r: 0, g: 255, b: 0, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('green normal on #ffffff alpha 1', () => {
    const fg = new Color('#00ff00');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(17.13, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-19.62, 2);
  });

  it('green normal on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 255, b: 0, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(13.14, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-15.18, 2);
  });

  it('green normal on #ffffff alpha 0', () => {
    const fg = new Color({ r: 0, g: 255, b: 0, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('green normal on #777777 alpha 1', () => {
    const fg = new Color('#00ff00');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-55.19, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(51.6, 2);
  });

  it('green normal on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 255, b: 0, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-21.87, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(55.53, 2);
  });

  it('green normal on #777777 alpha 0', () => {
    const fg = new Color({ r: 0, g: 255, b: 0, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('green light on #000000 alpha 1', () => {
    const fg = new Color('#66ff66');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-89.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(88.84, 2);
  });

  it('green light on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 102, g: 255, b: 102, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-27.8, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(95.17, 2);
  });

  it('green light on #000000 alpha 0', () => {
    const fg = new Color({ r: 102, g: 255, b: 102, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('green light on #ffffff alpha 1', () => {
    const fg = new Color('#66ff66');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(14.78, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-17.01, 2);
  });

  it('green light on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 102, g: 255, b: 102, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(8.35, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-9.82, 2);
  });

  it('green light on #ffffff alpha 0', () => {
    const fg = new Color({ r: 102, g: 255, b: 102, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('green light on #777777 alpha 1', () => {
    const fg = new Color('#66ff66');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-57.7, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(53.91, 2);
  });

  it('green light on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 102, g: 255, b: 102, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-24.95, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(60.24, 2);
  });

  it('green light on #777777 alpha 0', () => {
    const fg = new Color({ r: 102, g: 255, b: 102, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('blue dark on #000000 alpha 1', () => {
    const fg = new Color('#000099');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('blue dark on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 0, b: 153, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(40.62, 2);
  });

  it('blue dark on #000000 alpha 0', () => {
    const fg = new Color({ r: 0, g: 0, b: 153, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('blue dark on #ffffff alpha 1', () => {
    const fg = new Color('#000099');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(98.62, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-101.98, 2);
  });

  it('blue dark on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 0, b: 153, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(63.45, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-68.94, 2);
  });

  it('blue dark on #ffffff alpha 0', () => {
    const fg = new Color({ r: 0, g: 0, b: 153, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('blue dark on #777777 alpha 1', () => {
    const fg = new Color('#000099');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(25.55, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-24.66, 2);
  });

  it('blue dark on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 0, b: 153, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(18.97, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('blue dark on #777777 alpha 0', () => {
    const fg = new Color({ r: 0, g: 0, b: 153, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('blue normal on #000000 alpha 1', () => {
    const fg = new Color('#0000ff');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-16.23, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(18.2, 2);
  });

  it('blue normal on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 0, b: 255, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(44.25, 2);
  });

  it('blue normal on #000000 alpha 0', () => {
    const fg = new Color({ r: 0, g: 0, b: 255, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('blue normal on #ffffff alpha 1', () => {
    const fg = new Color('#0000ff');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(85.82, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-90.65, 2);
  });

  it('blue normal on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 0, b: 255, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(59.81, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-65.25, 2);
  });

  it('blue normal on #ffffff alpha 0', () => {
    const fg = new Color({ r: 0, g: 0, b: 255, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('blue normal on #777777 alpha 1', () => {
    const fg = new Color('#0000ff');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(12.75, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-13.33, 2);
  });

  it('blue normal on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 0, g: 0, b: 255, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(14.76, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(9.32, 2);
  });

  it('blue normal on #777777 alpha 0', () => {
    const fg = new Color({ r: 0, g: 0, b: 255, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('blue light on #000000 alpha 1', () => {
    const fg = new Color('#6666ff');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-32.58, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(35.01, 2);
  });

  it('blue light on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 102, g: 102, b: 255, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-7.68, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(66.41, 2);
  });

  it('blue light on #000000 alpha 0', () => {
    const fg = new Color({ r: 102, g: 102, b: 255, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('blue light on #ffffff alpha 1', () => {
    const fg = new Color('#6666ff');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(69.08, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-74.57, 2);
  });

  it('blue light on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 102, g: 102, b: 255, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(37.5, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-41.87, 2);
  });

  it('blue light on #ffffff alpha 0', () => {
    const fg = new Color({ r: 102, g: 102, b: 255, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('blue light on #777777 alpha 1', () => {
    const fg = new Color('#6666ff');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('blue light on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 102, g: 102, b: 255, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(31.48, 2);
  });

  it('blue light on #777777 alpha 0', () => {
    const fg = new Color({ r: 102, g: 102, b: 255, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('indigo dark on #000000 alpha 1', () => {
    const fg = new Color('#2e004f');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('indigo dark on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 46, g: 0, b: 79, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(41.07, 2);
  });

  it('indigo dark on #000000 alpha 0', () => {
    const fg = new Color({ r: 46, g: 0, b: 79, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('indigo dark on #ffffff alpha 1', () => {
    const fg = new Color('#2e004f');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(102.92, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-105.49, 2);
  });

  it('indigo dark on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 46, g: 0, b: 79, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(63.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-68.49, 2);
  });

  it('indigo dark on #ffffff alpha 0', () => {
    const fg = new Color({ r: 46, g: 0, b: 79, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('indigo dark on #777777 alpha 1', () => {
    const fg = new Color('#2e004f');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(29.85, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-28.17, 2);
  });

  it('indigo dark on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 46, g: 0, b: 79, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(19.17, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('indigo dark on #777777 alpha 0', () => {
    const fg = new Color({ r: 46, g: 0, b: 79, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('indigo normal on #000000 alpha 1', () => {
    const fg = new Color('#4b0082');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('indigo normal on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 75, g: 0, b: 130, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(44.15, 2);
  });

  it('indigo normal on #000000 alpha 0', () => {
    const fg = new Color({ r: 75, g: 0, b: 130, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('indigo normal on #ffffff alpha 1', () => {
    const fg = new Color('#4b0082');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(97.19, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-100.77, 2);
  });

  it('indigo normal on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 75, g: 0, b: 130, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(59.92, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-65.36, 2);
  });

  it('indigo normal on #ffffff alpha 0', () => {
    const fg = new Color({ r: 75, g: 0, b: 130, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('indigo normal on #777777 alpha 1', () => {
    const fg = new Color('#4b0082');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(24.12, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-23.45, 2);
  });

  it('indigo normal on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 75, g: 0, b: 130, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(16.28, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(9.22, 2);
  });

  it('indigo normal on #777777 alpha 0', () => {
    const fg = new Color({ r: 75, g: 0, b: 130, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('indigo light on #000000 alpha 1', () => {
    const fg = new Color('#9370ff');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-39.49, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(41.87, 2);
  });

  it('indigo light on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 147, g: 112, b: 255, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-10.14, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(70.83, 2);
  });

  it('indigo light on #000000 alpha 0', () => {
    const fg = new Color({ r: 147, g: 112, b: 255, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('indigo light on #ffffff alpha 1', () => {
    const fg = new Color('#9370ff');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(62.2, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-67.67, 2);
  });

  it('indigo light on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 147, g: 112, b: 255, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(33.03, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-37.06, 2);
  });

  it('indigo light on #ffffff alpha 0', () => {
    const fg = new Color({ r: 147, g: 112, b: 255, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('indigo light on #777777 alpha 1', () => {
    const fg = new Color('#9370ff');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-8.19, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('indigo light on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 147, g: 112, b: 255, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(35.9, 2);
  });

  it('indigo light on #777777 alpha 0', () => {
    const fg = new Color({ r: 147, g: 112, b: 255, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('violet dark on #000000 alpha 1', () => {
    const fg = new Color('#4c0073');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('violet dark on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 76, g: 0, b: 115, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(43.81, 2);
  });

  it('violet dark on #000000 alpha 0', () => {
    const fg = new Color({ r: 76, g: 0, b: 115, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('violet dark on #ffffff alpha 1', () => {
    const fg = new Color('#4c0073');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(98.25, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-101.67, 2);
  });

  it('violet dark on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 76, g: 0, b: 115, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(60.25, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-65.69, 2);
  });

  it('violet dark on #ffffff alpha 0', () => {
    const fg = new Color({ r: 76, g: 0, b: 115, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('violet dark on #777777 alpha 1', () => {
    const fg = new Color('#4c0073');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(25.18, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-24.35, 2);
  });

  it('violet dark on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 76, g: 0, b: 115, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(16.62, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(8.88, 2);
  });

  it('violet dark on #777777 alpha 0', () => {
    const fg = new Color({ r: 76, g: 0, b: 115, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('violet normal on #000000 alpha 1', () => {
    const fg = new Color('#ee82ee');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-56.8, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(58.68, 2);
  });

  it('violet normal on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 238, g: 130, b: 238, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-16.31, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(79.8, 2);
  });

  it('violet normal on #000000 alpha 0', () => {
    const fg = new Color({ r: 238, g: 130, b: 238, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('violet normal on #ffffff alpha 1', () => {
    const fg = new Color('#ee82ee');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(45.3, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-50.17, 2);
  });

  it('violet normal on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 238, g: 130, b: 238, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(23.95, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-27.15, 2);
  });

  it('violet normal on #ffffff alpha 0', () => {
    const fg = new Color({ r: 238, g: 130, b: 238, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('violet normal on #777777 alpha 1', () => {
    const fg = new Color('#ee82ee');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-25.49, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(23.75, 2);
  });

  it('violet normal on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 238, g: 130, b: 238, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-10.73, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(44.87, 2);
  });

  it('violet normal on #777777 alpha 0', () => {
    const fg = new Color({ r: 238, g: 130, b: 238, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('violet light on #000000 alpha 1', () => {
    const fg = new Color('#f2b3f2');
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-73.21, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(74.2, 2);
  });

  it('violet light on #000000 alpha 0.5', () => {
    const fg = new Color({ r: 242, g: 179, b: 242, a: 0.5 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-22.16, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(89.31, 2);
  });

  it('violet light on #000000 alpha 0', () => {
    const fg = new Color({ r: 242, g: 179, b: 242, a: 0 });
    const bg = new Color('#000000');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(106.04, 2);
  });

  it('violet light on #ffffff alpha 1', () => {
    const fg = new Color('#f2b3f2');
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(29.62, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-33.36, 2);
  });

  it('violet light on #ffffff alpha 0.5', () => {
    const fg = new Color({ r: 242, g: 179, b: 242, a: 0.5 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(14.3, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(-16.48, 2);
  });

  it('violet light on #ffffff alpha 0', () => {
    const fg = new Color({ r: 242, g: 179, b: 242, a: 0 });
    const bg = new Color('#ffffff');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(0.0, 2);
  });

  it('violet light on #777777 alpha 1', () => {
    const fg = new Color('#f2b3f2');
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-41.9, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(39.27, 2);
  });

  it('violet light on #777777 alpha 0.5', () => {
    const fg = new Color({ r: 242, g: 179, b: 242, a: 0.5 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(-18.96, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(54.38, 2);
  });

  it('violet light on #777777 alpha 0', () => {
    const fg = new Color({ r: 242, g: 179, b: 242, a: 0 });
    const bg = new Color('#777777');
    expect(getAPCAReadabilityScore(fg.toRGBA(), bg.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(bg.toRGBA(), fg.toRGBA())).toBeCloseTo(71.11, 2);
  });

  it('#000000 vs #ffffff', () => {
    const c1 = new Color('#000000');
    const c2 = new Color('#ffffff');
    expect(getAPCAReadabilityScore(c1.toRGBA(), c2.toRGBA())).toBeCloseTo(106.04, 2);
    expect(getAPCAReadabilityScore(c2.toRGBA(), c1.toRGBA())).toBeCloseTo(-107.88, 2);
  });

  it('#111111 vs #eeeeee', () => {
    const c1 = new Color('#111111');
    const c2 = new Color('#eeeeee');
    expect(getAPCAReadabilityScore(c1.toRGBA(), c2.toRGBA())).toBeCloseTo(95.27, 2);
    expect(getAPCAReadabilityScore(c2.toRGBA(), c1.toRGBA())).toBeCloseTo(-96.26, 2);
  });

  it('#222222 vs #dddddd', () => {
    const c1 = new Color('#222222');
    const c2 = new Color('#dddddd');
    expect(getAPCAReadabilityScore(c1.toRGBA(), c2.toRGBA())).toBeCloseTo(82.93, 2);
    expect(getAPCAReadabilityScore(c2.toRGBA(), c1.toRGBA())).toBeCloseTo(-83.59, 2);
  });

  it('#333333 vs #cccccc', () => {
    const c1 = new Color('#333333');
    const c2 = new Color('#cccccc');
    expect(getAPCAReadabilityScore(c1.toRGBA(), c2.toRGBA())).toBeCloseTo(69.13, 2);
    expect(getAPCAReadabilityScore(c2.toRGBA(), c1.toRGBA())).toBeCloseTo(-69.82, 2);
  });

  it('#444444 vs #bbbbbb', () => {
    const c1 = new Color('#444444');
    const c2 = new Color('#bbbbbb');
    expect(getAPCAReadabilityScore(c1.toRGBA(), c2.toRGBA())).toBeCloseTo(53.75, 2);
    expect(getAPCAReadabilityScore(c2.toRGBA(), c1.toRGBA())).toBeCloseTo(-54.66, 2);
  });

  it('#555555 vs #aaaaaa', () => {
    const c1 = new Color('#555555');
    const c2 = new Color('#aaaaaa');
    expect(getAPCAReadabilityScore(c1.toRGBA(), c2.toRGBA())).toBeCloseTo(38.04, 2);
    expect(getAPCAReadabilityScore(c2.toRGBA(), c1.toRGBA())).toBeCloseTo(-39.12, 2);
  });

  it('#666666 vs #999999', () => {
    const c1 = new Color('#666666');
    const c2 = new Color('#999999');
    expect(getAPCAReadabilityScore(c1.toRGBA(), c2.toRGBA())).toBeCloseTo(22.13, 2);
    expect(getAPCAReadabilityScore(c2.toRGBA(), c1.toRGBA())).toBeCloseTo(-23.31, 2);
  });

  it('#777777 vs #888888', () => {
    const c1 = new Color('#777777');
    const c2 = new Color('#888888');
    expect(getAPCAReadabilityScore(c1.toRGBA(), c2.toRGBA())).toBeCloseTo(0.0, 2);
    expect(getAPCAReadabilityScore(c2.toRGBA(), c1.toRGBA())).toBeCloseTo(-7.32, 2);
  });
});

describe('readability selection helpers', () => {
  it('selects the most readable text color using WCAG inputs', () => {
    const background = new Color('#fefefe');
    const candidates = ['#000000', new Color('#1a1a1a'), { r: 120, g: 120, b: 120 }].map(
      (c) => new Color(c),
    );

    const result = getMostReadableTextColorForBackground(
      background.toRGBA(),
      candidates.map((c) => c.toRGBA()),
      {
        wcagOptions: { level: 'AAA', size: 'LARGE' },
      },
    );

    expect(new Color(result).toHex()).toBe('#000000');
  });

  it('selects the most readable text color from readonly candidates', () => {
    const background = new Color('#0d1321');
    const candidates = [new Color('#f0e9d2'), new Color('#748cab'), new Color('#3e5c76')] as const;

    const result = getMostReadableTextColorForBackground(
      background.toRGBA(),
      candidates.map((c) => c.toRGBA()),
    );

    expect(new Color(result).toHex()).toBe('#f0e9d2');
  });

  it('selects the most readable text color from a swatch', () => {
    const background = new Color('#ffffff');

    const baseSwatch = new Color('#85ff97').getColorSwatch({ extended: false });
    const resultBase = getMostReadableTextColorForBackground(
      background.toRGBA(),
      Object.values(baseSwatch)
        .filter((value) => value instanceof Color)
        .map((c) => (c as Color).toRGBA()),
    );
    expect(new Color(resultBase).equals(baseSwatch[900])).toBe(true);

    const extendedSwatch = new Color('#3b82f6').getColorSwatch({
      extended: true,
      centerOn500: true,
    });
    const resultExtended = getMostReadableTextColorForBackground(
      background.toRGBA(),
      Object.values(extendedSwatch)
        .filter((value) => value instanceof Color)
        .map((c) => (c as Color).toRGBA()),
    );
    expect(new Color(resultExtended).equals(extendedSwatch[950])).toBe(true);
  });

  it('selects the best background color for APCA scoring', () => {
    const textColor = new Color('#f4e4c0');
    const backgrounds = ['#101010', '#444444', '#ffffff'].map((bg) => new Color(bg));

    const result = getBestBackgroundColorForText(
      textColor.toRGBA(),
      backgrounds.map((c) => c.toRGBA()),
      { algorithm: 'APCA' },
    );

    expect(new Color(result).toHex()).toBe('#101010');
  });

  it('selects the best background color from a swatch', () => {
    const textColor = new Color('#111827');
    const swatch = new Color('#fbbf24').getColorSwatch({ extended: true, centerOn500: true });

    const result = getBestBackgroundColorForText(
      textColor.toRGBA(),
      Object.values(swatch)
        .filter((value) => value instanceof Color)
        .map((c) => (c as Color).toRGBA()),
    );

    expect(new Color(result).toHex()).toBe(swatch[50].toHex());
  });

  it('selects the best background from readonly inputs', () => {
    const textColor = new Color('#1f2937');
    const backgrounds = [new Color('#e0fbfc'), new Color('#98c1d9'), new Color('#293241')] as const;

    const result = getBestBackgroundColorForText(
      textColor.toRGBA(),
      backgrounds.map((c) => c.toRGBA()),
    );

    expect(new Color(result).toHex()).toBe('#e0fbfc');
  });

  it('accepts mixed case level and size', () => {
    const fg = new Color('black');
    const bg = new Color('white');
    const r1 = getWCAGReadabilityReport(fg.toRGBA(), bg.toRGBA(), { level: 'AA', size: 'SMALL' });
    const r2 = getWCAGReadabilityReport(fg.toRGBA(), bg.toRGBA(), { level: 'aa', size: 'small' });

    expect(r1.isReadable).toBe(r2.isReadable);
    expect(r1.requiredContrast).toBe(r2.requiredContrast);
  });

  it('accepts mixed case algorithm', () => {
    const fg = new Color('black');
    const bg = new Color('white');
    const best1 = getBestBackgroundColorForText(bg.toRGBA(), [fg.toRGBA()], { algorithm: 'APCA' });
    const best2 = getBestBackgroundColorForText(bg.toRGBA(), [fg.toRGBA()], { algorithm: 'apca' });

    expect(new Color(best1).toHex()).toBe(new Color(best2).toHex());
  });
});

describe('APCA readability report and policy behavior', () => {
  it('returns advisory report values with null readability fields by default', () => {
    const foreground = new Color('#444444');
    const background = new Color('#f8f9fb');

    const report = getAPCAReadabilityReport(foreground.toRGBA(), background.toRGBA());

    expect(report.score).toBeCloseTo(
      getAPCAReadabilityScore(foreground.toRGBA(), background.toRGBA()),
      2,
    );
    expect(report.absoluteScore).toBeCloseTo(Math.abs(report.score), 2);
    expect(report.isReadable).toBeNull();
    expect(report.requiredLc).toBeNull();
    expect(report.shortfall).toBeNull();
  });

  it('supports custom APCA threshold pass and fail with shortfall', () => {
    const foreground = new Color('#555555');
    const background = new Color('#aaaaaa');

    const report = getAPCAReadabilityReport(foreground.toRGBA(), background.toRGBA(), {
      policy: 'CUSTOM',
      threshold: 55,
    });

    expect(report.absoluteScore).toBeCloseTo(38.04, 2);
    expect(report.isReadable).toBe(false);
    expect(report.requiredLc).toBe(55);
    expect(report.shortfall).toBeCloseTo(16.96, 2);

    const passReport = getAPCAReadabilityReport(foreground.toRGBA(), background.toRGBA(), {
      policy: 'CUSTOM',
      threshold: 35,
    });

    expect(passReport.isReadable).toBe(true);
    expect(passReport.requiredLc).toBe(35);
    expect(passReport.shortfall).toBe(0);
  });

  it('supports APCA preset thresholds and case-insensitive preset input', () => {
    const foreground = new Color('#555555');
    const background = new Color('#aaaaaa');

    const bodyReport = getAPCAReadabilityReport(foreground.toRGBA(), background.toRGBA(), {
      policy: 'PRESET',
      preset: 'body',
    });

    expect(bodyReport.requiredLc).toBe(60);
    expect(bodyReport.isReadable).toBe(false);

    const nonTextReport = getAPCAReadabilityReport(foreground.toRGBA(), background.toRGBA(), {
      policy: 'PRESET',
      preset: 'NON_TEXT',
    });

    expect(nonTextReport.requiredLc).toBe(30);
    expect(nonTextReport.isReadable).toBe(true);
    expect(nonTextReport.shortfall).toBe(0);
  });

  it('supports algorithm-aware readability helper semantics', () => {
    const foreground = new Color('#333333');
    const background = new Color('#ffffff');

    expect(isTextReadable(foreground.toRGBA(), background.toRGBA())).toBe(true);
    expect(isTextReadable(foreground.toRGBA(), background.toRGBA(), { algorithm: 'APCA' })).toBe(
      true,
    );
    expect(
      isTextReadable(foreground.toRGBA(), background.toRGBA(), {
        algorithm: 'APCA',
        apcaOptions: { policy: 'PRESET', preset: 'BODY' },
      }),
    ).toBe(true);
  });

  it('ranks APCA candidates by absolute score in advisory mode', () => {
    const background = new Color('#ffffff');
    const candidates = [new Color('#666666'), new Color('#333333')];

    const advisoryBest = getMostReadableTextColorForBackground(
      background.toRGBA(),
      candidates.map((c) => c.toRGBA()),
      {
        algorithm: 'APCA',
      },
    );

    const thresholdBest = getMostReadableTextColorForBackground(
      background.toRGBA(),
      candidates.map((c) => c.toRGBA()),
      {
        algorithm: 'APCA',
        apcaOptions: { policy: 'CUSTOM', threshold: 80 },
      },
    );

    const scoreCandidateOne = Math.abs(
      getAPCAReadabilityScore(candidates[0].toRGBA(), background.toRGBA()),
    );
    const scoreCandidateTwo = Math.abs(
      getAPCAReadabilityScore(candidates[1].toRGBA(), background.toRGBA()),
    );

    expect(scoreCandidateOne).toBeLessThan(scoreCandidateTwo);
    expect(new Color(advisoryBest).toHex()).toBe('#333333');
    expect(new Color(thresholdBest).toHex()).toBe('#333333');
  });

  it('throws for invalid readability option values', () => {
    const foreground = new Color('#333333');
    const background = new Color('#ffffff');

    expect(() =>
      isTextReadable(foreground.toRGBA(), background.toRGBA(), { algorithm: 'INVALID' as never }),
    ).toThrow("Invalid 'algorithm'");
    expect(() =>
      getWCAGReadabilityReport(foreground.toRGBA(), background.toRGBA(), {
        level: 'INVALID' as never,
      }),
    ).toThrow("Invalid 'level'");
    expect(() =>
      getWCAGReadabilityReport(foreground.toRGBA(), background.toRGBA(), {
        size: 'INVALID' as never,
      }),
    ).toThrow("Invalid 'size'");
    expect(() =>
      getAPCAReadabilityReport(foreground.toRGBA(), background.toRGBA(), {
        policy: 'INVALID' as never,
      }),
    ).toThrow("Invalid 'policy'");
    expect(() =>
      getAPCAReadabilityReport(foreground.toRGBA(), background.toRGBA(), {
        policy: 'PRESET',
        preset: 'INVALID' as never,
      }),
    ).toThrow("Invalid 'preset'");
  });
});
