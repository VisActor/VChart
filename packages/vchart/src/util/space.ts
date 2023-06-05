import type { ILayoutPaddingSpec } from '../model/interface';
import type { IBoundsLike } from '@visactor/vutils';
import { isArray } from '@visactor/vutils';
import { isNumber, isNil, isString, isFunction, couldBeValidNumber, isObject } from './type';
import type { ILayoutNumber, IPercent, ILayoutOrientPadding, ILayoutRect } from '../model/interface';
import type { IPadding, IRect } from '../typings/space';
// eslint-disable-next-line no-duplicate-imports
import { Direction } from '../typings/space';
import type { IPoint } from '../typings/coordinate';

export function isValidOrient(orient: string): boolean {
  switch (orient) {
    case 'left':
    case 'right':
    case 'top':
    case 'bottom':
      return true;
    default:
      return false;
  }
}

export function getSpecPadding(padding: IPadding | number | undefined | null, defaultPadding: IPadding): IPadding {
  if (isNil(padding)) {
    return { ...defaultPadding };
  }
  if (typeof padding === 'number') {
    return {
      top: padding,
      bottom: padding,
      left: padding,
      right: padding
    };
  }
  return {
    ...defaultPadding,
    ...padding
  };
}

export function isPointInRect(point: IPoint, rect: IRect) {
  const { x, y, width, height } = rect;
  const { x: x0, y: y0 } = point;
  return x0 < x + width && y0 < y + height && y0 > y && x0 > x;
}

export function isPercent(v: any): v is IPercent {
  if (!isString(v)) {
    return false;
  }
  if (!v.endsWith('%')) {
    return false;
  }
  return couldBeValidNumber(v.substring(0, v.length - 1));
}

export function calcLayoutNumber(
  v: ILayoutNumber | undefined,
  size: number,
  callOp?: ILayoutRect //如果是函数类型的话，函数的参数
) {
  if (isNumber(v)) {
    return v;
  }
  if (isPercent(v)) {
    return (Number(v.substring(0, v.length - 1)) * size) / 100;
  }
  if (isFunction(v)) {
    return v(callOp);
  }
  return 0;
}

export function calcPadding(
  paddingSpec: ILayoutOrientPadding,
  rect: ILayoutRect,
  callOp: ILayoutRect //如果是函数类型的话，函数的参数
): IPadding {
  const result: IPadding = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  };
  if (Object.values(paddingSpec).every(value => isNumber(value))) {
    result.top = (<IPadding>paddingSpec).top ?? 0;
    result.right = (<IPadding>paddingSpec).right ?? 0;
    result.bottom = (<IPadding>paddingSpec).bottom ?? 0;
    result.left = (<IPadding>paddingSpec).left ?? 0;
    return result;
  }
  const paddings = [
    {
      orients: ['left', 'right'],
      size: rect.width
    },
    {
      orients: ['top', 'bottom'],
      size: rect.height
    }
  ];
  paddings.forEach(p => {
    p.orients.forEach(o => {
      result[o] = calcLayoutNumber(paddingSpec[o], p.size, callOp);
    });
  });
  return result;
}

export function boundsInRect(bounds: IBoundsLike, rect: ILayoutRect): ILayoutRect {
  if (!bounds) {
    return { width: 0, height: 0 };
  }
  return {
    width: Math.ceil(Math.min(bounds.x2 - bounds.x1, rect.width)),
    height: Math.ceil(Math.min(bounds.y2 - bounds.y1, rect.height))
  };
}

export function boundsOutViewBox(
  bounds: IBoundsLike,
  box: IBoundsLike,
  direction: Direction
): {
  start: number;
  end: number;
} {
  if (!bounds || !box) {
    return { start: 0, end: 0 };
  }
  const start = -(direction === Direction.horizontal ? bounds.x1 : bounds.y1);
  const end = direction === Direction.horizontal ? bounds.x2 - (box.x2 - box.x1) : bounds.y2 - (box.y2 - box.y1);
  return { start: start > 0 ? start : 0, end: end > 0 ? end : 0 };
}

export function normalizeLayoutPaddingSpec(spec: ILayoutPaddingSpec): ILayoutOrientPadding {
  let result: ILayoutOrientPadding = {};
  if (isArray(spec)) {
    if (!isNil(spec[0])) {
      result.top = result.left = result.bottom = result.right = spec[0];
    }
    if (!isNil(spec[1])) {
      result.left = result.right = spec[1];
    }
    if (!isNil(spec[2])) {
      result.bottom = spec[2];
    }
    if (!isNil(spec[3])) {
      result.left = spec[3];
    }
    return result;
  }
  if (isNumber(spec) || isPercent(spec) || isFunction(spec)) {
    result.top = result.left = result.bottom = result.right = spec;
    return result;
  }
  if (isObject(spec)) {
    result = { ...spec };
  }
  return result;
}
