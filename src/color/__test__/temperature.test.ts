import { Color } from '../color';
import { matchPartialColorTemperatureLabel } from '../temperature';

describe('getTemperature', () => {
  it('estimates temperature for a near-incandescent warm color', () => {
    // Approximation based on incandescent lamp values (~2700–3000 K)
    // from https://en.wikipedia.org/wiki/Color_temperature
    const color = new Color('#ffa757');
    const result = color.getTemperature();
    expect(result.label).toBe('Incandescent lamp');
    expect(result.temperature).toBeGreaterThan(2200);
    expect(result.temperature).toBeLessThan(3200);
  });

  it('classifies grayscale and primary/secondary colors', () => {
    let result = new Color('#000000').getTemperature();
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(0);

    result = new Color('#ffffff').getTemperature();
    expect(result.label).toBe('Cloudy sky');
    expect(result.temperature).toBe(6504);

    result = new Color('#808080').getTemperature();
    expect(result.label).toBe('Cloudy sky');
    expect(result.temperature).toBe(6504);

    result = new Color('#c0c0c0').getTemperature();
    expect(result.label).toBe('Cloudy sky');
    expect(result.temperature).toBe(6504);

    result = new Color('#404040').getTemperature();
    expect(result.label).toBe('Cloudy sky');
    expect(result.temperature).toBe(6504);

    result = new Color('#ff0000').getTemperature();
    expect(result.label).toBe('Incandescent lamp');
    expect(result.temperature).toBe(2655);

    result = new Color('#00ff00').getTemperature();
    expect(result.label).toBe('Daylight');
    expect(result.temperature).toBe(6069);

    result = new Color('#0000ff').getTemperature();
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1667);

    result = new Color('#ffff00').getTemperature();
    expect(result.label).toBe('Halogen lamp');
    expect(result.temperature).toBe(3909);

    result = new Color('#00ffff').getTemperature();
    expect(result.label).toBe('Blue sky');
    expect(result.temperature).toBe(12822);

    result = new Color('#ff00ff').getTemperature();
    expect(result.label).toBe('Halogen lamp');
    expect(result.temperature).toBe(3544);
  });

  it('classifies a full spectrum of intermediate hues', () => {
    let result = new Color('#ff4000').getTemperature();
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1856);

    result = new Color('#ff8000').getTemperature();
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1829);

    result = new Color('#ffbf00').getTemperature();
    expect(result.label).toBe('Incandescent lamp');
    expect(result.temperature).toBe(2897);

    result = new Color('#bfff00').getTemperature();
    expect(result.label).toBe('Fluorescent lamp');
    expect(result.temperature).toBe(4749);

    result = new Color('#80ff00').getTemperature();
    expect(result.label).toBe('Daylight');
    expect(result.temperature).toBe(5458);

    result = new Color('#40ff00').getTemperature();
    expect(result.label).toBe('Daylight');
    expect(result.temperature).toBe(5914);

    result = new Color('#00ff40').getTemperature();
    expect(result.label).toBe('Daylight');
    expect(result.temperature).toBe(6250);

    result = new Color('#00ff80').getTemperature();
    expect(result.label).toBe('Cloudy sky');
    expect(result.temperature).toBe(6908);

    result = new Color('#00ffbf').getTemperature();
    expect(result.label).toBe('Shade');
    expect(result.temperature).toBe(8521);

    result = new Color('#00bfff').getTemperature();
    expect(result.label).toBe('Blue sky');
    expect(result.temperature).toBe(44005);

    result = new Color('#0080ff').getTemperature();
    expect(result.label).toBe('Incandescent lamp');
    expect(result.temperature).toBe(2999);

    result = new Color('#0040ff').getTemperature();
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1972);

    result = new Color('#4000ff').getTemperature();
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1655);

    result = new Color('#8000ff').getTemperature();
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1627);

    result = new Color('#bf00ff').getTemperature();
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1668);

    result = new Color('#ff00bf').getTemperature();
    expect(result.label).toBe('Candlelight');
    // Previously this case produced a negative temperature due to an out-of-gamut
    // chromaticity calculation. It should now be clamped to 0 K.
    expect(result.temperature).toBe(0);

    result = new Color('#ff0080').getTemperature();
    expect(result.label).toBe('Halogen lamp');
    expect(result.temperature).toBe(3505);

    result = new Color('#ff0040').getTemperature();
    expect(result.label).toBe('Incandescent lamp');
    expect(result.temperature).toBe(2789);
  });
});

describe('getTemperatureAsString', () => {
  it('includes label for colors near temperature reference colors', () => {
    expect(new Color('#ffffff').getTemperatureAsString({})).toBe('6504 K (cloudy sky)');
    expect(new Color('#c0c0c0').getTemperatureAsString({})).toBe('6504 K (cloudy sky)');
    expect(new Color('#ff8400').getTemperatureAsString({})).toBe('1881 K (candlelight)');
    expect(new Color('#ffa757').getTemperatureAsString({})).toBe('2583 K (incandescent lamp)');
    expect(new Color('#ffbb81').getTemperatureAsString({})).toBe('3198 K (halogen lamp)');
    expect(new Color('#ffd3af').getTemperatureAsString({})).toBe('4142 K (fluorescent lamp)');
    expect(new Color('#fff6ed').getTemperatureAsString({})).toBe('5889 K (daylight)');
    expect(new Color('#f3f2ff').getTemperatureAsString({})).toBe('7049 K (cloudy sky)');
    expect(new Color('#dde6ff').getTemperatureAsString({})).toBe('8309 K (shade)');
    expect(new Color('#cadaff').getTemperatureAsString({})).toBe('10026 K (blue sky)');
  });

  it('omits label for saturated or unrelated colors', () => {
    expect(new Color('#ff0000').getTemperatureAsString({})).toBe('2655 K');
    expect(new Color('#0000ff').getTemperatureAsString({})).toBe('1667 K');
    expect(new Color('#00ff00').getTemperatureAsString({})).toBe('6069 K');
    expect(new Color('#00ffff').getTemperatureAsString({})).toBe('12822 K');
    expect(new Color('#ff00ff').getTemperatureAsString({})).toBe('3544 K');
    expect(new Color('#ffff00').getTemperatureAsString({})).toBe('3909 K');
    expect(new Color('#808080').getTemperatureAsString({})).toBe('6504 K');
    expect(new Color('#404040').getTemperatureAsString({})).toBe('6504 K');
    expect(new Color('#000000').getTemperatureAsString({})).toBe('0 K');
    expect(new Color('#ff00bf').getTemperatureAsString({})).toBe('0 K');
    expect(new Color('#00bfff').getTemperatureAsString({})).toBe('44005 K');
  });

  it('formats numbers when requested', () => {
    expect(Color.fromTemperature('Cloudy sky').getTemperatureAsString({ formatNumber: true })).toBe(
      '7,049 K (cloudy sky)',
    );
    expect(new Color('#ff0000').getTemperatureAsString({ formatNumber: true })).toBe('2,655 K');
  });
});

describe('Color.fromTemperature', () => {
  it('returns the expected color for temperatures across all ranges', () => {
    expect(Color.fromTemperature(1500).toHex()).toBe('#ff6c00');
    expect(Color.fromTemperature(1999).toHex()).toBe('#ff890e');
    expect(Color.fromTemperature(2000).toHex()).toBe('#ff890e');
    expect(Color.fromTemperature(2500).toHex()).toBe('#ff9f46');
    expect(Color.fromTemperature(3000).toHex()).toBe('#ffb16e');
    expect(Color.fromTemperature(3500).toHex()).toBe('#ffc18d');
    expect(Color.fromTemperature(4000).toHex()).toBe('#ffcea6');
    expect(Color.fromTemperature(4500).toHex()).toBe('#ffdabb');
    expect(Color.fromTemperature(5000).toHex()).toBe('#ffe4ce');
    expect(Color.fromTemperature(6499).toHex()).toBe('#fffefa');
    expect(Color.fromTemperature(6500).toHex()).toBe('#fffefa');
    expect(Color.fromTemperature(7499).toHex()).toBe('#e6ebff');
    expect(Color.fromTemperature(7500).toHex()).toBe('#e6ebff');
    expect(Color.fromTemperature(8999).toHex()).toBe('#d2dfff');
    expect(Color.fromTemperature(9000).toHex()).toBe('#d2dfff');
    expect(Color.fromTemperature(20000).toHex()).toBe('#abc6ff');
  });
});

describe('Color.fromTemperature (Label)', () => {
  it('returns the expected color for each label', () => {
    let color = Color.fromTemperature('Candlelight');
    expect(color.toHex()).toBe('#ff8400');

    color = Color.fromTemperature('Incandescent lamp');
    expect(color.toHex()).toBe('#ffa757');

    color = Color.fromTemperature('Halogen lamp');
    expect(color.toHex()).toBe('#ffbb81');

    color = Color.fromTemperature('Fluorescent lamp');
    expect(color.toHex()).toBe('#ffd3af');

    color = Color.fromTemperature('Daylight');
    expect(color.toHex()).toBe('#fff6ed');

    color = Color.fromTemperature('Cloudy sky');
    expect(color.toHex()).toBe('#f3f2ff');

    color = Color.fromTemperature('Shade');
    expect(color.toHex()).toBe('#dde6ff');

    color = Color.fromTemperature('Blue sky');
    expect(color.toHex()).toBe('#cadaff');
  });

  it('round-trips through getTemperature', () => {
    let color = Color.fromTemperature('Candlelight');
    expect(color.getTemperature().label).toBe('Candlelight');

    color = Color.fromTemperature('Incandescent lamp');
    expect(color.getTemperature().label).toBe('Incandescent lamp');

    color = Color.fromTemperature('Halogen lamp');
    expect(color.getTemperature().label).toBe('Halogen lamp');

    color = Color.fromTemperature('Fluorescent lamp');
    expect(color.getTemperature().label).toBe('Fluorescent lamp');

    color = Color.fromTemperature('Daylight');
    expect(color.getTemperature().label).toBe('Daylight');

    color = Color.fromTemperature('Cloudy sky');
    expect(color.getTemperature().label).toBe('Cloudy sky');

    color = Color.fromTemperature('Shade');
    expect(color.getTemperature().label).toBe('Shade');

    color = Color.fromTemperature('Blue sky');
    expect(color.getTemperature().label).toBe('Blue sky');
  });

  it('accepts mixed case temperature label', () => {
    const t1 = Color.fromTemperature('Cloudy sky');
    const t2 = Color.fromTemperature('cloudy sky');
    const t3 = Color.fromTemperature('CLOUDY SKY');

    expect(t1.toHex()).toBe(t2.toHex());
    expect(t1.toHex()).toBe(t3.toHex());
  });
});

describe('matchPartialColorTemperatureLabel', () => {
  it('matches full labels and first words case-insensitively', () => {
    expect(matchPartialColorTemperatureLabel('candlelight')).toBe('Candlelight');
    expect(matchPartialColorTemperatureLabel('incandescent')).toBe('Incandescent lamp');
    expect(matchPartialColorTemperatureLabel(' Incandescent lamp ')).toBe('Incandescent lamp');
    expect(matchPartialColorTemperatureLabel('halogen')).toBe('Halogen lamp');
    expect(matchPartialColorTemperatureLabel('fluorescent')).toBe('Fluorescent lamp');
    expect(matchPartialColorTemperatureLabel('daylight')).toBe('Daylight');
    expect(matchPartialColorTemperatureLabel('cloudy')).toBe('Cloudy sky');
    expect(matchPartialColorTemperatureLabel('cloudy sky')).toBe('Cloudy sky');
    expect(matchPartialColorTemperatureLabel('shade')).toBe('Shade');
    expect(matchPartialColorTemperatureLabel('blue')).toBe('Blue sky');
    expect(matchPartialColorTemperatureLabel('Blue Sky')).toBe('Blue sky');
  });

  it('returns null when no label matches', () => {
    expect(matchPartialColorTemperatureLabel('nope')).toBeNull();
    expect(matchPartialColorTemperatureLabel('lamp')).toBeNull();
  });
});
