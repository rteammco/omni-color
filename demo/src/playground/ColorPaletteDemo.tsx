import type { Color } from '../../../dist';
import { ColorSwatch } from './ColorSwatch';

interface Props {
  color: Color;
}

export function ColorPaletteDemo({ color }: Props) {
  const palette = color.getColorPalette();
  /*
    secondaryColors: ColorSwatch[];
  */
  return (
    <div>
      <h5 className="mb-3">Palette</h5>
      <div className="w-full flex flex-row justify-center">
        <table className="table-auto">
          <tbody>
            <tr>
              <td className="pb-2 pr-4 text-right">Primary</td>
              <td className="pb-2">
                <ColorSwatch swatch={palette.primary} withLabels />
              </td>
            </tr>
            <tr>
              <td className="pb-2 pr-4 text-right">Neutrals</td>
              <td className="pb-2">
                <ColorSwatch swatch={palette.neutrals} withLabels />
              </td>
            </tr>
            <tr>
              <td className="pb-2 pr-4 text-right">Info (semantic)</td>
              <td className="pb-2">
                <ColorSwatch swatch={palette.info} withLabels />
              </td>
            </tr>
            <tr>
              <td className="pb-2 pr-4 text-right">Positive (semantic)</td>
              <td className="pb-2">
                <ColorSwatch swatch={palette.positive} withLabels />
              </td>
            </tr>
            <tr>
              <td className="pb-2 pr-4 text-right">Negative (semantic)</td>
              <td className="pb-2">
                <ColorSwatch swatch={palette.negative} withLabels />
              </td>
            </tr>
            <tr>
              <td className="pb-2 pr-4 text-right">Warning (semantic)</td>
              <td className="pb-2">
                <ColorSwatch swatch={palette.warning} withLabels />
              </td>
            </tr>
            <tr>
              <td className="pr-4 text-right">Special (semantic)</td>
              <td>
                <ColorSwatch swatch={palette.special} withLabels />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
