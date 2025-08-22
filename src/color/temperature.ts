import { Color } from './color';

export enum ColorTemperatureLabel {
  CANDLELIGHT = 'Candlelight',
  INCANDESCENT = 'Incandescent bulb',
  HALOGEN = 'Halogen',
  FLUORESCENT = 'Fluorescent',
  DAYLIGHT = 'Daylight',
  CLOUDY = 'Cloudy sky',
  SHADE = 'Shade',
  BLUE_SKY = 'Blue sky',
}

export interface ColorTemperatureAndDescription {
  temperature: number; // in Kelvin
  label: ColorTemperatureLabel;
}

// Mapping of temperature ranges to their descriptive label
const TEMPERATURE_LABELS: { limit: number; label: ColorTemperatureLabel }[] = [
  { limit: 2000, label: ColorTemperatureLabel.CANDLELIGHT },
  { limit: 3000, label: ColorTemperatureLabel.INCANDESCENT },
  { limit: 4000, label: ColorTemperatureLabel.HALOGEN },
  { limit: 5000, label: ColorTemperatureLabel.FLUORESCENT },
  { limit: 6500, label: ColorTemperatureLabel.DAYLIGHT },
  { limit: 7500, label: ColorTemperatureLabel.CLOUDY },
  { limit: 9000, label: ColorTemperatureLabel.SHADE },
  { limit: Infinity, label: ColorTemperatureLabel.BLUE_SKY },
];

const LABEL_TO_TEMPERATURE: Record<ColorTemperatureLabel, number> = {
  [ColorTemperatureLabel.CANDLELIGHT]: 1900,
  [ColorTemperatureLabel.INCANDESCENT]: 2700,
  [ColorTemperatureLabel.HALOGEN]: 3200,
  [ColorTemperatureLabel.FLUORESCENT]: 4200,
  [ColorTemperatureLabel.DAYLIGHT]: 5500,
  [ColorTemperatureLabel.CLOUDY]: 7000,
  [ColorTemperatureLabel.SHADE]: 8000,
  [ColorTemperatureLabel.BLUE_SKY]: 10000,
};

const LABEL_TO_COLOR_HSL: Record<ColorTemperatureLabel, { h: number; s: number; l: number }> = {
  [ColorTemperatureLabel.CANDLELIGHT]: { h: 30, s: 20, l: 88 },
  [ColorTemperatureLabel.INCANDESCENT]: { h: 35, s: 18, l: 92 },
  [ColorTemperatureLabel.HALOGEN]: { h: 40, s: 16, l: 94 },
  [ColorTemperatureLabel.FLUORESCENT]: { h: 55, s: 12, l: 95 },
  [ColorTemperatureLabel.DAYLIGHT]: { h: 60, s: 8, l: 96 },
  [ColorTemperatureLabel.CLOUDY]: { h: 210, s: 12, l: 95 },
  [ColorTemperatureLabel.SHADE]: { h: 220, s: 12, l: 93 },
  [ColorTemperatureLabel.BLUE_SKY]: { h: 230, s: 15, l: 92 },
};

function getLabelForTemperature(temperature: number): ColorTemperatureLabel {
  const found = TEMPERATURE_LABELS.find((t) => temperature < t.limit);
  return found ? found.label : ColorTemperatureLabel.DAYLIGHT;
}

export function getColorTemperature(color: Color): ColorTemperatureAndDescription {
  const rgb = color.toRGB();
  let closest: ColorTemperatureLabel = ColorTemperatureLabel.DAYLIGHT;
  let minDist = Number.MAX_VALUE;
  for (const label of Object.values(ColorTemperatureLabel)) {
    const refRGB = new Color(LABEL_TO_COLOR_HSL[label]).toRGB();
    const dist =
      Math.pow(rgb.r - refRGB.r, 2) +
      Math.pow(rgb.g - refRGB.g, 2) +
      Math.pow(rgb.b - refRGB.b, 2);
    if (dist < minDist) {
      minDist = dist;
      closest = label as ColorTemperatureLabel;
    }
  }
  return { temperature: LABEL_TO_TEMPERATURE[closest], label: closest };
}

export function getColorTemperatureString(color: Color): string {
  const { temperature, label } = getColorTemperature(color);
  const { s, l } = color.toHSL();
  const isOffWhite = s < 25 && l > 70;
  return isOffWhite ? `${temperature}K (${label})` : `${temperature}K`;
}

export function getColorFromTemperature(temperature: number): Color {
  const label = getLabelForTemperature(temperature);
  return new Color(LABEL_TO_COLOR_HSL[label]);
}

export function getColorFromTemperatureLabel(label: ColorTemperatureLabel): Color {
  return new Color(LABEL_TO_COLOR_HSL[label]);
}

