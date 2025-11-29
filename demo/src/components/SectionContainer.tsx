interface Props {
  children: React.ReactNode;
  description?: string;
  title: string;
}

export function SectionContainer({ children, description, title }: Props) {
  return (
    <div className="p-8 border border-gray-200 rounded-2xl shadow-md flex flex-col gap-4">
      <h5 className="text-left font-bold">{title}</h5>
      {description && <h6 className="text-left text-gray-500">{description}</h6>}
      {children}
    </div>
  );
}
