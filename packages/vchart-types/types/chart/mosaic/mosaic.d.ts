import type { IMosaicChartSpec } from './interface';
import { MosaicChartSpecTransformer } from './mosaic-transformer';
import { BaseChart } from '../base';
import type { IRegion } from '../../region';
import type { IStackCacheRoot } from '../../util/data';
export declare class MosaicChart<T extends IMosaicChartSpec = IMosaicChartSpec> extends BaseChart<T> {
    static readonly type: string;
    static readonly seriesType: string;
    static readonly transformerConstructor: typeof MosaicChartSpecTransformer;
    readonly transformerConstructor: typeof MosaicChartSpecTransformer;
    readonly type: string;
    readonly seriesType: string;
    protected _canStack: boolean;
    afterCompile(): void;
    protected _initStack(): void;
    handleAfterStackRegion: (region: IRegion, stackValueGroup: {
        [key: string]: IStackCacheRoot;
    }) => void;
}
export declare const registerMosaicChart: () => void;
