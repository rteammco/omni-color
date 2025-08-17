import type { Color } from '../../../dist';
import { useColorBackgroundAndBorderColors } from './utils';

interface Props {
  color: Color;
  hideBorder?: boolean;
  noBorderRadius?: boolean;
}

export function ColorBox({ color, hideBorder, noBorderRadius }: Props) {
  const { backgroundColor, borderColor } = useColorBackgroundAndBorderColors(color);

  return (
    <div
      style={{ backgroundColor, borderColor }}
      className={`w-16 h-16 ${hideBorder ? 'border-0' : 'border-1'} ${
        noBorderRadius ? 'rounded-0' : 'rounded-md'
      }`}
    />
  );
}
