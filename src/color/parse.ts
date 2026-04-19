import { clampValue } from '../utils';
import { Color } from './color';
import {
  type ColorSpaceValues,
  convertColorSpaceValuesToRGB,
  parseColorSpace,
} from './colorSpaces';
import type { ColorFormat, ColorRGB } from './formats';

const MATCH_RGB_STRING_REGEX = /^rgb\((.+)\)$/;
const MATCH_RGBA_STRING_REGEX = /^rgba\((.+)\)$/;
const MATCH_HSL_STRING_REGEX = /^hsl\((.+)\)$/;
const MATCH_HSLA_STRING_REGEX = /^hsla\((.+)\)$/;
const MATCH_HSV_STRING_REGEX = /^hsv\((.+)\)$/;
const MATCH_HSVA_STRING_REGEX = /^hsva\((.+)\)$/;
const MATCH_HWB_STRING_REGEX = /^hwb\((.+)\)$/;
const MATCH_CMYK_STRING_REGEX = /^cmyk\((.+)\)$/;
const MATCH_LAB_STRING_REGEX = /^lab\((.+)\)$/;
const MATCH_LCH_STRING_REGEX = /^lch\((.+)\)$/;
const MATCH_OKLAB_STRING_REGEX = /^oklab\((.+)\)$/;
const MATCH_OKLCH_STRING_REGEX = /^oklch\((.+)\)$/;
const MATCH_COLOR_FUNCTION_REGEX = /^color\((.+)\)$/;
const MATCH_HUE_ANGLE_REGEX = /^([-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)(deg|rad|grad|turn)?$/i;

interface SplitColorParamsOptions {
  allowAlpha?: boolean;
  allowSlashForAlpha?: boolean;
  expectedChannels: number;
}

interface SplitColorParamsResult {
  alpha?: string;
  channels: string[];
}

interface ParsedHueAndPercentChannels {
  hue: number;
  firstPercentChannel: number;
  secondPercentChannel: number;
}

function splitColorFunctionParams(
  params: string,
  { expectedChannels, allowAlpha = false, allowSlashForAlpha = false }: SplitColorParamsOptions,
): SplitColorParamsResult | null {
  let channelsSection = params;
  let alphaSection: string | undefined;

  if (allowAlpha && allowSlashForAlpha && params.includes('/')) {
    const [channelsPart, alphaPart] = params.split('/');
    channelsSection = channelsPart;
    alphaSection = alphaPart;
  }

  const segments = channelsSection.split(/[,\s]+/).filter(Boolean);

  if (allowAlpha && alphaSection === undefined && segments.length === expectedChannels + 1) {
    alphaSection = segments.pop();
  }

  if (segments.length !== expectedChannels) {
    return null;
  }

  return {
    channels: segments,
    alpha: alphaSection?.trim(),
  };
}

function parseNumberOrPercent(value: string, scale: number): number {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return NaN;
  }
  return value.trim().endsWith('%') ? (num / 100) * scale : num;
}

function parseRGBNumber(value: string): number {
  const parsed = parseNumberOrPercent(value, 255);
  if (isNaN(parsed)) {
    return NaN;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue.endsWith('%') && trimmedValue.includes('.') && parsed >= 0 && parsed <= 1) {
    return parsed * 255;
  }

  return parsed;
}

function normalizeHue(value: number): number {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function parseHueAngle(value: string): number {
  const trimmedValue = value.trim();
  const match = trimmedValue.match(MATCH_HUE_ANGLE_REGEX);
  if (!match) {
    return NaN;
  }

  const numericValue = Number(match[1]);
  if (isNaN(numericValue)) {
    return NaN;
  }

  const unit = match[2]?.toLowerCase() ?? 'deg';
  if (unit === 'rad') {
    return normalizeHue((numericValue * 180) / Math.PI);
  }
  if (unit === 'grad') {
    // 400grad is a full circle, so each grad equals 0.9deg.
    return normalizeHue(numericValue * 0.9);
  }
  if (unit === 'turn') {
    return normalizeHue(numericValue * 360);
  }

  return normalizeHue(numericValue);
}

function createColorOrNull(format: ColorFormat): Color | null {
  try {
    return new Color(format);
  } catch {
    return null;
  }
}

function hasNaN(values: number[]): boolean {
  return values.some((value) => isNaN(value));
}

function parseAlpha(alpha: string): number | null {
  const parsedAlphaNumber = parseFloat(alpha);
  if (isNaN(parsedAlphaNumber)) {
    return null;
  }

  const normalizedAlpha = alpha.trim().endsWith('%') ? parsedAlphaNumber / 100 : parsedAlphaNumber;
  const roundedAlpha = +normalizedAlpha.toFixed(3);
  const parsedAlpha = clampValue(roundedAlpha, 0, 1);
  if (isNaN(parsedAlpha)) {
    return null;
  }

  return parsedAlpha;
}

function parseRGBChannels(channels: string[]): ColorRGB | null {
  const [r, g, b] = channels
    .map((value) => Math.round(parseRGBNumber(value)))
    .map((value) => clampValue(value, 0, 255));

  if (hasNaN([r, g, b])) {
    return null;
  }

  return { r, g, b };
}

function parseHueAndTwoPercentChannels(channels: string[]): ParsedHueAndPercentChannels | null {
  const [hue, firstPercentChannel, secondPercentChannel] = [
    Math.round(parseHueAngle(channels[0])),
    clampValue(Math.round(parseNumberOrPercent(channels[1], 100)), 0, 100),
    clampValue(Math.round(parseNumberOrPercent(channels[2], 100)), 0, 100),
  ];

  if (hasNaN([hue, firstPercentChannel, secondPercentChannel])) {
    return null;
  }

  return { hue, firstPercentChannel, secondPercentChannel };
}

function parseColor(params: string): Color | null {
  const separatorIndex = params.search(/[\s,]/);
  if (separatorIndex === -1) {
    return null;
  }

  const colorSpaceName = parseColorSpace(params.slice(0, separatorIndex));
  if (!colorSpaceName) {
    return null;
  }

  const channelSection = params
    .slice(separatorIndex)
    .trim()
    .replace(/^[,\s]+/, '');

  const colorParams = splitColorFunctionParams(channelSection, {
    expectedChannels: 3,
    allowAlpha: true,
    allowSlashForAlpha: true,
  });
  if (!colorParams) {
    return null;
  }

  const [r, g, b] = colorParams.channels.map((channel) =>
    clampValue(parseNumberOrPercent(channel, 1), 0, 1),
  );

  if (hasNaN([r, g, b])) {
    return null;
  }

  const colorSpaceValues: ColorSpaceValues = { r, g, b };
  const rgb = convertColorSpaceValuesToRGB(colorSpaceValues, colorSpaceName);
  if (colorParams.alpha === undefined) {
    return createColorOrNull(rgb);
  }

  const alpha = parseAlpha(colorParams.alpha);
  if (alpha === null) {
    return null;
  }

  return createColorOrNull({ ...rgb, a: alpha });
}

function parseRGB(params: string): Color | null {
  const rgbParams = splitColorFunctionParams(params, {
    expectedChannels: 3,
    allowAlpha: true,
    allowSlashForAlpha: true,
  });
  if (!rgbParams) {
    return null;
  }

  const rgbChannels = parseRGBChannels(rgbParams.channels);
  if (!rgbChannels) {
    return null;
  }

  if (rgbParams.alpha === undefined) {
    return createColorOrNull(rgbChannels);
  }

  const alpha = parseAlpha(rgbParams.alpha);
  if (alpha === null) {
    return null;
  }

  return createColorOrNull({ ...rgbChannels, a: alpha });
}

function parseRGBA(params: string): Color | null {
  const rgbaParams = splitColorFunctionParams(params, {
    expectedChannels: 3,
    allowAlpha: true,
    allowSlashForAlpha: true,
  });
  if (!rgbaParams) {
    return null;
  }

  const rgbChannels = parseRGBChannels(rgbaParams.channels);
  if (!rgbChannels) {
    return null;
  }

  if (!rgbaParams.alpha) {
    return null;
  }

  const alpha = parseAlpha(rgbaParams.alpha);
  if (alpha === null) {
    return null;
  }

  return createColorOrNull({ ...rgbChannels, a: alpha });
}

function parseHSL(params: string): Color | null {
  const hslParams = splitColorFunctionParams(params, {
    expectedChannels: 3,
    allowAlpha: true,
    allowSlashForAlpha: true,
  });
  if (!hslParams) {
    return null;
  }

  const parsedChannels = parseHueAndTwoPercentChannels(hslParams.channels);
  if (!parsedChannels) {
    return null;
  }

  const { hue: h, firstPercentChannel: s, secondPercentChannel: l } = parsedChannels;
  if (hslParams.alpha === undefined) {
    return createColorOrNull({ h, s, l });
  }

  const alpha = parseAlpha(hslParams.alpha);
  if (alpha === null) {
    return null;
  }

  return createColorOrNull({ h, s, l, a: alpha });
}

function parseHSLA(params: string): Color | null {
  const hslaParams = splitColorFunctionParams(params, {
    expectedChannels: 3,
    allowAlpha: true,
    allowSlashForAlpha: true,
  });
  if (!hslaParams) {
    return null;
  }

  const parsedChannels = parseHueAndTwoPercentChannels(hslaParams.channels);
  if (!parsedChannels) {
    return null;
  }

  const { hue: h, firstPercentChannel: s, secondPercentChannel: l } = parsedChannels;
  if (!hslaParams.alpha) {
    return null;
  }

  const alpha = parseAlpha(hslaParams.alpha);
  if (alpha === null) {
    return null;
  }

  return createColorOrNull({ h, s, l, a: alpha });
}

function parseHSV(params: string): Color | null {
  const hsvParams = splitColorFunctionParams(params, {
    expectedChannels: 3,
    allowAlpha: true,
    allowSlashForAlpha: true,
  });
  if (!hsvParams) {
    return null;
  }

  const parsedChannels = parseHueAndTwoPercentChannels(hsvParams.channels);
  if (!parsedChannels) {
    return null;
  }

  const { hue: h, firstPercentChannel: s, secondPercentChannel: v } = parsedChannels;
  if (hsvParams.alpha === undefined) {
    return createColorOrNull({ h, s, v });
  }

  const alpha = parseAlpha(hsvParams.alpha);
  if (alpha === null) {
    return null;
  }

  return createColorOrNull({ h, s, v, a: alpha });
}

function parseHSVA(params: string): Color | null {
  const hsvaParams = splitColorFunctionParams(params, {
    expectedChannels: 3,
    allowAlpha: true,
    allowSlashForAlpha: true,
  });
  if (!hsvaParams) {
    return null;
  }

  const parsedChannels = parseHueAndTwoPercentChannels(hsvaParams.channels);
  if (!parsedChannels) {
    return null;
  }

  const { hue: h, firstPercentChannel: s, secondPercentChannel: v } = parsedChannels;
  if (!hsvaParams.alpha) {
    return null;
  }

  const alpha = parseAlpha(hsvaParams.alpha);
  if (alpha === null) {
    return null;
  }

  return createColorOrNull({ h, s, v, a: alpha });
}

function parseHWB(params: string): Color | null {
  const hwbParams = splitColorFunctionParams(params, {
    expectedChannels: 3,
    allowAlpha: true,
    allowSlashForAlpha: true,
  });
  if (!hwbParams) {
    return null;
  }

  const parsedChannels = parseHueAndTwoPercentChannels(hwbParams.channels);
  if (!parsedChannels) {
    return null;
  }

  const { hue: h, firstPercentChannel: w, secondPercentChannel: b } = parsedChannels;
  if (hwbParams.alpha === undefined) {
    return createColorOrNull({ h, w, b });
  }

  const alpha = parseAlpha(hwbParams.alpha);
  if (alpha === null) {
    return null;
  }

  return createColorOrNull({ h, w, b, a: alpha });
}

function parseCMYK(params: string): Color | null {
  const cmykParams = splitColorFunctionParams(params, { expectedChannels: 4 });
  if (!cmykParams) {
    return null;
  }

  const [c, m, y, k] = cmykParams.channels.map((value) => parseNumberOrPercent(value, 100));
  if (hasNaN([c, m, y, k])) {
    return null;
  }

  return createColorOrNull({ c, m, y, k });
}

function parseLAB(params: string): Color | null {
  const labParams = splitColorFunctionParams(params, { expectedChannels: 3 });
  if (!labParams) {
    return null;
  }

  const [l, a, b] = [
    parseNumberOrPercent(labParams.channels[0], 100),
    parseFloat(labParams.channels[1]),
    parseFloat(labParams.channels[2]),
  ];
  if (hasNaN([l, a, b])) {
    return null;
  }

  return createColorOrNull({ l, a, b, format: 'LAB' });
}

function parseLCH(params: string): Color | null {
  const lchParams = splitColorFunctionParams(params, { expectedChannels: 3 });
  if (!lchParams) {
    return null;
  }

  const [l, c, h] = [
    parseNumberOrPercent(lchParams.channels[0], 100),
    parseFloat(lchParams.channels[1]),
    parseHueAngle(lchParams.channels[2]),
  ];
  if (hasNaN([l, c, h])) {
    return null;
  }

  return createColorOrNull({ l, c, h, format: 'LCH' });
}

function parseOKLAB(params: string): Color | null {
  const oklabParams = splitColorFunctionParams(params, {
    expectedChannels: 3,
    allowAlpha: true,
    allowSlashForAlpha: true,
  });
  if (!oklabParams) {
    return null;
  }

  const [l, a, b] = [
    parseFloat(oklabParams.channels[0]),
    parseFloat(oklabParams.channels[1]),
    parseFloat(oklabParams.channels[2]),
  ];
  if (hasNaN([l, a, b])) {
    return null;
  }
  if (l < 0 || l > 1) {
    return null;
  }

  const parsedColor = createColorOrNull({ l, a, b, format: 'OKLAB' });
  if (!parsedColor) {
    return null;
  }

  if (oklabParams.alpha === undefined) {
    return parsedColor;
  }

  const alpha = parseAlpha(oklabParams.alpha);
  if (alpha === null) {
    return null;
  }

  return parsedColor.setAlpha(alpha);
}

function parseOKLCH(params: string): Color | null {
  const oklchParams = splitColorFunctionParams(params, { expectedChannels: 3 });
  if (!oklchParams) {
    return null;
  }

  const [l, c, h] = [
    parseFloat(oklchParams.channels[0]),
    parseFloat(oklchParams.channels[1]),
    parseHueAngle(oklchParams.channels[2]),
  ];
  if (hasNaN([l, c, h])) {
    return null;
  }
  if (l < 0 || l > 1) {
    return null;
  }

  return createColorOrNull({ l, c, h });
}

const CSS_COLOR_PARSERS: {
  match: RegExp;
  parse: (params: string) => Color | null;
}[] = [
  { match: MATCH_COLOR_FUNCTION_REGEX, parse: parseColor },
  { match: MATCH_RGB_STRING_REGEX, parse: parseRGB },
  { match: MATCH_RGBA_STRING_REGEX, parse: parseRGBA },
  { match: MATCH_HSL_STRING_REGEX, parse: parseHSL },
  { match: MATCH_HSLA_STRING_REGEX, parse: parseHSLA },
  { match: MATCH_HSV_STRING_REGEX, parse: parseHSV },
  { match: MATCH_HSVA_STRING_REGEX, parse: parseHSVA },
  { match: MATCH_HWB_STRING_REGEX, parse: parseHWB },
  { match: MATCH_CMYK_STRING_REGEX, parse: parseCMYK },
  { match: MATCH_LAB_STRING_REGEX, parse: parseLAB },
  { match: MATCH_LCH_STRING_REGEX, parse: parseLCH },
  { match: MATCH_OKLAB_STRING_REGEX, parse: parseOKLAB },
  { match: MATCH_OKLCH_STRING_REGEX, parse: parseOKLCH },
] as const;

export function parseCSSColorFormatString(colorFormatString: string): Color | null {
  const normalizedColorFormatString = colorFormatString.trim().toLowerCase();

  for (const parserDefinition of CSS_COLOR_PARSERS) {
    const match = normalizedColorFormatString.match(parserDefinition.match);
    if (match) {
      return parserDefinition.parse(match[1].trim());
    }
  }

  return null;
}
