import { useCallback, useMemo } from 'react';
import { Icon } from './Icon';

interface Props {
  codeSnippet: string;
}

export function ExpandableCodeSnippet({ codeSnippet }: Props) {
  const trimmedCodeSnippet = useMemo(() => codeSnippet.trim(), [codeSnippet]);

  const handleCopyCodeToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(trimmedCodeSnippet);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [trimmedCodeSnippet]);

  return (
    <details className="group border border-gray-300 dark:border-gray-500 rounded-lg p-2">
      <summary className="cursor-pointer flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        Show code
        <span className="transition-transform group-open:rotate-180">
          <Icon size={16} type={Icon.TYPE.CHEVRON_DOWN} />
        </span>
      </summary>
      <div className="relative mt-2 p-2 text-sm">
        <pre className="text-sm whitespace-pre-wrap break-words text-left w-full">
          {trimmedCodeSnippet}
        </pre>
        <div className="absolute bottom-2 right-2">
          <button onClick={handleCopyCodeToClipboard}>
            <Icon size={20} type={Icon.TYPE.COPY} />
          </button>
        </div>
      </div>
    </details>
  );
}
