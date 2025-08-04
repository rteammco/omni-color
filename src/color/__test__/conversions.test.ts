import {
  hexToRGB,
  hexToRGBA,
  rgbToHex,
  rgbaToHex,
  rgbToRGBA,
  rgbaToRGB,
  hslToRGB,
  hslaToRGBA,
  rgbToHSL,
  rgbaToHSLA,
} from '../conversions';

describe('conversions', () => {
  it('converts hex to RGB and RGBA', () => {
    expect(hexToRGB('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
    expect(hexToRGBA('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
    expect(hexToRGBA('#00000000')).toEqual({ r: 0, g: 0, b: 0, a: 0 });
    expect(hexToRGBA('#000000ff')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
  });

  it('converts RGB and RGBA to hex', () => {
    expect(rgbToHex({ r: 0, g: 255, b: 0 })).toEqual('#00ff00');
    expect(rgbaToHex({ r: 0, g: 0, b: 0 })).toEqual('#000000');
    expect(rgbaToHex({ r: 0, g: 0, b: 0, a: 0 })).toEqual('#00000000');
    expect(rgbaToHex({ r: 0, g: 0, b: 0, a: 1 })).toEqual('#000000ff');
  });

  it('converts between RGB and RGBA', () => {
    const rgb = { r: 0, g: 255, b: 0 };
    const rgba = { r: 0, g: 255, b: 0, a: 0.5 };
    expect(rgbToRGBA(rgb, 0.5)).toEqual(rgba);
    expect(rgbToRGBA(rgb)).toEqual(rgb);
    expect(rgbaToRGB(rgba)).toEqual(rgb);
  });

  it('converts HSL and HSLA to RGB and RGBA', () => {
    expect(hslToRGB({ h: 0, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0 });
    expect(hslToRGB({ h: 120, s: 100, l: 50 })).toEqual({ r: 0, g: 255, b: 0 });
    expect(hslToRGB({ h: 240, s: 100, l: 50 })).toEqual({ r: 0, g: 0, b: 255 });
    expect(hslToRGB({ h: 0, s: 0, l: 0 })).toEqual({ r: 0, g: 0, b: 0 });
    expect(hslaToRGBA({ h: 0, s: 0, l: 0, a: 0.5 })).toEqual({
      r: 0,
      g: 0,
      b: 0,
      a: 0.5,
    });
  });

  it('converts RGB and RGBA to HSL and HSLA', () => {
    expect(rgbToHSL({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 });
    expect(rgbToHSL({ r: 0, g: 255, b: 0 })).toEqual({ h: 120, s: 100, l: 50 });
    expect(rgbToHSL({ r: 0, g: 0, b: 255 })).toEqual({ h: 240, s: 100, l: 50 });
    expect(rgbToHSL({ r: 255, g: 255, b: 255 })).toEqual({
      h: 0,
      s: 0,
      l: 100,
    });
    expect(rgbToHSL({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, l: 0 });
    expect(rgbToHSL({ r: 128, g: 128, b: 128 })).toEqual({ h: 0, s: 0, l: 50 });
    expect(rgbaToHSLA({ r: 0, g: 0, b: 0, a: 0.5 })).toEqual({
      h: 0,
      s: 0,
      l: 0,
      a: 0.5,
    });
  });
});
