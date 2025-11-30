import { useState } from 'react';
import { Color, type ColorGradientOptions } from '../../../../dist';

const TARGET_COLORS_NAMES = ['Red', 'Green', 'Blue', 'Black', 'White', 'Gray', 'Random'] as const;
type TargetColorName = (typeof TARGET_COLORS_NAMES)[number];

interface Props {
  options: ColorGradientOptions;
  onOptionsChanged: (options: ColorGradientOptions) => void;
  onTargetColorChanged: (targetColor: Color) => void;
}

export function GradientToOptionInputs({ options, onOptionsChanged, onTargetColorChanged }: Props) {
  const [selectedTargetColorName, setSelectedTargetColorName] = useState<TargetColorName>('Random');

  const handleTargetColorNameChanged = (colorName: TargetColorName) => {
    setSelectedTargetColorName(colorName);
    if (colorName === 'Random') {
      onTargetColorChanged(new Color());
    } else {
      onTargetColorChanged(new Color(colorName.toLowerCase()));
    }
  };

  return (
    <div className="mt-4 flex flex-row flex-wrap justify-center gap-x-8 gap-y-4">
      <label>
        Target color:
        <select
          className="ml-2 px-2 py-0.5 border-1 border-gray-200 rounded-md shadow-md"
          value={selectedTargetColorName}
          onChange={(e) => handleTargetColorNameChanged(e.target.value as TargetColorName)}
        >
          {TARGET_COLORS_NAMES.map((colorName) => (
            <option key={colorName} value={colorName}>
              {colorName}
            </option>
          ))}
        </select>
      </label>
      <label>
        Stops:
        <input
          className="ml-2 px-2 py-0.5 w-20 border-1 border-gray-200 rounded-md shadow-md"
          max={10}
          min={2}
          step={1}
          type="number"
          value={options.stops}
          onChange={(e) => onOptionsChanged({ ...options, stops: Number(e.target.value) })}
        />
      </label>
      <label>
        Color space:
        <select
          className="ml-2 px-2 py-0.5 border-1 border-gray-200 rounded-md shadow-md"
          value={options.space}
          onChange={(e) =>
            onOptionsChanged({ ...options, space: e.target.value as typeof options.space })
          }
        >
          <option value="RGB">RGB</option>
          <option value="HSL">HSL</option>
          <option value="HSV">HSV</option>
          <option value="LCH">LCH</option>
          <option value="OKLCH">OKLCH</option>
        </select>
      </label>
      <label>
        Interpolation:
        <select
          className="ml-2 px-2 py-0.5 border-1 border-gray-200 rounded-md shadow-md"
          value={options.interpolation}
          onChange={(e) =>
            onOptionsChanged({
              ...options,
              interpolation: e.target.value as typeof options.interpolation,
            })
          }
        >
          <option value="LINEAR">Linear</option>
          <option value="BEZIER">Bezier</option>
        </select>
      </label>
      <label>
        Easing:
        <select
          className="ml-2 px-2 py-0.5 border-1 border-gray-200 rounded-md shadow-md"
          value={options.easing as string}
          onChange={(e) =>
            onOptionsChanged({ ...options, easing: e.target.value as typeof options.easing })
          }
        >
          <option value="LINEAR">Linear</option>
          <option value="EASE_IN">Ease in</option>
          <option value="EASE_OUT">Ease out</option>
          <option value="EASE_IN_OUT">Ease in/out</option>
        </select>
      </label>
      {options.space !== 'RGB' && (
        <label>
          Hue interpolation:
          <select
            className="ml-2 px-2 py-0.5 border-1 border-gray-200 rounded-md shadow-md"
            value={options.hueInterpolationMode}
            onChange={(e) =>
              onOptionsChanged({
                ...options,
                hueInterpolationMode: e.target.value as typeof options.hueInterpolationMode,
              })
            }
          >
            <option value="CARTESIAN">Cartesian</option>
            <option value="SHORTEST">Shortest</option>
            <option value="LONGEST">Longest</option>
            <option value="INCREASING">Increasing</option>
            <option value="DECREASING">Decreasing</option>
            <option value="RAW">Raw</option>
          </select>
        </label>
      )}
    </div>
  );
}
