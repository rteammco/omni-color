import type { Color } from '../../../dist';
import { useColorBackgroundAndBorderColors } from '../components/utils';

interface Props {
  color: Color;
}

export function ColorInfo({ color }: Props) {
  const { backgroundColor, borderColor } = useColorBackgroundAndBorderColors(color);

  return (
    <div
      className={`p-4 w-full ${
        color.isDark() ? 'text-neutral-100' : 'text-neutral-900'
      } flex flex-col gap-2 border-2`}
      style={{ backgroundColor, borderColor }}
    >
      <div className="flex flex-row justify-center gap-2 flex-wrap">
        <b>{color.getNameAsString()}</b>
        &middot;
        <span>{color.toHex()}</span>
        &middot;
        <span>{color.toHex8()}</span>
      </div>
      <div className="flex flex-row justify-center gap-2 flex-wrap">
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
