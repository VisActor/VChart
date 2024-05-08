import type { DataView } from '@visactor/vdataset';
import type { IAggrType, IMarkerSupportSeries } from '../../component/marker/interface';
import type { Datum, StringOrNumber } from '../../typings';

import { isArray, isFunction, isPlainObject, isValid } from '@visactor/vutils';
import { variance, average, min, max, sum, standardDeviation, median } from '../../util/math';

export type IOption = {
  field: string;
};

export type IOptionAggrField = {
  field: string;
  aggrType: IAggrType;
};

export type IOptionPos = IOptionAggrField | string | number | StringOrNumber[];

export type IOptionSeries = {
  getRelativeSeries: () => IMarkerSupportSeries;
  getStartRelativeSeries: () => IMarkerSupportSeries;
  getEndRelativeSeries: () => IMarkerSupportSeries;
};

export type IOptionCallback = (
  relativeSeriesData: any,
  startRelativeSeriesData: any,
  endRelativeSeriesData: any,
  relativeSeries: IMarkerSupportSeries,
  startRelative: IMarkerSupportSeries,
  endRelative: IMarkerSupportSeries
) => IOptionPos;

export type IOptionAggr = {
  x?: IOptionPos | IOptionCallback;
  y?: IOptionPos | IOptionCallback;
  angle?: IOptionPos | IOptionCallback;
  radius?: IOptionPos | IOptionCallback;
  areaName?: string | IOptionCallback;
  getRefRelativeSeries?: () => IMarkerSupportSeries;
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
  const results: {
    x: StringOrNumber[] | StringOrNumber | IOptionCallback | null;
    y: StringOrNumber[] | StringOrNumber | IOptionCallback | null;
    angle: StringOrNumber[] | StringOrNumber | IOptionCallback | null;
    radius: StringOrNumber[] | StringOrNumber | IOptionCallback | null;
    areaName: string | IOptionCallback | null;
  }[] = [];
  options.forEach(option => {
    const result: {
      x: StringOrNumber[] | StringOrNumber | null;
      y: StringOrNumber[] | StringOrNumber | null;
      angle: StringOrNumber[] | StringOrNumber | null;
      radius: StringOrNumber[] | StringOrNumber | null;
      areaName: string | null;
      getRefRelativeSeries?: () => IMarkerSupportSeries;
    } = { x: null, y: null, angle: null, radius: null, areaName: null };

    if (isValid(option.x)) {
      const x = option.x;

      if (isArray(x)) {
        result.x = x.map(item => getFinalValue(item, _data, option)) as StringOrNumber[];
      } else {
        result.x = getFinalValue(x, _data, option) as StringOrNumber;
      }
    }
    if (isValid(option.y)) {
      const y = option.y;
      if (isArray(y)) {
        result.y = y.map(item => getFinalValue(item, _data, option)) as StringOrNumber[];
      } else {
        result.y = getFinalValue(y, _data, option) as StringOrNumber;
      }
    }
    if (isValid(option.angle)) {
      const angle = option.angle;
      if (isArray(angle)) {
        result.angle = angle.map(item => getFinalValue(item, _data, option)) as StringOrNumber[];
      } else {
        result.angle = getFinalValue(angle, _data, option) as StringOrNumber;
      }
    }
    if (isValid(option.radius)) {
      const radius = option.radius;
      if (isArray(radius)) {
        result.radius = radius.map(item => getFinalValue(item, _data, option)) as StringOrNumber[];
      } else {
        result.radius = getFinalValue(radius, _data, option) as StringOrNumber;
      }
    }
    if (isValid(option.areaName)) {
      const name = option.areaName;
      result.areaName = getFinalValue(name, _data, option) as string;
    }
    if (option.getRefRelativeSeries) {
      result.getRefRelativeSeries = option.getRefRelativeSeries;
    }
    results.push(result);
  });

  return results;
}

const aggrMap = {
  min: markerMin,
  max: markerMax,
  sum: markerSum,
  average: markerAverage,
  variance: markerVariance,
  standardDeviation: markerStandardDeviation,
  median: markerMedian
};

function getFinalValue(source: IOptionPos | IOptionCallback, _data: Array<DataView>, option: IOptionAggr) {
  const relativeSeries = option.getRelativeSeries();
  const startSeries = option.getStartRelativeSeries();
  const endSeries = option.getEndRelativeSeries();
  const relativeSeriesData = relativeSeries.getData().getLatestData();
  const startRelativeSeriesData = startSeries.getData().getLatestData();
  const endRelativeSeriesData = endSeries.getData().getLatestData();

  if (isFunction(source)) {
    return source(
      relativeSeriesData,
      startRelativeSeriesData,
      endRelativeSeriesData,
      relativeSeries,
      startSeries,
      endSeries
    ) as StringOrNumber[] | StringOrNumber;
  }
  if (isPlainObject(source)) {
    const { aggrType, field } = source as IOptionAggrField;
    return aggrMap[aggrType](_data, { field: field });
  }

  return source;
}
