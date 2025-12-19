import { useMemo } from 'react';
import type { Color } from '../../../dist';
import { Card } from './Card';
import { Icon } from './Icon';
import { IconType } from './Icon.types';
import { useColorBackgroundAndBorderColors } from './utils';

const INFO_CONTAINER_BRIGHTNESS_ADJUSTMENT = 25;

function useInfoContainerColors(color: Color) {
  return useMemo(() => {
    const backgroundColorObj = color.isDark()
      ? color.brighten({ amount: INFO_CONTAINER_BRIGHTNESS_ADJUSTMENT })
      : color.darken({ amount: INFO_CONTAINER_BRIGHTNESS_ADJUSTMENT });

    const backgroundColor = backgroundColorObj.toHex();

    const filledTextColor = backgroundColorObj.isDark() ? 'white' : 'black';
    const outlinedTextColor = color.isDark() ? 'white' : 'black';

    const titleColor = backgroundColorObj.isDark() ? 'text-neutral-300' : 'text-neutral-700';

    return { backgroundColor, filledTextColor, outlinedTextColor, titleColor };
  }, [color]);
}

function InfoPill({
  bold,
  children,
  color,
  icon,
  variant = 'filled',
}: {
  bold?: boolean;
  children: string;
  color: Color;
  icon?: IconType;
  variant?: 'filled' | 'outlined';
}) {
  const { backgroundColor, filledTextColor, outlinedTextColor } = useInfoContainerColors(color);
  const textColor = variant === 'filled' ? filledTextColor : outlinedTextColor;

  return (
    <div
      className="inline-block px-4 py-1 rounded-full"
      style={{
        backgroundColor: variant === 'filled' ? backgroundColor : 'transparent',
        border: variant === 'outlined' ? `1px solid ${backgroundColor}` : 'transparent',
      }}
    >
      <div className="flex flex-row items-center gap-2">
        {icon && <Icon color={textColor} size={20} type={icon} />}
        <div
          className={`${bold ? 'font-bold' : ''} whitespace-nowrap`}
          style={{ color: textColor }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function InfoBox({
  color,
  colorStrings,
  title,
}: {
  color: Color;
  colorStrings: string[];
  title: string;
}) {
  const { backgroundColor, filledTextColor, titleColor } = useInfoContainerColors(color);

  const contentParts = useMemo(() => {
    const parts: React.ReactNode[] = [];
    colorStrings.forEach((colorString, index) => {
      parts.push(<span>{colorString}</span>);
      if (index < colorStrings.length - 1) {
        parts.push(<span>&middot;</span>);
      }
    });
    return parts;
  }, [colorStrings]);

  return (
    <div
      className="rounded-lg px-2 pb-1 w-full text-left"
      style={{ backgroundColor, color: filledTextColor, borderColor: filledTextColor }}
    >
      <span className={`text-xs font-mono font-semibold ${titleColor}`}>{title}</span>
      <div className="text-sm flex flex-row flex-wrap gap-x-2">
        {contentParts.map((part, index) => (
          <div key={index}>{part}</div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  color: Color;
  extended?: boolean;
}

export function ColorInfoCard({ color, extended }: Props) {
  const { backgroundColor, borderColor } = useColorBackgroundAndBorderColors(color);
  const isDark = color.isDark();

  return (
    <Card backgroundColor={backgroundColor} borderColor={borderColor}>
      <div className="flex flex-row justify-between items-center flex-wrap gap-y-2">
        <div className="flex flex-row items-center gap-2 flex-wrap">
          <InfoPill bold color={color}>
            {color.getNameAsString().toUpperCase()}
          </InfoPill>
          {extended && (
            <InfoPill color={color} icon={isDark ? IconType.MOON : IconType.SUN} variant="outlined">
              {isDark ? 'Dark' : 'Light'}
            </InfoPill>
          )}
        </div>
        <div className="flex flex-row items-center gap-2 flex-wrap gap-y-2">
          {extended && (
            <InfoPill color={color} variant="outlined">{`Alpha: ${color.getAlpha()}`}</InfoPill>
          )}
          <InfoPill color={color}>{color.toHex()}</InfoPill>
          {extended && <InfoPill color={color}>{color.toHex8()}</InfoPill>}
        </div>
      </div>
      {extended && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <InfoBox color={color} colorStrings={[color.toHex(), color.toHex8()]} title="HEX" />
          <InfoBox
            color={color}
            colorStrings={[color.toRGBString(), color.toRGBAString()]}
            title="RGB"
          />
          <InfoBox
            color={color}
            colorStrings={[color.toHSLString(), color.toHSLAString()]}
            title="HSL"
          />
          <InfoBox color={color} colorStrings={[color.toCMYKString()]} title="CMYK" />
          <InfoBox color={color} colorStrings={[color.toLABString()]} title="LAB" />
          <InfoBox color={color} colorStrings={[color.toLCHString()]} title="LCH" />
          <InfoBox color={color} colorStrings={[color.toOKLCHString()]} title="OKLCH" />
        </div>
      )}
    </Card>
  );
}
