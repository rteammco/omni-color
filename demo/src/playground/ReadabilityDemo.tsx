import { useMemo } from 'react';
import { Color } from '../../../dist';
import { ColorBox } from '../components/ColorBox';

interface Props {
  color: Color;
}

export function ReadabilityDemo({ color }: Props) {
  const backgroundColors = useMemo(
    () => [
      new Color('black'),
      new Color('#333'),
      new Color('#666'),
      new Color('#999'),
      new Color('#ccc'),
      new Color('white'),
      new Color('red'),
      new Color('green'),
      new Color('blue'),
    ],
    []
  );

  return (
    <div className="w-full flex flex-row justify-center">
      <table className="table-auto">
        <tbody>
          <tr>
            <td className="pb-2 pr-4 text-right">Contrast ratio</td>
            <td className="pb-2">
              <div className="flex flex-row items-center gap-2">
                {backgroundColors.map((bgColor) => (
                  <ColorBox
                    key={bgColor.toHex()}
                    color={bgColor}
                    label={color.getContrastRatio(bgColor).toFixed(2)}
                    overlayColor={color}
                  />
                ))}
              </div>
            </td>
          </tr>
          <tr>
            <td className="pb-2 pr-4 text-right">Readability score</td>
            <td className="pb-2">
              <div className="flex flex-row items-center gap-2">
                {backgroundColors.map((bgColor) => (
                  <ColorBox
                    key={bgColor.toHex()}
                    color={bgColor}
                    label={color.getReadabilityScore(bgColor).toFixed(2)}
                    overlayColor={color}
                  />
                ))}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
