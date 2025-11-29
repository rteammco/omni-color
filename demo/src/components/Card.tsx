interface Props {
  backgroundColor?: string;
  borderColor?: string;
  children: React.ReactNode;
}

export function Card({ backgroundColor, borderColor, children }: Props) {
  return (
    <div
      className={`p-4 border rounded-2xl ${borderColor ? '' : 'border-gray-200'} ${
        backgroundColor ? '' : 'bg-gray-100'
      }`}
      style={{ backgroundColor, borderColor }}
    >
      {children}
    </div>
  );
}
