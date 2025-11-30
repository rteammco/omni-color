import { useMemo } from 'react';
import type { Color } from '../../../dist';

export enum DemoSectionIDs {
  PICK_COLOR = 'section-pick-color',
  COLOR_INFO = 'section-color-info',
  READABILITY = 'section-readability',
  MANIPULATIONS = 'section-manipulations',
  COMBINATIONS = 'section-combinations',
  HARMONIES = 'section-harmonies',
  PALETTE = 'section-palette',
  PLAYGROUND = 'section-playground',
}

export function useIsDarkMode() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function useColorBackgroundAndBorderColors(color: Color) {
  return useMemo(() => {
    return {
      backgroundColor: color.toHex8(),
      borderColor: color.getComplementaryColors()[1].toHex(),
    };
  }, [color]);
}
