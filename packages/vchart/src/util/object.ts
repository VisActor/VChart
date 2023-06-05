import { get, pick, merge, cloneDeep, isArray } from '@visactor/vutils';

export { get, pick, merge, cloneDeep };

export function removeEmpty<T extends object>(obj: T): Partial<T> {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') {
      removeEmpty(obj[key]);
    } else if (obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
}

export function sortByKey<T extends object>(object: T, includeKeys?: string[], excludeKeys?: string[]): Partial<T> {
  return Object.keys(object)
    .sort()
    .reduce((obj, key) => {
      if (includeKeys) {
        includeKeys.includes(key) && (obj[key] = object[key]);
      } else if (excludeKeys) {
        !excludeKeys.includes(key) && (obj[key] = object[key]);
      }
      return obj;
    }, {} as T);
}

export function field(f: string | string[]) {
  return function (datum: any) {
    let value: any;
    if (!isArray(f)) {
      value = datum?.[f];
    } else {
      value = f.reduce((cur, g) => cur?.[g], datum);
    }
    return value;
  };
}
