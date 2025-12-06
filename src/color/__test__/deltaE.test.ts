import { Color } from '../color';
import { getDeltaE } from '../deltaE';

describe('Delta E calculations', () => {
  describe('getDeltaE', () => {
    it('returns 0 for identical colors regardless of method', () => {
      const neutral = new Color('#777777');

      expect(getDeltaE(neutral, neutral, { method: 'CIE76' })).toBe(0);
      expect(getDeltaE(neutral, neutral, { method: 'CIE94' })).toBe(0);
      expect(getDeltaE(neutral, neutral, { method: 'CIEDE2000' })).toBe(0);
    });

    it('matches reference values for CIEDE2000', () => {
      const firstPairA = new Color({ l: 50, a: 2.6772, b: -79.7751 });
      const firstPairB = new Color({ l: 50, a: 0, b: -82.7485 });
      expect(getDeltaE(firstPairA, firstPairB, { method: 'CIEDE2000' })).toBeCloseTo(0.721, 3);

      const secondPairA = new Color({ l: 50, a: 3.1571, b: -77.2803 });
      const secondPairB = new Color({ l: 50, a: 0, b: -82.7485 });
      expect(getDeltaE(secondPairA, secondPairB, { method: 'CIEDE2000' })).toBeCloseTo(1.07197, 4);

      const thirdPairA = new Color({ l: 50, a: 2.8361, b: -74.02 });
      const thirdPairB = new Color({ l: 50, a: 0, b: -82.7485 });
      expect(getDeltaE(thirdPairA, thirdPairB, { method: 'CIEDE2000' })).toBeCloseTo(1.42485, 4);
    });

    it('matches reference values for CIE94 and CIE76', () => {
      const firstPairA = new Color({ l: 50, a: 2.6772, b: -79.7751 });
      const firstPairB = new Color({ l: 50, a: 0, b: -82.7485 });
      expect(getDeltaE(firstPairA, firstPairB, { method: 'CIE94' })).toBeCloseTo(
        0.7636577088674601,
        6
      );
      expect(getDeltaE(firstPairA, firstPairB, { method: 'CIE76' })).toBeCloseTo(
        1.619848449701395,
        6
      );

      const secondPairA = new Color({ l: 50, a: 3.1571, b: -77.2803 });
      const secondPairB = new Color({ l: 50, a: 0, b: -82.7485 });
      expect(getDeltaE(secondPairA, secondPairB, { method: 'CIE94' })).toBeCloseTo(
        1.069608018415056,
        6
      );
      expect(getDeltaE(secondPairA, secondPairB, { method: 'CIE76' })).toBeCloseTo(
        1.2429935639415082,
        6
      );

      const thirdPairA = new Color({ l: 50, a: 2.8361, b: -74.02 });
      const thirdPairB = new Color({ l: 50, a: 0, b: -82.7485 });
      expect(getDeltaE(thirdPairA, thirdPairB, { method: 'CIE94' })).toBeCloseTo(
        1.6500919264582965,
        6
      );
      expect(getDeltaE(thirdPairA, thirdPairB, { method: 'CIE76' })).toBeCloseTo(
        3.4337015012956535,
        6
      );
    });

    it('handles hue wrapping and zero-chroma inputs correctly', () => {
      const nearZeroHue = new Color({ l: 60, c: 20, h: 20 });
      const nearFullHue = new Color({ l: 60, c: 20, h: 340 });
      const grayscaleA = new Color({ l: 55, a: 0, b: 0 });
      const grayscaleB = new Color({ l: 45, a: 0, b: 0 });

      expect(getDeltaE(nearZeroHue, nearFullHue, { method: 'CIEDE2000' })).toBeCloseTo(9.2596, 4);
      expect(getDeltaE(grayscaleA, grayscaleB, { method: 'CIEDE2000' })).toBeCloseTo(
        10.328990616488563,
        6
      );
      expect(getDeltaE(grayscaleA, grayscaleB, { method: 'CIE94' })).toBeCloseTo(
        10.329000048382673,
        6
      );
      expect(getDeltaE(grayscaleA, grayscaleB, { method: 'CIE76' })).toBeCloseTo(
        10.329000048407398,
        6
      );
    });

    it('honors custom weighting factors for CIE94', () => {
      const lighterRed = new Color('#ff6666');
      const darkerRed = new Color('#aa0000');

      const defaultWeighting = getDeltaE(lighterRed, darkerRed, { method: 'CIE94' });
      const textilesWeighting = getDeltaE(lighterRed, darkerRed, {
        method: 'CIE94',
        cie94Options: { kL: 2, kC: 1, kH: 1.5 },
      });
      expect(defaultWeighting).toBeGreaterThan(textilesWeighting);
      expect(defaultWeighting).toBeCloseTo(29.175, 3);
      expect(textilesWeighting).toBeCloseTo(15.172, 3);
    });

    it('supports comparing colors from different input spaces', () => {
      const red = new Color('#ff0000');
      const green = new Color({ h: 120, s: 100, l: 50 });
      const yellow = new Color({ l: 97.607, a: -15.578, b: 93.585 });

      expect(getDeltaE(red, green, { method: 'CIE76' })).toBeCloseTo(170.585, 2);
      expect(getDeltaE(red, yellow, { method: 'CIE94' })).toBeCloseTo(59.1667, 3);
      expect(getDeltaE(red, yellow, { method: 'CIEDE2000' })).toBeCloseTo(63.5875, 4);
    });

    it('throws for unsupported methods in getDeltaE', () => {
      const colorA = new Color({ l: 50, a: 2.6772, b: -79.7751 });
      const colorB = new Color({ l: 50, a: 0, b: -82.7485 });

      expect(() => getDeltaE(colorA, colorB, { method: 'INVALID' as never })).toThrow(
        'Unsupported Delta E method: INVALID'
      );
    });

    it('uses CIEDE2000 by default', () => {
      const red = new Color('#ff0000');
      const almostRed = new Color('#ff0100');

      expect(getDeltaE(red, almostRed)).toBeCloseTo(0.034, 3);
    });

    it('accepts alternate methods', () => {
      const blue = new Color('rgb(0, 0, 255)');
      const teal = new Color({ h: 180, s: 100, l: 50 });

      expect(getDeltaE(blue, teal, { method: 'CIE76' })).toBeCloseTo(168.65, 2);
      expect(getDeltaE(blue, teal, { method: 'CIE94' })).toBeCloseTo(74.762, 2);
    });

    it('accepts Colors created from different input shapes', () => {
      const base = new Color('#336699');
      const identical = new Color({ r: 51, g: 102, b: 153 });
      const white = new Color('#ffffff');

      expect(getDeltaE(base, identical)).toBe(0);
      expect(getDeltaE(base, white, { method: 'CIE76' })).toBeCloseTo(66.644, 3);
    });

    it('is symmetric regardless of parameter order', () => {
      const golden = new Color('#daa520');
      const navy = new Color('#001f3f');

      const forward = getDeltaE(golden, navy, { method: 'CIEDE2000' });
      const reverse = getDeltaE(navy, golden, { method: 'CIEDE2000' });

      expect(forward).toBeCloseTo(reverse, 12);
    });

    it('accepts mixed case method', () => {
      const c1 = new Color('red');
      const c2 = new Color('maroon');
      const d1 = getDeltaE(c1, c2, { method: 'CIE94' });
      const d2 = getDeltaE(c1, c2, { method: 'cie94' });

      expect(d1).toBe(d2);
    });
  });
});
