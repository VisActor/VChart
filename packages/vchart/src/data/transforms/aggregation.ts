import type { DataView } from '@visactor/vdataset';
import type { IAggrType } from '../../component/marker/interface';
import type { ICartesianSeries } from '../../series/interface';

import { isValid, isFunction, min, max } from '@visactor/vutils';
import { average, sum, standardDeviation, variance, median } from '../../util/math';
import type { Datum } from '../../typings';

export type IOption = {
  field: string;
};

export type IOptionAggrField = {
  field: string;
  aggrType: IAggrType;
};

export type IOptionPos = IOptionAggrField | string | number;

export type IOptionSeries = {
  getRelativeSeries: () => ICartesianSeries;
  getStartRelativeSeries: () => ICartesianSeries;
  getEndRelativeSeries: () => ICartesianSeries;
};

export type IOptionCallback = (
  relativeSeriesData: any,
  startRelativeSeriesData: any,
  endRelativeSeriesData: any
) => IOptionPos;

export type IOptionAggr = {
  x?: IOptionPos | IOptionCallback;
  y?: IOptionPos | IOptionCallback;
  getRefRelativeSeries?: () => ICartesianSeries;
} & IOptionSeries;

export const markerMin = (_data: Array<DataView>, opt: IOption) => {
  const data = _data[0].latestData as Datum[];

  return min(data, opt.field);
};
export const markerMax = (_data: Array<DataView>, opt: IOption) => {
  const data = _data[0].latestData as Datum[];

  return max(data, opt.field);
};

export function markerSum(_data: Array<DataView>, opt: IOption) {
  const data = _data[0].latestData;

  return sum(data, opt.field);
}
export function markerAverage(_data: Array<DataView>, opt: IOption) {
  const data = _data[0].latestData;

  return average(data, opt.field);
}

export function markerVariance(_data: Array<DataView>, opt: IOption) {
  const data = _data[0].latestData;

  return variance(data, opt.field);
}

export function markerStandardDeviation(_data: Array<DataView>, opt: IOption) {
  const data = _data[0].latestData;

  return standardDeviation(data, opt.field);
}

export function markerMedian(_data: Array<DataView>, opt: IOption) {
  const data = _data[0].latestData;

  return median(data, opt.field);
}

export function markerAggregation(_data: Array<DataView>, options: IOptionAggr[]) {
  const aggrMap = {
    min: markerMin,
    max: markerMax,
    sum: markerSum,
    average: markerAverage,
    variance: markerVariance,
    standardDeviation: markerStandardDeviation,
    median: markerMedian
  };
  const results: {
    x: string | number | null;
    y: string | number | null;
  }[] = [];

  options.forEach(option => {
    const result: {
      x: string | number | null;
      y: string | number | null;
      getRefRelativeSeries?: () => ICartesianSeries;
    } = { x: null, y: null };

    const relativeSeriesData = option.getRelativeSeries().getData().getLatestData();
    const startRelativeSeriesData = option.getStartRelativeSeries().getData().getLatestData();
    const endRelativeSeriesData = option.getEndRelativeSeries().getData().getLatestData();

    if (isValid(option.x)) {
      let x = option.x;
      if (isFunction(x)) {
        x = x(relativeSeriesData, startRelativeSeriesData, endRelativeSeriesData);
      }
      if (typeof x === 'string' || typeof x === 'number') {
        result.x = x;
      } else {
        const { aggrType, field } = x;
        result.x = aggrMap[aggrType](_data, { field: field });
      }
    }
    if (isValid(option.y)) {
      let y = option.y;
      if (isFunction(y)) {
        y = y(relativeSeriesData, startRelativeSeriesData, endRelativeSeriesData);
      }
      if (typeof y === 'string' || typeof y === 'number') {
        result.y = y;
      } else {
        const { aggrType, field } = y;
        result.y = aggrMap[aggrType](_data, { field: field });
      }
    }
    if (option.getRefRelativeSeries) {
      result.getRefRelativeSeries = option.getRefRelativeSeries;
    }
    results.push(result);
  });

  return results;
}
