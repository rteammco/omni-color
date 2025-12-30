import { useMemo } from 'react';

import { AppHeader } from '../AppHeader';
import { VSpace } from '../components/VSpace';
import { Playground } from '../playground/Playground';
import { PageHead } from '../seo/PageHead';
import { StructuredData } from '../seo/StructuredData';

export function PlaygroundPage() {
  const pageStructuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': 'https://rteammco.github.io/omni-color/playground',
      name: 'omni-color playground',
      url: 'https://rteammco.github.io/omni-color/playground',
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
        description="Run omni-color JavaScript snippets in the browser to explore conversions, palettes, and color math interactively."
        path="/playground"
        title="omni-color | Code Playground"
      />
      <StructuredData data={pageStructuredData} />
      <div className="p-6 w-full text-center">
        <AppHeader pageDescription="Code Playground" />
        <VSpace height={40} />
        <Playground />
      </div>
    </>
  );
}
