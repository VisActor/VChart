import type { GeoSourceType } from '../../typings/geo';

export interface IMapOpt {
  nameMap: Record<string, string>;
  nameProperty: string;
}

export const map = (data: GeoSourceType, opt: IMapOpt) => {
  if (data.features) {
    data.features.forEach((f: any) => {
      if (opt.nameMap) {
        f.name = opt.nameMap[f.properties?.[opt.nameProperty]];
      } else {
        f.name = f.properties?.[opt.nameProperty];
      }
    });
  }
  return data.features;
};
