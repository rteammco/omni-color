import { clampValue } from '../utils';
import { Color } from './color';
import { srgbChannelToLinear, SrgbGammaPivot } from './utils';

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

export interface ColorTemperatureStringFormatOptions {
  formatNumber?: boolean; // if `true`, the temperature value will be formatted (e.g. '6,500 K' instead of '6500 K')
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
  [ColorTemperatureLabel.HALOGEN]: 3300,
  [ColorTemperatureLabel.FLUORESCENT]: 4200,
  [ColorTemperatureLabel.DAYLIGHT]: 6000,
  [ColorTemperatureLabel.CLOUDY]: 7000,
  [ColorTemperatureLabel.SHADE]: 8000,
  [ColorTemperatureLabel.BLUE_SKY]: 10000,
} as const;

function getLabelForTemperature(temperature: number): ColorTemperatureLabel {
  const found = SORTED_TEMPERATURE_LABELS.find((t) => temperature < t.temperatureLimit);
  return found ? found.label : ColorTemperatureLabel.DAYLIGHT;
}

export function getColorTemperature(color: Color): ColorTemperatureAndLabel {
  const { r, g, b } = color.toRGB();
  const rLin = srgbChannelToLinear(r, SrgbGammaPivot.SRGB);
  const gLin = srgbChannelToLinear(g, SrgbGammaPivot.SRGB);
  const bLin = srgbChannelToLinear(b, SrgbGammaPivot.SRGB);

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
    const cct = 449 * n * n * n + 3525 * n * n + 6823.3 * n + 5520.33;
    // McCamy's polynomial can yield negative or invalid values for colors far from the
    // Planckian locus. Clamp the result to `0` in those cases to avoid returning
    // nonsensical negative temperatures.
    if (Number.isFinite(cct)) {
      temperature = Math.max(0, Math.round(cct));
    }
  }

  return { temperature, label: getLabelForTemperature(temperature) };
}

export function getColorTemperatureString(
  color: Color,
  options: ColorTemperatureStringFormatOptions = {}
): string {
  const { temperature, label } = getColorTemperature(color);
  const formattedTemperature = options.formatNumber ? temperature.toLocaleString() : temperature;

  const { s, l } = color.toHSL();
  const isOffWhite = s < 25 && l > 70;
  // TODO: This needs to be fixed, since it doesn't really work anymore due to the colors not really
  // being off-white at all...
  if (isOffWhite) {
    return `${formattedTemperature} K (${label.toLowerCase()})`;
  }

  return `${formattedTemperature} K`;
}

export function getColorFromTemperature(temperature: number): Color {
  // Clamp to the range supported by the conversion algorithm.
  const temp = clampValue(temperature, 1000, 40000) / 100;

  // Algorithm adapted from:
  // https://tannerhelland.com/2012/09/18/convert-temperature-rgb-algorithm-code.html
  let r: number;
  let g: number;
  let b: number;

  if (temp <= 66) {
    r = 255;
  } else {
    r = 329.698727446 * Math.pow(temp - 60, -0.1332047592);
    r = clampValue(r, 0, 255);
  }

  if (temp <= 66) {
    g = 99.4708025861 * Math.log(temp) - 161.1195681661;
  } else {
    g = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);
  }
  g = clampValue(g, 0, 255);

  if (temp >= 66) {
    b = 255;
  } else if (temp <= 19) {
    b = 0;
  } else {
    b = 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
  }
  b = clampValue(b, 0, 255);

  return new Color({ r: Math.round(r), g: Math.round(g), b: Math.round(b) });
}

export function getColorFromTemperatureLabel(label: ColorTemperatureLabel): Color {
  return getColorFromTemperature(LABEL_TO_TEMPERATURE_MAP[label]);
}

export function matchPartialColorTemperatureLabel(
  partialLabel: string
): ColorTemperatureLabel | null {
  const cleanedPartialLabel = partialLabel.trim().toLowerCase();
  const matchedLabel = Object.values(ColorTemperatureLabel).find((label) => {
    const lowercaseLabel = label.toLowerCase();
    if (lowercaseLabel === cleanedPartialLabel) {
      return true;
    }
    const [firstWord] = lowercaseLabel.split(' ');
    return cleanedPartialLabel === firstWord;
  });
  return matchedLabel ?? null;
}
