interface Props {
  backgroundColor?: string;
  borderColor?: string;
  children: React.ReactNode;
  title?: string;
}

export function Card({ backgroundColor, borderColor, children, title }: Props) {
  const cardJSX = (
    <div
      className={`p-4 border rounded-2xl ${borderColor ? '' : 'border-gray-200'} ${
        backgroundColor ? '' : 'gray-bg-color'
      }`}
      style={{ backgroundColor, borderColor }}
    >
      {children}
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
