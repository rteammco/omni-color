import type { Color } from '../../../dist';
import { ColorBox } from '../components/ColorBox';

function CenteredCellContainer({ children }: { children: React.ReactNode }) {
  return <div className="w-full flex justify-center">{children}</div>;
}

interface Props {
  color: Color;
}

export function ColorManipulationDemo({ color }: Props) {
  return (
    <div className="w-full flex flex-row justify-center">
      <div className="w-2xl">
        <table className="table-fixed w-full border-collapse">
          <thead>
            <tr>
              <th className="pb-1 font-normal">Original</th>
              <th className="pb-1 font-normal">Brighten</th>
              <th className="pb-1 font-normal">Darken</th>
              <th className="pb-1 font-normal">Saturate</th>
              <th className="pb-1 font-normal">Desaturate</th>
              <th className="pb-1 font-normal">Grayscale</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <CenteredCellContainer>
                  <ColorBox color={color} />
                </CenteredCellContainer>
              </td>
              <td>
                <CenteredCellContainer>
                  <ColorBox color={color.brighten()} />
                </CenteredCellContainer>
              </td>
              <td>
                <CenteredCellContainer>
                  <ColorBox color={color.darken()} />
                </CenteredCellContainer>
              </td>
              <td>
                <CenteredCellContainer>
                  <ColorBox color={color.saturate()} />
                </CenteredCellContainer>
              </td>
              <td>
                <CenteredCellContainer>
                  <ColorBox color={color.desaturate()} />
                </CenteredCellContainer>
              </td>
              <td>
                <CenteredCellContainer>
                  <ColorBox color={color.grayscale()} />
                </CenteredCellContainer>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
