import { ColorHarmony } from '../../../../dist';

const PALETTE_HARMONY_RADIO_GROUP_NAME = 'palette-color-harmony';

interface Props {
  selectedHarmony: ColorHarmony;
  onHarmonySelectionChanged: (harmony: ColorHarmony) => void;
}

export function PaletteHarmonyOptions({ selectedHarmony, onHarmonySelectionChanged }: Props) {
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
