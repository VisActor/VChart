import { BarSeries } from '../bar/bar';
import { SeriesTypeEnum } from '../interface/type';
import type { IMosaicSeriesSpec } from './interface';
export declare class MosaicSeries<T extends IMosaicSeriesSpec = IMosaicSeriesSpec> extends BarSeries<any> {
    static readonly type: string;
    type: SeriesTypeEnum;
    protected _spec: T;
    static readonly transformerConstructor: any;
    readonly transformerConstructor: any;
    getStack(): boolean;
    getPercent(): boolean;
    getGroupFields(): string[];
    setAttrFromSpec(): void;
    parseLabelStyle(labelStyle: any, labelSpec: any): any;
}
export declare const registerMosaicSeries: () => void;
