import { DataView } from '@visactor/vdataset';
import type { Maybe } from '@visactor/vutils';
import type { IModelRenderOption, IModelSpecInfo } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type { ILayoutRect, ILayoutType, IRect } from '../../typings';
import { BaseComponent } from '../base/base-component';
import type { IDataPos, IDataPosCallback, IMarkerSpec, IMarkerSupportSeries } from './interface';
import type { IGraphic, IGroup } from '@visactor/vrender-core';
export declare abstract class BaseMarker<T extends IMarkerSpec> extends BaseComponent<T> {
    layoutType: ILayoutType | 'none';
    static specKey: string;
    static type: string;
    static coordinateType: string;
    coordinateType: string;
    protected _startRelativeSeries: IMarkerSupportSeries;
    protected _endRelativeSeries: IMarkerSupportSeries;
    protected _relativeSeries: IMarkerSupportSeries;
    protected _specifiedDataSeries: IMarkerSupportSeries | IMarkerSupportSeries[];
    getRelativeSeries(): IMarkerSupportSeries;
    protected _markerData: DataView;
    getMarkerData(): DataView;
    protected _markerComponent: any;
    protected _layoutOffsetX: number;
    protected _layoutOffsetY: number;
    private _firstSeries;
    protected abstract _initDataView(): void;
    protected abstract _createMarkerComponent(): IGroup;
    protected abstract _markerLayout(): void;
    static _getMarkerCoordinateType(markerSpec: any): string;
    static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]>;
    created(): void;
    protected _getAllRelativeSeries(): {
        getRelativeSeries: () => IMarkerSupportSeries;
        getStartRelativeSeries: () => IMarkerSupportSeries;
        getEndRelativeSeries: () => IMarkerSupportSeries;
    };
    private _getFieldInfoFromSpec;
    protected _processSpecByDims(dimSpec: {
        dim: 'x' | 'y' | 'angle' | 'radius' | 'areaName';
        specValue: IDataPos | IDataPosCallback;
    }[]): {
        getRelativeSeries: () => IMarkerSupportSeries;
        getStartRelativeSeries: () => IMarkerSupportSeries;
        getEndRelativeSeries: () => IMarkerSupportSeries;
    };
    protected _processSpecCoo(spec: any): any;
    protected _getRelativeDataView(): DataView;
    updateLayoutAttribute(): void;
    private _getSeriesByIdOrIndex;
    protected _bindSeries(): void;
    protected initEvent(): void;
    onRender(ctx: IModelRenderOption): void;
    changeRegions(regions: IRegion[]): void;
    clear(): void;
    private _getFirstSeries;
    protected _getNeedClearVRenderComponents(): IGraphic[];
    onLayoutStart(layoutRect: IRect, chartViewRect: ILayoutRect, ctx: any): void;
}
