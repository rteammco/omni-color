import { Color } from './color';
import type { ColorFormat } from './formats';

const MATCH_RGB_STRING_REGEX = /^rgb\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*\)$/;
const MATCH_RGBA_STRING_REGEX = /^rgba\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)$/;
const MATCH_HSL_STRING_REGEX = /^hsl\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)$/;
const MATCH_HSLA_STRING_REGEX = /^hsla\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)$/;
const MATCH_HSV_STRING_REGEX = /^hsv\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)$/;
const MATCH_HSVA_STRING_REGEX = /^hsva\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)$/;
const MATCH_CMYK_STRING_REGEX = /^cmyk\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)$/;
const MATCH_LCH_STRING_REGEX = /^lch\(\s*([^ ]+)\s+([^ ]+)\s+([^\)]+)\)$/;
const MATCH_OKLCH_STRING_REGEX = /^oklch\(\s*([^ ]+)\s+([^ ]+)\s+([^\)]+)\)$/;

function parseNumberOrPercent(value: string, scale: number): number {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return NaN;
  }
  return value.trim().endsWith('%') ? (num / 100) * scale : num;
}

function parseAlphaValue(value: string): number {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return NaN;
  }
  const normalized = value.trim().endsWith('%') ? num / 100 : num;
  return +normalized.toFixed(3);
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
    const r = Math.round(parseNumberOrPercent(rgbMatch[1], 255));
    const g = Math.round(parseNumberOrPercent(rgbMatch[2], 255));
    const b = Math.round(parseNumberOrPercent(rgbMatch[3], 255));
    if ([r, g, b].some((v) => isNaN(v))) {
      return null;
    }
    return createColorOrNull({ r, g, b });
  }

  const rgbaMatch = str.match(MATCH_RGBA_STRING_REGEX);
  if (rgbaMatch) {
    const r = Math.round(parseNumberOrPercent(rgbaMatch[1], 255));
    const g = Math.round(parseNumberOrPercent(rgbaMatch[2], 255));
    const b = Math.round(parseNumberOrPercent(rgbaMatch[3], 255));
    const a = parseAlphaValue(rgbaMatch[4]);
    if ([r, g, b, a].some((v) => isNaN(v))) {
      return null;
    }
    return createColorOrNull({ r, g, b, a });
  }

  const hslMatch = str.match(MATCH_HSL_STRING_REGEX);
  if (hslMatch) {
    const h = Math.round(parseFloat(hslMatch[1]));
    const s = Math.round(parseNumberOrPercent(hslMatch[2], 100));
    const l = Math.round(parseNumberOrPercent(hslMatch[3], 100));
    if ([h, s, l].some((v) => isNaN(v))) {
      return null;
    }
    return createColorOrNull({ h, s, l });
  }

  const hslaMatch = str.match(MATCH_HSLA_STRING_REGEX);
  if (hslaMatch) {
    const h = Math.round(parseFloat(hslaMatch[1]));
    const s = Math.round(parseNumberOrPercent(hslaMatch[2], 100));
    const l = Math.round(parseNumberOrPercent(hslaMatch[3], 100));
    const a = parseAlphaValue(hslaMatch[4]);
    if ([h, s, l, a].some((v) => isNaN(v))) {
      return null;
    }
    return createColorOrNull({ h, s, l, a });
  }

  const hsvMatch = str.match(MATCH_HSV_STRING_REGEX);
  if (hsvMatch) {
    const h = Math.round(parseFloat(hsvMatch[1]));
    const s = Math.round(parseNumberOrPercent(hsvMatch[2], 100));
    const v = Math.round(parseNumberOrPercent(hsvMatch[3], 100));
    if ([h, s, v].some((v) => isNaN(v))) {
      return null;
    }
    return createColorOrNull({ h, s, v });
  }

  const hsvaMatch = str.match(MATCH_HSVA_STRING_REGEX);
  if (hsvaMatch) {
    const h = Math.round(parseFloat(hsvaMatch[1]));
    const s = Math.round(parseNumberOrPercent(hsvaMatch[2], 100));
    const v = Math.round(parseNumberOrPercent(hsvaMatch[3], 100));
    const a = parseAlphaValue(hsvaMatch[4]);
    if ([h, s, v, a].some((v) => isNaN(v))) {
      return null;
    }
    return createColorOrNull({ h, s, v, a });
  }

  const cmykMatch = str.match(MATCH_CMYK_STRING_REGEX);
  if (cmykMatch) {
    const c = parseNumberOrPercent(cmykMatch[1], 100);
    const m = parseNumberOrPercent(cmykMatch[2], 100);
    const y = parseNumberOrPercent(cmykMatch[3], 100);
    const k = parseNumberOrPercent(cmykMatch[4], 100);
    if ([c, m, y, k].some((v) => isNaN(v))) {
      return null;
    }
    return createColorOrNull({ c, m, y, k });
  }

  const lchMatch = str.match(MATCH_LCH_STRING_REGEX);
  if (lchMatch) {
    const l = parseNumberOrPercent(lchMatch[1], 100);
    const c = parseFloat(lchMatch[2]);
    const h = parseFloat(lchMatch[3]);
    if ([l, c, h].some((v) => isNaN(v))) {
      return null;
    }
    return createColorOrNull({ l, c, h });
  }

  const oklchMatch = str.match(MATCH_OKLCH_STRING_REGEX);
  if (oklchMatch) {
    const l = parseFloat(oklchMatch[1]);
    const c = parseFloat(oklchMatch[2]);
    const h = parseFloat(oklchMatch[3]);
    if ([l, c, h].some((v) => isNaN(v))) {
      return null;
    }
    if (l < 0 || l > 1) {
      return null;
    }
    return createColorOrNull({ l, c, h });
  }

  return null;
}
