import { useState } from 'react';
import { Color } from '../../../dist';
import { ColorInput } from './ColorInput';
import { ColorInfo } from './ColorInfo';
import { ColorManipulationExamples } from './ColorManipulationExamples';
import { VSpace } from '../components/VSpace';
import { ColorHarmonyExamples } from './ColorHarmonyExamples';
import { ColorSwatch } from './ColorSwatch';

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
      <ColorManipulationExamples color={color} />
      <VSpace height={24} />
      <ColorHarmonyExamples color={color} />
    </div>
  );
}
