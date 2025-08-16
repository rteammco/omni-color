import { Color } from 'omni-color';

export default function App() {
  const c = new Color('green');
  return <div>Hello, world. Example: {c.toHex()}</div>;
}
