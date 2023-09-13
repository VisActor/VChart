import type { IRect } from './../typings/space';
import type { IBoundsLike } from '@visactor/vutils';
import type { IPoint } from '../typings/space';
import type { ILayoutRect } from '../elements/chart/layout/interface';

export function isPointInBounds(point: IPoint, rect: IBoundsLike) {
  const { x1, y1, x2, y2 } = rect;
  const { x, y } = point;
  return x <= x2 && x >= x1 && y <= y2 && y >= y1;
}

export function isPointInRect(point: IPoint, rect: IRect) {
  const { x, y, width, height } = rect;
  const { x: x0, y: y0 } = point;
  return x0 <= x + width && y0 <= y + height && y0 >= y && x0 >= x;
}

export function LayoutRectToRect(r: ILayoutRect) {
  return {
    x: r.x.offset,
    y: r.y.offset,
    width: r.width.offset,
    height: r.height.offset
  };
}
