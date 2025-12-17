import type { AverageColorsOptions } from '../../../../dist';
import { InputGroup } from '../../components/inputs/InputGroup';
import { Select } from '../../components/inputs/Select';
import { DEFAULT_AVERAGE_COLORS_OPTIONS } from './colorCombinationDemo.consts';

interface Props {
  mixOptions: AverageColorsOptions;
  onOptionsChanged: (options: AverageColorsOptions) => void;
}

export function AverageColorsOptionInputs({ mixOptions, onOptionsChanged }: Props) {
  return (
    <InputGroup onResetClicked={() => onOptionsChanged(DEFAULT_AVERAGE_COLORS_OPTIONS)}>
      <Select
        label="Mix space"
        options={[{ label: 'Linear RGB', value: 'LINEAR_RGB' }, 'RGB', 'HSL', 'LCH', 'OKLCH']}
        value={mixOptions.space}
        onChange={(value) => onOptionsChanged({ ...mixOptions, space: value })}
      />
    </InputGroup>
  );
}
