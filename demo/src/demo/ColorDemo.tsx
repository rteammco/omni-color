import { useCallback, useState } from 'react';
import { Color } from '../../../dist';
import { ColorInput } from './ColorInput';
import { ColorInfo } from './ColorInfo';
import { ColorManipulationDemo } from './ColorManipulationDemo';
import { ColorHarmonyDemo } from './ColorHarmonyDemo';
import { ColorPaletteDemo } from './palette/ColorPaletteDemo';
import { ColorCombinationDemo } from './combinations/ColorCombinationDemo';
import { ReadabilityDemo } from './ReadabilityDemo';
import { SectionContainer } from '../components/SectionContainer';
import { DemoSectionIDs } from '../components/utils';
import { GradientsDemo } from './gradients/GradientsDemo';

const COLOR_SEARCH_PARAM_KEY = 'color' as const;

function setColorSearchParam(color: Color) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  urlSearchParams.set(COLOR_SEARCH_PARAM_KEY, color.toHex());
  window.history.replaceState({}, '', `${window.location.pathname}?${urlSearchParams.toString()}`);
}

function initializeRandomColor(): Color {
  const initialColor = new Color();
  setColorSearchParam(initialColor);
  return initialColor;
}

function getColorFromSearchParams(): Color {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const colorParam = urlSearchParams.get(COLOR_SEARCH_PARAM_KEY);
  if (!colorParam) {
    return initializeRandomColor();
  }

  try {
    return new Color(colorParam);
  } catch {
    return initializeRandomColor();
  }
}

export function ColorDemo() {
  const [color, setColor] = useState<Color>(getColorFromSearchParams());

  const handleColorChanged = useCallback((newColor: Color) => {
    setColor(newColor);
    setColorSearchParam(newColor);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <SectionContainer
        description="Enter any format, pick a preset, or let omni-color surprise you with a palette-friendly option"
        sectionID={DemoSectionIDs.PICK_COLOR}
        title="Pick a starting color"
      >
        <ColorInput color={color} onColorChanged={handleColorChanged} />
      </SectionContainer>
      <SectionContainer
        description="Quick conversions, swatches, and temperature"
        sectionID={DemoSectionIDs.COLOR_INFO}
        title="Color info"
      >
        <ColorInfo color={color} />
      </SectionContainer>
      <SectionContainer
        description="Brighten, darken, saturate, desaturate, or go grayscale"
        sectionID={DemoSectionIDs.MANIPULATIONS}
        title="Manipulations"
      >
        <ColorManipulationDemo color={color} />
      </SectionContainer>
      <SectionContainer
        description="Mix, blend, and average colors with a large variety of customization options"
        sectionID={DemoSectionIDs.COMBINATIONS}
        title="Combinations"
      >
        <ColorCombinationDemo color={color} />
      </SectionContainer>
      <SectionContainer
        description="Instantly generate gradients through one or more colors"
        sectionID={DemoSectionIDs.GRADIENTS}
        title="Gradients"
      >
        <GradientsDemo color={color} />
      </SectionContainer>
      <SectionContainer
        description="Instantly generate complete color harmonies"
        sectionID={DemoSectionIDs.HARMONIES}
        title="Harmonies"
      >
        <ColorHarmonyDemo color={color} />
      </SectionContainer>
      <SectionContainer
        description="Generate an entire production-ready color palette from a single base color"
        sectionID={DemoSectionIDs.PALETTE}
        title="Palette"
      >
        <ColorPaletteDemo color={color} />
      </SectionContainer>
      <SectionContainer
        description="Check contrast ratios and readability scores against any background color"
        sectionID={DemoSectionIDs.READABILITY}
        title="Readability"
      >
        <ReadabilityDemo color={color} />
      </SectionContainer>
    </div>
  );
}
