import { isEmpty, isValidNumber } from '@visactor/vutils';
import type { ISeries } from '../../../../series/interface';
import type { IContinuousLegendDataMakeOption, IContinuousLegendFilterOption } from './interface';

// 获取数值范围
export const continuousLegendDataMake = (data: Array<ISeries>, op: IContinuousLegendDataMakeOption) => {
  const { series, field, scale } = op;
  const datumField = field();
  if (field && datumField) {
    let min: number = Number.MAX_VALUE;
    let max: number = Number.MIN_VALUE;
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
  const { selected, field, data: legendData } = op;
  const selectedRange = selected();
  const datumField = field();
  const dataRange = legendData();

  // 如果数值范围相等，就不进行返回 data，不需要进行过滤
  if (selectedRange === dataRange) {
    return data;
  }

  if (datumField && !isEmpty(selectedRange)) {
    const [min, max] = selectedRange;

    return data.filter(datum => {
      return datum[datumField] >= min && datum[datumField] <= max;
    });
  }

  return data;
};
