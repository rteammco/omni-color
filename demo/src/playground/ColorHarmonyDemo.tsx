import React from 'react';
import type { Color } from '../../../dist';
import { ColorBox } from '../components/ColorBox';
import { Icon } from '../components/Icon';

function ColorHarmonyRow({ colors }: { colors: Color[] }) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <ColorBox color={colors[0]} />
      <Icon size={20} type={Icon.TYPE.ARROW_RIGHT} />
      {colors.slice(1).map((color, index) => (
        <React.Fragment key={index}>
          <ColorBox color={color} />
          {index < colors.length - 2 && <Icon size={20} type={Icon.TYPE.PLUS} />}
        </React.Fragment>
      ))}
    </div>
  );
}

interface Props {
  color: Color;
}

export function ColorHarmonyDemo({ color }: Props) {
  return (
    <div className="w-full flex flex-row justify-center">
      <table className="table-auto">
        <tbody>
          <tr>
            <td className="pb-2 pr-4 text-right">Complementary</td>
            <td className="pb-2">
              <ColorHarmonyRow colors={color.getComplementaryColors()} />
            </td>
          </tr>
          <tr>
            <td className="pb-2 pr-4 text-right">Split complementary</td>
            <td className="pb-2">
              <ColorHarmonyRow colors={color.getSplitComplementaryColors()} />
            </td>
          </tr>
          <tr>
            <td className="pb-2 pr-4 text-right">Triadic</td>
            <td className="pb-2">
              <ColorHarmonyRow colors={color.getTriadicHarmonyColors()} />
            </td>
          </tr>
          <tr>
            <td className="pb-2 pr-4 text-right">Square</td>
            <td className="pb-2">
              <ColorHarmonyRow colors={color.getSquareHarmonyColors()} />
            </td>
          </tr>
          <tr>
            <td className="pb-2 pr-4 text-right">Tetradic</td>
            <td className="pb-2">
              <ColorHarmonyRow colors={color.getTetradicHarmonyColors()} />
            </td>
          </tr>
          <tr>
            <td className="pb-2 pr-4 text-right">Analogous</td>
            <td className="pb-2">
              <ColorHarmonyRow colors={color.getAnalogousHarmonyColors()} />
            </td>
          </tr>
          <tr>
            <td className="pr-4 text-right">Monochromatic</td>
            <td>
              <ColorHarmonyRow colors={color.getMonochromaticHarmonyColors()} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
