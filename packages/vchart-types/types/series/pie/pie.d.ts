import type { Maybe, IPoint, Datum, StateValueType } from '../../typings';
import type { IModelLayoutOption } from '../../model/interface';
import { PolarSeries } from '../polar/polar';
import type { IMark } from '../../mark/interface';
import { MarkTypeEnum } from '../../mark/interface/type';
import type { IArcMark } from '../../mark/arc';
import type { ITextMark } from '../../mark/text';
import type { IPathMark } from '../../mark/path';
import type { IArcSeries, SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import type { IArcLabelSpec, IPieSeriesSpec, IPieSeriesTheme } from './interface';
import { SeriesData } from '../base/series-data';
type IBasePieSeriesSpec = Omit<IPieSeriesSpec, 'type'> & {
    type: string;
};
export declare class BasePieSeries<T extends IBasePieSeriesSpec> extends PolarSeries<T> implements IArcSeries {
    protected _pieMarkName: SeriesMarkNameEnum;
    protected _pieMarkType: MarkTypeEnum;
    static readonly mark: SeriesMarkMap;
    protected _viewDataLabel: SeriesData;
    protected _center: IPoint | null;
    get center(): IPoint;
    protected _centerOffset: number;
    protected _cornerRadius: number;
    protected _startAngle: number;
    protected _endAngle: number;
    protected _padAngle: number;
    protected _pieMark: IArcMark | null;
    protected _labelMark: ITextMark | null;
    protected _labelLineMark: IPathMark | null;
    protected _theme: Maybe<IPieSeriesTheme>;
    protected _buildMarkAttributeContext(): void;
    setAttrFromSpec(): void;
    initData(): void;
    initMark(): void;
    initMarkStyle(): void;
    protected initTooltip(): void;
    initMarkStyleWithSpec(mark?: IMark, spec?: any, key?: string): void;
    initLabelMarkStyle(textMark: ITextMark): void;
    afterInitMark(): void;
    initEvent(): void;
    initGroups(): void;
    onLayoutEnd(ctx: IModelLayoutOption): void;
    getDimensionField(): string[];
    getMeasureField(): string[];
    private viewDataLabelUpdate;
    protected generateRadiusStyle(spec: any): any;
    protected computeLayoutRadius(): number;
    computeCenter(datum: Datum): IPoint;
    protected generateLinePath(state: StateValueType): {
        path: (datum: Datum) => string;
    };
    getRadius(state?: StateValueType): number;
    getInnerRadius(state?: StateValueType): number;
    getLabelConfig(): IArcLabelSpec;
    computeRadius(r: number, k?: number): number;
    computeDatumRadius(datum: Datum, state?: string): number;
    _compareSpec(ignoreCheckKeys?: {
        [key: string]: true;
    }): {
        change: boolean;
        reMake: boolean;
        reRender: boolean;
        reSize: boolean;
        reCompile: boolean;
    };
    computeDatumInnerRadius(datum: Datum, state?: string): number;
    dataToPosition(datum: Datum): IPoint | null;
    dataToCentralPosition: (datum: Datum) => IPoint | null;
    initAnimation(): void;
    getDefaultShapeType(): string;
    getGroupFields(): string[];
    getStackGroupFields(): string[];
    getStackValueField(): string;
    protected _noAnimationDataKey(datum: Datum, index: number): number;
    getActiveMarks(): IMark[];
    protected _mergeThemeToSpec(): void;
}
export declare class PieSeries<T extends IPieSeriesSpec = IPieSeriesSpec> extends BasePieSeries<T> implements IArcSeries {
    static readonly type: string;
    type: SeriesTypeEnum;
}
export declare const registerPieSeries: () => void;
export {};
