import type { IMark } from '../../mark/interface';
import { MarkTypeEnum } from '../../mark/interface/type';
import type { SeriesMarkMap } from '../interface';
import { SeriesTypeEnum } from '../interface/type';
import type { IGaugePointerSeriesSpec, PinMarkSpec, PointerMarkSpec } from './interface';
import type { Datum } from '../../typings';
import { ProgressLikeSeries } from '../polar/progress-like';
export declare class GaugePointerSeries<T extends IGaugePointerSeriesSpec = IGaugePointerSeriesSpec> extends ProgressLikeSeries<T> {
    static readonly type: string;
    type: SeriesTypeEnum;
    static readonly mark: SeriesMarkMap;
    private _pinMark;
    private _pointerMark;
    private _pinBackgroundMark;
    protected _stack: boolean;
    protected _pointerType: MarkTypeEnum;
    setAttrFromSpec(): void;
    initMark(): void;
    initMarkStyle(): void;
    initGroups(): void;
    private initPointerMarkStyle;
    protected initTooltip(): void;
    protected _getPointerAnchor(datum: Datum, markSpec: PinMarkSpec | PointerMarkSpec): import("../../typings").IPoint;
    protected _getPointerWidth(): number;
    protected _getPointerHeight(datum: Datum): number;
    protected _getPointerAngle(datum: Datum): number;
    protected _getRotatedPointerCenterOffset(datum: Datum): {
        x: number;
        y: number;
    };
    private initPinBackgroundMarkStyle;
    private initPinMarkStyle;
    initInteraction(): void;
    initAnimation(): void;
    getDefaultShapeType(): string;
    getActiveMarks(): IMark[];
}
export declare const registerGaugePointerSeries: () => void;
