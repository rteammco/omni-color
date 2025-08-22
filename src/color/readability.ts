import { Color } from './color';
import type { ColorRGBA } from './formats';

function compositeRGBA(fg: ColorRGBA, bg: ColorRGBA): ColorRGBA {
  const fgA = fg.a ?? 1;
  const bgA = bg.a ?? 1;
  const outA = fgA + bgA * (1 - fgA);
  if (outA === 0) {
    return { r: bg.r, g: bg.g, b: bg.b, a: 0 };
  }
  const r = (fg.r * fgA + bg.r * bgA * (1 - fgA)) / outA;
  const g = (fg.g * fgA + bg.g * bgA * (1 - fgA)) / outA;
  const b = (fg.b * fgA + bg.b * bgA * (1 - fgA)) / outA;
  return { r, g, b, a: outA };
}

function relativeLuminance(rgb: ColorRGBA): number {
  const toLinear = (channel: number): number => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const r = toLinear(rgb.r);
  const g = toLinear(rgb.g);
  const b = toLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(color1: Color, color2: Color): number {
  const c1 = color1.toRGBA();
  const c2 = color2.toRGBA();
  if ((c1.a ?? 1) === 0 && (c2.a ?? 1) === 0) {
    return 1;
  }
  const c1Over2 = c1.a !== undefined && c1.a < 1 ? compositeRGBA(c1, c2) : c1;
  const c2Over1 = c2.a !== undefined && c2.a < 1 ? compositeRGBA(c2, c1) : c2;
  const l1 = relativeLuminance(c1Over2);
  const l2 = relativeLuminance(c2Over1);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return +ratio.toFixed(2);
}

const SA98G = {
  mainTRC: 2.4,
  sRco: 0.2126729,
  sGco: 0.7151522,
  sBco: 0.0721750,
  normBG: 0.56,
  normTXT: 0.57,
  revTXT: 0.62,
  revBG: 0.65,
  blkThrs: 0.022,
  blkClmp: 1.414,
  scaleBoW: 1.14,
  scaleWoB: 1.14,
  loBoWoffset: 0.027,
  loWoBoffset: 0.027,
  deltaYmin: 0.0005,
  loClip: 0.1,
};

function sRGBtoY(rgb: ColorRGBA): number {
  const exp = SA98G.mainTRC;
  const lin = (c: number): number => Math.pow(c / 255, exp);
  return SA98G.sRco * lin(rgb.r) + SA98G.sGco * lin(rgb.g) + SA98G.sBco * lin(rgb.b);
}

function APCAcontrast(txtY: number, bgY: number): number {
  const icp = [0.0, 1.1];
  if (
    Number.isNaN(txtY) ||
    Number.isNaN(bgY) ||
    Math.min(txtY, bgY) < icp[0] ||
    Math.max(txtY, bgY) > icp[1]
  ) {
    return 0;
  }
  txtY = txtY > SA98G.blkThrs ? txtY : txtY + Math.pow(SA98G.blkThrs - txtY, SA98G.blkClmp);
  bgY = bgY > SA98G.blkThrs ? bgY : bgY + Math.pow(SA98G.blkThrs - bgY, SA98G.blkClmp);
  if (Math.abs(bgY - txtY) < SA98G.deltaYmin) {
    return 0;
  }
  let SAPC = 0;
  let outputContrast = 0;
  if (bgY > txtY) {
    SAPC = (Math.pow(bgY, SA98G.normBG) - Math.pow(txtY, SA98G.normTXT)) * SA98G.scaleBoW;
    outputContrast = SAPC < SA98G.loClip ? 0 : SAPC - SA98G.loBoWoffset;
  } else {
    SAPC = (Math.pow(bgY, SA98G.revBG) - Math.pow(txtY, SA98G.revTXT)) * SA98G.scaleWoB;
    outputContrast = SAPC > -SA98G.loClip ? 0 : SAPC + SA98G.loWoBoffset;
  }
  return outputContrast * 100;
}

/**
 * Calculate the APCA readability score (Lc value).
 *
 * Note: This is based on draft recommendations and is provided for advisory use only as WCAG 3 is not finalized.
 */
export function getAPCAReadabilityScore(foreground: Color, background: Color): number {
  const fg = foreground.toRGBA();
  const bg = background.toRGBA();

  const bgOpaque = bg.a !== undefined && bg.a < 1 ? compositeRGBA(bg, { r: 255, g: 255, b: 255, a: 1 }) : bg;
  const fgOpaque = fg.a !== undefined && fg.a < 1 ? compositeRGBA(fg, bgOpaque) : fg;

  const txtY = sRGBtoY(fgOpaque);
  const bgY = sRGBtoY(bgOpaque);
  return APCAcontrast(txtY, bgY);
}

