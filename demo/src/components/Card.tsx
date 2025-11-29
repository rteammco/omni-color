interface Props {
  backgroundColor?: string;
  children: React.ReactNode;
}

export function Card({ backgroundColor, children }: Props) {
  return (
    <div
      className={`p-4 border border-gray-200 rounded-2xl ${backgroundColor ? '' : '{bg-gray-100'}`}
      style={{ backgroundColor }}
    >
      {children}
    </div>
  );
}
