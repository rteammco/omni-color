import { Color } from '../color';
import { createColorGradient } from '../gradients';

describe('createColorGradient', () => {
  it('builds linear RGB gradients with evenly spaced stops', () => {
    const gradient = Color.createInterpolatedGradient(['#ff0000', '#0000ff'], {
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
    const gradient = Color.createInterpolatedGradient(['#000000', '#ffffff']);

    expect(gradient).toHaveLength(5);
    expect(gradient[0].toHex()).toBe('#000000');
    expect(gradient[4].toHex()).toBe('#ffffff');
  });

  it('rounds non-integer stop counts and enforces a minimum of two anchors', () => {
    const twoStopGradient = Color.createInterpolatedGradient(['#000000', '#ffffff'], {
      stops: 1.7,
    });
    expect(twoStopGradient).toHaveLength(2);
    expect(twoStopGradient[0].toHex()).toBe('#000000');
    expect(twoStopGradient[1].toHex()).toBe('#ffffff');
  });

  it('supports bezier interpolation with easing while preserving anchors', () => {
    const anchors = ['#f43f5e', '#fbbf24', '#22d3ee'];
    const gradient = Color.createInterpolatedGradient(anchors, {
      stops: 4,
      interpolation: 'BEZIER',
      space: 'HSL',
      easing: 'EASE_IN_OUT',
    });

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
    const gradient = Color.createInterpolatedGradient(
      [
        { h: 350, s: 100, l: 50 },
        { h: 10, s: 100, l: 50 },
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
    const gradient = Color.createInterpolatedGradient(['rgba(255,0,0,0.2)', 'rgba(0,0,255,0.8)'], {
      stops: 3,
      space: 'RGB',
    });

    expect(gradient[0].toRGBA()).toEqual({ r: 255, g: 0, b: 0, a: 0.2 });
    expect(gradient[1].toRGBA()).toEqual({ r: 128, g: 0, b: 128, a: 0.5 });
    expect(gradient[2].toRGBA()).toEqual({ r: 0, g: 0, b: 255, a: 0.8 });
  });

  it('clamps eased stops inside OKLCH and LCH gamuts', () => {
    const oklchGradient = Color.createInterpolatedGradient(['#111111', '#eeeeee'], {
      stops: 3,
      space: 'OKLCH',
      easing: (t: number) => 1.2 * t - 0.1,
    });
    const lchGradient = Color.createInterpolatedGradient(['#2d2c7a', '#f4f0ff'], {
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
    expect(() => Color.createInterpolatedGradient(['#ff0000'], { stops: 2 })).toThrow(
      'at least two colors are required to build a gradient'
    );
  });

  it('returns Color instances when using the standalone helper', () => {
    const gradient = createColorGradient([new Color('#000000'), new Color('#ffffff')], {
      stops: 3,
      space: 'RGB',
    });

    expect(gradient).toHaveLength(3);
    expect(gradient.every((stop) => stop instanceof Color)).toBe(true);
    expect(gradient.map((stop) => stop.toRGBA())).toEqual([
      { r: 0, g: 0, b: 0, a: 1 },
      { r: 128, g: 128, b: 128, a: 1 },
      { r: 255, g: 255, b: 255, a: 1 },
    ]);
  });
});

describe('Color gradient helpers', () => {
  it('maintains anchors when easing between multiple colors', () => {
    const anchors = ['#ff0000', '#00ff00', '#0000ff'];
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
