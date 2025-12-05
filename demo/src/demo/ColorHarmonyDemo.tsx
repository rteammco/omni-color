import React from 'react';
import type { Color } from '../../../dist';
import { ColorBox } from '../components/ColorBox';
import { Icon } from '../components/Icon';
import { Card } from '../components/Card';

function ColorHarmonyRow({ colors }: { colors: Color[] }) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <ColorBox
        color={colors[0]}
        label={colors[0].getName().name}
        overlayText="Original"
        overlaySize="SMALL"
        width="DOUBLE"
      />
      <Icon size={20} type={Icon.TYPE.ARROW_RIGHT} />
      {colors.slice(1).map((color, index) => (
        <React.Fragment key={index}>
          <ColorBox color={color} label={color.getName().name} width="DOUBLE" />
          {index < colors.length - 2 && <Icon size={20} type={Icon.TYPE.PLUS} />}
        </React.Fragment>
      ))}
    </div>
  );
}

interface Props {
  color: Color;
}

export function ColorHarmonyDemo({ color }: Props) {
  return (
    <div className="w-full flex flex-col gap-4">
      <Card title="Complementary">
        <ColorHarmonyRow colors={color.getComplementaryColors()} />
      </Card>
      <Card title="Split complementary">
        <ColorHarmonyRow colors={color.getSplitComplementaryColors()} />
      </Card>
      <Card title="Triadic">
        <ColorHarmonyRow colors={color.getTriadicHarmonyColors()} />
      </Card>
      <Card title="Square">
        <ColorHarmonyRow colors={color.getSquareHarmonyColors()} />
      </Card>
      <Card title="Tetradic">
        <ColorHarmonyRow colors={color.getTetradicHarmonyColors()} />
      </Card>
      <Card title="Analogous">
        <ColorHarmonyRow colors={color.getAnalogousHarmonyColors()} />
      </Card>
      <Card title="Monochromatic">
        <ColorHarmonyRow colors={color.getMonochromaticHarmonyColors()} />
      </Card>
    </div>
  );
}
