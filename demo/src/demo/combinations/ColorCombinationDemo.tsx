import { useMemo, useState } from 'react';
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

export function ColorCombinationDemo({ color }: Props) {
  const isDarkMode = useIsDarkMode();

  const [mixOptions, setMixOptions] = useState(DEFAULT_MIX_COLORS_OPTIONS);
  const [blendOptions, setBlendOptions] = useState(DEFAULT_BLEND_COLORS_OPTIONS);
  const [averageOptions, setAverageOptions] = useState(DEFAULT_AVERAGE_COLORS_OPTIONS);

  const { red, green, blue } = useMemo(() => {
    return { red: new Color('red'), green: new Color('green'), blue: new Color('blue') };
  }, []);

  const mixRed = color.mix([red], mixOptions);
  const mixGreen = color.mix([green], mixOptions);
  const mixBlue = color.mix([blue], mixOptions);
  const mixRGB = color.mix([red, green, blue], mixOptions);

  const blendRed = color.blend(red, blendOptions);
  const blendGreen = color.blend(green, blendOptions);
  const blendBlue = color.blend(blue, blendOptions);

  const averageRed = color.average([red], averageOptions);
  const averageGreen = color.average([green], averageOptions);
  const averageBlue = color.average([blue], averageOptions);
  const averageRGB = color.average([red, green, blue], averageOptions);

  return (
    <div className="w-full flex flex-col gap-4">
      <Card title="Mix">
        <div className="flex flex-row gap-2 mb-4">
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
      <Card title="Blend">
        <div className="flex flex-row gap-2 mb-4">
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
            overlayText="N/A"
            width="STRETCH"
          />
        </div>
        <BlendColorsOptionInputs blendOptions={blendOptions} onOptionsChanged={setBlendOptions} />
      </Card>
      <Card title="Average">
        <div className="flex flex-row gap-2 mb-4">
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
