import { useCallback, useEffect, useMemo, useState } from 'react';
import { CodeExecutionStatus, getRandomStarterCode, tryToRunCode } from './playgroundUtils';
import { Color } from '../../../dist';
import { ColorBox } from '../components/ColorBox';
import { Card } from '../components/Card';

export function Playground() {
  const initialCode = useMemo(() => getRandomStarterCode(), []);

  const [code, setCode] = useState(initialCode);
  const [returnedColor, setReturnedColor] = useState<Color | null>(null);
  const [codeErrorMessage, setCodeErrorMessage] = useState<string | null>(null);
  const [codeConsoleOutputs, setCodeConsoleOutputs] = useState<string[] | null>(null);

  const placeholderColor = useMemo(() => new Color('white'), []);

  const executeCode = useCallback((newCode: string) => {
    tryToRunCode(newCode).then((res) => {
      if (res.status === CodeExecutionStatus.SUCCESS) {
        setCodeErrorMessage(null);
        setReturnedColor(res.color ?? null);
      } else {
        setCodeErrorMessage(res.errorMessage ?? `Something went wrong: ${res.status}`);
      }
      if (res.status !== CodeExecutionStatus.CODE_ERROR) {
        setCodeConsoleOutputs(res.consoleOutputs ?? null);
      }
    });
  }, []);

  const handleCodeChanged = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newCode = event.target.value;
      setCode(newCode);
      executeCode(newCode);
    },
    [executeCode]
  );

  const handleResetOrInitCode = useCallback(() => {
    const newCode = getRandomStarterCode();
    setCode(newCode);
    executeCode(newCode);
  }, [executeCode]);

  useEffect(() => {
    executeCode(initialCode);
  }, [executeCode, initialCode]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex flex-col gap-4">
        <div>
          <textarea
            className={`px-4 py-2 w-full h-60 border-1 ${
              codeErrorMessage ? 'border-red-500' : 'border-gray-200'
            } rounded-md shadow-md font-mono text-sm`}
            spellCheck={false}
            value={code}
            onChange={handleCodeChanged}
          />
          {codeErrorMessage && (
            <div className="flex flex-row items-center text-sm text-red-500 h-6">
              {codeErrorMessage}
            </div>
          )}
        </div>
        <Card title="Output">
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <ColorBox
                color={returnedColor ?? placeholderColor}
                label={returnedColor?.toHex()}
                overlaySize="SMALL"
                overlayText="Returned color"
                width="STRETCH"
              />
            </div>
            {codeConsoleOutputs && codeConsoleOutputs.length > 0 && (
              <div className="flex flex-col items-center gap-3 mb-3 w-full">
                <div className="flex flex-col items-start gap-0.5 w-full">
                  {codeConsoleOutputs.map((output, index) => (
                    <pre
                      className="text-sm whitespace-pre-wrap break-words text-left w-full"
                      key={index}
                    >
                      &gt; {output}
                    </pre>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
      <button className="mt-4" onClick={handleResetOrInitCode}>
        Reset playground
      </button>
    </div>
  );
}
