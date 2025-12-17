const CHIP_COLOR_MAPPING = {
  blue: 'bg-blue-500',
  cyan: 'bg-cyan-500',
  green: 'bg-green-500',
  indigo: 'bg-indigo-500',
  lime: 'bg-lime-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
  purple: 'bg-purple-500',
  red: 'bg-red-500',
  teal: 'bg-teal-500',
  violet: 'bg-violet-500',
  yellow: 'bg-yellow-500',
} as const;

interface Props {
  color?: keyof typeof CHIP_COLOR_MAPPING;
  href?: string;
  title: string;
}

export function Chip({ color, href, title }: Props) {
  const content = (
    <div className="flex flex-row gap-3 items-center">
      <div
        className={`${CHIP_COLOR_MAPPING[color ?? 'blue']} w-3 h-3 rounded-full flex-shrink-0`}
      />
      <span className="whitespace-nowrap">{title}</span>
    </div>
  );

  const baseContainerClass =
    'container-shadow-color px-4 py-2 border border-gray-200 rounded-xl shadow-md inline-block';

  if (href) {
    return (
      <a
        className={`${baseContainerClass} cursor-pointer hover:shadow-lg transition-shadow`}
        href={href}
      >
        {content}
      </a>
    );
  }

  return <div className={baseContainerClass}>{content}</div>;
}
