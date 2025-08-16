import { Color } from 'omni-color'; // your library

export default function App() {
  const c = new Color('green');
  return <div>Example: {c.toHex()}</div>;
}
