import { useMemo, useState } from 'react';
import { Color } from '../../../../dist';
import { Card } from '../../components/Card';
import { ColorBox } from '../../components/ColorBox';
import { GradientOptionInputs } from './GradientOptionInputs';
import { DEFAULT_COLOR_GRADIENT_THROUGH_OPTIONS } from './gradientOptions.consts';

const STOP_COLORS = ['Red', 'Green', 'Blue'] as const;

interface Props {
  color: Color;
}

export function GradientThroughCard({ color }: Props) {
  const [options, setOptions] = useState(DEFAULT_COLOR_GRADIENT_THROUGH_OPTIONS);

  const colorBoxes = useMemo(() => {
    const gradientStops = color.createGradientThrough(STOP_COLORS, options);

    return gradientStops.map((color, index) => {
      const colorHex = color.toHex();
      let title: string | undefined;
      if (index === 0) {
        title = 'Start';
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
    });
  }, [color, options]);

  return (
    <Card title="Gradient through red, green, and blue">
      <div className="flex flex-col sm:flex-row gap-2 mb-4">{colorBoxes}</div>
      <GradientOptionInputs
        options={options}
        onOptionsReset={() => setOptions(DEFAULT_COLOR_GRADIENT_THROUGH_OPTIONS)}
        onOptionsChanged={setOptions}
      />
    </Card>
  );
}
