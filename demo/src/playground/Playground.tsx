import { useState } from 'react';
import { Color } from '../../../dist';
import { ColorInput } from './ColorInput';

export function Playground() {
  const [color, setColor] = useState<Color>(new Color());

  return (
    <div>
      <ColorInput defaultColor={color.toHex()} onColorChanged={setColor} />
    </div>
  );
}
