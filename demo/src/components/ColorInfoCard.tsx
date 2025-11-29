import type { Color } from '../../../dist';
import { Card } from './Card';
import { useColorBackgroundAndBorderColors } from './utils';

const INFO_CONTAINER_BRIGHTNESS_ADJUSTMENT = 25;

function useInfoContainerColors(color: Color) {
  const backgroundColorObj = color.isDark()
    ? color.brighten(INFO_CONTAINER_BRIGHTNESS_ADJUSTMENT)
    : color.darken(INFO_CONTAINER_BRIGHTNESS_ADJUSTMENT);
  const backgroundColor = backgroundColorObj.toHex();
  const textColor = backgroundColorObj.isDark() ? 'white' : 'black';
  const titleColor = backgroundColorObj.isDark() ? 'text-neutral-300' : 'text-neutral-700';
  return { backgroundColor, textColor, titleColor };
}

function InfoPill({ bold, children, color }: { bold?: boolean; children: string; color: Color }) {
  const { backgroundColor, textColor } = useInfoContainerColors(color);

  return (
    <div className="inline-block px-4 py-1 rounded-full" style={{ backgroundColor }}>
      <span className={bold ? 'font-bold' : undefined} style={{ color: textColor }}>
        {children}
      </span>
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
  const { backgroundColor, textColor, titleColor } = useInfoContainerColors(color);

  return (
    <div
      className="rounded-lg px-2 pb-1 w-full text-left"
      style={{ backgroundColor, color: textColor, borderColor: textColor }}
    >
      <span className={`text-xs font-mono font-semibold ${titleColor}`}>{title}</span>
      <div className="text-sm flex flex-row gap-2">
        {colorStrings.map((colorString, index) => (
          <>
            <span key={`${colorString}-${index}`}>{colorString}</span>
            {index < colorStrings.length - 1 && <span>&middot;</span>}
          </>
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

  return (
    <Card backgroundColor={backgroundColor} borderColor={borderColor}>
      <div className="flex flex-row justify-between items-center">
        <InfoPill bold color={color}>
          {color.getNameAsString().toUpperCase()}
        </InfoPill>
        <div className="flex flex-row items-center gap-2">
          {extended && <InfoPill color={color}>{`Alpha: ${color.getAlpha()}`}</InfoPill>}
          <InfoPill color={color}>{color.toHex8()}</InfoPill>
          {extended && <InfoPill color={color}>{color.toHex8()}</InfoPill>}
        </div>
      </div>
      {extended && (
        <div className="mt-4 grid grid-cols-3 gap-2">
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
