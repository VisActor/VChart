import { isNil } from '@visactor/vutils';
import type { IFieldsMeta } from '../../typings/spec';
import { couldBeValidNumber, isFunction, mergeFields } from '../../util';
import type { DataView } from '@visactor/vdataset';
import type { Datum } from '../../typings';

export const StatisticsDefault = {
  allValid: () => true,
  min: () => Number.MAX_VALUE,
  max: () => Number.MIN_VALUE,
  values: () => new Set(),
  //计算数组形式的data中的最大最小值
  'array-min': () => Number.MAX_VALUE,
  'array-max': () => Number.MIN_VALUE
};
export const StatisticsValueTransform = {
  allValid: (v: any) => v,
  min: (v: any) => (v === StatisticsDefault.min() ? 0 : v),
  max: (v: any) => (v === StatisticsDefault.max() ? 0 : v),
  values: (v: Set<string>) => Array.from(v),
  //计算数组形式的data中的最大最小值
  'array-min': (v: any) => (v === StatisticsDefault.min() ? 0 : v),
  'array-max': (v: any) => (v === StatisticsDefault.max() ? 0 : v)
};

function StatisticsMin(last: any, value: any) {
  return Math.min(last, value);
}
function StatisticsMax(last: any, value: any) {
  return Math.max(last, value);
}

function StatisticsArrayMin(last: any, valueArr: any) {
  const filteredValueArr = (valueArr ?? []).filter((v: any) => couldBeValidNumber(v));
  if (filteredValueArr.length === 0) {
    return last;
  }
  return Math.min(last, ...filteredValueArr);
}

function StatisticsArrayMax(last: any, valueArr: any) {
  const filteredValueArr = (valueArr ?? []).filter((v: any) => couldBeValidNumber(v));
  if (filteredValueArr.length === 0) {
    return last;
  }
  return Math.max(last, ...filteredValueArr);
}

function StatisticsValues(last: Set<string>, value: any) {
  if (value === undefined) {
    return last;
  }
  if (last.has(value)) {
    return last;
  }
  last.add(value);
  return last;
}

export const StatisticsMethod = {
  allValid: couldBeValidNumber,
  min: Math.min,
  max: Math.max,
  values: StatisticsValues,
  //计算数组形式的data中的最大最小值
  'array-min': StatisticsArrayMin,
  'array-max': StatisticsArrayMax
};

export type StatisticOperations = Array<'max' | 'min' | 'values' | 'array-max' | 'array-min' | 'allValid'>;

export interface IStatisticsOption {
  fields: {
    key: string;
    operations: StatisticOperations;
    customize?: { max: number; min: number } | any[];
  }[];
  // operations: Array<'max' | 'min' | 'values'>;
  target?: 'parser' | 'latest';
  fieldFollowSource?: (key: string) => boolean;
  sourceStatistics?: () => { [key: string]: unknown };
}

/**
 * 聚合统计主要用于处理数据(诸如统计平均值,求和等),并返回计算后的数据结果
 * @param data
 * @param options
 * @returns
 */
export const dimensionStatistics = (data: Array<DataView>, op: IStatisticsOption) => {
  const result = {};
  // const operations = op.operations;
  let fields = op.fields;
  if (isFunction(fields)) {
    fields = fields();
  }
  if (!fields?.length || !data?.length) {
    return result;
  }

  const sourceStatistics = op.sourceStatistics?.();
  const fieldFollowSource = op.fieldFollowSource;

  // merge same key
  fields = mergeFields([], fields);

  const dataKey = op.target === 'parser' ? 'parserData' : 'latestData';
  const latestData = data[0][dataKey] ? data[0][dataKey] : data || [];
  const dataFields = data[0].getFields?.() as Record<
    /** 字段key */
    string,
    IFieldsMeta
  >;
  fields.forEach(f => {
    // NOTE: the same key in fields has been merge already
    result[f.key] = {};
    const dataFiledInKey = dataFields?.[f.key];
    if (sourceStatistics && fieldFollowSource && fieldFollowSource(f.key) && sourceStatistics[f.key]) {
      result[f.key] = sourceStatistics[f.key];
      return;
    }
    let willMin: boolean = false;
    let willMax: boolean = false;
    let willValid: boolean = false;
    const operations: StatisticOperations = [];
    f.operations.forEach(o => {
      if (o === 'max') {
        willMax = true;
      } else if (o === 'min') {
        willMin = true;
      } else if (o === 'allValid') {
        willValid = true;
      } else {
        operations.push(o);
      }
    });

    operations.forEach(op => {
      // @chensij 如果指定了计算的domain结果，则忽略计算（目前该逻辑仅在dot series中维护，因为dot series期望在filter data之后x轴改变domain，y轴不改变domain）
      if (f.customize) {
        result[f.key][op] = f.customize;
      } else {
        if (dataFiledInKey && dataFiledInKey.lockStatisticsByDomain && !isNil(dataFiledInKey.domain)) {
          if (op === 'values') {
            result[f.key][op] = [...dataFiledInKey.domain];
            return;
          }
        }
        result[f.key][op] = StatisticsDefault[op]();
        const isValues = op === 'values';
        latestData.forEach((d: Datum) => {
          if (!d) {
            return;
          }
          const value = d[f.key];
          if (isValues) {
            StatisticsMethod[op](result[f.key][op], value);
          } else {
            result[f.key][op] = StatisticsMethod[op](result[f.key][op], value);
          }
        });
        result[f.key][op] = StatisticsValueTransform[op](result[f.key][op]);
        if (op === 'array-max') {
          result[f.key].max = result[f.key][op];
        }
        if (op === 'array-min') {
          result[f.key].min = result[f.key][op];
        }
      }
    });

    // min max valid
    if (willMin || willMax || willValid) {
      if (f.customize) {
        if (willMin) {
          result[f.key].min = f.customize;
        }
        if (willMax) {
          result[f.key].max = f.customize;
        }
      } else {
        if (dataFiledInKey && dataFiledInKey.lockStatisticsByDomain && !isNil(dataFiledInKey.domain)) {
          if (willMin) {
            result[f.key][op] = Math.min(...(dataFiledInKey.domain as number[]));
          }
          if (willMax) {
            result[f.key][op] = Math.max(...(dataFiledInKey.domain as number[]));
          }
        }
        if (willMin) {
          result[f.key].min = StatisticsDefault.min();
        }
        if (willMax) {
          result[f.key].max = StatisticsDefault.max();
        }
        result[f.key].allValid = StatisticsDefault.allValid();
        latestData.forEach((d: Datum) => {
          if (!d) {
            return;
          }

          const value = d[f.key];
          if (!couldBeValidNumber(value)) {
            if (result[f.key].allValid) {
              result[f.key].allValid = false;
            }
          } else {
            if (willMin && result[f.key].min > value) {
              result[f.key].min = value;
            } else if (willMax && result[f.key].max < value) {
              result[f.key].max = value;
            }
          }
        });
        if (willMin) {
          result[f.key].min = StatisticsValueTransform.min(result[f.key].min);
        }
        if (willMax) {
          result[f.key].max = StatisticsValueTransform.max(result[f.key].max);
        }
        result[f.key].allValid = StatisticsValueTransform.allValid(result[f.key].allValid);
      }
    }
  });
  return result;
};
