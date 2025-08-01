import type { SeriesMarkMap } from '../interface';
import { SeriesTypeEnum } from '../interface/type';
import type { Datum, ILiquidMarkSpec, IPoint } from '../../typings';
import type { ILiquidSeriesSpec } from './interface';
import type { IMark, IMarkRaw } from '../../mark/interface';
import { LineLikeSeriesSpecTransformer } from '../mixin/line-mixin-transformer';
import { BaseSeries } from '../base';
import type { DataView } from '@visactor/vdataset';
export type ILiquidMark = IMarkRaw<ILiquidMarkSpec>;
export declare class LiquidSeries<T extends ILiquidSeriesSpec = ILiquidSeriesSpec> extends BaseSeries<T> {
    static readonly type: string;
    type: SeriesTypeEnum;
    static readonly mark: SeriesMarkMap;
    static readonly builtInTheme: {
        liquid: import("./interface").ILiquidSeriesTheme;
    };
    static readonly transformerConstructor: typeof LineLikeSeriesSpecTransformer;
    readonly transformerConstructor: typeof LineLikeSeriesSpecTransformer;
    private _liquidGroupMark?;
    private _liquidMark?;
    private _liquidBackgroundMark?;
    private _liquidOutlineMark?;
    private _paddingSpec?;
    private _marginSpec?;
    private _heightRatio?;
    private _reverse?;
    private _maskShape?;
    protected _valueField?: string;
    setValueField(field: string): void;
    getValueField(): string;
    setAttrFromSpec(): void;
    viewDataUpdate(d: DataView): void;
    initMark(): void;
    initMarkStyle(): void;
    private _initLiquidOutlineMark;
    private _initLiquidBackgroundMark;
    private _initLiquidMark;
    protected _buildMarkAttributeContext(): void;
    private _getLiquidPosY;
    private _getLiquidHeight;
    private _getLiquidBackPosAndSize;
    private _getLiquidBackPath;
    private _initLiquidOutlineMarkStyle;
    private _initLiquidBackgroundMarkStyle;
    private _initLiquidMarkStyle;
    protected initTooltip(): void;
    getInteractionTriggers(): {
        trigger: Partial<import("../../interaction/interface/trigger").IBaseTriggerOptions>;
        marks: IMark[];
    }[];
    initAnimation(): void;
    protected initEvent(): void;
    dataToPosition(data: Datum): IPoint;
    dataToPositionX(data: Datum): number;
    dataToPositionY(data: Datum): number;
    valueToPosition(value1: any, value2?: any): IPoint;
    getStatisticFields(): any[];
    getGroupFields(): string[];
    getStackGroupFields(): string[];
    getStackValueField(): string;
    getActiveMarks(): IMark[];
}
export declare const registerLiquidSeries: () => void;
