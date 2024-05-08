import type { IRuleMark } from '../../mark/rule';
import { BarSeries } from '../bar/bar';
import type { IWaterfallSeriesSpec } from './interface';
import type { SeriesMarkMap } from '../interface';
import { SeriesTypeEnum } from '../interface/type';
import type { ITransformOptions, DataView } from '@visactor/vdataset';
import { SeriesData } from '../base/series-data';
import type { ITextMark } from '../../mark/text';
import type { IModelEvaluateOption } from '../../model/interface';
import type { Datum } from '../../typings';
import type { ILabelMark } from '../../mark/label';
import type { ILabelInfo } from '../../component/label/label';
export declare const DefaultBandWidth = 6;
export declare class WaterfallSeries<T extends IWaterfallSeriesSpec = IWaterfallSeriesSpec> extends BarSeries<any> {
    static readonly type: string;
    type: SeriesTypeEnum;
    static readonly mark: SeriesMarkMap;
    static readonly transformerConstructor: any;
    readonly transformerConstructor: any;
    protected _totalData?: SeriesData;
    getTotalData(): any;
    protected _spec: T;
    protected _leaderLineMark: IRuleMark;
    protected _stackLabelMark: ITextMark;
    protected _labelMark: ITextMark;
    protected initGroups(): void;
    setAttrFromSpec(): void;
    getSeriesKeys(): string[];
    protected initData(): void;
    initAnimation(): void;
    viewDataUpdate(d: DataView): void;
    addViewDataFilter(_option: ITransformOptions): void;
    reFilterViewData(): void;
    onEvaluateEnd(ctx: IModelEvaluateOption): void;
    initMark(): void;
    initLabelMarkStyle(labelMark: ILabelMark): void;
    initTotalLabelMarkStyle(labelMark: ILabelMark): void;
    getTotalLabelComponentStyle(info: Pick<ILabelInfo, 'baseMark' | 'labelMark'>): {
        customLayoutFunc: (labels: import("@visactor/vrender-components").LabelItem[]) => import("@visactor/vrender-core").IText[];
        dataFilter: (labels: import("@visactor/vrender-components").LabelItem[]) => import("@visactor/vrender-components").LabelItem[];
        overlap: {
            strategy: any;
        };
    };
    totalPositionX(datum: Datum, field: string, pos?: number): number;
    totalPositionY(datum: Datum, field: string, pos?: number): number;
    initMarkStyle(): void;
}
export declare const registerWaterfallSeries: () => void;
