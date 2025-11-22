import { Color } from '../color';
import {
  getColorFromTemperature,
  getColorFromTemperatureLabel,
  getColorTemperature,
  getColorTemperatureString,
  matchPartialColorTemperatureLabel,
} from '../temperature';

describe('getColorTemperature', () => {
  it('estimates temperature for a near-incandescent warm color', () => {
    // Approximation based on incandescent lamp values (~2700–3000 K)
    // from https://en.wikipedia.org/wiki/Color_temperature
    const color = new Color('#ffa757');
    const result = getColorTemperature(color);
    expect(result.label).toBe('Incandescent lamp');
    expect(result.temperature).toBeGreaterThan(2200);
    expect(result.temperature).toBeLessThan(3200);
  });

  it('classifies grayscale and primary/secondary colors', () => {
    let result = getColorTemperature(new Color('#000000'));
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(0);

    result = getColorTemperature(new Color('#ffffff'));
    expect(result.label).toBe('Cloudy sky');
    expect(result.temperature).toBe(6504);

    result = getColorTemperature(new Color('#808080'));
    expect(result.label).toBe('Cloudy sky');
    expect(result.temperature).toBe(6504);

    result = getColorTemperature(new Color('#c0c0c0'));
    expect(result.label).toBe('Cloudy sky');
    expect(result.temperature).toBe(6504);

    result = getColorTemperature(new Color('#404040'));
    expect(result.label).toBe('Cloudy sky');
    expect(result.temperature).toBe(6504);

    result = getColorTemperature(new Color('#ff0000'));
    expect(result.label).toBe('Incandescent lamp');
    expect(result.temperature).toBe(2655);

    result = getColorTemperature(new Color('#00ff00'));
    expect(result.label).toBe('Daylight');
    expect(result.temperature).toBe(6069);

    result = getColorTemperature(new Color('#0000ff'));
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1667);

    result = getColorTemperature(new Color('#ffff00'));
    expect(result.label).toBe('Halogen lamp');
    expect(result.temperature).toBe(3909);

    result = getColorTemperature(new Color('#00ffff'));
    expect(result.label).toBe('Blue sky');
    expect(result.temperature).toBe(12822);

    result = getColorTemperature(new Color('#ff00ff'));
    expect(result.label).toBe('Halogen lamp');
    expect(result.temperature).toBe(3544);
  });

  it('classifies a full spectrum of intermediate hues', () => {
    let result = getColorTemperature(new Color('#ff4000'));
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1856);

    result = getColorTemperature(new Color('#ff8000'));
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1829);

    result = getColorTemperature(new Color('#ffbf00'));
    expect(result.label).toBe('Incandescent lamp');
    expect(result.temperature).toBe(2897);

    result = getColorTemperature(new Color('#bfff00'));
    expect(result.label).toBe('Fluorescent lamp');
    expect(result.temperature).toBe(4749);

    result = getColorTemperature(new Color('#80ff00'));
    expect(result.label).toBe('Daylight');
    expect(result.temperature).toBe(5458);

    result = getColorTemperature(new Color('#40ff00'));
    expect(result.label).toBe('Daylight');
    expect(result.temperature).toBe(5914);

    result = getColorTemperature(new Color('#00ff40'));
    expect(result.label).toBe('Daylight');
    expect(result.temperature).toBe(6250);

    result = getColorTemperature(new Color('#00ff80'));
    expect(result.label).toBe('Cloudy sky');
    expect(result.temperature).toBe(6908);

    result = getColorTemperature(new Color('#00ffbf'));
    expect(result.label).toBe('Shade');
    expect(result.temperature).toBe(8521);

    result = getColorTemperature(new Color('#00bfff'));
    expect(result.label).toBe('Blue sky');
    expect(result.temperature).toBe(44005);

    result = getColorTemperature(new Color('#0080ff'));
    expect(result.label).toBe('Incandescent lamp');
    expect(result.temperature).toBe(2999);

    result = getColorTemperature(new Color('#0040ff'));
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1972);

    result = getColorTemperature(new Color('#4000ff'));
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1655);

    result = getColorTemperature(new Color('#8000ff'));
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1627);

    result = getColorTemperature(new Color('#bf00ff'));
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1668);

    result = getColorTemperature(new Color('#ff00bf'));
    expect(result.label).toBe('Candlelight');
    // Previously this case produced a negative temperature due to an out-of-gamut
    // chromaticity calculation. It should now be clamped to 0 K.
    expect(result.temperature).toBe(0);

    result = getColorTemperature(new Color('#ff0080'));
    expect(result.label).toBe('Halogen lamp');
    expect(result.temperature).toBe(3505);

    result = getColorTemperature(new Color('#ff0040'));
    expect(result.label).toBe('Incandescent lamp');
    expect(result.temperature).toBe(2789);
  });
});

describe('getColorTemperatureString', () => {
  it('includes label for colors near temperature reference colors', () => {
    expect(getColorTemperatureString(new Color('#ffffff'))).toBe('6504 K (cloudy sky)');
    expect(getColorTemperatureString(new Color('#c0c0c0'))).toBe('6504 K (cloudy sky)');
    expect(getColorTemperatureString(new Color('#ff8400'))).toBe('1881 K (candlelight)');
    expect(getColorTemperatureString(new Color('#ffa757'))).toBe('2583 K (incandescent lamp)');
    expect(getColorTemperatureString(new Color('#ffbb81'))).toBe('3198 K (halogen lamp)');
    expect(getColorTemperatureString(new Color('#ffd3af'))).toBe('4142 K (fluorescent lamp)');
    expect(getColorTemperatureString(new Color('#fff6ed'))).toBe('5889 K (daylight)');
    expect(getColorTemperatureString(new Color('#f3f2ff'))).toBe('7049 K (cloudy sky)');
    expect(getColorTemperatureString(new Color('#dde6ff'))).toBe('8309 K (shade)');
    expect(getColorTemperatureString(new Color('#cadaff'))).toBe('10026 K (blue sky)');
  });

  it('omits label for saturated or unrelated colors', () => {
    expect(getColorTemperatureString(new Color('#ff0000'))).toBe('2655 K');
    expect(getColorTemperatureString(new Color('#0000ff'))).toBe('1667 K');
    expect(getColorTemperatureString(new Color('#00ff00'))).toBe('6069 K');
    expect(getColorTemperatureString(new Color('#00ffff'))).toBe('12822 K');
    expect(getColorTemperatureString(new Color('#ff00ff'))).toBe('3544 K');
    expect(getColorTemperatureString(new Color('#ffff00'))).toBe('3909 K');
    expect(getColorTemperatureString(new Color('#808080'))).toBe('6504 K');
    expect(getColorTemperatureString(new Color('#404040'))).toBe('6504 K');
    expect(getColorTemperatureString(new Color('#000000'))).toBe('0 K');
    expect(getColorTemperatureString(new Color('#ff00bf'))).toBe('0 K');
    expect(getColorTemperatureString(new Color('#00bfff'))).toBe('44005 K');
  });

  it('formats numbers when requested', () => {
    expect(
      getColorTemperatureString(getColorFromTemperatureLabel('Cloudy sky'), {
        formatNumber: true,
      })
    ).toBe('7,049 K (cloudy sky)');
    expect(getColorTemperatureString(new Color('#ff0000'), { formatNumber: true })).toBe('2,655 K');
  });
});

describe('getColorFromTemperature', () => {
  it('returns the expected color for temperatures across all ranges', () => {
    expect(getColorFromTemperature(1500).toHex()).toBe('#ff6c00');
    expect(getColorFromTemperature(1999).toHex()).toBe('#ff890e');
    expect(getColorFromTemperature(2000).toHex()).toBe('#ff890e');
    expect(getColorFromTemperature(2500).toHex()).toBe('#ff9f46');
    expect(getColorFromTemperature(3000).toHex()).toBe('#ffb16e');
    expect(getColorFromTemperature(3500).toHex()).toBe('#ffc18d');
    expect(getColorFromTemperature(4000).toHex()).toBe('#ffcea6');
    expect(getColorFromTemperature(4500).toHex()).toBe('#ffdabb');
    expect(getColorFromTemperature(5000).toHex()).toBe('#ffe4ce');
    expect(getColorFromTemperature(6499).toHex()).toBe('#fffefa');
    expect(getColorFromTemperature(6500).toHex()).toBe('#fffefa');
    expect(getColorFromTemperature(7499).toHex()).toBe('#e6ebff');
    expect(getColorFromTemperature(7500).toHex()).toBe('#e6ebff');
    expect(getColorFromTemperature(8999).toHex()).toBe('#d2dfff');
    expect(getColorFromTemperature(9000).toHex()).toBe('#d2dfff');
    expect(getColorFromTemperature(20000).toHex()).toBe('#abc6ff');
  });
});

describe('getColorFromTemperatureLabel', () => {
  it('returns the expected color for each label', () => {
    let color = getColorFromTemperatureLabel('Candlelight');
    expect(color.toHex()).toBe('#ff8400');

    color = getColorFromTemperatureLabel('Incandescent lamp');
    expect(color.toHex()).toBe('#ffa757');

    color = getColorFromTemperatureLabel('Halogen lamp');
    expect(color.toHex()).toBe('#ffbb81');

    color = getColorFromTemperatureLabel('Fluorescent lamp');
    expect(color.toHex()).toBe('#ffd3af');

    color = getColorFromTemperatureLabel('Daylight');
    expect(color.toHex()).toBe('#fff6ed');

    color = getColorFromTemperatureLabel('Cloudy sky');
    expect(color.toHex()).toBe('#f3f2ff');

    color = getColorFromTemperatureLabel('Shade');
    expect(color.toHex()).toBe('#dde6ff');

    color = getColorFromTemperatureLabel('Blue sky');
    expect(color.toHex()).toBe('#cadaff');
  });

  it('round-trips through getColorTemperature', () => {
    let color = getColorFromTemperatureLabel('Candlelight');
    expect(getColorTemperature(color).label).toBe('Candlelight');

    color = getColorFromTemperatureLabel('Incandescent lamp');
    expect(getColorTemperature(color).label).toBe('Incandescent lamp');

    color = getColorFromTemperatureLabel('Halogen lamp');
    expect(getColorTemperature(color).label).toBe('Halogen lamp');

    color = getColorFromTemperatureLabel('Fluorescent lamp');
    expect(getColorTemperature(color).label).toBe('Fluorescent lamp');

    color = getColorFromTemperatureLabel('Daylight');
    expect(getColorTemperature(color).label).toBe('Daylight');

    color = getColorFromTemperatureLabel('Cloudy sky');
    expect(getColorTemperature(color).label).toBe('Cloudy sky');

    color = getColorFromTemperatureLabel('Shade');
    expect(getColorTemperature(color).label).toBe('Shade');

    color = getColorFromTemperatureLabel('Blue sky');
    expect(getColorTemperature(color).label).toBe('Blue sky');
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
