import { useMemo } from 'react';
import type { Color } from '../../../dist';

export function useColorBackgroundAndBorderColors(color: Color) {
  return useMemo(() => {
    return {
      backgroundColor: color.toHex8(),
      borderColor: color.getComplementaryColors()[1].toHex(),
    };
  }, [color]);
}
