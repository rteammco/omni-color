interface Props {
  height: number;
}

export function VSpace({ height }: Props) {
  return <div className="w-full" style={{ height }} />;
}
