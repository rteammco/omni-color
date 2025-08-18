import { useCallback, useState } from 'react';
import { Color, type RandomColorOptions } from '../../../dist';
import { Icon } from '../components/Icon';

interface Props {
  color: Color;
  onColorChanged: (color: Color) => void;
}

export function ColorInput({ color, onColorChanged }: Props) {
  const [isInputColorValid, setIsInputColorValid] = useState(true);

  const [inputValue, setInputValue] = useState<string>(color.toHex());

  const handleColorInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputColorValue = e.target.value;
      setInputValue(inputColorValue);
      try {
        const color = new Color(inputColorValue);
        setIsInputColorValid(true);
        onColorChanged(color);
      } catch {
        setIsInputColorValid(false);
      }
    },
    [onColorChanged]
  );

  const handlePresetColorSelected = useCallback(
    (colorString?: string) => {
      const color = new Color(colorString);
      onColorChanged(color);
      setInputValue(colorString ?? color.toHex());
    },
    [onColorChanged]
  );

  const handleRandomColorSelected = useCallback(
    (options: RandomColorOptions) => {
      const color = Color.random(options);
      onColorChanged(color);
      setInputValue(color.toHex());
    },
    [onColorChanged]
  );

  return (
    <div>
      <div className="flex flex-row justify-center items-center gap-4">
        <input
          className="px-4 py-1.5 w-2xs border-1 border-gray-200 rounded-md shadow-md"
          placeholder="Enter a color"
          type="text"
          value={inputValue}
          onChange={handleColorInputChange}
        />
        {isInputColorValid ? (
          <Icon color="green" size={32} type={Icon.TYPE.CHECK_CIRCLE} />
        ) : (
          <Icon color="red" size={32} type={Icon.TYPE.X_CIRCLE} />
        )}
      </div>
      <div className="mt-2">Enter a color above, or choose:</div>
      <div className="mt-1 flex flex-row justify-center gap-2">
        <a onClick={() => handlePresetColorSelected('red')}>red</a>
        &middot;
        <a onClick={() => handlePresetColorSelected('darkgreen')}>darkgreen</a>
        &middot;
        <a onClick={() => handlePresetColorSelected('light blue')}>light blue</a>
        &middot;
        <a onClick={() => handlePresetColorSelected('#6c18b9')}>#6c18b9</a>
        &middot;
        <a onClick={() => handlePresetColorSelected('#e6a13799')}>#e6a13799</a>
        &middot;
        <a onClick={() => handlePresetColorSelected('rgb(232, 243, 17)')}>rgb(232, 243, 17)</a>
        &middot;
        <a onClick={() => handlePresetColorSelected('hsla(335, 49%, 37%, 0.75)')}>
          hsla(335, 49%, 37%, 0.75)
        </a>
        &middot;
        <a onClick={() => handlePresetColorSelected('cmyk(0%, 0%, 0%, 100%)')}>
          cmyk(0%, 0%, 0%, 100%)
        </a>
        &middot;
        <a onClick={() => handlePresetColorSelected('oklch(0.35 0 89.5)')}>oklch(0.35 0 89.5)</a>
      </div>
      <div>or randomize:</div>
      <div className="flex flex-row justify-center gap-2">
        <a onClick={() => handleRandomColorSelected({})}>random</a>
        &middot;
        <a onClick={() => handleRandomColorSelected({ anchorColor: color.getName().name })}>
          random (same hue)
        </a>
        &middot;
        <a onClick={() => handleRandomColorSelected({ paletteSuitable: true })}>
          random (suitable for palette)
        </a>
      </div>
    </div>
  );
}
