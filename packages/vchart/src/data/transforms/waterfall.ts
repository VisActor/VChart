// import { isNil, precisionAdd } from '@visactor/vutils';
import { isNil, precisionAdd } from '@visactor/vutils';

import type { DataView } from '@visactor/vdataset';
import type { IWaterfallSeriesSpec } from '../../series/waterfall/interface';
import type { Datum } from '../../typings';
import { WaterfallDefaultSeriesField } from '../../constant/waterfall';

export interface IWaterfallOpt {
  indexField: string;
  valueField: string;
  seriesField?: string;
  startAs: string;
  endAs: string;
  total: IWaterfallSeriesSpec['total'];
  seriesFieldName: {
    total: string;
    increase: string;
    decrease: string;
  };
  groupData: () => DataView;
}

export const waterfall = (lastData: Array<Datum>, op: IWaterfallOpt) => {
  if (!lastData || lastData.length === 0) {
    return lastData;
  }
  const { indexField, valueField, startAs, endAs, total: totalSpec, seriesField, seriesFieldName, groupData } = op;
  const totalData: {
    start: number;
    end: number;
    lastIndex: string;
    lastEnd: number;
    index: string;
    isTotal: boolean;
  }[] = [];
  const { dimensionValues, dimensionData } = groupData().latestData as {
    dimensionValues: { [key in string]: Set<string> };
    dimensionData: { [key in string]: Datum[] };
  };
  const indexValues = Array.from(dimensionValues[indexField]);
  let temp: { start: number; end: number; lastIndex: string } = { start: 0, end: 0, lastIndex: null };
  indexValues.forEach((key, index) => {
    const total = {
      start: temp.end,
      end: temp.end,
      lastIndex: temp.lastIndex,
      lastEnd: temp.end,
      index: key,
      isTotal: false
    };

    const indexData = dimensionData[key];
    indexData.forEach(d => {
      let isTotalTag = false;
      if (!totalSpec || totalSpec.type === 'end') {
        if (index === indexValues.length - 1) {
          total.start = 0;
          d[startAs] = total.start;
          d[endAs] = total.end;
          isTotalTag = true;
        }
      } else if (totalSpec.type === 'field' || totalSpec.type === 'custom') {
        const tag = d[totalSpec.tagField];
        if (tag) {
          isTotalTag = true;
          if (totalSpec.type === 'custom') {
            const { start, end } = totalSpec.product(d, temp);
            d[startAs] = start;
            d[endAs] = end;
            total.end = end;
            total.start = start;
          } else {
            let start = 0;
            let end = total.end;
            // 如果有设置count， valueField 和 startField 无效
            if (totalSpec.collectCountField && !isNil(d[totalSpec.collectCountField])) {
              const startIndex = totalData.length - +d[totalSpec.collectCountField];
              const endIndex = totalData.length - 1;
              if (startIndex < 0) {
                console.warn('total.collectCountField error');
              } else {
                start = totalData[startIndex].start;
              }
              if (endIndex < 0) {
                console.warn('total.collectCountField error');
              } else {
                end = totalData[endIndex].end;
              }
            } else {
              if (totalSpec.startField && !isNil(d[totalSpec.startField])) {
                start = +d[totalSpec.startField];
              }
              if (totalSpec.valueField && !isNil(d[totalSpec.valueField])) {
                end = precisionAdd(start, +d[totalSpec.valueField]);
              }
            }
            d[startAs] = start;
            d[endAs] = end;
            d[valueField] = end - start;
            total.start = start;
            total.end = end;
          }
        }
      }
      if (!isTotalTag) {
        d[startAs] = +total.end;
        d[endAs] = precisionAdd(d[startAs], +d[valueField]);
        total.end = d[endAs];
      }
      total.isTotal = isTotalTag;

      if (isNil(seriesField) || seriesField === WaterfallDefaultSeriesField) {
        if (isTotalTag) {
          d[WaterfallDefaultSeriesField] = seriesFieldName.total;
        } else {
          d[WaterfallDefaultSeriesField] = +d[valueField] >= 0 ? seriesFieldName.increase : seriesFieldName.decrease;
        }
      }
    });
    temp = { ...total, lastIndex: key };
    totalData.push(total);
  });
  return totalData;
};

export interface IWaterfallFillEndOpt {
  indexField: string;
  valueField: string;
  seriesField?: string;
  total: IWaterfallSeriesSpec['total'];
}

export const waterfallFillTotal = (data: Array<Datum>, op: IWaterfallFillEndOpt) => {
  if (!data) {
    return data;
  }
  const { indexField, valueField, total, seriesField } = op;
  const totalData = {
    [indexField]: total?.text || 'total',
    [valueField]: data.reduce((pre, cur) => precisionAdd(pre, +cur[valueField]), 0)
  };
  if (seriesField) {
    totalData[seriesField] = 'total';
  }
  data.push(totalData);
  return data;
};
