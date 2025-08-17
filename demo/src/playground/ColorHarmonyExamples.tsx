import type { Color } from '../../../dist';
import { ColorBox } from '../components/ColorBox';

function ColorHarmonyRow({ colors }: { colors: Color[] }) {
  return (
    <div className="flex flex-row gap-2">
      {colors.map((color, index) => (
        <ColorBox key={index} color={color} />
      ))}
    </div>
  );
}

interface Props {
  color: Color;
}

export function ColorHarmonyExamples({ color }: Props) {
  return (
    <div>
      <h5 className="mb-3">Harmonies</h5>
      <div className="w-full flex flex-row justify-center">
        <table className="table-auto">
          <tbody>
            <tr>
              <td className="pb-2 pr-2 text-right">Complementary</td>
              <td className="pb-2">
                <ColorHarmonyRow colors={color.getComplementaryColors()} />
              </td>
            </tr>
            <tr>
              <td className="pb-2 pr-2 text-right">Split complementary</td>
              <td className="pb-2">
                <ColorHarmonyRow colors={color.getSplitComplementaryColors()} />
              </td>
            </tr>
            <tr>
              <td className="pb-2 pr-2 text-right">Triadic</td>
              <td className="pb-2">
                <ColorHarmonyRow colors={color.getTriadicHarmonyColors()} />
              </td>
            </tr>
            <tr>
              <td className="pb-2 pr-2 text-right">Square</td>
              <td className="pb-2">
                <ColorHarmonyRow colors={color.getSquareHarmonyColors()} />
              </td>
            </tr>
            <tr>
              <td className="pb-2 pr-2 text-right">Tetradic</td>
              <td className="pb-2">
                <ColorHarmonyRow colors={color.getTetradicHarmonyColors()} />
              </td>
            </tr>
            <tr>
              <td className="pb-2 pr-2 text-right">Analogous</td>
              <td className="pb-2">
                <ColorHarmonyRow colors={color.getAnalogousHarmonyColors()} />
              </td>
            </tr>
            <tr>
              <td className="pr-2 text-right">Monochromatic</td>
              <td>
                <ColorHarmonyRow colors={color.getMonochromaticHarmonyColors()} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
