import type { GenerateColorPaletteOptions } from '../../../../dist';
import { InputGroup } from '../../components/inputs/InputGroup';
import { NumberInput } from '../../components/inputs/NumberInput';

interface Props {
  options: GenerateColorPaletteOptions;
  onOptionsChanged: (options: GenerateColorPaletteOptions) => void;
  onReset: () => void;
}

export function PaletteGenerationOptions({ options, onOptionsChanged, onReset }: Props) {
  return (
    <InputGroup onResetClicked={onReset}>
      <NumberInput
        label={
          <span>
            <u>Tinted neutrals</u> chroma factor
          </span>
        }
        max={1}
        min={0}
        step={0.01}
        value={options.neutralHarmonization?.tintChromaFactor}
        onChange={(value) =>
          onOptionsChanged({
            ...options,
            neutralHarmonization: {
              ...options.neutralHarmonization,
              tintChromaFactor: value,
            },
          })
        }
      />
      <NumberInput
        label={
          <span>
            <u>Tinted neutrals</u> max chroma
          </span>
        }
        max={1}
        min={0}
        step={0.01}
        value={options.neutralHarmonization?.maxTintChroma}
        onChange={(value) =>
          onOptionsChanged({
            ...options,
            neutralHarmonization: {
              ...options.neutralHarmonization,
              maxTintChroma: value,
            },
          })
        }
      />
      <NumberInput
        label={
          <span>
            <u>Semantic</u> hue pull
          </span>
        }
        max={1}
        min={0}
        step={0.01}
        value={options.semanticHarmonization?.huePull}
        onChange={(value) =>
          onOptionsChanged({
            ...options,
            semanticHarmonization: {
              ...options.semanticHarmonization,
              huePull: value,
            },
          })
        }
      />
      <label>
        <div className="flex flex-row items-center gap-2">
          <u>Semantic</u> chroma range:
          <NumberInput
            max={1}
            min={0}
            step={0.01}
            value={options.semanticHarmonization?.chromaRange?.[0]}
            onChange={(value) =>
              onOptionsChanged({
                ...options,
                semanticHarmonization: {
                  ...options.semanticHarmonization,
                  chromaRange: [value, options.semanticHarmonization?.chromaRange?.[1] ?? value],
                },
              })
            }
          />
          -
          <NumberInput
            max={1}
            min={0}
            step={0.01}
            value={options.semanticHarmonization?.chromaRange?.[1]}
            onChange={(value) =>
              onOptionsChanged({
                ...options,
                semanticHarmonization: {
                  ...options.semanticHarmonization,
                  chromaRange: [options.semanticHarmonization?.chromaRange?.[0] ?? value, value],
                },
              })
            }
          />
        </div>
      </label>
    </InputGroup>
  );
}

//  chromaRange: [0.02, 0.25],
