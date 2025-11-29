import { Color } from '../../../dist';
import { Card } from '../components/Card';
import { ColorInfoCard } from '../components/ColorInfoCard';
import { ColorSwatch } from './ColorSwatch';

interface Props {
  color: Color;
}

export function ColorInfo({ color }: Props) {
  const extendedSwatch = color.getColorSwatch({ extended: true });

  const colorTemperature = color.getTemperature().temperature;
  const colorTemperatureBackground =
    colorTemperature > 0
      ? Color.fromTemperature(color.getTemperature().temperature).toHex()
      : undefined;

  return (
    <div className="flex flex-col gap-4">
      <ColorInfoCard color={color} extended />
      <ColorSwatch color={color} title="Basic swatch" withLabels />
      <ColorSwatch swatch={extendedSwatch} title="Extended swatch" withLabels />
      <div className="text-left">
        <div className="font-semibold text-left mb-1">Color temperature</div>
        <Card backgroundColor={colorTemperatureBackground}>
          <div>{color.getTemperatureAsString({ formatNumber: true })}</div>
          <span className="text-xs text-gray-600">
            *Note: color temperature is only well-defined for near-white illuminants
          </span>
        </Card>
      </div>
    </div>
  );
}
