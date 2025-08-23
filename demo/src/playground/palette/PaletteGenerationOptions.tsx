import type { GenerateColorPaletteOptions } from '../../../../dist';

interface Props {
  options: GenerateColorPaletteOptions;
  onOptionsChanged: (options: GenerateColorPaletteOptions) => void;
  onReset: () => void;
}

export function PaletteGenerationOptions({ options, onOptionsChanged, onReset }: Props) {
  return (
    <div className="w-full flex flex-row justify-center items-center gap-2 flex-wrap">
      <label>
        <u>Tinted neutrals</u> chroma factor:
        <input
          className="ml-2 px-2 py-0.5 w-20 border-1 border-gray-200 rounded-md shadow-md"
          max={1}
          min={0}
          step={0.01}
          type="number"
          value={options.neutralHarmonization?.tintChromaFactor}
          onChange={(e) =>
            onOptionsChanged({
              ...options,
              neutralHarmonization: {
                ...options.neutralHarmonization,
                tintChromaFactor: Number(e.target.value),
              },
            })
          }
        />
      </label>
      &middot;
      <label>
        <u>Tinted neutrals</u> max chroma:
        <input
          className="ml-2 px-2 w-20 border-1 border-gray-200 rounded-md shadow-md"
          max={1}
          min={0}
          step={0.01}
          type="number"
          value={options.neutralHarmonization?.maxTintChroma}
          onChange={(e) =>
            onOptionsChanged({
              ...options,
              neutralHarmonization: {
                ...options.neutralHarmonization,
                maxTintChroma: Number(e.target.value),
              },
            })
          }
        />
      </label>
      &middot;
      <label>
        <u>Semantic</u> hue pull:
        <input
          className="ml-2 px-2 py-0.5 w-20 border-1 border-gray-200 rounded-md shadow-md"
          max={1}
          min={0}
          step={0.01}
          type="number"
          value={options.semanticHarmonization?.huePull}
          onChange={(e) =>
            onOptionsChanged({
              ...options,
              semanticHarmonization: {
                ...options.semanticHarmonization,
                huePull: Number(e.target.value),
              },
            })
          }
        />
      </label>
      <label>
        <u>Semantic</u> chroma range:
        <input
          className="ml-2 mr-1 px-2 py-0.5 w-20 border-1 border-gray-200 rounded-md shadow-md"
          max={1}
          min={0}
          step={0.01}
          type="number"
          value={options.semanticHarmonization?.chromaRange?.[0]}
          onChange={(e) =>
            onOptionsChanged({
              ...options,
              semanticHarmonization: {
                ...options.semanticHarmonization,
                chromaRange: [
                  Number(e.target.value),
                  options.semanticHarmonization?.chromaRange?.[1] ?? Number(e.target.value),
                ],
              },
            })
          }
        />
        -
        <input
          className="ml-1 px-2 py-0.5 w-20 border-1 border-gray-200 rounded-md shadow-md"
          max={1}
          min={0}
          step={0.01}
          type="number"
          value={options.semanticHarmonization?.chromaRange?.[1]}
          onChange={(e) =>
            onOptionsChanged({
              ...options,
              semanticHarmonization: {
                ...options.semanticHarmonization,
                chromaRange: [
                  options.semanticHarmonization?.chromaRange?.[0] ?? Number(e.target.value),
                  Number(e.target.value),
                ],
              },
            })
          }
        />
      </label>
      &middot;
      <button onClick={onReset}>Reset</button>
    </div>
  );
}

//  chromaRange: [0.02, 0.25],
