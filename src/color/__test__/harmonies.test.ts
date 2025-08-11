import { Color } from '../color';
import {
  getAnalogousHarmonyColors,
  getComplementaryColors,
  getMonochromaticHarmonyColors,
  getSplitComplementaryColors,
  getSquareHarmonyColors,
  getTetradicHarmonyColors,
  getTriadicHarmonyColors,
} from '../harmonies';

describe('color harmonies', () => {
  const red = new Color('#ff0000');
  const green = new Color('#00ff00');
  const blue = new Color('#0000ff');
  const brandPurple = new Color('#ee6ffc');
  const brandBlue = new Color('#2e3575');
  const brandYellow = new Color('#d3e204');
  const brandGreen = new Color('#29cc53');
  const brandPink = new Color('#811242');
  const brandRed = new Color('#de0d14');
  const black = new Color('#000000');
  const white = new Color('#ffffff');
  const lightGray = new Color('#d3d3d3');
  const gray = new Color('#808080');
  const darkGray = new Color('#333333');

  it('computes complementary colors', () => {
    const [redOrig, redComp] = getComplementaryColors(red);
    expect(redOrig.toHex()).toBe('#ff0000');
    expect(redComp.toHex()).toBe('#00ffff');

    const [greenOrig, greenComp] = getComplementaryColors(green);
    expect(greenOrig.toHex()).toBe('#00ff00');
    expect(greenComp.toHex()).toBe('#ff00ff');

    const [blueOrig, blueComp] = getComplementaryColors(blue);
    expect(blueOrig.toHex()).toBe('#0000ff');
    expect(blueComp.toHex()).toBe('#ffff00');

    const [brandPurpleOrig, brandPurpleComp] = getComplementaryColors(brandPurple);
    expect(brandPurpleOrig.toHex()).toBe('#ee6ffc');
    expect(brandPurpleComp.toHex()).toBe('#7cfc6e');

    const [brandBlueOrig, brandBlueComp] = getComplementaryColors(brandBlue);
    expect(brandBlueOrig.toHex()).toBe('#2e3575');
    expect(brandBlueComp.toHex()).toBe('#766e2e');

    const [brandYellowOrig, brandYellowComp] = getComplementaryColors(brandYellow);
    expect(brandYellowOrig.toHex()).toBe('#d3e204');
    expect(brandYellowComp.toHex()).toBe('#1203e2');

    const [brandGreenOrig, brandGreenComp] = getComplementaryColors(brandGreen);
    expect(brandGreenOrig.toHex()).toBe('#29cc53');
    expect(brandGreenComp.toHex()).toBe('#cc28a3');

    const [brandPinkOrig, brandPinkComp] = getComplementaryColors(brandPink);
    expect(brandPinkOrig.toHex()).toBe('#811242');
    expect(brandPinkComp.toHex()).toBe('#128251');

    const [brandRedOrig, brandRedComp] = getComplementaryColors(brandRed);
    expect(brandRedOrig.toHex()).toBe('#de0d14');
    expect(brandRedComp.toHex()).toBe('#0dded7');

    const [blackOrig, blackComp] = getComplementaryColors(black);
    expect(blackOrig.toHex()).toBe('#000000');
    expect(blackComp.toHex()).toBe('#000000');

    const [whiteOrig, whiteComp] = getComplementaryColors(white);
    expect(whiteOrig.toHex()).toBe('#ffffff');
    expect(whiteComp.toHex()).toBe('#ffffff');

    const [lightGrayOrig, lightGrayComp] = getComplementaryColors(lightGray);
    expect(lightGrayOrig.toHex()).toBe('#d3d3d3');
    expect(lightGrayComp.toHex()).toBe('#d4d4d4');

    const [grayOrig, grayComp] = getComplementaryColors(gray);
    expect(grayOrig.toHex()).toBe('#808080');
    expect(grayComp.toHex()).toBe('#808080');

    const [darkGrayOrig, darkGrayComp] = getComplementaryColors(darkGray);
    expect(darkGrayOrig.toHex()).toBe('#333333');
    expect(darkGrayComp.toHex()).toBe('#333333');
  });

  it('computes split complementary colors', () => {
    const [redOrig, redComp2, redComp3] = getSplitComplementaryColors(red);
    expect(redOrig.toHex()).toBe('#ff0000');
    expect(redComp2.toHex()).toBe('#0080ff');
    expect(redComp3.toHex()).toBe('#00ff80');

    const [greenOrig, greenComp2, greenComp3] = getSplitComplementaryColors(green);
    expect(greenOrig.toHex()).toBe('#00ff00');
    expect(greenComp2.toHex()).toBe('#ff0080');
    expect(greenComp3.toHex()).toBe('#8000ff');

    const [blueOrig, blueComp2, blueComp3] = getSplitComplementaryColors(blue);
    expect(blueOrig.toHex()).toBe('#0000ff');
    expect(blueComp2.toHex()).toBe('#80ff00');
    expect(blueComp3.toHex()).toBe('#ff8000');

    const [brandPurpleOrig, brandPurpleComp2, brandPurpleComp3] =
      getSplitComplementaryColors(brandPurple);
    expect(brandPurpleOrig.toHex()).toBe('#ee6ffc');
    expect(brandPurpleComp2.toHex()).toBe('#6efca7');
    expect(brandPurpleComp3.toHex()).toBe('#c3fc6e');

    const [brandBlueOrig, brandBlueComp2, brandBlueComp3] = getSplitComplementaryColors(brandBlue);
    expect(brandBlueOrig.toHex()).toBe('#2e3575');
    expect(brandBlueComp2.toHex()).toBe('#59762e');
    expect(brandBlueComp3.toHex()).toBe('#764a2e');

    const [brandYellowOrig, brandYellowComp2, brandYellowComp3] =
      getSplitComplementaryColors(brandYellow);
    expect(brandYellowOrig.toHex()).toBe('#d3e204');
    expect(brandYellowComp2.toHex()).toBe('#8203e2');
    expect(brandYellowComp3.toHex()).toBe('#0364e2');

    const [brandGreenOrig, brandGreenComp2, brandGreenComp3] =
      getSplitComplementaryColors(brandGreen);
    expect(brandGreenOrig.toHex()).toBe('#29cc53');
    expect(brandGreenComp2.toHex()).toBe('#cc2851');
    expect(brandGreenComp3.toHex()).toBe('#a328cc');

    const [brandPinkOrig, brandPinkComp2, brandPinkComp3] = getSplitComplementaryColors(brandPink);
    expect(brandPinkOrig.toHex()).toBe('#811242');
    expect(brandPinkComp2.toHex()).toBe('#127b82');
    expect(brandPinkComp3.toHex()).toBe('#128219');

    const [brandRedOrig, brandRedComp2, brandRedComp3] = getSplitComplementaryColors(brandRed);
    expect(brandRedOrig.toHex()).toBe('#de0d14');
    expect(brandRedComp2.toHex()).toBe('#0d7cde');
    expect(brandRedComp3.toHex()).toBe('#0dde6e');

    const [blackOrig, blackComp2, blackComp3] = getSplitComplementaryColors(black);
    expect(blackOrig.toHex()).toBe('#000000');
    expect(blackComp2.toHex()).toBe('#000000');
    expect(blackComp3.toHex()).toBe('#000000');

    const [whiteOrig, whiteComp2, whiteComp3] = getSplitComplementaryColors(white);
    expect(whiteOrig.toHex()).toBe('#ffffff');
    expect(whiteComp2.toHex()).toBe('#ffffff');
    expect(whiteComp3.toHex()).toBe('#ffffff');

    const [lightGrayOrig, lightGrayComp2, lightGrayComp3] = getSplitComplementaryColors(lightGray);
    expect(lightGrayOrig.toHex()).toBe('#d3d3d3');
    expect(lightGrayComp2.toHex()).toBe('#d4d4d4');
    expect(lightGrayComp3.toHex()).toBe('#d4d4d4');

    const [grayOrig, grayComp2, grayComp3] = getSplitComplementaryColors(gray);
    expect(grayOrig.toHex()).toBe('#808080');
    expect(grayComp2.toHex()).toBe('#808080');
    expect(grayComp3.toHex()).toBe('#808080');

    const [darkGrayOrig, darkGrayComp2, darkGrayComp3] = getSplitComplementaryColors(darkGray);
    expect(darkGrayOrig.toHex()).toBe('#333333');
    expect(darkGrayComp2.toHex()).toBe('#333333');
    expect(darkGrayComp3.toHex()).toBe('#333333');
  });

  it('computes triadic harmony colors', () => {
    const [redOrig, redTriad2, redTriad3] = getTriadicHarmonyColors(red);
    expect(redOrig.toHex()).toBe('#ff0000');
    expect(redTriad2.toHex()).toBe('#0000ff');
    expect(redTriad3.toHex()).toBe('#00ff00');

    const [greenOrig, greenTriad2, greenTriad3] = getTriadicHarmonyColors(green);
    expect(greenOrig.toHex()).toBe('#00ff00');
    expect(greenTriad2.toHex()).toBe('#ff0000');
    expect(greenTriad3.toHex()).toBe('#0000ff');

    const [blueOrig, blueTriad2, blueTriad3] = getTriadicHarmonyColors(blue);
    expect(blueOrig.toHex()).toBe('#0000ff');
    expect(blueTriad2.toHex()).toBe('#00ff00');
    expect(blueTriad3.toHex()).toBe('#ff0000');

    const [brandPurpleOrig, brandPurpleTriad2, brandPurpleTriad3] =
      getTriadicHarmonyColors(brandPurple);
    expect(brandPurpleOrig.toHex()).toBe('#ee6ffc');
    expect(brandPurpleTriad2.toHex()).toBe('#6efcee');
    expect(brandPurpleTriad3.toHex()).toBe('#fcee6e');

    const [brandBlueOrig, brandBlueTriad2, brandBlueTriad3] = getTriadicHarmonyColors(brandBlue);
    expect(brandBlueOrig.toHex()).toBe('#2e3575');
    expect(brandBlueTriad2.toHex()).toBe('#35762e');
    expect(brandBlueTriad3.toHex()).toBe('#762e35');

    const [brandYellowOrig, brandYellowTriad2, brandYellowTriad3] =
      getTriadicHarmonyColors(brandYellow);
    expect(brandYellowOrig.toHex()).toBe('#d3e204');
    expect(brandYellowTriad2.toHex()).toBe('#e203d3');
    expect(brandYellowTriad3.toHex()).toBe('#03d3e2');

    const [brandGreenOrig, brandGreenTriad2, brandGreenTriad3] =
      getTriadicHarmonyColors(brandGreen);
    expect(brandGreenOrig.toHex()).toBe('#29cc53');
    expect(brandGreenTriad2.toHex()).toBe('#cc5128');
    expect(brandGreenTriad3.toHex()).toBe('#5128cc');

    const [brandPinkOrig, brandPinkTriad2, brandPinkTriad3] = getTriadicHarmonyColors(brandPink);
    expect(brandPinkOrig.toHex()).toBe('#811242');
    expect(brandPinkTriad2.toHex()).toBe('#124282');
    expect(brandPinkTriad3.toHex()).toBe('#428212');

    const [brandRedOrig, brandRedTriad2, brandRedTriad3] = getTriadicHarmonyColors(brandRed);
    expect(brandRedOrig.toHex()).toBe('#de0d14');
    expect(brandRedTriad2.toHex()).toBe('#0d14de');
    expect(brandRedTriad3.toHex()).toBe('#14de0d');

    const [blackOrig, blackTriad2, blackTriad3] = getTriadicHarmonyColors(black);
    expect(blackOrig.toHex()).toBe('#000000');
    expect(blackTriad2.toHex()).toBe('#000000');
    expect(blackTriad3.toHex()).toBe('#000000');

    const [whiteOrig, whiteTriad2, whiteTriad3] = getTriadicHarmonyColors(white);
    expect(whiteOrig.toHex()).toBe('#ffffff');
    expect(whiteTriad2.toHex()).toBe('#ffffff');
    expect(whiteTriad3.toHex()).toBe('#ffffff');

    const [lightGrayOrig, lightGrayTriad2, lightGrayTriad3] = getTriadicHarmonyColors(lightGray);
    expect(lightGrayOrig.toHex()).toBe('#d3d3d3');
    expect(lightGrayTriad2.toHex()).toBe('#d4d4d4');
    expect(lightGrayTriad3.toHex()).toBe('#d4d4d4');

    const [grayOrig, grayTriad2, grayTriad3] = getTriadicHarmonyColors(gray);
    expect(grayOrig.toHex()).toBe('#808080');
    expect(grayTriad2.toHex()).toBe('#808080');
    expect(grayTriad3.toHex()).toBe('#808080');

    const [darkGrayOrig, darkGrayTriad2, darkGrayTriad3] = getTriadicHarmonyColors(darkGray);
    expect(darkGrayOrig.toHex()).toBe('#333333');
    expect(darkGrayTriad2.toHex()).toBe('#333333');
    expect(darkGrayTriad3.toHex()).toBe('#333333');
  });

  it('computes square harmony colors', () => {
    const [redOrig, redSq1, redSq2, redSq3] = getSquareHarmonyColors(red);
    expect(redOrig.toHex()).toBe('#ff0000');
    expect(redSq1.toHex()).toBe('#80ff00');
    expect(redSq2.toHex()).toBe('#00ffff');
    expect(redSq3.toHex()).toBe('#8000ff');

    const [greenOrig, greenSq1, greenSq2, greenSq3] = getSquareHarmonyColors(green);
    expect(greenOrig.toHex()).toBe('#00ff00');
    expect(greenSq1.toHex()).toBe('#0080ff');
    expect(greenSq2.toHex()).toBe('#ff00ff');
    expect(greenSq3.toHex()).toBe('#ff8000');

    const [blueOrig, blueSq1, blueSq2, blueSq3] = getSquareHarmonyColors(blue);
    expect(blueOrig.toHex()).toBe('#0000ff');
    expect(blueSq1.toHex()).toBe('#ff0080');
    expect(blueSq2.toHex()).toBe('#ffff00');
    expect(blueSq3.toHex()).toBe('#00ff80');

    const [brandPurpleOrig, brandPurpleSq1, brandPurpleSq2, brandPurpleSq3] =
      getSquareHarmonyColors(brandPurple);
    expect(brandPurpleOrig.toHex()).toBe('#ee6ffc');
    expect(brandPurpleSq1.toHex()).toBe('#fca76e');
    expect(brandPurpleSq2.toHex()).toBe('#7cfc6e');
    expect(brandPurpleSq3.toHex()).toBe('#6ec3fc');

    const [brandBlueOrig, brandBlueSq1, brandBlueSq2, brandBlueSq3] =
      getSquareHarmonyColors(brandBlue);
    expect(brandBlueOrig.toHex()).toBe('#2e3575');
    expect(brandBlueSq1.toHex()).toBe('#762e59');
    expect(brandBlueSq2.toHex()).toBe('#766e2e');
    expect(brandBlueSq3.toHex()).toBe('#2e764a');

    const [brandYellowOrig, brandYellowSq1, brandYellowSq2, brandYellowSq3] =
      getSquareHarmonyColors(brandYellow);
    expect(brandYellowOrig.toHex()).toBe('#d3e204');
    expect(brandYellowSq1.toHex()).toBe('#03e282');
    expect(brandYellowSq2.toHex()).toBe('#1203e2');
    expect(brandYellowSq3.toHex()).toBe('#e20364');

    const [brandGreenOrig, brandGreenSq1, brandGreenSq2, brandGreenSq3] =
      getSquareHarmonyColors(brandGreen);
    expect(brandGreenOrig.toHex()).toBe('#29cc53');
    expect(brandGreenSq1.toHex()).toBe('#2851cc');
    expect(brandGreenSq2.toHex()).toBe('#cc28a3');
    expect(brandGreenSq3.toHex()).toBe('#cca328');

    const [brandPinkOrig, brandPinkSq1, brandPinkSq2, brandPinkSq3] =
      getSquareHarmonyColors(brandPink);
    expect(brandPinkOrig.toHex()).toBe('#811242');
    expect(brandPinkSq1.toHex()).toBe('#7b8212');
    expect(brandPinkSq2.toHex()).toBe('#128251');
    expect(brandPinkSq3.toHex()).toBe('#191282');

    const [brandRedOrig, brandRedSq1, brandRedSq2, brandRedSq3] = getSquareHarmonyColors(brandRed);
    expect(brandRedOrig.toHex()).toBe('#de0d14');
    expect(brandRedSq1.toHex()).toBe('#7cde0d');
    expect(brandRedSq2.toHex()).toBe('#0dded7');
    expect(brandRedSq3.toHex()).toBe('#6e0dde');

    const [blackOrig, blackSq1, blackSq2, blackSq3] = getSquareHarmonyColors(black);
    expect(blackOrig.toHex()).toBe('#000000');
    expect(blackSq1.toHex()).toBe('#000000');
    expect(blackSq2.toHex()).toBe('#000000');
    expect(blackSq3.toHex()).toBe('#000000');

    const [whiteOrig, whiteSq1, whiteSq2, whiteSq3] = getSquareHarmonyColors(white);
    expect(whiteOrig.toHex()).toBe('#ffffff');
    expect(whiteSq1.toHex()).toBe('#ffffff');
    expect(whiteSq2.toHex()).toBe('#ffffff');
    expect(whiteSq3.toHex()).toBe('#ffffff');

    const [lightGrayOrig, lightGraySq1, lightGraySq2, lightGraySq3] =
      getSquareHarmonyColors(lightGray);
    expect(lightGrayOrig.toHex()).toBe('#d3d3d3');
    expect(lightGraySq1.toHex()).toBe('#d4d4d4');
    expect(lightGraySq2.toHex()).toBe('#d4d4d4');
    expect(lightGraySq3.toHex()).toBe('#d4d4d4');

    const [grayOrig, graySq1, graySq2, graySq3] = getSquareHarmonyColors(gray);
    expect(grayOrig.toHex()).toBe('#808080');
    expect(graySq1.toHex()).toBe('#808080');
    expect(graySq2.toHex()).toBe('#808080');
    expect(graySq3.toHex()).toBe('#808080');

    const [darkGrayOrig, darkGraySq1, darkGraySq2, darkGraySq3] = getSquareHarmonyColors(darkGray);
    expect(darkGrayOrig.toHex()).toBe('#333333');
    expect(darkGraySq1.toHex()).toBe('#333333');
    expect(darkGraySq2.toHex()).toBe('#333333');
    expect(darkGraySq3.toHex()).toBe('#333333');
  });

  it('computes tetradic harmony colors', () => {
    const [redOrig, redTet2, redTet3, redTet4] = getTetradicHarmonyColors(red);
    expect(redOrig.toHex()).toBe('#ff0000');
    expect(redTet2.toHex()).toBe('#ffff00');
    expect(redTet3.toHex()).toBe('#00ffff');
    expect(redTet4.toHex()).toBe('#0000ff');

    const [greenOrig, greenTet2, greenTet3, greenTet4] = getTetradicHarmonyColors(green);
    expect(greenOrig.toHex()).toBe('#00ff00');
    expect(greenTet2.toHex()).toBe('#00ffff');
    expect(greenTet3.toHex()).toBe('#ff00ff');
    expect(greenTet4.toHex()).toBe('#ff0000');

    const [blueOrig, blueTet2, blueTet3, blueTet4] = getTetradicHarmonyColors(blue);
    expect(blueOrig.toHex()).toBe('#0000ff');
    expect(blueTet2.toHex()).toBe('#ff00ff');
    expect(blueTet3.toHex()).toBe('#ffff00');
    expect(blueTet4.toHex()).toBe('#00ff00');

    const [brandPurpleOrig, brandPurpleTet2, brandPurpleTet3, brandPurpleTet4] =
      getTetradicHarmonyColors(brandPurple);
    expect(brandPurpleOrig.toHex()).toBe('#ee6ffc');
    expect(brandPurpleTet2.toHex()).toBe('#fc6e7c');
    expect(brandPurpleTet3.toHex()).toBe('#7cfc6e');
    expect(brandPurpleTet4.toHex()).toBe('#6efcee');

    const [brandBlueOrig, brandBlueTet2, brandBlueTet3, brandBlueTet4] =
      getTetradicHarmonyColors(brandBlue);
    expect(brandBlueOrig.toHex()).toBe('#2e3575');
    expect(brandBlueTet2.toHex()).toBe('#6e2e76');
    expect(brandBlueTet3.toHex()).toBe('#766e2e');
    expect(brandBlueTet4.toHex()).toBe('#35762e');

    const [brandYellowOrig, brandYellowTet2, brandYellowTet3, brandYellowTet4] =
      getTetradicHarmonyColors(brandYellow);
    expect(brandYellowOrig.toHex()).toBe('#d3e204');
    expect(brandYellowTet2.toHex()).toBe('#03e212');
    expect(brandYellowTet3.toHex()).toBe('#1203e2');
    expect(brandYellowTet4.toHex()).toBe('#e203d3');

    const [brandGreenOrig, brandGreenTet2, brandGreenTet3, brandGreenTet4] =
      getTetradicHarmonyColors(brandGreen);
    expect(brandGreenOrig.toHex()).toBe('#29cc53');
    expect(brandGreenTet2.toHex()).toBe('#28a3cc');
    expect(brandGreenTet3.toHex()).toBe('#cc28a3');
    expect(brandGreenTet4.toHex()).toBe('#cc5128');

    const [brandPinkOrig, brandPinkTet2, brandPinkTet3, brandPinkTet4] =
      getTetradicHarmonyColors(brandPink);
    expect(brandPinkOrig.toHex()).toBe('#811242');
    expect(brandPinkTet2.toHex()).toBe('#825112');
    expect(brandPinkTet3.toHex()).toBe('#128251');
    expect(brandPinkTet4.toHex()).toBe('#124282');

    const [brandRedOrig, brandRedTet2, brandRedTet3, brandRedTet4] =
      getTetradicHarmonyColors(brandRed);
    expect(brandRedOrig.toHex()).toBe('#de0d14');
    expect(brandRedTet2.toHex()).toBe('#ded70d');
    expect(brandRedTet3.toHex()).toBe('#0dded7');
    expect(brandRedTet4.toHex()).toBe('#0d14de');

    const [blackOrig, blackTet2, blackTet3, blackTet4] = getTetradicHarmonyColors(black);
    expect(blackOrig.toHex()).toBe('#000000');
    expect(blackTet2.toHex()).toBe('#000000');
    expect(blackTet3.toHex()).toBe('#000000');
    expect(blackTet4.toHex()).toBe('#000000');

    const [whiteOrig, whiteTet2, whiteTet3, whiteTet4] = getTetradicHarmonyColors(white);
    expect(whiteOrig.toHex()).toBe('#ffffff');
    expect(whiteTet2.toHex()).toBe('#ffffff');
    expect(whiteTet3.toHex()).toBe('#ffffff');
    expect(whiteTet4.toHex()).toBe('#ffffff');

    const [lightGrayOrig, lightGrayTet2, lightGrayTet3, lightGrayTet4] =
      getTetradicHarmonyColors(lightGray);
    expect(lightGrayOrig.toHex()).toBe('#d3d3d3');
    expect(lightGrayTet2.toHex()).toBe('#d4d4d4');
    expect(lightGrayTet3.toHex()).toBe('#d4d4d4');
    expect(lightGrayTet4.toHex()).toBe('#d4d4d4');

    const [grayOrig, grayTet2, grayTet3, grayTet4] = getTetradicHarmonyColors(gray);
    expect(grayOrig.toHex()).toBe('#808080');
    expect(grayTet2.toHex()).toBe('#808080');
    expect(grayTet3.toHex()).toBe('#808080');
    expect(grayTet4.toHex()).toBe('#808080');

    const [darkGrayOrig, darkGrayTet2, darkGrayTet3, darkGrayTet4] =
      getTetradicHarmonyColors(darkGray);
    expect(darkGrayOrig.toHex()).toBe('#333333');
    expect(darkGrayTet2.toHex()).toBe('#333333');
    expect(darkGrayTet3.toHex()).toBe('#333333');
    expect(darkGrayTet4.toHex()).toBe('#333333');
  });

  it('computes analogous harmony colors', () => {
    const [redOrig, redAnalog2, redAnalog3, redAnalog4, redAnalog5] =
      getAnalogousHarmonyColors(red);
    expect(redOrig.toHex()).toBe('#ff0000');
    expect(redAnalog2.toHex()).toBe('#ff0080');
    expect(redAnalog3.toHex()).toBe('#ff8000');
    expect(redAnalog4.toHex()).toBe('#ff00ff');
    expect(redAnalog5.toHex()).toBe('#ffff00');

    const [greenOrig, greenAnalog2, greenAnalog3, greenAnalog4, greenAnalog5] =
      getAnalogousHarmonyColors(green);
    expect(greenOrig.toHex()).toBe('#00ff00');
    expect(greenAnalog2.toHex()).toBe('#80ff00');
    expect(greenAnalog3.toHex()).toBe('#00ff80');
    expect(greenAnalog4.toHex()).toBe('#ffff00');
    expect(greenAnalog5.toHex()).toBe('#00ffff');

    const [blueOrig, blueAnalog2, blueAnalog3, blueAnalog4, blueAnalog5] =
      getAnalogousHarmonyColors(blue);
    expect(blueOrig.toHex()).toBe('#0000ff');
    expect(blueAnalog2.toHex()).toBe('#0080ff');
    expect(blueAnalog3.toHex()).toBe('#8000ff');
    expect(blueAnalog4.toHex()).toBe('#00ffff');
    expect(blueAnalog5.toHex()).toBe('#ff00ff');

    const [
      brandPurpleOrig,
      brandPurpleAnalog2,
      brandPurpleAnalog3,
      brandPurpleAnalog4,
      brandPurpleAnalog5,
    ] = getAnalogousHarmonyColors(brandPurple);
    expect(brandPurpleOrig.toHex()).toBe('#ee6ffc');
    expect(brandPurpleAnalog2.toHex()).toBe('#a76efc');
    expect(brandPurpleAnalog3.toHex()).toBe('#fc6ec3');
    expect(brandPurpleAnalog4.toHex()).toBe('#6e7cfc');
    expect(brandPurpleAnalog5.toHex()).toBe('#fc6e7c');

    const [brandBlueOrig, brandBlueAnalog2, brandBlueAnalog3, brandBlueAnalog4, brandBlueAnalog5] =
      getAnalogousHarmonyColors(brandBlue);
    expect(brandBlueOrig.toHex()).toBe('#2e3575');
    expect(brandBlueAnalog2.toHex()).toBe('#2e5976');
    expect(brandBlueAnalog3.toHex()).toBe('#4a2e76');
    expect(brandBlueAnalog4.toHex()).toBe('#2e766e');
    expect(brandBlueAnalog5.toHex()).toBe('#6e2e76');

    const [
      brandYellowOrig,
      brandYellowAnalog2,
      brandYellowAnalog3,
      brandYellowAnalog4,
      brandYellowAnalog5,
    ] = getAnalogousHarmonyColors(brandYellow);
    expect(brandYellowOrig.toHex()).toBe('#d3e204');
    expect(brandYellowAnalog2.toHex()).toBe('#e28203');
    expect(brandYellowAnalog3.toHex()).toBe('#64e203');
    expect(brandYellowAnalog4.toHex()).toBe('#e21203');
    expect(brandYellowAnalog5.toHex()).toBe('#03e212');

    const [
      brandGreenOrig,
      brandGreenAnalog2,
      brandGreenAnalog3,
      brandGreenAnalog4,
      brandGreenAnalog5,
    ] = getAnalogousHarmonyColors(brandGreen);
    expect(brandGreenOrig.toHex()).toBe('#29cc53');
    expect(brandGreenAnalog2.toHex()).toBe('#51cc28');
    expect(brandGreenAnalog3.toHex()).toBe('#28cca3');
    expect(brandGreenAnalog4.toHex()).toBe('#a3cc28');
    expect(brandGreenAnalog5.toHex()).toBe('#28a3cc');

    const [brandPinkOrig, brandPinkAnalog2, brandPinkAnalog3, brandPinkAnalog4, brandPinkAnalog5] =
      getAnalogousHarmonyColors(brandPink);
    expect(brandPinkOrig.toHex()).toBe('#811242');
    expect(brandPinkAnalog2.toHex()).toBe('#82127b');
    expect(brandPinkAnalog3.toHex()).toBe('#821912');
    expect(brandPinkAnalog4.toHex()).toBe('#511282');
    expect(brandPinkAnalog5.toHex()).toBe('#825112');

    const [brandRedOrig, brandRedAnalog2, brandRedAnalog3, brandRedAnalog4, brandRedAnalog5] =
      getAnalogousHarmonyColors(brandRed);
    expect(brandRedOrig.toHex()).toBe('#de0d14');
    expect(brandRedAnalog2.toHex()).toBe('#de0d7c');
    expect(brandRedAnalog3.toHex()).toBe('#de6e0d');
    expect(brandRedAnalog4.toHex()).toBe('#d70dde');
    expect(brandRedAnalog5.toHex()).toBe('#ded70d');

    const [blackOrig, blackAnalog2, blackAnalog3, blackAnalog4, blackAnalog5] =
      getAnalogousHarmonyColors(black);
    expect(blackOrig.toHex()).toBe('#000000');
    expect(blackAnalog2.toHex()).toBe('#000000');
    expect(blackAnalog3.toHex()).toBe('#000000');
    expect(blackAnalog4.toHex()).toBe('#000000');
    expect(blackAnalog5.toHex()).toBe('#000000');

    const [whiteOrig, whiteAnalog2, whiteAnalog3, whiteAnalog4, whiteAnalog5] =
      getAnalogousHarmonyColors(white);
    expect(whiteOrig.toHex()).toBe('#ffffff');
    expect(whiteAnalog2.toHex()).toBe('#ffffff');
    expect(whiteAnalog3.toHex()).toBe('#ffffff');
    expect(whiteAnalog4.toHex()).toBe('#ffffff');
    expect(whiteAnalog5.toHex()).toBe('#ffffff');

    const [lightGrayOrig, lightGrayAnalog2, lightGrayAnalog3, lightGrayAnalog4, lightGrayAnalog5] =
      getAnalogousHarmonyColors(lightGray);
    expect(lightGrayOrig.toHex()).toBe('#d3d3d3');
    expect(lightGrayAnalog2.toHex()).toBe('#d4d4d4');
    expect(lightGrayAnalog3.toHex()).toBe('#d4d4d4');
    expect(lightGrayAnalog4.toHex()).toBe('#d4d4d4');
    expect(lightGrayAnalog5.toHex()).toBe('#d4d4d4');

    const [grayOrig, grayAnalog2, grayAnalog3, grayAnalog4, grayAnalog5] =
      getAnalogousHarmonyColors(gray);
    expect(grayOrig.toHex()).toBe('#808080');
    expect(grayAnalog2.toHex()).toBe('#808080');
    expect(grayAnalog3.toHex()).toBe('#808080');
    expect(grayAnalog4.toHex()).toBe('#808080');
    expect(grayAnalog5.toHex()).toBe('#808080');

    const [darkGrayOrig, darkGrayAnalog2, darkGrayAnalog3, darkGrayAnalog4, darkGrayAnalog5] =
      getAnalogousHarmonyColors(darkGray);
    expect(darkGrayOrig.toHex()).toBe('#333333');
    expect(darkGrayAnalog2.toHex()).toBe('#333333');
    expect(darkGrayAnalog3.toHex()).toBe('#333333');
    expect(darkGrayAnalog4.toHex()).toBe('#333333');
    expect(darkGrayAnalog5.toHex()).toBe('#333333');
  });

  it('computes monochromatic harmony colors', () => {
    const start = new Color({ h: 210, s: 60, l: 50 });
    const [baseColor, lighter, darker, saturated, desaturated] =
      getMonochromaticHarmonyColors(start);
    expect(baseColor.toHSL()).toEqual({ h: 210, s: 60, l: 50 });
    expect(lighter.toHSL()).toEqual({ h: 210, s: 59, l: 70 });
    expect(darker.toHSL()).toEqual({ h: 210, s: 59, l: 30 });
    expect(saturated.toHSL()).toEqual({ h: 210, s: 80, l: 50 });
    expect(desaturated.toHSL()).toEqual({ h: 210, s: 40, l: 50 });

    const [redOrig, redMono2, redMono3, redMono4, redMono5] = getMonochromaticHarmonyColors(red);
    expect(redOrig.toHex()).toBe('#ff0000');
    expect(redMono2.toHex()).toBe('#ff6666');
    expect(redMono3.toHex()).toBe('#990000');
    expect(redMono4.toHex()).toBe('#ff0000');
    expect(redMono5.toHex()).toBe('#e61919');

    const [greenOrig, greenMono2, greenMono3, greenMono4, greenMono5] =
      getMonochromaticHarmonyColors(green);
    expect(greenOrig.toHex()).toBe('#00ff00');
    expect(greenMono2.toHex()).toBe('#66ff66');
    expect(greenMono3.toHex()).toBe('#009900');
    expect(greenMono4.toHex()).toBe('#00ff00');
    expect(greenMono5.toHex()).toBe('#19e619');

    const [blueOrig, blueMono2, blueMono3, blueMono4, blueMono5] =
      getMonochromaticHarmonyColors(blue);
    expect(blueOrig.toHex()).toBe('#0000ff');
    expect(blueMono2.toHex()).toBe('#6666ff');
    expect(blueMono3.toHex()).toBe('#000099');
    expect(blueMono4.toHex()).toBe('#0000ff');
    expect(blueMono5.toHex()).toBe('#1919e6');

    const [
      brandPurpleOrig,
      brandPurpleMono2,
      brandPurpleMono3,
      brandPurpleMono4,
      brandPurpleMono5,
    ] = getMonochromaticHarmonyColors(brandPurple);
    expect(brandPurpleOrig.toHex()).toBe('#ee6ffc');
    expect(brandPurpleMono2.toHex()).toBe('#fad2fe');
    expect(brandPurpleMono3.toHex()).toBe('#e20afa');
    expect(brandPurpleMono4.toHex()).toBe('#f06bff');
    expect(brandPurpleMono5.toHex()).toBe('#e27ded');

    const [brandBlueOrig, brandBlueMono2, brandBlueMono3, brandBlueMono4, brandBlueMono5] =
      getMonochromaticHarmonyColors(brandBlue);
    expect(brandBlueOrig.toHex()).toBe('#2e3575');
    expect(brandBlueMono2.toHex()).toBe('#4f5aba');
    expect(brandBlueMono3.toHex()).toBe('#11142c');
    expect(brandBlueMono4.toHex()).toBe('#1d2886');
    expect(brandBlueMono5.toHex()).toBe('#3e4265');

    const [
      brandYellowOrig,
      brandYellowMono2,
      brandYellowMono3,
      brandYellowMono4,
      brandYellowMono5,
    ] = getMonochromaticHarmonyColors(brandYellow);
    expect(brandYellowOrig.toHex()).toBe('#d3e204');
    expect(brandYellowMono2.toHex()).toBe('#f1fc4f');
    expect(brandYellowMono3.toHex()).toBe('#757e02');
    expect(brandYellowMono4.toHex()).toBe('#d6e600');
    expect(brandYellowMono5.toHex()).toBe('#bfcb1a');

    const [brandGreenOrig, brandGreenMono2, brandGreenMono3, brandGreenMono4, brandGreenMono5] =
      getMonochromaticHarmonyColors(brandGreen);
    expect(brandGreenOrig.toHex()).toBe('#29cc53');
    expect(brandGreenMono2.toHex()).toBe('#77e492');
    expect(brandGreenMono3.toHex()).toBe('#18772f');
    expect(brandGreenMono4.toHex()).toBe('#10e545');
    expect(brandGreenMono5.toHex()).toBe('#41b45e');

    const [brandPinkOrig, brandPinkMono2, brandPinkMono3, brandPinkMono4, brandPinkMono5] =
      getMonochromaticHarmonyColors(brandPink);
    expect(brandPinkOrig.toHex()).toBe('#811242');
    expect(brandPinkMono2.toHex()).toBe('#dc1e70');
    expect(brandPinkMono3.toHex()).toBe('#280615');
    expect(brandPinkMono4.toHex()).toBe('#910340');
    expect(brandPinkMono5.toHex()).toBe('#732144');

    const [brandRedOrig, brandRedMono2, brandRedMono3, brandRedMono4, brandRedMono5] =
      getMonochromaticHarmonyColors(brandRed);
    expect(brandRedOrig.toHex()).toBe('#de0d14');
    expect(brandRedMono2.toHex()).toBe('#f55b60');
    expect(brandRedMono3.toHex()).toBe('#7d070b');
    expect(brandRedMono4.toHex()).toBe('#eb0008');
    expect(brandRedMono5.toHex()).toBe('#c6242a');

    const [blackOrig, blackMono2, blackMono3, blackMono4, blackMono5] =
      getMonochromaticHarmonyColors(black);
    expect(blackOrig.toHex()).toBe('#000000');
    expect(blackMono2.toHex()).toBe('#333333');
    expect(blackMono3.toHex()).toBe('#000000');
    expect(blackMono4.toHex()).toBe('#000000');
    expect(blackMono5.toHex()).toBe('#000000');

    const [whiteOrig, whiteMono2, whiteMono3, whiteMono4, whiteMono5] =
      getMonochromaticHarmonyColors(white);
    expect(whiteOrig.toHex()).toBe('#ffffff');
    expect(whiteMono2.toHex()).toBe('#ffffff');
    expect(whiteMono3.toHex()).toBe('#cccccc');
    expect(whiteMono4.toHex()).toBe('#ffffff');
    expect(whiteMono5.toHex()).toBe('#ffffff');

    const [lightGrayOrig, lightGrayMono2, lightGrayMono3, lightGrayMono4, lightGrayMono5] =
      getMonochromaticHarmonyColors(lightGray);
    expect(lightGrayOrig.toHex()).toBe('#d3d3d3');
    expect(lightGrayMono2.toHex()).toBe('#ffffff');
    expect(lightGrayMono3.toHex()).toBe('#a1a1a1');
    expect(lightGrayMono4.toHex()).toBe('#dccbcb');
    expect(lightGrayMono5.toHex()).toBe('#d4d4d4');

    const [grayOrig, grayMono2, grayMono3, grayMono4, grayMono5] =
      getMonochromaticHarmonyColors(gray);
    expect(grayOrig.toHex()).toBe('#808080');
    expect(grayMono2.toHex()).toBe('#b3b3b3');
    expect(grayMono3.toHex()).toBe('#4d4d4d');
    expect(grayMono4.toHex()).toBe('#996666');
    expect(grayMono5.toHex()).toBe('#808080');

    const [darkGrayOrig, darkGrayMono2, darkGrayMono3, darkGrayMono4, darkGrayMono5] =
      getMonochromaticHarmonyColors(darkGray);
    expect(darkGrayOrig.toHex()).toBe('#333333');
    expect(darkGrayMono2.toHex()).toBe('#666666');
    expect(darkGrayMono3.toHex()).toBe('#000000');
    expect(darkGrayMono4.toHex()).toBe('#3d2929');
    expect(darkGrayMono5.toHex()).toBe('#333333');
  });
});
