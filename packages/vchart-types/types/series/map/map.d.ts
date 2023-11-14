import { DataView } from '@visactor/vdataset';
import type { Maybe, StringOrNumber } from '../../typings';
import { GeoSeries } from '../geo/geo';
import type { SeriesMarkMap } from '../interface';
import { SeriesTypeEnum } from '../interface/type';
import type { IMapSeriesSpec, IMapSeriesTheme } from './interface';
import type { PanEventParam, ZoomEventParam } from '../../event/interface';
import type { ILabelMark } from '../../mark/label';
import type { IMark } from '../../mark/interface';
export declare class MapSeries<T extends IMapSeriesSpec = IMapSeriesSpec> extends GeoSeries<T> {
    static readonly type: string;
    type: SeriesTypeEnum;
    static readonly mark: SeriesMarkMap;
    map: string;
    protected _nameMap: {
        [key: StringOrNumber]: StringOrNumber;
    };
    getNameMap(): {
        [key: string]: StringOrNumber;
        [key: number]: StringOrNumber;
    };
    protected _theme: Maybe<IMapSeriesTheme>;
    private _areaCache;
    private _pathMark;
    private _labelMark;
    setAttrFromSpec(): void;
    initData(): void;
    initMark(): void;
    initMarkStyle(): void;
    initLabelMarkStyle(labelMark: ILabelMark): void;
    initAnimation(): void;
    protected initTooltip(): void;
    protected getPath(datum: any): string;
    onEvaluateEnd(): void;
    getDimensionField(): string[];
    getMeasureField(): string[];
    release(): void;
    handleZoom(e: ZoomEventParam): void;
    handlePan(e: PanEventParam): void;
    getDatumCenter(datum: any): [number, number];
    getDatumName(datum: any): string;
    dataToPositionX(data: any): number;
    dataToPositionY(data: any): number;
    viewDataUpdate(d: DataView): void;
    protected _getDataIdKey(): string;
    getActiveMarks(): IMark[];
}
export declare const registerMapSeries: () => void;
