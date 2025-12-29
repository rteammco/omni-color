import { AppHeader } from '../AppHeader';
import { VSpace } from '../components/VSpace';
import { Playground } from '../playground/Playground';
import { StructuredData } from '../seo/StructuredData';
import { useMemo } from 'react';

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
      <StructuredData
        data={pageStructuredData}
      />
      <div className="p-6 w-full text-center">
        <AppHeader pageDescription="Code Playground" />
        <VSpace height={40} />
        <Playground />
      </div>
    </>
  );
}
