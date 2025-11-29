import { useCallback, useState } from 'react';
import { Color, type RandomColorOptions } from '../../../dist';
import { Icon } from '../components/Icon';
import { ColorInfoCard } from '../components/ColorInfoCard';

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
    <div className="flex flex-col gap-4">
      <ColorInfoCard color={color} />
      <div className="text-left">
        <div className="font-semibold mb-1">Enter a color:</div>
        <div className="flex flex-row items-center gap-4">
          <input
            className="px-6 py-3 w-2xs flex-1 border-1 border-gray-200 rounded-xl shadow-md"
            placeholder="Enter a color"
            type="text"
            value={inputValue}
            onChange={handleColorInputChange}
          />
          {isInputColorValid ? (
            <div className="bg-green-50 rounded-full p-1.5">
              <Icon color="green" size={32} type={Icon.TYPE.CHECK_CIRCLE} />
            </div>
          ) : (
            <div className="bg-red-50 rounded-full p-1.5">
              <Icon color="red" size={32} type={Icon.TYPE.X_CIRCLE} />
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="font-semibold mb-1 text-left">Or choose a preset:</div>
        <div className="mt-1 flex flex-row gap-2 flex-wrap">
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
          &middot;
          <button onClick={() => handlePresetColorSelected('candlelight')}>candlelight</button>
          &middot;
          <button onClick={() => handlePresetColorSelected('fluorescent lamp')}>
            fluorescent lamp
          </button>
          &middot;
          <button onClick={() => handlePresetColorSelected('blue sky')}>blue sky</button>
        </div>
      </div>
      <div>
        <div className="font-semibold mb-1 text-left">Or randomize:</div>
        <div className="flex flex-row gap-2 flex-wrap">
          <button onClick={() => handleRandomColorSelected({})}>Random</button>
          &middot;
          <button onClick={() => handleRandomColorSelected({ anchorColor: color.getName().name })}>
            Random (same hue)
          </button>
          &middot;
          <button onClick={() => handleRandomColorSelected({ paletteSuitable: true })}>
            Random (suitable for palette)
          </button>
        </div>
      </div>
    </div>
  );
}
