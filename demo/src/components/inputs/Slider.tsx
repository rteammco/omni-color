interface Props {
  label?: string;
  max: number;
  min: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

export function Slider({ label, max, min, step, value, onChange }: Props) {
  return (
    <div className="flex flex-row flex-wrap align-center justify-center gap-2">
      {label && <div>{label}</div>}
      <input
        max={max}
        min={min}
        step={step}
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
