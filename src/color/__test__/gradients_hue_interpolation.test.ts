import { Color } from '../color';

describe('Gradients Hue Interpolation', () => {
  const red = new Color('hsl(0, 100%, 50%)');
  const blue = new Color('hsl(240, 100%, 50%)');

  it('reproduces current Cartesian desaturation behavior when explicitly requested', () => {
    // Legacy behavior is now opt-in via 'Cartesian'
    const gradient = Color.createInterpolatedGradient([red, blue], {
      stops: 3,
      space: 'HSL',
      hueInterpolationMode: 'Cartesian',
    });
    const mid = gradient[1];
    const hsl = mid.toHSL();

    // Cartesian interpolation between 0 and 240 results in hue 300, but saturation ~50%
    expect(hsl.h).toBeCloseTo(300, 0);
    expect(hsl.s).toBeCloseTo(50, 0); // Desaturated
  });

  it('defaults to Shortest Polar interpolation (preserving saturation)', () => {
    const gradient = Color.createInterpolatedGradient([red, blue], {
      stops: 3,
      space: 'HSL',
      // No mode specified -> defaults to Shortest
    });
    const mid = gradient[1];
    const hsl = mid.toHSL();

    expect(hsl.h).toBeCloseTo(300, 0); // Still 300 (Magenta)
    expect(hsl.s).toBeCloseTo(100, 0); // Preserved Saturation
  });

  it('supports Longest mode', () => {
    // Red (0) -> Blue (240). Longest path is 0 -> 120 -> 240.
    // Midpoint should be 120 (Green).
    const gradient = Color.createInterpolatedGradient([red, blue], {
      stops: 3,
      space: 'HSL',
      hueInterpolationMode: 'Longest',
    });
    const mid = gradient[1];
    expect(mid.toHSL().h).toBeCloseTo(120, 0);
    expect(mid.toHSL().s).toBe(100);
  });

  it('supports Increasing mode', () => {
    // Red (0) -> Blue (240). Increasing: 0...240. Mid 120.
    const gradient = Color.createInterpolatedGradient([red, blue], {
      stops: 3,
      space: 'HSL',
      hueInterpolationMode: 'Increasing',
    });
    const mid = gradient[1];
    expect(mid.toHSL().h).toBeCloseTo(120, 0);
  });

  it('supports Decreasing mode', () => {
    // Red (0) -> Blue (240). Decreasing: 0 (360) ... 240. Mid 300.
    const gradient = Color.createInterpolatedGradient([red, blue], {
      stops: 3,
      space: 'HSL',
      hueInterpolationMode: 'Decreasing',
    });
    const mid = gradient[1];
    expect(mid.toHSL().h).toBeCloseTo(300, 0);
  });

  it('supports Raw mode', () => {
    // Red (0) -> Cyan (180).
    // Raw: 0 -> 180. Mid 90.
    // If we use 350 -> 10. Raw: 350 -> 180 -> 10. Mid 180.
    const start = new Color('hsl(350, 100%, 50%)');
    const end = new Color('hsl(10, 100%, 50%)');
    const gradient = Color.createInterpolatedGradient([start, end], {
      stops: 3,
      space: 'HSL',
      hueInterpolationMode: 'Raw',
    });
    const mid = gradient[1];
    expect(mid.toHSL().h).toBeCloseTo(180, 0); // Interpolates 350 -> 10 linearly (downwards)
    // Wait, 350 -> 10.
    // Raw means values: [350, s, l] -> [10, s, l].
    // 350 + (10 - 350) * 0.5 = 350 + (-340) * 0.5 = 350 - 170 = 180.
    // Correct.
  });
});
