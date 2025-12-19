import React, { useState } from 'react';
import type { Color, GrayscaleHandlingMode } from '../../../dist';
import { ColorBox } from '../components/ColorBox';
import { Icon } from '../components/Icon';
import { Card } from '../components/Card';
import { Select } from '../components/inputs/Select';
import { InputGroup } from '../components/inputs/InputGroup';

function ColorHarmonyRow({ colors }: { colors: Color[] }) {
  return (
    <div className="flex flex-row flex-wrap gap-2 items-center">
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
  const [grayscaleHandlingMode, setGrayscaleHandlingMode] =
    useState<GrayscaleHandlingMode>('SPIN_LIGHTNESS');

  const isColorGrayscale = color.toHSL().s === 0;

  return (
    <div className="w-full flex flex-col gap-4">
      {isColorGrayscale && (
        <InputGroup onResetClicked={() => setGrayscaleHandlingMode('SPIN_LIGHTNESS')}>
          <Select
            label="Grayscale handling mode"
            options={[
              { label: 'Spin Lightness', value: 'SPIN_LIGHTNESS' },
              { label: 'Ignore', value: 'IGNORE' },
            ]}
            value={grayscaleHandlingMode}
            onChange={setGrayscaleHandlingMode}
          />
        </InputGroup>
      )}
      <Card title="Complementary">
        <ColorHarmonyRow colors={color.getComplementaryColors({ grayscaleHandlingMode })} />
      </Card>
      <Card title="Split complementary">
        <ColorHarmonyRow colors={color.getSplitComplementaryColors({ grayscaleHandlingMode })} />
      </Card>
      <Card title="Triadic">
        <ColorHarmonyRow colors={color.getTriadicHarmonyColors({ grayscaleHandlingMode })} />
      </Card>
      <Card title="Square">
        <ColorHarmonyRow colors={color.getSquareHarmonyColors({ grayscaleHandlingMode })} />
      </Card>
      <Card title="Tetradic">
        <ColorHarmonyRow colors={color.getTetradicHarmonyColors({ grayscaleHandlingMode })} />
      </Card>
      <Card title="Analogous">
        <ColorHarmonyRow colors={color.getAnalogousHarmonyColors({ grayscaleHandlingMode })} />
      </Card>
      <Card title="Monochromatic">
        <ColorHarmonyRow colors={color.getMonochromaticHarmonyColors()} />
      </Card>
    </div>
  );
}
