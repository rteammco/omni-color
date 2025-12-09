interface Props {
  label?: string | React.ReactNode;
  max?: number;
  min?: number;
  step?: number;
  value?: number;
  onChange: (value: number) => void;
}

export function NumberInput({ label, max, min, step, value, onChange }: Props) {
  const inputJSX = (
    <input
      className={`${label ? 'ml-2' : ''} px-2 py-0.5 border-1 border-gray-200 rounded-md shadow-md`}
      max={max}
      min={min}
      step={step}
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );

  if (label) {
    return (
      <label>
        {label}: {inputJSX}
      </label>
    );
  }

  return inputJSX;
}
