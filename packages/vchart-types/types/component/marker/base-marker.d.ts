import type { DataView } from '@visactor/vdataset';
import type { IModelRenderOption } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type { ICartesianSeries } from '../../series/interface';
import type { ILayoutRect, ILayoutType, IRect } from '../../typings';
import { BaseComponent } from '../base/base-component';
import type { IAggrType, IDataPos, IDataPosCallback, IMarkerSpec } from './interface';
import type { IGraphic, IGroup } from '@visactor/vrender-core';
export declare abstract class BaseMarker<T extends IMarkerSpec> extends BaseComponent<T> {
    layoutType: ILayoutType | 'none';
    protected _startRelativeSeries: ICartesianSeries;
    protected _endRelativeSeries: ICartesianSeries;
    protected _relativeSeries: ICartesianSeries;
    getRelativeSeries(): ICartesianSeries;
    protected _markerData: DataView;
    protected _markerComponent: any;
    protected _layoutOffsetX: number;
    protected _layoutOffsetY: number;
    private _firstSeries;
    created(): void;
    protected _getAllRelativeSeries(): {
        getRelativeSeries: () => ICartesianSeries;
        getStartRelativeSeries: () => ICartesianSeries;
        getEndRelativeSeries: () => ICartesianSeries;
    };
    private _getFieldInfoFromSpec;
    protected _processSpecX(specX: IDataPos | IDataPosCallback): {
        getRelativeSeries: () => ICartesianSeries;
        getStartRelativeSeries: () => ICartesianSeries;
        getEndRelativeSeries: () => ICartesianSeries;
        x: string | number | IDataPosCallback | {
            field: any;
            aggrType: IAggrType;
        };
    };
    protected _processSpecY(specY: IDataPos | IDataPosCallback): {
        getRelativeSeries: () => ICartesianSeries;
        getStartRelativeSeries: () => ICartesianSeries;
        getEndRelativeSeries: () => ICartesianSeries;
        y: string | number | IDataPosCallback | {
            field: any;
            aggrType: IAggrType;
        };
    };
    protected _processSpecXY(specX: IDataPos | IDataPosCallback, specY: IDataPos | IDataPosCallback): {
        getRelativeSeries: () => ICartesianSeries;
        getStartRelativeSeries: () => ICartesianSeries;
        getEndRelativeSeries: () => ICartesianSeries;
        x: string | number | IDataPosCallback | {
            field: any;
            aggrType: IAggrType;
        };
        y: string | number | IDataPosCallback | {
            field: any;
            aggrType: IAggrType;
        };
    };
    protected _processSpecCoo(spec: any): any;
    updateLayoutAttribute(): void;
    private _getSeriesByIdOrIndex;
    protected _bindSeries(): void;
    protected abstract _initDataView(): void;
    protected abstract _createMarkerComponent(): IGroup;
    protected abstract _markerLayout(): void;
    protected initEvent(): void;
    onRender(ctx: IModelRenderOption): void;
    changeRegions(regions: IRegion[]): void;
    clear(): void;
    private _getFirstSeries;
    protected _getNeedClearVRenderComponents(): IGraphic[];
    onLayoutStart(layoutRect: IRect, chartViewRect: ILayoutRect, ctx: any): void;
}
