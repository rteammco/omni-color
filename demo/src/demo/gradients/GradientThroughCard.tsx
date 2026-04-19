import { useMemo, useState } from 'react';
import { Color, type ColorGradientOptions } from '../../../../dist';
import { Card } from '../../components/Card';
import { ColorBox } from '../../components/ColorBox';
import { GradientOptionInputs } from './GradientOptionInputs';
import { DEFAULT_COLOR_GRADIENT_THROUGH_OPTIONS } from './gradientOptions.consts';

const STOP_COLORS = ['Red', 'Green', 'Blue'] as const;

interface Props {
  color: Color;
}

function getGradientThroughCodeSnippet({
  colorHex,
  options,
}: {
  colorHex: string;
  options: ColorGradientOptions;
}) {
  const stops = options.stops ?? DEFAULT_COLOR_GRADIENT_THROUGH_OPTIONS.stops;
  const space = options.space ?? DEFAULT_COLOR_GRADIENT_THROUGH_OPTIONS.space;
  const interpolation =
    options.interpolation ?? DEFAULT_COLOR_GRADIENT_THROUGH_OPTIONS.interpolation;
  const easing = options.easing ?? DEFAULT_COLOR_GRADIENT_THROUGH_OPTIONS.easing;
  const clamp = options.clamp ?? DEFAULT_COLOR_GRADIENT_THROUGH_OPTIONS.clamp;
  const hueInterpolationMode =
    options.hueInterpolationMode ?? DEFAULT_COLOR_GRADIENT_THROUGH_OPTIONS.hueInterpolationMode;
  const easingInput = typeof easing === 'function' ? easing.toString() : `'${easing}'`;

  const hueInterpolationInput =
    space !== 'RGB'
      ? `,
  hueInterpolationMode: '${hueInterpolationMode}'`
      : '';

  return `
const color = new Color('${colorHex}');
const stopColors = ['red', 'green', 'blue'];

const gradient = color.createGradientThrough(stopColors, {
  stops: ${stops},
  space: '${space}',
  interpolation: '${interpolation}',
  easing: ${easingInput},
  clamp: ${clamp}${hueInterpolationInput},
});
`;
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
    <Card
      codeSnippet={getGradientThroughCodeSnippet({
        colorHex: color.toHex8(),
        options,
      })}
      title="Gradient through red, green, and blue"
    >
      <div className="flex flex-col sm:flex-row gap-2 mb-4">{colorBoxes}</div>
      <GradientOptionInputs
        options={options}
        onOptionsReset={() => setOptions(DEFAULT_COLOR_GRADIENT_THROUGH_OPTIONS)}
        onOptionsChanged={setOptions}
      />
    </Card>
  );
}
