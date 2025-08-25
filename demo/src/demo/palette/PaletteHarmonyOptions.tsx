import type { ColorHarmony } from '../../../../dist';

const PALETTE_HARMONY_RADIO_GROUP_NAME = 'palette-color-harmony';

interface Props {
  selectedHarmony: ColorHarmony;
  onHarmonySelectionChanged: (harmony: ColorHarmony) => void;
}

export function PaletteHarmonyOptions({ selectedHarmony, onHarmonySelectionChanged }: Props) {
  return (
    <div className="w-full flex flex-row justify-center items-center gap-4 flex-wrap">
      <label className="flex flex-row items-center gap-1">
        <input
          checked={selectedHarmony === 'COMPLEMENTARY'}
          name={PALETTE_HARMONY_RADIO_GROUP_NAME}
          type="radio"
          value="COMPLEMENTARY"
          onChange={() => onHarmonySelectionChanged('COMPLEMENTARY')}
        />
        Complementary
      </label>
      <label className="flex flex-row items-center gap-1">
        <input
          checked={selectedHarmony === 'SPLIT_COMPLEMENTARY'}
          name={PALETTE_HARMONY_RADIO_GROUP_NAME}
          type="radio"
          value="SPLIT_COMPLEMENTARY"
          onChange={() => onHarmonySelectionChanged('SPLIT_COMPLEMENTARY')}
        />
        Split complementary
      </label>
      <label className="flex flex-row items-center gap-1">
        <input
          checked={selectedHarmony === 'TRIADIC'}
          name={PALETTE_HARMONY_RADIO_GROUP_NAME}
          type="radio"
          value="TRIADIC"
          onChange={() => onHarmonySelectionChanged('TRIADIC')}
        />
        Triadic
      </label>
      <label className="flex flex-row items-center gap-1">
        <input
          checked={selectedHarmony === 'SQUARE'}
          name={PALETTE_HARMONY_RADIO_GROUP_NAME}
          type="radio"
          value="SQUARE"
          onChange={() => onHarmonySelectionChanged('SQUARE')}
        />
        Square
      </label>
      <label className="flex flex-row items-center gap-1">
        <input
          checked={selectedHarmony === 'TETRADIC'}
          name={PALETTE_HARMONY_RADIO_GROUP_NAME}
          type="radio"
          value="TETRADIC"
          onChange={() => onHarmonySelectionChanged('TETRADIC')}
        />
        Tetradic
      </label>
      <label className="flex flex-row items-center gap-1">
        <input
          checked={selectedHarmony === 'ANALOGOUS'}
          name={PALETTE_HARMONY_RADIO_GROUP_NAME}
          type="radio"
          value="ANALOGOUS"
          onChange={() => onHarmonySelectionChanged('ANALOGOUS')}
        />
        Analogous
      </label>
      <label className="flex flex-row items-center gap-1">
        <input
          checked={selectedHarmony === 'MONOCHROMATIC'}
          name={PALETTE_HARMONY_RADIO_GROUP_NAME}
          type="radio"
          value="MONOCHROMATIC"
          onChange={() => onHarmonySelectionChanged('MONOCHROMATIC')}
        />
        Monochromatic
      </label>
    </div>
  );
}
