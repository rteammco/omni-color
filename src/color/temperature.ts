import { Color } from './color';
import { ColorHex } from './formats';
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

const LABEL_TO_COLOR_HEX_MAP: { [key in ColorTemperatureLabel]: ColorHex } = {
  [ColorTemperatureLabel.CANDLELIGHT]: '#ff8400',
  [ColorTemperatureLabel.INCANDESCENT]: '#ffa757',
  [ColorTemperatureLabel.HALOGEN]: '#ffc18d',
  [ColorTemperatureLabel.FLUORESCENT]: '#ffdabb',
  [ColorTemperatureLabel.DAYLIGHT]: '#fff6ed',
  [ColorTemperatureLabel.CLOUDY]: '#e9f0ff',
  [ColorTemperatureLabel.SHADE]: '#dde6ff',
  [ColorTemperatureLabel.BLUE_SKY]: '#b5ceff',
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
    // McCamy's polynomial can yield negative or invalid values for colours far from the
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

  // TODO: migrate this to a util and add direct as a `Color` method
  const { s, l } = color.toHSL();
  const isOffWhite = s < 25 && l > 70;
  if (isOffWhite) {
    return `${formattedTemperature} K (${label.toLowerCase()})`;
  }

  return `${formattedTemperature} K`;
}

export function getColorFromTemperature(temperature: number): Color {
  // TODO: This needs to be more algorithmic: temperature value => generated color, not just mapping it to the label
  const label = getLabelForTemperature(temperature);
  return new Color(LABEL_TO_COLOR_HEX_MAP[label]);
}

export function getColorFromTemperatureLabel(label: ColorTemperatureLabel): Color {
  // TODO: `LABEL_TO_COLOR_HEX_MAP` should map to a temperature number, and then call `getColorFromTemperature()`
  return new Color(LABEL_TO_COLOR_HEX_MAP[label]);
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
