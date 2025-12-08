import { useMemo } from 'react';

interface Option<T extends string> {
  label?: string;
  value: T;
}

interface Props<T extends string> {
  label: string;
  options: readonly (T | Option<T>)[];
  value?: T;
  onChange: (value: T) => void;
}

export function Select<T extends string>({ label, options, value, onChange }: Props<T>) {
  const resolvedOptions = useMemo(
    () =>
      options.map((option) =>
        typeof option === 'string' ? { label: option, value: option } : option
      ),
    [options]
  );

  return (
    <label>
      {label}:
      <select
        className="ml-2 px-2 py-0.5 border-1 border-gray-200 rounded-md shadow-md"
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {resolvedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label ?? option.value}
          </option>
        ))}
      </select>
    </label>
  );
}
