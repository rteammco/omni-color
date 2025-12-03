import { Color } from '../../../../dist';
import { GradientThroughCard } from './GradientThroughCard';
import { GradientToCard } from './GradientToCard';

interface Props {
  color: Color;
}

export function GradientsDemo({ color }: Props) {
  return (
    <div className="w-full flex flex-col gap-4">
      <GradientToCard color={color} />
      <GradientThroughCard color={color} />
    </div>
  );
}
