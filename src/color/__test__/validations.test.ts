import { validateColorOrThrow } from '../validations';

describe('validateColorOrThrow base cases', () => {
  it('throws on undefined or null', () => {
    expect(() => validateColorOrThrow(undefined)).toThrow(
      '[validateColorOrThrow] color is undefined',
    );
    expect(() => validateColorOrThrow(null)).toThrow(
      '[validateColorOrThrow] color is null',
    );
  });
});

describe('validateColorOrThrow HEX format', () => {
  it('accepts valid 3 and 6 digit hex strings', () => {
    expect(() => validateColorOrThrow('#fff')).not.toThrow();
    expect(() => validateColorOrThrow('#00ff00')).not.toThrow();
    expect(() => validateColorOrThrow('#ABCDEF')).not.toThrow();
  });

  it('rejects invalid hex strings', () => {
    ['#ggg', '#gggggg'].forEach((hex) => {
      expect(() => validateColorOrThrow(hex as any)).toThrow(
        /\[validateColorOrThrow\] invalid hex color/,
      );
    });
  });

  it('throws on hex strings with invalid length', () => {
    ['#', '#12345', '#1234567', '#123456789'].forEach((hex) => {
      expect(() => validateColorOrThrow(hex as any)).toThrow(
        /\[getColorFormatType\] unknown color format/,
      );
    });
  });
});

describe('validateColorOrThrow HEX8 format', () => {
  it('accepts valid 8 digit hex strings', () => {
    expect(() => validateColorOrThrow('#ffffffff')).not.toThrow();
    expect(() => validateColorOrThrow('#00000080')).not.toThrow();
  });

  it('rejects invalid hex8 strings', () => {
    ['#gggggggg', '#1234567g', '#1234567'].forEach((hex) => {
      expect(() => validateColorOrThrow(hex as any)).toThrow(
        /\[validateColorOrThrow\] invalid hex color|\[getColorFormatType\] unknown color format/,
      );
    });
  });
});

describe('validateColorOrThrow RGB format', () => {
  it('accepts valid RGB objects', () => {
    expect(() => validateColorOrThrow({ r: 0, g: 255, b: 0 })).not.toThrow();
    expect(() => validateColorOrThrow({ r: 255, g: 0, b: 255 })).not.toThrow();
  });

  it('rejects out of range, decimal, or non-number values', () => {
    const cases: any[] = [
      { r: -1, g: 0, b: 0 },
      { r: 0, g: -1, b: 0 },
      { r: 0, g: 0, b: -1 },
      { r: 256, g: 0, b: 0 },
      { r: 0, g: 256, b: 0 },
      { r: 0, g: 0, b: 256 },
      { r: 0.5, g: 0, b: 0 },
      { r: 0, g: 0.5, b: 0 },
      { r: 0, g: 0, b: 0.5 },
      { r: NaN, g: 0, b: 0 },
      { r: 0, g: Infinity, b: 0 },
      { r: '255', g: 0, b: 0 },
    ];
    cases.forEach((c) => {
      expect(() => validateColorOrThrow(c)).toThrow(
        /\[validateColorOrThrow\] invalid RGB color/,
      );
    });
  });
});

describe('validateColorOrThrow RGBA format', () => {
  it('accepts valid RGBA objects', () => {
    expect(() => validateColorOrThrow({ r: 0, g: 0, b: 255, a: 0 })).not.toThrow();
    expect(() => validateColorOrThrow({ r: 255, g: 255, b: 0, a: 1 })).not.toThrow();
  });

  it('rejects invalid RGBA objects', () => {
    const cases: any[] = [
      { r: 256, g: 0, b: 0, a: 0.5 },
      { r: 0, g: 0, b: 0, a: -0.1 },
      { r: 0, g: 0, b: 0, a: 1.1 },
      { r: 0, g: 0, b: 0, a: '0.5' },
      { r: 0.5, g: 0, b: 0, a: 0.5 },
    ];
    cases.forEach((c) => {
      expect(() => validateColorOrThrow(c)).toThrow(
        /\[validateColorOrThrow\] invalid RGBA color/,
      );
    });
  });
});

describe('validateColorOrThrow HSL format', () => {
  it('accepts valid HSL objects', () => {
    expect(() => validateColorOrThrow({ h: 0, s: 0, l: 0 })).not.toThrow();
    expect(() => validateColorOrThrow({ h: 360, s: 100, l: 100 })).not.toThrow();
  });

  it('rejects invalid HSL objects', () => {
    const cases: any[] = [
      { h: -1, s: 0, l: 0 },
      { h: 361, s: 0, l: 0 },
      { h: 0, s: -1, l: 0 },
      { h: 0, s: 101, l: 0 },
      { h: 0, s: 0, l: -1 },
      { h: 0, s: 0, l: 101 },
      { h: 0.5, s: 0, l: 0 },
      { h: 0, s: 0.5, l: 0 },
      { h: 0, s: 0, l: 0.5 },
    ];
    cases.forEach((c) => {
      expect(() => validateColorOrThrow(c)).toThrow(
        /\[validateColorOrThrow\] invalid HSL color/,
      );
    });
  });
});

describe('validateColorOrThrow HSLA format', () => {
  it('accepts valid HSLA objects', () => {
    expect(() => validateColorOrThrow({ h: 120, s: 50, l: 50, a: 0.5 })).not.toThrow();
  });

  it('rejects invalid HSLA objects', () => {
    const cases: any[] = [
      { h: -1, s: 0, l: 0, a: 0.5 },
      { h: 361, s: 0, l: 0, a: 0.5 },
      { h: 0, s: -1, l: 0, a: 0.5 },
      { h: 0, s: 101, l: 0, a: 0.5 },
      { h: 0, s: 0, l: -1, a: 0.5 },
      { h: 0, s: 0, l: 101, a: 0.5 },
      { h: 0, s: 0, l: 0, a: -0.1 },
      { h: 0, s: 0, l: 0, a: 1.1 },
      { h: 0, s: 0, l: 0, a: '0.5' },
    ];
    cases.forEach((c) => {
      expect(() => validateColorOrThrow(c)).toThrow(
        /\[validateColorOrThrow\] invalid HSLA color/,
      );
    });
  });
});

describe('validateColorOrThrow HSV format', () => {
  it('accepts valid HSV objects', () => {
    expect(() => validateColorOrThrow({ h: 0, s: 0, v: 0 })).not.toThrow();
    expect(() => validateColorOrThrow({ h: 360, s: 100, v: 100 })).not.toThrow();
  });

  it('rejects invalid HSV objects', () => {
    const cases: any[] = [
      { h: -1, s: 0, v: 0 },
      { h: 361, s: 0, v: 0 },
      { h: 0, s: -1, v: 0 },
      { h: 0, s: 101, v: 0 },
      { h: 0, s: 0, v: -1 },
      { h: 0, s: 0, v: 101 },
      { h: 0.5, s: 0, v: 0 },
      { h: 0, s: 0.5, v: 0 },
      { h: 0, s: 0, v: 0.5 },
    ];
    cases.forEach((c) => {
      expect(() => validateColorOrThrow(c)).toThrow(
        /\[validateColorOrThrow\] invalid HSV color/,
      );
    });
  });
});

describe('validateColorOrThrow HSVA format', () => {
  it('accepts valid HSVA objects', () => {
    expect(() => validateColorOrThrow({ h: 200, s: 50, v: 50, a: 0.25 })).not.toThrow();
  });

  it('rejects invalid HSVA objects', () => {
    const cases: any[] = [
      { h: -1, s: 0, v: 0, a: 0.5 },
      { h: 361, s: 0, v: 0, a: 0.5 },
      { h: 0, s: -1, v: 0, a: 0.5 },
      { h: 0, s: 101, v: 0, a: 0.5 },
      { h: 0, s: 0, v: -1, a: 0.5 },
      { h: 0, s: 0, v: 101, a: 0.5 },
      { h: 0, s: 0, v: 0, a: -0.1 },
      { h: 0, s: 0, v: 0, a: 1.1 },
      { h: 0, s: 0, v: 0, a: '0.5' },
    ];
    cases.forEach((c) => {
      expect(() => validateColorOrThrow(c)).toThrow(
        /\[validateColorOrThrow\] invalid HSVA color/,
      );
    });
  });
});

describe('validateColorOrThrow CMYK format', () => {
  it('accepts valid CMYK objects including decimals', () => {
    expect(() => validateColorOrThrow({ c: 0, m: 0, y: 0, k: 0 })).not.toThrow();
    expect(() => validateColorOrThrow({ c: 100, m: 100, y: 100, k: 100 })).not.toThrow();
    expect(() => validateColorOrThrow({ c: 0.5, m: 99.9, y: 50.5, k: 10.1 })).not.toThrow();
  });

  it('rejects invalid CMYK objects', () => {
    const cases: any[] = [
      { c: -1, m: 0, y: 0, k: 0 },
      { c: 0, m: 101, y: 0, k: 0 },
      { c: 0, m: 0, y: -1, k: 0 },
      { c: 0, m: 0, y: 0, k: 101 },
      { c: '0', m: 0, y: 0, k: 0 },
    ];
    cases.forEach((c) => {
      expect(() => validateColorOrThrow(c)).toThrow(
        /\[validateColorOrThrow\] invalid CMYK color/,
      );
    });
  });
});

describe('validateColorOrThrow LCH format', () => {
  it('accepts valid LCH objects', () => {
    expect(() => validateColorOrThrow({ l: 0, c: 0, h: 0 })).not.toThrow();
    expect(() => validateColorOrThrow({ l: 100, c: 50, h: 360 })).not.toThrow();
  });

  it('rejects invalid LCH objects', () => {
    const cases: any[] = [
      { l: 101, c: 0, h: 0 },
      { l: 50, c: -1, h: 0 },
      { l: 50, c: 0, h: -1 },
      { l: 50, c: 0, h: 361 },
      { l: '50', c: 0, h: 0 },
    ];
    cases.forEach((c) => {
      expect(() => validateColorOrThrow(c)).toThrow(
        /\[validateColorOrThrow\] invalid LCH color/,
      );
    });
  });
});

describe('validateColorOrThrow OKLCH format', () => {
  it('accepts valid OKLCH objects', () => {
    expect(() => validateColorOrThrow({ l: 0, c: 0, h: 0 })).not.toThrow();
    expect(() => validateColorOrThrow({ l: 1, c: 0.5, h: 360 })).not.toThrow();
  });

  it('rejects invalid OKLCH objects', () => {
    const cases: any[] = [
      { l: -0.1, c: 0, h: 0 },
      { l: 0, c: -0.1, h: 0 },
      { l: 0, c: '0', h: 0 },
      { l: 0, c: 0, h: -1 },
      { l: 0, c: 0, h: 361 },
    ];
    cases.forEach((c) => {
      expect(() => validateColorOrThrow(c)).toThrow(
        /\[validateColorOrThrow\] invalid OKLCH color/,
      );
    });
  });
});

describe('validateColorOrThrow unknown format', () => {
  const inputs: any[] = [
    {},
    { foo: 'bar' },
    { r: 0 },
    [],
    'not-a-color',
  ];
  inputs.forEach((input) => {
    it(`throws on input ${JSON.stringify(input)}`, () => {
      expect(() => validateColorOrThrow(input)).toThrow(
        /\[getColorFormatType\] unknown color format/,
      );
    });
  });
});
