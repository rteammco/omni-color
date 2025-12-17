import { useState } from 'react';
import { Color } from '../../../../dist';
import { Card } from '../../components/Card';
import { ColorBox } from '../../components/ColorBox';
import { GradientOptionInputs } from './GradientOptionInputs';
import { DEFAULT_COLOR_GRADIENT_TO_OPTIONS } from './gradientOptions.consts';

interface Props {
  color: Color;
}

export function GradientToCard({ color }: Props) {
  const [targetColor, setTargetColor] = useState<Color>(new Color());
  const [options, setOptions] = useState(DEFAULT_COLOR_GRADIENT_TO_OPTIONS);

  const gradientColors = color.createGradientTo(targetColor, options);

  const handleOptionsReset = () => {
    setOptions(DEFAULT_COLOR_GRADIENT_TO_OPTIONS);
    setTargetColor(new Color());
  };

  return (
    <Card title="Gradient to">
      <div className="flex flex-row gap-2 mb-4">
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
      <GradientOptionInputs
        options={options}
        onOptionsChanged={setOptions}
        onOptionsReset={handleOptionsReset}
        onTargetColorChanged={setTargetColor}
      />
    </Card>
  );
}
