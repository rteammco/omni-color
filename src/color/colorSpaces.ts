import { type CaseInsensitive, clampValue } from '../utils';
import type { ColorRGB } from './formats';
import { linearChannelToSrgb, srgbChannelToLinear } from './utils';

export type ColorSpace = 'SRGB' | 'DISPLAY-P3' | 'REC2020';

export interface ColorSpaceValues {
  r: number;
  g: number;
  b: number;
}

export interface ColorStringOptions {
  space?: CaseInsensitive<ColorSpace>;
}

const SRGB_TO_XYZ_MATRIX: readonly number[][] = [
  [0.41239079926595934, 0.357584339383878, 0.1804807884018343],
  [0.21263900587151027, 0.715168678767756, 0.07219231536073371],
  [0.01933081871559185, 0.11919477979462598, 0.9505321522496607],
];

const XYZ_TO_SRGB_MATRIX: readonly number[][] = [
  [3.240969941904521, -1.537383177570093, -0.498610760293],
  [-0.96924363628087, 1.87596750150772, 0.041555057407175],
  [0.055630079696993, -0.20397695888897, 1.056971514242878],
];

const DISPLAY_P3_TO_XYZ_MATRIX: readonly number[][] = [
  [0.4865709486482162, 0.26566769316909306, 0.1982172852343625],
  [0.2289745640697488, 0.6917385218365064, 0.079286914093745],
  [0, 0.04511338185890264, 1.043944368900976],
];

const XYZ_TO_DISPLAY_P3_MATRIX: readonly number[][] = [
  [2.493496911941425, -0.9313836179191239, -0.40271078445071684],
  [-0.8294889695615747, 1.7626640603183463, 0.023624685841943577],
  [0.03584583024378447, -0.07617238926804182, 0.9568845240076872],
];

const REC2020_TO_XYZ_MATRIX: readonly number[][] = [
  [0.6369580483012914, 0.14461690358620832, 0.1688809751641721],
  [0.2627002120112671, 0.6779980715188708, 0.05930171646986196],
  [0, 0.028072693049087428, 1.060985057710791],
];

const XYZ_TO_REC2020_MATRIX: readonly number[][] = [
  [1.716651187971268, -0.355670783776392, -0.25336628137366],
  [-0.666684351832489, 1.616481236634939, 0.0157685458139111],
  [0.0176398574453108, -0.0427706132578085, 0.942103121235474],
];

const REC2020_ALPHA = 1.09929682680944;
const REC2020_BETA = 0.018053968510807;
const REC2020_GAMMA = 0.45;

function multiply3x3(matrix: readonly number[][], vector: readonly number[]): [number, number, number] {
  const [x, y, z] = vector;
  return [
    matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z,
    matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z,
    matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z,
  ];
}

function decodeRec2020Channel(encoded: number): number {
  const value = clampValue(encoded, 0, 1);
  if (value < 4.5 * REC2020_BETA) {
    return value / 4.5;
  }
  return ((value + (REC2020_ALPHA - 1)) / REC2020_ALPHA) ** (1 / REC2020_GAMMA);
}

function encodeRec2020Channel(linear: number): number {
  const value = clampValue(linear, 0, 1);
  if (value < REC2020_BETA) {
    return value * 4.5;
  }
  return REC2020_ALPHA * value ** REC2020_GAMMA - (REC2020_ALPHA - 1);
}

function decodeColorSpaceChannel(value: number, space: ColorSpace): number {
  if (space === 'REC2020') {
    return decodeRec2020Channel(value);
  }
  return srgbChannelToLinear(value * 255, 'SRGB');
}

function encodeColorSpaceChannel(value: number, space: ColorSpace): number {
  if (space === 'REC2020') {
    return clampValue(encodeRec2020Channel(value), 0, 1);
  }
  return clampValue(linearChannelToSrgb(value, 'SRGB') / 255, 0, 1);
}

function getSpaceToXYZMatrix(space: ColorSpace): readonly number[][] {
  if (space === 'DISPLAY-P3') {
    return DISPLAY_P3_TO_XYZ_MATRIX;
  }
  if (space === 'REC2020') {
    return REC2020_TO_XYZ_MATRIX;
  }
  return SRGB_TO_XYZ_MATRIX;
}

function getXYZToSpaceMatrix(space: ColorSpace): readonly number[][] {
  if (space === 'DISPLAY-P3') {
    return XYZ_TO_DISPLAY_P3_MATRIX;
  }
  if (space === 'REC2020') {
    return XYZ_TO_REC2020_MATRIX;
  }
  return XYZ_TO_SRGB_MATRIX;
}

export function parseColorSpace(space: string): ColorSpace | null {
  const normalized = space.trim().toUpperCase();
  if (normalized === 'SRGB' || normalized === 'DISPLAY-P3' || normalized === 'REC2020') {
    return normalized as ColorSpace;
  }
  return null;
}

export function resolveColorSpace(space?: CaseInsensitive<ColorSpace>): ColorSpace {
  return parseColorSpace(space ?? 'SRGB') ?? 'SRGB';
}

export function convertColorSpaceValuesToRGB(values: ColorSpaceValues, space: ColorSpace): ColorRGB {
  const linear = [
    decodeColorSpaceChannel(values.r, space),
    decodeColorSpaceChannel(values.g, space),
    decodeColorSpaceChannel(values.b, space),
  ] as const;

  const srgbLinear =
    space === 'SRGB' ? linear : multiply3x3(XYZ_TO_SRGB_MATRIX, multiply3x3(getSpaceToXYZMatrix(space), linear));

  return {
    r: Math.round(clampValue(linearChannelToSrgb(srgbLinear[0], 'SRGB'), 0, 255)),
    g: Math.round(clampValue(linearChannelToSrgb(srgbLinear[1], 'SRGB'), 0, 255)),
    b: Math.round(clampValue(linearChannelToSrgb(srgbLinear[2], 'SRGB'), 0, 255)),
  };
}

export function convertRGBToColorSpaceValues(rgb: ColorRGB, space: ColorSpace): ColorSpaceValues {
  const srgbLinear = [
    srgbChannelToLinear(rgb.r, 'SRGB'),
    srgbChannelToLinear(rgb.g, 'SRGB'),
    srgbChannelToLinear(rgb.b, 'SRGB'),
  ] as const;

  const targetLinear =
    space === 'SRGB' ? srgbLinear : multiply3x3(getXYZToSpaceMatrix(space), multiply3x3(SRGB_TO_XYZ_MATRIX, srgbLinear));

  return {
    r: encodeColorSpaceChannel(targetLinear[0], space),
    g: encodeColorSpaceChannel(targetLinear[1], space),
    b: encodeColorSpaceChannel(targetLinear[2], space),
  };
}
