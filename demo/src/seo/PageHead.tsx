import { useEffect, useMemo } from 'react';

type PageHeadProps = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: string;
};

const siteOrigin = 'https://rteammco.github.io';
const basePath = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');

const withLeadingSlash = (value: string) => (value.startsWith('/') ? value : `/${value}`);

const getAbsoluteUrl = (path: string) => `${siteOrigin}${basePath}${withLeadingSlash(path)}`;

const resolveImageUrl = (image?: string) => {
  if (!image) {
    return getAbsoluteUrl('/social-card.png');
  }

  if (/^https?:\/\//.test(image)) {
    return image;
  }

  return getAbsoluteUrl(withLeadingSlash(image));
};

export function PageHead({ title, description, path, image, type = 'website' }: PageHeadProps) {
  const canonicalUrl = useMemo(() => getAbsoluteUrl(path), [path]);
  const imageUrl = useMemo(() => resolveImageUrl(image), [image]);

  useEffect(() => {
    const revertActions: Array<() => void> = [];

    const updateMeta = (attribute: 'name' | 'property', key: string, content: string) => {
      const selector = `meta[${attribute}="${key}"]`;
      let element = document.head.querySelector<HTMLMetaElement>(selector);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }

      const previousContent = element.getAttribute('content');
      element.setAttribute('content', content);

      revertActions.push(() => {
        if (previousContent === null) {
          element?.remove();
          return;
        }

        element?.setAttribute('content', previousContent);
      });
    };

    const updateCanonical = (href: string) => {
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }

      const previousHref = link.getAttribute('href');
      link.setAttribute('href', href);

      revertActions.push(() => {
        if (previousHref === null) {
          link?.remove();
          return;
        }

        link?.setAttribute('href', previousHref);
      });
    };

    const previousTitle = document.title;
    document.title = title;
    revertActions.push(() => {
      document.title = previousTitle;
    });

    updateCanonical(canonicalUrl);
    updateMeta('name', 'description', description);
    updateMeta('property', 'og:title', title);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:type', type);
    updateMeta('property', 'og:url', canonicalUrl);
    updateMeta('property', 'og:image', imageUrl);
    updateMeta('name', 'twitter:card', 'summary_large_image');
    updateMeta('name', 'twitter:title', title);
    updateMeta('name', 'twitter:description', description);
    updateMeta('name', 'twitter:image', imageUrl);

    return () => {
      revertActions.reverse().forEach((revert) => revert());
    };
  }, [canonicalUrl, description, imageUrl, title, type]);

  return null;
}
