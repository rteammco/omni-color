import { useCallback, useState } from 'react';
import { Color } from '../../../dist';
import { Icon } from '../components/Icon';

interface Props {
  defaultColor: string;
  onColorChanged: (color: Color) => void;
}

export function ColorInput({ defaultColor, onColorChanged }: Props) {
  const [isInputColorValid, setIsInputColorValid] = useState(true);

  const handleColorInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputColorValue = e.target.value;
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

  return (
    <div>
      <div className="flex flex-row justify-center items-center gap-4">
        <input
          defaultValue={defaultColor}
          className="px-4 py-1.5 w-2xs border-1 border-gray-200 rounded-md shadow-md"
          placeholder="Enter a color"
          type="text"
          onChange={handleColorInputChange}
        />
        {isInputColorValid ? (
          <Icon color="green" size={32} type={Icon.TYPE.CHECK_CIRCLE} />
        ) : (
          <Icon color="red" size={32} type={Icon.TYPE.X_CIRCLE} />
        )}
      </div>
    </div>
  );
}
