import { Color } from '../color';
import {
  ColorTemperatureLabel,
  getColorFromTemperature,
  getColorFromTemperatureLabel,
  getColorTemperature,
  getColorTemperatureString,
} from '../temperature';

describe('getColorTemperature', () => {
  it('estimates temperature for a near-incandescent warm color', () => {
    const color = new Color('#ffa757');
    const result = getColorTemperature(color);
    expect(result.label).toBe(ColorTemperatureLabel.INCANDESCENT);
    expect(result.temperature).toBeGreaterThan(2200);
    expect(result.temperature).toBeLessThan(3200);
  });

  it('classifies grayscale and primary/secondary colors', () => {
    let result = getColorTemperature(new Color('#000000'));
    expect(result.label).toBe(ColorTemperatureLabel.CANDLELIGHT);
    expect(result.temperature).toBe(0);

    result = getColorTemperature(new Color('#ffffff'));
    expect(result.label).toBe(ColorTemperatureLabel.CLOUDY);
    expect(result.temperature).toBe(6504);

    result = getColorTemperature(new Color('#808080'));
    expect(result.label).toBe(ColorTemperatureLabel.CLOUDY);
    expect(result.temperature).toBe(6504);

    result = getColorTemperature(new Color('#c0c0c0'));
    expect(result.label).toBe(ColorTemperatureLabel.CLOUDY);
    expect(result.temperature).toBe(6504);

    result = getColorTemperature(new Color('#404040'));
    expect(result.label).toBe(ColorTemperatureLabel.CLOUDY);
    expect(result.temperature).toBe(6504);

    result = getColorTemperature(new Color('#ff0000'));
    expect(result.label).toBe(ColorTemperatureLabel.INCANDESCENT);
    expect(result.temperature).toBe(2655);

    result = getColorTemperature(new Color('#00ff00'));
    expect(result.label).toBe(ColorTemperatureLabel.DAYLIGHT);
    expect(result.temperature).toBe(6069);

    result = getColorTemperature(new Color('#0000ff'));
    expect(result.label).toBe(ColorTemperatureLabel.CANDLELIGHT);
    expect(result.temperature).toBe(1667);

    result = getColorTemperature(new Color('#ffff00'));
    expect(result.label).toBe(ColorTemperatureLabel.HALOGEN);
    expect(result.temperature).toBe(3909);

    result = getColorTemperature(new Color('#00ffff'));
    expect(result.label).toBe(ColorTemperatureLabel.BLUE_SKY);
    expect(result.temperature).toBe(12822);

    result = getColorTemperature(new Color('#ff00ff'));
    expect(result.label).toBe(ColorTemperatureLabel.HALOGEN);
    expect(result.temperature).toBe(3544);
  });

  it('classifies a full spectrum of intermediate hues', () => {
    let result = getColorTemperature(new Color('#ff4000'));
    expect(result.label).toBe(ColorTemperatureLabel.CANDLELIGHT);
    expect(result.temperature).toBe(1856);

    result = getColorTemperature(new Color('#ff8000'));
    expect(result.label).toBe(ColorTemperatureLabel.CANDLELIGHT);
    expect(result.temperature).toBe(1829);

    result = getColorTemperature(new Color('#ffbf00'));
    expect(result.label).toBe(ColorTemperatureLabel.INCANDESCENT);
    expect(result.temperature).toBe(2897);

    result = getColorTemperature(new Color('#bfff00'));
    expect(result.label).toBe(ColorTemperatureLabel.FLUORESCENT);
    expect(result.temperature).toBe(4749);

    result = getColorTemperature(new Color('#80ff00'));
    expect(result.label).toBe(ColorTemperatureLabel.DAYLIGHT);
    expect(result.temperature).toBe(5458);

    result = getColorTemperature(new Color('#40ff00'));
    expect(result.label).toBe(ColorTemperatureLabel.DAYLIGHT);
    expect(result.temperature).toBe(5914);

    result = getColorTemperature(new Color('#00ff40'));
    expect(result.label).toBe(ColorTemperatureLabel.DAYLIGHT);
    expect(result.temperature).toBe(6250);

    result = getColorTemperature(new Color('#00ff80'));
    expect(result.label).toBe(ColorTemperatureLabel.CLOUDY);
    expect(result.temperature).toBe(6908);

    result = getColorTemperature(new Color('#00ffbf'));
    expect(result.label).toBe(ColorTemperatureLabel.SHADE);
    expect(result.temperature).toBe(8521);

    result = getColorTemperature(new Color('#00bfff'));
    expect(result.label).toBe(ColorTemperatureLabel.BLUE_SKY);
    expect(result.temperature).toBe(44005);

    result = getColorTemperature(new Color('#0080ff'));
    expect(result.label).toBe(ColorTemperatureLabel.INCANDESCENT);
    expect(result.temperature).toBe(2999);

    result = getColorTemperature(new Color('#0040ff'));
    expect(result.label).toBe(ColorTemperatureLabel.CANDLELIGHT);
    expect(result.temperature).toBe(1972);

    result = getColorTemperature(new Color('#4000ff'));
    expect(result.label).toBe(ColorTemperatureLabel.CANDLELIGHT);
    expect(result.temperature).toBe(1655);

    result = getColorTemperature(new Color('#8000ff'));
    expect(result.label).toBe(ColorTemperatureLabel.CANDLELIGHT);
    expect(result.temperature).toBe(1627);

    result = getColorTemperature(new Color('#bf00ff'));
    expect(result.label).toBe(ColorTemperatureLabel.CANDLELIGHT);
    expect(result.temperature).toBe(1668);

    result = getColorTemperature(new Color('#ff00bf'));
    expect(result.label).toBe(ColorTemperatureLabel.CANDLELIGHT);
    expect(result.temperature).toBe(-5699);

    result = getColorTemperature(new Color('#ff0080'));
    expect(result.label).toBe(ColorTemperatureLabel.HALOGEN);
    expect(result.temperature).toBe(3505);

    result = getColorTemperature(new Color('#ff0040'));
    expect(result.label).toBe(ColorTemperatureLabel.INCANDESCENT);
    expect(result.temperature).toBe(2789);
  });
});

describe('getColorTemperatureString', () => {
  it('includes label for off-white colors', () => {
    expect(
      getColorTemperatureString(getColorFromTemperatureLabel(ColorTemperatureLabel.CANDLELIGHT))
    ).toBe('6011 K (daylight)');
    expect(
      getColorTemperatureString(getColorFromTemperatureLabel(ColorTemperatureLabel.INCANDESCENT))
    ).toBe('6240 K (daylight)');
    expect(
      getColorTemperatureString(getColorFromTemperatureLabel(ColorTemperatureLabel.HALOGEN))
    ).toBe('6314 K (daylight)');
    expect(
      getColorTemperatureString(getColorFromTemperatureLabel(ColorTemperatureLabel.FLUORESCENT))
    ).toBe('6388 K (daylight)');
    expect(
      getColorTemperatureString(getColorFromTemperatureLabel(ColorTemperatureLabel.DAYLIGHT))
    ).toBe('6426 K (daylight)');
    expect(
      getColorTemperatureString(getColorFromTemperatureLabel(ColorTemperatureLabel.CLOUDY))
    ).toBe('6622 K (cloudy sky)');
    expect(
      getColorTemperatureString(getColorFromTemperatureLabel(ColorTemperatureLabel.SHADE))
    ).toBe('6668 K (cloudy sky)');
    expect(
      getColorTemperatureString(getColorFromTemperatureLabel(ColorTemperatureLabel.BLUE_SKY))
    ).toBe('6761 K (cloudy sky)');
    expect(getColorTemperatureString(new Color('#ffffff'))).toBe('6504 K (cloudy sky)');
    expect(getColorTemperatureString(new Color('#c0c0c0'))).toBe('6504 K (cloudy sky)');
  });

  it('omits label for saturated or non-off-white colors', () => {
    expect(getColorTemperatureString(new Color('#ff0000'))).toBe('2655 K');
    expect(getColorTemperatureString(new Color('#0000ff'))).toBe('1667 K');
    expect(getColorTemperatureString(new Color('#00ff00'))).toBe('6069 K');
    expect(getColorTemperatureString(new Color('#00ffff'))).toBe('12822 K');
    expect(getColorTemperatureString(new Color('#ff00ff'))).toBe('3544 K');
    expect(getColorTemperatureString(new Color('#ffff00'))).toBe('3909 K');
    expect(getColorTemperatureString(new Color('#808080'))).toBe('6504 K');
    expect(getColorTemperatureString(new Color('#404040'))).toBe('6504 K');
    expect(getColorTemperatureString(new Color('#000000'))).toBe('0 K');
    expect(getColorTemperatureString(new Color('#ff00bf'))).toBe('-5699 K');
    // TODO: wtf negatives? also this case fails, need to fix the algo: #9882fc
    expect(getColorTemperatureString(new Color('#00bfff'))).toBe('44005 K');
  });
});

describe('getColorFromTemperature', () => {
  it('returns the expected color for temperatures across all ranges', () => {
    expect(getColorFromTemperature(1500).toHex()).toBe('#e7e0da');
    expect(getColorFromTemperature(1999).toHex()).toBe('#e7e0da');
    expect(getColorFromTemperature(2000).toHex()).toBe('#eeebe7');
    expect(getColorFromTemperature(2500).toHex()).toBe('#eeebe7');
    expect(getColorFromTemperature(3000).toHex()).toBe('#f2f1ed');
    expect(getColorFromTemperature(3500).toHex()).toBe('#f2f1ed');
    expect(getColorFromTemperature(4000).toHex()).toBe('#f4f4f1');
    expect(getColorFromTemperature(4500).toHex()).toBe('#f4f4f1');
    expect(getColorFromTemperature(5000).toHex()).toBe('#f6f6f4');
    expect(getColorFromTemperature(6499).toHex()).toBe('#f6f6f4');
    expect(getColorFromTemperature(6500).toHex()).toBe('#f1f2f4');
    expect(getColorFromTemperature(7499).toHex()).toBe('#f1f2f4');
    expect(getColorFromTemperature(7500).toHex()).toBe('#ebecef');
    expect(getColorFromTemperature(8999).toHex()).toBe('#ebecef');
    expect(getColorFromTemperature(9000).toHex()).toBe('#e8e9ee');
    expect(getColorFromTemperature(20000).toHex()).toBe('#e8e9ee');
  });
});

describe('getColorFromTemperatureLabel', () => {
  it('returns the expected off-white color for each label', () => {
    let color = getColorFromTemperatureLabel(ColorTemperatureLabel.CANDLELIGHT);
    expect(color.toHex()).toBe('#e7e0da');
    let hsl = color.toHSL();
    expect(hsl.s).toBeLessThan(25);
    expect(hsl.l).toBeGreaterThan(70);

    color = getColorFromTemperatureLabel(ColorTemperatureLabel.INCANDESCENT);
    expect(color.toHex()).toBe('#eeebe7');
    hsl = color.toHSL();
    expect(hsl.s).toBeLessThan(25);
    expect(hsl.l).toBeGreaterThan(70);

    color = getColorFromTemperatureLabel(ColorTemperatureLabel.HALOGEN);
    expect(color.toHex()).toBe('#f2f1ed');
    hsl = color.toHSL();
    expect(hsl.s).toBeLessThan(25);
    expect(hsl.l).toBeGreaterThan(70);

    color = getColorFromTemperatureLabel(ColorTemperatureLabel.FLUORESCENT);
    expect(color.toHex()).toBe('#f4f4f1');
    hsl = color.toHSL();
    expect(hsl.s).toBeLessThan(25);
    expect(hsl.l).toBeGreaterThan(70);

    color = getColorFromTemperatureLabel(ColorTemperatureLabel.DAYLIGHT);
    expect(color.toHex()).toBe('#f6f6f4');
    hsl = color.toHSL();
    expect(hsl.s).toBeLessThan(25);
    expect(hsl.l).toBeGreaterThan(70);

    color = getColorFromTemperatureLabel(ColorTemperatureLabel.CLOUDY);
    expect(color.toHex()).toBe('#f1f2f4');
    hsl = color.toHSL();
    expect(hsl.s).toBeLessThan(25);
    expect(hsl.l).toBeGreaterThan(70);

    color = getColorFromTemperatureLabel(ColorTemperatureLabel.SHADE);
    expect(color.toHex()).toBe('#ebecef');
    hsl = color.toHSL();
    expect(hsl.s).toBeLessThan(25);
    expect(hsl.l).toBeGreaterThan(70);

    color = getColorFromTemperatureLabel(ColorTemperatureLabel.BLUE_SKY);
    expect(color.toHex()).toBe('#e8e9ee');
    hsl = color.toHSL();
    expect(hsl.s).toBeLessThan(25);
    expect(hsl.l).toBeGreaterThan(70);
  });
});
