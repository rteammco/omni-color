import { useState } from 'react';
import { Color } from '../../../dist';
import { ColorInput } from './ColorInput';
import { ColorInfo } from './ColorInfo';
import { ColorManipulationDemo } from './ColorManipulationDemo';
import { VSpace } from '../components/VSpace';
import { ColorHarmonyDemo } from './ColorHarmonyDemo';
import { ColorSwatch } from './ColorSwatch';
import { ColorPaletteDemo } from './ColorPaletteDemo';

function initializeColor(): Color {
  const params = new URLSearchParams(window.location.search);
  const colorParam = params.get('color');
  if (colorParam) {
    try {
      return new Color(colorParam);
    } catch {
      const fallbackColor = new Color();
      params.set('color', fallbackColor.toHex());
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
      return fallbackColor;
    }
  }
  return new Color();
}

function setColorQueryParam(color: Color) {
  const params = new URLSearchParams(window.location.search);
  params.set('color', color.toHex());
  window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

export function Playground() {
  const [color, setColorState] = useState<Color>(() => initializeColor());

  const setColor = (newColor: Color) => {
    setColorState(newColor);
    setColorQueryParam(newColor);
  };

  return (
    <div>
      <ColorInput defaultColor={color.toHex()} onColorChanged={setColor} />
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
