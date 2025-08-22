import { useCallback, useState } from 'react';
import { Color, type RandomColorOptions } from '../../../dist';
import { Icon } from '../components/Icon';

function getRandomInputValueFromColor(color: Color): string {
  const zeroToEight = Math.floor(Math.random() * 9);
  switch (zeroToEight) {
    case 0:
      return color.toHex8();
    case 1:
      return color.toRGBString();
    case 2:
      return color.toRGBAString();
    case 3:
      return color.toHSLString();
    case 4:
      return color.toHSLAString();
    case 5:
      return color.toCMYKString();
    case 6:
      return color.toLCHString();
    case 7:
      return color.toOKLCHString();
    case 8:
    default:
      return color.toHex();
  }
}

interface Props {
  color: Color;
  onColorChanged: (color: Color) => void;
}

export function ColorInput({ color, onColorChanged }: Props) {
  const [inputValue, setInputValue] = useState<string>(getRandomInputValueFromColor(color));
  const [isInputColorValid, setIsInputColorValid] = useState(true);

  const handleColorInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputColorValue = e.target.value;
      setInputValue(inputColorValue);
      try {
        const newColor = new Color(inputColorValue);
        setIsInputColorValid(true);
        onColorChanged(newColor);
      } catch {
        setIsInputColorValid(false);
      }
    },
    [onColorChanged]
  );

  const handlePresetColorSelected = useCallback(
    (colorString: string) => {
      const newColor = new Color(colorString);
      setInputValue(colorString);
      setIsInputColorValid(true);
      onColorChanged(newColor);
    },
    [onColorChanged]
  );

  const handleRandomColorSelected = useCallback(
    (options: RandomColorOptions) => {
      const color = Color.random(options);
      setInputValue(getRandomInputValueFromColor(color));
      setIsInputColorValid(true);
      onColorChanged(color);
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
        <button onClick={() => handlePresetColorSelected('red')}>red</button>
        &middot;
        <button onClick={() => handlePresetColorSelected('darkgreen')}>darkgreen</button>
        &middot;
        <button onClick={() => handlePresetColorSelected('light blue')}>light blue</button>
        &middot;
        <button onClick={() => handlePresetColorSelected('#6c18b9')}>#6c18b9</button>
        &middot;
        <button onClick={() => handlePresetColorSelected('#e6a13799')}>#e6a13799</button>
        &middot;
        <button onClick={() => handlePresetColorSelected('rgb(232, 243, 17)')}>
          rgb(232, 243, 17)
        </button>
        &middot;
        <button onClick={() => handlePresetColorSelected('hsla(335, 49%, 37%, 0.75)')}>
          hsla(335, 49%, 37%, 0.75)
        </button>
        &middot;
        <button onClick={() => handlePresetColorSelected('cmyk(0%, 0%, 0%, 100%)')}>
          cmyk(0%, 0%, 0%, 100%)
        </button>
        &middot;
        <button onClick={() => handlePresetColorSelected('oklch(0.35 0 89.5)')}>
          oklch(0.35 0 89.5)
        </button>
      </div>
      <div>or randomize:</div>
      <div className="flex flex-row justify-center gap-2">
        <button onClick={() => handleRandomColorSelected({})}>random</button>
        &middot;
        <button onClick={() => handleRandomColorSelected({ anchorColor: color.getName().name })}>
          random (same hue)
        </button>
        &middot;
        <button onClick={() => handleRandomColorSelected({ paletteSuitable: true })}>
          random (suitable for palette)
        </button>
      </div>
    </div>
  );
}
