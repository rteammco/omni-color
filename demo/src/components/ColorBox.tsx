import type { Color } from '../../../dist';
import { useColorBackgroundAndBorderColors } from './utils';

interface Props {
  color: Color;
}

export function ColorBox({ color }: Props) {
  const { backgroundColor, borderColor } = useColorBackgroundAndBorderColors(color);

  return <div style={{ backgroundColor, borderColor }} className="w-16 h-16 border-1 rounded-md" />;
}
