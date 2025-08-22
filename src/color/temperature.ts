import { Color } from './color';
import { ColorHSL } from './formats';

export enum ColorTemperatureLabel {
  // Warm:
  CANDLELIGHT = 'Candlelight',
  INCANDESCENT = 'Incandescent lamp',
  // Neutral:
  HALOGEN = 'Halogen lamp',
  FLUORESCENT = 'Fluorescent lamp',
  DAYLIGHT = 'Daylight',
  // Cool:
  CLOUDY = 'Cloudy sky',
  SHADE = 'Shade',
  BLUE_SKY = 'Blue sky',
}

export interface ColorTemperatureAndLabel {
  temperature: number; // in Kelvin
  label: ColorTemperatureLabel;
}

const SORTED_TEMPERATURE_LABELS: { label: ColorTemperatureLabel; temperatureLimit: number }[] = [
  { label: ColorTemperatureLabel.CANDLELIGHT, temperatureLimit: 2000 },
  { label: ColorTemperatureLabel.INCANDESCENT, temperatureLimit: 3000 },
  { label: ColorTemperatureLabel.HALOGEN, temperatureLimit: 4000 },
  { label: ColorTemperatureLabel.FLUORESCENT, temperatureLimit: 5000 },
  { label: ColorTemperatureLabel.DAYLIGHT, temperatureLimit: 6500 },
  { label: ColorTemperatureLabel.CLOUDY, temperatureLimit: 7500 },
  { label: ColorTemperatureLabel.SHADE, temperatureLimit: 9000 },
  { label: ColorTemperatureLabel.BLUE_SKY, temperatureLimit: Infinity },
] as const;

const LABEL_TO_TEMPERATURE_MAP: { [key in ColorTemperatureLabel]: number } = {
  [ColorTemperatureLabel.CANDLELIGHT]: 1900,
  [ColorTemperatureLabel.INCANDESCENT]: 2700,
  [ColorTemperatureLabel.HALOGEN]: 3200,
  [ColorTemperatureLabel.FLUORESCENT]: 4200,
  [ColorTemperatureLabel.DAYLIGHT]: 5500,
  [ColorTemperatureLabel.CLOUDY]: 7000,
  [ColorTemperatureLabel.SHADE]: 8000,
  [ColorTemperatureLabel.BLUE_SKY]: 10000,
} as const;

const LABEL_TO_COLOR_HSL_MAP: { [key in ColorTemperatureLabel]: ColorHSL } = {
  [ColorTemperatureLabel.CANDLELIGHT]: { h: 30, s: 20, l: 88 },
  [ColorTemperatureLabel.INCANDESCENT]: { h: 35, s: 18, l: 92 },
  [ColorTemperatureLabel.HALOGEN]: { h: 40, s: 16, l: 94 },
  [ColorTemperatureLabel.FLUORESCENT]: { h: 55, s: 12, l: 95 },
  [ColorTemperatureLabel.DAYLIGHT]: { h: 60, s: 8, l: 96 },
  [ColorTemperatureLabel.CLOUDY]: { h: 210, s: 12, l: 95 },
  [ColorTemperatureLabel.SHADE]: { h: 220, s: 12, l: 93 },
  [ColorTemperatureLabel.BLUE_SKY]: { h: 230, s: 15, l: 92 },
} as const;

function getLabelForTemperature(temperature: number): ColorTemperatureLabel {
  const found = SORTED_TEMPERATURE_LABELS.find((t) => temperature < t.temperatureLimit);
  return found ? found.label : ColorTemperatureLabel.DAYLIGHT;
}

export function getColorTemperature(color: Color): ColorTemperatureAndLabel {
  // TODO: wtf is this?
  const rgb = color.toRGB();
  let closest: ColorTemperatureLabel = ColorTemperatureLabel.DAYLIGHT;
  let minDist = Number.MAX_VALUE;
  for (const label of Object.values(ColorTemperatureLabel)) {
    const refRGB = new Color(LABEL_TO_COLOR_HSL_MAP[label]).toRGB();
    const dist =
      Math.pow(rgb.r - refRGB.r, 2) + Math.pow(rgb.g - refRGB.g, 2) + Math.pow(rgb.b - refRGB.b, 2);
    if (dist < minDist) {
      minDist = dist;
      closest = label as ColorTemperatureLabel;
    }
  }
  return { temperature: LABEL_TO_TEMPERATURE_MAP[closest], label: closest };
}

export function getColorTemperatureString(color: Color): string {
  const { temperature, label } = getColorTemperature(color);
  const { s, l } = color.toHSL();
  // TODO: migrate this to a util and add direct as a `Color` method
  const isOffWhite = s < 25 && l > 70;
  return isOffWhite ? `${temperature}K (${label})` : `${temperature}K`;
}

export function getColorFromTemperature(temperature: number): Color {
  const label = getLabelForTemperature(temperature);
  return new Color(LABEL_TO_COLOR_HSL_MAP[label]);
}

export function getColorFromTemperatureLabel(label: ColorTemperatureLabel): Color {
  return new Color(LABEL_TO_COLOR_HSL_MAP[label]);
}
