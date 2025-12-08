interface Props {
  isChecked?: boolean;
  label: string;
  onChange: (isChecked: boolean) => void;
}

export function Checkbox({ label, isChecked, onChange }: Props) {
  return (
    <label>
      {label}:
      <input
        className="ml-2 px-2 shadow-md"
        checked={isChecked}
        type="checkbox"
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}
