import type { Color } from '../../../dist';
import { ColorInfoCard } from '../components/ColorInfoCard';
import { VSpace } from '../components/VSpace';
import { ColorSwatch } from './ColorSwatch';

interface Props {
  color: Color;
}

export function ColorInfo({ color }: Props) {
  const extendedSwatch = color.getColorSwatch({ extended: true });

  return (
    <div>
      <ColorInfoCard color={color} extended />
      <VSpace height={8} />
      <ColorSwatch color={color} title="Basic palette" />
      <VSpace height={8} />
      <ColorSwatch swatch={extendedSwatch} title="Extended palette" />
      <VSpace height={8} />
      <div>Color temperature: {color.getTemperatureAsString({ formatNumber: true })}</div>
      <span className="text-xs">
        *Note: color temperature is only well-defined for near-white illuminants
      </span>
    </div>
  );
}
