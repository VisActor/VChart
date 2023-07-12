import { isValid } from '@visactor/vutils';
import type { ISeries } from '../../../../series/interface';
import type { IDiscreteLegendData, IDiscreteLegendDataMakeOption, IDiscreteLegendFilterOption } from './interface';

export const discreteLegendDataMake = (data: Array<ISeries>, op: IDiscreteLegendDataMakeOption) => {
  const result: IDiscreteLegendData[] = [];
  const tempKey: { [key in string]: boolean } = {};
  const { series, seriesField } = op;
  series().forEach(s => {
    const field = seriesField(s);
    let infoList;
    if (field === s.getSeriesField()) {
      infoList = s.getSeriesInfoList();
    } else {
      infoList = s.getSeriesInfoInField(field);
    }
    infoList.forEach(info => {
      if (tempKey[info.key]) {
        return;
      }
      tempKey[info.key] = true;
      result.push(info);
    });
  });
  return result;
};

export const discreteLegendFilter = (data: Array<any>, op: IDiscreteLegendFilterOption) => {
  const { selected, field, data: legendData } = op;
  const selectedData = selected();
  const legendKeys = legendData(); // 全量的图例项
  if (selectedData.length === 0 && legendKeys.length) {
    return [];
  }

  if (selectedData.length === legendKeys.length) {
    return data;
  }

  const selectedFilter = {};
  selectedData.forEach(s => {
    selectedFilter[s] = true;
  });
  const datumField = field();
  if (isValid(datumField)) {
    data = data.filter(d => selectedFilter[d[datumField]] === true);
  }
  return data;
};
