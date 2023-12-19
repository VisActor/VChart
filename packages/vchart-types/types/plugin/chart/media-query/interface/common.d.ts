import type { ComponentTypeEnum } from '../../../../component/interface';
import type { IVChart } from '../../../../core';
import type { IModelSpecInfo } from '../../../../model/interface';
import type { SeriesTypeEnum } from '../../../../series';
import type { IChartSpec } from '../../../../typings';
export interface IMediaInfo {
    width: number;
    height: number;
}
export interface IMediaQueryActionFilterResult<T extends Record<string, unknown> = any> {
    isChart?: boolean;
    modelType?: 'series' | 'region' | 'component';
    type?: SeriesTypeEnum | ComponentTypeEnum;
    specKey?: keyof IChartSpec;
    modelInfo: IModelSpecInfo<T>[];
}
export interface IMediaQueryOption {
    globalInstance: IVChart;
    updateSpec: (spec: any, compile?: boolean, render?: boolean) => void;
}
export interface IMediaQueryCheckResult {
    isActive: boolean;
    hasChanged: boolean;
}
export interface IMediaQueryActionResult {
    chartSpec: any;
    hasChanged: boolean;
}
