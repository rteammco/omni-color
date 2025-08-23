import { Color } from '../color';
import {
  ColorHarmony,
  getAnalogousHarmonyColors,
  getComplementaryColors,
  getHarmonyColors,
  getMonochromaticHarmonyColors,
  getSplitComplementaryColors,
  getSquareHarmonyColors,
  getTetradicHarmonyColors,
  getTriadicHarmonyColors,
  GrayscaleHandlingMode,
} from '../harmonies';

describe('getComplementaryColors', () => {
  it('returns complementary pairs for primary colors', () => {
    const [redOrig, redComp] = getComplementaryColors(new Color('#ff0000'));
    expect(redOrig.toHex()).toBe('#ff0000');
    expect(redComp.toHex()).toBe('#00ffff');

    const [greenOrig, greenComp] = getComplementaryColors(new Color('#00ff00'));
    expect(greenOrig.toHex()).toBe('#00ff00');
    expect(greenComp.toHex()).toBe('#ff00ff');

    const [blueOrig, blueComp] = getComplementaryColors(new Color('#0000ff'));
    expect(blueOrig.toHex()).toBe('#0000ff');
    expect(blueComp.toHex()).toBe('#ffff00');
  });

  it('returns complementary pairs for brand colors', () => {
    const [purpleOrig, purpleComp] = getComplementaryColors(new Color('#ee6ffc'));
    expect(purpleOrig.toHex()).toBe('#ee6ffc');
    expect(purpleComp.toHex()).toBe('#7cfc6e');

    const [blueOrig, blueComp] = getComplementaryColors(new Color('#2e3575'));
    expect(blueOrig.toHex()).toBe('#2e3575');
    expect(blueComp.toHex()).toBe('#766e2e');

    const [yellowOrig, yellowComp] = getComplementaryColors(new Color('#d3e204'));
    expect(yellowOrig.toHex()).toBe('#d3e204');
    expect(yellowComp.toHex()).toBe('#1203e2');

    const [greenOrig, greenComp] = getComplementaryColors(new Color('#29cc53'));
    expect(greenOrig.toHex()).toBe('#29cc53');
    expect(greenComp.toHex()).toBe('#cc28a3');

    const [pinkOrig, pinkComp] = getComplementaryColors(new Color('#811242'));
    expect(pinkOrig.toHex()).toBe('#811242');
    expect(pinkComp.toHex()).toBe('#128251');

    const [brandRedOrig, brandRedComp] = getComplementaryColors(new Color('#de0d14'));
    expect(brandRedOrig.toHex()).toBe('#de0d14');
    expect(brandRedComp.toHex()).toBe('#0dded7');
  });

  it('returns complementary pairs for grayscale colors', () => {
    const [blackOrig, blackComp] = getComplementaryColors(new Color('#000000'));
    expect(blackOrig.toHex()).toBe('#000000');
    expect(blackComp.toHex()).toBe('#ffffff');

    const [whiteOrig, whiteComp] = getComplementaryColors(new Color('#ffffff'));
    expect(whiteOrig.toHex()).toBe('#ffffff');
    expect(whiteComp.toHex()).toBe('#000000');

    const [lightGrayOrig, lightGrayComp] = getComplementaryColors(new Color('#d3d3d3'));
    expect(lightGrayOrig.toHex()).toBe('#d3d3d3');
    expect(lightGrayComp.toHex()).toBe('#2b2b2b');

    const [grayOrig, grayComp] = getComplementaryColors(new Color('#808080'));
    expect(grayOrig.toHex()).toBe('#808080');
    expect(grayComp.toHex()).toBe('#808080');

    const [darkGrayOrig, darkGrayComp] = getComplementaryColors(new Color('#333333'));
    expect(darkGrayOrig.toHex()).toBe('#333333');
    expect(darkGrayComp.toHex()).toBe('#cccccc');
  });

  it('handles grayscale color modes', () => {
    const spin = getComplementaryColors(
      new Color('#000000'),
      GrayscaleHandlingMode.SPIN_LIGHTNESS
    ).map((c) => c.toHex());
    expect(spin).toEqual(['#000000', '#ffffff']);

    const ignore = getComplementaryColors(new Color('#000000'), GrayscaleHandlingMode.IGNORE).map(
      (c) => c.toHex()
    );
    expect(ignore).toEqual(['#000000', '#000000']);
  });
});

describe('getSplitComplementaryColors', () => {
  it('returns split complement colors for primary colors', () => {
    const [redOrig, redComp2, redComp3] = getSplitComplementaryColors(new Color('#ff0000'));
    expect(redOrig.toHex()).toBe('#ff0000');
    expect(redComp2.toHex()).toBe('#0080ff');
    expect(redComp3.toHex()).toBe('#00ff80');

    const [greenOrig, greenComp2, greenComp3] = getSplitComplementaryColors(new Color('#00ff00'));
    expect(greenOrig.toHex()).toBe('#00ff00');
    expect(greenComp2.toHex()).toBe('#ff0080');
    expect(greenComp3.toHex()).toBe('#8000ff');

    const [blueOrig, blueComp2, blueComp3] = getSplitComplementaryColors(new Color('#0000ff'));
    expect(blueOrig.toHex()).toBe('#0000ff');
    expect(blueComp2.toHex()).toBe('#80ff00');
    expect(blueComp3.toHex()).toBe('#ff8000');
  });

  it('returns split complement colors for brand colors', () => {
    const [purpleOrig, purpleComp2, purpleComp3] = getSplitComplementaryColors(
      new Color('#ee6ffc')
    );
    expect(purpleOrig.toHex()).toBe('#ee6ffc');
    expect(purpleComp2.toHex()).toBe('#6efca7');
    expect(purpleComp3.toHex()).toBe('#c3fc6e');

    const [brandBlueOrig, brandBlueComp2, brandBlueComp3] = getSplitComplementaryColors(
      new Color('#2e3575')
    );
    expect(brandBlueOrig.toHex()).toBe('#2e3575');
    expect(brandBlueComp2.toHex()).toBe('#59762e');
    expect(brandBlueComp3.toHex()).toBe('#764a2e');

    const [yellowOrig, yellowComp2, yellowComp3] = getSplitComplementaryColors(
      new Color('#d3e204')
    );
    expect(yellowOrig.toHex()).toBe('#d3e204');
    expect(yellowComp2.toHex()).toBe('#8203e2');
    expect(yellowComp3.toHex()).toBe('#0364e2');

    const [greenOrig, greenComp2, greenComp3] = getSplitComplementaryColors(new Color('#29cc53'));
    expect(greenOrig.toHex()).toBe('#29cc53');
    expect(greenComp2.toHex()).toBe('#cc2851');
    expect(greenComp3.toHex()).toBe('#a328cc');

    const [pinkOrig, pinkComp2, pinkComp3] = getSplitComplementaryColors(new Color('#811242'));
    expect(pinkOrig.toHex()).toBe('#811242');
    expect(pinkComp2.toHex()).toBe('#127b82');
    expect(pinkComp3.toHex()).toBe('#128219');

    const [brandRedOrig, brandRedComp2, brandRedComp3] = getSplitComplementaryColors(
      new Color('#de0d14')
    );
    expect(brandRedOrig.toHex()).toBe('#de0d14');
    expect(brandRedComp2.toHex()).toBe('#0d7cde');
    expect(brandRedComp3.toHex()).toBe('#0dde6e');
  });

  it('returns split complement colors for grayscale colors', () => {
    const [blackOrig, blackComp2, blackComp3] = getSplitComplementaryColors(new Color('#000000'));
    expect(blackOrig.toHex()).toBe('#000000');
    expect(blackComp2.toHex()).toBe('#d4d4d4');
    expect(blackComp3.toHex()).toBe('#d4d4d4');

    const [whiteOrig, whiteComp2, whiteComp3] = getSplitComplementaryColors(new Color('#ffffff'));
    expect(whiteOrig.toHex()).toBe('#ffffff');
    expect(whiteComp2.toHex()).toBe('#2b2b2b');
    expect(whiteComp3.toHex()).toBe('#2b2b2b');

    const [lightGrayOrig, lightGrayComp2, lightGrayComp3] = getSplitComplementaryColors(
      new Color('#d3d3d3')
    );
    expect(lightGrayOrig.toHex()).toBe('#d3d3d3');
    expect(lightGrayComp2.toHex()).toBe('#474747');
    expect(lightGrayComp3.toHex()).toBe('#474747');

    const [grayOrig, grayComp2, grayComp3] = getSplitComplementaryColors(new Color('#808080'));
    expect(grayOrig.toHex()).toBe('#808080');
    expect(grayComp2.toHex()).toBe('#808080');
    expect(grayComp3.toHex()).toBe('#808080');

    const [darkGrayOrig, darkGrayComp2, darkGrayComp3] = getSplitComplementaryColors(
      new Color('#333333')
    );
    expect(darkGrayOrig.toHex()).toBe('#333333');
    expect(darkGrayComp2.toHex()).toBe('#b3b3b3');
    expect(darkGrayComp3.toHex()).toBe('#b3b3b3');
  });

  it('handles grayscale color modes', () => {
    const spin = getSplitComplementaryColors(
      new Color('#000000'),
      GrayscaleHandlingMode.SPIN_LIGHTNESS
    ).map((c) => c.toHex());
    expect(spin).toEqual(['#000000', '#d4d4d4', '#d4d4d4']);

    const ignore = getSplitComplementaryColors(
      new Color('#000000'),
      GrayscaleHandlingMode.IGNORE
    ).map((c) => c.toHex());
    expect(ignore).toEqual(['#000000', '#000000', '#000000']);
  });
});

describe('getTriadicHarmonyColors', () => {
  it('returns triadic harmony colors for primary colors', () => {
    const [redOrig, redTriad2, redTriad3] = getTriadicHarmonyColors(new Color('#ff0000'));
    expect(redOrig.toHex()).toBe('#ff0000');
    expect(redTriad2.toHex()).toBe('#0000ff');
    expect(redTriad3.toHex()).toBe('#00ff00');

    const [greenOrig, greenTriad2, greenTriad3] = getTriadicHarmonyColors(new Color('#00ff00'));
    expect(greenOrig.toHex()).toBe('#00ff00');
    expect(greenTriad2.toHex()).toBe('#ff0000');
    expect(greenTriad3.toHex()).toBe('#0000ff');

    const [blueOrig, blueTriad2, blueTriad3] = getTriadicHarmonyColors(new Color('#0000ff'));
    expect(blueOrig.toHex()).toBe('#0000ff');
    expect(blueTriad2.toHex()).toBe('#00ff00');
    expect(blueTriad3.toHex()).toBe('#ff0000');
  });

  it('returns triadic harmony colors for brand colors', () => {
    const [purpleOrig, purpleTriad2, purpleTriad3] = getTriadicHarmonyColors(new Color('#ee6ffc'));
    expect(purpleOrig.toHex()).toBe('#ee6ffc');
    expect(purpleTriad2.toHex()).toBe('#6efcee');
    expect(purpleTriad3.toHex()).toBe('#fcee6e');

    const [brandBlueOrig, brandBlueTriad2, brandBlueTriad3] = getTriadicHarmonyColors(
      new Color('#2e3575')
    );
    expect(brandBlueOrig.toHex()).toBe('#2e3575');
    expect(brandBlueTriad2.toHex()).toBe('#35762e');
    expect(brandBlueTriad3.toHex()).toBe('#762e35');

    const [yellowOrig, yellowTriad2, yellowTriad3] = getTriadicHarmonyColors(new Color('#d3e204'));
    expect(yellowOrig.toHex()).toBe('#d3e204');
    expect(yellowTriad2.toHex()).toBe('#e203d3');
    expect(yellowTriad3.toHex()).toBe('#03d3e2');

    const [greenOrig, greenTriad2, greenTriad3] = getTriadicHarmonyColors(new Color('#29cc53'));
    expect(greenOrig.toHex()).toBe('#29cc53');
    expect(greenTriad2.toHex()).toBe('#cc5128');
    expect(greenTriad3.toHex()).toBe('#5128cc');

    const [pinkOrig, pinkTriad2, pinkTriad3] = getTriadicHarmonyColors(new Color('#811242'));
    expect(pinkOrig.toHex()).toBe('#811242');
    expect(pinkTriad2.toHex()).toBe('#124282');
    expect(pinkTriad3.toHex()).toBe('#428212');

    const [brandRedOrig, brandRedTriad2, brandRedTriad3] = getTriadicHarmonyColors(
      new Color('#de0d14')
    );
    expect(brandRedOrig.toHex()).toBe('#de0d14');
    expect(brandRedTriad2.toHex()).toBe('#0d14de');
    expect(brandRedTriad3.toHex()).toBe('#14de0d');
  });

  it('returns triadic harmony colors for grayscale colors', () => {
    const [blackOrig, blackTriad2, blackTriad3] = getTriadicHarmonyColors(new Color('#000000'));
    expect(blackOrig.toHex()).toBe('#000000');
    expect(blackTriad2.toHex()).toBe('#ababab');
    expect(blackTriad3.toHex()).toBe('#ababab');

    const [whiteOrig, whiteTriad2, whiteTriad3] = getTriadicHarmonyColors(new Color('#ffffff'));
    expect(whiteOrig.toHex()).toBe('#ffffff');
    expect(whiteTriad2.toHex()).toBe('#545454');
    expect(whiteTriad3.toHex()).toBe('#545454');

    const [lightGrayOrig, lightGrayTriad2, lightGrayTriad3] = getTriadicHarmonyColors(
      new Color('#d3d3d3')
    );
    expect(lightGrayOrig.toHex()).toBe('#d3d3d3');
    expect(lightGrayTriad2.toHex()).toBe('#636363');
    expect(lightGrayTriad3.toHex()).toBe('#636363');

    const [grayOrig, grayTriad2, grayTriad3] = getTriadicHarmonyColors(new Color('#808080'));
    expect(grayOrig.toHex()).toBe('#808080');
    expect(grayTriad2.toHex()).toBe('#808080');
    expect(grayTriad3.toHex()).toBe('#808080');

    const [darkGrayOrig, darkGrayTriad2, darkGrayTriad3] = getTriadicHarmonyColors(
      new Color('#333333')
    );
    expect(darkGrayOrig.toHex()).toBe('#333333');
    expect(darkGrayTriad2.toHex()).toBe('#999999');
    expect(darkGrayTriad3.toHex()).toBe('#999999');
  });

  it('handles grayscale color modes', () => {
    const spin = getTriadicHarmonyColors(
      new Color('#000000'),
      GrayscaleHandlingMode.SPIN_LIGHTNESS
    ).map((c) => c.toHex());
    expect(spin).toEqual(['#000000', '#ababab', '#ababab']);

    const ignore = getTriadicHarmonyColors(new Color('#000000'), GrayscaleHandlingMode.IGNORE).map(
      (c) => c.toHex()
    );
    expect(ignore).toEqual(['#000000', '#000000', '#000000']);
  });
});

describe('getSquareHarmonyColors', () => {
  it('returns square harmony colors for primary colors', () => {
    const [red1, red2, red3, red4] = getSquareHarmonyColors(new Color('#ff0000'));
    expect(red1.toHex()).toBe('#ff0000');
    expect(red2.toHex()).toBe('#80ff00');
    expect(red3.toHex()).toBe('#00ffff');
    expect(red4.toHex()).toBe('#8000ff');

    const [green1, green2, green3, green4] = getSquareHarmonyColors(new Color('#00ff00'));
    expect(green1.toHex()).toBe('#00ff00');
    expect(green2.toHex()).toBe('#0080ff');
    expect(green3.toHex()).toBe('#ff00ff');
    expect(green4.toHex()).toBe('#ff8000');

    const [blue1, blue2, blue3, blue4] = getSquareHarmonyColors(new Color('#0000ff'));
    expect(blue1.toHex()).toBe('#0000ff');
    expect(blue2.toHex()).toBe('#ff0080');
    expect(blue3.toHex()).toBe('#ffff00');
    expect(blue4.toHex()).toBe('#00ff80');
  });

  it('returns square harmony colors for brand colors', () => {
    const [purple1, purple2, purple3, purple4] = getSquareHarmonyColors(new Color('#ee6ffc'));
    expect(purple1.toHex()).toBe('#ee6ffc');
    expect(purple2.toHex()).toBe('#fca76e');
    expect(purple3.toHex()).toBe('#7cfc6e');
    expect(purple4.toHex()).toBe('#6ec3fc');

    const [brandBlue1, brandBlue2, brandBlue3, brandBlue4] = getSquareHarmonyColors(
      new Color('#2e3575')
    );
    expect(brandBlue1.toHex()).toBe('#2e3575');
    expect(brandBlue2.toHex()).toBe('#762e59');
    expect(brandBlue3.toHex()).toBe('#766e2e');
    expect(brandBlue4.toHex()).toBe('#2e764a');

    const [yellow1, yellow2, yellow3, yellow4] = getSquareHarmonyColors(new Color('#d3e204'));
    expect(yellow1.toHex()).toBe('#d3e204');
    expect(yellow2.toHex()).toBe('#03e282');
    expect(yellow3.toHex()).toBe('#1203e2');
    expect(yellow4.toHex()).toBe('#e20364');

    const [green1, green2b, green3b, green4b] = getSquareHarmonyColors(new Color('#29cc53'));
    expect(green1.toHex()).toBe('#29cc53');
    expect(green2b.toHex()).toBe('#2851cc');
    expect(green3b.toHex()).toBe('#cc28a3');
    expect(green4b.toHex()).toBe('#cca328');

    const [pink1, pink2, pink3, pink4] = getSquareHarmonyColors(new Color('#811242'));
    expect(pink1.toHex()).toBe('#811242');
    expect(pink2.toHex()).toBe('#7b8212');
    expect(pink3.toHex()).toBe('#128251');
    expect(pink4.toHex()).toBe('#191282');

    const [brandRed1, brandRed2, brandRed3, brandRed4] = getSquareHarmonyColors(
      new Color('#de0d14')
    );
    expect(brandRed1.toHex()).toBe('#de0d14');
    expect(brandRed2.toHex()).toBe('#7cde0d');
    expect(brandRed3.toHex()).toBe('#0dded7');
    expect(brandRed4.toHex()).toBe('#6e0dde');
  });

  it('returns square harmony colors for grayscale colors', () => {
    const [black1, black2, black3, black4] = getSquareHarmonyColors(new Color('#000000'));
    expect(black1.toHex()).toBe('#000000');
    expect(black2.toHex()).toBe('#808080');
    expect(black3.toHex()).toBe('#ffffff');
    expect(black4.toHex()).toBe('#808080');

    const [white1, white2, white3, white4] = getSquareHarmonyColors(new Color('#ffffff'));
    expect(white1.toHex()).toBe('#ffffff');
    expect(white2.toHex()).toBe('#808080');
    expect(white3.toHex()).toBe('#000000');
    expect(white4.toHex()).toBe('#808080');

    const [lightGray1, lightGray2, lightGray3, lightGray4] = getSquareHarmonyColors(
      new Color('#d3d3d3')
    );
    expect(lightGray1.toHex()).toBe('#d3d3d3');
    expect(lightGray2.toHex()).toBe('#808080');
    expect(lightGray3.toHex()).toBe('#2b2b2b');
    expect(lightGray4.toHex()).toBe('#808080');

    const [gray1, gray2, gray3, gray4] = getSquareHarmonyColors(new Color('#808080'));
    expect(gray1.toHex()).toBe('#808080');
    expect(gray2.toHex()).toBe('#808080');
    expect(gray3.toHex()).toBe('#808080');
    expect(gray4.toHex()).toBe('#808080');

    const [darkGray1, darkGray2, darkGray3, darkGray4] = getSquareHarmonyColors(
      new Color('#333333')
    );
    expect(darkGray1.toHex()).toBe('#333333');
    expect(darkGray2.toHex()).toBe('#808080');
    expect(darkGray3.toHex()).toBe('#cccccc');
    expect(darkGray4.toHex()).toBe('#808080');
  });

  it('handles grayscale color modes', () => {
    const spin = getSquareHarmonyColors(
      new Color('#000000'),
      GrayscaleHandlingMode.SPIN_LIGHTNESS
    ).map((c) => c.toHex());
    expect(spin).toEqual(['#000000', '#808080', '#ffffff', '#808080']);

    const ignore = getSquareHarmonyColors(new Color('#000000'), GrayscaleHandlingMode.IGNORE).map(
      (c) => c.toHex()
    );
    expect(ignore).toEqual(['#000000', '#000000', '#000000', '#000000']);
  });
});

describe('getTetradicHarmonyColors', () => {
  it('returns tetradic harmony colors for primary colors', () => {
    const [red1, red2, red3, red4] = getTetradicHarmonyColors(new Color('#ff0000'));
    expect(red1.toHex()).toBe('#ff0000');
    expect(red2.toHex()).toBe('#ffff00');
    expect(red3.toHex()).toBe('#00ffff');
    expect(red4.toHex()).toBe('#0000ff');

    const [green1, green2, green3, green4] = getTetradicHarmonyColors(new Color('#00ff00'));
    expect(green1.toHex()).toBe('#00ff00');
    expect(green2.toHex()).toBe('#00ffff');
    expect(green3.toHex()).toBe('#ff00ff');
    expect(green4.toHex()).toBe('#ff0000');

    const [blue1, blue2, blue3, blue4] = getTetradicHarmonyColors(new Color('#0000ff'));
    expect(blue1.toHex()).toBe('#0000ff');
    expect(blue2.toHex()).toBe('#ff00ff');
    expect(blue3.toHex()).toBe('#ffff00');
    expect(blue4.toHex()).toBe('#00ff00');
  });

  it('returns tetradic harmony colors for brand colors', () => {
    const [purple1, purple2, purple3, purple4] = getTetradicHarmonyColors(new Color('#ee6ffc'));
    expect(purple1.toHex()).toBe('#ee6ffc');
    expect(purple2.toHex()).toBe('#fc6e7c');
    expect(purple3.toHex()).toBe('#7cfc6e');
    expect(purple4.toHex()).toBe('#6efcee');

    const [brandBlue1, brandBlue2, brandBlue3, brandBlue4] = getTetradicHarmonyColors(
      new Color('#2e3575')
    );
    expect(brandBlue1.toHex()).toBe('#2e3575');
    expect(brandBlue2.toHex()).toBe('#6e2e76');
    expect(brandBlue3.toHex()).toBe('#766e2e');
    expect(brandBlue4.toHex()).toBe('#35762e');

    const [yellow1, yellow2, yellow3, yellow4] = getTetradicHarmonyColors(new Color('#d3e204'));
    expect(yellow1.toHex()).toBe('#d3e204');
    expect(yellow2.toHex()).toBe('#03e212');
    expect(yellow3.toHex()).toBe('#1203e2');
    expect(yellow4.toHex()).toBe('#e203d3');

    const [green1b, green2b, green3b, green4b] = getTetradicHarmonyColors(new Color('#29cc53'));
    expect(green1b.toHex()).toBe('#29cc53');
    expect(green2b.toHex()).toBe('#28a3cc');
    expect(green3b.toHex()).toBe('#cc28a3');
    expect(green4b.toHex()).toBe('#cc5128');

    const [pink1, pink2, pink3, pink4] = getTetradicHarmonyColors(new Color('#811242'));
    expect(pink1.toHex()).toBe('#811242');
    expect(pink2.toHex()).toBe('#825112');
    expect(pink3.toHex()).toBe('#128251');
    expect(pink4.toHex()).toBe('#124282');

    const [brandRed1, brandRed2, brandRed3, brandRed4] = getTetradicHarmonyColors(
      new Color('#de0d14')
    );
    expect(brandRed1.toHex()).toBe('#de0d14');
    expect(brandRed2.toHex()).toBe('#ded70d');
    expect(brandRed3.toHex()).toBe('#0dded7');
    expect(brandRed4.toHex()).toBe('#0d14de');
  });

  it('returns tetradic harmony colors for grayscale colors', () => {
    const [black1, black2, black3, black4] = getTetradicHarmonyColors(new Color('#000000'));
    expect(black1.toHex()).toBe('#000000');
    expect(black2.toHex()).toBe('#545454');
    expect(black3.toHex()).toBe('#ffffff');
    expect(black4.toHex()).toBe('#ababab');

    const [white1, white2, white3, white4] = getTetradicHarmonyColors(new Color('#ffffff'));
    expect(white1.toHex()).toBe('#ffffff');
    expect(white2.toHex()).toBe('#ababab');
    expect(white3.toHex()).toBe('#000000');
    expect(white4.toHex()).toBe('#545454');

    const [lightGray1, lightGray2, lightGray3, lightGray4] = getTetradicHarmonyColors(
      new Color('#d3d3d3')
    );
    expect(lightGray1.toHex()).toBe('#d3d3d3');
    expect(lightGray2.toHex()).toBe('#9c9c9c');
    expect(lightGray3.toHex()).toBe('#2b2b2b');
    expect(lightGray4.toHex()).toBe('#636363');

    const [gray1, gray2, gray3, gray4] = getTetradicHarmonyColors(new Color('#808080'));
    expect(gray1.toHex()).toBe('#808080');
    expect(gray2.toHex()).toBe('#808080');
    expect(gray3.toHex()).toBe('#808080');
    expect(gray4.toHex()).toBe('#808080');

    const [darkGray1, darkGray2, darkGray3, darkGray4] = getTetradicHarmonyColors(
      new Color('#333333')
    );
    expect(darkGray1.toHex()).toBe('#333333');
    expect(darkGray2.toHex()).toBe('#666666');
    expect(darkGray3.toHex()).toBe('#cccccc');
    expect(darkGray4.toHex()).toBe('#999999');
  });

  it('handles grayscale color modes', () => {
    const spin = getTetradicHarmonyColors(
      new Color('#000000'),
      GrayscaleHandlingMode.SPIN_LIGHTNESS
    ).map((c) => c.toHex());
    expect(spin).toEqual(['#000000', '#545454', '#ffffff', '#ababab']);

    const ignore = getTetradicHarmonyColors(new Color('#000000'), GrayscaleHandlingMode.IGNORE).map(
      (c) => c.toHex()
    );
    expect(ignore).toEqual(['#000000', '#000000', '#000000', '#000000']);
  });
});

describe('getAnalogousHarmonyColors', () => {
  it('returns analogous harmony colors for primary colors', () => {
    const [red1, red2, red3, red4, red5] = getAnalogousHarmonyColors(new Color('#ff0000'));
    expect(red1.toHex()).toBe('#ff0000');
    expect(red2.toHex()).toBe('#ff0080');
    expect(red3.toHex()).toBe('#ff8000');
    expect(red4.toHex()).toBe('#ff00ff');
    expect(red5.toHex()).toBe('#ffff00');

    const [green1, green2, green3, green4, green5] = getAnalogousHarmonyColors(
      new Color('#00ff00')
    );
    expect(green1.toHex()).toBe('#00ff00');
    expect(green2.toHex()).toBe('#80ff00');
    expect(green3.toHex()).toBe('#00ff80');
    expect(green4.toHex()).toBe('#ffff00');
    expect(green5.toHex()).toBe('#00ffff');

    const [blue1, blue2, blue3, blue4, blue5] = getAnalogousHarmonyColors(new Color('#0000ff'));
    expect(blue1.toHex()).toBe('#0000ff');
    expect(blue2.toHex()).toBe('#0080ff');
    expect(blue3.toHex()).toBe('#8000ff');
    expect(blue4.toHex()).toBe('#00ffff');
    expect(blue5.toHex()).toBe('#ff00ff');
  });

  it('returns analogous harmony colors for brand colors', () => {
    const [purple1, purple2, purple3, purple4, purple5] = getAnalogousHarmonyColors(
      new Color('#ee6ffc')
    );
    expect(purple1.toHex()).toBe('#ee6ffc');
    expect(purple2.toHex()).toBe('#a76efc');
    expect(purple3.toHex()).toBe('#fc6ec3');
    expect(purple4.toHex()).toBe('#6e7cfc');
    expect(purple5.toHex()).toBe('#fc6e7c');

    const [brandBlue1, brandBlue2, brandBlue3, brandBlue4, brandBlue5] = getAnalogousHarmonyColors(
      new Color('#2e3575')
    );
    expect(brandBlue1.toHex()).toBe('#2e3575');
    expect(brandBlue2.toHex()).toBe('#2e5976');
    expect(brandBlue3.toHex()).toBe('#4a2e76');
    expect(brandBlue4.toHex()).toBe('#2e766e');
    expect(brandBlue5.toHex()).toBe('#6e2e76');

    const [yellow1, yellow2, yellow3, yellow4, yellow5] = getAnalogousHarmonyColors(
      new Color('#d3e204')
    );
    expect(yellow1.toHex()).toBe('#d3e204');
    expect(yellow2.toHex()).toBe('#e28203');
    expect(yellow3.toHex()).toBe('#64e203');
    expect(yellow4.toHex()).toBe('#e21203');
    expect(yellow5.toHex()).toBe('#03e212');

    const [green1b, green2b, green3b, green4b, green5b] = getAnalogousHarmonyColors(
      new Color('#29cc53')
    );
    expect(green1b.toHex()).toBe('#29cc53');
    expect(green2b.toHex()).toBe('#51cc28');
    expect(green3b.toHex()).toBe('#28cca3');
    expect(green4b.toHex()).toBe('#a3cc28');
    expect(green5b.toHex()).toBe('#28a3cc');

    const [pink1, pink2, pink3, pink4, pink5] = getAnalogousHarmonyColors(new Color('#811242'));
    expect(pink1.toHex()).toBe('#811242');
    expect(pink2.toHex()).toBe('#82127b');
    expect(pink3.toHex()).toBe('#821912');
    expect(pink4.toHex()).toBe('#511282');
    expect(pink5.toHex()).toBe('#825112');

    const [brandRed1, brandRed2, brandRed3, brandRed4, brandRed5] = getAnalogousHarmonyColors(
      new Color('#de0d14')
    );
    expect(brandRed1.toHex()).toBe('#de0d14');
    expect(brandRed2.toHex()).toBe('#de0d7c');
    expect(brandRed3.toHex()).toBe('#de6e0d');
    expect(brandRed4.toHex()).toBe('#d70dde');
    expect(brandRed5.toHex()).toBe('#ded70d');
  });

  it('returns analogous harmony colors for grayscale colors', () => {
    const [black1, black2, black3, black4, black5] = getAnalogousHarmonyColors(
      new Color('#000000')
    );
    expect(black1.toHex()).toBe('#000000');
    expect(black2.toHex()).toBe('#2b2b2b');
    expect(black3.toHex()).toBe('#2b2b2b');
    expect(black4.toHex()).toBe('#545454');
    expect(black5.toHex()).toBe('#545454');

    const [white1, white2, white3, white4, white5] = getAnalogousHarmonyColors(
      new Color('#ffffff')
    );
    expect(white1.toHex()).toBe('#ffffff');
    expect(white2.toHex()).toBe('#d4d4d4');
    expect(white3.toHex()).toBe('#d4d4d4');
    expect(white4.toHex()).toBe('#ababab');
    expect(white5.toHex()).toBe('#ababab');

    const [lightGray1, lightGray2, lightGray3, lightGray4, lightGray5] = getAnalogousHarmonyColors(
      new Color('#d3d3d3')
    );
    expect(lightGray1.toHex()).toBe('#d3d3d3');
    expect(lightGray2.toHex()).toBe('#b8b8b8');
    expect(lightGray3.toHex()).toBe('#b8b8b8');
    expect(lightGray4.toHex()).toBe('#9c9c9c');
    expect(lightGray5.toHex()).toBe('#9c9c9c');

    const [gray1, gray2, gray3, gray4, gray5] = getAnalogousHarmonyColors(new Color('#808080'));
    expect(gray1.toHex()).toBe('#808080');
    expect(gray2.toHex()).toBe('#808080');
    expect(gray3.toHex()).toBe('#808080');
    expect(gray4.toHex()).toBe('#808080');
    expect(gray5.toHex()).toBe('#808080');

    const [darkGray1, darkGray2, darkGray3, darkGray4, darkGray5] = getAnalogousHarmonyColors(
      new Color('#333333')
    );
    expect(darkGray1.toHex()).toBe('#333333');
    expect(darkGray2.toHex()).toBe('#4d4d4d');
    expect(darkGray3.toHex()).toBe('#4d4d4d');
    expect(darkGray4.toHex()).toBe('#666666');
    expect(darkGray5.toHex()).toBe('#666666');
  });

  it('handles grayscale color modes', () => {
    const spin = getAnalogousHarmonyColors(
      new Color('#000000'),
      GrayscaleHandlingMode.SPIN_LIGHTNESS
    ).map((c) => c.toHex());
    expect(spin).toEqual(['#000000', '#2b2b2b', '#2b2b2b', '#545454', '#545454']);

    const ignore = getAnalogousHarmonyColors(
      new Color('#000000'),
      GrayscaleHandlingMode.IGNORE
    ).map((c) => c.toHex());
    expect(ignore).toEqual(['#000000', '#000000', '#000000', '#000000', '#000000']);
  });
});

describe('getMonochromaticHarmonyColors', () => {
  it('returns monochromatic harmony colors', () => {
    const start = new Color({ h: 210, s: 60, l: 50 });
    const [base, lighter, darker, saturated, desaturated] = getMonochromaticHarmonyColors(start);
    expect(base.toHSL()).toEqual({ h: 210, s: 60, l: 50 });
    expect(lighter.toHSL()).toEqual({ h: 210, s: 59, l: 70 });
    expect(darker.toHSL()).toEqual({ h: 210, s: 59, l: 30 });
    expect(saturated.toHSL()).toEqual({ h: 210, s: 80, l: 50 });
    expect(desaturated.toHSL()).toEqual({ h: 210, s: 40, l: 50 });
  });

  it('clamps saturation and lightness', () => {
    const [base, lighter, darker, saturated, desaturated] = getMonochromaticHarmonyColors(
      new Color({ h: 10, s: 5, l: 95 })
    );
    expect(base.toHSL()).toEqual({ h: 0, s: 4, l: 95 });
    expect(lighter.toHSL()).toEqual({ h: 0, s: 0, l: 100 });
    expect(darker.toHSL()).toEqual({ h: 0, s: 4, l: 75 });
    expect(saturated.toHSL()).toEqual({ h: 0, s: 23, l: 95 });
    expect(desaturated.toHSL()).toEqual({ h: 0, s: 0, l: 95 });
  });

  it('returns monochromatic harmony colors for diverse inputs', () => {
    const [redOrig, red2, red3, red4, red5] = getMonochromaticHarmonyColors(new Color('#ff0000'));
    expect(redOrig.toHex()).toBe('#ff0000');
    expect(red2.toHex()).toBe('#ff6666');
    expect(red3.toHex()).toBe('#990000');
    expect(red4.toHex()).toBe('#ff0000');
    expect(red5.toHex()).toBe('#e61919');

    const [greenOrig, green2, green3, green4, green5] = getMonochromaticHarmonyColors(
      new Color('#00ff00')
    );
    expect(greenOrig.toHex()).toBe('#00ff00');
    expect(green2.toHex()).toBe('#66ff66');
    expect(green3.toHex()).toBe('#009900');
    expect(green4.toHex()).toBe('#00ff00');
    expect(green5.toHex()).toBe('#19e619');

    const [blueOrig, blue2, blue3, blue4, blue5] = getMonochromaticHarmonyColors(
      new Color('#0000ff')
    );
    expect(blueOrig.toHex()).toBe('#0000ff');
    expect(blue2.toHex()).toBe('#6666ff');
    expect(blue3.toHex()).toBe('#000099');
    expect(blue4.toHex()).toBe('#0000ff');
    expect(blue5.toHex()).toBe('#1919e6');

    const [purpleOrig, purple2, purple3, purple4, purple5] = getMonochromaticHarmonyColors(
      new Color('#ee6ffc')
    );
    expect(purpleOrig.toHex()).toBe('#ee6ffc');
    expect(purple2.toHex()).toBe('#fad2fe');
    expect(purple3.toHex()).toBe('#e20afa');
    expect(purple4.toHex()).toBe('#f06bff');
    expect(purple5.toHex()).toBe('#e27ded');

    const [brandBlueOrig, brandBlue2, brandBlue3, brandBlue4, brandBlue5] =
      getMonochromaticHarmonyColors(new Color('#2e3575'));
    expect(brandBlueOrig.toHex()).toBe('#2e3575');
    expect(brandBlue2.toHex()).toBe('#4f5aba');
    expect(brandBlue3.toHex()).toBe('#11142c');
    expect(brandBlue4.toHex()).toBe('#1d2886');
    expect(brandBlue5.toHex()).toBe('#3e4265');

    const [yellowOrig, yellow2, yellow3, yellow4, yellow5] = getMonochromaticHarmonyColors(
      new Color('#d3e204')
    );
    expect(yellowOrig.toHex()).toBe('#d3e204');
    expect(yellow2.toHex()).toBe('#f1fc4f');
    expect(yellow3.toHex()).toBe('#757e02');
    expect(yellow4.toHex()).toBe('#d6e600');
    expect(yellow5.toHex()).toBe('#bfcb1a');

    const [brandGreenOrig, brandGreen2, brandGreen3, brandGreen4, brandGreen5] =
      getMonochromaticHarmonyColors(new Color('#29cc53'));
    expect(brandGreenOrig.toHex()).toBe('#29cc53');
    expect(brandGreen2.toHex()).toBe('#77e492');
    expect(brandGreen3.toHex()).toBe('#18772f');
    expect(brandGreen4.toHex()).toBe('#10e545');
    expect(brandGreen5.toHex()).toBe('#41b45e');

    const [pinkOrig, pink2, pink3, pink4, pink5] = getMonochromaticHarmonyColors(
      new Color('#811242')
    );
    expect(pinkOrig.toHex()).toBe('#811242');
    expect(pink2.toHex()).toBe('#dc1e70');
    expect(pink3.toHex()).toBe('#280615');
    expect(pink4.toHex()).toBe('#910340');
    expect(pink5.toHex()).toBe('#732144');

    const [brandRedOrig, brandRed2, brandRed3, brandRed4, brandRed5] =
      getMonochromaticHarmonyColors(new Color('#de0d14'));
    expect(brandRedOrig.toHex()).toBe('#de0d14');
    expect(brandRed2.toHex()).toBe('#f55b60');
    expect(brandRed3.toHex()).toBe('#7d070b');
    expect(brandRed4.toHex()).toBe('#eb0008');
    expect(brandRed5.toHex()).toBe('#c6242a');

    const [blackOrig, black2, black3, black4, black5] = getMonochromaticHarmonyColors(
      new Color('#000000')
    );
    expect(blackOrig.toHex()).toBe('#000000');
    expect(black2.toHex()).toBe('#333333');
    expect(black3.toHex()).toBe('#000000');
    expect(black4.toHex()).toBe('#000000');
    expect(black5.toHex()).toBe('#000000');

    const [whiteOrig, white2, white3, white4, white5] = getMonochromaticHarmonyColors(
      new Color('#ffffff')
    );
    expect(whiteOrig.toHex()).toBe('#ffffff');
    expect(white2.toHex()).toBe('#ffffff');
    expect(white3.toHex()).toBe('#cccccc');
    expect(white4.toHex()).toBe('#ffffff');
    expect(white5.toHex()).toBe('#ffffff');

    const [lightGrayOrig, lightGray2, lightGray3, lightGray4, lightGray5] =
      getMonochromaticHarmonyColors(new Color('#d3d3d3'));
    expect(lightGrayOrig.toHex()).toBe('#d3d3d3');
    expect(lightGray2.toHex()).toBe('#ffffff');
    expect(lightGray3.toHex()).toBe('#a1a1a1');
    expect(lightGray4.toHex()).toBe('#dccbcb');
    expect(lightGray5.toHex()).toBe('#d4d4d4');

    const [grayOrig, gray2, gray3, gray4, gray5] = getMonochromaticHarmonyColors(
      new Color('#808080')
    );
    expect(grayOrig.toHex()).toBe('#808080');
    expect(gray2.toHex()).toBe('#b3b3b3');
    expect(gray3.toHex()).toBe('#4d4d4d');
    expect(gray4.toHex()).toBe('#996666');
    expect(gray5.toHex()).toBe('#808080');

    const [darkGrayOrig, darkGray2, darkGray3, darkGray4, darkGray5] =
      getMonochromaticHarmonyColors(new Color('#333333'));
    expect(darkGrayOrig.toHex()).toBe('#333333');
    expect(darkGray2.toHex()).toBe('#666666');
    expect(darkGray3.toHex()).toBe('#000000');
    expect(darkGray4.toHex()).toBe('#3d2929');
    expect(darkGray5.toHex()).toBe('#333333');
  });
});

describe('getHarmonyColors', () => {
  it('delegates to individual harmony functions', () => {
    expect(
      getHarmonyColors(new Color('#ff0000'), ColorHarmony.COMPLEMENTARY).map((c) => c.toHex())
    ).toEqual(['#ff0000', '#00ffff']);

    expect(
      getHarmonyColors(new Color('#ff0000'), ColorHarmony.SPLIT_COMPLEMENTARY).map((c) => c.toHex())
    ).toEqual(['#ff0000', '#0080ff', '#00ff80']);

    expect(
      getHarmonyColors(new Color('#ff0000'), ColorHarmony.TRIADIC).map((c) => c.toHex())
    ).toEqual(['#ff0000', '#0000ff', '#00ff00']);

    expect(
      getHarmonyColors(new Color('#ff0000'), ColorHarmony.SQUARE).map((c) => c.toHex())
    ).toEqual(['#ff0000', '#80ff00', '#00ffff', '#8000ff']);

    expect(
      getHarmonyColors(new Color('#ff0000'), ColorHarmony.TETRADIC).map((c) => c.toHex())
    ).toEqual(['#ff0000', '#ffff00', '#00ffff', '#0000ff']);

    expect(
      getHarmonyColors(new Color('#ff0000'), ColorHarmony.ANALOGOUS).map((c) => c.toHex())
    ).toEqual(['#ff0000', '#ff0080', '#ff8000', '#ff00ff', '#ffff00']);

    expect(
      getHarmonyColors(new Color('#ff0000'), ColorHarmony.MONOCHROMATIC).map((c) => c.toHex())
    ).toEqual(['#ff0000', '#ff6666', '#990000', '#ff0000', '#e61919']);
  });

  it('delegates for brand purple as well', () => {
    expect(
      getHarmonyColors(new Color('#ee6ffc'), ColorHarmony.COMPLEMENTARY).map((c) => c.toHex())
    ).toEqual(['#ee6ffc', '#7cfc6e']);

    expect(
      getHarmonyColors(new Color('#ee6ffc'), ColorHarmony.SPLIT_COMPLEMENTARY).map((c) => c.toHex())
    ).toEqual(['#ee6ffc', '#6efca7', '#c3fc6e']);

    expect(
      getHarmonyColors(new Color('#ee6ffc'), ColorHarmony.TRIADIC).map((c) => c.toHex())
    ).toEqual(['#ee6ffc', '#6efcee', '#fcee6e']);

    expect(
      getHarmonyColors(new Color('#ee6ffc'), ColorHarmony.SQUARE).map((c) => c.toHex())
    ).toEqual(['#ee6ffc', '#fca76e', '#7cfc6e', '#6ec3fc']);

    expect(
      getHarmonyColors(new Color('#ee6ffc'), ColorHarmony.TETRADIC).map((c) => c.toHex())
    ).toEqual(['#ee6ffc', '#fc6e7c', '#7cfc6e', '#6efcee']);

    expect(
      getHarmonyColors(new Color('#ee6ffc'), ColorHarmony.ANALOGOUS).map((c) => c.toHex())
    ).toEqual(['#ee6ffc', '#a76efc', '#fc6ec3', '#6e7cfc', '#fc6e7c']);

    expect(
      getHarmonyColors(new Color('#ee6ffc'), ColorHarmony.MONOCHROMATIC).map((c) => c.toHex())
    ).toEqual(['#ee6ffc', '#fad2fe', '#e20afa', '#f06bff', '#e27ded']);
  });

  it('throws for unknown harmony type', () => {
    expect(() => getHarmonyColors(new Color('#ff0000'), 'unknown' as ColorHarmony)).toThrow(
      '[getHarmonyColors] unknown color harmony: unknown'
    );
  });
});
