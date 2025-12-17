import { AppFooter } from '../AppFooter';
import { AppHeader } from '../AppHeader';
import { SectionContainer } from '../components/SectionContainer';
import { DemoSectionIDs } from '../components/utils';
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
        <SectionContainer
          description="You can experiment with the Color object here"
          openSectionInNewTabLink="./playground"
          sectionID={DemoSectionIDs.PLAYGROUND}
          title="Code playground"
        >
          <Playground />
        </SectionContainer>
        <VSpace height={40} />
        <AppFooter />
      </div>
    </div>
  );
}
