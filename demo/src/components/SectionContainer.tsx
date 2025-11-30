import type { DemoSectionIDs } from './utils';

interface Props {
  children: React.ReactNode;
  description?: string;
  sectionID: DemoSectionIDs;
  title: string;
}

export function SectionContainer({ children, description, sectionID, title }: Props) {
  return (
    <div
      className="p-8 border border-gray-200 rounded-2xl shadow-md flex flex-col gap-4"
      id={sectionID}
    >
      <h5 className="text-left font-bold">{title}</h5>
      {description && <h6 className="gray-text-color text-left">{description}</h6>}
      {children}
    </div>
  );
}
