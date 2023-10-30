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

export function getLayoutLine(rect: IRect, opt: {}) {
  const result: ILayoutLine[] = [];
  const commonInY: Omit<ILayoutLine, 'value'> = {
    orient: 'y',
    start: rect.x,
    end: rect.x + rect.width,
    rect,
    ...opt
  };
  // top
  result.push({
    value: rect.y,
    ...commonInY
  });
  // bottom
  result.push({
    value: rect.y + rect.height,
    ...commonInY
  });
  // middle
  result.push({
    value: rect.y + rect.height * 0.5,
    ...commonInY
  });

  const commonInX: Omit<ILayoutLine, 'value'> = {
    orient: 'x',
    start: rect.y,
    end: rect.y + rect.height,
    rect,
    ...opt
  };
  // left
  result.push({
    value: rect.x,
    ...commonInX
  });
  // right
  result.push({
    value: rect.x + rect.width,
    ...commonInX
  });
  // middle
  result.push({
    value: rect.x + rect.width * 0.5,
    ...commonInX
  });
  return result;
}
