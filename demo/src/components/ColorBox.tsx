import { Color } from '../../../dist';
import { useColorBackgroundAndBorderColors } from './utils';

function getFirstLetterOfColorName(color: Color): string {
  const { name } = color.getName();
  return name.substring(0, 1).toUpperCase();
}

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
          {getFirstLetterOfColorName(overlayColor)}
        </h4>
      )}
      <span className={`pb-1 text-xs ${color.isDark() ? 'text-white' : 'text-black'}`}>
        {label}
      </span>
    </div>
  );
}
