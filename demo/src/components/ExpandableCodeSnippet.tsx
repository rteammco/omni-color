import { Icon } from './Icon';

interface Props {
  codeSnippet: string;
}

export function ExpandableCodeSnippet({ codeSnippet }: Props) {
  return (
    <details className="group border border-gray-300 dark:border-gray-500 rounded-lg p-2">
      <summary className="cursor-pointer flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        Show code
        <span className="transition-transform group-open:rotate-180">
          <Icon size={16} type={Icon.TYPE.CHEVRON_DOWN} />
        </span>
      </summary>
      <div className="mt-2 text-sm">
        <pre className="text-sm whitespace-pre-wrap break-words text-left w-full">
          {codeSnippet}
        </pre>
      </div>
    </details>
  );
}
