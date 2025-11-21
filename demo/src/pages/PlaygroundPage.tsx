import { AppHeader } from '../AppHeader';
import { VSpace } from '../components/VSpace';
import { Playground } from '../playground/Playground';

export function PlaygroundPage() {
  return (
    <div className="p-6 w-full text-center">
      <AppHeader pageDescription="Code Playground" />
      <VSpace height={40} />
      <Playground isFullPage />
    </div>
  );
}
