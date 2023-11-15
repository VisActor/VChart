import { Color } from '@visactor/vutils';

export function isColorEqual(colorStringA: string, colorStringB: string): boolean {
  if (colorStringA === 'disable' || colorStringB === 'disable') {
    return colorStringA === colorStringB;
  }
  const colorA = new Color(colorStringA);
  const colorB = new Color(colorStringB);
  return colorA.toRGBA() === colorB.toRGBA();
}
