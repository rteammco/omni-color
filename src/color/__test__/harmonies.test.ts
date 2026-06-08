import { Color } from '../color';
import type { ColorHarmony } from '../harmonies';

describe('getComplementaryColors', () => {
  it('returns complementary pairs for primary colors', () => {
    const [redOrig, redComp] = new Color('#ff0000').getComplementaryColors({});
    expect(redOrig.toHex()).toBe('#ff0000');
    expect(redComp.toHex()).toBe('#00ffff');

    const [greenOrig, greenComp] = new Color('#00ff00').getComplementaryColors(undefined);
    expect(greenOrig.toHex()).toBe('#00ff00');
    expect(greenComp.toHex()).toBe('#ff00ff');

    const [blueOrig, blueComp] = new Color('#0000ff').getComplementaryColors({});
    expect(blueOrig.toHex()).toBe('#0000ff');
    expect(blueComp.toHex()).toBe('#ffff00');
  });

  it('returns complementary pairs for brand colors', () => {
    const [purpleOrig, purpleComp] = new Color('#ee6ffc').getComplementaryColors({});
    expect(purpleOrig.toHex()).toBe('#ee6ffc');
    expect(purpleComp.toHex()).toBe('#7dfc6f');

    const [blueOrig, blueComp] = new Color('#2e3575').getComplementaryColors(undefined);
    expect(blueOrig.toHex()).toBe('#2e3575');
    expect(blueComp.toHex()).toBe('#756e2e');

    const [yellowOrig, yellowComp] = new Color('#d3e204').getComplementaryColors(undefined);
    expect(yellowOrig.toHex()).toBe('#d3e204');
    expect(yellowComp.toHex()).toBe('#1304e2');

    const [greenOrig, greenComp] = new Color('#29cc53').getComplementaryColors({});
    expect(greenOrig.toHex()).toBe('#29cc53');
    expect(greenComp.toHex()).toBe('#cc29a2');

    const [pinkOrig, pinkComp] = new Color('#811242').getComplementaryColors({});
    expect(pinkOrig.toHex()).toBe('#811242');
    expect(pinkComp.toHex()).toBe('#128151');

    const [brandRedOrig, brandRedComp] = new Color('#de0d14').getComplementaryColors(undefined);
    expect(brandRedOrig.toHex()).toBe('#de0d14');
    expect(brandRedComp.toHex()).toBe('#0dded7');
  });

  it('returns complementary pairs for grayscale colors', () => {
    const [blackOrig, blackComp] = new Color('#000000').getComplementaryColors({});
    expect(blackOrig.toHex()).toBe('#000000');
    expect(blackComp.toHex()).toBe('#ffffff');

    const [whiteOrig, whiteComp] = new Color('#ffffff').getComplementaryColors(undefined);
    expect(whiteOrig.toHex()).toBe('#ffffff');
    expect(whiteComp.toHex()).toBe('#000000');

    const [lightGrayOrig, lightGrayComp] = new Color('#d3d3d3').getComplementaryColors({});
    expect(lightGrayOrig.toHex()).toBe('#d3d3d3');
    expect(lightGrayComp.toHex()).toBe('#2b2b2b');

    const [grayOrig, grayComp] = new Color('#808080').getComplementaryColors(undefined);
    expect(grayOrig.toHex()).toBe('#808080');
    expect(grayComp.toHex()).toBe('#808080');

    const [darkGrayOrig, darkGrayComp] = new Color('#333333').getComplementaryColors({});
    expect(darkGrayOrig.toHex()).toBe('#333333');
    expect(darkGrayComp.toHex()).toBe('#cccccc');
  });

  it('handles grayscale color modes', () => {
    const spin = new Color('#000000')
      .getComplementaryColors({
        grayscaleHandlingMode: 'SPIN_LIGHTNESS',
      })
      .map((c) => c.toHex());
    expect(spin).toEqual(['#000000', '#ffffff']);

    const ignore = new Color('#000000')
      .getComplementaryColors({
        grayscaleHandlingMode: 'IGNORE',
      })
      .map((c) => c.toHex());
    expect(ignore).toEqual(['#000000', '#000000']);
  });

  it('preserves alpha when creating complements', () => {
    const [base, complement] = new Color('rgba(255, 0, 0, 0.4)').getComplementaryColors(undefined);
    expect(base.toRGBA().a).toBeCloseTo(0.4, 5);
    expect(complement.toRGBA().a).toBeCloseTo(0.4, 5);
    expect(complement.toHex8()).toBe('#00ffff66');
  });
});

describe('getSplitComplementaryColors', () => {
  it('returns split complement colors for primary colors', () => {
    const [redOrig, redComp2, redComp3] = new Color('#ff0000').getSplitComplementaryColors({});
    expect(redOrig.toHex()).toBe('#ff0000');
    expect(redComp2.toHex()).toBe('#0080ff');
    expect(redComp3.toHex()).toBe('#00ff80');

    const [greenOrig, greenComp2, greenComp3] = new Color('#00ff00').getSplitComplementaryColors(
      undefined,
    );
    expect(greenOrig.toHex()).toBe('#00ff00');
    expect(greenComp2.toHex()).toBe('#ff0080');
    expect(greenComp3.toHex()).toBe('#8000ff');

    const [blueOrig, blueComp2, blueComp3] = new Color('#0000ff').getSplitComplementaryColors({});
    expect(blueOrig.toHex()).toBe('#0000ff');
    expect(blueComp2.toHex()).toBe('#80ff00');
    expect(blueComp3.toHex()).toBe('#ff8000');
  });

  it('returns split complement colors for brand colors', () => {
    const [purpleOrig, purpleComp2, purpleComp3] = new Color('#ee6ffc').getSplitComplementaryColors(
      undefined,
    );
    expect(purpleOrig.toHex()).toBe('#ee6ffc');
    expect(purpleComp2.toHex()).toBe('#6ffca7');
    expect(purpleComp3.toHex()).toBe('#c4fc6f');

    const [brandBlueOrig, brandBlueComp2, brandBlueComp3] = new Color(
      '#2e3575',
    ).getSplitComplementaryColors({});
    expect(brandBlueOrig.toHex()).toBe('#2e3575');
    expect(brandBlueComp2.toHex()).toBe('#58752e');
    expect(brandBlueComp3.toHex()).toBe('#754b2e');

    const [yellowOrig, yellowComp2, yellowComp3] = new Color('#d3e204').getSplitComplementaryColors(
      undefined,
    );
    expect(yellowOrig.toHex()).toBe('#d3e204');
    expect(yellowComp2.toHex()).toBe('#8204e2');
    expect(yellowComp3.toHex()).toBe('#0464e2');

    const [greenOrig, greenComp2, greenComp3] = new Color('#29cc53').getSplitComplementaryColors(
      {},
    );
    expect(greenOrig.toHex()).toBe('#29cc53');
    expect(greenComp2.toHex()).toBe('#cc2951');
    expect(greenComp3.toHex()).toBe('#a429cc');

    const [pinkOrig, pinkComp2, pinkComp3] = new Color('#811242').getSplitComplementaryColors(
      undefined,
    );
    expect(pinkOrig.toHex()).toBe('#811242');
    expect(pinkComp2.toHex()).toBe('#127a81');
    expect(pinkComp3.toHex()).toBe('#128119');

    const [brandRedOrig, brandRedComp2, brandRedComp3] = new Color(
      '#de0d14',
    ).getSplitComplementaryColors({});
    expect(brandRedOrig.toHex()).toBe('#de0d14');
    expect(brandRedComp2.toHex()).toBe('#0d7cde');
    expect(brandRedComp3.toHex()).toBe('#0dde6f');
  });

  it('returns split complement colors for grayscale colors', () => {
    const [blackOrig, blackComp2, blackComp3] = new Color('#000000').getSplitComplementaryColors(
      undefined,
    );
    expect(blackOrig.toHex()).toBe('#000000');
    expect(blackComp2.toHex()).toBe('#d4d4d4');
    expect(blackComp3.toHex()).toBe('#d4d4d4');

    const [whiteOrig, whiteComp2, whiteComp3] = new Color('#ffffff').getSplitComplementaryColors(
      {},
    );
    expect(whiteOrig.toHex()).toBe('#ffffff');
    expect(whiteComp2.toHex()).toBe('#2b2b2b');
    expect(whiteComp3.toHex()).toBe('#2b2b2b');

    const [lightGrayOrig, lightGrayComp2, lightGrayComp3] = new Color(
      '#d3d3d3',
    ).getSplitComplementaryColors(undefined);
    expect(lightGrayOrig.toHex()).toBe('#d3d3d3');
    expect(lightGrayComp2.toHex()).toBe('#474747');
    expect(lightGrayComp3.toHex()).toBe('#474747');

    const [grayOrig, grayComp2, grayComp3] = new Color('#808080').getSplitComplementaryColors({});
    expect(grayOrig.toHex()).toBe('#808080');
    expect(grayComp2.toHex()).toBe('#808080');
    expect(grayComp3.toHex()).toBe('#808080');

    const [darkGrayOrig, darkGrayComp2, darkGrayComp3] = new Color(
      '#333333',
    ).getSplitComplementaryColors(undefined);
    expect(darkGrayOrig.toHex()).toBe('#333333');
    expect(darkGrayComp2.toHex()).toBe('#b3b3b3');
    expect(darkGrayComp3.toHex()).toBe('#b3b3b3');
  });

  it('handles grayscale color modes', () => {
    const spin = new Color('#000000')
      .getSplitComplementaryColors({
        grayscaleHandlingMode: 'SPIN_LIGHTNESS',
      })
      .map((c) => c.toHex());
    expect(spin).toEqual(['#000000', '#d4d4d4', '#d4d4d4']);

    const ignore = new Color('#000000')
      .getSplitComplementaryColors({
        grayscaleHandlingMode: 'IGNORE',
      })
      .map((c) => c.toHex());
    expect(ignore).toEqual(['#000000', '#000000', '#000000']);
  });
});

describe('getTriadicHarmonyColors', () => {
  it('returns triadic harmony colors for primary colors', () => {
    const [redOrig, redTriad2, redTriad3] = new Color('#ff0000').getTriadicHarmonyColors({});
    expect(redOrig.toHex()).toBe('#ff0000');
    expect(redTriad2.toHex()).toBe('#0000ff');
    expect(redTriad3.toHex()).toBe('#00ff00');

    const [greenOrig, greenTriad2, greenTriad3] = new Color('#00ff00').getTriadicHarmonyColors(
      undefined,
    );
    expect(greenOrig.toHex()).toBe('#00ff00');
    expect(greenTriad2.toHex()).toBe('#ff0000');
    expect(greenTriad3.toHex()).toBe('#0000ff');

    const [blueOrig, blueTriad2, blueTriad3] = new Color('#0000ff').getTriadicHarmonyColors({});
    expect(blueOrig.toHex()).toBe('#0000ff');
    expect(blueTriad2.toHex()).toBe('#00ff00');
    expect(blueTriad3.toHex()).toBe('#ff0000');
  });

  it('returns triadic harmony colors for brand colors', () => {
    const [purpleOrig, purpleTriad2, purpleTriad3] = new Color('#ee6ffc').getTriadicHarmonyColors(
      undefined,
    );
    expect(purpleOrig.toHex()).toBe('#ee6ffc');
    expect(purpleTriad2.toHex()).toBe('#6ffcee');
    expect(purpleTriad3.toHex()).toBe('#fcee6f');

    const [brandBlueOrig, brandBlueTriad2, brandBlueTriad3] = new Color(
      '#2e3575',
    ).getTriadicHarmonyColors({});
    expect(brandBlueOrig.toHex()).toBe('#2e3575');
    expect(brandBlueTriad2.toHex()).toBe('#35752e');
    expect(brandBlueTriad3.toHex()).toBe('#752e35');

    const [yellowOrig, yellowTriad2, yellowTriad3] = new Color('#d3e204').getTriadicHarmonyColors(
      undefined,
    );
    expect(yellowOrig.toHex()).toBe('#d3e204');
    expect(yellowTriad2.toHex()).toBe('#e204d3');
    expect(yellowTriad3.toHex()).toBe('#04d3e2');

    const [greenOrig, greenTriad2, greenTriad3] = new Color('#29cc53').getTriadicHarmonyColors({});
    expect(greenOrig.toHex()).toBe('#29cc53');
    expect(greenTriad2.toHex()).toBe('#cc5329');
    expect(greenTriad3.toHex()).toBe('#5329cc');

    const [pinkOrig, pinkTriad2, pinkTriad3] = new Color('#811242').getTriadicHarmonyColors(
      undefined,
    );
    expect(pinkOrig.toHex()).toBe('#811242');
    expect(pinkTriad2.toHex()).toBe('#124281');
    expect(pinkTriad3.toHex()).toBe('#428112');

    const [brandRedOrig, brandRedTriad2, brandRedTriad3] = new Color(
      '#de0d14',
    ).getTriadicHarmonyColors({});
    expect(brandRedOrig.toHex()).toBe('#de0d14');
    expect(brandRedTriad2.toHex()).toBe('#0d14de');
    expect(brandRedTriad3.toHex()).toBe('#14de0d');
  });

  it('returns triadic harmony colors for grayscale colors', () => {
    const [blackOrig, blackTriad2, blackTriad3] = new Color('#000000').getTriadicHarmonyColors(
      undefined,
    );
    expect(blackOrig.toHex()).toBe('#000000');
    expect(blackTriad2.toHex()).toBe('#ababab');
    expect(blackTriad3.toHex()).toBe('#ababab');

    const [whiteOrig, whiteTriad2, whiteTriad3] = new Color('#ffffff').getTriadicHarmonyColors({});
    expect(whiteOrig.toHex()).toBe('#ffffff');
    expect(whiteTriad2.toHex()).toBe('#545454');
    expect(whiteTriad3.toHex()).toBe('#545454');

    const [lightGrayOrig, lightGrayTriad2, lightGrayTriad3] = new Color(
      '#d3d3d3',
    ).getTriadicHarmonyColors(undefined);
    expect(lightGrayOrig.toHex()).toBe('#d3d3d3');
    expect(lightGrayTriad2.toHex()).toBe('#636363');
    expect(lightGrayTriad3.toHex()).toBe('#636363');

    const [grayOrig, grayTriad2, grayTriad3] = new Color('#808080').getTriadicHarmonyColors({});
    expect(grayOrig.toHex()).toBe('#808080');
    expect(grayTriad2.toHex()).toBe('#808080');
    expect(grayTriad3.toHex()).toBe('#808080');

    const [darkGrayOrig, darkGrayTriad2, darkGrayTriad3] = new Color(
      '#333333',
    ).getTriadicHarmonyColors(undefined);
    expect(darkGrayOrig.toHex()).toBe('#333333');
    expect(darkGrayTriad2.toHex()).toBe('#999999');
    expect(darkGrayTriad3.toHex()).toBe('#999999');
  });

  it('handles grayscale color modes', () => {
    const spin = new Color('#000000')
      .getTriadicHarmonyColors({
        grayscaleHandlingMode: 'SPIN_LIGHTNESS',
      })
      .map((c) => c.toHex());
    expect(spin).toEqual(['#000000', '#ababab', '#ababab']);

    const ignore = new Color('#000000')
      .getTriadicHarmonyColors({
        grayscaleHandlingMode: 'IGNORE',
      })
      .map((c) => c.toHex());
    expect(ignore).toEqual(['#000000', '#000000', '#000000']);
  });
});

describe('getSquareHarmonyColors', () => {
  it('returns square harmony colors for primary colors', () => {
    const [red1, red2, red3, red4] = new Color('#ff0000').getSquareHarmonyColors({});
    expect(red1.toHex()).toBe('#ff0000');
    expect(red2.toHex()).toBe('#80ff00');
    expect(red3.toHex()).toBe('#00ffff');
    expect(red4.toHex()).toBe('#8000ff');

    const [green1, green2, green3, green4] = new Color('#00ff00').getSquareHarmonyColors(undefined);
    expect(green1.toHex()).toBe('#00ff00');
    expect(green2.toHex()).toBe('#0080ff');
    expect(green3.toHex()).toBe('#ff00ff');
    expect(green4.toHex()).toBe('#ff8000');

    const [blue1, blue2, blue3, blue4] = new Color('#0000ff').getSquareHarmonyColors({});
    expect(blue1.toHex()).toBe('#0000ff');
    expect(blue2.toHex()).toBe('#ff0080');
    expect(blue3.toHex()).toBe('#ffff00');
    expect(blue4.toHex()).toBe('#00ff80');
  });

  it('returns square harmony colors for brand colors', () => {
    const [purple1, purple2, purple3, purple4] = new Color('#ee6ffc').getSquareHarmonyColors(
      undefined,
    );
    expect(purple1.toHex()).toBe('#ee6ffc');
    expect(purple2.toHex()).toBe('#fca76f');
    expect(purple3.toHex()).toBe('#7dfc6f');
    expect(purple4.toHex()).toBe('#6fc4fc');

    const [brandBlue1, brandBlue2, brandBlue3, brandBlue4] = new Color(
      '#2e3575',
    ).getSquareHarmonyColors({});
    expect(brandBlue1.toHex()).toBe('#2e3575');
    expect(brandBlue2.toHex()).toBe('#752e58');
    expect(brandBlue3.toHex()).toBe('#756e2e');
    expect(brandBlue4.toHex()).toBe('#2e754b');

    const [yellow1, yellow2, yellow3, yellow4] = new Color('#d3e204').getSquareHarmonyColors(
      undefined,
    );
    expect(yellow1.toHex()).toBe('#d3e204');
    expect(yellow2.toHex()).toBe('#04e282');
    expect(yellow3.toHex()).toBe('#1304e2');
    expect(yellow4.toHex()).toBe('#e20464');

    const [green1, green2b, green3b, green4b] = new Color('#29cc53').getSquareHarmonyColors({});
    expect(green1.toHex()).toBe('#29cc53');
    expect(green2b.toHex()).toBe('#2950cc');
    expect(green3b.toHex()).toBe('#cc29a2');
    expect(green4b.toHex()).toBe('#cca429');

    const [pink1, pink2, pink3, pink4] = new Color('#811242').getSquareHarmonyColors(undefined);
    expect(pink1.toHex()).toBe('#811242');
    expect(pink2.toHex()).toBe('#7a8112');
    expect(pink3.toHex()).toBe('#128151');
    expect(pink4.toHex()).toBe('#1a1281');

    const [brandRed1, brandRed2, brandRed3, brandRed4] = new Color(
      '#de0d14',
    ).getSquareHarmonyColors({});
    expect(brandRed1.toHex()).toBe('#de0d14');
    expect(brandRed2.toHex()).toBe('#7cde0d');
    expect(brandRed3.toHex()).toBe('#0dded7');
    expect(brandRed4.toHex()).toBe('#6f0dde');
  });

  it('returns square harmony colors for grayscale colors', () => {
    const [black1, black2, black3, black4] = new Color('#000000').getSquareHarmonyColors(undefined);
    expect(black1.toHex()).toBe('#000000');
    expect(black2.toHex()).toBe('#808080');
    expect(black3.toHex()).toBe('#ffffff');
    expect(black4.toHex()).toBe('#808080');

    const [white1, white2, white3, white4] = new Color('#ffffff').getSquareHarmonyColors({});
    expect(white1.toHex()).toBe('#ffffff');
    expect(white2.toHex()).toBe('#808080');
    expect(white3.toHex()).toBe('#000000');
    expect(white4.toHex()).toBe('#808080');

    const [lightGray1, lightGray2, lightGray3, lightGray4] = new Color(
      '#d3d3d3',
    ).getSquareHarmonyColors(undefined);
    expect(lightGray1.toHex()).toBe('#d3d3d3');
    expect(lightGray2.toHex()).toBe('#808080');
    expect(lightGray3.toHex()).toBe('#2b2b2b');
    expect(lightGray4.toHex()).toBe('#808080');

    const [gray1, gray2, gray3, gray4] = new Color('#808080').getSquareHarmonyColors({});
    expect(gray1.toHex()).toBe('#808080');
    expect(gray2.toHex()).toBe('#808080');
    expect(gray3.toHex()).toBe('#808080');
    expect(gray4.toHex()).toBe('#808080');

    const [darkGray1, darkGray2, darkGray3, darkGray4] = new Color(
      '#333333',
    ).getSquareHarmonyColors(undefined);
    expect(darkGray1.toHex()).toBe('#333333');
    expect(darkGray2.toHex()).toBe('#808080');
    expect(darkGray3.toHex()).toBe('#cccccc');
    expect(darkGray4.toHex()).toBe('#808080');
  });

  it('handles grayscale color modes', () => {
    const spin = new Color('#000000')
      .getSquareHarmonyColors({
        grayscaleHandlingMode: 'SPIN_LIGHTNESS',
      })
      .map((c) => c.toHex());
    expect(spin).toEqual(['#000000', '#808080', '#ffffff', '#808080']);

    const ignore = new Color('#000000')
      .getSquareHarmonyColors({
        grayscaleHandlingMode: 'IGNORE',
      })
      .map((c) => c.toHex());
    expect(ignore).toEqual(['#000000', '#000000', '#000000', '#000000']);
  });
});

describe('getTetradicHarmonyColors', () => {
  it('supports direction option for hue rotation order', () => {
    const clockwise = new Color('#ff0000')
      .getTetradicHarmonyColors({
        direction: 'CLOCKWISE',
      })
      .map((c) => c.toHex());
    expect(clockwise).toEqual(['#ff0000', '#ffff00', '#00ffff', '#0000ff']);

    const counterclockwise = new Color('#ff0000')
      .getTetradicHarmonyColors({
        direction: 'COUNTERCLOCKWISE',
      })
      .map((c) => c.toHex());
    expect(counterclockwise).toEqual(['#ff0000', '#ff00ff', '#00ffff', '#00ff00']);
  });

  it('accepts case-insensitive direction values', () => {
    const clockwiseMixedCase = new Color('#ff0000')
      .getTetradicHarmonyColors({
        direction: 'clockwise',
      })
      .map((c) => c.toHex());
    expect(clockwiseMixedCase).toEqual(['#ff0000', '#ffff00', '#00ffff', '#0000ff']);

    const counterclockwiseMixedCase = new Color('#ff0000')
      .getTetradicHarmonyColors({
        direction: 'counterclockwise',
      })
      .map((c) => c.toHex());
    expect(counterclockwiseMixedCase).toEqual(['#ff0000', '#ff00ff', '#00ffff', '#00ff00']);
  });

  it('returns tetradic harmony colors for primary colors', () => {
    const [red1, red2, red3, red4] = new Color('#ff0000').getTetradicHarmonyColors({});
    expect(red1.toHex()).toBe('#ff0000');
    expect(red2.toHex()).toBe('#ffff00');
    expect(red3.toHex()).toBe('#00ffff');
    expect(red4.toHex()).toBe('#0000ff');

    const [green1, green2, green3, green4] = new Color('#00ff00').getTetradicHarmonyColors(
      undefined,
    );
    expect(green1.toHex()).toBe('#00ff00');
    expect(green2.toHex()).toBe('#00ffff');
    expect(green3.toHex()).toBe('#ff00ff');
    expect(green4.toHex()).toBe('#ff0000');

    const [blue1, blue2, blue3, blue4] = new Color('#0000ff').getTetradicHarmonyColors({});
    expect(blue1.toHex()).toBe('#0000ff');
    expect(blue2.toHex()).toBe('#ff00ff');
    expect(blue3.toHex()).toBe('#ffff00');
    expect(blue4.toHex()).toBe('#00ff00');
  });

  it('returns tetradic harmony colors for brand colors', () => {
    const [purple1, purple2, purple3, purple4] = new Color('#ee6ffc').getTetradicHarmonyColors(
      undefined,
    );
    expect(purple1.toHex()).toBe('#ee6ffc');
    expect(purple2.toHex()).toBe('#fc6f7d');
    expect(purple3.toHex()).toBe('#7dfc6f');
    expect(purple4.toHex()).toBe('#6ffcee');

    const [brandBlue1, brandBlue2, brandBlue3, brandBlue4] = new Color(
      '#2e3575',
    ).getTetradicHarmonyColors({});
    expect(brandBlue1.toHex()).toBe('#2e3575');
    expect(brandBlue2.toHex()).toBe('#6e2e75');
    expect(brandBlue3.toHex()).toBe('#756e2e');
    expect(brandBlue4.toHex()).toBe('#35752e');

    const [yellow1, yellow2, yellow3, yellow4] = new Color('#d3e204').getTetradicHarmonyColors(
      undefined,
    );
    expect(yellow1.toHex()).toBe('#d3e204');
    expect(yellow2.toHex()).toBe('#04e213');
    expect(yellow3.toHex()).toBe('#1304e2');
    expect(yellow4.toHex()).toBe('#e204d3');

    const [green1b, green2b, green3b, green4b] = new Color('#29cc53').getTetradicHarmonyColors({});
    expect(green1b.toHex()).toBe('#29cc53');
    expect(green2b.toHex()).toBe('#29a2cc');
    expect(green3b.toHex()).toBe('#cc29a2');
    expect(green4b.toHex()).toBe('#cc5329');

    const [pink1, pink2, pink3, pink4] = new Color('#811242').getTetradicHarmonyColors(undefined);
    expect(pink1.toHex()).toBe('#811242');
    expect(pink2.toHex()).toBe('#815112');
    expect(pink3.toHex()).toBe('#128151');
    expect(pink4.toHex()).toBe('#124281');

    const [brandRed1, brandRed2, brandRed3, brandRed4] = new Color(
      '#de0d14',
    ).getTetradicHarmonyColors({});
    expect(brandRed1.toHex()).toBe('#de0d14');
    expect(brandRed2.toHex()).toBe('#ded70d');
    expect(brandRed3.toHex()).toBe('#0dded7');
    expect(brandRed4.toHex()).toBe('#0d14de');
  });

  it('returns tetradic harmony colors for grayscale colors', () => {
    const [black1, black2, black3, black4] = new Color('#000000').getTetradicHarmonyColors(
      undefined,
    );
    expect(black1.toHex()).toBe('#000000');
    expect(black2.toHex()).toBe('#545454');
    expect(black3.toHex()).toBe('#ffffff');
    expect(black4.toHex()).toBe('#ababab');

    const [white1, white2, white3, white4] = new Color('#ffffff').getTetradicHarmonyColors({});
    expect(white1.toHex()).toBe('#ffffff');
    expect(white2.toHex()).toBe('#ababab');
    expect(white3.toHex()).toBe('#000000');
    expect(white4.toHex()).toBe('#545454');

    const [lightGray1, lightGray2, lightGray3, lightGray4] = new Color(
      '#d3d3d3',
    ).getTetradicHarmonyColors(undefined);
    expect(lightGray1.toHex()).toBe('#d3d3d3');
    expect(lightGray2.toHex()).toBe('#9c9c9c');
    expect(lightGray3.toHex()).toBe('#2b2b2b');
    expect(lightGray4.toHex()).toBe('#636363');

    const [gray1, gray2, gray3, gray4] = new Color('#808080').getTetradicHarmonyColors({});
    expect(gray1.toHex()).toBe('#808080');
    expect(gray2.toHex()).toBe('#808080');
    expect(gray3.toHex()).toBe('#808080');
    expect(gray4.toHex()).toBe('#808080');

    const [darkGray1, darkGray2, darkGray3, darkGray4] = new Color(
      '#333333',
    ).getTetradicHarmonyColors(undefined);
    expect(darkGray1.toHex()).toBe('#333333');
    expect(darkGray2.toHex()).toBe('#666666');
    expect(darkGray3.toHex()).toBe('#cccccc');
    expect(darkGray4.toHex()).toBe('#999999');
  });

  it('handles grayscale color modes', () => {
    const spin = new Color('#000000')
      .getTetradicHarmonyColors({
        grayscaleHandlingMode: 'SPIN_LIGHTNESS',
      })
      .map((c) => c.toHex());
    expect(spin).toEqual(['#000000', '#545454', '#ffffff', '#ababab']);

    const ignore = new Color('#000000')
      .getTetradicHarmonyColors({
        grayscaleHandlingMode: 'IGNORE',
      })
      .map((c) => c.toHex());
    expect(ignore).toEqual(['#000000', '#000000', '#000000', '#000000']);
  });
});

describe('getAnalogousHarmonyColors', () => {
  it('returns analogous harmony colors for primary colors', () => {
    const [red1, red2, red3, red4, red5] = new Color('#ff0000').getAnalogousHarmonyColors({});
    expect(red1.toHex()).toBe('#ff0000');
    expect(red2.toHex()).toBe('#ff0080');
    expect(red3.toHex()).toBe('#ff8000');
    expect(red4.toHex()).toBe('#ff00ff');
    expect(red5.toHex()).toBe('#ffff00');

    const [green1, green2, green3, green4, green5] = new Color('#00ff00').getAnalogousHarmonyColors(
      undefined,
    );
    expect(green1.toHex()).toBe('#00ff00');
    expect(green2.toHex()).toBe('#80ff00');
    expect(green3.toHex()).toBe('#00ff80');
    expect(green4.toHex()).toBe('#ffff00');
    expect(green5.toHex()).toBe('#00ffff');

    const [blue1, blue2, blue3, blue4, blue5] = new Color('#0000ff').getAnalogousHarmonyColors({});
    expect(blue1.toHex()).toBe('#0000ff');
    expect(blue2.toHex()).toBe('#0080ff');
    expect(blue3.toHex()).toBe('#8000ff');
    expect(blue4.toHex()).toBe('#00ffff');
    expect(blue5.toHex()).toBe('#ff00ff');
  });

  it('returns analogous harmony colors for brand colors', () => {
    const [purple1, purple2, purple3, purple4, purple5] = new Color(
      '#ee6ffc',
    ).getAnalogousHarmonyColors(undefined);
    expect(purple1.toHex()).toBe('#ee6ffc');
    expect(purple2.toHex()).toBe('#a76ffc');
    expect(purple3.toHex()).toBe('#fc6fc4');
    expect(purple4.toHex()).toBe('#6f7dfc');
    expect(purple5.toHex()).toBe('#fc6f7d');

    const [brandBlue1, brandBlue2, brandBlue3, brandBlue4, brandBlue5] = new Color(
      '#2e3575',
    ).getAnalogousHarmonyColors({});
    expect(brandBlue1.toHex()).toBe('#2e3575');
    expect(brandBlue2.toHex()).toBe('#2e5875');
    expect(brandBlue3.toHex()).toBe('#4b2e75');
    expect(brandBlue4.toHex()).toBe('#2e756e');
    expect(brandBlue5.toHex()).toBe('#6e2e75');

    const [yellow1, yellow2, yellow3, yellow4, yellow5] = new Color(
      '#d3e204',
    ).getAnalogousHarmonyColors(undefined);
    expect(yellow1.toHex()).toBe('#d3e204');
    expect(yellow2.toHex()).toBe('#e28204');
    expect(yellow3.toHex()).toBe('#64e204');
    expect(yellow4.toHex()).toBe('#e21304');
    expect(yellow5.toHex()).toBe('#04e213');

    const [green1b, green2b, green3b, green4b, green5b] = new Color(
      '#29cc53',
    ).getAnalogousHarmonyColors({});
    expect(green1b.toHex()).toBe('#29cc53');
    expect(green2b.toHex()).toBe('#51cc29');
    expect(green3b.toHex()).toBe('#29cca4');
    expect(green4b.toHex()).toBe('#a2cc29');
    expect(green5b.toHex()).toBe('#29a2cc');

    const [pink1, pink2, pink3, pink4, pink5] = new Color('#811242').getAnalogousHarmonyColors(
      undefined,
    );
    expect(pink1.toHex()).toBe('#811242');
    expect(pink2.toHex()).toBe('#81127a');
    expect(pink3.toHex()).toBe('#811a12');
    expect(pink4.toHex()).toBe('#511281');
    expect(pink5.toHex()).toBe('#815112');

    const [brandRed1, brandRed2, brandRed3, brandRed4, brandRed5] = new Color(
      '#de0d14',
    ).getAnalogousHarmonyColors({});
    expect(brandRed1.toHex()).toBe('#de0d14');
    expect(brandRed2.toHex()).toBe('#de0d7c');
    expect(brandRed3.toHex()).toBe('#de6f0d');
    expect(brandRed4.toHex()).toBe('#d70dde');
    expect(brandRed5.toHex()).toBe('#ded70d');
  });

  it('returns analogous harmony colors for grayscale colors', () => {
    const [black1, black2, black3, black4, black5] = new Color('#000000').getAnalogousHarmonyColors(
      undefined,
    );
    expect(black1.toHex()).toBe('#000000');
    expect(black2.toHex()).toBe('#2b2b2b');
    expect(black3.toHex()).toBe('#2b2b2b');
    expect(black4.toHex()).toBe('#545454');
    expect(black5.toHex()).toBe('#545454');

    const [white1, white2, white3, white4, white5] = new Color('#ffffff').getAnalogousHarmonyColors(
      {},
    );
    expect(white1.toHex()).toBe('#ffffff');
    expect(white2.toHex()).toBe('#d4d4d4');
    expect(white3.toHex()).toBe('#d4d4d4');
    expect(white4.toHex()).toBe('#ababab');
    expect(white5.toHex()).toBe('#ababab');

    const [lightGray1, lightGray2, lightGray3, lightGray4, lightGray5] = new Color(
      '#d3d3d3',
    ).getAnalogousHarmonyColors(undefined);
    expect(lightGray1.toHex()).toBe('#d3d3d3');
    expect(lightGray2.toHex()).toBe('#b8b8b8');
    expect(lightGray3.toHex()).toBe('#b8b8b8');
    expect(lightGray4.toHex()).toBe('#9c9c9c');
    expect(lightGray5.toHex()).toBe('#9c9c9c');

    const [gray1, gray2, gray3, gray4, gray5] = new Color('#808080').getAnalogousHarmonyColors({});
    expect(gray1.toHex()).toBe('#808080');
    expect(gray2.toHex()).toBe('#808080');
    expect(gray3.toHex()).toBe('#808080');
    expect(gray4.toHex()).toBe('#808080');
    expect(gray5.toHex()).toBe('#808080');

    const [darkGray1, darkGray2, darkGray3, darkGray4, darkGray5] = new Color(
      '#333333',
    ).getAnalogousHarmonyColors(undefined);
    expect(darkGray1.toHex()).toBe('#333333');
    expect(darkGray2.toHex()).toBe('#4d4d4d');
    expect(darkGray3.toHex()).toBe('#4d4d4d');
    expect(darkGray4.toHex()).toBe('#666666');
    expect(darkGray5.toHex()).toBe('#666666');
  });

  it('handles grayscale color modes', () => {
    const spin = new Color('#000000')
      .getAnalogousHarmonyColors({
        grayscaleHandlingMode: 'SPIN_LIGHTNESS',
      })
      .map((c) => c.toHex());
    expect(spin).toEqual(['#000000', '#2b2b2b', '#2b2b2b', '#545454', '#545454']);

    const ignore = new Color('#000000')
      .getAnalogousHarmonyColors({
        grayscaleHandlingMode: 'IGNORE',
      })
      .map((c) => c.toHex());
    expect(ignore).toEqual(['#000000', '#000000', '#000000', '#000000', '#000000']);
  });
});

describe('getMonochromaticHarmonyColors', () => {
  it('returns monochromatic harmony colors', () => {
    const start = new Color({ h: 210, s: 60, l: 50 });
    const [base, lighter, darker, saturated, desaturated] = start.getMonochromaticHarmonyColors();
    const [baseHsl, lighterHsl, darkerHsl, saturatedHsl, desaturatedHsl] = [
      base.toHSL(),
      lighter.toHSL(),
      darker.toHSL(),
      saturated.toHSL(),
      desaturated.toHSL(),
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
    const [base, lighter, darker, saturated, desaturated] = new Color({
      h: 10,
      s: 5,
      l: 95,
    }).getMonochromaticHarmonyColors();
    const [baseHsl, lighterHsl, darkerHsl, saturatedHsl, desaturatedHsl] = [
      base.toHSL(),
      lighter.toHSL(),
      darker.toHSL(),
      saturated.toHSL(),
      desaturated.toHSL(),
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
    const [redOrig, red2, red3, red4, red5] = new Color('#ff0000').getMonochromaticHarmonyColors();
    expect(redOrig.toHex()).toBe('#ff0000');
    expect(red2.toHex()).toBe('#ff6666');
    expect(red3.toHex()).toBe('#990000');
    expect(red4.toHex()).toBe('#ff0000');
    expect(red5.toHex()).toBe('#e61919');

    const [greenOrig, green2, green3, green4, green5] = new Color(
      '#00ff00',
    ).getMonochromaticHarmonyColors();
    expect(greenOrig.toHex()).toBe('#00ff00');
    expect(green2.toHex()).toBe('#66ff66');
    expect(green3.toHex()).toBe('#009900');
    expect(green4.toHex()).toBe('#00ff00');
    expect(green5.toHex()).toBe('#19e619');

    const [blueOrig, blue2, blue3, blue4, blue5] = new Color(
      '#0000ff',
    ).getMonochromaticHarmonyColors();
    expect(blueOrig.toHex()).toBe('#0000ff');
    expect(blue2.toHex()).toBe('#6666ff');
    expect(blue3.toHex()).toBe('#000099');
    expect(blue4.toHex()).toBe('#0000ff');
    expect(blue5.toHex()).toBe('#1919e6');

    const [purpleOrig, purple2, purple3, purple4, purple5] = new Color(
      '#ee6ffc',
    ).getMonochromaticHarmonyColors();
    expect(purpleOrig.toHex()).toBe('#ee6ffc');
    expect(purple2.toHex()).toBe('#fad3fe');
    expect(purple3.toHex()).toBe('#e20bfa');
    expect(purple4.toHex()).toBe('#f06cff');
    expect(purple5.toHex()).toBe('#e27eed');

    const [brandBlueOrig, brandBlue2, brandBlue3, brandBlue4, brandBlue5] = new Color(
      '#2e3575',
    ).getMonochromaticHarmonyColors();
    expect(brandBlueOrig.toHex()).toBe('#2e3575');
    expect(brandBlue2.toHex()).toBe('#4f5aba');
    expect(brandBlue3.toHex()).toBe('#11142c');
    expect(brandBlue4.toHex()).toBe('#1e2885');
    expect(brandBlue5.toHex()).toBe('#3e4265');

    const [yellowOrig, yellow2, yellow3, yellow4, yellow5] = new Color(
      '#d3e204',
    ).getMonochromaticHarmonyColors();
    expect(yellowOrig.toHex()).toBe('#d3e204');
    expect(yellow2.toHex()).toBe('#f0fc50');
    expect(yellow3.toHex()).toBe('#757e02');
    expect(yellow4.toHex()).toBe('#d6e600');
    expect(yellow5.toHex()).toBe('#bfcb1b');

    const [brandGreenOrig, brandGreen2, brandGreen3, brandGreen4, brandGreen5] = new Color(
      '#29cc53',
    ).getMonochromaticHarmonyColors();
    expect(brandGreenOrig.toHex()).toBe('#29cc53');
    expect(brandGreen2.toHex()).toBe('#77e493');
    expect(brandGreen3.toHex()).toBe('#187730');
    expect(brandGreen4.toHex()).toBe('#10e547');
    expect(brandGreen5.toHex()).toBe('#42b45f');

    const [pinkOrig, pink2, pink3, pink4, pink5] = new Color(
      '#811242',
    ).getMonochromaticHarmonyColors();
    expect(pinkOrig.toHex()).toBe('#811242');
    expect(pink2.toHex()).toBe('#db1e70');
    expect(pink3.toHex()).toBe('#270614');
    expect(pink4.toHex()).toBe('#900340');
    expect(pink5.toHex()).toBe('#722144');

    const [brandRedOrig, brandRed2, brandRed3, brandRed4, brandRed5] = new Color(
      '#de0d14',
    ).getMonochromaticHarmonyColors();
    expect(brandRedOrig.toHex()).toBe('#de0d14');
    expect(brandRed2.toHex()).toBe('#f55c61');
    expect(brandRed3.toHex()).toBe('#7e070b');
    expect(brandRed4.toHex()).toBe('#eb0008');
    expect(brandRed5.toHex()).toBe('#c6252a');

    const [blackOrig, black2, black3, black4, black5] = new Color(
      '#000000',
    ).getMonochromaticHarmonyColors();
    expect(blackOrig.toHex()).toBe('#000000');
    expect(black2.toHex()).toBe('#333333');
    expect(black3.toHex()).toBe('#000000');
    expect(black4.toHex()).toBe('#000000');
    expect(black5.toHex()).toBe('#000000');

    const [whiteOrig, white2, white3, white4, white5] = new Color(
      '#ffffff',
    ).getMonochromaticHarmonyColors();
    expect(whiteOrig.toHex()).toBe('#ffffff');
    expect(white2.toHex()).toBe('#ffffff');
    expect(white3.toHex()).toBe('#cccccc');
    expect(white4.toHex()).toBe('#ffffff');
    expect(white5.toHex()).toBe('#ffffff');

    const [lightGrayOrig, lightGray2, lightGray3, lightGray4, lightGray5] = new Color(
      '#d3d3d3',
    ).getMonochromaticHarmonyColors();
    expect(lightGrayOrig.toHex()).toBe('#d3d3d3');
    expect(lightGray2.toHex()).toBe('#ffffff');
    expect(lightGray3.toHex()).toBe('#a0a0a0');
    expect(lightGray4.toHex()).toBe('#dccaca');
    expect(lightGray5.toHex()).toBe('#d3d3d3');

    const [grayOrig, gray2, gray3, gray4, gray5] = new Color(
      '#808080',
    ).getMonochromaticHarmonyColors();
    expect(grayOrig.toHex()).toBe('#808080');
    expect(gray2.toHex()).toBe('#b3b3b3');
    expect(gray3.toHex()).toBe('#4d4d4d');
    expect(gray4.toHex()).toBe('#996767');
    expect(gray5.toHex()).toBe('#808080');

    const [darkGrayOrig, darkGray2, darkGray3, darkGray4, darkGray5] = new Color(
      '#333333',
    ).getMonochromaticHarmonyColors();
    expect(darkGrayOrig.toHex()).toBe('#333333');
    expect(darkGray2.toHex()).toBe('#666666');
    expect(darkGray3.toHex()).toBe('#000000');
    expect(darkGray4.toHex()).toBe('#3d2929');
    expect(darkGray5.toHex()).toBe('#333333');
  });

  it('keeps alpha across monochromatic variants', () => {
    const [base, lighter, darker, saturated, desaturated] = new Color(
      'rgba(20, 40, 60, 0.25)',
    ).getMonochromaticHarmonyColors();

    expect(base.toRGBA().a).toBeCloseTo(0.25, 5);
    expect(lighter.toRGBA().a).toBeCloseTo(0.25, 5);
    expect(darker.toRGBA().a).toBeCloseTo(0.25, 5);
    expect(saturated.toRGBA().a).toBeCloseTo(0.25, 5);
    expect(desaturated.toRGBA().a).toBeCloseTo(0.25, 5);
  });
});

describe('getHarmonyColors', () => {
  it('delegates to individual harmony functions', () => {
    expect(
      new Color('#ff0000').getHarmonyColors('COMPLEMENTARY', {}).map((c) => c.toHex()),
    ).toEqual(['#ff0000', '#00ffff']);

    expect(
      new Color('#ff0000').getHarmonyColors('SPLIT_COMPLEMENTARY', undefined).map((c) => c.toHex()),
    ).toEqual(['#ff0000', '#0080ff', '#00ff80']);

    expect(new Color('#ff0000').getHarmonyColors('TRIADIC', {}).map((c) => c.toHex())).toEqual([
      '#ff0000',
      '#0000ff',
      '#00ff00',
    ]);

    expect(
      new Color('#ff0000').getHarmonyColors('SQUARE', undefined).map((c) => c.toHex()),
    ).toEqual(['#ff0000', '#80ff00', '#00ffff', '#8000ff']);

    expect(new Color('#ff0000').getHarmonyColors('TETRADIC', {}).map((c) => c.toHex())).toEqual([
      '#ff0000',
      '#ffff00',
      '#00ffff',
      '#0000ff',
    ]);

    expect(
      new Color('#ff0000').getHarmonyColors('ANALOGOUS', undefined).map((c) => c.toHex()),
    ).toEqual(['#ff0000', '#ff0080', '#ff8000', '#ff00ff', '#ffff00']);

    expect(
      new Color('#ff0000').getHarmonyColors('MONOCHROMATIC', {}).map((c) => c.toHex()),
    ).toEqual(['#ff0000', '#ff6666', '#990000', '#ff0000', '#e61919']);
  });

  it('accepts mixed case harmony', () => {
    const c = new Color('red');
    const h1 = c.getHarmonyColors('TRIADIC', undefined);
    const h2 = c.getHarmonyColors('triadic', {});

    expect(h1.length).toBe(h2.length);
    expect(h1[1].toHex()).toBe(h2[1].toHex());
  });

  it('delegates for brand purple as well', () => {
    expect(
      new Color('#ee6ffc').getHarmonyColors('COMPLEMENTARY', undefined).map((c) => c.toHex()),
    ).toEqual(['#ee6ffc', '#7dfc6f']);

    expect(
      new Color('#ee6ffc').getHarmonyColors('SPLIT_COMPLEMENTARY', {}).map((c) => c.toHex()),
    ).toEqual(['#ee6ffc', '#6ffca7', '#c4fc6f']);

    expect(
      new Color('#ee6ffc').getHarmonyColors('TRIADIC', undefined).map((c) => c.toHex()),
    ).toEqual(['#ee6ffc', '#6ffcee', '#fcee6f']);

    expect(new Color('#ee6ffc').getHarmonyColors('SQUARE', {}).map((c) => c.toHex())).toEqual([
      '#ee6ffc',
      '#fca76f',
      '#7dfc6f',
      '#6fc4fc',
    ]);

    expect(
      new Color('#ee6ffc').getHarmonyColors('TETRADIC', undefined).map((c) => c.toHex()),
    ).toEqual(['#ee6ffc', '#fc6f7d', '#7dfc6f', '#6ffcee']);

    expect(new Color('#ee6ffc').getHarmonyColors('ANALOGOUS', {}).map((c) => c.toHex())).toEqual([
      '#ee6ffc',
      '#a76ffc',
      '#fc6fc4',
      '#6f7dfc',
      '#fc6f7d',
    ]);

    expect(
      new Color('#ee6ffc').getHarmonyColors('MONOCHROMATIC', undefined).map((c) => c.toHex()),
    ).toEqual(['#ee6ffc', '#fad3fe', '#e20bfa', '#f06cff', '#e27eed']);
  });

  it('throws for unknown harmony type', () => {
    expect(() => new Color('#ff0000').getHarmonyColors('unknown' as ColorHarmony, {})).toThrow(
      "Invalid 'harmony'",
    );
  });

  it('throws for invalid grayscale handling mode', () => {
    expect(() =>
      new Color('#808080').getComplementaryColors({
        grayscaleHandlingMode: 'unknown' as never,
      }),
    ).toThrow("Invalid 'grayscaleHandlingMode'");
  });
});
