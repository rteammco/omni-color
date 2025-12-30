import { useMemo } from 'react';

import { AppFooter } from '../AppFooter';
import { AppHeader } from '../AppHeader';
import { SectionContainer } from '../components/SectionContainer';
import { DemoSectionIDs } from '../components/utils';
import { VSpace } from '../components/VSpace';
import { ColorDemo } from '../demo/ColorDemo';
import { Playground } from '../playground/Playground';
import { PageHead } from '../seo/PageHead';
import { StructuredData } from '../seo/StructuredData';

export function DemoPage() {
  const pageStructuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': 'https://rteammco.github.io/omni-color/',
      name: 'omni-color color library demo',
      url: 'https://rteammco.github.io/omni-color/',
      inLanguage: 'en',
      isPartOf: {
        '@id': 'https://rteammco.github.io/omni-color/#website',
      },
      about: {
        '@id': 'https://rteammco.github.io/omni-color/#software',
      },
    }),
    []
  );

  return (
    <>
      <PageHead
        description="Explore omni-color color utilities, gradients, and palettes with live previews and interactive demos."
        path="/"
        title="omni-color demo | High-precision color utilities"
      />
      <StructuredData
        data={pageStructuredData}
      />
      <div className="w-full p-6 text-center">
        <div className="max-w-7xl justify-self-center">
          <AppHeader />
          <VSpace height={40} />
          <ColorDemo />
          <VSpace height={40} />
          <SectionContainer
            description="You can experiment with the Color object here"
            openSectionInNewTabLink="/omni-color/playground"
            sectionID={DemoSectionIDs.PLAYGROUND}
            title="Code playground"
          >
            <Playground />
          </SectionContainer>
          <VSpace height={40} />
          <AppFooter />
        </div>
      </div>
    </>
  );
}
