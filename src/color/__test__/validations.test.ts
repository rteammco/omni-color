import { validateColorOrThrow } from '../validations';

describe('validateColorOrThrow nullish cases', () => {
  it('throws on undefined or null', () => {
    expect(() => validateColorOrThrow(undefined)).toThrow(
      'color is undefined'
    );
    expect(() => validateColorOrThrow(null)).toThrow('color is null');
  });
});

describe('validateColorOrThrow HEX format', () => {
  it('accepts valid 3 and 6 digit hex strings', () => {
    expect(() => validateColorOrThrow('#fff')).not.toThrow();
    expect(() => validateColorOrThrow('#00ff00')).not.toThrow();
    expect(() => validateColorOrThrow('#ABCDEF')).not.toThrow();
  });

  it('rejects invalid hex strings', () => {
    expect(() => validateColorOrThrow('#ggg' as any)).toThrow(
      /invalid hex color/
    );
    expect(() => validateColorOrThrow('#gggggg' as any)).toThrow(
      /invalid hex color/
    );
  });

  it('throws on hex strings with invalid length', () => {
    expect(() => validateColorOrThrow('#' as any)).toThrow(
      /unknown color format/
    );
    expect(() => validateColorOrThrow('#12345' as any)).toThrow(
      /unknown color format/
    );
    expect(() => validateColorOrThrow('#1234567' as any)).toThrow(
      /unknown color format/
    );
    expect(() => validateColorOrThrow('#123456789' as any)).toThrow(
      /unknown color format/
    );
  });
});

describe('validateColorOrThrow HEX8 format', () => {
  it('accepts valid 8 digit hex strings', () => {
    expect(() => validateColorOrThrow('#ffffffff')).not.toThrow();
    expect(() => validateColorOrThrow('#00000080')).not.toThrow();
  });

  it('rejects invalid hex8 strings', () => {
    expect(() => validateColorOrThrow('#gggggggg' as any)).toThrow(
      /invalid hex color/
    );
    expect(() => validateColorOrThrow('#1234567g' as any)).toThrow(
      /invalid hex color/
    );
    expect(() => validateColorOrThrow('#1234567' as any)).toThrow(
      /unknown color format/
    );
  });
});

describe('validateColorOrThrow RGB format', () => {
  it('accepts valid RGB objects including decimals', () => {
    expect(() => validateColorOrThrow({ r: 0, g: 255, b: 0 })).not.toThrow();
    expect(() => validateColorOrThrow({ r: 255, g: 0, b: 255 })).not.toThrow();
    expect(() => validateColorOrThrow({ r: 0.5, g: 100.1, b: 200.99 })).not.toThrow();
  });

  it('rejects out of range or non-number values', () => {
    expect(() => validateColorOrThrow({ r: -1, g: 0, b: 0 })).toThrow(
      /invalid RGB color/
    );
    expect(() => validateColorOrThrow({ r: 0, g: -1, b: 0 })).toThrow(
      /invalid RGB color/
    );
    expect(() => validateColorOrThrow({ r: 0, g: 0, b: -1 })).toThrow(
      /invalid RGB color/
    );
    expect(() => validateColorOrThrow({ r: 256, g: 0, b: 0 })).toThrow(
      /invalid RGB color/
    );
    expect(() => validateColorOrThrow({ r: 0, g: 256, b: 0 })).toThrow(
      /invalid RGB color/
    );
    expect(() => validateColorOrThrow({ r: 0, g: 0, b: 256 })).toThrow(
      /invalid RGB color/
    );
    expect(() => validateColorOrThrow({ r: NaN, g: 0, b: 0 } as any)).toThrow(
      /invalid RGB color/
    );
    expect(() => validateColorOrThrow({ r: 0, g: Infinity, b: 0 } as any)).toThrow(
      /invalid RGB color/
    );
    expect(() => validateColorOrThrow({ r: '255' as any, g: 0, b: 0 })).toThrow(
      /invalid RGB color/
    );
  });
});

describe('validateColorOrThrow RGBA format', () => {
  it('accepts valid RGBA objects including decimals', () => {
    expect(() => validateColorOrThrow({ r: 0, g: 0, b: 255, a: 0 })).not.toThrow();
    expect(() => validateColorOrThrow({ r: 255, g: 255, b: 0, a: 1 })).not.toThrow();
    expect(() => validateColorOrThrow({ r: 12.5, g: 34.8, b: 56.1, a: 0.5 })).not.toThrow();
  });

  it('rejects invalid RGBA objects', () => {
    expect(() => validateColorOrThrow({ r: 256, g: 0, b: 0, a: 0.5 })).toThrow(
      /invalid RGBA color/
    );
    expect(() => validateColorOrThrow({ r: 0, g: 0, b: 0, a: -0.1 })).toThrow(
      /invalid RGBA color/
    );
    expect(() => validateColorOrThrow({ r: 0, g: 0, b: 0, a: 1.1 })).toThrow(
      /invalid RGBA color/
    );
    expect(() => validateColorOrThrow({ r: 0, g: 0, b: 0, a: '0.5' as any })).toThrow(
      /invalid RGBA color/
    );
    expect(() => validateColorOrThrow({ r: NaN, g: 0, b: 0, a: 0.5 } as any)).toThrow(
      /invalid RGBA color/
    );
  });
});

describe('validateColorOrThrow HSL format', () => {
  it('accepts valid HSL objects including decimals', () => {
    expect(() => validateColorOrThrow({ h: 0, s: 0, l: 0 })).not.toThrow();
    expect(() => validateColorOrThrow({ h: 360, s: 100, l: 100 })).not.toThrow();
    expect(() => validateColorOrThrow({ h: 180.5, s: 50.5, l: 50.1 })).not.toThrow();
  });

  it('rejects invalid HSL objects', () => {
    expect(() => validateColorOrThrow({ h: -1, s: 0, l: 0 })).toThrow(
      /invalid HSL color/
    );
    expect(() => validateColorOrThrow({ h: 361, s: 0, l: 0 })).toThrow(
      /invalid HSL color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: -1, l: 0 })).toThrow(
      /invalid HSL color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: 101, l: 0 })).toThrow(
      /invalid HSL color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: 0, l: -1 })).toThrow(
      /invalid HSL color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: 0, l: 101 })).toThrow(
      /invalid HSL color/
    );
    expect(() => validateColorOrThrow({ h: '0' as any, s: 0, l: 0 })).toThrow(
      /invalid HSL color/
    );
  });
});

describe('validateColorOrThrow HSLA format', () => {
  it('accepts valid HSLA objects', () => {
    expect(() => validateColorOrThrow({ h: 120, s: 50, l: 50, a: 0.5 })).not.toThrow();
    expect(() => validateColorOrThrow({ h: 120.5, s: 50.5, l: 50.5, a: 1 })).not.toThrow();
  });

  it('rejects invalid HSLA objects', () => {
    expect(() => validateColorOrThrow({ h: -1, s: 0, l: 0, a: 0.5 })).toThrow(
      /invalid HSLA color/
    );
    expect(() => validateColorOrThrow({ h: 361, s: 0, l: 0, a: 0.5 })).toThrow(
      /invalid HSLA color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: -1, l: 0, a: 0.5 })).toThrow(
      /invalid HSLA color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: 101, l: 0, a: 0.5 })).toThrow(
      /invalid HSLA color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: 0, l: -1, a: 0.5 })).toThrow(
      /invalid HSLA color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: 0, l: 101, a: 0.5 })).toThrow(
      /invalid HSLA color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: 0, l: 0, a: -0.1 })).toThrow(
      /invalid HSLA color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: 0, l: 0, a: 1.1 })).toThrow(
      /invalid HSLA color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: 0, l: 0, a: '0.5' as any })).toThrow(
      /invalid HSLA color/
    );
  });
});

describe('validateColorOrThrow HSV format', () => {
  it('accepts valid HSV objects including decimals', () => {
    expect(() => validateColorOrThrow({ h: 0, s: 0, v: 0 })).not.toThrow();
    expect(() => validateColorOrThrow({ h: 360, s: 100, v: 100 })).not.toThrow();
    expect(() => validateColorOrThrow({ h: 180.5, s: 50.5, v: 50.1 })).not.toThrow();
  });

  it('rejects invalid HSV objects', () => {
    expect(() => validateColorOrThrow({ h: -1, s: 0, v: 0 })).toThrow(
      /invalid HSV color/
    );
    expect(() => validateColorOrThrow({ h: 361, s: 0, v: 0 })).toThrow(
      /invalid HSV color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: -1, v: 0 })).toThrow(
      /invalid HSV color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: 101, v: 0 })).toThrow(
      /invalid HSV color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: 0, v: -1 })).toThrow(
      /invalid HSV color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: 0, v: 101 })).toThrow(
      /invalid HSV color/
    );
    expect(() => validateColorOrThrow({ h: '0' as any, s: 0, v: 0 })).toThrow(
      /invalid HSV color/
    );
  });
});

describe('validateColorOrThrow HSVA format', () => {
  it('accepts valid HSVA objects', () => {
    expect(() => validateColorOrThrow({ h: 200, s: 50, v: 50, a: 0.25 })).not.toThrow();
    expect(() => validateColorOrThrow({ h: 200.5, s: 50.5, v: 50.5, a: 0.75 })).not.toThrow();
  });

  it('rejects invalid HSVA objects', () => {
    expect(() => validateColorOrThrow({ h: -1, s: 0, v: 0, a: 0.5 })).toThrow(
      /invalid HSVA color/
    );
    expect(() => validateColorOrThrow({ h: 361, s: 0, v: 0, a: 0.5 })).toThrow(
      /invalid HSVA color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: -1, v: 0, a: 0.5 })).toThrow(
      /invalid HSVA color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: 101, v: 0, a: 0.5 })).toThrow(
      /invalid HSVA color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: 0, v: -1, a: 0.5 })).toThrow(
      /invalid HSVA color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: 0, v: 101, a: 0.5 })).toThrow(
      /invalid HSVA color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: 0, v: 0, a: -0.1 })).toThrow(
      /invalid HSVA color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: 0, v: 0, a: 1.1 })).toThrow(
      /invalid HSVA color/
    );
    expect(() => validateColorOrThrow({ h: 0, s: 0, v: 0, a: '0.5' as any })).toThrow(
      /invalid HSVA color/
    );
  });
});

describe('validateColorOrThrow CMYK format', () => {
  it('accepts valid CMYK objects including decimals', () => {
    expect(() => validateColorOrThrow({ c: 0, m: 0, y: 0, k: 0 })).not.toThrow();
    expect(() => validateColorOrThrow({ c: 100, m: 100, y: 100, k: 100 })).not.toThrow();
    expect(() => validateColorOrThrow({ c: 0.5, m: 99.9, y: 50.5, k: 10.1 })).not.toThrow();
  });

  it('rejects invalid CMYK objects', () => {
    expect(() => validateColorOrThrow({ c: -1, m: 0, y: 0, k: 0 })).toThrow(
      /invalid CMYK color/
    );
    expect(() => validateColorOrThrow({ c: 0, m: 101, y: 0, k: 0 })).toThrow(
      /invalid CMYK color/
    );
    expect(() => validateColorOrThrow({ c: 0, m: 0, y: -1, k: 0 })).toThrow(
      /invalid CMYK color/
    );
    expect(() => validateColorOrThrow({ c: 0, m: 0, y: 0, k: 101 })).toThrow(
      /invalid CMYK color/
    );
    expect(() => validateColorOrThrow({ c: '0' as any, m: 0, y: 0, k: 0 })).toThrow(
      /invalid CMYK color/
    );
  });
});

describe('validateColorOrThrow LCH format', () => {
  it('accepts valid LCH objects', () => {
    expect(() => validateColorOrThrow({ l: 0, c: 0, h: 0 })).not.toThrow();
    expect(() => validateColorOrThrow({ l: 100, c: 50, h: 360 })).not.toThrow();
    expect(() => validateColorOrThrow({ l: 50.5, c: 20.5, h: 180.5 })).not.toThrow();
  });

  it('rejects invalid LCH objects', () => {
    expect(() => validateColorOrThrow({ l: 101, c: 0, h: 0 })).toThrow(
      /invalid LCH color/
    );
    expect(() => validateColorOrThrow({ l: 50, c: -1, h: 0 })).toThrow(
      /invalid LCH color/
    );
    expect(() => validateColorOrThrow({ l: 50, c: 0, h: -1 })).toThrow(
      /invalid LCH color/
    );
    expect(() => validateColorOrThrow({ l: 50, c: 0, h: 361 })).toThrow(
      /invalid LCH color/
    );
    expect(() => validateColorOrThrow({ l: '50' as any, c: 0, h: 0 })).toThrow(
      /invalid LCH color/
    );
  });
});

describe('validateColorOrThrow OKLCH format', () => {
  it('accepts valid OKLCH objects', () => {
    expect(() => validateColorOrThrow({ l: 0, c: 0, h: 0 })).not.toThrow();
    expect(() => validateColorOrThrow({ l: 1, c: 0.5, h: 360 })).not.toThrow();
    expect(() => validateColorOrThrow({ l: 0.5, c: 0.25, h: 180.5 })).not.toThrow();
  });

  it('rejects invalid OKLCH objects', () => {
    expect(() => validateColorOrThrow({ l: -0.1, c: 0, h: 0 })).toThrow(
      /invalid OKLCH color/
    );
    expect(() => validateColorOrThrow({ l: 0, c: -0.1, h: 0 })).toThrow(
      /invalid OKLCH color/
    );
    expect(() => validateColorOrThrow({ l: 0, c: '0' as any, h: 0 })).toThrow(
      /invalid OKLCH color/
    );
    expect(() => validateColorOrThrow({ l: 0, c: 0, h: -1 })).toThrow(
      /invalid OKLCH color/
    );
    expect(() => validateColorOrThrow({ l: 0, c: 0, h: 361 })).toThrow(
      /invalid OKLCH color/
    );
  });
});

describe('validateColorOrThrow unknown format', () => {
  it('throws on unknown input', () => {
    expect(() => validateColorOrThrow({} as any)).toThrow(
      /unknown color format/
    );
    expect(() => validateColorOrThrow({ foo: 'bar' } as any)).toThrow(
      /unknown color format/
    );
    expect(() => validateColorOrThrow({ r: 0 } as any)).toThrow(
      /unknown color format/
    );
    expect(() => validateColorOrThrow([] as any)).toThrow(
      /unknown color format/
    );
    expect(() => validateColorOrThrow('not-a-color' as any)).toThrow(
      /unknown color format/
    );
  });
});
