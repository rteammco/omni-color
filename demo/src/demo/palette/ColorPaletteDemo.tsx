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
    <div className="w-full flex flex-col gap-4">
      <div>
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
      </div>
      <ColorSwatch swatch={palette.primary} title="Primary" withLabels />
      {palette.secondaryColors.map((swatch, index) => (
        <ColorSwatch
          key={index}
          title={`Secondary${palette.secondaryColors.length > 1 ? ` ${index + 1}` : ''}`}
          swatch={swatch}
          withLabels
        />
      ))}
      <ColorSwatch swatch={palette.neutrals} title="Neutrals" withLabels />
      <ColorSwatch swatch={palette.tintedNeutrals} title="Tinted neutrals" withLabels />
      <ColorSwatch swatch={palette.info} title="Info (semantic)" withLabels />
      <ColorSwatch swatch={palette.positive} title="Positive (semantic)" withLabels />
      <ColorSwatch swatch={palette.negative} title="Negative (semantic)" withLabels />
      <ColorSwatch swatch={palette.warning} title="Warning (semantic)" withLabels />
      <ColorSwatch swatch={palette.special} title="Special (semantic)" withLabels />
    </div>
  );
}
