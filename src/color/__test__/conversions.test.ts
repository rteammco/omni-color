import {
  hexToRGB,
  hexToRGBA,
  rgbToHex,
  rgbaToHex,
  rgbToRGBA,
  rgbaToRGB,
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
});
