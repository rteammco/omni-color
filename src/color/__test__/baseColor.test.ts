import { Color } from '../color';
import * as utils from '../utils';

describe('Color', () => {
  it('should initialize color correctly from hex', () => {
    expect(new Color('#00ff00').toRGBA()).toEqual({ r: 0, g: 255, b: 0, a: 1 });
    expect(new Color('#00ff00').toHex()).toEqual('#00ff00');

    expect(new Color('#ffffff').toRGBA()).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(new Color('#ffffff').toHex()).toEqual('#ffffff');

    expect(new Color('#00ffff').toRGBA()).toEqual({ r: 0, g: 255, b: 255, a: 1 });
    expect(new Color('#00ffff').toHex()).toEqual('#00ffff');

    expect(new Color('#00000000').toRGBA()).toEqual({ r: 0, g: 0, b: 0, a: 0 });
    expect(new Color('#00000000').toHex()).toEqual('#00000000');
  });

  it('should initialize color correctly from RGBA', () => {
    expect(new Color({ r: 0, g: 255, b: 0, a: 1 }).toRGBA()).toEqual({ r: 0, g: 255, b: 0, a: 1 });
    expect(new Color({ r: 0, g: 255, b: 0, a: 1 }).toHex()).toEqual('#00ff00');

    expect(new Color({ r: 255, g: 255, b: 255, a: 1 }).toRGBA()).toEqual({
      r: 255,
      g: 255,
      b: 255,
      a: 1,
    });
    expect(new Color({ r: 255, g: 255, b: 255, a: 1 }).toHex()).toEqual('#ffffff');

    expect(new Color({ r: 0, g: 255, b: 255, a: 1 }).toRGBA()).toEqual({
      r: 0,
      g: 255,
      b: 255,
      a: 1,
    });
    expect(new Color({ r: 0, g: 255, b: 255, a: 1 }).toHex()).toEqual('#00ffff');

    expect(new Color({ r: 0, g: 0, b: 0, a: 0 }).toRGBA()).toEqual({ r: 0, g: 0, b: 0, a: 0 });
    expect(new Color({ r: 0, g: 0, b: 0, a: 0 }).toHex()).toEqual('#00000000');
  });

  it('should initialize color correctly with no input', () => {
    const mockGetRandomColor = jest
      .spyOn(utils, 'getRandomColorRGBA')
      .mockReturnValue({ r: 5, g: 10, b: 15, a: 1 });

    expect(new Color().toRGBA()).toEqual({ r: 5, g: 10, b: 15, a: 1 });
    expect(new Color().toHex()).toEqual('#050a0f');

    mockGetRandomColor.mockRestore();
  });
});
