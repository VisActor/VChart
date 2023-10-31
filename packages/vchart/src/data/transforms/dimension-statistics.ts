import { isNil, isFunction } from '@visactor/vutils';
import type { IFieldsMeta } from '../../typings/spec';
import { couldBeValidNumber } from '../../util/type';
import { mergeFields } from '../../util/data';
import type { DataView } from '@visactor/vdataset';
import type { Datum } from '../../typings';

const methods = {
  min: (arr: any[]) => {
    return arr.length ? Math.min.apply(null, arr) : 0;
  },
  max: (arr: any[]) => {
    return arr.length ? Math.max.apply(null, arr) : 0;
  },
  'array-min': (arr: any[]) => {
    return arr.length ? Math.min.apply(null, arr) : 0;
  },
  'array-max': (arr: any[]) => {
    return arr.length ? Math.max.apply(null, arr) : 0;
  },
  values: (arr: any[]) => {
    const map = {};
    const res: any[] = [];

    for (const entry of arr) {
      if (!map[entry]) {
        res.push(entry);
        map[entry] = 1;
      }
    }

    return res;
  }
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
    const key = f.key;
    // NOTE: the same key in fields has been merge already
    result[key] = {};
    const dataFieldInKey = dataFields?.[key];
    if (sourceStatistics && fieldFollowSource && fieldFollowSource(key) && sourceStatistics[key]) {
      result[key] = sourceStatistics[key];
      return;
    }
    const operations: StatisticOperations = f.operations;
    const isNumberField = operations.some(op => op === 'min' || op === 'max' || op === 'allValid');
    let allValid = true;
    let fValues: any[] = latestData.reduce((res: any[], d: Datum) => {
      if (d) {
        res.push(d[key]);
      }
      return res;
    }, []);
    const len = fValues.length;

    if (isNumberField) {
      fValues = fValues.filter(couldBeValidNumber);
      allValid = fValues.length === len;
    } else if (operations.some(op => op === 'array-min' || op === 'array-max')) {
      fValues = fValues.reduce((res, entry) => {
        if (entry) {
          entry.forEach((d: any) => {
            if (couldBeValidNumber(d)) {
              res.push(d);
            }
          });
        }

        return res;
      }, []);
    } else {
      fValues = fValues.filter((entry: any) => entry !== undefined);
    }

    operations.forEach(op => {
      // @chensij 如果指定了计算的domain结果，则忽略计算（目前该逻辑仅在dot series中维护，因为dot series期望在filter data之后x轴改变domain，y轴不改变domain）
      if (f.customize) {
        result[key][op] = f.customize;
      } else {
        if (dataFieldInKey && dataFieldInKey.lockStatisticsByDomain && !isNil(dataFieldInKey.domain)) {
          if (op === 'values') {
            result[key][op] = [...dataFieldInKey.domain];
            return;
          }
        } else if (op === 'allValid') {
          return;
        }

        result[key][op] = methods[op](fValues);

        if (op === 'array-max') {
          result[key].max = result[key][op];
        }
        if (op === 'array-min') {
          result[key].min = result[key][op];
        }
      }
    });

    if (isNumberField) {
      result[key].allValid = allValid;
    }
  });

  return result;
};
