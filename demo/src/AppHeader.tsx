import { Chip } from './components/Chip';
import { DemoSectionIDs } from './components/utils';

interface Props {
  pageDescription?: string;
}

export function AppHeader({ pageDescription }: Props) {
  return (
    <div>
      <h1 className="mb-6 font-semibold leading-none">
        <span className="relative inline-flex h-[1em] w-[1ch] align-baseline items-center justify-center">
          <span aria-hidden className="absolute inset-0 flex items-center justify-center">
            <span className="h-full w-full bg-[url('/favicon.svg')] bg-contain bg-no-repeat bg-center" />
          </span>
          <span className="text-transparent">o</span>
        </span>
        mni-color
      </h1>
      {pageDescription ? (
        <h4>{pageDescription}</h4>
      ) : (
        <>
          <h4 className="mb-8">A fast, powerful, and lightweight color library for TypeScript</h4>
          <div className="flex flex-row gap-4 items-center justify-center flex-wrap">
            <Chip color="red" href={`#${DemoSectionIDs.PICK_COLOR}`} title="Parsing" />
            <Chip color="orange" href={`#${DemoSectionIDs.COLOR_INFO}`} title="Conversions" />
            <Chip color="yellow" href={`#${DemoSectionIDs.MANIPULATIONS}`} title="Manipulations" />
            <Chip color="green" href={`#${DemoSectionIDs.COMBINATIONS}`} title="Combinations" />
            <Chip color="cyan" href={`#${DemoSectionIDs.GRADIENTS}`} title="Gradients" />
            <Chip color="blue" href={`#${DemoSectionIDs.HARMONIES}`} title="Harmonies" />
            <Chip color="indigo" href={`#${DemoSectionIDs.PALETTE}`} title="Color palettes" />
            <Chip color="violet" href={`#${DemoSectionIDs.READABILITY}`} title="Accessibility" />
          </div>
        </>
      )}
    </div>
  );
}
