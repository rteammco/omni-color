import { Color } from '../../../../dist';
import { GradientToCard } from './GradientToCard';

interface Props {
  color: Color;
}

export function GradientsDemo({ color }: Props) {
  return (
    <div>
      <GradientToCard color={color} />
    </div>
  );
}
