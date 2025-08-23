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
  const { r, g, b } = color.toRGB();
  // Does a gamma correction by converting sRGB to linear RGB values. To calculate proper
  // luminance, we need the actual linear light intensities, not the gamma-encoded ones.
  const linearizeRGBChannel = (channel: number): number => {
    // TODO: we have this same function with slight variations in several parts of the code,
    // move to a common util?
    const c = channel / 255; // normalize
    if (c <= 0.04045) {
      return c / 12.92; // linear portion for dark colors
    }
    return Math.pow((c + 0.055) / 1.055, 2.4); // gamma correction for brighter colors
  };

  const rLin = linearizeRGBChannel(r);
  const gLin = linearizeRGBChannel(g);
  const bLin = linearizeRGBChannel(b);

  // XYZ color space conversion:
  const x = rLin * 0.4124 + gLin * 0.3576 + bLin * 0.1805;
  const y = rLin * 0.2126 + gLin * 0.7152 + bLin * 0.0722;
  const z = rLin * 0.0193 + gLin * 0.1192 + bLin * 0.9505;

  let temperature = 0;
  const sum = x + y + z;
  if (sum !== 0) {
    // Chromaticity calculation:
    const chromaX = x / sum;
    const chromaY = y / sum;
    // McCamy's approximation formula to calculate correlated color temperature (CCT):
    const n = (chromaX - 0.332) / (0.1858 - chromaY); // 0.332, 0.1858 are reference points on the chromaticity diagram
    temperature = Math.round(449 * n * n * n + 3525 * n * n + 6823.3 * n + 5520.33);
  }

  return { temperature, label: getLabelForTemperature(temperature) };
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
