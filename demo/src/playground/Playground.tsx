import { useCallback, useEffect, useMemo, useState } from 'react';
import { CodeExecutionStatus, getRandomStarterCode, tryToRunCode } from './playgroundUtils';
import { Color } from '../../../dist';
import { ColorBox } from '../components/ColorBox';

export function Playground() {
  const [code, setCode] = useState(getRandomStarterCode());
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
    handleResetOrInitCode();
  }, [handleResetOrInitCode]);

  return (
    <div className="w-full flex flex-col items-center">
      <h5 className="mb-3">Code playground</h5>
      <span className="mb-2">
        You can experiment the <code>Color</code> object here. Return a <code>Color</code> or any
        valid color format (e.g. a hex string) to see the color visualized.
      </span>
      <textarea
        className={`px-4 py-1.5 w-2xl h-60 border-1 ${
          codeErrorMessage ? 'border-red-500' : 'border-gray-200'
        } rounded-md shadow-md font-mono text-sm`}
        value={code}
        onChange={handleCodeChanged}
      />
      <div className="flex flex-row items-center text-sm text-red-500 h-6">{codeErrorMessage}</div>
      <div className="flex flex-row items-center gap-3 mb-3">
        <span>Your result:</span>
        <ColorBox color={returnedColor ?? placeholderColor} extraWide />
      </div>
      {codeConsoleOutputs && codeConsoleOutputs.length > 0 && (
        <div className="flex flex-row items-center gap-3 mb-3">
          <span>Console outputs:</span>
          <div className="flex flex-col items-start gap-1">
            {codeConsoleOutputs.map((output, index) => (
              <pre className="text-sm" key={index}>
                {output}
              </pre>
            ))}
          </div>
        </div>
      )}
      <button onClick={handleResetOrInitCode}>Reset playground</button>
    </div>
  );
}
