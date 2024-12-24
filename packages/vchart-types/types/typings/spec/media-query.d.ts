import type { ComponentTypeEnum } from '../../component/interface';
import type { IVChart } from '../../core/interface';
import type { IModelSpecInfo } from '../../model/interface';
import type { SeriesTypeEnum } from '../../series/interface/type';
import type { IChartSpec } from './common';
export interface IMediaInfo {
    width: number;
    height: number;
}
export type IMediaQuerySpec = IMediaQueryItem[];
export interface IMediaQueryItem {
    query: IMediaQueryCondition;
    action: IMediaQueryAction | IMediaQueryAction[];
}
export interface IMediaQueryCondition {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    onResize?: (info: IMediaInfo, vchart: IVChart) => boolean;
}
export interface IMediaQueryAction<T extends Record<string, unknown> = any> {
    spec: Partial<T> | ((filteredModelInfo: IModelSpecInfo<T>[], action: IMediaQueryAction<T>, query: IMediaQueryCondition) => Partial<T>);
    filterType?: MediaQueryActionFilterType;
    filter?: MediaQueryActionFilter<T> | Array<MediaQueryActionFilter<T>>;
    forceAppend?: boolean;
}
export type MediaQueryActionFilterType = 'region' | 'series' | 'chart' | `${SeriesTypeEnum}` | `${ComponentTypeEnum}` | keyof IChartSpec;
export type MediaQueryActionFilter<T extends Record<string, unknown> = any> = Partial<T> | ((modelInfo: IModelSpecInfo<T>, action: IMediaQueryAction<T>, query: IMediaQueryCondition) => boolean);
