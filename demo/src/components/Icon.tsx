import { IconType } from './Icon.types';
import ArrowRight from '../assets/icons/arrow-right.svg?react';
import CheckCircle from '../assets/icons/check-circle.svg?react';
import Plus from '../assets/icons/plus.svg?react';
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
    case IconType.CHECK_CIRCLE:
      return <CheckCircle {...iconProps} />;
    case IconType.PLUS:
      return <Plus {...iconProps} />;
    case IconType.X_CIRCLE:
      return <XCircle {...iconProps} />;
    default:
      return null;
  }
}

Icon.TYPE = IconType;
