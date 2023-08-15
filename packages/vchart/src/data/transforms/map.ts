import { DEFAULT_DATA_INDEX, PREFIX } from '../../constant';
import type { GeoSourceType } from '../../typings/geo';

export interface IMapOpt {
  nameMap: Record<string, string>;
  nameProperty: string;
}

export const DEFAULT_MAP_LOOK_UP_KEY = `${PREFIX}_MAP_LOOK_UP_KEY`;

export const map = (data: GeoSourceType, opt: IMapOpt) => {
  if (data.features) {
    data.features.forEach((f: any, index: number) => {
      f[DEFAULT_DATA_INDEX] = index;
      if (opt.nameMap) {
        f[DEFAULT_MAP_LOOK_UP_KEY] = opt.nameMap[f.properties?.[opt.nameProperty]];
      } else {
        f[DEFAULT_MAP_LOOK_UP_KEY] = f.properties?.[opt.nameProperty];
      }
    });
  }
  return data.features;
};
