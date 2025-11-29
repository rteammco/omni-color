import { Color } from '../../../dist';
import { useColorBackgroundAndBorderColors } from './utils';

function getOverlayColorLetters(color: Color): string {
  const { name } = color.getName();
  const firstLetterOfName = name.substring(0, 1).toUpperCase();
  const lastLetterOfName = name.substring(name.length - 1).toLowerCase();
  return `${firstLetterOfName}${lastLetterOfName}`;
}

interface Props {
  color: Color;
  hideBorder?: boolean;
  label?: string;
  noBorderRadius?: boolean;
  overlayColor?: Color;
  width?: 'NORMAL' | 'DOUBLE' | 'HALF' | 'STRETCH'; // 'NORMAL' is default
}

export function ColorBox({ color, hideBorder, label, noBorderRadius, overlayColor, width }: Props) {
  const { backgroundColor, borderColor } = useColorBackgroundAndBorderColors(color);

  let widthClass = 'w-16';
  if (width === 'DOUBLE') {
    widthClass = 'w-32';
  } else if (width === 'HALF') {
    widthClass = 'w-8';
  } else if (width === 'NORMAL') {
    widthClass = 'w-16';
  } else if (width === 'STRETCH') {
    widthClass = 'flex-1';
  }

  return (
    <div
      style={{ backgroundColor, borderColor }}
      className={`${widthClass} h-16 flex flex-col justify-end ${
        hideBorder ? 'border-0' : 'border'
      } ${noBorderRadius ? 'rounded-none' : 'rounded-md'}`}
    >
      {overlayColor && (
        <h4 className="font-bold" style={{ color: overlayColor.toHex() }}>
          {getOverlayColorLetters(overlayColor)}
        </h4>
      )}
      <span className={`pb-1 text-xs ${color.isDark() ? 'text-white' : 'text-black'}`}>
        {label}
      </span>
    </div>
  );
}
