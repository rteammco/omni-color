import { Color } from '../color';
import { toHex, toHex8 } from '../conversions';
import type { ColorHarmony } from '../harmonies';
import {
  getAnalogousHarmonyColors,
  getComplementaryColors,
  getHarmonyColors,
  getMonochromaticHarmonyColors,
  getSplitComplementaryColors,
  getSquareHarmonyColors,
  getTetradicHarmonyColors,
  getTriadicHarmonyColors,
} from '../harmonies';
import { getColorRGBAFromInput } from '../utils';

describe('getComplementaryColors', () => {
  it('returns complementary pairs for primary colors', () => {
    const [redOrig, redComp] = getComplementaryColors(getColorRGBAFromInput('#ff0000'), {});
    expect(toHex(redOrig)).toBe('#ff0000');
    expect(toHex(redComp)).toBe('#00ffff');

    const [greenOrig, greenComp] = getComplementaryColors(
      getColorRGBAFromInput('#00ff00'),
      undefined,
    );
    expect(toHex(greenOrig)).toBe('#00ff00');
    expect(toHex(greenComp)).toBe('#ff00ff');

    const [blueOrig, blueComp] = getComplementaryColors(getColorRGBAFromInput('#0000ff'), {});
    expect(toHex(blueOrig)).toBe('#0000ff');
    expect(toHex(blueComp)).toBe('#ffff00');
  });

  it('returns complementary pairs for brand colors', () => {
    const [purpleOrig, purpleComp] = getComplementaryColors(getColorRGBAFromInput('#ee6ffc'), {});
    expect(toHex(purpleOrig)).toBe('#ee6ffc');
    expect(toHex(purpleComp)).toBe('#7dfc6f');

    const [blueOrig, blueComp] = getComplementaryColors(
      getColorRGBAFromInput('#2e3575'),
      undefined,
    );
    expect(toHex(blueOrig)).toBe('#2e3575');
    expect(toHex(blueComp)).toBe('#756e2e');

    const [yellowOrig, yellowComp] = getComplementaryColors(
      getColorRGBAFromInput('#d3e204'),
      undefined,
    );
    expect(toHex(yellowOrig)).toBe('#d3e204');
    expect(toHex(yellowComp)).toBe('#1304e2');

    const [greenOrig, greenComp] = getComplementaryColors(getColorRGBAFromInput('#29cc53'), {});
    expect(toHex(greenOrig)).toBe('#29cc53');
    expect(toHex(greenComp)).toBe('#cc29a2');

    const [pinkOrig, pinkComp] = getComplementaryColors(getColorRGBAFromInput('#811242'), {});
    expect(toHex(pinkOrig)).toBe('#811242');
    expect(toHex(pinkComp)).toBe('#128151');

    const [brandRedOrig, brandRedComp] = getComplementaryColors(
      getColorRGBAFromInput('#de0d14'),
      undefined,
    );
    expect(toHex(brandRedOrig)).toBe('#de0d14');
    expect(toHex(brandRedComp)).toBe('#0dded7');
  });

  it('returns complementary pairs for grayscale colors', () => {
    const [blackOrig, blackComp] = getComplementaryColors(getColorRGBAFromInput('#000000'), {});
    expect(toHex(blackOrig)).toBe('#000000');
    expect(toHex(blackComp)).toBe('#ffffff');

    const [whiteOrig, whiteComp] = getComplementaryColors(
      getColorRGBAFromInput('#ffffff'),
      undefined,
    );
    expect(toHex(whiteOrig)).toBe('#ffffff');
    expect(toHex(whiteComp)).toBe('#000000');

    const [lightGrayOrig, lightGrayComp] = getComplementaryColors(
      getColorRGBAFromInput('#d3d3d3'),
      {},
    );
    expect(toHex(lightGrayOrig)).toBe('#d3d3d3');
    expect(toHex(lightGrayComp)).toBe('#2b2b2b');

    const [grayOrig, grayComp] = getComplementaryColors(
      getColorRGBAFromInput('#808080'),
      undefined,
    );
    expect(toHex(grayOrig)).toBe('#808080');
    expect(toHex(grayComp)).toBe('#808080');

    const [darkGrayOrig, darkGrayComp] = getComplementaryColors(
      getColorRGBAFromInput('#333333'),
      {},
    );
    expect(toHex(darkGrayOrig)).toBe('#333333');
    expect(toHex(darkGrayComp)).toBe('#cccccc');
  });

  it('handles grayscale color modes', () => {
    const spin = getComplementaryColors(getColorRGBAFromInput('#000000'), {
      grayscaleHandlingMode: 'SPIN_LIGHTNESS',
    }).map(toHex);
    expect(spin).toEqual(['#000000', '#ffffff']);

    const ignore = getComplementaryColors(getColorRGBAFromInput('#000000'), {
      grayscaleHandlingMode: 'IGNORE',
    }).map(toHex);
    expect(ignore).toEqual(['#000000', '#000000']);
  });

  it('preserves alpha when creating complements', () => {
    const [base, complement] = getComplementaryColors(
      getColorRGBAFromInput('rgba(255, 0, 0, 0.4)'),
      undefined,
    );
    expect(base.a).toBeCloseTo(0.4, 5);
    expect(complement.a).toBeCloseTo(0.4, 5);
    expect(toHex8(complement)).toBe('#00ffff66');
  });
});

describe('getSplitComplementaryColors', () => {
  it('returns split complement colors for primary colors', () => {
    const [redOrig, redComp2, redComp3] = getSplitComplementaryColors(
      getColorRGBAFromInput('#ff0000'),
      {},
    );
    expect(toHex(redOrig)).toBe('#ff0000');
    expect(toHex(redComp2)).toBe('#0080ff');
    expect(toHex(redComp3)).toBe('#00ff80');

    const [greenOrig, greenComp2, greenComp3] = getSplitComplementaryColors(
      getColorRGBAFromInput('#00ff00'),
      undefined,
    );
    expect(toHex(greenOrig)).toBe('#00ff00');
    expect(toHex(greenComp2)).toBe('#ff0080');
    expect(toHex(greenComp3)).toBe('#8000ff');

    const [blueOrig, blueComp2, blueComp3] = getSplitComplementaryColors(
      getColorRGBAFromInput('#0000ff'),
      {},
    );
    expect(toHex(blueOrig)).toBe('#0000ff');
    expect(toHex(blueComp2)).toBe('#80ff00');
    expect(toHex(blueComp3)).toBe('#ff8000');
  });

  it('returns split complement colors for brand colors', () => {
    const [purpleOrig, purpleComp2, purpleComp3] = getSplitComplementaryColors(
      getColorRGBAFromInput('#ee6ffc'),
      undefined,
    );
    expect(toHex(purpleOrig)).toBe('#ee6ffc');
    expect(toHex(purpleComp2)).toBe('#6ffca7');
    expect(toHex(purpleComp3)).toBe('#c4fc6f');

    const [brandBlueOrig, brandBlueComp2, brandBlueComp3] = getSplitComplementaryColors(
      getColorRGBAFromInput('#2e3575'),
      {},
    );
    expect(toHex(brandBlueOrig)).toBe('#2e3575');
    expect(toHex(brandBlueComp2)).toBe('#58752e');
    expect(toHex(brandBlueComp3)).toBe('#754b2e');

    const [yellowOrig, yellowComp2, yellowComp3] = getSplitComplementaryColors(
      getColorRGBAFromInput('#d3e204'),
      undefined,
    );
    expect(toHex(yellowOrig)).toBe('#d3e204');
    expect(toHex(yellowComp2)).toBe('#8204e2');
    expect(toHex(yellowComp3)).toBe('#0464e2');

    const [greenOrig, greenComp2, greenComp3] = getSplitComplementaryColors(
      getColorRGBAFromInput('#29cc53'),
      {},
    );
    expect(toHex(greenOrig)).toBe('#29cc53');
    expect(toHex(greenComp2)).toBe('#cc2951');
    expect(toHex(greenComp3)).toBe('#a429cc');

    const [pinkOrig, pinkComp2, pinkComp3] = getSplitComplementaryColors(
      getColorRGBAFromInput('#811242'),
      undefined,
    );
    expect(toHex(pinkOrig)).toBe('#811242');
    expect(toHex(pinkComp2)).toBe('#127a81');
    expect(toHex(pinkComp3)).toBe('#128119');

    const [brandRedOrig, brandRedComp2, brandRedComp3] = getSplitComplementaryColors(
      getColorRGBAFromInput('#de0d14'),
      {},
    );
    expect(toHex(brandRedOrig)).toBe('#de0d14');
    expect(toHex(brandRedComp2)).toBe('#0d7cde');
    expect(toHex(brandRedComp3)).toBe('#0dde6f');
  });

  it('returns split complement colors for grayscale colors', () => {
    const [blackOrig, blackComp2, blackComp3] = getSplitComplementaryColors(
      getColorRGBAFromInput('#000000'),
      undefined,
    );
    expect(toHex(blackOrig)).toBe('#000000');
    expect(toHex(blackComp2)).toBe('#d4d4d4');
    expect(toHex(blackComp3)).toBe('#d4d4d4');

    const [whiteOrig, whiteComp2, whiteComp3] = getSplitComplementaryColors(
      getColorRGBAFromInput('#ffffff'),
      {},
    );
    expect(toHex(whiteOrig)).toBe('#ffffff');
    expect(toHex(whiteComp2)).toBe('#2b2b2b');
    expect(toHex(whiteComp3)).toBe('#2b2b2b');

    const [lightGrayOrig, lightGrayComp2, lightGrayComp3] = getSplitComplementaryColors(
      getColorRGBAFromInput('#d3d3d3'),
      undefined,
    );
    expect(toHex(lightGrayOrig)).toBe('#d3d3d3');
    expect(toHex(lightGrayComp2)).toBe('#474747');
    expect(toHex(lightGrayComp3)).toBe('#474747');

    const [grayOrig, grayComp2, grayComp3] = getSplitComplementaryColors(
      getColorRGBAFromInput('#808080'),
      {},
    );
    expect(toHex(grayOrig)).toBe('#808080');
    expect(toHex(grayComp2)).toBe('#808080');
    expect(toHex(grayComp3)).toBe('#808080');

    const [darkGrayOrig, darkGrayComp2, darkGrayComp3] = getSplitComplementaryColors(
      getColorRGBAFromInput('#333333'),
      undefined,
    );
    expect(toHex(darkGrayOrig)).toBe('#333333');
    expect(toHex(darkGrayComp2)).toBe('#b3b3b3');
    expect(toHex(darkGrayComp3)).toBe('#b3b3b3');
  });

  it('handles grayscale color modes', () => {
    const spin = getSplitComplementaryColors(getColorRGBAFromInput('#000000'), {
      grayscaleHandlingMode: 'SPIN_LIGHTNESS',
    }).map(toHex);
    expect(spin).toEqual(['#000000', '#d4d4d4', '#d4d4d4']);

    const ignore = getSplitComplementaryColors(getColorRGBAFromInput('#000000'), {
      grayscaleHandlingMode: 'IGNORE',
    }).map(toHex);
    expect(ignore).toEqual(['#000000', '#000000', '#000000']);
  });
});

describe('getTriadicHarmonyColors', () => {
  it('returns triadic harmony colors for primary colors', () => {
    const [redOrig, redTriad2, redTriad3] = getTriadicHarmonyColors(
      getColorRGBAFromInput('#ff0000'),
      {},
    );
    expect(toHex(redOrig)).toBe('#ff0000');
    expect(toHex(redTriad2)).toBe('#0000ff');
    expect(toHex(redTriad3)).toBe('#00ff00');

    const [greenOrig, greenTriad2, greenTriad3] = getTriadicHarmonyColors(
      getColorRGBAFromInput('#00ff00'),
      undefined,
    );
    expect(toHex(greenOrig)).toBe('#00ff00');
    expect(toHex(greenTriad2)).toBe('#ff0000');
    expect(toHex(greenTriad3)).toBe('#0000ff');

    const [blueOrig, blueTriad2, blueTriad3] = getTriadicHarmonyColors(
      getColorRGBAFromInput('#0000ff'),
      {},
    );
    expect(toHex(blueOrig)).toBe('#0000ff');
    expect(toHex(blueTriad2)).toBe('#00ff00');
    expect(toHex(blueTriad3)).toBe('#ff0000');
  });

  it('returns triadic harmony colors for brand colors', () => {
    const [purpleOrig, purpleTriad2, purpleTriad3] = getTriadicHarmonyColors(
      getColorRGBAFromInput('#ee6ffc'),
      undefined,
    );
    expect(toHex(purpleOrig)).toBe('#ee6ffc');
    expect(toHex(purpleTriad2)).toBe('#6ffcee');
    expect(toHex(purpleTriad3)).toBe('#fcee6f');

    const [brandBlueOrig, brandBlueTriad2, brandBlueTriad3] = getTriadicHarmonyColors(
      getColorRGBAFromInput('#2e3575'),
      {},
    );
    expect(toHex(brandBlueOrig)).toBe('#2e3575');
    expect(toHex(brandBlueTriad2)).toBe('#35752e');
    expect(toHex(brandBlueTriad3)).toBe('#752e35');

    const [yellowOrig, yellowTriad2, yellowTriad3] = getTriadicHarmonyColors(
      getColorRGBAFromInput('#d3e204'),
      undefined,
    );
    expect(toHex(yellowOrig)).toBe('#d3e204');
    expect(toHex(yellowTriad2)).toBe('#e204d3');
    expect(toHex(yellowTriad3)).toBe('#04d3e2');

    const [greenOrig, greenTriad2, greenTriad3] = getTriadicHarmonyColors(
      getColorRGBAFromInput('#29cc53'),
      {},
    );
    expect(toHex(greenOrig)).toBe('#29cc53');
    expect(toHex(greenTriad2)).toBe('#cc5329');
    expect(toHex(greenTriad3)).toBe('#5329cc');

    const [pinkOrig, pinkTriad2, pinkTriad3] = getTriadicHarmonyColors(
      getColorRGBAFromInput('#811242'),
      undefined,
    );
    expect(toHex(pinkOrig)).toBe('#811242');
    expect(toHex(pinkTriad2)).toBe('#124281');
    expect(toHex(pinkTriad3)).toBe('#428112');

    const [brandRedOrig, brandRedTriad2, brandRedTriad3] = getTriadicHarmonyColors(
      getColorRGBAFromInput('#de0d14'),
      {},
    );
    expect(toHex(brandRedOrig)).toBe('#de0d14');
    expect(toHex(brandRedTriad2)).toBe('#0d14de');
    expect(toHex(brandRedTriad3)).toBe('#14de0d');
  });

  it('returns triadic harmony colors for grayscale colors', () => {
    const [blackOrig, blackTriad2, blackTriad3] = getTriadicHarmonyColors(
      getColorRGBAFromInput('#000000'),
      undefined,
    );
    expect(toHex(blackOrig)).toBe('#000000');
    expect(toHex(blackTriad2)).toBe('#ababab');
    expect(toHex(blackTriad3)).toBe('#ababab');

    const [whiteOrig, whiteTriad2, whiteTriad3] = getTriadicHarmonyColors(
      getColorRGBAFromInput('#ffffff'),
      {},
    );
    expect(toHex(whiteOrig)).toBe('#ffffff');
    expect(toHex(whiteTriad2)).toBe('#545454');
    expect(toHex(whiteTriad3)).toBe('#545454');

    const [lightGrayOrig, lightGrayTriad2, lightGrayTriad3] = getTriadicHarmonyColors(
      getColorRGBAFromInput('#d3d3d3'),
      undefined,
    );
    expect(toHex(lightGrayOrig)).toBe('#d3d3d3');
    expect(toHex(lightGrayTriad2)).toBe('#636363');
    expect(toHex(lightGrayTriad3)).toBe('#636363');

    const [grayOrig, grayTriad2, grayTriad3] = getTriadicHarmonyColors(
      getColorRGBAFromInput('#808080'),
      {},
    );
    expect(toHex(grayOrig)).toBe('#808080');
    expect(toHex(grayTriad2)).toBe('#808080');
    expect(toHex(grayTriad3)).toBe('#808080');

    const [darkGrayOrig, darkGrayTriad2, darkGrayTriad3] = getTriadicHarmonyColors(
      getColorRGBAFromInput('#333333'),
      undefined,
    );
    expect(toHex(darkGrayOrig)).toBe('#333333');
    expect(toHex(darkGrayTriad2)).toBe('#999999');
    expect(toHex(darkGrayTriad3)).toBe('#999999');
  });

  it('handles grayscale color modes', () => {
    const spin = getTriadicHarmonyColors(getColorRGBAFromInput('#000000'), {
      grayscaleHandlingMode: 'SPIN_LIGHTNESS',
    }).map(toHex);
    expect(spin).toEqual(['#000000', '#ababab', '#ababab']);

    const ignore = getTriadicHarmonyColors(getColorRGBAFromInput('#000000'), {
      grayscaleHandlingMode: 'IGNORE',
    }).map(toHex);
    expect(ignore).toEqual(['#000000', '#000000', '#000000']);
  });
});

describe('getSquareHarmonyColors', () => {
  it('returns square harmony colors for primary colors', () => {
    const [red1, red2, red3, red4] = getSquareHarmonyColors(getColorRGBAFromInput('#ff0000'), {});
    expect(toHex(red1)).toBe('#ff0000');
    expect(toHex(red2)).toBe('#80ff00');
    expect(toHex(red3)).toBe('#00ffff');
    expect(toHex(red4)).toBe('#8000ff');

    const [green1, green2, green3, green4] = getSquareHarmonyColors(
      getColorRGBAFromInput('#00ff00'),
      undefined,
    );
    expect(toHex(green1)).toBe('#00ff00');
    expect(toHex(green2)).toBe('#0080ff');
    expect(toHex(green3)).toBe('#ff00ff');
    expect(toHex(green4)).toBe('#ff8000');

    const [blue1, blue2, blue3, blue4] = getSquareHarmonyColors(
      getColorRGBAFromInput('#0000ff'),
      {},
    );
    expect(toHex(blue1)).toBe('#0000ff');
    expect(toHex(blue2)).toBe('#ff0080');
    expect(toHex(blue3)).toBe('#ffff00');
    expect(toHex(blue4)).toBe('#00ff80');
  });

  it('returns square harmony colors for brand colors', () => {
    const [purple1, purple2, purple3, purple4] = getSquareHarmonyColors(
      getColorRGBAFromInput('#ee6ffc'),
      undefined,
    );
    expect(toHex(purple1)).toBe('#ee6ffc');
    expect(toHex(purple2)).toBe('#fca76f');
    expect(toHex(purple3)).toBe('#7dfc6f');
    expect(toHex(purple4)).toBe('#6fc4fc');

    const [brandBlue1, brandBlue2, brandBlue3, brandBlue4] = getSquareHarmonyColors(
      getColorRGBAFromInput('#2e3575'),
      {},
    );
    expect(toHex(brandBlue1)).toBe('#2e3575');
    expect(toHex(brandBlue2)).toBe('#752e58');
    expect(toHex(brandBlue3)).toBe('#756e2e');
    expect(toHex(brandBlue4)).toBe('#2e754b');

    const [yellow1, yellow2, yellow3, yellow4] = getSquareHarmonyColors(
      getColorRGBAFromInput('#d3e204'),
      undefined,
    );
    expect(toHex(yellow1)).toBe('#d3e204');
    expect(toHex(yellow2)).toBe('#04e282');
    expect(toHex(yellow3)).toBe('#1304e2');
    expect(toHex(yellow4)).toBe('#e20464');

    const [green1, green2b, green3b, green4b] = getSquareHarmonyColors(
      getColorRGBAFromInput('#29cc53'),
      {},
    );
    expect(toHex(green1)).toBe('#29cc53');
    expect(toHex(green2b)).toBe('#2950cc');
    expect(toHex(green3b)).toBe('#cc29a2');
    expect(toHex(green4b)).toBe('#cca429');

    const [pink1, pink2, pink3, pink4] = getSquareHarmonyColors(
      getColorRGBAFromInput('#811242'),
      undefined,
    );
    expect(toHex(pink1)).toBe('#811242');
    expect(toHex(pink2)).toBe('#7a8112');
    expect(toHex(pink3)).toBe('#128151');
    expect(toHex(pink4)).toBe('#1a1281');

    const [brandRed1, brandRed2, brandRed3, brandRed4] = getSquareHarmonyColors(
      getColorRGBAFromInput('#de0d14'),
      {},
    );
    expect(toHex(brandRed1)).toBe('#de0d14');
    expect(toHex(brandRed2)).toBe('#7cde0d');
    expect(toHex(brandRed3)).toBe('#0dded7');
    expect(toHex(brandRed4)).toBe('#6f0dde');
  });

  it('returns square harmony colors for grayscale colors', () => {
    const [black1, black2, black3, black4] = getSquareHarmonyColors(
      getColorRGBAFromInput('#000000'),
      undefined,
    );
    expect(toHex(black1)).toBe('#000000');
    expect(toHex(black2)).toBe('#808080');
    expect(toHex(black3)).toBe('#ffffff');
    expect(toHex(black4)).toBe('#808080');

    const [white1, white2, white3, white4] = getSquareHarmonyColors(
      getColorRGBAFromInput('#ffffff'),
      {},
    );
    expect(toHex(white1)).toBe('#ffffff');
    expect(toHex(white2)).toBe('#808080');
    expect(toHex(white3)).toBe('#000000');
    expect(toHex(white4)).toBe('#808080');

    const [lightGray1, lightGray2, lightGray3, lightGray4] = getSquareHarmonyColors(
      getColorRGBAFromInput('#d3d3d3'),
      undefined,
    );
    expect(toHex(lightGray1)).toBe('#d3d3d3');
    expect(toHex(lightGray2)).toBe('#808080');
    expect(toHex(lightGray3)).toBe('#2b2b2b');
    expect(toHex(lightGray4)).toBe('#808080');

    const [gray1, gray2, gray3, gray4] = getSquareHarmonyColors(
      getColorRGBAFromInput('#808080'),
      {},
    );
    expect(toHex(gray1)).toBe('#808080');
    expect(toHex(gray2)).toBe('#808080');
    expect(toHex(gray3)).toBe('#808080');
    expect(toHex(gray4)).toBe('#808080');

    const [darkGray1, darkGray2, darkGray3, darkGray4] = getSquareHarmonyColors(
      getColorRGBAFromInput('#333333'),
      undefined,
    );
    expect(toHex(darkGray1)).toBe('#333333');
    expect(toHex(darkGray2)).toBe('#808080');
    expect(toHex(darkGray3)).toBe('#cccccc');
    expect(toHex(darkGray4)).toBe('#808080');
  });

  it('handles grayscale color modes', () => {
    const spin = getSquareHarmonyColors(getColorRGBAFromInput('#000000'), {
      grayscaleHandlingMode: 'SPIN_LIGHTNESS',
    }).map(toHex);
    expect(spin).toEqual(['#000000', '#808080', '#ffffff', '#808080']);

    const ignore = getSquareHarmonyColors(getColorRGBAFromInput('#000000'), {
      grayscaleHandlingMode: 'IGNORE',
    }).map(toHex);
    expect(ignore).toEqual(['#000000', '#000000', '#000000', '#000000']);
  });
});

describe('getTetradicHarmonyColors', () => {
  it('supports direction option for hue rotation order', () => {
    const clockwise = getTetradicHarmonyColors(getColorRGBAFromInput('#ff0000'), {
      direction: 'CLOCKWISE',
    }).map(toHex);
    expect(clockwise).toEqual(['#ff0000', '#ffff00', '#00ffff', '#0000ff']);

    const counterclockwise = getTetradicHarmonyColors(getColorRGBAFromInput('#ff0000'), {
      direction: 'COUNTERCLOCKWISE',
    }).map(toHex);
    expect(counterclockwise).toEqual(['#ff0000', '#ff00ff', '#00ffff', '#00ff00']);
  });

  it('accepts case-insensitive direction values', () => {
    const clockwiseMixedCase = getTetradicHarmonyColors(getColorRGBAFromInput('#ff0000'), {
      direction: 'clockwise',
    }).map(toHex);
    expect(clockwiseMixedCase).toEqual(['#ff0000', '#ffff00', '#00ffff', '#0000ff']);

    const counterclockwiseMixedCase = getTetradicHarmonyColors(getColorRGBAFromInput('#ff0000'), {
      direction: 'counterclockwise',
    }).map(toHex);
    expect(counterclockwiseMixedCase).toEqual(['#ff0000', '#ff00ff', '#00ffff', '#00ff00']);
  });

  it('returns tetradic harmony colors for primary colors', () => {
    const [red1, red2, red3, red4] = getTetradicHarmonyColors(getColorRGBAFromInput('#ff0000'), {});
    expect(toHex(red1)).toBe('#ff0000');
    expect(toHex(red2)).toBe('#ffff00');
    expect(toHex(red3)).toBe('#00ffff');
    expect(toHex(red4)).toBe('#0000ff');

    const [green1, green2, green3, green4] = getTetradicHarmonyColors(
      getColorRGBAFromInput('#00ff00'),
      undefined,
    );
    expect(toHex(green1)).toBe('#00ff00');
    expect(toHex(green2)).toBe('#00ffff');
    expect(toHex(green3)).toBe('#ff00ff');
    expect(toHex(green4)).toBe('#ff0000');

    const [blue1, blue2, blue3, blue4] = getTetradicHarmonyColors(
      getColorRGBAFromInput('#0000ff'),
      {},
    );
    expect(toHex(blue1)).toBe('#0000ff');
    expect(toHex(blue2)).toBe('#ff00ff');
    expect(toHex(blue3)).toBe('#ffff00');
    expect(toHex(blue4)).toBe('#00ff00');
  });

  it('returns tetradic harmony colors for brand colors', () => {
    const [purple1, purple2, purple3, purple4] = getTetradicHarmonyColors(
      getColorRGBAFromInput('#ee6ffc'),
      undefined,
    );
    expect(toHex(purple1)).toBe('#ee6ffc');
    expect(toHex(purple2)).toBe('#fc6f7d');
    expect(toHex(purple3)).toBe('#7dfc6f');
    expect(toHex(purple4)).toBe('#6ffcee');

    const [brandBlue1, brandBlue2, brandBlue3, brandBlue4] = getTetradicHarmonyColors(
      getColorRGBAFromInput('#2e3575'),
      {},
    );
    expect(toHex(brandBlue1)).toBe('#2e3575');
    expect(toHex(brandBlue2)).toBe('#6e2e75');
    expect(toHex(brandBlue3)).toBe('#756e2e');
    expect(toHex(brandBlue4)).toBe('#35752e');

    const [yellow1, yellow2, yellow3, yellow4] = getTetradicHarmonyColors(
      getColorRGBAFromInput('#d3e204'),
      undefined,
    );
    expect(toHex(yellow1)).toBe('#d3e204');
    expect(toHex(yellow2)).toBe('#04e213');
    expect(toHex(yellow3)).toBe('#1304e2');
    expect(toHex(yellow4)).toBe('#e204d3');

    const [green1b, green2b, green3b, green4b] = getTetradicHarmonyColors(
      getColorRGBAFromInput('#29cc53'),
      {},
    );
    expect(toHex(green1b)).toBe('#29cc53');
    expect(toHex(green2b)).toBe('#29a2cc');
    expect(toHex(green3b)).toBe('#cc29a2');
    expect(toHex(green4b)).toBe('#cc5329');

    const [pink1, pink2, pink3, pink4] = getTetradicHarmonyColors(
      getColorRGBAFromInput('#811242'),
      undefined,
    );
    expect(toHex(pink1)).toBe('#811242');
    expect(toHex(pink2)).toBe('#815112');
    expect(toHex(pink3)).toBe('#128151');
    expect(toHex(pink4)).toBe('#124281');

    const [brandRed1, brandRed2, brandRed3, brandRed4] = getTetradicHarmonyColors(
      getColorRGBAFromInput('#de0d14'),
      {},
    );
    expect(toHex(brandRed1)).toBe('#de0d14');
    expect(toHex(brandRed2)).toBe('#ded70d');
    expect(toHex(brandRed3)).toBe('#0dded7');
    expect(toHex(brandRed4)).toBe('#0d14de');
  });

  it('returns tetradic harmony colors for grayscale colors', () => {
    const [black1, black2, black3, black4] = getTetradicHarmonyColors(
      getColorRGBAFromInput('#000000'),
      undefined,
    );
    expect(toHex(black1)).toBe('#000000');
    expect(toHex(black2)).toBe('#545454');
    expect(toHex(black3)).toBe('#ffffff');
    expect(toHex(black4)).toBe('#ababab');

    const [white1, white2, white3, white4] = getTetradicHarmonyColors(
      getColorRGBAFromInput('#ffffff'),
      {},
    );
    expect(toHex(white1)).toBe('#ffffff');
    expect(toHex(white2)).toBe('#ababab');
    expect(toHex(white3)).toBe('#000000');
    expect(toHex(white4)).toBe('#545454');

    const [lightGray1, lightGray2, lightGray3, lightGray4] = getTetradicHarmonyColors(
      getColorRGBAFromInput('#d3d3d3'),
      undefined,
    );
    expect(toHex(lightGray1)).toBe('#d3d3d3');
    expect(toHex(lightGray2)).toBe('#9c9c9c');
    expect(toHex(lightGray3)).toBe('#2b2b2b');
    expect(toHex(lightGray4)).toBe('#636363');

    const [gray1, gray2, gray3, gray4] = getTetradicHarmonyColors(
      getColorRGBAFromInput('#808080'),
      {},
    );
    expect(toHex(gray1)).toBe('#808080');
    expect(toHex(gray2)).toBe('#808080');
    expect(toHex(gray3)).toBe('#808080');
    expect(toHex(gray4)).toBe('#808080');

    const [darkGray1, darkGray2, darkGray3, darkGray4] = getTetradicHarmonyColors(
      getColorRGBAFromInput('#333333'),
      undefined,
    );
    expect(toHex(darkGray1)).toBe('#333333');
    expect(toHex(darkGray2)).toBe('#666666');
    expect(toHex(darkGray3)).toBe('#cccccc');
    expect(toHex(darkGray4)).toBe('#999999');
  });

  it('handles grayscale color modes', () => {
    const spin = getTetradicHarmonyColors(getColorRGBAFromInput('#000000'), {
      grayscaleHandlingMode: 'SPIN_LIGHTNESS',
    }).map(toHex);
    expect(spin).toEqual(['#000000', '#545454', '#ffffff', '#ababab']);

    const ignore = getTetradicHarmonyColors(getColorRGBAFromInput('#000000'), {
      grayscaleHandlingMode: 'IGNORE',
    }).map(toHex);
    expect(ignore).toEqual(['#000000', '#000000', '#000000', '#000000']);
  });
});

describe('getAnalogousHarmonyColors', () => {
  it('returns analogous harmony colors for primary colors', () => {
    const [red1, red2, red3, red4, red5] = getAnalogousHarmonyColors(
      getColorRGBAFromInput('#ff0000'),
      {},
    );
    expect(toHex(red1)).toBe('#ff0000');
    expect(toHex(red2)).toBe('#ff0080');
    expect(toHex(red3)).toBe('#ff8000');
    expect(toHex(red4)).toBe('#ff00ff');
    expect(toHex(red5)).toBe('#ffff00');

    const [green1, green2, green3, green4, green5] = getAnalogousHarmonyColors(
      getColorRGBAFromInput('#00ff00'),
      undefined,
    );
    expect(toHex(green1)).toBe('#00ff00');
    expect(toHex(green2)).toBe('#80ff00');
    expect(toHex(green3)).toBe('#00ff80');
    expect(toHex(green4)).toBe('#ffff00');
    expect(toHex(green5)).toBe('#00ffff');

    const [blue1, blue2, blue3, blue4, blue5] = getAnalogousHarmonyColors(
      getColorRGBAFromInput('#0000ff'),
      {},
    );
    expect(toHex(blue1)).toBe('#0000ff');
    expect(toHex(blue2)).toBe('#0080ff');
    expect(toHex(blue3)).toBe('#8000ff');
    expect(toHex(blue4)).toBe('#00ffff');
    expect(toHex(blue5)).toBe('#ff00ff');
  });

  it('returns analogous harmony colors for brand colors', () => {
    const [purple1, purple2, purple3, purple4, purple5] = getAnalogousHarmonyColors(
      getColorRGBAFromInput('#ee6ffc'),
      undefined,
    );
    expect(toHex(purple1)).toBe('#ee6ffc');
    expect(toHex(purple2)).toBe('#a76ffc');
    expect(toHex(purple3)).toBe('#fc6fc4');
    expect(toHex(purple4)).toBe('#6f7dfc');
    expect(toHex(purple5)).toBe('#fc6f7d');

    const [brandBlue1, brandBlue2, brandBlue3, brandBlue4, brandBlue5] = getAnalogousHarmonyColors(
      getColorRGBAFromInput('#2e3575'),
      {},
    );
    expect(toHex(brandBlue1)).toBe('#2e3575');
    expect(toHex(brandBlue2)).toBe('#2e5875');
    expect(toHex(brandBlue3)).toBe('#4b2e75');
    expect(toHex(brandBlue4)).toBe('#2e756e');
    expect(toHex(brandBlue5)).toBe('#6e2e75');

    const [yellow1, yellow2, yellow3, yellow4, yellow5] = getAnalogousHarmonyColors(
      getColorRGBAFromInput('#d3e204'),
      undefined,
    );
    expect(toHex(yellow1)).toBe('#d3e204');
    expect(toHex(yellow2)).toBe('#e28204');
    expect(toHex(yellow3)).toBe('#64e204');
    expect(toHex(yellow4)).toBe('#e21304');
    expect(toHex(yellow5)).toBe('#04e213');

    const [green1b, green2b, green3b, green4b, green5b] = getAnalogousHarmonyColors(
      getColorRGBAFromInput('#29cc53'),
      {},
    );
    expect(toHex(green1b)).toBe('#29cc53');
    expect(toHex(green2b)).toBe('#51cc29');
    expect(toHex(green3b)).toBe('#29cca4');
    expect(toHex(green4b)).toBe('#a2cc29');
    expect(toHex(green5b)).toBe('#29a2cc');

    const [pink1, pink2, pink3, pink4, pink5] = getAnalogousHarmonyColors(
      getColorRGBAFromInput('#811242'),
      undefined,
    );
    expect(toHex(pink1)).toBe('#811242');
    expect(toHex(pink2)).toBe('#81127a');
    expect(toHex(pink3)).toBe('#811a12');
    expect(toHex(pink4)).toBe('#511281');
    expect(toHex(pink5)).toBe('#815112');

    const [brandRed1, brandRed2, brandRed3, brandRed4, brandRed5] = getAnalogousHarmonyColors(
      getColorRGBAFromInput('#de0d14'),
      {},
    );
    expect(toHex(brandRed1)).toBe('#de0d14');
    expect(toHex(brandRed2)).toBe('#de0d7c');
    expect(toHex(brandRed3)).toBe('#de6f0d');
    expect(toHex(brandRed4)).toBe('#d70dde');
    expect(toHex(brandRed5)).toBe('#ded70d');
  });

  it('returns analogous harmony colors for grayscale colors', () => {
    const [black1, black2, black3, black4, black5] = getAnalogousHarmonyColors(
      getColorRGBAFromInput('#000000'),
      undefined,
    );
    expect(toHex(black1)).toBe('#000000');
    expect(toHex(black2)).toBe('#2b2b2b');
    expect(toHex(black3)).toBe('#2b2b2b');
    expect(toHex(black4)).toBe('#545454');
    expect(toHex(black5)).toBe('#545454');

    const [white1, white2, white3, white4, white5] = getAnalogousHarmonyColors(
      getColorRGBAFromInput('#ffffff'),
      {},
    );
    expect(toHex(white1)).toBe('#ffffff');
    expect(toHex(white2)).toBe('#d4d4d4');
    expect(toHex(white3)).toBe('#d4d4d4');
    expect(toHex(white4)).toBe('#ababab');
    expect(toHex(white5)).toBe('#ababab');

    const [lightGray1, lightGray2, lightGray3, lightGray4, lightGray5] = getAnalogousHarmonyColors(
      getColorRGBAFromInput('#d3d3d3'),
      undefined,
    );
    expect(toHex(lightGray1)).toBe('#d3d3d3');
    expect(toHex(lightGray2)).toBe('#b8b8b8');
    expect(toHex(lightGray3)).toBe('#b8b8b8');
    expect(toHex(lightGray4)).toBe('#9c9c9c');
    expect(toHex(lightGray5)).toBe('#9c9c9c');

    const [gray1, gray2, gray3, gray4, gray5] = getAnalogousHarmonyColors(
      getColorRGBAFromInput('#808080'),
      {},
    );
    expect(toHex(gray1)).toBe('#808080');
    expect(toHex(gray2)).toBe('#808080');
    expect(toHex(gray3)).toBe('#808080');
    expect(toHex(gray4)).toBe('#808080');
    expect(toHex(gray5)).toBe('#808080');

    const [darkGray1, darkGray2, darkGray3, darkGray4, darkGray5] = getAnalogousHarmonyColors(
      getColorRGBAFromInput('#333333'),
      undefined,
    );
    expect(toHex(darkGray1)).toBe('#333333');
    expect(toHex(darkGray2)).toBe('#4d4d4d');
    expect(toHex(darkGray3)).toBe('#4d4d4d');
    expect(toHex(darkGray4)).toBe('#666666');
    expect(toHex(darkGray5)).toBe('#666666');
  });

  it('handles grayscale color modes', () => {
    const spin = getAnalogousHarmonyColors(getColorRGBAFromInput('#000000'), {
      grayscaleHandlingMode: 'SPIN_LIGHTNESS',
    }).map(toHex);
    expect(spin).toEqual(['#000000', '#2b2b2b', '#2b2b2b', '#545454', '#545454']);

    const ignore = getAnalogousHarmonyColors(getColorRGBAFromInput('#000000'), {
      grayscaleHandlingMode: 'IGNORE',
    }).map(toHex);
    expect(ignore).toEqual(['#000000', '#000000', '#000000', '#000000', '#000000']);
  });
});

describe('getMonochromaticHarmonyColors', () => {
  it('returns monochromatic harmony colors', () => {
    const start = getColorRGBAFromInput({ h: 210, s: 60, l: 50 });
    const [base, lighter, darker, saturated, desaturated] = getMonochromaticHarmonyColors(start);
    const [baseHsl, lighterHsl, darkerHsl, saturatedHsl, desaturatedHsl] = [
      new Color(base).toHSL(),
      new Color(lighter).toHSL(),
      new Color(darker).toHSL(),
      new Color(saturated).toHSL(),
      new Color(desaturated).toHSL(),
    ];
    expect(baseHsl.h).toBeCloseTo(210, 0);
    expect(baseHsl.s).toBeCloseTo(60, 0);
    expect(baseHsl.l).toBeCloseTo(50, 0);
    expect(lighterHsl.h).toBeCloseTo(210, 0);
    expect(lighterHsl.s).toBeCloseTo(60, 0);
    expect(lighterHsl.l).toBeCloseTo(70, 0);
    expect(darkerHsl.h).toBeCloseTo(210, 0);
    expect(darkerHsl.s).toBeCloseTo(60, 0);
    expect(darkerHsl.l).toBeCloseTo(30, 0);
    expect(saturatedHsl.h).toBeCloseTo(210, 0);
    expect(saturatedHsl.s).toBeCloseTo(80, 0);
    expect(saturatedHsl.l).toBeCloseTo(50, 0);
    expect(desaturatedHsl.h).toBeCloseTo(210, 0);
    expect(desaturatedHsl.s).toBeCloseTo(40, 0);
    expect(desaturatedHsl.l).toBeCloseTo(50, 0);
  });

  it('clamps saturation and lightness', () => {
    const [base, lighter, darker, saturated, desaturated] = getMonochromaticHarmonyColors(
      getColorRGBAFromInput({ h: 10, s: 5, l: 95 }),
    );
    const [baseHsl, lighterHsl, darkerHsl, saturatedHsl, desaturatedHsl] = [
      new Color(base).toHSL(),
      new Color(lighter).toHSL(),
      new Color(darker).toHSL(),
      new Color(saturated).toHSL(),
      new Color(desaturated).toHSL(),
    ];
    expect(Math.min(baseHsl.h, 360 - baseHsl.h)).toBeLessThanOrEqual(10.1);
    expect(baseHsl.s).toBeCloseTo(5, 0);
    expect(baseHsl.l).toBeCloseTo(95, 0);
    expect(lighterHsl.h).toBeCloseTo(0, 0);
    expect(lighterHsl.s).toBeCloseTo(0, 0);
    expect(lighterHsl.l).toBeCloseTo(100, 0);
    expect(Math.min(darkerHsl.h, 360 - darkerHsl.h)).toBeLessThanOrEqual(10.1);
    expect(darkerHsl.s).toBeCloseTo(5, 0);
    expect(darkerHsl.l).toBeCloseTo(75, 0);
    expect(Math.min(saturatedHsl.h, 360 - saturatedHsl.h)).toBeLessThanOrEqual(10.1);
    expect(saturatedHsl.s).toBeCloseTo(25, 0);
    expect(saturatedHsl.l).toBeCloseTo(95, 0);
    expect(desaturatedHsl.h).toBeCloseTo(0, 0);
    expect(desaturatedHsl.s).toBeCloseTo(0, 0);
    expect(desaturatedHsl.l).toBeCloseTo(95, 0);
  });

  it('returns monochromatic harmony colors for diverse inputs', () => {
    const [redOrig, red2, red3, red4, red5] = getMonochromaticHarmonyColors(
      getColorRGBAFromInput('#ff0000'),
    );
    expect(toHex(redOrig)).toBe('#ff0000');
    expect(toHex(red2)).toBe('#ff6666');
    expect(toHex(red3)).toBe('#990000');
    expect(toHex(red4)).toBe('#ff0000');
    expect(toHex(red5)).toBe('#e61919');

    const [greenOrig, green2, green3, green4, green5] = getMonochromaticHarmonyColors(
      getColorRGBAFromInput('#00ff00'),
    );
    expect(toHex(greenOrig)).toBe('#00ff00');
    expect(toHex(green2)).toBe('#66ff66');
    expect(toHex(green3)).toBe('#009900');
    expect(toHex(green4)).toBe('#00ff00');
    expect(toHex(green5)).toBe('#19e619');

    const [blueOrig, blue2, blue3, blue4, blue5] = getMonochromaticHarmonyColors(
      getColorRGBAFromInput('#0000ff'),
    );
    expect(toHex(blueOrig)).toBe('#0000ff');
    expect(toHex(blue2)).toBe('#6666ff');
    expect(toHex(blue3)).toBe('#000099');
    expect(toHex(blue4)).toBe('#0000ff');
    expect(toHex(blue5)).toBe('#1919e6');

    const [purpleOrig, purple2, purple3, purple4, purple5] = getMonochromaticHarmonyColors(
      getColorRGBAFromInput('#ee6ffc'),
    );
    expect(toHex(purpleOrig)).toBe('#ee6ffc');
    expect(toHex(purple2)).toBe('#fad3fe');
    expect(toHex(purple3)).toBe('#e20bfa');
    expect(toHex(purple4)).toBe('#f06cff');
    expect(toHex(purple5)).toBe('#e27eed');

    const [brandBlueOrig, brandBlue2, brandBlue3, brandBlue4, brandBlue5] =
      getMonochromaticHarmonyColors(getColorRGBAFromInput('#2e3575'));
    expect(toHex(brandBlueOrig)).toBe('#2e3575');
    expect(toHex(brandBlue2)).toBe('#4f5aba');
    expect(toHex(brandBlue3)).toBe('#11142c');
    expect(toHex(brandBlue4)).toBe('#1e2885');
    expect(toHex(brandBlue5)).toBe('#3e4265');

    const [yellowOrig, yellow2, yellow3, yellow4, yellow5] = getMonochromaticHarmonyColors(
      getColorRGBAFromInput('#d3e204'),
    );
    expect(toHex(yellowOrig)).toBe('#d3e204');
    expect(toHex(yellow2)).toBe('#f0fc50');
    expect(toHex(yellow3)).toBe('#757e02');
    expect(toHex(yellow4)).toBe('#d6e600');
    expect(toHex(yellow5)).toBe('#bfcb1b');

    const [brandGreenOrig, brandGreen2, brandGreen3, brandGreen4, brandGreen5] =
      getMonochromaticHarmonyColors(getColorRGBAFromInput('#29cc53'));
    expect(toHex(brandGreenOrig)).toBe('#29cc53');
    expect(toHex(brandGreen2)).toBe('#77e493');
    expect(toHex(brandGreen3)).toBe('#187730');
    expect(toHex(brandGreen4)).toBe('#10e547');
    expect(toHex(brandGreen5)).toBe('#42b45f');

    const [pinkOrig, pink2, pink3, pink4, pink5] = getMonochromaticHarmonyColors(
      getColorRGBAFromInput('#811242'),
    );
    expect(toHex(pinkOrig)).toBe('#811242');
    expect(toHex(pink2)).toBe('#db1e70');
    expect(toHex(pink3)).toBe('#270614');
    expect(toHex(pink4)).toBe('#900340');
    expect(toHex(pink5)).toBe('#722144');

    const [brandRedOrig, brandRed2, brandRed3, brandRed4, brandRed5] =
      getMonochromaticHarmonyColors(getColorRGBAFromInput('#de0d14'));
    expect(toHex(brandRedOrig)).toBe('#de0d14');
    expect(toHex(brandRed2)).toBe('#f55c61');
    expect(toHex(brandRed3)).toBe('#7e070b');
    expect(toHex(brandRed4)).toBe('#eb0008');
    expect(toHex(brandRed5)).toBe('#c6252a');

    const [blackOrig, black2, black3, black4, black5] = getMonochromaticHarmonyColors(
      getColorRGBAFromInput('#000000'),
    );
    expect(toHex(blackOrig)).toBe('#000000');
    expect(toHex(black2)).toBe('#333333');
    expect(toHex(black3)).toBe('#000000');
    expect(toHex(black4)).toBe('#000000');
    expect(toHex(black5)).toBe('#000000');

    const [whiteOrig, white2, white3, white4, white5] = getMonochromaticHarmonyColors(
      getColorRGBAFromInput('#ffffff'),
    );
    expect(toHex(whiteOrig)).toBe('#ffffff');
    expect(toHex(white2)).toBe('#ffffff');
    expect(toHex(white3)).toBe('#cccccc');
    expect(toHex(white4)).toBe('#ffffff');
    expect(toHex(white5)).toBe('#ffffff');

    const [lightGrayOrig, lightGray2, lightGray3, lightGray4, lightGray5] =
      getMonochromaticHarmonyColors(getColorRGBAFromInput('#d3d3d3'));
    expect(toHex(lightGrayOrig)).toBe('#d3d3d3');
    expect(toHex(lightGray2)).toBe('#ffffff');
    expect(toHex(lightGray3)).toBe('#a0a0a0');
    expect(toHex(lightGray4)).toBe('#dccaca');
    expect(toHex(lightGray5)).toBe('#d3d3d3');

    const [grayOrig, gray2, gray3, gray4, gray5] = getMonochromaticHarmonyColors(
      getColorRGBAFromInput('#808080'),
    );
    expect(toHex(grayOrig)).toBe('#808080');
    expect(toHex(gray2)).toBe('#b3b3b3');
    expect(toHex(gray3)).toBe('#4d4d4d');
    expect(toHex(gray4)).toBe('#996767');
    expect(toHex(gray5)).toBe('#808080');

    const [darkGrayOrig, darkGray2, darkGray3, darkGray4, darkGray5] =
      getMonochromaticHarmonyColors(getColorRGBAFromInput('#333333'));
    expect(toHex(darkGrayOrig)).toBe('#333333');
    expect(toHex(darkGray2)).toBe('#666666');
    expect(toHex(darkGray3)).toBe('#000000');
    expect(toHex(darkGray4)).toBe('#3d2929');
    expect(toHex(darkGray5)).toBe('#333333');
  });

  it('keeps alpha across monochromatic variants', () => {
    const [base, lighter, darker, saturated, desaturated] = getMonochromaticHarmonyColors(
      getColorRGBAFromInput('rgba(20, 40, 60, 0.25)'),
    );

    expect(base.a).toBeCloseTo(0.25, 5);
    expect(lighter.a).toBeCloseTo(0.25, 5);
    expect(darker.a).toBeCloseTo(0.25, 5);
    expect(saturated.a).toBeCloseTo(0.25, 5);
    expect(desaturated.a).toBeCloseTo(0.25, 5);
  });
});

describe('getHarmonyColors', () => {
  it('delegates to individual harmony functions', () => {
    expect(
      getHarmonyColors(getColorRGBAFromInput('#ff0000'), 'COMPLEMENTARY', {}).map(toHex),
    ).toEqual(['#ff0000', '#00ffff']);

    expect(
      getHarmonyColors(getColorRGBAFromInput('#ff0000'), 'SPLIT_COMPLEMENTARY', undefined).map(
        toHex,
      ),
    ).toEqual(['#ff0000', '#0080ff', '#00ff80']);

    expect(getHarmonyColors(getColorRGBAFromInput('#ff0000'), 'TRIADIC', {}).map(toHex)).toEqual([
      '#ff0000',
      '#0000ff',
      '#00ff00',
    ]);

    expect(
      getHarmonyColors(getColorRGBAFromInput('#ff0000'), 'SQUARE', undefined).map(toHex),
    ).toEqual(['#ff0000', '#80ff00', '#00ffff', '#8000ff']);

    expect(getHarmonyColors(getColorRGBAFromInput('#ff0000'), 'TETRADIC', {}).map(toHex)).toEqual([
      '#ff0000',
      '#ffff00',
      '#00ffff',
      '#0000ff',
    ]);

    expect(
      getHarmonyColors(getColorRGBAFromInput('#ff0000'), 'ANALOGOUS', undefined).map(toHex),
    ).toEqual(['#ff0000', '#ff0080', '#ff8000', '#ff00ff', '#ffff00']);

    expect(
      getHarmonyColors(getColorRGBAFromInput('#ff0000'), 'MONOCHROMATIC', {}).map(toHex),
    ).toEqual(['#ff0000', '#ff6666', '#990000', '#ff0000', '#e61919']);
  });

  it('accepts mixed case harmony', () => {
    const c = getColorRGBAFromInput('red');
    const h1 = getHarmonyColors(c, 'TRIADIC', undefined);
    const h2 = getHarmonyColors(c, 'triadic', {});

    expect(h1.length).toBe(h2.length);
    expect(toHex(h1[1])).toBe(toHex(h2[1]));
  });

  it('delegates for brand purple as well', () => {
    expect(
      getHarmonyColors(getColorRGBAFromInput('#ee6ffc'), 'COMPLEMENTARY', undefined).map(toHex),
    ).toEqual(['#ee6ffc', '#7dfc6f']);

    expect(
      getHarmonyColors(getColorRGBAFromInput('#ee6ffc'), 'SPLIT_COMPLEMENTARY', {}).map(toHex),
    ).toEqual(['#ee6ffc', '#6ffca7', '#c4fc6f']);

    expect(
      getHarmonyColors(getColorRGBAFromInput('#ee6ffc'), 'TRIADIC', undefined).map(toHex),
    ).toEqual(['#ee6ffc', '#6ffcee', '#fcee6f']);

    expect(getHarmonyColors(getColorRGBAFromInput('#ee6ffc'), 'SQUARE', {}).map(toHex)).toEqual([
      '#ee6ffc',
      '#fca76f',
      '#7dfc6f',
      '#6fc4fc',
    ]);

    expect(
      getHarmonyColors(getColorRGBAFromInput('#ee6ffc'), 'TETRADIC', undefined).map(toHex),
    ).toEqual(['#ee6ffc', '#fc6f7d', '#7dfc6f', '#6ffcee']);

    expect(getHarmonyColors(getColorRGBAFromInput('#ee6ffc'), 'ANALOGOUS', {}).map(toHex)).toEqual([
      '#ee6ffc',
      '#a76ffc',
      '#fc6fc4',
      '#6f7dfc',
      '#fc6f7d',
    ]);

    expect(
      getHarmonyColors(getColorRGBAFromInput('#ee6ffc'), 'MONOCHROMATIC', undefined).map(toHex),
    ).toEqual(['#ee6ffc', '#fad3fe', '#e20bfa', '#f06cff', '#e27eed']);
  });

  it('throws for unknown harmony type', () => {
    expect(() =>
      getHarmonyColors(getColorRGBAFromInput('#ff0000'), 'unknown' as ColorHarmony, {}),
    ).toThrow("Invalid 'harmony'");
  });

  it('throws for invalid grayscale handling mode', () => {
    expect(() =>
      getComplementaryColors(getColorRGBAFromInput('#808080'), {
        grayscaleHandlingMode: 'unknown' as never,
      }),
    ).toThrow("Invalid 'grayscaleHandlingMode'");
  });
});
