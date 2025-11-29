import type { Color } from '../../../dist';
import { Card } from './Card';

const TEXT_PILL_BRIGHTNESS_ADJUSTMENT = 25;

function TextPill({ bold, children, color }: { bold?: boolean; children: string; color: Color }) {
  const backgroundColorObj = color.isDark()
    ? color.brighten(TEXT_PILL_BRIGHTNESS_ADJUSTMENT)
    : color.darken(TEXT_PILL_BRIGHTNESS_ADJUSTMENT);
  const backgroundColor = backgroundColorObj.toHex();
  const textColor = backgroundColorObj.isDark() ? 'white' : 'black';

  return (
    <div className="inline-block px-4 py-1 rounded-full" style={{ backgroundColor }}>
      <span className={bold ? 'font-bold' : undefined} style={{ color: textColor }}>
        {children}
      </span>
    </div>
  );
}

interface Props {
  color: Color;
}

export function ColorInfoCard({ color }: Props) {
  const mainColor = color.toHex();

  return (
    <Card backgroundColor={mainColor}>
      <div className="flex flex-row justify-between items-center">
        <TextPill bold color={color}>
          {color.getNameAsString().toUpperCase()}
        </TextPill>
        <TextPill color={color}>{mainColor}</TextPill>
      </div>
    </Card>
  );
}
