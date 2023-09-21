import type { ILayoutRect } from './../layout/interface';
import type { ILayoutItem } from './../interface';
import type { IRect } from './../../../typings/space';
import type { IPoint } from '../../../typings/space';

export function transformModelPos(i: ILayoutItem, pos: IPoint) {
  if (i.type.startsWith('cartesianAxis')) {
    if (i.layoutOrient === 'left') {
      pos.x -= i.getLayoutRect().width;
    } else if (i.layoutOrient === 'top') {
      pos.y -= i.getLayoutRect().height;
    }
  }
  return pos;
}

export function transformModelRect(i: ILayoutItem, rect: IRect) {
  if (i.type.startsWith('cartesianAxis')) {
    if (i.layoutOrient === 'left') {
      rect.x -= rect.width;
    } else if (i.layoutOrient === 'top') {
      rect.y -= rect.height;
    }
  }
  return rect;
}

export function getAxisLayoutInRegionRect(axis: ILayoutItem, rect: IRect): ILayoutRect {
  if (axis.layoutOrient === 'left') {
    return {
      x: { offset: rect.x },
      y: { offset: rect.y },
      width: { offset: axis.getLayoutRect().width },
      height: { offset: rect.height }
    };
  } else if (axis.layoutOrient === 'right') {
    return {
      x: { offset: rect.x + rect.width },
      y: { offset: rect.y },
      width: { offset: axis.getLayoutRect().width },
      height: { offset: rect.height }
    };
  } else if (axis.layoutOrient === 'top') {
    return {
      x: { offset: rect.x },
      y: { offset: rect.y },
      width: { offset: rect.width },
      height: { offset: axis.getLayoutRect().height }
    };
  } else if (axis.layoutOrient === 'bottom') {
    return {
      x: { offset: rect.x },
      y: { offset: rect.y + rect.height },
      width: { offset: rect.width },
      height: { offset: axis.getLayoutRect().height }
    };
  }
  const axisRect = axis.getLayoutRect();
  return {
    x: { offset: axisRect.x },
    y: { offset: axisRect.y },
    width: { offset: axisRect.width },
    height: { offset: axisRect.height }
  };
}
