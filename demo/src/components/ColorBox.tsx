import { Color } from '../../../dist';
import { useColorBackgroundAndBorderColors } from './utils';

interface Props {
  color: Color;
  hideBorder?: boolean;
  label?: string;
  noBorderRadius?: boolean;
  overlayColor?: Color;
}

export function ColorBox({ color, hideBorder, label, noBorderRadius, overlayColor }: Props) {
  const { backgroundColor, borderColor } = useColorBackgroundAndBorderColors(color);

  return (
    <div
      style={{ backgroundColor, borderColor }}
      className={`w-16 h-16 flex flex-col justify-end ${hideBorder ? 'border-0' : 'border-1'} ${
        noBorderRadius ? 'rounded-0' : 'rounded-md'
      }`}
    >
      {overlayColor && (
        <h4 className="font-bold" style={{ color: overlayColor.toHex() }}>
          {overlayColor.getName().name.toUpperCase().substring(0, 1)}
        </h4>
      )}
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
