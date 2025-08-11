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
  });
});
