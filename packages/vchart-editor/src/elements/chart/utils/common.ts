import type { VChart } from '@visactor/vchart';
import type { IChartModel } from '../interface';
import { getChartModelWithModelInfo } from './layout';

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
