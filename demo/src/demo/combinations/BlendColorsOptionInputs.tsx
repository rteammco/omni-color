import type { BlendColorsOptions } from '../../../../dist';
import { InputGroup } from '../../components/inputs/InputGroup';
import { NumberInput } from '../../components/inputs/NumberInput';
import { Select } from '../../components/inputs/Select';

interface Props {
  blendOptions: BlendColorsOptions;
  onOptionsChanged: (options: BlendColorsOptions) => void;
}

export function BlendColorsOptionInputs({ blendOptions, onOptionsChanged }: Props) {
  return (
    <InputGroup>
      <Select
        label="Blend mode"
        options={[
          { label: 'Normal', value: 'NORMAL' },
          { label: 'Multiply', value: 'MULTIPLY' },
          { label: 'Screen', value: 'SCREEN' },
          { label: 'Overlay', value: 'OVERLAY' },
        ]}
        value={blendOptions.mode}
        onChange={(value) => onOptionsChanged({ ...blendOptions, mode: value })}
      />
      <Select
        label="Blend space"
        options={['RGB', 'HSL']}
        value={blendOptions.space}
        onChange={(value) => onOptionsChanged({ ...blendOptions, space: value })}
      />
      <NumberInput
        label="Blend ratio"
        max={1}
        min={0}
        step={0.1}
        value={blendOptions.ratio}
        onChange={(value) => onOptionsChanged({ ...blendOptions, ratio: value })}
      />
    </InputGroup>
  );
}
