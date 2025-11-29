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
      // new Color('#333'),
      new Color('#666'),
      // new Color('#999'),
      new Color('#ccc'),
      new Color('white'),
      new Color('red'),
      new Color('green'),
      new Color('blue'),
      new Color('yellow'),
      new Color('magenta'),
      new Color('cyan'),
    ],
    []
  );

  const bestBackgroundColor = color.getBestBackgroundColor(backgroundColors);
  const bestTextColor = color.getMostReadableTextColor(backgroundColors);

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
      <Card title="Most readable">
        <div className="flex flex-row items-center gap-2">
          <ColorBox
            color={bestBackgroundColor}
            label="on the best background"
            overlayColor={color}
            overlaySize="SMALL"
            overlayText="Your color"
            width="STRETCH"
          />
          <ColorBox
            color={color}
            label="with your color as the background"
            overlayColor={bestTextColor}
            overlaySize="SMALL"
            overlayText="Best text color"
            width="STRETCH"
          />
        </div>
      </Card>
    </div>
  );
}
