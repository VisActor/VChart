import type { IRect } from './../typings/space';
import type { IBoundsLike } from '@visactor/vutils';
import type { IPoint } from '../typings/space';
import type { ILayoutRect } from '../elements/chart/layout/interface';
import type { ILayoutLine } from '../core/interface';

export function isPointInBounds(point: IPoint, rect: IBoundsLike) {
  const { x1, y1, x2, y2 } = rect;
  const { x, y } = point;
  return x <= x2 && x >= x1 && y <= y2 && y >= y1;
}

export function isRectConnectRect(a: IRect, b: IRect) {
  return !(a.x > b.x + b.width || a.x + a.width < b.x || a.y > b.y + b.height || a.y + a.height < b.y);
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

export function getLayoutLine(rect: IRect, opt: {}, orient: 'x' | 'y' | 'xy' = 'xy') {
  const result: ILayoutLine[] = [];
  if (orient === 'y' || orient === 'xy') {
    const commonInY: Omit<ILayoutLine, 'value' | 'type'> = {
      orient: 'y',
      start: rect.x,
      end: rect.x + rect.width,
      rect,
      ...opt
    };
    // top
    result.push({
      value: rect.y,
      type: 'start',
      ...commonInY
    });
    // bottom
    result.push({
      value: rect.y + rect.height,
      type: 'end',
      ...commonInY
    });
    // middle
    result.push({
      value: rect.y + rect.height * 0.5,
      type: 'middle',
      ...commonInY
    });
  }

  if (orient === 'x' || orient === 'xy') {
    const commonInX: Omit<ILayoutLine, 'value' | 'type'> = {
      orient: 'x',
      start: rect.y,
      end: rect.y + rect.height,
      rect,
      ...opt
    };
    // left
    result.push({
      value: rect.x,
      type: 'start',
      ...commonInX
    });
    // right
    result.push({
      value: rect.x + rect.width,
      type: 'end',
      ...commonInX
    });
    // middle
    result.push({
      value: rect.x + rect.width * 0.5,
      type: 'middle',
      ...commonInX
    });
  }
  return result;
}

export function SamePointApproximate(a: IPoint, b: IPoint, accuracy: number = 3) {
  return SameValueApproximate(a.x, b.x, accuracy) && SameValueApproximate(a.y, b.y, accuracy);
}

export function SameValueApproximate(a: number, b: number, accuracy: number = 3) {
  return Math.floor(a * 10 ** accuracy) === Math.floor(b * 10 ** accuracy);
}
