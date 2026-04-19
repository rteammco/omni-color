import { ExpandableCodeSnippet } from './ExpandableCodeSnippet';

interface Props {
  backgroundColor?: string;
  borderColor?: string;
  children: React.ReactNode;
  codeSnippet?: string;
  title?: string;
}

export function Card({ backgroundColor, borderColor, children, codeSnippet, title }: Props) {
  const cardJSX = (
    <div
      className={`p-4 border rounded-2xl ${borderColor ? '' : 'border-gray-200'} ${
        backgroundColor ? '' : 'gray-bg-color'
      }`}
      style={{ backgroundColor, borderColor }}
    >
      {children}
      {codeSnippet && (
        <div className="mt-4">
          <ExpandableCodeSnippet codeSnippet={codeSnippet} />
        </div>
      )}
    </div>
  );

  if (title) {
    return (
      <div className="flex flex-col gap-1">
        <div className="text-left font-semibold">{title}</div>
        {cardJSX}
      </div>
    );
  }

  return cardJSX;
}
