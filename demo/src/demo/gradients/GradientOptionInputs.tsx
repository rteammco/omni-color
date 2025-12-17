import { useState } from 'react';
import { Color, type ColorGradientOptions } from '../../../../dist';
import { InputGroup } from '../../components/inputs/InputGroup';
import { Select } from '../../components/inputs/Select';
import { NumberInput } from '../../components/inputs/NumberInput';

const TARGET_COLORS_NAMES = ['Red', 'Green', 'Blue', 'Black', 'White', 'Gray', 'Random'] as const;
type TargetColorName = (typeof TARGET_COLORS_NAMES)[number];

interface Props {
  options: ColorGradientOptions;
  onOptionsChanged: (options: ColorGradientOptions) => void;
  onOptionsReset: () => void;
  onTargetColorChanged?: (targetColor: Color) => void;
}

export function GradientOptionInputs({
  options,
  onOptionsChanged,
  onOptionsReset,
  onTargetColorChanged,
}: Props) {
  const [selectedTargetColorName, setSelectedTargetColorName] = useState<TargetColorName>('Random');

  const handleTargetColorNameChanged = (colorName: TargetColorName) => {
    if (!onTargetColorChanged) {
      return;
    }
    setSelectedTargetColorName(colorName);
    if (colorName === 'Random') {
      onTargetColorChanged(new Color());
    } else {
      onTargetColorChanged(new Color(colorName.toLowerCase()));
    }
  };

  const handleOptionsReset = () => {
    setSelectedTargetColorName('Random');
    onOptionsReset();
  };

  return (
    <InputGroup onResetClicked={handleOptionsReset}>
      {onTargetColorChanged && (
        <Select
          label="Target color"
          options={TARGET_COLORS_NAMES}
          value={selectedTargetColorName}
          onChange={handleTargetColorNameChanged}
        />
      )}
      <NumberInput
        label="Stops"
        max={10}
        min={2}
        step={1}
        value={options.stops}
        onChange={(value) => onOptionsChanged({ ...options, stops: value })}
      />
      <Select
        label="Color space"
        options={['RGB', 'HSL', 'HSV', 'LCH', 'OKLCH']}
        value={options.space}
        onChange={(value) => onOptionsChanged({ ...options, space: value })}
      />
      <Select
        label="Interpolation"
        options={[
          { label: 'Linear', value: 'LINEAR' },
          { label: 'Bezier', value: 'BEZIER' },
        ]}
        value={options.interpolation}
        onChange={(value) => onOptionsChanged({ ...options, interpolation: value })}
      />
      <Select
        label="Easing"
        options={[
          { label: 'Linear', value: 'LINEAR' },
          { label: 'Ease in', value: 'EASE_IN' },
          { label: 'Ease out', value: 'EASE_OUT' },
          { label: 'Ease in/out', value: 'EASE_IN_OUT' },
        ]}
        value={typeof options.easing === 'string' ? options.easing : undefined}
        onChange={(value) => onOptionsChanged({ ...options, easing: value })}
      />
      {options.space !== 'RGB' && (
        <Select
          label="Hue interpolation"
          options={[
            { label: 'Cartesian', value: 'CARTESIAN' },
            { label: 'Shortest', value: 'SHORTEST' },
            { label: 'Longest', value: 'LONGEST' },
            { label: 'Increasing', value: 'INCREASING' },
            { label: 'Decreasing', value: 'DECREASING' },
            { label: 'Raw', value: 'RAW' },
          ]}
          value={options.hueInterpolationMode}
          onChange={(value) => onOptionsChanged({ ...options, hueInterpolationMode: value })}
        />
      )}
    </InputGroup>
  );
}
