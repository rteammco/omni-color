interface Props {
  children?: React.ReactNode;
  onResetClicked?: () => void;
}

export function InputGroup({ children, onResetClicked }: Props) {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-x-8 gap-y-4">
      {children}
      {onResetClicked && <button onClick={onResetClicked}>Reset</button>}
    </div>
  );
}
