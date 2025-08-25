import { useState } from 'react';
import { Color, type ColorHarmony, type GenerateColorPaletteOptions } from '../../../../dist';
import { ColorSwatch } from '../ColorSwatch';
import { PaletteHarmonyOptions } from './PaletteHarmonyOptions';
import { PaletteGenerationOptions } from './PaletteGenerationOptions';
import { VSpace } from '../../components/VSpace';

const DEFAULT_GENERATE_COLOR_PALETTE_OPTIONS: GenerateColorPaletteOptions = {
  neutralHarmonization: {
    tintChromaFactor: 0.1,
    maxTintChroma: 0.04,
  },
  semanticHarmonization: {
    huePull: 0.1,
    chromaRange: [0.02, 0.25],
  },
} as const;

interface Props {
  color: Color;
}

export function ColorPaletteDemo({ color }: Props) {
  const [selectedHarmony, setSelectedHarmony] = useState<ColorHarmony>('COMPLEMENTARY');
  const [options, setOptions] = useState<GenerateColorPaletteOptions>(
    DEFAULT_GENERATE_COLOR_PALETTE_OPTIONS
  );

  const palette = color.getColorPalette(selectedHarmony, options);

  return (
    <div className="w-full">
      <PaletteHarmonyOptions
        selectedHarmony={selectedHarmony}
        onHarmonySelectionChanged={setSelectedHarmony}
      />
      <VSpace height={8} />
      <PaletteGenerationOptions
        options={options}
        onOptionsChanged={setOptions}
        onReset={() => setOptions(DEFAULT_GENERATE_COLOR_PALETTE_OPTIONS)}
      />
      <VSpace height={12} />
      <div className="w-full overflow-x-auto">
        <table className="table-auto mx-auto">
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
              <td className="pb-2 pr-4 text-right">Tinted neutrals</td>
              <td className="pb-2">
                <ColorSwatch swatch={palette.tintedNeutrals} withLabels />
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
