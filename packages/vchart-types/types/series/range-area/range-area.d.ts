import { AreaSeries } from '../area/area';
import type { SeriesMarkMap } from '../interface';
import { SeriesTypeEnum } from '../interface/type';
import type { Datum } from '../../typings';
import type { IAreaSeriesSpec } from '../area/interface';
export declare class RangeAreaSeries<T extends IAreaSeriesSpec = IAreaSeriesSpec> extends AreaSeries<T> {
    static readonly type: string;
    type: SeriesTypeEnum;
    static readonly mark: SeriesMarkMap;
    initMark(): void;
    initMarkStyle(): void;
    initAreaMarkStyle(): void;
    protected initTooltip(): void;
    protected _isFieldAllValid(): boolean;
    protected _getInvalidDefined(datum: Datum): boolean;
}
export declare const registerRangeAreaSeries: () => void;
