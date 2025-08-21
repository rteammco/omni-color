import { useMemo, useState } from 'react';
import {
  BlendMode,
  BlendSpace,
  Color,
  MixSpace,
  MixType,
  type AverageColorsOptions,
  type BlendColorsOptions,
  type MixColorsOptions,
} from '../../../../dist';
import { ColorBox } from '../../components/ColorBox';
import { MixColorsOptionInputs } from './MixColorsOptionInputs';
import { BlendColorsOptionInputs } from './BlendColorsOptionInputs';
import { AverageColorsOptionInputs } from './AverageColorsOptionInputs';

interface Props {
  color: Color;
}

export function ColorCombinationDemo({ color }: Props) {
  const [mixOptions, setMixOptions] = useState<MixColorsOptions>({
    space: MixSpace.RGB,
    type: MixType.ADDITIVE,
  });

  const [blendOptions, setBlendOptions] = useState<BlendColorsOptions>({
    mode: BlendMode.NORMAL,
    space: BlendSpace.RGB,
    ratio: 0.5,
  });

  const [averageOptions, setAverageOptions] = useState<AverageColorsOptions>({
    space: MixSpace.RGB,
  });

  const { red, green, blue } = useMemo(() => {
    return { red: new Color('red'), green: new Color('green'), blue: new Color('blue') };
  }, []);

  return (
    <div className="w-full flex flex-row justify-center">
      <table className="table-auto">
        <thead>
          <tr>
            <th />
            <th className="pb-1 font-normal">Original</th>
            <th className="pb-1 font-normal">+ Red</th>
            <th className="pb-1 font-normal">+ Green</th>
            <th className="pb-1 font-normal">+ Blue</th>
            <th className="pb-1 font-normal">+ RGB</th>
            <th className="pb-1 font-normal">Options</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="pb-2 pr-2 text-right">Mix</td>
            <td className="pb-2 px-2">
              <ColorBox color={color} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.mix([red], mixOptions)} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.mix([green], mixOptions)} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.mix([blue], mixOptions)} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.mix([red, green, blue], mixOptions)} />
            </td>
            <td className="pb-2 px-2">
              <MixColorsOptionInputs mixOptions={mixOptions} onOptionsChanged={setMixOptions} />
            </td>
          </tr>
          <tr>
            <td className="pb-2 pr-2 text-right">Blend</td>
            <td className="pb-2 px-2">
              <ColorBox color={color} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.blend(red, blendOptions)} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.blend(green, blendOptions)} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.blend(blue, blendOptions)} />
            </td>
            <td className="pb-2 px-2">N / A</td>
            <td className="pb-2 px-2">
              <BlendColorsOptionInputs
                blendOptions={blendOptions}
                onOptionsChanged={setBlendOptions}
              />
            </td>
          </tr>
          <tr>
            <td className="pb-2 pr-2 text-right">Average</td>
            <td className="pb-2 px-2">
              <ColorBox color={color} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.average([red], averageOptions)} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.average([green], averageOptions)} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.average([blue], averageOptions)} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.average([red, green, blue], averageOptions)} />
            </td>
            <td className="pb-2 px-2">
              <AverageColorsOptionInputs
                mixOptions={averageOptions}
                onOptionsChanged={setAverageOptions}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
