import { isNil } from '@visactor/vutils';
import type { IFieldsMeta } from '../../typings/spec';
import { couldBeValidNumber, isFunction, mergeFields } from '../../util';
import type { DataView } from '@visactor/vdataset';

export const StatisticsDefault = {
  min: () => Number.MAX_VALUE,
  max: () => Number.MIN_VALUE,
  values: () => new Set(),
  //计算数组形式的data中的最大最小值
  'array-min': () => Number.MAX_VALUE,
  'array-max': () => Number.MIN_VALUE
};
export const StatisticsValueTransform = {
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
  min: Math.min,
  max: Math.max,
  values: StatisticsValues,
  //计算数组形式的data中的最大最小值
  'array-min': StatisticsArrayMin,
  'array-max': StatisticsArrayMax
};

export type StatisticOperations = Array<'max' | 'min' | 'values' | 'array-max' | 'array-min'>;

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
    // default value
    f.operations.forEach(op => {
      // @chensij 如果指定了计算的domain结果，则忽略计算（目前该逻辑仅在dot series中维护，因为dot series期望在filter data之后x轴改变domain，y轴不改变domain）
      if (f.customize) {
        result[f.key][op] = f.customize;
      } else {
        if (dataFiledInKey && dataFiledInKey.lockStatisticsByDomain && !isNil(dataFiledInKey.domain)) {
          if (op === 'min') {
            result[f.key][op] = Math.min(...(dataFiledInKey.domain as number[]));
            return;
          }
          if (op === 'max') {
            result[f.key][op] = Math.max(...(dataFiledInKey.domain as number[]));
            return;
          }
          if (op === 'values') {
            result[f.key][op] = [...dataFiledInKey.domain];
            return;
          }
        }
        result[f.key][op] = StatisticsDefault[op]();
        const isValueOp = op === 'min' || op === 'max';
        const isMin = op === 'min';
        const isMax = op === 'max';
        const isValues = op === 'values';
        if (isValueOp && isNil(result[f.key].allValid)) {
          result[f.key].allValid = true;
        }
        latestData.forEach((d: any) => {
          if (!d) {
            return;
          }
          const value = d[f.key];
          if (isValueOp) {
            if (!couldBeValidNumber(value)) {
              result[f.key].allValid && (result[f.key].allValid = false);
            } else {
              if (isMin && result[f.key][op] > value) {
                result[f.key][op] = value;
              } else if (isMax && result[f.key][op] < value) {
                result[f.key][op] = value;
              }
            }
          } else if (isValues) {
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
  });
  return result;
};
