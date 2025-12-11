import type { GeoSourceType } from '../../typings/geo';
export interface IMapOpt {
    nameMap: Record<string, string>;
    nameProperty: string;
}
export declare const map: (data: GeoSourceType, opt: IMapOpt) => any;
