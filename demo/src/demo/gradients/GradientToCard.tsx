import { useState } from 'react';
import { Color, type ColorGradientOptions } from '../../../../dist';
import { Card } from '../../components/Card';
import { ColorBox } from '../../components/ColorBox';
import { GradientOptionInputs } from './GradientOptionInputs';
import { DEFAULT_COLOR_GRADIENT_TO_OPTIONS } from './gradientOptions.consts';

interface Props {
  color: Color;
}

function getGradientToCodeSnippet({
  colorHex,
  targetColorHex,
  options,
}: {
  colorHex: string;
  targetColorHex: string;
  options: ColorGradientOptions;
}) {
  const stops = options.stops ?? DEFAULT_COLOR_GRADIENT_TO_OPTIONS.stops;
  const space = options.space ?? DEFAULT_COLOR_GRADIENT_TO_OPTIONS.space;
  const interpolation = options.interpolation ?? DEFAULT_COLOR_GRADIENT_TO_OPTIONS.interpolation;
  const easing = String(options.easing);
  const clamp = options.clamp ?? DEFAULT_COLOR_GRADIENT_TO_OPTIONS.clamp;
  const hueInterpolationMode =
    options.hueInterpolationMode ?? DEFAULT_COLOR_GRADIENT_TO_OPTIONS.hueInterpolationMode;
  return `
const color = new Color('${colorHex}');
const targetColor = new Color('${targetColorHex}');

const gradient = color.createGradientTo(targetColor, {
  stops: ${stops},
  space: '${space}',
  interpolation: '${interpolation}',
  easing: '${easing}',
  clamp: ${clamp},
  hueInterpolationMode: '${hueInterpolationMode}',
});
`;
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
    <Card
      title="Gradient to"
      codeSnippet={getGradientToCodeSnippet({
        colorHex: color.toHex8(),
        targetColorHex: targetColor.toHex8(),
        options,
      })}
    >
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
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
              key={index}
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
        showInterpolationOption={false}
        onOptionsChanged={setOptions}
        onOptionsReset={handleOptionsReset}
        onTargetColorChanged={setTargetColor}
      />
    </Card>
  );
}
