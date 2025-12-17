import { useState } from 'react';
import type { Color } from '../../../dist';
import { Card } from '../components/Card';
import { ColorBox } from '../components/ColorBox';
import { Slider } from '../components/inputs/Slider';
import { InputGroup } from '../components/inputs/InputGroup';

const DEFAULT_INTENSITY_PERCENTAGE = 10;
const DEFAULT_SPIN_DEGREES = 180;

interface Props {
  color: Color;
}

export function ColorManipulationDemo({ color }: Props) {
  const [intensityPercentage, setIntensityPercentage] = useState(DEFAULT_INTENSITY_PERCENTAGE);
  const [spinDegrees, setSpinDegrees] = useState(DEFAULT_SPIN_DEGREES);

  const brightenedColor = color.brighten(intensityPercentage);
  const darkenedColor = color.darken(intensityPercentage);
  const saturatedColor = color.saturate(intensityPercentage);
  const desaturatedColor = color.desaturate(intensityPercentage);
  const grayscaleColor = color.grayscale();

  const spunColor = color.spin(spinDegrees);

  return (
    <div className="flex flex-col gap-4">
      <Card title="Adjust color">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4">
          <ColorBox
            color={color}
            label={color.toHex()}
            overlaySize="SMALL"
            overlayText="Original"
            width="STRETCH"
          />
          <ColorBox
            color={brightenedColor}
            label={brightenedColor.toHex()}
            overlaySize="SMALL"
            overlayText="Brighten"
            width="STRETCH"
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
        <InputGroup onResetClicked={() => setIntensityPercentage(DEFAULT_INTENSITY_PERCENTAGE)}>
          <div className="flex flex-row justify-center gap-4">
            <Slider
              label="Intensity:"
              max={100}
              min={0}
              step={1}
              value={intensityPercentage}
              onChange={setIntensityPercentage}
            />
            <div className="flex items-center w-12 flex-shrink-0 text-left">
              {intensityPercentage}%
            </div>
          </div>
        </InputGroup>
      </Card>
      <Card title="Spin hue">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
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
        <InputGroup onResetClicked={() => setSpinDegrees(DEFAULT_SPIN_DEGREES)}>
          <div className="flex flex-row justify-center gap-4">
            <Slider
              label="Degrees:"
              max={360}
              min={-360}
              step={1}
              value={spinDegrees}
              onChange={setSpinDegrees}
            />
            <div className="flex items-center w-12 flex-shrink-0 text-left">{spinDegrees}°</div>
          </div>
        </InputGroup>
      </Card>
    </div>
  );
}
