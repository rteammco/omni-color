import type { AverageColorsOptions } from '../../../../dist';
import { InputGroup } from '../../components/inputs/InputGroup';
import { Select } from '../../components/inputs/Select';

interface Props {
  mixOptions: AverageColorsOptions;
  onOptionsChanged: (options: AverageColorsOptions) => void;
}

export function AverageColorsOptionInputs({ mixOptions, onOptionsChanged }: Props) {
  return (
    <InputGroup>
      <Select
        label="Mix space"
        options={[{ label: 'Linear RGB', value: 'LINEAR_RGB' }, 'RGB', 'HSL', 'LCH', 'OKLCH']}
        value={mixOptions.space}
        onChange={(value) => onOptionsChanged({ ...mixOptions, space: value })}
      />
    </InputGroup>
  );
}
