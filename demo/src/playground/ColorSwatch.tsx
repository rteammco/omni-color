import type { Color, ColorSwatch as ColorSwatchType } from '../../../dist';
import { ColorBox } from '../components/ColorBox';

interface PropsFromColor {
  color: Color;
}

interface PropsFromSwatch {
  swatch: ColorSwatchType;
}

type Props = (PropsFromColor | PropsFromSwatch) & {
  withLabels?: boolean;
};

export function ColorSwatch(props: Props) {
  const { withLabels } = props;

  const swatch = 'swatch' in props ? props.swatch : props.color.getColorSwatch();

  return (
    <div className="w-full flex flex-row justify-center gap-0">
      <div className="flex flex-row justify-center gap-0 border-1 border-neutral-500 rounded-md overflow-hidden">
        <ColorBox
          color={swatch[100]}
          hideBorder
          label={withLabels ? '100' : undefined}
          noBorderRadius
        />
        <ColorBox
          color={swatch[200]}
          hideBorder
          label={withLabels ? '200' : undefined}
          noBorderRadius
        />
        <ColorBox
          color={swatch[300]}
          hideBorder
          label={withLabels ? '300' : undefined}
          noBorderRadius
        />
        <ColorBox
          color={swatch[400]}
          hideBorder
          label={withLabels ? '400' : undefined}
          noBorderRadius
        />
        <ColorBox
          color={swatch[500]}
          hideBorder
          label={withLabels ? '500' : undefined}
          noBorderRadius
        />
        <ColorBox
          color={swatch[600]}
          hideBorder
          label={withLabels ? '600' : undefined}
          noBorderRadius
        />
        <ColorBox
          color={swatch[700]}
          hideBorder
          label={withLabels ? '700' : undefined}
          noBorderRadius
        />
        <ColorBox
          color={swatch[800]}
          hideBorder
          label={withLabels ? '800' : undefined}
          noBorderRadius
        />
        <ColorBox
          color={swatch[900]}
          hideBorder
          label={withLabels ? '900' : undefined}
          noBorderRadius
        />
      </div>
    </div>
  );
}
