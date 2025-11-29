import { IconType } from './Icon.types';
import ArrowRight from '../assets/icons/arrow-right.svg?react';
import ArrowTopRightOnSquare from '../assets/icons/arrow-top-right-on-square.svg?react';
import CheckCircle from '../assets/icons/check-circle.svg?react';
import Moon from '../assets/icons/moon.svg?react';
import Plus from '../assets/icons/plus.svg?react';
import Sun from '../assets/icons/sun.svg?react';
import XCircle from '../assets/icons/x-circle.svg?react';

interface Props {
  color?: string;
  size?: number;
  type: IconType;
}

export function Icon({ color, size = 24, type }: Props) {
  const iconProps = {
    color,
    height: size,
    width: size,
  };

  switch (type) {
    case IconType.ARROW_RIGHT:
      return <ArrowRight {...iconProps} />;
    case IconType.ARROW_TOP_RIGHT_ON_SQUARE:
      return <ArrowTopRightOnSquare {...iconProps} />;
    case IconType.CHECK_CIRCLE:
      return <CheckCircle {...iconProps} />;
    case IconType.MOON:
      return <Moon {...iconProps} />;
    case IconType.PLUS:
      return <Plus {...iconProps} />;
    case IconType.SUN:
      return <Sun {...iconProps} />;
    case IconType.X_CIRCLE:
      return <XCircle {...iconProps} />;
    default:
      return null;
  }
}

Icon.TYPE = IconType;
