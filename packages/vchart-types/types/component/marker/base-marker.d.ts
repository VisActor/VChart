import type { DataView } from '@visactor/vdataset';
import type { IModelRenderOption } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type { ICartesianSeries } from '../../series/interface';
import type { ILayoutType, StringOrNumber } from '../../typings';
import { BaseComponent } from '../base/base-component';
import type { IAggrType, IDataPos, IDataPosCallback, IMarkerAxisSpec, IMarkerSpec } from './interface';
import type { IGraphic } from '@visactor/vrender-core';
export declare abstract class BaseMarker<T extends IMarkerSpec & IMarkerAxisSpec> extends BaseComponent<T> {
    layoutType: ILayoutType;
    protected _startRelativeSeries: ICartesianSeries;
    protected _endRelativeSeries: ICartesianSeries;
    protected _relativeSeries: ICartesianSeries;
    protected _markerData: DataView;
    protected _markerComponent: any;
    created(): void;
    private _isSpecAggr;
    private _getAllRelativeSeries;
    protected _processSpecX(specX: IDataPos | IDataPosCallback): {
        getRelativeSeries: () => ICartesianSeries;
        getStartRelativeSeries: () => ICartesianSeries;
        getEndRelativeSeries: () => ICartesianSeries;
        x: {
            field: any;
            aggrType: IAggrType;
        };
    } | {
        getRelativeSeries: () => ICartesianSeries;
        getStartRelativeSeries: () => ICartesianSeries;
        getEndRelativeSeries: () => ICartesianSeries;
        x: IDataPos | IDataPosCallback;
    };
    protected _processSpecY(specY: IDataPos | IDataPosCallback): {
        getRelativeSeries: () => ICartesianSeries;
        getStartRelativeSeries: () => ICartesianSeries;
        getEndRelativeSeries: () => ICartesianSeries;
        y: {
            field: any;
            aggrType: IAggrType;
        };
    } | {
        getRelativeSeries: () => ICartesianSeries;
        getStartRelativeSeries: () => ICartesianSeries;
        getEndRelativeSeries: () => ICartesianSeries;
        y: IDataPos | IDataPosCallback;
    };
    protected _processSpecCoo(spec: any): any;
    updateLayoutAttribute(): void;
    protected _getSeriesByIdOrIndex(seriesUserId: StringOrNumber, seriesIndex: number): ICartesianSeries;
    protected _bindSeries(): void;
    protected _computeClipRange(regions: IRegion[]): {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
    };
    protected abstract _initDataView(): void;
    protected abstract _createMarkerComponent(): void;
    protected abstract _markerLayout(): void;
    protected initEvent(): void;
    onRender(ctx: IModelRenderOption): void;
    changeRegions(regions: IRegion[]): void;
    protected getFirstSeries(): ICartesianSeries;
    getVRenderComponents(): IGraphic[];
}
