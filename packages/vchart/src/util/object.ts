import { get, pick, cloneDeep, isArray } from '@visactor/vutils';

export { get, pick, cloneDeep };

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
