import { useCallback } from 'react';

export function ColorInput() {
  const handleColorInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  }, []);

  return (
    <div>
      <input
        className="px-4 py-1.5 w-2xs border-1 border-gray-200 rounded-md shadow-md"
        placeholder="Enter a color"
        type="text"
        onChange={handleColorInputChange}
      />
    </div>
  );
}
