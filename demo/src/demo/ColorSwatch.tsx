import type { Color, ColorSwatch as ColorSwatchType } from '../../../dist';
import { Card } from '../components/Card';
import { ColorBox } from '../components/ColorBox';
import { IconType } from '../components/Icon.types';

const BASE_SWATCH_SHADES = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
const EXTENDED_SWATCH_SHADES = [
  50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950,
] as const;

interface PropsFromColor {
  color: Color;
}

interface PropsFromSwatch {
  swatch: ColorSwatchType;
}

type Props = (PropsFromColor | PropsFromSwatch) & {
  title?: string;
  withLabels?: boolean;
};

export function ColorSwatch(props: Props) {
  const { title, withLabels } = props;

  const swatch = 'swatch' in props ? props.swatch : props.color.getColorSwatch();

  return (
    <div className="flex flex-col gap-1">
      <Card title={title}>
        <div className="flex flex-row gap-0 justify-center overflow-hidden">
          {swatch.type === 'EXTENDED'
            ? EXTENDED_SWATCH_SHADES.map((shade) => (
                <ColorBox
                  key={shade}
                  color={swatch[shade]}
                  hideBorder
                  label={withLabels ? `${shade}` : undefined}
                  labelResponsive
                  noBorderRadius
                  overlayIcon={shade === swatch.baseShade ? IconType.CHECK : undefined}
                  width="STRETCH"
                />
              ))
            : BASE_SWATCH_SHADES.map((shade) => (
                <ColorBox
                  key={shade}
                  color={swatch[shade]}
                  hideBorder
                  label={withLabels ? `${shade}` : undefined}
                  labelResponsive
                  noBorderRadius
                  overlayIcon={shade === swatch.baseShade ? IconType.CHECK : undefined}
                  width="STRETCH"
                />
              ))}
        </div>
      </Card>
    </div>
  );
}
