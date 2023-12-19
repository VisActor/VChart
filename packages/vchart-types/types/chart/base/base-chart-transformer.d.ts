import type { IChartSpec } from '../../typings';
import type { IChartSpecInfo, IChartSpecTransformer, IChartSpecTransformerOption } from '../interface';
import type { IModelConstructor, IModelSpecInfo } from '../../model/interface';
import type { IRegionConstructor } from '../../region/interface';
import type { ISeriesConstructor } from '../../series';
import type { IComponentConstructor } from '../../component/interface/common';
export declare class BaseChartSpecTransformer<T extends IChartSpec> implements IChartSpecTransformer {
    readonly type: string;
    readonly seriesType: string;
    protected _option: IChartSpecTransformerOption;
    constructor(option: IChartSpecTransformerOption);
    initChartSpec(chartSpec: T): IChartSpecInfo;
    transformSpec(chartSpec: T): void;
    transformModelSpec(chartSpec: T): IChartSpecInfo;
    createSpecInfo(chartSpec: T, transform?: (constructor: IModelConstructor, specInfo: IModelSpecInfo, chartSpecInfo?: IChartSpecInfo) => void): IChartSpecInfo;
    protected _isValidSeries(seriesType: string): boolean;
    protected _getDefaultSeriesSpec(chartSpec: any): any;
    forEachRegionInSpec<K>(chartSpec: T, callbackfn: (constructor: IRegionConstructor, specInfo: IModelSpecInfo, chartSpecInfo?: IChartSpecInfo) => K, chartSpecInfo?: IChartSpecInfo): K[];
    forEachSeriesInSpec<K>(chartSpec: T, callbackfn: (constructor: ISeriesConstructor, specInfo: IModelSpecInfo, chartSpecInfo?: IChartSpecInfo) => K, chartSpecInfo?: IChartSpecInfo): K[];
    forEachComponentInSpec<K>(chartSpec: T, callbackfn: (constructor: IComponentConstructor, specInfo: IModelSpecInfo, chartSpecInfo?: IChartSpecInfo) => K, chartSpecInfo?: IChartSpecInfo): K[];
}
