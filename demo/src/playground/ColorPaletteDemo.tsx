import { useState } from 'react';
import { Color, ColorHarmony } from '../../../dist';
import { ColorSwatch } from './ColorSwatch';

const PALETTE_HARMONY_RADIO_GROUP_NAME = 'palette-color-harmony';

function PaletteHarmonyOptions({
  selectedHarmony,
  onHarmonySelectionChanged,
}: {
  selectedHarmony: ColorHarmony;
  onHarmonySelectionChanged: (harmony: ColorHarmony) => void;
}) {
  return (
    <div className="w-full flex flex-row justify-center items-center gap-4">
      <label className="flex flex-row items-center gap-1">
        <input
          checked={selectedHarmony === ColorHarmony.COMPLEMENTARY}
          name={PALETTE_HARMONY_RADIO_GROUP_NAME}
          type="radio"
          value={ColorHarmony.COMPLEMENTARY}
          onChange={() => onHarmonySelectionChanged(ColorHarmony.COMPLEMENTARY)}
        />
        Complementary
      </label>
      <label className="flex flex-row items-center gap-1">
        <input
          checked={selectedHarmony === ColorHarmony.SPLIT_COMPLEMENTARY}
          name={PALETTE_HARMONY_RADIO_GROUP_NAME}
          type="radio"
          value={ColorHarmony.SPLIT_COMPLEMENTARY}
          onChange={() => onHarmonySelectionChanged(ColorHarmony.SPLIT_COMPLEMENTARY)}
        />
        Split complementary
      </label>
      <label className="flex flex-row items-center gap-1">
        <input
          checked={selectedHarmony === ColorHarmony.TRIADIC}
          name={PALETTE_HARMONY_RADIO_GROUP_NAME}
          type="radio"
          value={ColorHarmony.TRIADIC}
          onChange={() => onHarmonySelectionChanged(ColorHarmony.TRIADIC)}
        />
        Triadic
      </label>
      <label className="flex flex-row items-center gap-1">
        <input
          checked={selectedHarmony === ColorHarmony.SQUARE}
          name={PALETTE_HARMONY_RADIO_GROUP_NAME}
          type="radio"
          value={ColorHarmony.SQUARE}
          onChange={() => onHarmonySelectionChanged(ColorHarmony.SQUARE)}
        />
        Square
      </label>
      <label className="flex flex-row items-center gap-1">
        <input
          checked={selectedHarmony === ColorHarmony.TETRADIC}
          name={PALETTE_HARMONY_RADIO_GROUP_NAME}
          type="radio"
          value={ColorHarmony.TETRADIC}
          onChange={() => onHarmonySelectionChanged(ColorHarmony.TETRADIC)}
        />
        Tetradic
      </label>
      <label className="flex flex-row items-center gap-1">
        <input
          checked={selectedHarmony === ColorHarmony.ANALOGOUS}
          name={PALETTE_HARMONY_RADIO_GROUP_NAME}
          type="radio"
          value={ColorHarmony.ANALOGOUS}
          onChange={() => onHarmonySelectionChanged(ColorHarmony.ANALOGOUS)}
        />
        Analogous
      </label>
      <label className="flex flex-row items-center gap-1">
        <input
          checked={selectedHarmony === ColorHarmony.MONOCHROMATIC}
          name={PALETTE_HARMONY_RADIO_GROUP_NAME}
          type="radio"
          value={ColorHarmony.MONOCHROMATIC}
          onChange={() => onHarmonySelectionChanged(ColorHarmony.MONOCHROMATIC)}
        />
        Monochromatic
      </label>
    </div>
  );
}

interface Props {
  color: Color;
}

export function ColorPaletteDemo({ color }: Props) {
  const [selectedHarmony, setSelectedHarmony] = useState(ColorHarmony.COMPLEMENTARY);

  const palette = color.getColorPalette(selectedHarmony);
  /*
    secondaryColors: ColorSwatch[];
  */

  return (
    <div>
      <PaletteHarmonyOptions
        selectedHarmony={selectedHarmony}
        onHarmonySelectionChanged={setSelectedHarmony}
      />
      <div className="w-full mt-3 flex flex-row justify-center">
        <table className="table-auto">
          <tbody>
            <tr>
              <td className="pb-2 pr-4 text-right">Primary</td>
              <td className="pb-2">
                <ColorSwatch swatch={palette.primary} withLabels />
              </td>
            </tr>
            {palette.secondaryColors.map((swatch, index) => (
              <tr key={index}>
                <td className="pb-2 pr-4 text-right">{`Secondary${
                  palette.secondaryColors.length > 1 ? ` ${index + 1}` : ''
                }`}</td>
                <td className="pb-2">
                  <ColorSwatch swatch={swatch} withLabels />
                </td>
              </tr>
            ))}
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
