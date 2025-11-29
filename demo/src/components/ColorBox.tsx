import { useMemo } from 'react';
import { Color } from '../../../dist';
import type { IconType } from './Icon.types';
import { useColorBackgroundAndBorderColors } from './utils';
import { Icon } from './Icon';

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
  overlayIcon?: IconType;
  overlayText?: string;
  width?: 'NORMAL' | 'DOUBLE' | 'HALF' | 'STRETCH'; // 'NORMAL' is default
}

export function ColorBox({
  color,
  hideBorder,
  label,
  noBorderRadius,
  overlayColor,
  overlayIcon,
  overlayText,
  width,
}: Props) {
  const textColor = color.isDark() ? 'text-white' : 'text-black';
  const { backgroundColor, borderColor } = useColorBackgroundAndBorderColors(color);

  const overlayContent = useMemo(() => {
    if (overlayIcon) {
      return (
        <div className="flex justify-center items-center">
          <Icon color={color.isDark() ? 'white' : 'black'} type={overlayIcon} />
        </div>
      );
    }

    if (overlayText || overlayColor) {
      return (
        <h4 className="text-center font-bold" style={{ color: overlayColor?.toHex() ?? textColor }}>
          {overlayText ?? getOverlayColorLetters(overlayColor ?? color)}
        </h4>
      );
    }

    return undefined;
  }, [color, overlayColor, overlayIcon, overlayText, textColor]);

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
      className={`${widthClass} h-16 flex flex-col ${label ? 'justify-end' : 'justify-center'} ${
        hideBorder ? 'border-0' : 'border'
      } ${noBorderRadius ? 'rounded-none' : 'rounded-md'}`}
    >
      {overlayContent}
      {label && <div className={`pb-1 pt-0.5 text-xs ${textColor}`}>{label}</div>}
    </div>
  );
}
