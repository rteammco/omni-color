import type { MixSpace, MixType, MixColorsOptions } from '../../../../dist';

interface Props {
  mixOptions: MixColorsOptions;
  onOptionsChanged: (options: MixColorsOptions) => void;
}

export function MixColorsOptionInputs({ mixOptions, onOptionsChanged }: Props) {
  return (
    <div className="flex flex-row gap-8 align-center justify-center">
      <label>
        Mix type:
        <select
          className="ml-2 px-2 py-0.5 border-1 border-gray-200 rounded-md shadow-md"
          value={mixOptions.type}
          onChange={(e) => onOptionsChanged({ ...mixOptions, type: e.target.value as MixType })}
        >
          <option value="ADDITIVE">Additive</option>
          <option value="SUBTRACTIVE">Subtractive</option>
        </select>
      </label>
      <label>
        Mix space:
        <select
          className="ml-2 px-2 py-0.5 border-1 border-gray-200 rounded-md shadow-md"
          value={mixOptions.space}
          onChange={(e) => onOptionsChanged({ ...mixOptions, space: e.target.value as MixSpace })}
        >
          <option value="LINEAR_RGB">Linear RGB</option>
          <option value="RGB">RGB</option>
          <option value="HSL">HSL</option>
          <option value="LCH">LCH</option>
          <option value="OKLCH">OKLCH</option>
        </select>
      </label>
    </div>
  );
}
