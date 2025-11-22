import type { Color, ColorSwatch as ColorSwatchType } from '../../../dist';
import { ColorBox } from '../components/ColorBox';

const BASIC_SWATCH_STOPS = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
const EXTENDED_SWATCH_STOPS = [
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
    <div className="w-full flex flex-row justify-center items-center gap-0">
      {title && <span className="text-center pr-4">{title}</span>}
      <div className="flex flex-row justify-center gap-0 border-1 border-neutral-500 rounded-md overflow-hidden">
        {swatch.type === 'EXTENDED'
          ? EXTENDED_SWATCH_STOPS.map((stopValue) => (
              <ColorBox
                key={stopValue}
                color={swatch[stopValue]}
                hideBorder
                label={withLabels ? `${stopValue}` : undefined}
                noBorderRadius
                width="HALF"
              />
            ))
          : BASIC_SWATCH_STOPS.map((stopValue) => (
              <ColorBox
                key={stopValue}
                color={swatch[stopValue]}
                hideBorder
                label={withLabels ? `${stopValue}` : undefined}
                noBorderRadius
              />
            ))}
      </div>
    </div>
  );
}
