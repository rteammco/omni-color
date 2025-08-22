import { Color } from '../color';
import {
  ColorTemperatureLabel,
  getColorFromTemperature,
  getColorFromTemperatureLabel,
  getColorTemperature,
  getColorTemperatureString,
} from '../temperature';

describe('color temperature utilities', () => {
  it('gets temperature and label from a warm color', () => {
    const temp = 2700;
    const color = getColorFromTemperature(temp);
    const result = getColorTemperature(color);
    expect(result.label).toBe(ColorTemperatureLabel.INCANDESCENT);
    expect(result.temperature).toBeGreaterThan(temp - 500);
    expect(result.temperature).toBeLessThan(temp + 500);
  });

  it('generates readable string for off-white colors', () => {
    const color = getColorFromTemperature(2700);
    const str = getColorTemperatureString(color);
    expect(str).toContain('Incandescent');
  });

  it('omits label for saturated colors', () => {
    const color = new Color('#ff0000');
    const temp = getColorTemperature(color).temperature;
    expect(getColorTemperatureString(color)).toBe(`${temp}K`);
  });

  it('creates color from temperature label', () => {
    const color = getColorFromTemperatureLabel(ColorTemperatureLabel.DAYLIGHT);
    const result = getColorTemperature(color);
    expect(result.label).toBe(ColorTemperatureLabel.DAYLIGHT);
  });
});

