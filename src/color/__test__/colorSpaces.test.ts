import type { CaseInsensitive } from '../../utils';
import {
  convertColorSpaceValuesToRGB,
  convertRGBToColorSpaceValues,
  parseColorSpace,
  resolveColorSpace,
} from '../colorSpaces';

describe('parseColorSpace', () => {
  it('parses supported spaces case-insensitively', () => {
    expect(parseColorSpace('srgb')).toBe('SRGB');
    expect(parseColorSpace('Display-P3')).toBe('DISPLAY-P3');
    expect(parseColorSpace('REC2020')).toBe('REC2020');
  });

  it('returns null for unsupported spaces', () => {
    expect(parseColorSpace('foo')).toBeNull();
    expect(parseColorSpace('')).toBeNull();
  });
});

describe('resolveColorSpace', () => {
  it('defaults to SRGB when no value is provided', () => {
    expect(resolveColorSpace()).toBe('SRGB');
  });

  it('normalizes supported inputs', () => {
    expect(resolveColorSpace('display-p3')).toBe('DISPLAY-P3');
    expect(resolveColorSpace(' rec2020 ' as unknown as CaseInsensitive<'REC2020'>)).toBe('REC2020');
  });

  it('falls back to SRGB for unsupported values', () => {
    expect(resolveColorSpace('unknown' as unknown as CaseInsensitive<'SRGB'>)).toBe('SRGB');
  });
});

describe('convertColorSpaceValuesToRGB', () => {
  it('converts sRGB inputs directly', () => {
    expect(convertColorSpaceValuesToRGB({ r: 1, g: 0, b: 0 }, 'SRGB')).toEqual({
      r: 255,
      g: 0,
      b: 0,
    });
  });

  it('converts Display-P3 values to RGB', () => {
    expect(convertColorSpaceValuesToRGB({ r: 0.5, g: 0.2, b: 0.1 }, 'DISPLAY-P3')).toEqual({
      r: 138,
      g: 44,
      b: 13,
    });
  });

  it('converts Rec.2020 values to RGB', () => {
    expect(convertColorSpaceValuesToRGB({ r: 0.25, g: 0.5, b: 0.75 }, 'REC2020')).toEqual({
      r: 0,
      g: 144,
      b: 204,
    });
  });
});

describe('convertRGBToColorSpaceValues', () => {
  it('converts RGB to sRGB-normalized values', () => {
    const srgb = convertRGBToColorSpaceValues({ r: 255, g: 0, b: 0 }, 'SRGB');
    expect(srgb.r).toBeCloseTo(1, 12);
    expect(srgb.g).toBeCloseTo(0, 12);
    expect(srgb.b).toBeCloseTo(0, 12);
  });

  it('converts RGB to Display-P3 and back to RGB', () => {
    const rgb = { r: 51, g: 102, b: 153 };
    const displayP3 = convertRGBToColorSpaceValues(rgb, 'DISPLAY-P3');
    expect(displayP3.r).toBeCloseTo(0.249851, 6);
    expect(displayP3.g).toBeCloseTo(0.39524, 6);
    expect(displayP3.b).toBeCloseTo(0.584034, 6);
    expect(convertColorSpaceValuesToRGB(displayP3, 'DISPLAY-P3')).toEqual(rgb);
  });

  it('converts RGB to Rec.2020 values', () => {
    const rec2020 = convertRGBToColorSpaceValues({ r: 51, g: 102, b: 153 }, 'REC2020');
    expect(rec2020.r).toBeCloseTo(0.250128, 6);
    expect(rec2020.g).toBeCloseTo(0.336705, 6);
    expect(rec2020.b).toBeCloseTo(0.537794, 6);
  });
});
