import { useState } from 'react';
import type { Color } from '../../../dist';
import { Card } from '../components/Card';
import { ColorBox } from '../components/ColorBox';
import { Slider } from '../components/Slider';

interface Props {
  color: Color;
}

export function ColorManipulationDemo({ color }: Props) {
  const [percentage, setPercentage] = useState(10);
  const [spinDegrees, setSpinDegrees] = useState(180);

  const brightenedColor = color.brighten(percentage);
  const darkenedColor = color.darken(percentage);
  const saturatedColor = color.saturate(percentage);
  const desaturatedColor = color.desaturate(percentage);
  const grayscaleColor = color.grayscale();

  const spunColor = color.spin(spinDegrees);

  return (
    <div className="flex flex-col gap-4">
      <Card title="Adjust color">
        <div className="flex flex-row gap-2">
          <ColorBox
            color={color}
            label={color.toHex()}
            overlaySize="SMALL"
            overlayText="Original"
            width="STRETCH"
          />
          <ColorBox
            width="STRETCH"
            overlayText="Brighten"
            overlaySize="SMALL"
            label={brightenedColor.toHex()}
            color={brightenedColor}
          />
          <ColorBox
            color={darkenedColor}
            label={darkenedColor.toHex()}
            overlaySize="SMALL"
            overlayText="Darken"
            width="STRETCH"
          />
          <ColorBox
            color={saturatedColor}
            label={saturatedColor.toHex()}
            overlaySize="SMALL"
            overlayText="Saturate"
            width="STRETCH"
          />
          <ColorBox
            color={desaturatedColor}
            label={desaturatedColor.toHex()}
            overlaySize="SMALL"
            overlayText="Desaturate"
            width="STRETCH"
          />
          <ColorBox
            color={grayscaleColor}
            label={grayscaleColor.toHex()}
            overlaySize="SMALL"
            overlayText="Grayscale"
            width="STRETCH"
          />
        </div>
        <div className="flex flex-row justify-center gap-4 mt-4">
          <Slider
            label="Intensity:"
            max={100}
            min={0}
            step={1}
            value={percentage}
            onChange={setPercentage}
          />
          <div className="w-12 text-left">{percentage}%</div>
        </div>
      </Card>
      <Card title="Spin hue">
        <div className="flex flex-row gap-2">
          <ColorBox
            color={color}
            label={color.toHex()}
            overlaySize="SMALL"
            overlayText="Original"
            width="STRETCH"
          />
          <ColorBox
            color={spunColor}
            label={spunColor.toHex()}
            overlaySize="SMALL"
            overlayText={`Spun ${spinDegrees}°`}
            width="STRETCH"
          />
        </div>
        <div className="flex flex-row justify-center gap-4 mt-4">
          <Slider
            label="Degrees:"
            max={360}
            min={-360}
            step={1}
            value={spinDegrees}
            onChange={setSpinDegrees}
          />
          <div className="w-12 text-left">{spinDegrees}°</div>
        </div>
      </Card>
    </div>
  );
}
