import { useCallback, useState } from 'react';
import { Color } from '../../../dist';
import { Icon } from '../components/Icon';

interface Props {
  defaultColor: string;
  onColorChanged: (color: Color) => void;
}

export function ColorInput({ defaultColor, onColorChanged }: Props) {
  const [isInputColorValid, setIsInputColorValid] = useState(true);

  const [inputValue, setInputValue] = useState(defaultColor);

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
      <div className="mt-3 flex flex-row justify-center gap-2">
        <span>Enter a color above, or choose:</span>
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
        &middot;
        <a onClick={() => handlePresetColorSelected()}>random</a>
      </div>
    </div>
  );
}
