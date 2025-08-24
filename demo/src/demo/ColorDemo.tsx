import { useCallback, useState } from 'react';
import { Color } from '../../../dist';
import { ColorInput } from './ColorInput';
import { ColorInfo } from './ColorInfo';
import { ColorManipulationDemo } from './ColorManipulationDemo';
import { VSpace } from '../components/VSpace';
import { ColorHarmonyDemo } from './ColorHarmonyDemo';
import { ColorPaletteDemo } from './palette/ColorPaletteDemo';
import { ColorCombinationDemo } from './combinations/ColorCombinationDemo';
import { ReadabilityDemo } from './ReadabilityDemo';

const COLOR_SEARCH_PARAM_KEY = 'color' as const;

function setColorSearchParam(color: Color) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  urlSearchParams.set(COLOR_SEARCH_PARAM_KEY, color.toHex());
  window.history.replaceState({}, '', `${window.location.pathname}?${urlSearchParams.toString()}`);
}

function initializeRandomColor(): Color {
  const initialColor = new Color();
  setColorSearchParam(initialColor);
  return initialColor;
}

function getColorFromSearchParams(): Color {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const colorParam = urlSearchParams.get(COLOR_SEARCH_PARAM_KEY);
  if (!colorParam) {
    return initializeRandomColor();
  }

  try {
    return new Color(colorParam);
  } catch {
    return initializeRandomColor();
  }
}

export function ColorDemo() {
  const [color, setColor] = useState<Color>(getColorFromSearchParams());

  const handleColorChanged = useCallback((newColor: Color) => {
    setColor(newColor);
    setColorSearchParam(newColor);
  }, []);

  return (
    <div>
      <ColorInput color={color} onColorChanged={handleColorChanged} />
      <VSpace height={24} />
      <h5 className="mb-3">Color info</h5>
      <ColorInfo color={color} />
      <VSpace height={24} />
      <h5 className="mb-3">Readability</h5>
      <ReadabilityDemo color={color} />
      <VSpace height={24} />
      <h5 className="mb-3">Manipulations</h5>
      <ColorManipulationDemo color={color} />
      <VSpace height={24} />
      <h5 className="mb-3">Combinations</h5>
      <ColorCombinationDemo color={color} />
      <VSpace height={24} />
      <h5 className="mb-3">Harmonies</h5>
      <ColorHarmonyDemo color={color} />
      <VSpace height={24} />
      <h5 className="mb-2">Palette</h5>
      <ColorPaletteDemo color={color} />
    </div>
  );
}
