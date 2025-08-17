import type { Color } from '../../../dist';
import { ColorBox } from '../components/ColorBox';

interface Props {
  color: Color;
}

export function ColorSwatch({ color }: Props) {
  const swatch = color.getColorSwatch();

  return (
    <div className="w-full flex flex-row justify-center gap-0">
      <div className="flex flex-row justify-center gap-0 border-1 border-neutral-500 rounded-md overflow-hidden">
        <ColorBox color={swatch[100]} hideBorder noBorderRadius />
        <ColorBox color={swatch[200]} hideBorder noBorderRadius />
        <ColorBox color={swatch[300]} hideBorder noBorderRadius />
        <ColorBox color={swatch[400]} hideBorder noBorderRadius />
        <ColorBox color={swatch[500]} hideBorder noBorderRadius />
        <ColorBox color={swatch[600]} hideBorder noBorderRadius />
        <ColorBox color={swatch[700]} hideBorder noBorderRadius />
        <ColorBox color={swatch[800]} hideBorder noBorderRadius />
        <ColorBox color={swatch[900]} hideBorder noBorderRadius />
      </div>
    </div>
  );
}
