import { Color } from './color';

// TODO: consider using LCH or OKLCH space mode for more human perceptual accuracy

export function getComplementaryColors(color: Color): [Color, Color] {
  return [color.clone(), color.spin(180)];
}
