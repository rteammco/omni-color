import type { MixColorsOptions } from '../../../../dist';
import { InputGroup } from '../../components/inputs/InputGroup';
import { Select } from '../../components/inputs/Select';

interface Props {
  mixOptions: MixColorsOptions;
  onOptionsChanged: (options: MixColorsOptions) => void;
}

export function MixColorsOptionInputs({ mixOptions, onOptionsChanged }: Props) {
  return (
    <InputGroup>
      <Select
        label="Mix type"
        options={[
          { label: 'Additive', value: 'ADDITIVE' },
          { label: 'Subtractive', value: 'SUBTRACTIVE' },
        ]}
        value={mixOptions.type}
        onChange={(value) => onOptionsChanged({ ...mixOptions, type: value })}
      />
      <Select
        label="Mix space"
        options={[{ label: 'Linear RGB', value: 'LINEAR_RGB' }, 'RGB', 'HSL', 'LCH', 'OKLCH']}
        value={mixOptions.space}
        onChange={(value) => onOptionsChanged({ ...mixOptions, space: value })}
      />
    </InputGroup>
  );
}
