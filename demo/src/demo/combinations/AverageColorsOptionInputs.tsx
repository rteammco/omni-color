import type { MixSpace, AverageColorsOptions } from '../../../../dist';

interface Props {
  mixOptions: AverageColorsOptions;
  onOptionsChanged: (options: AverageColorsOptions) => void;
}

export function AverageColorsOptionInputs({ mixOptions, onOptionsChanged }: Props) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <label>
        Mix space:
        <select
          className="ml-2 px-2 py-0.5 border-1 border-gray-200 rounded-md shadow-md"
          value={mixOptions.space}
          onChange={(e) => onOptionsChanged({ ...mixOptions, space: e.target.value as MixSpace })}
        >
          <option value="RGB">RGB</option>
          <option value="HSL">HSL</option>
          <option value="LCH">LCH</option>
          <option value="OKLCH">OKLCH</option>
        </select>
      </label>
    </div>
  );
}
