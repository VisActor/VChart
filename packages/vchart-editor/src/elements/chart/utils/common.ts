import { DEFAULT_DATA_KEY, type ICartesianSeries, type VChart } from '@visactor/vchart';
import { type IChartModel } from '../interface';
import { getChartModelWithModelInfo } from './layout';
import type { IRect } from '@visactor/vrender-core';

export function refreshModelInVChart(model: IChartModel, vchart: VChart) {
  // @ts-ignore
  if (model.getOption()?.getChart() === vchart.getChart()) {
    return model;
  }
  const modelInfo = {
    id: model.userId,
    specKey: model.specKey,
    specIndex: model.getSpecIndex() ?? 0
  };
  if (isRegionModel(model.type)) {
    // region 作为特殊元素，永远可以刷新到一个
    delete modelInfo.id;
  }
  return getChartModelWithModelInfo(vchart, modelInfo);
}

export function isRegionRelativeModel(type: string) {
  return type && type.startsWith('cartesianAxis');
}

export function isRegionModel(type: string) {
  return type && type.includes('region');
}

export function getBarGraphicByDataKey(series: ICartesianSeries, dataKey: string) {
  const barMark = series.getMarkInName('bar');
  const elements = barMark.getProduct().getAllElements();

  const element = elements.find((element: any) => {
    return element.data[0][DEFAULT_DATA_KEY] === dataKey;
  });

  return element.getGraphicItem() as IRect;
}
