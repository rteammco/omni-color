import { Color } from '../../../dist';
import { useColorBackgroundAndBorderColors } from './utils';

interface Props {
  color: Color;
  hideBorder?: boolean;
  label?: string;
  noBorderRadius?: boolean;
}

export function ColorBox({ color, hideBorder, label, noBorderRadius }: Props) {
  const { backgroundColor, borderColor } = useColorBackgroundAndBorderColors(color);

  return (
    <div
      style={{ backgroundColor, borderColor }}
      className={`w-16 h-16 flex flex-col justify-end ${hideBorder ? 'border-0' : 'border-1'} ${
        noBorderRadius ? 'rounded-0' : 'rounded-md'
      }`}
    >
      <span
        className={`pb-1 text-xs ${
          new Color(backgroundColor).isDark() ? 'text-white' : 'text-black'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
