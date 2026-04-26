import { useMemo, useState } from 'react';
import type { AverageColorsOptions, BlendColorsOptions, MixColorsOptions } from '../../../../dist';
import { Color } from '../../../../dist';
import { ColorBox } from '../../components/ColorBox';
import { MixColorsOptionInputs } from './MixColorsOptionInputs';
import { BlendColorsOptionInputs } from './BlendColorsOptionInputs';
import { AverageColorsOptionInputs } from './AverageColorsOptionInputs';
import { Card } from '../../components/Card';
import { useIsDarkMode } from '../../components/utils';
import {
  DEFAULT_AVERAGE_COLORS_OPTIONS,
  DEFAULT_BLEND_COLORS_OPTIONS,
  DEFAULT_MIX_COLORS_OPTIONS,
} from './colorCombinationDemo.consts';

interface Props {
  color: Color;
}

function getMixCodeSnippet(colorHex: string, mixOptions: MixColorsOptions) {
  const mixSpace = mixOptions.space ?? DEFAULT_MIX_COLORS_OPTIONS.space;
  const mixType = mixOptions.type ?? DEFAULT_MIX_COLORS_OPTIONS.type;
  return `
const color = new Color('${colorHex}');

const red = new Color('red');
const green = new Color('green');
const blue = new Color('blue');

const mixedWithRed = color.mixWith([red], { space: '${mixSpace}', type: '${mixType}' });
const mixedWithGreen = color.mixWith([green], { space: '${mixSpace}', type: '${mixType}' });
const mixedWithBlue = color.mixWith([blue], { space: '${mixSpace}', type: '${mixType}' });
const mixedWithAll = color.mixWith([red, green, blue], { space: '${mixSpace}', type: '${mixType}' });
`;
}

function getBlendCodeSnippet(colorHex: string, blendOptions: BlendColorsOptions) {
  const blendMode = blendOptions.mode ?? DEFAULT_BLEND_COLORS_OPTIONS.mode;
  const blendSpace = blendOptions.space ?? DEFAULT_BLEND_COLORS_OPTIONS.space;
  const blendRatio = blendOptions.ratio ?? DEFAULT_BLEND_COLORS_OPTIONS.ratio;
  return `
const color = new Color('${colorHex}');

const red = new Color('red');
const green = new Color('green');
const blue = new Color('blue');

const blendedWithRed = color.blendWith(red, { mode: '${blendMode}', space: '${blendSpace}', ratio: ${blendRatio} });
const blendedWithGreen = color.blendWith(green, { mode: '${blendMode}', space: '${blendSpace}', ratio: ${blendRatio} });
const blendedWithBlue = color.blendWith(blue, { mode: '${blendMode}', space: '${blendSpace}', ratio: ${blendRatio} });
`;
}

function getAverageCodeSnippet(colorHex: string, averageOptions: AverageColorsOptions) {
  const averageSpace = averageOptions.space ?? DEFAULT_AVERAGE_COLORS_OPTIONS.space;
  return `
const color = new Color('${colorHex}');

const red = new Color('red');
const green = new Color('green');
const blue = new Color('blue');

const averagedWithRed = color.averageWith([red], { space: '${averageSpace}' });
const averagedWithGreen = color.averageWith([green], { space: '${averageSpace}' });
const averagedWithBlue = color.averageWith([blue], { space: '${averageSpace}' });
const averagedWithAll = color.averageWith([red, green, blue], { space: '${averageSpace}' });
`;
}

export function ColorCombinationDemo({ color }: Props) {
  const isDarkMode = useIsDarkMode();

  const [mixOptions, setMixOptions] = useState(DEFAULT_MIX_COLORS_OPTIONS);
  const [blendOptions, setBlendOptions] = useState(DEFAULT_BLEND_COLORS_OPTIONS);
  const [averageOptions, setAverageOptions] = useState(DEFAULT_AVERAGE_COLORS_OPTIONS);

  const { red, green, blue } = useMemo(() => {
    return { red: new Color('red'), green: new Color('green'), blue: new Color('blue') };
  }, []);

  const mixRed = color.mixWith([red], mixOptions);
  const mixGreen = color.mixWith([green], mixOptions);
  const mixBlue = color.mixWith([blue], mixOptions);
  const mixRGB = color.mixWith([red, green, blue], mixOptions);

  const blendRed = color.blendWith(red, blendOptions);
  const blendGreen = color.blendWith(green, blendOptions);
  const blendBlue = color.blendWith(blue, blendOptions);

  const averageRed = color.averageWith([red], averageOptions);
  const averageGreen = color.averageWith([green], averageOptions);
  const averageBlue = color.averageWith([blue], averageOptions);
  const averageRGB = color.averageWith([red, green, blue], averageOptions);

  return (
    <div className="w-full flex flex-col gap-4">
      <Card codeSnippet={getMixCodeSnippet(color.toHex8(), mixOptions)} title="Mix">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-4">
          <ColorBox
            color={color}
            label={color.toHex()}
            overlaySize="SMALL"
            overlayText="Original"
            width="STRETCH"
          />
          <ColorBox
            color={mixRed}
            label={mixRed.toHex()}
            overlaySize="SMALL"
            overlayText="+Red"
            width="STRETCH"
          />
          <ColorBox
            color={mixGreen}
            label={mixGreen.toHex()}
            overlaySize="SMALL"
            overlayText="+Green"
            width="STRETCH"
          />
          <ColorBox
            color={mixBlue}
            label={mixBlue.toHex()}
            overlaySize="SMALL"
            overlayText="+Blue"
            width="STRETCH"
          />
          <ColorBox
            color={mixRGB}
            label={mixRGB.toHex()}
            overlaySize="SMALL"
            overlayText="+RGB"
            width="STRETCH"
          />
        </div>
        <MixColorsOptionInputs mixOptions={mixOptions} onOptionsChanged={setMixOptions} />
      </Card>
      <Card codeSnippet={getBlendCodeSnippet(color.toHex8(), blendOptions)} title="Blend">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-4">
          <ColorBox
            color={color}
            label={color.toHex()}
            overlaySize="SMALL"
            overlayText="Original"
            width="STRETCH"
          />
          <ColorBox
            color={blendRed}
            label={blendRed.toHex()}
            overlaySize="SMALL"
            overlayText="+Red"
            width="STRETCH"
          />
          <ColorBox
            color={blendGreen}
            label={blendGreen.toHex()}
            overlaySize="SMALL"
            overlayText="+Green"
            width="STRETCH"
          />
          <ColorBox
            color={blendBlue}
            label={blendBlue.toHex()}
            overlaySize="SMALL"
            overlayText="+Blue"
            width="STRETCH"
          />
          <ColorBox
            color={isDarkMode ? new Color('#00000000') : new Color('#ffffff00')}
            label="Not supported"
            overlaySize="SMALL"
            overlayText="+RGB (N/A)"
            width="STRETCH"
          />
        </div>
        <BlendColorsOptionInputs blendOptions={blendOptions} onOptionsChanged={setBlendOptions} />
      </Card>
      <Card codeSnippet={getAverageCodeSnippet(color.toHex8(), averageOptions)} title="Average">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-4">
          <ColorBox
            color={color}
            label={color.toHex()}
            overlaySize="SMALL"
            overlayText="Original"
            width="STRETCH"
          />
          <ColorBox
            color={averageRed}
            label={averageRed.toHex()}
            overlaySize="SMALL"
            overlayText="+Red"
            width="STRETCH"
          />
          <ColorBox
            color={averageGreen}
            label={averageGreen.toHex()}
            overlaySize="SMALL"
            overlayText="+Green"
            width="STRETCH"
          />
          <ColorBox
            color={averageBlue}
            label={averageBlue.toHex()}
            overlaySize="SMALL"
            overlayText="+Blue"
            width="STRETCH"
          />
          <ColorBox
            color={averageRGB}
            label={averageRGB.toHex()}
            overlaySize="SMALL"
            overlayText="+RGB"
            width="STRETCH"
          />
        </div>
        <AverageColorsOptionInputs
          mixOptions={averageOptions}
          onOptionsChanged={setAverageOptions}
        />
      </Card>
    </div>
  );
}
