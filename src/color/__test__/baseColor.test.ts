import { Color } from '../color';
import * as utils from '../utils';

describe('Color', () => {
  it('should initialize color correctly from hex', () => {
    expect(new Color('#00ff00').toRGBA()).toEqual({ r: 0, g: 255, b: 0 });
    expect(new Color('#00ff00').toRGB()).toEqual({ r: 0, g: 255, b: 0 });
    expect(new Color('#00ff00').toHex()).toEqual('#00ff00');
    expect(new Color('#00ff00').toHSL()).toEqual({ h: 120, s: 100, l: 50 });
    expect(new Color('#00ff00').toHSLA()).toEqual({ h: 120, s: 100, l: 50 });

    expect(new Color('#ffffff').toRGBA()).toEqual({ r: 255, g: 255, b: 255 });
    expect(new Color('#ffffff').toRGB()).toEqual({ r: 255, g: 255, b: 255 });
    expect(new Color('#ffffff').toHex()).toEqual('#ffffff');
    expect(new Color('#ffffff').toHSL()).toEqual({ h: 0, s: 0, l: 100 });
    expect(new Color('#ffffff').toHSLA()).toEqual({ h: 0, s: 0, l: 100 });

    expect(new Color('#00ffff').toRGBA()).toEqual({ r: 0, g: 255, b: 255 });
    expect(new Color('#00ffff').toRGB()).toEqual({ r: 0, g: 255, b: 255 });
    expect(new Color('#00ffff').toHex()).toEqual('#00ffff');
    expect(new Color('#00ffff').toHSL()).toEqual({ h: 180, s: 100, l: 50 });
    expect(new Color('#00ffff').toHSLA()).toEqual({ h: 180, s: 100, l: 50 });

    expect(new Color('#00000000').toRGBA()).toEqual({ r: 0, g: 0, b: 0, a: 0 });
    expect(new Color('#00000000').toRGB()).toEqual({ r: 0, g: 0, b: 0 });
    expect(new Color('#00000000').toHex()).toEqual('#00000000');
    expect(new Color('#00000000').toHSL()).toEqual({ h: 0, s: 0, l: 0 });
    expect(new Color('#00000000').toHSLA()).toEqual({ h: 0, s: 0, l: 0, a: 0 });
  });

  it('should initialize color correctly from RGBA', () => {
    expect(new Color({ r: 0, g: 255, b: 0, a: 1 }).toRGBA()).toEqual({ r: 0, g: 255, b: 0, a: 1 });
    expect(new Color({ r: 0, g: 255, b: 0, a: 1 }).toRGB()).toEqual({ r: 0, g: 255, b: 0 });
    expect(new Color({ r: 0, g: 255, b: 0, a: 1 }).toHex()).toEqual('#00ff00ff');
    expect(new Color({ r: 0, g: 255, b: 0, a: 1 }).toHSL()).toEqual({
      h: 120,
      s: 100,
      l: 50,
    });
    expect(new Color({ r: 0, g: 255, b: 0, a: 1 }).toHSLA()).toEqual({
      h: 120,
      s: 100,
      l: 50,
      a: 1,
    });

    expect(new Color({ r: 255, g: 255, b: 255, a: 1 }).toRGBA()).toEqual({
      r: 255,
      g: 255,
      b: 255,
      a: 1,
    });
    expect(new Color({ r: 255, g: 255, b: 255, a: 1 }).toRGB()).toEqual({
      r: 255,
      g: 255,
      b: 255,
    });
    expect(new Color({ r: 255, g: 255, b: 255, a: 1 }).toHex()).toEqual('#ffffffff');
    expect(new Color({ r: 255, g: 255, b: 255, a: 1 }).toHSL()).toEqual({
      h: 0,
      s: 0,
      l: 100,
    });
    expect(new Color({ r: 255, g: 255, b: 255, a: 1 }).toHSLA()).toEqual({
      h: 0,
      s: 0,
      l: 100,
      a: 1,
    });

    expect(new Color({ r: 0, g: 255, b: 255, a: 1 }).toRGBA()).toEqual({
      r: 0,
      g: 255,
      b: 255,
      a: 1,
    });
    expect(new Color({ r: 0, g: 255, b: 255, a: 1 }).toRGB()).toEqual({
      r: 0,
      g: 255,
      b: 255,
    });
    expect(new Color({ r: 0, g: 255, b: 255, a: 1 }).toHex()).toEqual('#00ffffff');
    expect(new Color({ r: 0, g: 255, b: 255, a: 1 }).toHSL()).toEqual({
      h: 180,
      s: 100,
      l: 50,
    });
    expect(new Color({ r: 0, g: 255, b: 255, a: 1 }).toHSLA()).toEqual({
      h: 180,
      s: 100,
      l: 50,
      a: 1,
    });

    expect(new Color({ r: 0, g: 0, b: 0, a: 0 }).toRGBA()).toEqual({ r: 0, g: 0, b: 0, a: 0 });
    expect(new Color({ r: 0, g: 0, b: 0, a: 0 }).toRGB()).toEqual({ r: 0, g: 0, b: 0 });
    expect(new Color({ r: 0, g: 0, b: 0, a: 0 }).toHex()).toEqual('#00000000');
    expect(new Color({ r: 0, g: 0, b: 0, a: 0 }).toHSL()).toEqual({ h: 0, s: 0, l: 0 });
    expect(new Color({ r: 0, g: 0, b: 0, a: 0 }).toHSLA()).toEqual({
      h: 0,
      s: 0,
      l: 0,
      a: 0,
    });
  });

  it('should initialize color correctly from RGB', () => {
    expect(new Color({ r: 0, g: 255, b: 0 }).toRGBA()).toEqual({ r: 0, g: 255, b: 0 });
    expect(new Color({ r: 0, g: 255, b: 0 }).toRGB()).toEqual({ r: 0, g: 255, b: 0 });
    expect(new Color({ r: 0, g: 255, b: 0 }).toHex()).toEqual('#00ff00');
    expect(new Color({ r: 0, g: 255, b: 0 }).toHSL()).toEqual({ h: 120, s: 100, l: 50 });
    expect(new Color({ r: 0, g: 255, b: 0 }).toHSLA()).toEqual({
      h: 120,
      s: 100,
      l: 50,
    });
  });

  it('should initialize color correctly from HSL', () => {
    expect(new Color({ h: 120, s: 100, l: 50 }).toRGB()).toEqual({
      r: 0,
      g: 255,
      b: 0,
    });
    expect(new Color({ h: 120, s: 100, l: 50 }).toHex()).toEqual('#00ff00');
    expect(new Color({ h: 120, s: 100, l: 50 }).toHSL()).toEqual({
      h: 120,
      s: 100,
      l: 50,
    });
    expect(new Color({ h: 120, s: 100, l: 50 }).toHSLA()).toEqual({
      h: 120,
      s: 100,
      l: 50,
    });
  });

  it('should initialize color correctly from HSLA', () => {
    expect(new Color({ h: 0, s: 0, l: 0, a: 0.5 }).toRGBA()).toEqual({
      r: 0,
      g: 0,
      b: 0,
      a: 0.5,
    });
    expect(new Color({ h: 0, s: 0, l: 0, a: 0.5 }).toHex()).toEqual('#00000080');
    expect(new Color({ h: 0, s: 0, l: 0, a: 0.5 }).toHSL()).toEqual({
      h: 0,
      s: 0,
      l: 0,
    });
    expect(new Color({ h: 0, s: 0, l: 0, a: 0.5 }).toHSLA()).toEqual({
      h: 0,
      s: 0,
      l: 0,
      a: 0.5,
    });
  });

  it('should initialize color correctly with no input', () => {
    const mockGetRandomColor = jest
      .spyOn(utils, 'getRandomColorRGBA')
      .mockReturnValue({ r: 5, g: 10, b: 15, a: 1 });

    expect(new Color().toRGBA()).toEqual({ r: 5, g: 10, b: 15, a: 1 });
    expect(new Color().toRGB()).toEqual({ r: 5, g: 10, b: 15 });
    expect(new Color().toHex()).toEqual('#050a0fff');
    expect(new Color().toHSL()).toEqual({ h: 210, s: 50, l: 4 });
    expect(new Color().toHSLA()).toEqual({ h: 210, s: 50, l: 4, a: 1 });

    mockGetRandomColor.mockRestore();
  });
});
