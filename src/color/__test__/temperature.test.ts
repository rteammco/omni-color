import { Color } from '../color';
import type { ColorRGBA } from '../formats.types';
import {
  getColorFromTemperature,
  getColorFromTemperatureLabel,
  getColorTemperature,
  getColorTemperatureString,
  matchPartialColorTemperatureLabel,
} from '../temperature';

function getColorTemperatureForColor(color: Color | Readonly<ColorRGBA>) {
  return getColorTemperature(color instanceof Color ? color.toRGBA() : color);
}

function getColorTemperatureStringForColor(
  color: Color | Readonly<ColorRGBA>,
  options: Parameters<typeof getColorTemperatureString>[1] = {},
) {
  const rgba = color instanceof Color ? color.toRGBA() : color;
  return getColorTemperatureString(rgba, options);
}

function createColorFromTemperature(temperature: number): Color {
  return new Color(getColorFromTemperature(temperature));
}

function createColorFromTemperatureLabel(
  label: Parameters<typeof getColorFromTemperatureLabel>[0],
): Color {
  return new Color(getColorFromTemperatureLabel(label));
}

describe('getColorTemperature', () => {
  it('estimates temperature for a near-incandescent warm color', () => {
    // Approximation based on incandescent lamp values (~2700–3000 K)
    // from https://en.wikipedia.org/wiki/Color_temperature
    const color = new Color('#ffa757');
    const result = getColorTemperatureForColor(color);
    expect(result.label).toBe('Incandescent lamp');
    expect(result.temperature).toBeGreaterThan(2200);
    expect(result.temperature).toBeLessThan(3200);
  });

  it('classifies grayscale and primary/secondary colors', () => {
    let result = getColorTemperatureForColor(new Color('#000000'));
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(0);

    result = getColorTemperatureForColor(new Color('#ffffff'));
    expect(result.label).toBe('Cloudy sky');
    expect(result.temperature).toBe(6504);

    result = getColorTemperatureForColor(new Color('#808080'));
    expect(result.label).toBe('Cloudy sky');
    expect(result.temperature).toBe(6504);

    result = getColorTemperatureForColor(new Color('#c0c0c0'));
    expect(result.label).toBe('Cloudy sky');
    expect(result.temperature).toBe(6504);

    result = getColorTemperatureForColor(new Color('#404040'));
    expect(result.label).toBe('Cloudy sky');
    expect(result.temperature).toBe(6504);

    result = getColorTemperatureForColor(new Color('#ff0000'));
    expect(result.label).toBe('Incandescent lamp');
    expect(result.temperature).toBe(2655);

    result = getColorTemperatureForColor(new Color('#00ff00'));
    expect(result.label).toBe('Daylight');
    expect(result.temperature).toBe(6069);

    result = getColorTemperatureForColor(new Color('#0000ff'));
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1667);

    result = getColorTemperatureForColor(new Color('#ffff00'));
    expect(result.label).toBe('Halogen lamp');
    expect(result.temperature).toBe(3909);

    result = getColorTemperatureForColor(new Color('#00ffff'));
    expect(result.label).toBe('Blue sky');
    expect(result.temperature).toBe(12822);

    result = getColorTemperatureForColor(new Color('#ff00ff'));
    expect(result.label).toBe('Halogen lamp');
    expect(result.temperature).toBe(3544);
  });

  it('classifies a full spectrum of intermediate hues', () => {
    let result = getColorTemperatureForColor(new Color('#ff4000'));
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1856);

    result = getColorTemperatureForColor(new Color('#ff8000'));
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1829);

    result = getColorTemperatureForColor(new Color('#ffbf00'));
    expect(result.label).toBe('Incandescent lamp');
    expect(result.temperature).toBe(2897);

    result = getColorTemperatureForColor(new Color('#bfff00'));
    expect(result.label).toBe('Fluorescent lamp');
    expect(result.temperature).toBe(4749);

    result = getColorTemperatureForColor(new Color('#80ff00'));
    expect(result.label).toBe('Daylight');
    expect(result.temperature).toBe(5458);

    result = getColorTemperatureForColor(new Color('#40ff00'));
    expect(result.label).toBe('Daylight');
    expect(result.temperature).toBe(5914);

    result = getColorTemperatureForColor(new Color('#00ff40'));
    expect(result.label).toBe('Daylight');
    expect(result.temperature).toBe(6250);

    result = getColorTemperatureForColor(new Color('#00ff80'));
    expect(result.label).toBe('Cloudy sky');
    expect(result.temperature).toBe(6908);

    result = getColorTemperatureForColor(new Color('#00ffbf'));
    expect(result.label).toBe('Shade');
    expect(result.temperature).toBe(8521);

    result = getColorTemperatureForColor(new Color('#00bfff'));
    expect(result.label).toBe('Blue sky');
    expect(result.temperature).toBe(44005);

    result = getColorTemperatureForColor(new Color('#0080ff'));
    expect(result.label).toBe('Incandescent lamp');
    expect(result.temperature).toBe(2999);

    result = getColorTemperatureForColor(new Color('#0040ff'));
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1972);

    result = getColorTemperatureForColor(new Color('#4000ff'));
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1655);

    result = getColorTemperatureForColor(new Color('#8000ff'));
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1627);

    result = getColorTemperatureForColor(new Color('#bf00ff'));
    expect(result.label).toBe('Candlelight');
    expect(result.temperature).toBe(1668);

    result = getColorTemperatureForColor(new Color('#ff00bf'));
    expect(result.label).toBe('Candlelight');
    // Previously this case produced a negative temperature due to an out-of-gamut
    // chromaticity calculation. It should now be clamped to 0 K.
    expect(result.temperature).toBe(0);

    result = getColorTemperatureForColor(new Color('#ff0080'));
    expect(result.label).toBe('Halogen lamp');
    expect(result.temperature).toBe(3505);

    result = getColorTemperatureForColor(new Color('#ff0040'));
    expect(result.label).toBe('Incandescent lamp');
    expect(result.temperature).toBe(2789);
  });
});

describe('getColorTemperatureString', () => {
  it('includes label for colors near temperature reference colors', () => {
    expect(getColorTemperatureStringForColor(new Color('#ffffff'), {})).toBe('6504 K (cloudy sky)');
    expect(getColorTemperatureStringForColor(new Color('#c0c0c0'), {})).toBe('6504 K (cloudy sky)');
    expect(getColorTemperatureStringForColor(new Color('#ff8400'), {})).toBe(
      '1881 K (candlelight)',
    );
    expect(getColorTemperatureStringForColor(new Color('#ffa757'), {})).toBe(
      '2583 K (incandescent lamp)',
    );
    expect(getColorTemperatureStringForColor(new Color('#ffbb81'), {})).toBe(
      '3198 K (halogen lamp)',
    );
    expect(getColorTemperatureStringForColor(new Color('#ffd3af'), {})).toBe(
      '4142 K (fluorescent lamp)',
    );
    expect(getColorTemperatureStringForColor(new Color('#fff6ed'), {})).toBe('5889 K (daylight)');
    expect(getColorTemperatureStringForColor(new Color('#f3f2ff'), {})).toBe('7049 K (cloudy sky)');
    expect(getColorTemperatureStringForColor(new Color('#dde6ff'), {})).toBe('8309 K (shade)');
    expect(getColorTemperatureStringForColor(new Color('#cadaff'), {})).toBe('10026 K (blue sky)');
  });

  it('omits label for saturated or unrelated colors', () => {
    expect(getColorTemperatureStringForColor(new Color('#ff0000'), {})).toBe('2655 K');
    expect(getColorTemperatureStringForColor(new Color('#0000ff'), {})).toBe('1667 K');
    expect(getColorTemperatureStringForColor(new Color('#00ff00'), {})).toBe('6069 K');
    expect(getColorTemperatureStringForColor(new Color('#00ffff'), {})).toBe('12822 K');
    expect(getColorTemperatureStringForColor(new Color('#ff00ff'), {})).toBe('3544 K');
    expect(getColorTemperatureStringForColor(new Color('#ffff00'), {})).toBe('3909 K');
    expect(getColorTemperatureStringForColor(new Color('#808080'), {})).toBe('6504 K');
    expect(getColorTemperatureStringForColor(new Color('#404040'), {})).toBe('6504 K');
    expect(getColorTemperatureStringForColor(new Color('#000000'), {})).toBe('0 K');
    expect(getColorTemperatureStringForColor(new Color('#ff00bf'), {})).toBe('0 K');
    expect(getColorTemperatureStringForColor(new Color('#00bfff'), {})).toBe('44005 K');
  });

  it('formats numbers when requested', () => {
    expect(
      getColorTemperatureStringForColor(createColorFromTemperatureLabel('Cloudy sky'), {
        formatNumber: true,
      }),
    ).toBe('7,049 K (cloudy sky)');
    expect(getColorTemperatureStringForColor(new Color('#ff0000'), { formatNumber: true })).toBe(
      '2,655 K',
    );
  });
});

describe('getColorFromTemperature', () => {
  it('returns a raw RGBA color format', () => {
    expect(getColorFromTemperature(1500)).toEqual({ r: 255, g: 108, b: 0, a: 1 });
  });

  it('returns the expected color for temperatures across all ranges', () => {
    expect(createColorFromTemperature(1500).toHex()).toBe('#ff6c00');
    expect(createColorFromTemperature(1999).toHex()).toBe('#ff890e');
    expect(createColorFromTemperature(2000).toHex()).toBe('#ff890e');
    expect(createColorFromTemperature(2500).toHex()).toBe('#ff9f46');
    expect(createColorFromTemperature(3000).toHex()).toBe('#ffb16e');
    expect(createColorFromTemperature(3500).toHex()).toBe('#ffc18d');
    expect(createColorFromTemperature(4000).toHex()).toBe('#ffcea6');
    expect(createColorFromTemperature(4500).toHex()).toBe('#ffdabb');
    expect(createColorFromTemperature(5000).toHex()).toBe('#ffe4ce');
    expect(createColorFromTemperature(6499).toHex()).toBe('#fffefa');
    expect(createColorFromTemperature(6500).toHex()).toBe('#fffefa');
    expect(createColorFromTemperature(7499).toHex()).toBe('#e6ebff');
    expect(createColorFromTemperature(7500).toHex()).toBe('#e6ebff');
    expect(createColorFromTemperature(8999).toHex()).toBe('#d2dfff');
    expect(createColorFromTemperature(9000).toHex()).toBe('#d2dfff');
    expect(createColorFromTemperature(20000).toHex()).toBe('#abc6ff');
  });
});

describe('getColorFromTemperatureLabel', () => {
  it('returns the expected color for each label', () => {
    let color = createColorFromTemperatureLabel('Candlelight');
    expect(color.toHex()).toBe('#ff8400');

    color = createColorFromTemperatureLabel('Incandescent lamp');
    expect(color.toHex()).toBe('#ffa757');

    color = createColorFromTemperatureLabel('Halogen lamp');
    expect(color.toHex()).toBe('#ffbb81');

    color = createColorFromTemperatureLabel('Fluorescent lamp');
    expect(color.toHex()).toBe('#ffd3af');

    color = createColorFromTemperatureLabel('Daylight');
    expect(color.toHex()).toBe('#fff6ed');

    color = createColorFromTemperatureLabel('Cloudy sky');
    expect(color.toHex()).toBe('#f3f2ff');

    color = createColorFromTemperatureLabel('Shade');
    expect(color.toHex()).toBe('#dde6ff');

    color = createColorFromTemperatureLabel('Blue sky');
    expect(color.toHex()).toBe('#cadaff');
  });

  it('round-trips through getColorTemperature', () => {
    let color = createColorFromTemperatureLabel('Candlelight');
    expect(getColorTemperatureForColor(color).label).toBe('Candlelight');

    color = createColorFromTemperatureLabel('Incandescent lamp');
    expect(getColorTemperatureForColor(color).label).toBe('Incandescent lamp');

    color = createColorFromTemperatureLabel('Halogen lamp');
    expect(getColorTemperatureForColor(color).label).toBe('Halogen lamp');

    color = createColorFromTemperatureLabel('Fluorescent lamp');
    expect(getColorTemperatureForColor(color).label).toBe('Fluorescent lamp');

    color = createColorFromTemperatureLabel('Daylight');
    expect(getColorTemperatureForColor(color).label).toBe('Daylight');

    color = createColorFromTemperatureLabel('Cloudy sky');
    expect(getColorTemperatureForColor(color).label).toBe('Cloudy sky');

    color = createColorFromTemperatureLabel('Shade');
    expect(getColorTemperatureForColor(color).label).toBe('Shade');

    color = createColorFromTemperatureLabel('Blue sky');
    expect(getColorTemperatureForColor(color).label).toBe('Blue sky');
  });

  it('accepts mixed case temperature label', () => {
    const t1 = createColorFromTemperatureLabel('Cloudy sky');
    const t2 = createColorFromTemperatureLabel('cloudy sky');
    const t3 = createColorFromTemperatureLabel('CLOUDY SKY');

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
