import { validateColorOrThrow } from '../validations';

describe('validateColorOrThrow', () => {
  it('throws on invalid hex', () => {
    expect(() => validateColorOrThrow('#gggggg')).toThrow();
  });
});
