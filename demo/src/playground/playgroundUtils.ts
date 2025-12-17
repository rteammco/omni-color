import { Color } from '../../../dist';

function getRandomElementFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const UPDATE_COLOR_METHOD_EXAMPLES: { method: string; argOptions?: unknown[] }[] = [
  { method: 'setAlpha', argOptions: [0.1, 0.3, 0.5, 0.7, 0.9] },
  { method: 'spin', argOptions: [-180, -90, -45, 45, 90, 180, 270] },
  { method: 'brighten', argOptions: [undefined, 20, 30, 40] },
  { method: 'darken', argOptions: [undefined, 20, 30, 40] },
  { method: 'saturate', argOptions: [undefined, 20, 30, 40] },
  { method: 'desaturate', argOptions: [undefined, 20, 30, 40] },
  { method: 'grayscale' },
  {
    method: 'mix',
    argOptions: [
      '[new Color("red")], { space: "RGB" }',
      '[new Color("green")], { space: "HSL" }',
      '[new Color("blue"), new Color("#fff")], { space: "LCH" }',
      '[new Color(), new Color()], { space: "OKLCH" }',
    ],
  },
  {
    method: 'blend',
    argOptions: [
      'new Color("red")',
      'new Color("green"), { mode: "MULTIPLY" }',
      'new Color("blue"), { mode: "OVERLAY" }',
    ],
  },
  {
    method: 'average',
    argOptions: [
      '[new Color()]',
      '[new Color("red"), new Color("green")]',
      '[new Color("sky blue")], { weights: [0.75, 0.25] }',
    ],
  },
] as const;

const GET_RESULT_COLOR_EXAMPLES: string[] = [
  'clone()',
  'getComplementaryColors()[0]',
  'getComplementaryColors()[1]',
  'getSplitComplementaryColors()[0]',
  'getSplitComplementaryColors()[1]',
  'getSplitComplementaryColors()[2]',
  'getSquareHarmonyColors()[0]',
  'getSquareHarmonyColors()[1]',
  'getSquareHarmonyColors()[2]',
  'getSquareHarmonyColors()[3]',
  'getTetradicHarmonyColors()[0]',
  'getTetradicHarmonyColors()[1]',
  'getTetradicHarmonyColors()[2]',
  'getTetradicHarmonyColors()[3]',
  'getAnalogousHarmonyColors()[0]',
  'getAnalogousHarmonyColors()[1]',
  'getAnalogousHarmonyColors()[2]',
  'getAnalogousHarmonyColors()[3]',
  'getAnalogousHarmonyColors()[4]',
  'getMonochromaticHarmonyColors()[0]',
  'getMonochromaticHarmonyColors()[1]',
  'getMonochromaticHarmonyColors()[2]',
  'getMonochromaticHarmonyColors()[3]',
  'getMonochromaticHarmonyColors()[4]',
  'getColorSwatch()[300]',
  'getColorSwatch()[400]',
  'getColorSwatch()[600]',
  'getColorSwatch()[700]',
  'getColorPalette()["secondaryColors"][0][500]',
  'getColorPalette()["info"][500]',
  'getColorPalette()["negative"][500]',
  'getColorPalette()["positive"][500]',
] as const;

export function getRandomStarterCode() {
  const randomColorHex = Color.random({ paletteSuitable: true }).toHex();

  const updateColorMethod = getRandomElementFromArray(UPDATE_COLOR_METHOD_EXAMPLES);
  const updateColorMethodArgs = updateColorMethod.argOptions
    ? getRandomElementFromArray(updateColorMethod.argOptions)
    : undefined;

  const resultColorMethod = getRandomElementFromArray(GET_RESULT_COLOR_EXAMPLES);

  return `// Return a \`Color\` or any valid color format (e.g. a hex string) to see the color visualized

const color = new Color("${randomColorHex}");
console.log("color:", color);

const updated = color.${updateColorMethod.method}(${updateColorMethodArgs ?? ''});
console.log("updated color:", updated);

const result = updated.${resultColorMethod};
return result; // rendered below if valid`;
}

function formatMockedJSConsoleValue(value: unknown): string {
  try {
    if (value === undefined) {
      return 'undefined';
    }
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'function') {
      return `[Function ${value.name || 'anonymous'}]`;
    }
    if (value && typeof value === 'object') {
      // Try to show Color nicely if it has toHexString:
      if ('toHex' in value && typeof value.toHex === 'function') {
        return `Color(${value.toHex()})`;
      }
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  } catch {
    return '[unserializable]';
  }
}

const ANON_FUNCTION_TRACE_LOCATION_PREFIX = '<anonymous>:' as const;
const ANON_FUNCTION_LINE_NUMBER_OFFSET = 4; // this is because when we define `codeRunnerFn`, the `${code}` part is on line 5

function tryToGetLineNumberFromError(error: object) {
  if (!('stack' in error) || typeof error.stack !== 'string') {
    return null;
  }
  const { stack } = error;

  const anonFunctionTraceIndex = stack.indexOf(ANON_FUNCTION_TRACE_LOCATION_PREFIX);
  if (anonFunctionTraceIndex < 0) {
    return null;
  }

  const lineNumberPartAndRest = stack.substring(
    anonFunctionTraceIndex + ANON_FUNCTION_TRACE_LOCATION_PREFIX.length
  );
  const restIndex = lineNumberPartAndRest.indexOf(':');
  if (restIndex < 0) {
    return null;
  }

  const lineNumberPart = lineNumberPartAndRest.substring(0, restIndex);
  if (!lineNumberPart) {
    return null;
  }

  const lineNumber = parseInt(lineNumberPart);
  if (isNaN(lineNumber)) {
    return null;
  }

  return lineNumber - ANON_FUNCTION_LINE_NUMBER_OFFSET;
}

function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error && typeof error === 'object') {
    const maybeLineNumber = tryToGetLineNumberFromError(error);
    if ('message' in error && typeof error.message === 'string') {
      return `Error${maybeLineNumber !== null ? ` (line ${maybeLineNumber})` : ''}: ${
        error.message
      }`;
    }
  }
  return fallbackMessage;
}

export enum CodeExecutionStatus {
  CODE_ERROR = 'CODE_ERROR',
  NO_RETURNED_VALUE = 'NO_RETURNED_VALUE',
  INVALID_RETURNED_VALUE = 'INVALID_RETURNED_VALUE',
  SUCCESS = 'SUCCESS',
}

interface RunCodeResults {
  color?: Color;
  consoleOutputs?: string[];
  errorMessage?: string;
  status: CodeExecutionStatus;
}

export async function tryToRunCode(code: string): Promise<RunCodeResults> {
  const capturedJSConsoleOutputs: string[] = [];
  const mockJSConsole = {
    log: (...args: unknown[]) =>
      capturedJSConsoleOutputs.push(args.map(formatMockedJSConsoleValue).join(' ')),
    warn: (...args: unknown[]) =>
      capturedJSConsoleOutputs.push('⚠️ ' + args.map(formatMockedJSConsoleValue).join(' ')),
    error: (...args: unknown[]) =>
      capturedJSConsoleOutputs.push('❌ ' + args.map(formatMockedJSConsoleValue).join(' ')),
  };

  let maybeColorValue;
  try {
    const codeRunnerFn = new Function(
      'Color',
      'console',
      `"use strict";
      return (async () => {
        ${code}
      })();`
    );
    maybeColorValue = await codeRunnerFn(Color, mockJSConsole);
  } catch (err) {
    return {
      consoleOutputs: capturedJSConsoleOutputs,
      errorMessage: getErrorMessage(err, 'Error: invalid code'),
      status: CodeExecutionStatus.CODE_ERROR,
    };
  }
  if (!maybeColorValue) {
    return {
      consoleOutputs: capturedJSConsoleOutputs,
      errorMessage: 'Error: no color returned',
      status: CodeExecutionStatus.NO_RETURNED_VALUE,
    };
  }

  let maybeColor: Color;
  try {
    maybeColor = new Color(maybeColorValue);
  } catch (err) {
    return {
      consoleOutputs: capturedJSConsoleOutputs,
      errorMessage: getErrorMessage(err, 'Error: invalid returned color value'),
      status: CodeExecutionStatus.INVALID_RETURNED_VALUE,
    };
  }

  return {
    color: maybeColor,
    consoleOutputs: capturedJSConsoleOutputs,
    status: CodeExecutionStatus.SUCCESS,
  };
}
