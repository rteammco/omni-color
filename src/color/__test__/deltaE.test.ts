import { Color } from '../color';
import { deltaECIE76, deltaECIE94, deltaECIEDE2000, getDeltaE } from '../deltaE';
import type { ColorLAB } from '../formats';

describe('Delta E calculations', () => {
  describe('utility functions', () => {
    it('returns 0 for identical colors regardless of method', () => {
      const neutral = new Color('#777777');

      expect(deltaECIE76(neutral, neutral)).toBe(0);
      expect(deltaECIE94(neutral, neutral)).toBe(0);
      expect(deltaECIEDE2000(neutral, neutral)).toBe(0);
      expect(getDeltaE(neutral, neutral, 'CIEDE2000')).toBe(0);
    });

    it('matches reference values for CIEDE2000', () => {
      const firstPairA = new Color({ l: 50, a: 2.6772, b: -79.7751 });
      const firstPairB = new Color({ l: 50, a: 0, b: -82.7485 });
      expect(deltaECIEDE2000(firstPairA, firstPairB)).toBeCloseTo(0.721, 3);

      const secondPairA = new Color({ l: 50, a: 3.1571, b: -77.2803 });
      const secondPairB = new Color({ l: 50, a: 0, b: -82.7485 });
      expect(deltaECIEDE2000(secondPairA, secondPairB)).toBeCloseTo(1.07197, 4);

      const thirdPairA = new Color({ l: 50, a: 2.8361, b: -74.02 });
      const thirdPairB = new Color({ l: 50, a: 0, b: -82.7485 });
      expect(deltaECIEDE2000(thirdPairA, thirdPairB)).toBeCloseTo(1.42485, 4);
    });

    it('matches reference values for CIE94 and CIE76', () => {
      const firstPairA = new Color({ l: 50, a: 2.6772, b: -79.7751 });
      const firstPairB = new Color({ l: 50, a: 0, b: -82.7485 });
      expect(deltaECIE94(firstPairA, firstPairB)).toBeCloseTo(0.7636577088674601, 6);
      expect(deltaECIE76(firstPairA, firstPairB)).toBeCloseTo(1.619848449701395, 6);

      const secondPairA = new Color({ l: 50, a: 3.1571, b: -77.2803 });
      const secondPairB = new Color({ l: 50, a: 0, b: -82.7485 });
      expect(deltaECIE94(secondPairA, secondPairB)).toBeCloseTo(1.069608018415056, 6);
      expect(deltaECIE76(secondPairA, secondPairB)).toBeCloseTo(1.2429935639415082, 6);

      const thirdPairA = new Color({ l: 50, a: 2.8361, b: -74.02 });
      const thirdPairB = new Color({ l: 50, a: 0, b: -82.7485 });
      expect(deltaECIE94(thirdPairA, thirdPairB)).toBeCloseTo(1.6500919264582965, 6);
      expect(deltaECIE76(thirdPairA, thirdPairB)).toBeCloseTo(3.4337015012956535, 6);
    });

    it('handles hue wrapping and zero-chroma inputs correctly', () => {
      const nearZeroHue = new Color({ l: 60, c: 20, h: 20 });
      const nearFullHue = new Color({ l: 60, c: 20, h: 340 });
      const grayscaleA = new Color({ l: 55, a: 0, b: 0 });
      const grayscaleB = new Color({ l: 45, a: 0, b: 0 });

      expect(deltaECIEDE2000(nearZeroHue, nearFullHue)).toBeCloseTo(9.2596, 4);
      expect(deltaECIEDE2000(grayscaleA, grayscaleB)).toBeCloseTo(10.328990616488563, 6);
      expect(deltaECIE94(grayscaleA, grayscaleB)).toBeCloseTo(10.329000048382673, 6);
      expect(deltaECIE76(grayscaleA, grayscaleB)).toBeCloseTo(10.329000048407398, 6);
    });

    it('honors custom weighting factors for CIE94', () => {
      const lighterRed = new Color('#ff6666');
      const darkerRed = new Color('#aa0000');

      const defaultWeighting = deltaECIE94(lighterRed, darkerRed);
      const textilesWeighting = deltaECIE94(lighterRed, darkerRed, { kL: 2, kC: 1, kH: 1.5 });
      expect(defaultWeighting).toBeGreaterThan(textilesWeighting);
      expect(defaultWeighting).toBeCloseTo(29.175, 3);
      expect(textilesWeighting).toBeCloseTo(15.172, 3);
    });

    it('throws informative errors for invalid inputs', () => {
      expect(() => deltaECIE76(null as unknown as Color, new Color('#000000'))).toThrow(
        'Color input for Delta E cannot be null or undefined'
      );

      class InvalidLabColor extends Color {
        toLAB(): ColorLAB {
          return { l: 1, a: 2, b: Number.NaN };
        }
      }

      const invalidLabLike = new InvalidLabColor('#000000');
      expect(() => getDeltaE(invalidLabLike, new Color('#000000'))).toThrow(
        'Color input for Delta E must contain finite numeric L, A, and B values'
      );
    });

    it('supports comparing colors from different input spaces', () => {
      const red = new Color('#ff0000');
      const green = new Color({ h: 120, s: 100, l: 50 });
      const yellow = new Color({ l: 97.607, a: -15.578, b: 93.585 });

      expect(deltaECIE76(red, green)).toBeCloseTo(170.585, 2);
      expect(deltaECIE94(red, yellow)).toBeCloseTo(59.1667, 3);
      expect(deltaECIEDE2000(red, yellow)).toBeCloseTo(63.5875, 4);
    });

    it('throws for unsupported methods in getDeltaE', () => {
      const colorA = new Color({ l: 50, a: 2.6772, b: -79.7751 });
      const colorB = new Color({ l: 50, a: 0, b: -82.7485 });

      expect(() => getDeltaE(colorA, colorB, 'INVALID' as never)).toThrow(
        'Unsupported Delta E method: INVALID'
      );
    });
  });

  describe('Color.differenceFrom', () => {
    it('uses CIEDE2000 by default', () => {
      const red = new Color('#ff0000');
      const almostRed = new Color('#ff0100');

      expect(red.differenceFrom(almostRed)).toBeCloseTo(0.034, 3);
    });

    it('accepts alternate methods', () => {
      const blue = new Color('rgb(0, 0, 255)');
      const teal = new Color({ h: 180, s: 100, l: 50 });

      expect(blue.differenceFrom(teal, 'CIE76')).toBeCloseTo(168.65, 2);
      expect(blue.differenceFrom(teal, 'CIE94')).toBeCloseTo(74.762, 2);
    });

    it('accepts Colors created from different input shapes', () => {
      const base = new Color('#336699');
      const identical = new Color({ r: 51, g: 102, b: 153 });
      const white = new Color('#ffffff');

      expect(base.differenceFrom(identical)).toBe(0);
      expect(base.differenceFrom(white, 'CIE76')).toBeCloseTo(66.644, 3);
    });

    it('is symmetric regardless of parameter order', () => {
      const golden = new Color('#daa520');
      const navy = new Color('#001f3f');

      const forward = golden.differenceFrom(navy, 'CIEDE2000');
      const reverse = navy.differenceFrom(golden, 'CIEDE2000');

      expect(forward).toBeCloseTo(reverse, 12);
    });
  });
});
