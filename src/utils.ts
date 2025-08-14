// General utils

export function clampValue(inputValue: number, min: number, max: number): number {
  return Math.min(Math.max(inputValue, min), max);
}
