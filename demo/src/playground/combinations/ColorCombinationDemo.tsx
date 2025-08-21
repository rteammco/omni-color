import { useMemo, useState } from 'react';
import { Color, MixSpace, MixType, type MixColorsOptions } from '../../../../dist';
import { ColorBox } from '../../components/ColorBox';
import { MixColorsOptionInputs } from './MixColorsOptionInputs';

interface Props {
  color: Color;
}

export function ColorCombinationDemo({ color }: Props) {
  const [mixOptions, setMixOptions] = useState<MixColorsOptions>({
    space: MixSpace.RGB,
    type: MixType.ADDITIVE,
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
              <ColorBox color={color.blend(red)} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.blend(green)} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.blend(blue)} />
            </td>
            <td className="pb-2 px-2">N / A</td>
            <td className="pb-2 px-2">TODO - options</td>
          </tr>
          <tr>
            <td className="pb-2 pr-2 text-right">Average</td>
            <td className="pb-2 px-2">
              <ColorBox color={color} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.average([red])} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.average([green])} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.average([blue])} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.average([red, green, blue])} />
            </td>
            <td className="pb-2 px-2">TODO - options</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
