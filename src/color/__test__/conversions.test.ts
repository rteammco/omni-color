import { toHex } from '../conversions';

describe('conversions', () => {
  it('toHex converts RGB to hex', () => {
    expect(toHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff');
  });
});
