import { Color } from './color';
import type { ColorFormat } from './formats';

function parseNumberOrPercent(value: string, scale: number): number {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return NaN;
  }
  return value.trim().endsWith('%') ? (num / 100) * scale : num;
}

function parseAlpha(value: string): number {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return NaN;
  }
  const normalized = value.trim().endsWith('%') ? num / 100 : num;
  return +normalized.toFixed(3);
}

export function parseCSSColorFormatString(colorFormatString: string): Color | null {
  if (!colorFormatString) {
    return null;
  }

  const str = colorFormatString.trim().toLowerCase();

  const makeColor = (format: ColorFormat): Color | null => {
    try {
      return new Color(format);
    } catch {
      return null;
    }
  };

  const rgbMatch = str.match(/^rgb\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*\)$/);
  if (rgbMatch) {
    const r = Math.round(parseNumberOrPercent(rgbMatch[1], 255));
    const g = Math.round(parseNumberOrPercent(rgbMatch[2], 255));
    const b = Math.round(parseNumberOrPercent(rgbMatch[3], 255));
    if ([r, g, b].some((v) => isNaN(v))) {
      return null;
    }
    return makeColor({ r, g, b });
  }

  const rgbaMatch = str.match(/^rgba\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)$/);
  if (rgbaMatch) {
    const r = Math.round(parseNumberOrPercent(rgbaMatch[1], 255));
    const g = Math.round(parseNumberOrPercent(rgbaMatch[2], 255));
    const b = Math.round(parseNumberOrPercent(rgbaMatch[3], 255));
    const a = parseAlpha(rgbaMatch[4]);
    if ([r, g, b, a].some((v) => isNaN(v))) {
      return null;
    }
    return makeColor({ r, g, b, a });
  }

  const hslMatch = str.match(/^hsl\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)$/);
  if (hslMatch) {
    const h = Math.round(parseFloat(hslMatch[1]));
    const s = Math.round(parseNumberOrPercent(hslMatch[2], 100));
    const l = Math.round(parseNumberOrPercent(hslMatch[3], 100));
    if ([h, s, l].some((v) => isNaN(v))) {
      return null;
    }
    return makeColor({ h, s, l });
  }

  const hslaMatch = str.match(/^hsla\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)$/);
  if (hslaMatch) {
    const h = Math.round(parseFloat(hslaMatch[1]));
    const s = Math.round(parseNumberOrPercent(hslaMatch[2], 100));
    const l = Math.round(parseNumberOrPercent(hslaMatch[3], 100));
    const a = parseAlpha(hslaMatch[4]);
    if ([h, s, l, a].some((v) => isNaN(v))) {
      return null;
    }
    return makeColor({ h, s, l, a });
  }

  const hsvMatch = str.match(/^hsv\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)$/);
  if (hsvMatch) {
    const h = Math.round(parseFloat(hsvMatch[1]));
    const s = Math.round(parseNumberOrPercent(hsvMatch[2], 100));
    const v = Math.round(parseNumberOrPercent(hsvMatch[3], 100));
    if ([h, s, v].some((v) => isNaN(v))) {
      return null;
    }
    return makeColor({ h, s, v });
  }

  const hsvaMatch = str.match(/^hsva\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)$/);
  if (hsvaMatch) {
    const h = Math.round(parseFloat(hsvaMatch[1]));
    const s = Math.round(parseNumberOrPercent(hsvaMatch[2], 100));
    const v = Math.round(parseNumberOrPercent(hsvaMatch[3], 100));
    const a = parseAlpha(hsvaMatch[4]);
    if ([h, s, v, a].some((v) => isNaN(v))) {
      return null;
    }
    return makeColor({ h, s, v, a });
  }

  const cmykMatch = str.match(/^cmyk\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)$/);
  if (cmykMatch) {
    const c = parseNumberOrPercent(cmykMatch[1], 100);
    const m = parseNumberOrPercent(cmykMatch[2], 100);
    const y = parseNumberOrPercent(cmykMatch[3], 100);
    const k = parseNumberOrPercent(cmykMatch[4], 100);
    if ([c, m, y, k].some((v) => isNaN(v))) {
      return null;
    }
    return makeColor({ c, m, y, k });
  }

  const lchMatch = str.match(/^lch\(\s*([^ ]+)\s+([^ ]+)\s+([^\)]+)\)$/);
  if (lchMatch) {
    const l = parseNumberOrPercent(lchMatch[1], 100);
    const c = parseFloat(lchMatch[2]);
    const h = parseFloat(lchMatch[3]);
    if ([l, c, h].some((v) => isNaN(v))) {
      return null;
    }
    return makeColor({ l, c, h });
  }

  const oklchMatch = str.match(/^oklch\(\s*([^ ]+)\s+([^ ]+)\s+([^\)]+)\)$/);
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
    return makeColor({ l, c, h });
  }

  return null;
}
