import { IWordCloudChartSpec } from './interface';
import { BaseWordCloudChart } from './base/base';
import { BaseWordCloudChartSpecTransformer } from './base/word-cloud-base-transformer';
export declare class WordCloudChart<T extends IWordCloudChartSpec = IWordCloudChartSpec> extends BaseWordCloudChart<T> {
    static readonly type: string;
    static readonly seriesType: string;
    static readonly transformerConstructor: {
        new (option: import("../interface").IChartSpecTransformerOption): BaseWordCloudChartSpecTransformer<IWordCloudChartSpec>;
    };
    readonly transformerConstructor: {
        new (option: import("../interface").IChartSpecTransformerOption): BaseWordCloudChartSpecTransformer<IWordCloudChartSpec>;
    };
    readonly type: string;
    readonly seriesType: string;
}
export declare const registerWordCloudChart: () => void;
export declare const registerWordCloudShapeChart: () => void;
