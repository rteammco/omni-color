import { useState } from 'react';
import { Color, type ColorGradientOptions } from '../../../../dist';
import { Card } from '../../components/Card';
import { ColorBox } from '../../components/ColorBox';
import { GradientToOptionInputs } from './GradientToOptionInputs';

const DEFAULT_NUM_STOPS = 5;

interface Props {
  color: Color;
}

export function GradientToCard({ color }: Props) {
  const [targetColor, setTargetColor] = useState<Color>(new Color());
  const [options, setOptions] = useState<ColorGradientOptions>({
    stops: DEFAULT_NUM_STOPS,
    space: 'RGB',
    interpolation: 'LINEAR',
    easing: 'LINEAR',
    // clamp: true,
    // hueInterpolationMode: 'CARTESIAN',
  });

  const gradientColors = color.createGradientTo(targetColor, options);

  return (
    <Card title="Gradient to">
      <div className="flex flex-row gap-2">
        {gradientColors.map((color, index) => {
          const colorHex = color.toHex();
          let title: string | undefined;
          if (index === 0) {
            title = 'Start';
          } else if (index === gradientColors.length - 1) {
            title = 'Target';
          }
          return (
            <ColorBox
              key={colorHex}
              color={color}
              label={colorHex}
              overlaySize="SMALL"
              overlayText={title}
              width="STRETCH"
            />
          );
        })}
      </div>
      <GradientToOptionInputs
        options={options}
        onOptionsChanged={setOptions}
        onTargetColorChanged={setTargetColor}
      />
    </Card>
  );
}
