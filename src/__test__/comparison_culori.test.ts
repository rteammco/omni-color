import {
  converter,
  differenceCie76,
  differenceCie94,
  differenceCiede2000,
  formatHex8,
  parse,
  wcagContrast,
} from 'culori';

import { Color } from '../color/color';

const culoriToRgb = converter('rgb');
const culoriToHsl = converter('hsl');
const culoriToHsv = converter('hsv');
const culoriToLab = converter('lab');
const culoriToLch = converter('lch');
const culoriToOklch = converter('oklch');

const TEST_COLORS = [
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#000000',
  '#ffffff',
  '#808080',
  '#f0f8ff', // aliceblue
  '#ff1493', // deeppink
  '#00ced1', // darkturquoise
  'rgba(255, 0, 0, 0.5)',
  'hsla(120, 100%, 50%, 0.3)',
  '#12345678',
  { r: 100, g: 150, b: 200 },
  { h: 200, s: 50, l: 50 },
  { l: 50, a: 10, b: -10 },
  { l: 0.5, c: 0.1, h: 180, alpha: 1 }, // OKLCH-like object
];

// Helper to handle hue being undefined in culori for grayscale
const fixHue = (h: number | undefined) => (h === undefined || isNaN(h) ? 0 : h);

function parseOrThrow(input: string) {
  const result = parse(input);
  if (!result) {
    throw new Error(`Culori failed to parse: ${input}`);
  }
  return result;
}

// TODO: unskip and fix these tests
describe.skip('Cross-check with Culori', () => {
  describe('Conversions', () => {
    TEST_COLORS.forEach((input) => {
      const omni = new Color(input as any);
      const sourceHex8 = omni.toHex8();
      const culoriColor = parseOrThrow(sourceHex8);

      describe(`Input: ${JSON.stringify(input)} (Hex8: ${sourceHex8})`, () => {
        it('matches RGB', () => {
          const omniRgb = omni.toRGB();
          const culoriRgb = culoriToRgb(culoriColor);

          expect(omniRgb.r).toBeCloseTo(culoriRgb.r * 255, 0);
          expect(omniRgb.g).toBeCloseTo(culoriRgb.g * 255, 0);
          expect(omniRgb.b).toBeCloseTo(culoriRgb.b * 255, 0);

          const omniAlpha = omni.getAlpha();
          const culoriAlpha = culoriRgb.alpha ?? 1;
          expect(omniAlpha).toBeCloseTo(culoriAlpha, 2);
        });

        it('matches HEX', () => {
          const omniHex8 = omni.toHex8();
          const culoriHex8 = formatHex8(culoriColor);
          expect(omniHex8).toBe(culoriHex8);
        });

        it('matches HSL', () => {
          const omniHsl = omni.toHSL();
          const culoriHsl = culoriToHsl(culoriColor);

          const ch = fixHue(culoriHsl.h);

          if (omniHsl.s > 1) {
            const diff = Math.abs(omniHsl.h - ch);
            const diffWrapped = Math.min(diff, 360 - diff);
            expect(diffWrapped).toBeLessThan(2);
          }

          expect(omniHsl.s).toBeCloseTo(culoriHsl.s * 100, 0);
          expect(omniHsl.l).toBeCloseTo(culoriHsl.l * 100, 0);
        });

        it('matches HSV', () => {
          const omniHsv = omni.toHSV();
          const culoriHsv = culoriToHsv(culoriColor);

          const ch = fixHue(culoriHsv.h);

          if (omniHsv.s > 1) {
            const diff = Math.abs(omniHsv.h - ch);
            const diffWrapped = Math.min(diff, 360 - diff);
            expect(diffWrapped).toBeLessThan(2);
          }
          expect(omniHsv.s).toBeCloseTo(culoriHsv.s * 100, 0);
          expect(omniHsv.v).toBeCloseTo(culoriHsv.v * 100, 0);
        });

        it('matches Lab', () => {
          const omniLab = omni.toLAB();
          const culoriLab = culoriToLab(culoriColor);

          expect(omniLab.l).toBeCloseTo(culoriLab.l, 1);
          expect(omniLab.a).toBeCloseTo(culoriLab.a, 1);
          expect(omniLab.b).toBeCloseTo(culoriLab.b, 1);
        });

        it('matches LCH', () => {
          const omniLch = omni.toLCH();
          const culoriLch = culoriToLch(culoriColor);

          expect(omniLch.l).toBeCloseTo(culoriLch.l, 1);
          expect(omniLch.c).toBeCloseTo(culoriLch.c, 1);

          if (omniLch.c > 1) {
            const ch = fixHue(culoriLch.h);
            const diff = Math.abs(omniLch.h - ch);
            const diffWrapped = Math.min(diff, 360 - diff);
            expect(diffWrapped).toBeLessThan(2);
          }
        });

        it('matches OKLCH', () => {
          const omniOklch = omni.toOKLCH();
          const culoriOklch = culoriToOklch(culoriColor);

          expect(omniOklch.l).toBeCloseTo(culoriOklch.l, 3);
          expect(omniOklch.c).toBeCloseTo(culoriOklch.c, 3);

          if (omniOklch.c > 0.01) {
            const ch = fixHue(culoriOklch.h);
            const diff = Math.abs(omniOklch.h - ch);
            const diffWrapped = Math.min(diff, 360 - diff);
            expect(diffWrapped).toBeLessThan(2);
          }
        });
      });
    });
  });

  describe('DeltaE', () => {
    // Pairs to compare
    const pairs = [
      ['#ff0000', '#ff0000'],
      ['#ff0000', '#ff0100'],
      ['#ff0000', '#00ff00'],
      ['#000000', '#ffffff'],
      ['#123456', '#654321'],
    ];

    pairs.forEach(([c1, c2]) => {
      const color1 = new Color(c1);
      const color2 = new Color(c2);
      const culori1 = parseOrThrow(color1.toHex8());
      const culori2 = parseOrThrow(color2.toHex8());

      describe(`${c1} vs ${c2}`, () => {
        it('matches CIE76', () => {
          const omniVal = color1.differenceFrom(color2, { method: 'CIE76' });
          const culoriVal = differenceCie76()(culori1, culori2);
          expect(omniVal).toBeCloseTo(culoriVal, 1);
        });

        it('matches CIE94', () => {
          const omniVal = color1.differenceFrom(color2, { method: 'CIE94' });
          const culoriVal = differenceCie94()(culori1, culori2);
          expect(omniVal).toBeCloseTo(culoriVal, 1);
        });

        it('matches CIEDE2000', () => {
          const omniVal = color1.differenceFrom(color2, { method: 'CIEDE2000' });
          const culoriVal = differenceCiede2000()(culori1, culori2);
          expect(omniVal).toBeCloseTo(culoriVal, 3);
        });
      });
    });
  });

  describe('Contrast', () => {
    const pairs = [
      ['#000000', '#ffffff'],
      ['#ff0000', '#00ff00'],
      ['#777777', '#888888'],
      ['#123456', '#abcdef'],
    ];

    pairs.forEach(([bg, fg]) => {
      const bgColor = new Color(bg);
      const fgColor = new Color(fg);
      const culoriBg = parseOrThrow(bgColor.toHex8());
      const culoriFg = parseOrThrow(fgColor.toHex8());

      it(`matches WCAG contrast for ${bg} on ${fg}`, () => {
        const omniContrast = bgColor.getContrastRatio(fgColor);
        const culoriContrast = wcagContrast(culoriBg, culoriFg);
        expect(omniContrast).toBeCloseTo(culoriContrast, 2);
      });
    });
  });
});
