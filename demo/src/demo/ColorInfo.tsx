import { Color } from '../../../dist';
import { Card } from '../components/Card';
import { ColorInfoCard } from '../components/ColorInfoCard';
import { ColorSwatch } from './ColorSwatch';

interface Props {
  color: Color;
}

export function ColorInfo({ color }: Props) {
  const basicSwatch = color.getColorSwatch({ extended: false });
  const extendedSwatch = color.getColorSwatch({ extended: true });

  const colorTemperature = color.getTemperature().temperature;
  const colorTemperatureBackground =
    colorTemperature > 0
      ? Color.fromTemperature(color.getTemperature().temperature).toHex()
      : undefined;

  return (
    <div className="flex flex-col gap-4">
      <ColorInfoCard color={color} extended />
      <ColorSwatch swatch={basicSwatch} title="Basic swatch" withLabels />
      <ColorSwatch swatch={extendedSwatch} title="Extended swatch" withLabels />
      <Card backgroundColor={colorTemperatureBackground} title="Color temperature">
        <div className="text-left mb-1 text-black">
          {color.getTemperatureAsString({ formatNumber: true })}
        </div>
        <div className="text-left text-xs text-gray-600">
          *Note: color temperature is only well-defined for near-white illuminants
        </div>
      </Card>
    </div>
  );
}
