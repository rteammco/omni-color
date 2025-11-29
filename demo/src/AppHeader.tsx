import { Chip } from './components/Chip';

interface Props {
  pageDescription?: string;
}

export function AppHeader({ pageDescription }: Props) {
  return (
    // <div className="text-left">
    <div>
      <h1 className="mb-6 font-semibold">omni-color</h1>
      {pageDescription ? (
        <h4>{pageDescription}</h4>
      ) : (
        <>
          <h4 className="mb-8">A fast, powerful, and lightweight color library for TypeScript</h4>
          <div className="flex flex-row gap-4 items-center justify-center">
            <Chip color="red" title="Parsing" />
            <Chip color="orange" title="Conversions" />
            <Chip color="yellow" title="Manipulations" />
            <Chip color="green" title="Combinations" />
            <Chip color="blue" title="Harmonies" />
            <Chip color="indigo" title="Color palettes" />
            <Chip color="purple" title="Accessibility" />
          </div>
        </>
      )}
    </div>
  );
}
