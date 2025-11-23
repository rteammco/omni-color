import { Color } from '../color';
import { deltaECIE76, deltaECIE94, deltaECIEDE2000, getDeltaE } from '../deltaE';
import type { ColorLCH } from '../formats';

describe('Delta E calculations', () => {
  function labToLch(l: number, a: number, b: number): ColorLCH {
    const c = Math.sqrt(a ** 2 + b ** 2);
    const h = ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
    return { l, c, h };
  }

  describe('utility functions', () => {
    it('returns 0 for identical colors regardless of method', () => {
      const neutral = new Color('#777777');

      expect(deltaECIE76(neutral, neutral)).toBe(0);
      expect(deltaECIE94(neutral, neutral)).toBe(0);
      expect(deltaECIEDE2000(neutral, neutral)).toBe(0);
      expect(getDeltaE(neutral, neutral, 'CIEDE2000')).toBe(0);
    });

    it('matches reference values for CIEDE2000', () => {
      const firstPairA = labToLch(50, 2.6772, -79.7751);
      const firstPairB = labToLch(50, 0, -82.7485);
      expect(deltaECIEDE2000(firstPairA, firstPairB)).toBeCloseTo(2.0425, 4);

      const secondPairA = labToLch(50, 3.1571, -77.2803);
      const secondPairB = labToLch(50, 0, -82.7485);
      expect(deltaECIEDE2000(secondPairA, secondPairB)).toBeCloseTo(2.8615, 4);

      const thirdPairA = labToLch(50, 2.8361, -74.02);
      const thirdPairB = labToLch(50, 0, -82.7485);
      expect(deltaECIEDE2000(thirdPairA, thirdPairB)).toBeCloseTo(3.4412, 4);
    });

    it('matches reference values for CIE94 and CIE76', () => {
      const firstPairA = labToLch(50, 2.6772, -79.7751);
      const firstPairB = labToLch(50, 0, -82.7485);
      expect(deltaECIE94(firstPairA, firstPairB)).toBeCloseTo(1.3950388678587375, 6);
      expect(deltaECIE76(firstPairA, firstPairB)).toBeCloseTo(4.001063283678486, 6);

      const secondPairA = labToLch(50, 3.1571, -77.2803);
      const secondPairB = labToLch(50, 0, -82.7485);
      expect(deltaECIE94(secondPairA, secondPairB)).toBeCloseTo(1.9341005516297263, 6);
      expect(deltaECIE76(secondPairA, secondPairB)).toBeCloseTo(6.3141501130397675, 6);

      const thirdPairA = labToLch(50, 2.8361, -74.02);
      const thirdPairB = labToLch(50, 0, -82.7485);
      expect(deltaECIE94(thirdPairA, thirdPairB)).toBeCloseTo(2.4543356649822505, 6);
      expect(deltaECIE76(thirdPairA, thirdPairB)).toBeCloseTo(9.177699900301828, 6);
    });

    it('handles hue wrapping and zero-chroma inputs correctly', () => {
      const nearZeroHue: ColorLCH = { l: 60, c: 20, h: 20 };
      const nearFullHue: ColorLCH = { l: 60, c: 20, h: 340 };
      const grayscaleA = { l: 55, c: 0, h: 0 } satisfies ColorLCH;
      const grayscaleB = { l: 45, c: 0, h: 200 } satisfies ColorLCH;

      expect(deltaECIEDE2000(nearZeroHue, nearFullHue)).toBeCloseTo(9.1235, 4);
      expect(deltaECIEDE2000(grayscaleA, grayscaleB)).toBeCloseTo(10, 6);
      expect(deltaECIE94(grayscaleA, grayscaleB)).toBeCloseTo(10, 6);
      expect(deltaECIE76(grayscaleA, grayscaleB)).toBeCloseTo(10, 6);
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
      expect(() => deltaECIE76(null as unknown as ColorLCH, { l: 0, c: 0, h: 0 })).toThrow(
        'Color input for Delta E cannot be null or undefined'
      );
      expect(() => deltaECIEDE2000({ l: Number.NaN, c: 20, h: 45 } as ColorLCH, { l: 0, c: 0, h: 0 })).toThrow();
      expect(() => getDeltaE({ l: 1, c: 2, h: Number.NaN } as ColorLCH, { l: 0, c: 0, h: 0 })).toThrow();
    });

    it('supports comparing colors from different input spaces', () => {
      const red = new Color('#ff0000');
      const green = new Color({ h: 120, s: 100, l: 50 });
      const yellowLch = labToLch(97.607, -15.578, 93.585);

      expect(deltaECIE76(red, green)).toBeCloseTo(170.585, 2);
      expect(deltaECIE94(red, yellowLch)).toBeCloseTo(58.743, 3);
      expect(deltaECIEDE2000(red, yellowLch)).toBeCloseTo(61.715, 3);
    });

    it('throws for unsupported methods in getDeltaE', () => {
      const colorA = labToLch(50, 2.6772, -79.7751);
      const colorB = labToLch(50, 0, -82.7485);

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

    it('accepts primitive color inputs without requiring Color instances', () => {
      const base = new Color('#336699');

      expect(base.differenceFrom({ r: 51, g: 102, b: 153 })).toBe(0);
      expect(base.differenceFrom('#ffffff', 'CIE76')).toBeCloseTo(66.644, 3);
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
