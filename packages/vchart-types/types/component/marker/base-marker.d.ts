import { DataView } from '@visactor/vdataset';
import type { Maybe } from '@visactor/vutils';
import type { IModelSpecInfo } from '../../model/interface';
import type { CoordinateType, ILayoutRect, ILayoutType, IRect } from '../../typings';
import { BaseComponent } from '../base/base-component';
import type { IDataPos, IDataPosCallback, IMarkerAttributeContext, IMarkerSpec, IMarkerSupportSeries, IMarkProcessOptions } from './interface';
import type { IGraphic, IGroup } from '@visactor/vrender-core';
import type { IOptionWithCoordinates } from '../../data/transforms/interface';
export declare abstract class BaseMarker<T extends IMarkerSpec> extends BaseComponent<T> {
    layoutType: ILayoutType | 'none';
    static specKey: string;
    static type: string;
    static coordinateType: string;
    coordinateType: CoordinateType;
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
    protected abstract _computeOptions(): IMarkProcessOptions;
    static _getMarkerCoordinateType(markerSpec: any): string;
    static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]>;
    protected _markAttributeContext: IMarkerAttributeContext;
    getMarkAttributeContext(): IMarkerAttributeContext;
    protected _buildMarkerAttributeContext(): void;
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
    protected _processSpecCoo(spec: any): IOptionWithCoordinates;
    protected _getRelativeDataView(): DataView;
    updateLayoutAttribute(): void;
    private _getSeriesByIdOrIndex;
    protected _bindSeries(): void;
    protected initEvent(): void;
    clear(): void;
    private _getFirstSeries;
    protected _getNeedClearVRenderComponents(): IGraphic[];
    onLayoutStart(layoutRect: IRect, chartViewRect: ILayoutRect): void;
    _compareSpec(spec: T, prevSpec: T): {
        change: boolean;
        reMake: boolean;
        reRender: boolean;
        reSize: boolean;
        reCompile: boolean;
    };
    _initCommonDataView(): void;
}
