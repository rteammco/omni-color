import { Color } from '../color';
import { getAPCAReadabilityScore, getWCAGContrastRatio } from '../readability';

describe('getWCAGContrastRatio', () => {
  it.each([
    ['black and white', new Color('#000'), new Color('#fff'), 21],
    ['same colors', new Color('#123456'), new Color('#123456'), 1],
    ['transparent vs color', new Color({ r: 255, g: 0, b: 0, a: 0 }), new Color('#000'), 1],
    [
      'semi-transparent black over white',
      new Color({ r: 0, g: 0, b: 0, a: 0.5 }),
      new Color('#fff'),
      3.98,
    ],
    [
      'black over semi-transparent white',
      new Color('#000'),
      new Color({ r: 255, g: 255, b: 255, a: 0.5 }),
      5.28,
    ],
    [
      'semi-transparent black vs semi-transparent white',
      new Color({ r: 0, g: 0, b: 0, a: 0.5 }),
      new Color({ r: 255, g: 255, b: 255, a: 0.5 }),
      3.21,
    ],
  ])('%s', (_name, c1, c2, expected) => {
    expect(getWCAGContrastRatio(c1, c2)).toBeCloseTo(expected, 2);
    expect(getWCAGContrastRatio(c2, c1)).toBeCloseTo(expected, 2);
  });

  it('returns 1 when both colors are fully transparent', () => {
    const transparent1 = new Color({ r: 0, g: 0, b: 0, a: 0 });
    const transparent2 = new Color({ r: 255, g: 255, b: 255, a: 0 });
    expect(getWCAGContrastRatio(transparent1, transparent2)).toBe(1);
  });
});

describe('getAPCAReadabilityScore', () => {
  it.each([
    ['black on white', new Color('#000'), new Color('#fff'), 106.04],
    ['white on black', new Color('#fff'), new Color('#000'), -107.88],
    [
      'semi-transparent black on white',
      new Color({ r: 0, g: 0, b: 0, a: 0.5 }),
      new Color('#fff'),
      67.13,
    ],
    [
      'white on semi-transparent black',
      new Color('#fff'),
      new Color({ r: 0, g: 0, b: 0, a: 0.5 }),
      -72.64,
    ],
  ])('%s', (_name, fg, bg, expected) => {
    expect(getAPCAReadabilityScore(fg, bg)).toBeCloseTo(expected, 2);
  });

  it('returns 0 for identical colors', () => {
    const color = new Color('#abcdef');
    expect(getAPCAReadabilityScore(color, color)).toBeCloseTo(0, 5);
  });

  it('handles fully transparent foreground', () => {
    const fg = new Color({ r: 0, g: 0, b: 0, a: 0 });
    const bg = new Color('#fff');
    expect(getAPCAReadabilityScore(fg, bg)).toBeCloseTo(0, 5);
  });
});
