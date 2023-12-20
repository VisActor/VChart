import type { IWordCloudChartSpec } from './interface';
import { BaseWordCloudChart } from './base/base';
import { WordCloudChartSpecTransformer } from './word-cloud-transformer';
export declare class WordCloudChart<T extends IWordCloudChartSpec = IWordCloudChartSpec> extends BaseWordCloudChart<T> {
    static readonly type: string;
    static readonly seriesType: string;
    static readonly view: string;
    static readonly transformerConstructor: typeof WordCloudChartSpecTransformer;
    readonly transformerConstructor: typeof WordCloudChartSpecTransformer;
    readonly type: string;
    readonly seriesType: string;
}
export declare const registerWordCloudChart: () => void;
export declare const registerWordCloudShapeChart: () => void;
