import type { Color } from '../../../dist';

interface Props {
  color: Color;
}

export function ColorInfo({ color }: Props) {
  return (
    <div
      className={`mt-4 p-2 w-full ${
        color.isDark() ? 'text-neutral-100' : 'text-neutral-900'
      } flex flex-row justify-center gap-2`}
      style={{ backgroundColor: color.toHex() }}
    >
      <b>{color.getNameAsString()}</b>
      &middot;
      <span>{color.toHex()}</span>
      &middot;
      <span>{color.toHex8()}</span>
      {/* TODO: readable RGB, HSL, etc. with "css" ready strings */}
    </div>
  );
}
