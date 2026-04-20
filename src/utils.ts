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

// Type signature: If the given `defaultValue` is `null`, then the return type will be either
// the resolved value if present, or `null` if the key was not provided.
export function resolveCaseInsensitiveOption<
  T extends object,
  K extends keyof T,
  V extends Extract<T[K], string>,
>({
  allowedValues,
  defaultValue,
  key,
  options,
}: {
  allowedValues: readonly V[];
  defaultValue: null;
  key: K;
  options: T;
}): V | null;
// Type signature: If the given `defaultValue` is one of the options, then the return type will always be
// non-null - either the resolved value, or the given `defaultValue` if the key was not provided.
export function resolveCaseInsensitiveOption<
  T extends object,
  K extends keyof T,
  V extends Extract<T[K], string>,
>({
  allowedValues,
  defaultValue,
  key,
  options,
}: {
  allowedValues: readonly V[];
  defaultValue: V;
  key: K;
  options: T;
}): V;
// Function implementation:
export function resolveCaseInsensitiveOption<
  T extends object,
  K extends keyof T,
  V extends Extract<T[K], string>,
>({
  allowedValues,
  defaultValue,
  key,
  options,
}: {
  allowedValues: readonly V[];
  defaultValue: V | null;
  key: K;
  options: T;
}): V | null {
  const value = options[key];

  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (typeof value !== 'string') {
    throw new Error(
      `Invalid '${String(key)}': "${value}". Expected one of ${getAllowedOptionList(allowedValues)}`,
    );
  }

  const normalized = value.trim().toUpperCase();
  const matchedValue = allowedValues.find(
    (allowedValue) => allowedValue.trim().toUpperCase() === normalized,
  );
  if (matchedValue !== undefined) {
    return normalized as V;
  }

  throw new Error(
    `Invalid '${String(key)}': "${value}". Expected one of ${getAllowedOptionList(allowedValues)}`,
  );
}

export function resolveRequiredCaseInsensitiveOption<
  T extends object,
  K extends keyof T,
  V extends Extract<T[K], string>,
>({ allowedValues, key, options }: { allowedValues: readonly V[]; key: K; options: T }): V {
  const value = options[key];

  if (value === undefined || value === null) {
    throw new Error(
      `Missing required option '${String(key)}'. Expected one of ${getAllowedOptionList(allowedValues)}`,
    );
  }

  const resolvedValue = resolveCaseInsensitiveOption({
    allowedValues,
    defaultValue: null,
    key,
    options,
  });

  if (resolvedValue === null) {
    throw new Error(
      `Missing required option '${String(key)}'. Expected one of ${getAllowedOptionList(allowedValues)}`,
    );
  }
  return resolvedValue;
}
