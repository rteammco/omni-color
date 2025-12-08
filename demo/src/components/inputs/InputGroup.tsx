interface Props {
  children?: React.ReactNode;
}

export function InputGroup({ children }: Props) {
  // mt-4 flex flex-row flex-wrap justify-center gap-x-8 gap-y-4
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-x-8 gap-y-4">
      {children}
    </div>
  );
}
