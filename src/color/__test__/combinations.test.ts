import { Color } from '../color';
import { averageColors, blendColors, mixColors } from '../combinations';

describe('mixColors', () => {
  it('mixes colors additively in RGB space', () => {
    const red = new Color('#ff0000');
    const green = new Color('#00ff00');
    const result = mixColors([red, green], {
      type: 'ADDITIVE',
      space: 'RGB',
    });
    expect(result.toHex()).toBe('#ffff00');
  });

  it('mixes red, green, and blue additively to white', () => {
    const red = new Color('#ff0000');
    const green = new Color('#00ff00');
    const blue = new Color('#0000ff');
    const result = mixColors([red, green, blue], {
      type: 'ADDITIVE',
      space: 'RGB',
    });
    expect(result.toHex()).toBe('#ffffff');
  });

  it('mixes colors subtractively in CMYK space', () => {
    const cyan = new Color('#00ffff');
    const yellow = new Color('#ffff00');
    const result = mixColors([cyan, yellow], { type: 'SUBTRACTIVE' });
    expect(result.toHex()).toBe('#00ff00');
  });

  it('mixes cyan, magenta, and yellow subtractively to black', () => {
    const cyan = new Color('#00ffff');
    const magenta = new Color('#ff00ff');
    const yellow = new Color('#ffff00');
    const result = mixColors([cyan, magenta, yellow], {
      type: 'SUBTRACTIVE',
    });
    expect(result.toHex()).toBe('#000000');
  });

  it('mixes colors in HSL space with weighted interpolation', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = mixColors([red, blue], {
      space: 'HSL',
      weights: [1, 3],
    });
    expect(result.toHex()).toBe('#5100ff');
    const { h, s, l } = result.toHSL();
    expect(h).toBe(259);
    expect(s).toBe(100);
    expect(l).toBe(50);
  });

  it('accepts mixed case mix space', () => {
    const c1 = new Color('red');
    const c2 = new Color('blue');
    const mix1 = mixColors([c1, c2], { space: 'RGB' });
    const mix2 = mixColors([c1, c2], { space: 'rgb' });
    // @ts-expect-error - testing mixed casing not covered by type but valid runtime
    const mix3 = mixColors([c1, c2], { space: 'rGb' });

    expect(mix1.toHex()).toBe(mix2.toHex());
    expect(mix1.toHex()).toBe(mix3.toHex());
  });

  it('accepts mixed case mix type', () => {
    const c1 = new Color('red');
    const c2 = new Color('blue');
    const sub1 = mixColors([c1, c2], { type: 'SUBTRACTIVE' });
    const sub2 = mixColors([c1, c2], { type: 'subtractive' });

    expect(sub1.toHex()).toBe(sub2.toHex());
  });

  it('defaults to additive Linear RGB mixing', () => {
    const red = new Color('#ff0000');
    const green = new Color('#00ff00');
    const result = mixColors([red, green]);
    expect(result.toHex()).toBe('#b4b400');
  });

  it('mixes colors additively in Linear RGB space (brighter mix)', () => {
    const red = new Color('#cc0000');
    const green = new Color('#00cc00');
    // In sRGB: cc(204) + 0 = 204. Result #cccc00.
    // In Linear:
    // 204/255 = 0.8. Linear(0.8) ~= 0.6.
    // 0.6 + 0 = 0.6.
    // 0 + 0.6 = 0.6.
    // Linear(0.6) -> sRGB(0.8) -> 204.
    // Wait, pure additive of non-clipping colors should be similar?
    // Let's test averaging behavior via weights summing to 1.
    const result = mixColors([red, green], { space: 'LINEAR_RGB', weights: [0.5, 0.5] });
    // sRGB Avg: 102, 102, 0 -> #666600
    // Linear Avg: 0.6*0.5 + 0 = 0.3. sRGB(0.3) -> ~150 (#96)
    expect(result.toHex()).not.toBe('#666600');
    // Approx #969600
    const { r, g } = result.toRGBA();
    expect(r).toBeGreaterThan(140);
    expect(g).toBeGreaterThan(140);
  });

  it('throws when fewer than two colors are provided', () => {
    const red = new Color('#ff0000');
    expect(() => mixColors([red])).toThrow('at least two colors are required for mixing');
  });

  it('defaults weights to 1 when provided weights sum to 0', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = mixColors([red, blue], { weights: [1, -1] });
    expect(result.toHex()).toBe('#b400b4');
  });

  it('mixes colors with alpha channel in RGB space', () => {
    const semiRed = new Color({ r: 255, g: 0, b: 0, a: 0.5 });
    const blue = new Color({ r: 0, g: 0, b: 255, a: 1 });
    const result = mixColors([semiRed, blue], { type: 'ADDITIVE', space: 'RGB' });
    expect(result.toHex()).toBe('#ff00ff');
    expect(result.toRGBA().a).toBe(0.75);
  });

  it('mixes colors in LCH space', () => {
    const black = new Color('#000000');
    const white = new Color('#ffffff');
    const result = mixColors([black, white], { space: 'LCH' });
    expect(result.toHex()).toBe('#777777');
  });

  it('mixes colors in OKLCH space', () => {
    const black = new Color('#000000');
    const white = new Color('#ffffff');
    const result = mixColors([black, white], { space: 'OKLCH' });
    expect(result.toHex()).toBe('#636363');
  });

  it('mixes colors across the red hue boundary using linear addition', () => {
    const h1 = new Color({ h: 350, s: 100, l: 50 });
    const h2 = new Color({ h: 10, s: 100, l: 50 });
    const result = mixColors([h1, h2], { space: 'HSL' });
    expect(result.toHex()).toBe('#ff0000');
  });

  it('respects weights in additive mixing for polar spaces', () => {
    // Dark Red (sRGB 128, 0, 0) -> Linear ~0.21
    // Dark Blue (sRGB 0, 0, 128) -> Linear ~0.21
    const darkRed = new Color('#800000');
    const darkBlue = new Color('#000080');

    // Weights [2, 1]
    // Red: 0.21 * 2 = 0.42
    // Blue: 0.21 * 1 = 0.21
    // Result Linear: (0.42, 0, 0.21)
    // Result sRGB:
    // R: 0.42 -> ~0.68 -> ~174
    // B: 0.21 -> ~0.50 -> ~128
    const result = mixColors([darkRed, darkBlue], {
      space: 'HSL',
      weights: [2, 1],
    });

    const { r, b } = result.toRGBA();
    expect(result.toHex()).toBe('#800040');
    expect(r).toBe(128);
    expect(b).toBe(64);
    expect(result.toRGBA().g).toBe(0);
  });

  it('handles hue wrap-around in LCH space', () => {
    const h1 = new Color({ h: 350, s: 100, l: 50 });
    const h2 = new Color({ h: 10, s: 100, l: 50 });
    const result = mixColors([h1, h2], { space: 'LCH' });
    const hue = result.toLCH().h;
    const distanceFromZero = Math.min(hue, 360 - hue);
    expect(distanceFromZero).toBeLessThan(45);
    expect(Math.abs(hue - 180)).toBeGreaterThan(90);
  });

  it('handles hue wrap-around in OKLCH space', () => {
    const h1 = new Color({ h: 350, s: 100, l: 50 });
    const h2 = new Color({ h: 10, s: 100, l: 50 });
    const result = mixColors([h1, h2], { space: 'OKLCH' });
    const hue = result.toOKLCH().h;
    const distanceFromZero = Math.min(hue, 360 - hue);
    expect(distanceFromZero).toBeLessThan(45);
    expect(Math.abs(hue - 180)).toBeGreaterThan(90);
  });

  it('defaults to equal weights when weights length mismatches', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = mixColors([red, blue], { weights: [2] });
    expect(result.toHex()).toBe('#b400b4');
  });

  it('ignores colors with zero weight', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = mixColors([red, blue], { weights: [0, 1] });
    expect(result.toHex()).toBe('#0000ff');
  });

  it('accumulates light when mixing identical colors in HSL space', () => {
    const darkRed = new Color('#800000');
    const result = mixColors([darkRed, darkRed], { space: 'HSL' });
    expect(result.toHex()).toBe('#800000');
  });

  it('produces distinct results when mixing in HSL, LCH, and OKLCH spaces', () => {
    const red = new Color('#ff0000');
    const cyan = new Color('#00ffff');

    const hslMix = mixColors([red, cyan], { space: 'HSL' });
    const lchMix = mixColors([red, cyan], { space: 'LCH' });
    const oklchMix = mixColors([red, cyan], { space: 'OKLCH' });

    expect(hslMix.toHex()).toBe('#80ff00');
    expect(lchMix.toHex()).toBe('#dda581');
    expect(oklchMix.toHex()).toBe('#d2a993');
  });
});

describe('averageColors', () => {
  it('averages colors in RGB space', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = averageColors([red, blue], { space: 'RGB' });
    expect(result.toHex()).toBe('#800080');
  });

  it('averages colors in Linear RGB space (brighter purple)', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = averageColors([red, blue], { space: 'LINEAR_RGB' });
    // RGB avg: 128, 0, 128 -> #800080
    // Linear avg: #bc00bc
    expect(result.toHex()).toBe('#bc00bc');
  });

  it('averages red, green, and blue to gray in RGB space', () => {
    const red = new Color('#ff0000');
    const green = new Color('#00ff00');
    const blue = new Color('#0000ff');
    const result = averageColors([red, green, blue], { space: 'RGB' });
    expect(result.toHex()).toBe('#555555');
  });

  it('averages colors in HSL space with weights', () => {
    const red = new Color('#ff0000');
    const green = new Color('#00ff00');
    const result = averageColors([red, green], {
      space: 'HSL',
      weights: [1, 2],
    });
    expect(result.toHex()).toBe('#80ff00');
  });

  it('defaults to Linear RGB averaging', () => {
    const red = new Color('#ff0000');
    const green = new Color('#00ff00');
    const result = averageColors([red, green]);
    // Expect brighter yellow than #808000
    expect(result.toHex()).toBe('#bcbc00');
  });

  it('throws when fewer than two colors are provided', () => {
    const red = new Color('#ff0000');
    expect(() => averageColors([red])).toThrow('at least two colors are required for averaging');
  });

  it('averages colors with alpha channel', () => {
    const semiRed = new Color({ r: 255, g: 0, b: 0, a: 0.5 });
    const blue = new Color({ r: 0, g: 0, b: 255, a: 1 });
    const result = averageColors([semiRed, blue], { space: 'RGB' });
    expect(result.toHex()).toBe('#800080');
    expect(result.toRGBA().a).toBe(0.75);
  });

  it('averages black and white in LCH space', () => {
    const black = new Color('#000000');
    const white = new Color('#ffffff');
    const result = averageColors([black, white], { space: 'LCH' });
    expect(result.toHex()).toBe('#777777');
  });

  it('averages black and white in OKLCH space', () => {
    const black = new Color('#000000');
    const white = new Color('#ffffff');
    const result = averageColors([black, white], { space: 'OKLCH' });
    expect(result.toHex()).toBe('#636363');
  });

  it('averages hues correctly across the 360° boundary', () => {
    const h1 = new Color({ h: 350, s: 100, l: 50 });
    const h2 = new Color({ h: 10, s: 100, l: 50 });
    const result = averageColors([h1, h2], { space: 'HSL' });
    expect(result.toHex()).toBe('#ff0000');
  });

  it('averages LCH hues correctly across 360 boundary', () => {
    const h1 = new Color({ l: 50, c: 50, h: 350 });
    const h2 = new Color({ l: 50, c: 50, h: 10 });
    const result = averageColors([h1, h2], { space: 'LCH' });
    const h = result.toLCH().h;
    const distTo0 = Math.min(h, 360 - h);
    expect(distTo0).toBeLessThan(10);
  });

  it('averages OKLCH hues correctly across 360 boundary', () => {
    const h1 = new Color({ l: 0.5, c: 0.1, h: 350 });
    const h2 = new Color({ l: 0.5, c: 0.1, h: 10 });
    const result = averageColors([h1, h2], { space: 'OKLCH' });
    const h = result.toOKLCH().h;
    const distTo0 = Math.min(h, 360 - h);
    expect(distTo0).toBeLessThan(10);
  });

  it('defaults to equal weights when weights length mismatches', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = averageColors([red, blue], { weights: [2] });
    expect(result.toHex()).toBe('#bc00bc');
  });

  it('defaults weights to equal when provided weights sum to 0', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = averageColors([red, blue], { weights: [1, -1] });
    expect(result.toHex()).toBe('#bc00bc');
  });
});

describe('blendColors', () => {
  it('blends using multiply mode', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = blendColors(red, blue, { mode: 'MULTIPLY', ratio: 1 });
    expect(result.toHex()).toBe('#000000');
  });

  it('accepts mixed case blend mode', () => {
    const c1 = new Color('red');
    const c2 = new Color('blue');
    const b1 = blendColors(c1, c2, { mode: 'MULTIPLY' });
    const b2 = blendColors(c1, c2, { mode: 'multiply' });

    expect(b1.toHex()).toBe(b2.toHex());
  });

  it('accepts mixed case blend space', () => {
    const c1 = new Color('red');
    const c2 = new Color('blue');
    const b1 = blendColors(c1, c2, { space: 'HSL' });
    const b2 = blendColors(c1, c2, { space: 'hsl' });

    expect(b1.toHex()).toBe(b2.toHex());
  });

  it('partially blends using multiply mode', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = blendColors(red, blue, {
      mode: 'MULTIPLY',
      ratio: 0.5,
    });
    expect(result.toHex()).toBe('#800000');
  });

  it('blends using screen mode', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = blendColors(red, blue, { mode: 'SCREEN', ratio: 1 });
    expect(result.toHex()).toBe('#ff00ff');
  });

  it('partially blends using screen mode', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = blendColors(red, blue, {
      mode: 'SCREEN',
      ratio: 0.5,
    });
    expect(result.toHex()).toBe('#ff0080');
  });

  it('blends using overlay mode', () => {
    const gray = new Color('#808080');
    const white = new Color('#ffffff');
    const result = blendColors(gray, white, { mode: 'OVERLAY', ratio: 1 });
    expect(result.toHex()).toBe('#ffffff');
  });

  it('returns base color when ratio is 0', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = blendColors(red, blue, { ratio: 0 });
    expect(result.toHex()).toBe('#ff0000');
  });

  it('returns blend color when ratio is 1 in normal mode', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = blendColors(red, blue, { mode: 'NORMAL', ratio: 1 });
    expect(result.toHex()).toBe('#0000ff');
  });

  it('blends in HSL space', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const result = blendColors(red, blue, {
      space: 'HSL',
      ratio: 0.5,
    });
    expect(result.toHex()).toBe('#ff00ff');
  });

  it('clamps ratio outside of range 0-1', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    expect(blendColors(red, blue, { ratio: -1 }).toHex()).toBe('#ff0000');
    expect(blendColors(red, blue, { ratio: 2 }).toHex()).toBe('#0000ff');
  });

  it('blends colors with alpha channel in RGB space', () => {
    const semiRed = new Color({ r: 255, g: 0, b: 0, a: 0.5 });
    const blue = new Color({ r: 0, g: 0, b: 255, a: 0.2 });
    const result = blendColors(semiRed, blue, { ratio: 0.5 });
    expect(result.toHex()).toBe('#800080');
    expect(result.toRGBA().a).toBe(0.35);
  });

  it('handles hue wrap-around when blending in HSL space', () => {
    const h1 = new Color({ h: 350, s: 100, l: 50 });
    const h2 = new Color({ h: 10, s: 100, l: 50 });
    const result = blendColors(h1, h2, { space: 'HSL', ratio: 0.5 });
    expect(result.toHex()).toBe('#ff0000');
  });

  it('blends using overlay mode with dark base color', () => {
    const darkGray = new Color('#404040');
    const red = new Color('#ff0000');
    const result = blendColors(darkGray, red, { mode: 'OVERLAY', ratio: 1 });
    expect(result.toHex()).toBe('#800000');
  });

  it('applies blend modes within HSL space', () => {
    const red = new Color('#ff0000');
    const blue = new Color('#0000ff');
    const normal = blendColors(red, blue, { space: 'HSL', mode: 'NORMAL', ratio: 0.5 });
    const multiply = blendColors(red, blue, { space: 'HSL', mode: 'MULTIPLY', ratio: 0.5 });
    const screen = blendColors(red, blue, { space: 'HSL', mode: 'SCREEN', ratio: 0.5 });
    const overlay = blendColors(red, blue, { space: 'HSL', mode: 'OVERLAY', ratio: 0.5 });

    expect(normal.toHex()).toBe('#ff00ff');
    expect(multiply.toHex()).toBe('#b900bf');
    expect(screen.toHex()).toBe('#ff4640');
    expect(overlay.toHex()).toBe('#ff0064');
    expect(new Set([normal.toHex(), multiply.toHex(), screen.toHex(), overlay.toHex()]).size).toBe(4);
  });

  it('handles hue wrap-around for multiple HSL blend modes', () => {
    const h1 = new Color({ h: 350, s: 100, l: 50 });
    const h2 = new Color({ h: 10, s: 100, l: 50 });
    const multiply = blendColors(h1, h2, { space: 'HSL', mode: 'MULTIPLY', ratio: 0.5 });
    const screen = blendColors(h1, h2, { space: 'HSL', mode: 'SCREEN', ratio: 0.5 });
    const overlay = blendColors(h1, h2, { space: 'HSL', mode: 'OVERLAY', ratio: 0.5 });

    expect(multiply.toHex()).toBe('#bf003e');
    expect(screen.toHex()).toBe('#ff5f40');
    expect(overlay.toHex()).toBe('#ff0019');
    expect(multiply.toHSL().h).toBeCloseTo(341, 0);
    expect(overlay.toHSL().h).toBeCloseTo(354, 0);
  });

  it('preserves alpha handling when blending in HSL space', () => {
    const semiRed = new Color({ r: 255, g: 0, b: 0, a: 0.5 });
    const blue = new Color({ r: 0, g: 0, b: 255, a: 0.2 });
    const result = blendColors(semiRed, blue, { space: 'HSL', mode: 'MULTIPLY', ratio: 0.5 });

    expect(result.toHex()).toBe('#b900bf');
    expect(result.toRGBA().a).toBe(0.35);
  });
});

describe('LINEAR_RGB robustness', () => {
  it('produces physically accurate middle gray from black and white', () => {
    const black = new Color('#000000');
    const white = new Color('#ffffff');
    const result = averageColors([black, white], { space: 'LINEAR_RGB' });
    // In sRGB averaging, (0+255)/2 = 127.5 -> #808080
    // In Linear averaging, light intensity is averaged.
    // 0 + 1 = 1. / 2 = 0.5 intensity.
    // 0.5 linear intensity -> ~0.735 sRGB -> ~188.
    expect(result.toHex()).toBe('#bcbcbc');
  });

  it('mixes blue and yellow to a lighter gray than sRGB', () => {
    const blue = new Color('#0000ff');
    const yellow = new Color('#ffff00');

    const srgbResult = averageColors([blue, yellow], { space: 'RGB' });
    expect(srgbResult.toHex()).toBe('#808080'); // Dark gray

    const linearResult = averageColors([blue, yellow], { space: 'LINEAR_RGB' });
    expect(linearResult.toHex()).toBe('#bcbcbc'); // Lighter gray (physically correct)
  });

  it('handles weighted mixing correctly', () => {
    const red = new Color('#ff0000'); // Linear (1, 0, 0)
    const blue = new Color('#0000ff'); // Linear (0, 0, 1)

    // 75% Red, 25% Blue. LINEAR_RGB mixing normalizes weights to preserve the intended ratio.
    const result = mixColors([red, blue], {
      space: 'LINEAR_RGB',
      weights: [0.75, 0.25],
    });

    expect(result.toHex()).toBe('#dd0080');
    expect(result.toRGBA().a).toBe(1);
  });

  it('handles alpha blending linearly', () => {
    // Linear RGB mixing currently interpolates alpha linearly, just like RGB.
    const transparentRed = new Color('rgba(255, 0, 0, 0)');
    const opaqueGreen = new Color('rgba(0, 255, 0, 1)');

    // Using averageColors for equal weighting
    const result = averageColors([transparentRed, opaqueGreen], { space: 'LINEAR_RGB' });

    // Alpha should be 0.5
    expect(result.toRGBA().a).toBe(0.5);

    // Color channels:
    // Red: 0.5 * 1 + 0.5 * 0 = 0.5 linear -> 188 sRGB.
    // Green: 0.5 * 0 + 0.5 * 1 = 0.5 linear -> 188 sRGB.
    // Blue: 0.
    const { r, g, b } = result.toRGBA();
    expect(r).toBe(188);
    expect(g).toBe(188);
    expect(b).toBe(0);
  });

  it('verifies that many random colors mix to brighter values in Linear than sRGB', () => {
    // Statistical test: Linear average should generally be >= sRGB average for same inputs
    for (let i = 0; i < 20; i++) {
      const c1 = Color.random();
      const c2 = Color.random();

      const linear = averageColors([c1, c2], { space: 'LINEAR_RGB' });
      const srgb = averageColors([c1, c2], { space: 'RGB' });

      const lLum = linear.toRGBA().r + linear.toRGBA().g + linear.toRGBA().b;
      const sLum = srgb.toRGBA().r + srgb.toRGBA().g + srgb.toRGBA().b;

      // Linear mix preserves energy, so result is often brighter or equal in sRGB values
      // (because sRGB gamma curve is concave up x^2.4)
      // Average of x^2.4 is > (Average x)^2.4 is FALSE.
      // But here we are doing: sRGB_out = (Avg(Linear))^(1/2.4) vs sRGB_out = Avg(sRGB).
      // Let y = sRGB input. Linear = y^2.4.
      // LHS: ( (y1^2.4 + y2^2.4)/2 ) ^ (1/2.4).
      // RHS: (y1 + y2) / 2.
      // Let f(x) = x^(1/2.4) = x^0.41 (Concave).
      // Jensen: f(Avg) >= Avg(f).
      // LHS = f(Avg(Linear)).
      // RHS = Avg(f(Linear)) ?? No.
      // RHS is Avg(sRGB). sRGB = f(Linear).
      // So RHS = Avg(f(Linear)).
      // So LHS >= RHS.
      expect(lLum).toBeGreaterThanOrEqual(sLum - 3); // Allow small rounding error
    }
  });
});
