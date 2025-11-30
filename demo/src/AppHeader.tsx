import { Chip } from './components/Chip';
import { DemoSectionIDs } from './components/utils';

interface Props {
  pageDescription?: string;
}

export function AppHeader({ pageDescription }: Props) {
  return (
    <div>
      <h1 className="mb-6 font-semibold">omni-color</h1>
      {pageDescription ? (
        <h4>{pageDescription}</h4>
      ) : (
        <>
          <h4 className="mb-8">A fast, powerful, and lightweight color library for TypeScript</h4>
          <div className="flex flex-row gap-4 items-center justify-center">
            <Chip color="red" href={`#${DemoSectionIDs.PICK_COLOR}`} title="Parsing" />
            <Chip color="orange" href={`#${DemoSectionIDs.COLOR_INFO}`} title="Conversions" />
            <Chip color="yellow" href={`#${DemoSectionIDs.MANIPULATIONS}`} title="Manipulations" />
            <Chip color="green" href={`#${DemoSectionIDs.COMBINATIONS}`} title="Combinations" />
            <Chip color="blue" href={`#${DemoSectionIDs.HARMONIES}`} title="Harmonies" />
            <Chip color="indigo" href={`#${DemoSectionIDs.PALETTE}`} title="Color palettes" />
            <Chip color="purple" href={`#${DemoSectionIDs.READABILITY}`} title="Accessibility" />
          </div>
        </>
      )}
    </div>
  );
}
