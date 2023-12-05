import type { IChartSpec } from '../typings';
import type { ICartesianChartSpec } from './cartesian/interface';
import type { IChartOption } from './interface/common';
import type { IUpdateSpecResult } from '../model/interface';
export declare function setDefaultCrosshairForCartesianChart(spec: ICartesianChartSpec): void;
export declare function calculateChartSize(spec: {
    width: number;
    height: number;
}, option: Pick<IChartOption, 'canvas' | 'container' | 'mode' | 'modeParams'>): {
    width: number;
    height: number;
};
export declare function mergeUpdateResult(resultA: IUpdateSpecResult, resultB: IUpdateSpecResult): IUpdateSpecResult;
export declare function getTrimPaddingConfig(chartType: string, spec: IChartSpec): {
    paddingInner: number;
    paddingOuter: number;
} | {
    paddingOuter: number;
    paddingInner?: undefined;
};
