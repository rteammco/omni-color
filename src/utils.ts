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
