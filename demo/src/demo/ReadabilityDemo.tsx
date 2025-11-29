import { useMemo } from 'react';
import { Color } from '../../../dist';
import { ColorBox } from '../components/ColorBox';
import { Card } from '../components/Card';

interface Props {
  color: Color;
}

export function ReadabilityDemo({ color }: Props) {
  const backgroundColors = useMemo(
    () => [
      new Color('black'),
      new Color('#333'),
      new Color('#666'),
      new Color('#999'),
      new Color('#ccc'),
      new Color('white'),
      new Color('red'),
      new Color('green'),
      new Color('blue'),
    ],
    []
  );

  return (
    <div className="flex flex-col gap-4">
      <Card title="WCAG contrast ratio">
        <div className="flex flex-row items-center gap-2 flex-wrap">
          {backgroundColors.map((bgColor) => (
            <ColorBox
              key={bgColor.toHex()}
              color={bgColor}
              label={color.getContrastRatio(bgColor).toFixed(2)}
              overlayColor={color}
              width="STRETCH"
            />
          ))}
        </div>
      </Card>
      <Card title="APCA readability score">
        <div className="flex flex-row items-center gap-2 flex-wrap">
          {backgroundColors.map((bgColor) => (
            <ColorBox
              key={bgColor.toHex()}
              color={bgColor}
              label={color.getReadabilityScore(bgColor).toFixed(2)}
              overlayColor={color}
              width="STRETCH"
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
