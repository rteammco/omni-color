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
  overlaySize?: 'SMALL' | 'LARGE'; // 'LARGE' is default
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
  overlaySize = 'LARGE',
  overlayText,
  width = 'NORMAL',
}: Props) {
  const textColor = color.isDark() ? 'white' : 'black';
  const textColorClass = color.isDark() ? 'text-white' : 'text-black';
  const { backgroundColor, borderColor } = useColorBackgroundAndBorderColors(color);

  const overlayContent = useMemo(() => {
    if (overlayIcon) {
      return (
        <div className="flex justify-center items-center">
          <Icon color={textColor} type={overlayIcon} />
        </div>
      );
    }

    if (overlayText || overlayColor) {
      const text = overlayText ?? getOverlayColorLetters(overlayColor ?? new Color(textColor));
      const textStyle = { color: overlayColor?.toHex() ?? textColor };
      if (overlaySize === 'SMALL') {
        return (
          <h6 className="text-center" style={textStyle}>
            {text}
          </h6>
        );
      }
      return (
        <h4 className="text-center font-bold" style={textStyle}>
          {text}
        </h4>
      );
    }

    return undefined;
  }, [overlayColor, overlayIcon, overlaySize, overlayText, textColor]);

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
      {label && <div className={`py-1 text-xs ${textColorClass}`}>{label}</div>}
    </div>
  );
}
