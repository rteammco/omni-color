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
  const stopValues =
    swatch.type === 'EXTENDED'
      ? [
          50,
          100,
          150,
          200,
          250,
          300,
          350,
          400,
          450,
          500,
          550,
          600,
          650,
          700,
          750,
          800,
          850,
          900,
          950,
        ] as const
      : [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

  return (
    <div className="w-full flex flex-row justify-center gap-0">
      <div className="flex flex-row justify-center gap-0 border-1 border-neutral-500 rounded-md overflow-hidden">
        {stopValues.map((stop) => (
          <ColorBox
            key={stop}
            color={swatch[stop]}
            hideBorder
            label={withLabels ? `${stop}` : undefined}
            noBorderRadius
          />
        ))}
      </div>
    </div>
  );
}
