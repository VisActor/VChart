import { isValid } from '@visactor/vutils';
import type { IModelSpecInfo } from '../../model/interface';
import type { IRegionSpec, IRegionSpecInfo } from '../../region/interface';
import type { IChartSpecInfo } from '../interface';
import type { ISeriesSpecInfo } from '../../series/interface';
import type { ISeriesSpec } from '../../typings';

/** 寻找和 model 关联的 region info */
export const getRelatedRegionInfo = (
  modelInfo: IModelSpecInfo,
  currentChartSpecInfo: IChartSpecInfo
): IRegionSpecInfo<IRegionSpec> | undefined => {
  const {
    spec: { regionId, regionIndex }
  } = modelInfo;
  if (isValid(regionId)) {
    return currentChartSpecInfo.region?.find(({ spec }) => spec.id === regionId);
  } else if (isValid(regionIndex)) {
    return currentChartSpecInfo.region?.[regionIndex];
  }
  return undefined;
};

/** 寻找和 model 关联的 series info */
export const getRelatedSeriesInfo = (
  modelInfo: IModelSpecInfo,
  currentChartSpecInfo: IChartSpecInfo
): Array<ISeriesSpecInfo<ISeriesSpec>> | undefined => {
  let series: ISeriesSpecInfo;
  const {
    spec: { seriesId, seriesIndex }
  } = modelInfo;
  if (isValid(seriesId)) {
    series = currentChartSpecInfo.series?.find(({ spec }) => spec.id === seriesId);
  } else if (isValid(seriesIndex)) {
    series = currentChartSpecInfo.series?.[seriesIndex];
  }
  if (series) {
    return [series];
  }
  return undefined;
};
