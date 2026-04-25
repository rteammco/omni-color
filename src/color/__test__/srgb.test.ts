import { linearChannelToSrgb, srgbChannelToLinear } from '../srgb';

describe('srgbChannelToLinear', () => {
  it('converts canonical boundary values for SRGB and WCAG pivots', () => {
    expect(srgbChannelToLinear(0, 'SRGB')).toBe(0);
    expect(srgbChannelToLinear(255, 'SRGB')).toBe(1);
    expect(srgbChannelToLinear(0, 'WCAG')).toBe(0);
    expect(srgbChannelToLinear(255, 'WCAG')).toBe(1);

    expect(srgbChannelToLinear(10.31475, 'SRGB')).toBeCloseTo(0.0031308, 6);
    expect(srgbChannelToLinear(10.0164, 'WCAG')).toBeCloseTo(0.003041, 5);
  });

  it('clamps out-of-range channel values', () => {
    expect(srgbChannelToLinear(-10, 'SRGB')).toBe(0);
    expect(srgbChannelToLinear(300, 'SRGB')).toBe(1);
  });
});

describe('linearChannelToSrgb', () => {
  it('converts canonical boundary values for SRGB and WCAG pivots', () => {
    expect(linearChannelToSrgb(0, 'SRGB')).toBe(0);
    expect(linearChannelToSrgb(1, 'SRGB')).toBeCloseTo(255, 10);
    expect(linearChannelToSrgb(0, 'WCAG')).toBe(0);
    expect(linearChannelToSrgb(1, 'WCAG')).toBeCloseTo(255, 10);

    expect(linearChannelToSrgb(0.0031308, 'SRGB')).toBeCloseTo(10.31475, 4);
    expect(linearChannelToSrgb(0.003041, 'WCAG')).toBeCloseTo(10.02137, 5);
  });

  it('clamps out-of-range linear values', () => {
    expect(linearChannelToSrgb(-1, 'WCAG')).toBe(0);
    expect(linearChannelToSrgb(2, 'WCAG')).toBeCloseTo(255, 10);
  });
});

describe('sRGB transfer round-trip behavior', () => {
  it('round-trips representative values within floating-point tolerance', () => {
    const channel0 = linearChannelToSrgb(srgbChannelToLinear(0, 'SRGB'), 'SRGB');
    const channel1 = linearChannelToSrgb(srgbChannelToLinear(64, 'SRGB'), 'SRGB');
    const channel2 = linearChannelToSrgb(srgbChannelToLinear(127.5, 'SRGB'), 'SRGB');
    const channel3 = linearChannelToSrgb(srgbChannelToLinear(200, 'SRGB'), 'SRGB');
    const channel4 = linearChannelToSrgb(srgbChannelToLinear(255, 'SRGB'), 'SRGB');

    expect(channel0).toBeCloseTo(0, 10);
    expect(channel1).toBeCloseTo(64, 10);
    expect(channel2).toBeCloseTo(127.5, 10);
    expect(channel3).toBeCloseTo(200, 10);
    expect(channel4).toBeCloseTo(255, 10);
  });
});
