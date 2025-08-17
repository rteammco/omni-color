import type { Color } from '../../../dist';

interface Props {
  color: Color;
}

export function ColorInfo({ color }: Props) {
  return (
    <div
      className={`mt-4 p-4 w-full ${
        color.isDark() ? 'text-neutral-100' : 'text-neutral-900'
      } flex flex-col gap-2`}
      style={{ backgroundColor: color.toHex() }}
    >
      <div className="flex flex-row justify-center gap-2">
        <b>{color.getNameAsString()}</b>
        &middot;
        <span>{color.toHex()}</span>
        &middot;
        <span>{color.toHex8()}</span>
      </div>
      <div className="flex flex-row justify-center gap-2">
        <span>{color.toRGBString()}</span>
        &middot;
        <span>{color.toRGBAString()}</span>
        &middot;
        <span>{color.toHSLString()}</span>
        &middot;
        <span>{color.toHSLAString()}</span>
        &middot;
        <span>{color.toCMYKString()}</span>
        &middot;
        <span>{color.toLCHString()}</span>
        &middot;
        <span>{color.toOKLCHString()}</span>
      </div>
    </div>
  );
}
