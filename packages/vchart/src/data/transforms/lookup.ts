import type { DataView } from '@visactor/vdataset';
import { isFunction, isNil, isValid } from '@visactor/vutils';
import type { Datum } from '../../typings';

export interface ILookUpOpt {
  from: () => object[];
  key: string;
  // 暂时不支持Multi-field lookup
  fields: string;
  values?: string[];
  as?: string[];
  default?: any;
  set?: (A: Datum, B: Datum) => void;
}

export const lookup = (data: Array<DataView>, opt: ILookUpOpt) => {
  if (!opt.from || !opt.from()) {
    return data;
  }

  const fields = opt.fields;
  const key = opt.key;
  const values = opt.values;
  const defaultValue = opt.default;
  const as = opt.as || [fields];
  const index = opt.from().reduce(function (map: Map<string, object>, obj) {
    if (obj[fields]) {
      map.set(obj[fields], obj);
    }
    return map;
  }, new Map<string, object>());

  let set: (d: any) => void;
  if (isFunction(opt.set)) {
    set = function (d: any) {
      const v = (index as Map<string, object>).get(d[key]);
      opt.set(d, v);
    };
  } else if (values) {
    const m = values.length;
    set = function (d: any) {
      const v = (index as Map<string, object>).get(d[key]);
      if (isNil(v)) {
        for (let i = 0; i < m; ++i) {
          d[as[i]] = defaultValue;
        }
      } else {
        for (let i = 0; i < m; ++i) {
          d[as[i]] = v[values[i]];
        }
      }
    };
  } else {
    set = function (d: any) {
      const v = (index as Map<string, object>).get(d[key]);
      d[as[0]] = isValid(v) ? v : defaultValue;
    };
  }

  if (data.length === 0) {
    return [];
  }
  return data.map(d => {
    set(d);
    return d;
  });
};
