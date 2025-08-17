import { useState } from 'react';
import { Color } from '../../../dist';
import { ColorInput } from './ColorInput';
import { ColorInfo } from './ColorInfo';
import { ColorManipulationDemo } from './ColorManipulationDemo';
import { VSpace } from '../components/VSpace';
import { ColorHarmonyDemo } from './ColorHarmonyDemo';
import { ColorSwatch } from './ColorSwatch';
import { ColorPaletteDemo } from './ColorPaletteDemo';

export function Playground() {
  const [color, setColor] = useState<Color>(new Color());

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
