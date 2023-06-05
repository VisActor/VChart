import type { IRegion, ISeriesFilter } from '../region/interface';
import type { ISeries } from '../series/interface';
import { isFunction } from './type';

export function eachSeries(regions: IRegion[], callback: (s: ISeries) => boolean | void, filter?: ISeriesFilter) {
  let flag = false;
  if (callback && isFunction(callback)) {
    for (const r of regions) {
      for (const s of r.getSeries(filter)) {
        flag = !!callback.call(null, s);
        if (flag) {
          return flag;
        }
      }
    }
  }
  return flag;
}

export function getSeries(regions: IRegion[], filter?: ISeriesFilter) {
  const result: ISeries[] = [];
  for (const r of regions) {
    for (const s of r.getSeries(filter)) {
      result.push(s);
    }
  }
  return result;
}
