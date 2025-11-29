import { Color } from '../color';
import { createColorGradient } from '../gradients';

describe('createColorGradient', () => {
  it('builds linear RGB gradients with evenly spaced stops', () => {
    const gradient = createColorGradient([new Color('#ff0000'), new Color('#0000ff')], {
      stops: 5,
      space: 'RGB',
    });

    expect(gradient.map((color) => color.toHex())).toEqual([
      '#ff0000',
      '#bf0040',
      '#800080',
      '#4000bf',
      '#0000ff',
    ]);
  });

  it('defaults to 5 evenly spaced gradient stops', () => {
    const gradient = createColorGradient([new Color('#000000'), new Color('#ffffff')]);

    expect(gradient).toHaveLength(5);
    expect(gradient[0].toHex()).toBe('#000000');
    expect(gradient[4].toHex()).toBe('#ffffff');
  });

  it('rounds non-integer stop counts and enforces a minimum of two anchors', () => {
    const twoStopGradient = createColorGradient([new Color('#000000'), new Color('#ffffff')], {
      stops: 1.7,
    });
    expect(twoStopGradient).toHaveLength(2);
    expect(twoStopGradient[0].toHex()).toBe('#000000');
    expect(twoStopGradient[1].toHex()).toBe('#ffffff');
  });

  it('supports bezier interpolation with easing while preserving anchors', () => {
    const anchors = [new Color('#f43f5e'), new Color('#fbbf24'), new Color('#22d3ee')];
    const gradient = createColorGradient(anchors, {
      stops: 4,
      interpolation: 'BEZIER',
      space: 'HSL',
      easing: 'EASE_IN_OUT',
    });

    // Bezier curve in Polar space (hue unwound)
    expect(gradient.map((color) => color.toHex())).toEqual([
      '#f43e5c',
      '#f66e33',
      '#22f33f',
      '#20d3ee',
    ]);
    expect(gradient[0].toHex()).toBe('#f43e5c');
    expect(gradient[gradient.length - 1].toHex()).toBe('#20d3ee');
  });

  it('wraps hues smoothly across the 0°/360° boundary in polar spaces', () => {
    const gradient = createColorGradient(
      [
        new Color({ h: 350, s: 100, l: 50 }),
        new Color({ h: 10, s: 100, l: 50 }),
      ],
      { stops: 5, space: 'HSL' }
    );

    expect(gradient.map((color) => color.toHex())).toEqual([
      '#ff002b',
      '#ff0015',
      '#ff0000',
      '#ff1500',
      '#ff2a00',
    ]);
    expect(gradient[2].toHSL().h).toBeCloseTo(0, 1);
  });

  it('interpolates alpha alongside color channels', () => {
    const gradient = createColorGradient([new Color('rgba(255,0,0,0.2)'), new Color('rgba(0,0,255,0.8)')], {
      stops: 3,
      space: 'RGB',
    });

    expect(gradient[0].toRGBA()).toEqual({ r: 255, g: 0, b: 0, a: 0.2 });
    expect(gradient[1].toRGBA()).toEqual({ r: 128, g: 0, b: 128, a: 0.5 });
    expect(gradient[2].toRGBA()).toEqual({ r: 0, g: 0, b: 255, a: 0.8 });
  });

  it('clamps eased stops inside OKLCH and LCH gamuts', () => {
    const oklchGradient = createColorGradient([new Color('#111111'), new Color('#eeeeee')], {
      stops: 3,
      space: 'OKLCH',
      easing: (t: number) => 1.2 * t - 0.1,
    });
    const lchGradient = createColorGradient([new Color('#2d2c7a'), new Color('#f4f0ff')], {
      stops: 4,
      space: 'LCH',
      easing: 'EASE_OUT',
    });

    expect(oklchGradient[1].toOKLCH().c).toBeGreaterThanOrEqual(0);
    expect(oklchGradient[1].toOKLCH().c).toBeLessThanOrEqual(0.5);
    expect(lchGradient[1].toLCH().c).toBeLessThanOrEqual(150);
    expect(lchGradient[2].toLCH().l).toBeGreaterThanOrEqual(0);
    expect(lchGradient[2].toLCH().l).toBeLessThanOrEqual(100);
  });

  it('throws when fewer than two colors are provided', () => {
    expect(() => createColorGradient([new Color('#ff0000')], { stops: 2 })).toThrow(
      'at least two colors are required to build a gradient'
    );
  });
});

describe('Color gradient helpers', () => {
  it('maintains anchors when easing between multiple colors', () => {
    const anchors = [new Color('#ff0000'), new Color('#00ff00'), new Color('#0000ff')];
    const gradient = Color.createInterpolatedGradient(anchors, {
      stops: 5,
      easing: 'EASE_IN_OUT',
      space: 'RGB',
    });

    expect(gradient[0].toHex()).toBe('#ff0000');
    expect(gradient[2].toHex()).toBe('#00ff00');
    expect(gradient[4].toHex()).toBe('#0000ff');
  });
});

describe('Polar Hue Interpolation (createColorGradient)', () => {
  const red = new Color('hsl(0, 100%, 50%)');
  const blue = new Color('hsl(240, 100%, 50%)');
  const green = new Color('hsl(120, 100%, 50%)');

  it('reproduces current Cartesian desaturation behavior when explicitly requested', () => {
    const gradient = createColorGradient([red, blue], {
      stops: 3,
      space: 'HSL',
      hueInterpolationMode: 'Cartesian',
    });
    const mid = gradient[1];
    const hsl = mid.toHSL();

    // Cartesian interpolation between 0 and 240 results in hue 300, but saturation ~50%
    expect(hsl.h).toBeCloseTo(300, 0);
    expect(hsl.s).toBeCloseTo(50, 0);
  });

  it('defaults to Shortest Polar interpolation (preserving saturation)', () => {
    const gradient = createColorGradient([red, blue], {
      stops: 3,
      space: 'HSL',
      // No mode specified -> defaults to Shortest
    });
    const mid = gradient[1];
    const hsl = mid.toHSL();

    // Shortest path from 0 to 240 is via -60 (300) -> 240.
    // 0 -> 240 diff is 240 (>180). 240 - 360 = -120.
    // 0 -> -120. Midpoint -60 (300).
    // Wait, 0 to 240.
    // Shortest is 0 -> -120 -> 240? No.
    // 0 -> 240. Diff is 240.
    // 240 > 180. Adjusted End = 240 - 360 = -120.
    // Start 0. End -120.
    // Midpoint: -60. WrapHue(-60) = 300.
    // Magenta.
    expect(hsl.h).toBeCloseTo(300, 0);
    expect(hsl.s).toBeCloseTo(100, 0); // Preserved Saturation
  });

  it('supports Longest mode', () => {
    // Red (0) -> Blue (240).
    // Diff 240. Abs(240) > 180.
    // Longest mode condition: if (abs(diff) < 180).
    // So here it does nothing.
    // 0 -> 240. Midpoint 120. Green.
    const gradient = createColorGradient([red, blue], {
      stops: 3,
      space: 'HSL',
      hueInterpolationMode: 'Longest',
    });
    const mid = gradient[1];
    expect(mid.toHSL().h).toBeCloseTo(120, 0);
    expect(mid.toHSL().s).toBe(100);
  });

  it('supports Increasing mode (0 -> 240)', () => {
    // 0 -> 240. 240 > 0. Stays 240.
    // Midpoint 120.
    const gradient = createColorGradient([red, blue], {
      stops: 3,
      space: 'HSL',
      hueInterpolationMode: 'Increasing',
    });
    const mid = gradient[1];
    expect(mid.toHSL().h).toBeCloseTo(120, 0);
  });

  it('supports Increasing mode with wrap (350 -> 10)', () => {
    const start = new Color('hsl(350, 100%, 50%)');
    const end = new Color('hsl(10, 100%, 50%)');

    // 350 -> 10. 10 < 350. Add 360 -> 370.
    // 350 -> 370. Midpoint 360 (0).
    const gradient = createColorGradient([start, end], {
      stops: 3,
      space: 'HSL',
      hueInterpolationMode: 'Increasing',
    });
    const mid = gradient[1];
    expect(mid.toHSL().h).toBeCloseTo(0, 0);
  });

  it('supports Decreasing mode (0 -> 240)', () => {
    // 0 -> 240. 240 > 0. Sub 360 -> -120.
    // 0 -> -120. Mid -60 (300).
    const gradient = createColorGradient([red, blue], {
      stops: 3,
      space: 'HSL',
      hueInterpolationMode: 'Decreasing',
    });
    const mid = gradient[1];
    expect(mid.toHSL().h).toBeCloseTo(300, 0);
  });

  it('supports Decreasing mode with wrap (10 -> 350)', () => {
    const start = new Color('hsl(10, 100%, 50%)');
    const end = new Color('hsl(350, 100%, 50%)');

    // 10 -> 350. 350 > 10. Sub 360 -> -10.
    // 10 -> -10. Mid 0.
    const gradient = createColorGradient([start, end], {
      stops: 3,
      space: 'HSL',
      hueInterpolationMode: 'Decreasing',
    });
    const mid = gradient[1];
    expect(mid.toHSL().h).toBeCloseTo(0, 0);
  });

  it('supports Raw mode (350 -> 10)', () => {
    // 350 -> 10. Raw interpolation.
    // Midpoint (350+10)/2 = 180.
    const start = new Color('hsl(350, 100%, 50%)');
    const end = new Color('hsl(10, 100%, 50%)');
    const gradient = createColorGradient([start, end], {
      stops: 3,
      space: 'HSL',
      hueInterpolationMode: 'Raw',
    });
    const mid = gradient[1];
    expect(mid.toHSL().h).toBeCloseTo(180, 0);
  });

  it('handles ambiguous Shortest path (180 degree diff)', () => {
    // 0 -> 180. Diff 180.
    // Shortest logic: if (diff > 180) ... else if (diff < -180).
    // 180 is not > 180. So it stays 180.
    // 0 -> 180. Mid 90.
    const cyan = new Color('hsl(180, 100%, 50%)');
    const gradient = createColorGradient([red, cyan], {
      stops: 3,
      space: 'HSL',
      hueInterpolationMode: 'Shortest',
    });
    const mid = gradient[1];
    expect(mid.toHSL().h).toBeCloseTo(90, 0);
  });

  it('handles ambiguous Longest path (180 degree diff)', () => {
    // 0 -> 180. Diff 180.
    // Longest logic: if (abs(diff) < 180).
    // 180 is not < 180.
    // So it stays 180.
    // 0 -> 180. Mid 90.
    const cyan = new Color('hsl(180, 100%, 50%)');
    const gradient = createColorGradient([red, cyan], {
      stops: 3,
      space: 'HSL',
      hueInterpolationMode: 'Longest',
    });
    const mid = gradient[1];
    expect(mid.toHSL().h).toBeCloseTo(90, 0);
  });

  it('handles exact 0 degree difference', () => {
    const gradient = createColorGradient([red, red], {
      stops: 3,
      space: 'HSL',
      hueInterpolationMode: 'Shortest',
    });
    expect(gradient[1].toHSL().h).toBeCloseTo(0, 0);
  });

  it('works with OKLCH space (Default)', () => {
    // Red (#ff0000) -> Blue (#0000ff) in OKLCH.
    // Shortest path.
    const gradient = createColorGradient([new Color('#ff0000'), new Color('#0000ff')], {
      stops: 3,
      space: 'OKLCH',
    });
    const mid = gradient[1];
    // Check it's not gray.
    expect(mid.toOKLCH().c).toBeGreaterThan(0.1);
  });

  it('works with LCH space', () => {
    const gradient = createColorGradient([new Color('#ff0000'), new Color('#0000ff')], {
      stops: 3,
      space: 'LCH',
    });
    const mid = gradient[1];
    expect(mid.toLCH().c).toBeGreaterThan(10);
  });

  it('works with HSV space', () => {
    const gradient = createColorGradient([red, blue], {
      stops: 3,
      space: 'HSV',
    });
    const mid = gradient[1];
    expect(mid.toHSV().s).toBeCloseTo(100, 0);
  });

  it('ignores hueInterpolationMode in RGB space', () => {
    // RGB interpolation Red -> Blue is #800080 (Purple).
    // Even if we say 'Increasing' or 'Longest', RGB doesn't use hue.
    const gradient = createColorGradient([red, blue], {
      stops: 3,
      space: 'RGB',
      hueInterpolationMode: 'Longest', // Should be ignored
    });
    const mid = gradient[1];
    expect(mid.toHex()).toBe('#800080');
  });

  it('applies hue unwinding to multiple stops correctly', () => {
    // 0 -> 90 -> 180.
    // Shortest: 0->90 (diff 90), 90->180 (diff 90). No adjustments.
    const gradient = createColorGradient([red, green, blue], {
      stops: 5,
      space: 'HSL',
      hueInterpolationMode: 'Shortest',
    });
    // Stops: 0, 90, 180.
    // 5 stops: 0, 45, 90, 135 (approx), 180 (approx).
    // Wait, anchors are 0, 120 (Green), 240 (Blue).
    // 0 -> 120 (diff 120). 120 -> 240 (diff 120).
    // Result should be 0, 60, 120, 180, 240.
    // 0 (Red), 60 (Yellow), 120 (Green), 180 (Cyan), 240 (Blue).

    expect(gradient[1].toHSL().h).toBeCloseTo(60, 1);
    expect(gradient[3].toHSL().h).toBeCloseTo(180, 1);
  });

  it('handles zig-zag hues with Shortest', () => {
    // 0 -> 10 -> 350.
    // 0 -> 10.
    // 10 -> 350. Diff 340. Shortest: 10 -> -10.
    const start = new Color('hsl(0, 100%, 50%)');
    const mid = new Color('hsl(10, 100%, 50%)');
    const end = new Color('hsl(350, 100%, 50%)');

    const gradient = createColorGradient([start, mid, end], {
      stops: 5, // 0, 5, 10, 0, -10 (350).
      space: 'HSL',
      hueInterpolationMode: 'Shortest',
    });
    // Segment 1: 0 -> 10. 3 stops. 0, 5, 10.
    // Segment 2: 10 -> 350 (adj -10). 3 stops. 10, 0, -10.
    // Total 5 stops.
    // 0: 0
    // 1: 5 (mid of seg 1)
    // 2: 10 (anchor)
    // 3: 0 (mid of seg 2)
    // 4: 350 (anchor)

    expect(gradient[1].toHSL().h).toBeCloseTo(5, 1);
    expect(gradient[3].toHSL().h).toBeCloseTo(0, 1);
  });

  it('works with clamping disabled', () => {
     // Red -> Blue via Longest (0 -> 120 -> 240).
     // Mid is 120.
     const gradient = createColorGradient([red, blue], {
       stops: 3,
       space: 'HSL',
       hueInterpolationMode: 'Longest',
       clamp: false,
     });
     expect(gradient[1].toHSL().h).toBeCloseTo(120, 0);
  });

  it('works with Bezier interpolation and Shortest mode', () => {
    // 0 -> 120 -> 240.
    // Shortest unwinds to: 0 -> 120 -> 240.
    // Bezier curve through these points.
    // t=0.5. Bezier(0, 120, 240) at 0.5.
    // L1 = lerp(0, 120, 0.5) = 60.
    // L2 = lerp(120, 240, 0.5) = 180.
    // L3 = lerp(60, 180, 0.5) = 120.
    // Should be Green.
    const gradient = createColorGradient([red, green, blue], {
      stops: 3,
      space: 'HSL',
      interpolation: 'BEZIER',
    });
    // Bezier with 3 anchors -> 0 -> 120.
    // stops=3. 0, 0.5, 1.
    expect(gradient[1].toHSL().h).toBeCloseTo(120, 1);
  });
});
