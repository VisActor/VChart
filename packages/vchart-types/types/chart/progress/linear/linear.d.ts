import type { ILinearProgressChartSpec } from './interface';
import { LinearProgressChartSpecTransformer } from './linear-progress-transformer';
import { BaseChart } from '../../base';
export declare class LinearProgressChart<T extends ILinearProgressChartSpec = ILinearProgressChartSpec> extends BaseChart<T> {
    static readonly type: string;
    static readonly seriesType: string;
    static readonly view: string;
    static readonly transformerConstructor: typeof LinearProgressChartSpecTransformer;
    readonly transformerConstructor: typeof LinearProgressChartSpecTransformer;
    readonly type: string;
    readonly seriesType: string;
    protected _canStack: boolean;
}
export declare const registerLinearProgressChart: () => void;
