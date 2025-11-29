import type { Color } from '../../../dist';
import { Card } from '../components/Card';
import { ColorBox } from '../components/ColorBox';

interface Props {
  color: Color;
}

export function ColorManipulationDemo({ color }: Props) {
  const brightenedColor = color.brighten();
  const darkenedColor = color.darken();
  const saturatedColor = color.saturate();
  const desaturatedColor = color.desaturate();
  const grayscaleColor = color.grayscale();

  return (
    <Card>
      <div className="flex flex-row gap-2">
        <ColorBox
          color={color}
          label={color.toHex()}
          overlaySize="SMALL"
          overlayText="Original"
          width="STRETCH"
        />
        <ColorBox
          width="STRETCH"
          overlayText="Brighten"
          overlaySize="SMALL"
          label={brightenedColor.toHex()}
          color={brightenedColor}
        />
        <ColorBox
          color={darkenedColor}
          label={darkenedColor.toHex()}
          overlaySize="SMALL"
          overlayText="Darken"
          width="STRETCH"
        />
        <ColorBox
          color={saturatedColor}
          label={saturatedColor.toHex()}
          overlaySize="SMALL"
          overlayText="Saturate"
          width="STRETCH"
        />
        <ColorBox
          color={desaturatedColor}
          label={desaturatedColor.toHex()}
          overlaySize="SMALL"
          overlayText="Desaturate"
          width="STRETCH"
        />
        <ColorBox
          color={grayscaleColor}
          label={grayscaleColor.toHex()}
          overlaySize="SMALL"
          overlayText="Grayscale"
          width="STRETCH"
        />
      </div>
    </Card>
  );
}
