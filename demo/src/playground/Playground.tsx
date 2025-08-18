import { useCallback, useState } from 'react';
import { Color } from '../../../dist';
import { ColorInput } from './ColorInput';
import { ColorInfo } from './ColorInfo';
import { ColorManipulationDemo } from './ColorManipulationDemo';
import { VSpace } from '../components/VSpace';
import { ColorHarmonyDemo } from './ColorHarmonyDemo';
import { ColorSwatch } from './ColorSwatch';
import { ColorPaletteDemo } from './ColorPaletteDemo';

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

export function Playground() {
  const [color, setColor] = useState<Color>(getColorFromSearchParams());

  const handleColorChanged = useCallback((newColor: Color) => {
    setColor(newColor);
    setColorSearchParam(newColor);
  }, []);

  return (
    <div>
      <ColorInput color={color} onColorChanged={handleColorChanged} />
      <VSpace height={24} />
      <ColorInfo color={color} />
      <VSpace height={8} />
      <ColorSwatch color={color} />
      <VSpace height={24} />
      <ColorManipulationDemo color={color} />
      <VSpace height={24} />
      <ColorHarmonyDemo color={color} />
      <VSpace height={24} />
      <ColorPaletteDemo color={color} />
    </div>
  );
}
