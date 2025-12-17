import { useMemo } from 'react';
import type { DemoSectionIDs } from './utils';
import { Icon } from './Icon';

interface Props {
  children: React.ReactNode;
  description?: string;
  openSectionInNewTabLink?: string;
  sectionID: DemoSectionIDs;
  title: string;
}

export function SectionContainer({
  children,
  description,
  openSectionInNewTabLink,
  sectionID,
  title,
}: Props) {
  const titleContent = useMemo(() => {
    if (openSectionInNewTabLink) {
      return (
        <div className="flex flex-row items-center gap-2">
          {title}
          <a href={openSectionInNewTabLink} target="_blank">
            <Icon size={24} type={Icon.TYPE.ARROW_TOP_RIGHT_ON_SQUARE} />
          </a>
        </div>
      );
    }
    return title;
  }, [openSectionInNewTabLink, title]);

  return (
    <div
      className="p-8 border border-gray-200 rounded-2xl shadow-md flex flex-col gap-4"
      id={sectionID}
    >
      <h5 className="text-left font-bold">{titleContent}</h5>
      {description && <h6 className="gray-text-color text-left">{description}</h6>}
      {children}
    </div>
  );
}
