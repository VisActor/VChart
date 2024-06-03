import { constants } from 'fs';
import { isArray, isEmpty, isValidNumber } from '@visactor/vutils';
import type { ISeries } from '../../../../series/interface';
import type { IContinuousLegendDataMakeOption, IContinuousLegendFilterOption } from './interface';
import { filterHierarchyDataByRange } from '../../../../util';

// 获取数值范围
export const continuousLegendDataMake = (data: Array<ISeries>, op: IContinuousLegendDataMakeOption) => {
  const { series, field, scale } = op;
  const datumField = field();
  if (field && datumField) {
    let min: number = Infinity;
    let max: number = -Infinity;
    series().forEach(s => {
      const statisticData = s.getRawDataStatisticsByField(datumField, true);
      const seriesMin = statisticData?.min;
      const seriesMax = statisticData?.max;
      if (isValidNumber(seriesMin)) {
        min = Math.min(seriesMin, min);
      }
      if (isValidNumber(seriesMax)) {
        max = Math.max(seriesMax, max);
      }
    });
    return [min, max];
  }
  if (scale) {
    const _scale = scale();
    if (!_scale) {
      return [];
    }
    return _scale.domain();
  }
  return [];
};

// 连续数据过滤
export const continuousLegendFilter = (data: Array<any>, op: IContinuousLegendFilterOption) => {
  const { selected, field, data: legendData, isHierarchyData } = op;
  const selectedRange = selected();
  const datumField = field();
  const dataRange = legendData();
  const isHierarchy = isHierarchyData
    ? isHierarchyData
    : (data: Array<any>) => data && data.every(d => d && isArray(d.children));

  // 如果数值范围相等，就不进行返回 data，不需要进行过滤
  if (selectedRange === dataRange) {
    return data;
  }

  if (datumField && !isEmpty(selectedRange)) {
    const [min, max] = selectedRange;
    if (isHierarchy(data)) {
      return filterHierarchyDataByRange(data, +min, +max);
    } else {
      return data.filter(datum => {
        return datum[datumField] >= min && datum[datumField] <= max;
      });
    }
  }

  return data;
};
