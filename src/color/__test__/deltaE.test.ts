import { toLAB } from '../conversions';
import { getDeltaE } from '../deltaE';
import type { ColorLAB } from '../formats.types';

describe('Delta E calculations', () => {
  describe('getDeltaE', () => {
    it('returns 0 for identical colors regardless of method', () => {
      const neutral = toLAB('#777777');

      expect(getDeltaE(neutral, neutral, { method: 'CIE76' })).toBe(0);
      expect(getDeltaE(neutral, neutral, { method: 'CIE94' })).toBe(0);
      expect(getDeltaE(neutral, neutral, { method: 'CIEDE2000' })).toBe(0);
    });

    it('matches Sharma et al. 2005 reference values for CIEDE2000', () => {
      // Pairs from Table 1 of "The CIEDE2000 Color-Difference Formula:
      // Implementation Notes, Supplementary Test Data, and Mathematical Observations"
      const refB: ColorLAB = { l: 50, a: 0, b: -82.7485 };

      const pair1A: ColorLAB = { l: 50, a: 2.6772, b: -79.7751 };
      expect(getDeltaE(pair1A, refB, { method: 'CIEDE2000' })).toBeCloseTo(2.0425, 4);

      const pair2A: ColorLAB = { l: 50, a: 3.1571, b: -77.2803 };
      expect(getDeltaE(pair2A, refB, { method: 'CIEDE2000' })).toBeCloseTo(2.8615, 4);

      const pair3A: ColorLAB = { l: 50, a: 2.8361, b: -74.02 };
      expect(getDeltaE(pair3A, refB, { method: 'CIEDE2000' })).toBeCloseTo(3.4412, 4);
    });

    it('matches expected CIE94 and CIE76 values for known LAB pairs', () => {
      const refB: ColorLAB = { l: 50, a: 0, b: -82.7485 };

      const pair1A: ColorLAB = { l: 50, a: 2.6772, b: -79.7751 };
      expect(getDeltaE(pair1A, refB, { method: 'CIE94' })).toBeCloseTo(1.3950388678587375, 6);
      expect(getDeltaE(pair1A, refB, { method: 'CIE76' })).toBeCloseTo(4.001063283678486, 6);

      const pair2A: ColorLAB = { l: 50, a: 3.1571, b: -77.2803 };
      expect(getDeltaE(pair2A, refB, { method: 'CIE94' })).toBeCloseTo(1.9341005516297263, 6);
      expect(getDeltaE(pair2A, refB, { method: 'CIE76' })).toBeCloseTo(6.3141501130397675, 6);

      const pair3A: ColorLAB = { l: 50, a: 2.8361, b: -74.02 };
      expect(getDeltaE(pair3A, refB, { method: 'CIE94' })).toBeCloseTo(2.4543356649822505, 6);
      expect(getDeltaE(pair3A, refB, { method: 'CIE76' })).toBeCloseTo(9.177699900301828, 6);
    });

    it('handles hue wrapping and zero-chroma inputs correctly', () => {
      const nearZeroHue = toLAB({ l: 60, c: 20, h: 20, format: 'LCH' });
      const nearFullHue = toLAB({ l: 60, c: 20, h: 340, format: 'LCH' });
      const grayscaleA: ColorLAB = { l: 55, a: 0, b: 0 };
      const grayscaleB: ColorLAB = { l: 45, a: 0, b: 0 };

      expect(getDeltaE(nearZeroHue, nearFullHue, { method: 'CIEDE2000' })).toBeCloseTo(9.2596, 4);
      expect(getDeltaE(grayscaleA, grayscaleB, { method: 'CIEDE2000' })).toBe(10);
      expect(getDeltaE(grayscaleA, grayscaleB, { method: 'CIE94' })).toBe(10);
      expect(getDeltaE(grayscaleA, grayscaleB, { method: 'CIE76' })).toBe(10);
    });

    it('honors custom weighting factors for CIE94', () => {
      const lighterRed = toLAB('#ff6666');
      const darkerRed = toLAB('#aa0000');

      const defaultWeighting = getDeltaE(lighterRed, darkerRed, { method: 'CIE94' });
      const textilesWeighting = getDeltaE(lighterRed, darkerRed, {
        method: 'CIE94',
        cie94Options: { kL: 2, kC: 1, kH: 1.5 },
      });
      expect(defaultWeighting).toBeGreaterThan(textilesWeighting);
      expect(defaultWeighting).toBeCloseTo(29.175, 3);
      expect(textilesWeighting).toBeCloseTo(15.172, 3);
    });

    it('honors custom weighting factors for CIEDE2000', () => {
      const lighterRed = toLAB('#ff6666');
      const darkerRed = toLAB('#aa0000');

      const defaultWeighting = getDeltaE(lighterRed, darkerRed, { method: 'CIEDE2000' });
      const customWeighting = getDeltaE(lighterRed, darkerRed, {
        method: 'CIEDE2000',
        ciede2000Options: { kL: 2, kC: 1, kH: 1.5 },
      });
      const explicitDefaults = getDeltaE(lighterRed, darkerRed, {
        method: 'CIEDE2000',
        ciede2000Options: { kL: 1, kC: 1, kH: 1 },
      });

      expect(defaultWeighting).toBeCloseTo(29.2788, 4);
      expect(customWeighting).toBeCloseTo(15.2694, 4);
      expect(explicitDefaults).toBeCloseTo(defaultWeighting, 12);
    });

    it('supports comparing colors converted from different input spaces', () => {
      const red = toLAB('#ff0000');
      const green = toLAB({ h: 120, s: 100, l: 50 });
      const yellow: ColorLAB = { l: 97.607, a: -15.578, b: 93.585 };

      expect(getDeltaE(red, green, { method: 'CIE76' })).toBeCloseTo(170.584, 2);
      expect(getDeltaE(red, yellow, { method: 'CIE94' })).toBeCloseTo(58.743, 3);
      expect(getDeltaE(red, yellow, { method: 'CIEDE2000' })).toBeCloseTo(61.714, 3);
    });

    it('throws for invalid methods in getDeltaE', () => {
      const labA: ColorLAB = { l: 50, a: 2.6772, b: -79.7751 };
      const labB: ColorLAB = { l: 50, a: 0, b: -82.7485 };

      expect(() => getDeltaE(labA, labB, { method: 'INVALID' as never })).toThrow(
        "Invalid 'method'",
      );
    });

    it('uses CIEDE2000 by default', () => {
      const red = toLAB('#ff0000');
      const almostRed = toLAB('#ff0100');

      expect(getDeltaE(red, almostRed)).toBeCloseTo(0.034, 3);
    });

    it('accepts alternate methods', () => {
      const blue = toLAB({ r: 0, g: 0, b: 255 });
      const teal = toLAB({ h: 180, s: 100, l: 50 });

      expect(getDeltaE(blue, teal, { method: 'CIE76' })).toBeCloseTo(168.65, 2);
      expect(getDeltaE(blue, teal, { method: 'CIE94' })).toBeCloseTo(74.762, 2);
    });

    it('accepts inputs converted from different raw formats', () => {
      const base = toLAB('#336699');
      const identical = toLAB({ r: 51, g: 102, b: 153 });
      const white = toLAB('#ffffff');

      expect(getDeltaE(base, identical)).toBe(0);
      expect(getDeltaE(base, white, { method: 'CIE76' })).toBeCloseTo(66.644, 3);
    });

    it('is symmetric regardless of parameter order', () => {
      const golden = toLAB('#daa520');
      const navy = toLAB('#001f3f');

      const forward = getDeltaE(golden, navy, { method: 'CIEDE2000' });
      const reverse = getDeltaE(navy, golden, { method: 'CIEDE2000' });

      expect(forward).toBeCloseTo(reverse, 12);
    });

    it('accepts mixed case method', () => {
      const c1 = toLAB('#ff0000');
      const c2 = toLAB('#800000');
      const d1 = getDeltaE(c1, c2, { method: 'CIE94' });
      const d2 = getDeltaE(c1, c2, { method: 'cie94' });

      expect(d1).toBe(d2);
    });
  });
});
