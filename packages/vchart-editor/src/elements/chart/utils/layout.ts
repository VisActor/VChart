import type { IGraphic, IGroup } from '@visactor/vrender-core';
import { isValid, type IBoundsLike } from '@visactor/vutils';
import type { IModelInfo } from './../../../core/interface';
import type { ILayoutRect } from './../layout/interface';
import type { IChartModel, ILayoutItem } from './../interface';
import type { IRect } from './../../../typings/space';
import type { IPoint } from '../../../typings/space';
import type { IVChart } from '@visactor/vchart';
import { isModelMatchModelInfo } from '../../../utils/spec';
import { isRegionModel, isRegionRelativeModel } from './common';

export function transformModelPos(i: IChartModel, pos: IPoint) {
  if (isRegionRelativeModel(i.type)) {
    if (i.layoutOrient === 'left') {
      pos.x -= i.getLayoutRect().width;
    } else if (i.layoutOrient === 'top') {
      pos.y -= i.getLayoutRect().height;
    }
  }
  return pos;
}

export function transformModelRect(i: IChartModel, rect: IRect) {
  if (isRegionRelativeModel(i.type)) {
    if (i.layoutOrient === 'left') {
      rect.x -= rect.width;
    } else if (i.layoutOrient === 'top') {
      rect.y -= rect.height;
    }
  }
  return rect;
}

export function transformModelRectRevert(i: IChartModel, rect: IRect, boundsRect: IRect) {
  if (isRegionRelativeModel(i.type)) {
    if (i.layoutOrient === 'left') {
      boundsRect.x = rect.x + rect.width;
      rect.x = boundsRect.x - boundsRect.width;
    } else if (i.layoutOrient === 'top') {
      boundsRect.y = rect.y + rect.height;
      rect.y = boundsRect.y - boundsRect.height;
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
  } else if (axis.layoutOrient === 'angle' || axis.layoutOrient === 'radius') {
    return {
      x: { offset: rect.x },
      y: { offset: rect.y },
      width: { offset: 0 },
      height: { offset: 0 }
    };
  }
  const axisRect = axis.getLayoutRect();
  const axisPos = axis.getLayoutStartPoint();
  return {
    x: { offset: axisPos.x },
    y: { offset: axisPos.y },
    width: { offset: axisRect.width },
    height: { offset: axisRect.height }
  };
}

export function getChartModelWithModelInfo(vchart: IVChart, info: IModelInfo) {
  if (isRegionModel(info.specKey)) {
    return vchart
      .getChart()
      .getAllRegions()
      .find((c: any) => isModelMatchModelInfo(c as any as IChartModel, info));
  }
  return vchart
    .getChart()
    .getAllComponents()
    .find((c: any) => isModelMatchModelInfo(c as unknown as IChartModel, info));
}

export const IgnoreModelTypeInLayout = {
  tooltip: true,
  label: true,
  layout: true,
  markLine: true,
  crosshair: true,
  brush: true,
  cartesianCrosshair: true,
  polarCrosshair: true,
  geoCoordinate: true
};

export const IgnoreModelTypeInCommon = {
  tooltip: true,
  label: true,
  layout: true,
  markLine: true,
  crosshair: true,
  brush: true,
  polarCrosshair: true
};

const DefaultBoundsValue = {
  x1: Number.MAX_SAFE_INTEGER,
  x2: Number.MIN_SAFE_INTEGER,
  y1: Number.MAX_SAFE_INTEGER,
  y2: Number.MIN_SAFE_INTEGER
};

export function getBoundsInRects(
  rects: ILayoutRect[],
  attrs: ('x1' | 'x2' | 'y1' | 'y2')[]
): Partial<{ [key in 'x1' | 'x2' | 'y1' | 'y2']: number }> {
  const result = {};
  attrs.forEach(key => {
    result[key] = DefaultBoundsValue[key];
    rects.forEach(r => {
      if (key === 'x1') {
        result[key] = Math.min(result[key], r.x.offset);
      } else if (key === 'x2') {
        result[key] = Math.max(result[key], r.x.offset + r.width.offset);
      } else if (key === 'y1') {
        result[key] = Math.min(result[key], r.y.offset);
      } else if (key === 'y2') {
        result[key] = Math.max(result[key], r.y.offset + r.height.offset);
      }
    });
  });
  return result;
}

export function getModelGraphicsBounds(model: IChartModel): IBoundsLike {
  try {
    if (model.type.includes('Axis')) {
      return (<any>model).getMarks()[0].getProduct().graphicItem.AABBBounds;
    }
    // vchart 报错
    const cpt = model.getVRenderComponents()[0];
    if (cpt) {
      return cpt.AABBBounds;
    }
    return { x1: 0, x2: 0, y1: 0, y2: 0 };
  } catch (error) {
    return { x1: 0, x2: 0, y1: 0, y2: 0 };
  }
}

export function getModelRootMark(model: IChartModel, info: IModelInfo) {
  if (model.type === 'region') {
  }
  if (model.type.includes('Axis')) {
    const mark = (<any>model).getMarks()[0].getProduct().graphicItem;
    return mark;
  }
  // 通用
  const vRenderCmt = model.getVRenderComponents();
  if (!vRenderCmt?.length) {
    return null;
  }
  return vRenderCmt[0];
}

export function getZIndexInParent(
  parent: IGroup,
  mark: IGraphic,
  opt: { zIndex?: number; action: 'toTop' | 'toBottom' | 'levelUp' | 'levelDown' }
) {
  if (isValid(opt.zIndex)) {
    return opt.zIndex;
  }
  let index = mark.attribute.zIndex ?? 0;
  if (opt.action === 'toTop') {
    index = (mark.attribute.zIndex ?? 0) + 1;
    parent.forEachChildren(c => {
      index = Math.max(index, (c as IGraphic).attribute.zIndex + 1);
    });
  } else if (opt.action === 'toBottom') {
    index = (mark.attribute.zIndex ?? 0) - 1;
    parent.forEachChildren(c => {
      index = Math.min(index, (c as IGraphic).attribute.zIndex - 1);
    });
  } else if (opt.action === 'levelUp') {
    index = Number.MAX_SAFE_INTEGER;
    parent.forEachChildren(c => {
      if ((c as IGraphic).attribute.zIndex > mark.attribute.zIndex) {
        index = Math.min(index, (c as IGraphic).attribute.zIndex + 1);
      }
    });
    if (index === Number.MAX_SAFE_INTEGER) {
      return mark.attribute.zIndex;
    }
  } else if (opt.action === 'levelDown') {
    index = Number.MIN_SAFE_INTEGER;
    parent.forEachChildren(c => {
      if ((c as IGraphic).attribute.zIndex < mark.attribute.zIndex) {
        index = Math.max(index, (c as IGraphic).attribute.zIndex - 1);
      }
    });
    if (index === Number.MIN_SAFE_INTEGER) {
      return mark.attribute.zIndex;
    }
  }
  return index;
}
