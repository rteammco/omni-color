import { useMemo } from 'react';
import { Color } from '../../../dist';
import { ColorBox } from '../components/ColorBox';

interface Props {
  color: Color;
}

export function ColorCombinationDemo({ color }: Props) {
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
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="pb-2 pr-2 text-right">Mix</td>
            <td className="pb-2 px-2">
              <ColorBox color={color} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.mix([red])} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.mix([green])} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.mix([blue])} />
            </td>
            <td className="pb-2 px-2">
              <ColorBox color={color.mix([red, green, blue])} />
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
          </tr>
        </tbody>
      </table>
    </div>
  );
}
