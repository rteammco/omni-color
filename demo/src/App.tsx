import { AppHeader } from './AppHeader';
import { Playground } from './playground/Playground';

export default function App() {
  return (
    <div className="p-6 w-full text-center">
      <AppHeader />
      <Playground />
    </div>
  );
}
