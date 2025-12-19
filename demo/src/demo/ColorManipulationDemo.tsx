import { useState } from 'react';
import type { Color, ColorBrightnessSpace, ColorSaturationSpace } from '../../../dist';
import { Card } from '../components/Card';
import { ColorBox } from '../components/ColorBox';
import { Slider } from '../components/inputs/Slider';
import { InputGroup } from '../components/inputs/InputGroup';
import { Select } from '../components/inputs/Select';
import { NumberInput } from '../components/inputs/NumberInput';

const DEFAULT_INTENSITY_PERCENTAGE = 10;
const DEFAULT_COLOR_SPACE: ColorBrightnessSpace | ColorSaturationSpace = 'HSL';
const DEFAULT_LAB_SCALE = 18;
const DEFAULT_SPIN_DEGREES = 180;

interface Props {
  color: Color;
}

export function ColorManipulationDemo({ color }: Props) {
  const [intensityPercentage, setIntensityPercentage] = useState(DEFAULT_INTENSITY_PERCENTAGE);
  const [colorSpace, setColorSpace] = useState<ColorBrightnessSpace | ColorSaturationSpace>(
    DEFAULT_COLOR_SPACE
  );
  const [labScale, setLabScale] = useState(DEFAULT_LAB_SCALE);

  const [spinDegrees, setSpinDegrees] = useState(DEFAULT_SPIN_DEGREES);

  const handleReset = () => {
    setIntensityPercentage(DEFAULT_INTENSITY_PERCENTAGE);
    setColorSpace(DEFAULT_COLOR_SPACE);
    setLabScale(DEFAULT_LAB_SCALE);
    setSpinDegrees(DEFAULT_SPIN_DEGREES);
  };

  const brightenedColor = color.brighten({
    space: colorSpace,
    amount: intensityPercentage,
  });
  const darkenedColor = color.darken({ amount: intensityPercentage, space: colorSpace, labScale });
  const saturatedColor = color.saturate({
    amount: intensityPercentage,
    space: colorSpace !== 'LAB' ? colorSpace : 'HSL',
    labScale,
  });
  const desaturatedColor = color.desaturate({
    amount: intensityPercentage,
    space: colorSpace !== 'LAB' ? colorSpace : 'HSL',
    labScale,
  });

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
        <InputGroup onResetClicked={handleReset}>
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
          <Select
            label="Color space"
            options={['HSL', 'LCH', 'LAB']}
            value={colorSpace}
            onChange={setColorSpace}
          />
          {colorSpace !== 'HSL' && (
            <NumberInput
              max={100}
              min={0}
              step={1}
              label="LAB scale"
              value={labScale}
              onChange={setLabScale}
            />
          )}
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
