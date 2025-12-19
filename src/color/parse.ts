import { clampValue } from '../utils';
import { Color } from './color';
import type { ColorFormat } from './formats';

const MATCH_RGB_STRING_REGEX = /^rgb\((.+)\)$/;
const MATCH_RGBA_STRING_REGEX = /^rgba\((.+)\)$/;
const MATCH_HSL_STRING_REGEX = /^hsl\((.+)\)$/;
const MATCH_HSLA_STRING_REGEX = /^hsla\((.+)\)$/;
const MATCH_HSV_STRING_REGEX = /^hsv\((.+)\)$/;
const MATCH_HSVA_STRING_REGEX = /^hsva\((.+)\)$/;
const MATCH_CMYK_STRING_REGEX = /^cmyk\((.+)\)$/;
const MATCH_LAB_STRING_REGEX = /^lab\((.+)\)$/;
const MATCH_LCH_STRING_REGEX = /^lch\((.+)\)$/;
const MATCH_OKLCH_STRING_REGEX = /^oklch\((.+)\)$/;

interface SplitColorParamsOptions {
  allowAlpha?: boolean;
  allowSlashForAlpha?: boolean;
  expectedChannels: number;
}

interface SplitColorParamsResult {
  alpha?: string;
  channels: string[];
}

function splitColorFunctionParams(
  params: string,
  { expectedChannels, allowAlpha = false, allowSlashForAlpha = false }: SplitColorParamsOptions
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

function parseAlphaValue(value: string): number {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return NaN;
  }
  const normalized = value.trim().endsWith('%') ? num / 100 : num;
  return +normalized.toFixed(3);
}

function clampAlpha(value: number): number {
  return clampValue(value, 0, 1);
}

function normalizeHue(value: number): number {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function createColorOrNull(format: ColorFormat): Color | null {
  try {
    return new Color(format);
  } catch {
    return null;
  }
}

export function parseCSSColorFormatString(colorFormatString: string): Color | null {
  const str = colorFormatString.trim().toLowerCase();

  const rgbMatch = str.match(MATCH_RGB_STRING_REGEX);
  if (rgbMatch) {
    const rgbParams = splitColorFunctionParams(rgbMatch[1], {
      expectedChannels: 3,
      allowAlpha: true,
      allowSlashForAlpha: true,
    });
    if (!rgbParams) {
      return null;
    }

    const [r, g, b] = rgbParams.channels
      .map((value) => Math.round(parseRGBNumber(value)))
      .map((value) => clampValue(value, 0, 255));
    if ([r, g, b].some((value) => isNaN(value))) {
      return null;
    }

    if (rgbParams.alpha !== undefined) {
      const a = clampAlpha(parseAlphaValue(rgbParams.alpha));
      if (isNaN(a)) {
        return null;
      }
      return createColorOrNull({ r, g, b, a });
    }

    return createColorOrNull({ r, g, b });
  }

  const rgbaMatch = str.match(MATCH_RGBA_STRING_REGEX);
  if (rgbaMatch) {
    const rgbaParams = splitColorFunctionParams(rgbaMatch[1], {
      expectedChannels: 3,
      allowAlpha: true,
      allowSlashForAlpha: true,
    });
    if (!rgbaParams || !rgbaParams.alpha) {
      return null;
    }

    const [r, g, b] = rgbaParams.channels
      .map((value) => Math.round(parseRGBNumber(value)))
      .map((value) => clampValue(value, 0, 255));
    const a = clampAlpha(parseAlphaValue(rgbaParams.alpha));
    if ([r, g, b, a].some((value) => isNaN(value))) {
      return null;
    }
    return createColorOrNull({ r, g, b, a });
  }

  const hslMatch = str.match(MATCH_HSL_STRING_REGEX);
  if (hslMatch) {
    const hslParams = splitColorFunctionParams(hslMatch[1], {
      expectedChannels: 3,
      allowAlpha: true,
      allowSlashForAlpha: true,
    });
    if (!hslParams) {
      return null;
    }

    const [h, s, l] = [
      normalizeHue(Math.round(parseFloat(hslParams.channels[0]))),
      clampValue(Math.round(parseNumberOrPercent(hslParams.channels[1], 100)), 0, 100),
      clampValue(Math.round(parseNumberOrPercent(hslParams.channels[2], 100)), 0, 100),
    ];
    if ([h, s, l].some((value) => isNaN(value))) {
      return null;
    }
    if (hslParams.alpha !== undefined) {
      const a = clampAlpha(parseAlphaValue(hslParams.alpha));
      if (isNaN(a)) {
        return null;
      }
      return createColorOrNull({ h, s, l, a });
    }
    return createColorOrNull({ h, s, l });
  }

  const hslaMatch = str.match(MATCH_HSLA_STRING_REGEX);
  if (hslaMatch) {
    const hslaParams = splitColorFunctionParams(hslaMatch[1], {
      expectedChannels: 3,
      allowAlpha: true,
      allowSlashForAlpha: true,
    });
    if (!hslaParams || !hslaParams.alpha) {
      return null;
    }

    const [h, s, l] = [
      normalizeHue(Math.round(parseFloat(hslaParams.channels[0]))),
      clampValue(Math.round(parseNumberOrPercent(hslaParams.channels[1], 100)), 0, 100),
      clampValue(Math.round(parseNumberOrPercent(hslaParams.channels[2], 100)), 0, 100),
    ];
    const a = clampAlpha(parseAlphaValue(hslaParams.alpha));
    if ([h, s, l, a].some((value) => isNaN(value))) {
      return null;
    }
    return createColorOrNull({ h, s, l, a });
  }

  const hsvMatch = str.match(MATCH_HSV_STRING_REGEX);
  if (hsvMatch) {
    const hsvParams = splitColorFunctionParams(hsvMatch[1], {
      expectedChannels: 3,
      allowAlpha: true,
      allowSlashForAlpha: true,
    });
    if (!hsvParams) {
      return null;
    }

    const [h, s, v] = [
      normalizeHue(Math.round(parseFloat(hsvParams.channels[0]))),
      clampValue(Math.round(parseNumberOrPercent(hsvParams.channels[1], 100)), 0, 100),
      clampValue(Math.round(parseNumberOrPercent(hsvParams.channels[2], 100)), 0, 100),
    ];
    if ([h, s, v].some((value) => isNaN(value))) {
      return null;
    }
    if (hsvParams.alpha !== undefined) {
      const a = clampAlpha(parseAlphaValue(hsvParams.alpha));
      if (isNaN(a)) {
        return null;
      }
      return createColorOrNull({ h, s, v, a });
    }
    return createColorOrNull({ h, s, v });
  }

  const hsvaMatch = str.match(MATCH_HSVA_STRING_REGEX);
  if (hsvaMatch) {
    const hsvaParams = splitColorFunctionParams(hsvaMatch[1], {
      expectedChannels: 3,
      allowAlpha: true,
      allowSlashForAlpha: true,
    });
    if (!hsvaParams || !hsvaParams.alpha) {
      return null;
    }

    const [h, s, v] = [
      normalizeHue(Math.round(parseFloat(hsvaParams.channels[0]))),
      clampValue(Math.round(parseNumberOrPercent(hsvaParams.channels[1], 100)), 0, 100),
      clampValue(Math.round(parseNumberOrPercent(hsvaParams.channels[2], 100)), 0, 100),
    ];
    const a = clampAlpha(parseAlphaValue(hsvaParams.alpha));
    if ([h, s, v, a].some((value) => isNaN(value))) {
      return null;
    }
    return createColorOrNull({ h, s, v, a });
  }

  const cmykMatch = str.match(MATCH_CMYK_STRING_REGEX);
  if (cmykMatch) {
    const cmykParams = splitColorFunctionParams(cmykMatch[1], { expectedChannels: 4 });
    if (!cmykParams) {
      return null;
    }

    const [c, m, y, k] = cmykParams.channels.map((value) => parseNumberOrPercent(value, 100));
    if ([c, m, y, k].some((value) => isNaN(value))) {
      return null;
    }
    return createColorOrNull({ c, m, y, k });
  }

  const labMatch = str.match(MATCH_LAB_STRING_REGEX);
  if (labMatch) {
    const labParams = splitColorFunctionParams(labMatch[1], { expectedChannels: 3 });
    if (!labParams) {
      return null;
    }

    const [l, a, b] = [
      parseNumberOrPercent(labParams.channels[0], 100),
      parseFloat(labParams.channels[1]),
      parseFloat(labParams.channels[2]),
    ];
    if ([l, a, b].some((value) => isNaN(value))) {
      return null;
    }
    return createColorOrNull({ l, a, b });
  }

  const lchMatch = str.match(MATCH_LCH_STRING_REGEX);
  if (lchMatch) {
    const lchParams = splitColorFunctionParams(lchMatch[1], { expectedChannels: 3 });
    if (!lchParams) {
      return null;
    }

    const [l, c, h] = [
      parseNumberOrPercent(lchParams.channels[0], 100),
      parseFloat(lchParams.channels[1]),
      parseFloat(lchParams.channels[2]),
    ];
    if ([l, c, h].some((value) => isNaN(value))) {
      return null;
    }
    return createColorOrNull({ l, c, h });
  }

  const oklchMatch = str.match(MATCH_OKLCH_STRING_REGEX);
  if (oklchMatch) {
    const oklchParams = splitColorFunctionParams(oklchMatch[1], { expectedChannels: 3 });
    if (!oklchParams) {
      return null;
    }

    const [l, c, h] = [
      parseFloat(oklchParams.channels[0]),
      parseFloat(oklchParams.channels[1]),
      parseFloat(oklchParams.channels[2]),
    ];
    if ([l, c, h].some((value) => isNaN(value))) {
      return null;
    }
    if (l < 0 || l > 1) {
      return null;
    }
    return createColorOrNull({ l, c, h });
  }

  return null;
}
