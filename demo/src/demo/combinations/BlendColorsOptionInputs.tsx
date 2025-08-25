import type { BlendMode, BlendSpace, BlendColorsOptions } from '../../../../dist';

interface Props {
  blendOptions: BlendColorsOptions;
  onOptionsChanged: (options: BlendColorsOptions) => void;
}

export function BlendColorsOptionInputs({ blendOptions, onOptionsChanged }: Props) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <label>
        Blend mode:
        <select
          className="ml-2 px-2 py-0.5 border-1 border-gray-200 rounded-md shadow-md"
          value={blendOptions.mode}
          onChange={(e) => onOptionsChanged({ ...blendOptions, mode: e.target.value as BlendMode })}
        >
          <option value="NORMAL">Normal</option>
          <option value="MULTIPLY">Multiply</option>
          <option value="SCREEN">Screen</option>
          <option value="OVERLAY">Overlay</option>
        </select>
      </label>
      &middot;
      <label>
        Blend space:
        <select
          className="ml-2 px-2 py-0.5 border-1 border-gray-200 rounded-md shadow-md"
          value={blendOptions.space}
          onChange={(e) =>
            onOptionsChanged({ ...blendOptions, space: e.target.value as BlendSpace })
          }
        >
          <option value="RGB">RGB</option>
          <option value="HSL">HSL</option>
        </select>
      </label>
      &middot;
      <label>
        Blend ratio:
        <input
          className="ml-2 px-2 py-0.5 border-1 border-gray-200 rounded-md shadow-md"
          max={1}
          min={0}
          step={0.01}
          type="number"
          value={blendOptions.ratio}
          onChange={(e) => onOptionsChanged({ ...blendOptions, ratio: Number(e.target.value) })}
        />
      </label>
    </div>
  );
}
