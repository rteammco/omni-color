import { AppFooter } from '../AppFooter';
import { AppHeader } from '../AppHeader';
import { VSpace } from '../components/VSpace';
import { ColorDemo } from '../demo/ColorDemo';
import { Playground } from '../playground/Playground';

export function DemoPage() {
  return (
    <div className="w-full p-6 text-center">
      <div className="max-w-7xl justify-self-center">
        <AppHeader />
        <VSpace height={40} />
        <ColorDemo />
        <VSpace height={40} />
        <Playground />
        <VSpace height={40} />
        <AppFooter />
      </div>
    </div>
  );
}
