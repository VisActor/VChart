import type { IModelInfo } from './../../../core/interface';
import type { ILayoutRect } from './../layout/interface';
import type { IChartModel, ILayoutItem } from './../interface';
import type { IRect } from './../../../typings/space';
import type { IPoint } from '../../../typings/space';
import type { IVChart } from '@visactor/vchart';
import { isModelMatchModelInfo } from '../../../utils/spec';

export function transformModelPos(i: IChartModel, pos: IPoint) {
  if (i.type.startsWith('cartesianAxis')) {
    if (i.layoutOrient === 'left') {
      pos.x -= i.getLayoutRect().width;
    } else if (i.layoutOrient === 'top') {
      pos.y -= i.getLayoutRect().height;
    }
  }
  return pos;
}

export function transformModelRect(i: IChartModel, rect: IRect) {
  // console.log('transformModelRect', i.type);
  if (i.type.startsWith('cartesianAxis')) {
    if (i.layoutOrient === 'left') {
      rect.x -= rect.width;
    } else if (i.layoutOrient === 'top') {
      rect.y -= rect.height;
    }
  }
  return rect;
}

export function transformModelRectRevert(i: IChartModel, rect: IRect, boundsRect: IRect) {
  if (i.type.startsWith('cartesianAxis')) {
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
  if (info.specKey === 'series') {
    return vchart
      .getChart()
      .getAllSeries()
      .find(c => isModelMatchModelInfo(c as unknown as IChartModel, info));
  }
  if (info.specKey === 'region') {
    return vchart
      .getChart()
      .getAllRegions()
      .find(c => isModelMatchModelInfo(c as unknown as IChartModel, info));
  }
  return vchart
    .getChart()
    .getAllComponents()
    .find(c => isModelMatchModelInfo(c as unknown as IChartModel, info));
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
