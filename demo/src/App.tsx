import { AppFooter } from './AppFooter';
import { AppHeader } from './AppHeader';
import { VSpace } from './components/VSpace';
import { ColorDemo } from './demo/ColorDemo';
import { Playground } from './playground/Playground';

export default function App() {
  return (
    <div className="p-6 w-full text-center">
      <AppHeader />
      <VSpace height={40} />
      <ColorDemo />
      <VSpace height={40} />
      <Playground />
      <VSpace height={40} />
      <AppFooter />
    </div>
  );
}
