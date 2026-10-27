import type { IBoundsLike } from '@visactor/vutils';
import type { IExternalViewport } from '../compile/interface';

/** DOM 浮层使用 client 坐标，不能从共享 Canvas 推导单图的位置。 */
export function getExternalViewportBounds(viewport: IExternalViewport, width: number, height: number): IBoundsLike {
  const { a, b, c, d, e, f } = viewport.transform;
  return {
    x1: Math.min(e, a * width + e, c * height + e, a * width + c * height + e),
    y1: Math.min(f, b * width + f, d * height + f, b * width + d * height + f),
    x2: Math.max(e, a * width + e, c * height + e, a * width + c * height + e),
    y2: Math.max(f, b * width + f, d * height + f, b * width + d * height + f)
  };
}

export function isPointInExternalViewport(
  viewport: IExternalViewport,
  width: number,
  height: number,
  x: number,
  y: number
): boolean {
  const clip = viewport.clip;
  if (clip && (x < clip.x1 || y < clip.y1 || x > clip.x2 || y > clip.y2)) {
    return false;
  }
  const { a, b, c, d, e, f } = viewport.transform;
  const determinant = a * d - b * c;
  const localX = (d * (x - e) - c * (y - f)) / determinant;
  const localY = (-b * (x - e) + a * (y - f)) / determinant;
  return localX >= 0 && localY >= 0 && localX <= width && localY <= height;
}
