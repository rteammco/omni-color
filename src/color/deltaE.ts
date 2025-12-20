import type { CaseInsensitive } from '../utils';
import type { Color } from './color';

export type DeltaEMethod = 'CIE76' | 'CIE94' | 'CIEDE2000';

/**
 * Optional weighting factors for the CIE94 Delta E calculation.
 *
 * These values tune the relative importance of lightness, chroma, and hue
 * differences for a specific application domain (e.g., graphic arts vs.
 * textiles). When omitted, the graphic arts defaults are used.
 */
export interface CIE94Options {
  /** Lightness weighting factor (k_L). Defaults to 1. */
  kL?: number;
  /** Chroma weighting factor (k_C). Defaults to 1. */
  kC?: number;
  /** Hue weighting factor (k_H). Defaults to 1. */
  kH?: number;
  /** Application-specific chroma scaling constant (K_1). Defaults to 0.045. */
  K1?: number;
  /** Application-specific hue scaling constant (K_2). Defaults to 0.015. */
  K2?: number;
}

/**
 * Optional weighting factors for the CIEDE2000 Delta E calculation.
 *
 * These values tune the relative importance of lightness, chroma, and hue
 * differences. When omitted, the standard defaults are used.
 */
export interface CIEDE2000Options {
  /** Lightness weighting factor (k_L). Defaults to 1. */
  kL?: number;
  /** Chroma weighting factor (k_C). Defaults to 1. */
  kC?: number;
  /** Hue weighting factor (k_H). Defaults to 1. */
  kH?: number;
}

/**
 * Options for Delta E calculations.
 *
 * Specify the `method` to select the formula. If `method` is `'CIE94'`,
 * pass `cie94Options` to customize weighting factors. For `'CIEDE2000'`,
 * use `ciede2000Options` for similar weighting.
 */
export type DeltaEOptions =
  | {
      method?: CaseInsensitive<'CIEDE2000'>;
      cie94Options?: never;
      ciede2000Options?: CIEDE2000Options;
    }
  | {
      method: CaseInsensitive<'CIE94'>;
      cie94Options?: CIE94Options;
      ciede2000Options?: never;
    }
  | {
      method: CaseInsensitive<'CIE76'>;
      cie94Options?: never;
      ciede2000Options?: never;
    };

function deltaECIE76(colorA: Color, colorB: Color): number {
  const lab1 = colorA.toLAB();
  const lab2 = colorB.toLAB();
  const deltaL = lab1.l - lab2.l;
  const deltaA = lab1.a - lab2.a;
  const deltaB = lab1.b - lab2.b;
  return Math.sqrt(deltaL ** 2 + deltaA ** 2 + deltaB ** 2);
}

function deltaECIE94(colorA: Color, colorB: Color, options: CIE94Options = {}): number {
  const { kL = 1, kC = 1, kH = 1, K1 = 0.045, K2 = 0.015 } = options;
  const lab1 = colorA.toLAB();
  const lab2 = colorB.toLAB();

  const deltaL = lab1.l - lab2.l;
  const c1 = Math.sqrt(lab1.a ** 2 + lab1.b ** 2);
  const c2 = Math.sqrt(lab2.a ** 2 + lab2.b ** 2);
  const deltaC = c1 - c2;

  const deltaA = lab1.a - lab2.a;
  const deltaB = lab1.b - lab2.b;
  const deltaH = Math.sqrt(Math.max(0, deltaA ** 2 + deltaB ** 2 - deltaC ** 2));

  const sL = 1;
  const sC = 1 + K1 * c1;
  const sH = 1 + K2 * c1;

  const lTerm = deltaL / (kL * sL);
  const cTerm = deltaC / (kC * sC);
  const hTerm = deltaH / (kH * sH);

  return Math.sqrt(lTerm ** 2 + cTerm ** 2 + hTerm ** 2);
}

function deltaECIEDE2000(colorA: Color, colorB: Color, options: CIEDE2000Options = {}): number {
  const { kL = 1, kC = 1, kH = 1 } = options;
  const lab1 = colorA.toLAB();
  const lab2 = colorB.toLAB();

  const lBar = (lab1.l + lab2.l) / 2;
  const c1 = Math.sqrt(lab1.a ** 2 + lab1.b ** 2);
  const c2 = Math.sqrt(lab2.a ** 2 + lab2.b ** 2);
  const cBar = (c1 + c2) / 2;

  const cBar7 = cBar ** 7;
  const g = 0.5 * (1 - Math.sqrt(cBar7 / (cBar7 + 25 ** 7)));

  const a1Prime = lab1.a * (1 + g);
  const a2Prime = lab2.a * (1 + g);

  const c1Prime = Math.sqrt(a1Prime ** 2 + lab1.b ** 2);
  const c2Prime = Math.sqrt(a2Prime ** 2 + lab2.b ** 2);
  const cBarPrime = (c1Prime + c2Prime) / 2;

  const h1Prime = Math.atan2(lab1.b, a1Prime);
  const h2Prime = Math.atan2(lab2.b, a2Prime);

  const h1PrimeDeg = (h1Prime * 180) / Math.PI + (h1Prime < 0 ? 360 : 0);
  const h2PrimeDeg = (h2Prime * 180) / Math.PI + (h2Prime < 0 ? 360 : 0);

  const deltaLPrime = lab2.l - lab1.l;
  const deltaCPrime = c2Prime - c1Prime;

  let deltaHPrime: number;
  if (c1Prime * c2Prime === 0) {
    deltaHPrime = 0;
  } else if (Math.abs(h2PrimeDeg - h1PrimeDeg) <= 180) {
    deltaHPrime = h2PrimeDeg - h1PrimeDeg;
  } else if (h2PrimeDeg <= h1PrimeDeg) {
    deltaHPrime = h2PrimeDeg - h1PrimeDeg + 360;
  } else {
    deltaHPrime = h2PrimeDeg - h1PrimeDeg - 360;
  }

  deltaHPrime = 2 * Math.sqrt(c1Prime * c2Prime) * Math.sin((deltaHPrime * Math.PI) / 360);

  const hBarPrime = (() => {
    if (c1Prime * c2Prime === 0) {
      return h1PrimeDeg + h2PrimeDeg;
    }
    if (Math.abs(h1PrimeDeg - h2PrimeDeg) > 180) {
      return (h1PrimeDeg + h2PrimeDeg + 360) / 2;
    }
    return (h1PrimeDeg + h2PrimeDeg) / 2;
  })();

  const lBarMinus50Squared = (lBar - 50) ** 2;
  const sL = 1 + (0.015 * lBarMinus50Squared) / Math.sqrt(20 + lBarMinus50Squared);
  const sC = 1 + 0.045 * cBarPrime;
  const t =
    1 -
    0.17 * Math.cos(((hBarPrime - 30) * Math.PI) / 180) +
    0.24 * Math.cos((2 * hBarPrime * Math.PI) / 180) +
    0.32 * Math.cos(((3 * hBarPrime + 6) * Math.PI) / 180) -
    0.2 * Math.cos(((4 * hBarPrime - 63) * Math.PI) / 180);

  const sH = 1 + 0.015 * cBarPrime * t;

  const deltaTheta = 30 * Math.exp(-1 * ((hBarPrime - 275) / 25) ** 2);
  const rC = 2 * Math.sqrt(cBarPrime ** 7 / (cBarPrime ** 7 + 25 ** 7));
  const rT = -rC * Math.sin((2 * deltaTheta * Math.PI) / 180);

  const lTerm = deltaLPrime / (kL * sL);
  const cTerm = deltaCPrime / (kC * sC);
  const hTerm = deltaHPrime / (kH * sH);

  return Math.sqrt(lTerm ** 2 + cTerm ** 2 + hTerm ** 2 + rT * cTerm * hTerm);
}

export function getDeltaE(colorA: Color, colorB: Color, options: DeltaEOptions = {}): number {
  const method = options.method?.toUpperCase() ?? ('CIEDE2000' as DeltaEMethod);

  if (method === 'CIE76') {
    return deltaECIE76(colorA, colorB);
  }
  if (method === 'CIE94') {
    const cie94Options = 'cie94Options' in options ? options.cie94Options : undefined;
    return deltaECIE94(colorA, colorB, cie94Options);
  }
  if (method === 'CIEDE2000') {
    const ciede2000Options = 'ciede2000Options' in options ? options.ciede2000Options : undefined;
    return deltaECIEDE2000(colorA, colorB, ciede2000Options);
  }

  throw new Error(`Unsupported Delta E method: ${method}`);
}
