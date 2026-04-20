// General utils

export type CaseInsensitive<T extends string> =
  | T
  | Lowercase<T>
  | Uppercase<T>
  | Capitalize<Lowercase<T>>;

export function clampValue(inputValue: number, min: number, max: number): number {
  return Math.min(Math.max(inputValue, min), max);
}

export function capitalizeString(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

function getAllowedOptionList<T extends string>(allowedValues: readonly T[]): string {
  return allowedValues.join(', ');
}

export function resolveCaseInsensitiveOption<T extends string>({
  value,
  allowedValues,
  defaultValue,
  optionName,
}: {
  value: unknown;
  allowedValues: readonly T[];
  defaultValue: T;
  optionName: string;
}): T {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Invalid ${optionName}: expected one of ${getAllowedOptionList(allowedValues)}, got ${String(value)}`,
    );
  }

  const normalized = value.trim().toUpperCase();
  if ((allowedValues as readonly string[]).includes(normalized)) {
    return normalized as T;
  }

  throw new Error(
    `Invalid ${optionName}: "${value}". Expected one of ${getAllowedOptionList(allowedValues)}`,
  );
}

export function resolveRequiredCaseInsensitiveOption<T extends string>({
  value,
  allowedValues,
  optionName,
}: {
  value: unknown;
  allowedValues: readonly T[];
  optionName: string;
}): T {
  if (value === undefined || value === null) {
    throw new Error(
      `Missing required ${optionName}. Expected one of ${getAllowedOptionList(allowedValues)}`,
    );
  }

  return resolveCaseInsensitiveOption({
    value,
    allowedValues,
    defaultValue: allowedValues[0],
    optionName,
  });
}
