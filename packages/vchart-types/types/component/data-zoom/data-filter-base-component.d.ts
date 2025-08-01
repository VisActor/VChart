import { BaseComponent } from '../base/base-component';
import type { IEffect, IModelInitOption } from '../../model/interface';
import { type IComponent, type IComponentOption } from '../interface';
import type { AdaptiveSpec, ILayoutRect, ILayoutType, IOrientType, IRect, StringOrNumber } from '../../typings';
import type { IBaseScale } from '@visactor/vscale';
import type { ICartesianBandAxisSpec } from '../axis/cartesian';
import type { IBoundsLike } from '@visactor/vutils';
import type { IFilterMode } from './interface';
import type { IDataFilterComponent, IDataFilterComponentSpec, IRoamDragSpec, IRoamScrollSpec, IRoamZoomSpec } from './interface';
import type { BaseEventParams } from '../../event/interface';
import type { AbstractComponent } from '@visactor/vrender-components';
import type { IGraphic } from '@visactor/vrender-core';
export declare abstract class DataFilterBaseComponent<T extends IDataFilterComponentSpec = IDataFilterComponentSpec> extends BaseComponent<AdaptiveSpec<T, 'width' | 'height'>> implements IDataFilterComponent {
    layoutType: ILayoutType | 'none';
    protected _component: AbstractComponent;
    protected _orient: IOrientType;
    protected _isHorizontal: boolean;
    protected _auto?: boolean;
    protected _fixedBandSize?: number;
    protected _cacheRect?: ILayoutRect;
    protected _cacheVisibility?: boolean;
    protected _dataUpdating: boolean;
    protected _stateScale: IBaseScale;
    protected _relatedAxisComponent: IComponent;
    protected _originalStateFields: Record<number, string | number>;
    protected _seriesUserId?: StringOrNumber[];
    protected _seriesIndex?: number[];
    protected _regionUserId: string[];
    protected _regionIndex: number[];
    protected _newDomain: any[];
    protected _startValue: number | string;
    protected _endValue: number | string;
    protected _start: number;
    protected _end: number;
    protected _minSpan: number;
    protected _maxSpan: number;
    protected _spanCache: number;
    protected _shouldChange: boolean;
    protected _domainCache: any;
    protected _field: string | undefined;
    protected _stateField: string;
    protected _valueField?: string;
    protected _width: number;
    protected _height: number;
    protected _filterMode: IFilterMode;
    protected _activeRoam: boolean;
    protected _zoomAttr: IRoamZoomSpec;
    protected _dragAttr: IRoamDragSpec;
    protected _scrollAttr: IRoamScrollSpec;
    get relatedAxisComponent(): IComponent;
    setStartAndEnd(start: number | string, end: number | string, rangeMode?: ['percent' | 'value', 'percent' | 'value']): void;
    enableInteraction(): void;
    disableInteraction(): void;
    zoomIn(location?: {
        x: number;
        y: number;
    }): void;
    zoomOut(location?: {
        x: number;
        y: number;
    }): void;
    protected abstract _createOrUpdateComponent(): void;
    protected abstract _computeWidth(): number;
    protected abstract _computeHeight(): number;
    protected abstract _handleDataCollectionChange(): void;
    protected _handleChange(start: number, end: number, updateComponent?: boolean): void;
    protected _isReverse(): boolean;
    protected _updateRangeFactor(tag?: 'startHandler' | 'endHandler'): void;
    effect: IEffect;
    protected _visible: boolean;
    get visible(): boolean;
    constructor(spec: T, options: IComponentOption);
    created(): void;
    initLayout(): void;
    protected _setAxisFromSpec(): void;
    protected _setRegionsFromSpec(): void;
    onDataUpdate(): void;
    protected _computeDomainOfStateScale(isContinuous?: boolean): any;
    protected _initEvent(): void;
    protected _initData(): void;
    setAttrFromSpec(): void;
    statePointToData(state: number): any;
    dataToStatePoint(data: number | string): number;
    protected _modeCheck(statePoint: 'start' | 'end', mode: string): any;
    protected _setStateFromSpec(): void;
    private _parseFieldOfSeries;
    protected _initStateScale(): void;
    init(option: IModelInitOption): void;
    protected _addTransformToSeries(): void;
    _compareSpec(spec: AdaptiveSpec<T, 'width' | 'height'>, prevSpec: AdaptiveSpec<T, 'width' | 'height'>): {
        change: boolean;
        reMake: boolean;
        reRender: boolean;
        reSize: boolean;
        reCompile: boolean;
    };
    reInit(spec?: AdaptiveSpec<T, 'width' | 'height'>): void;
    protected _parseDomainFromState(startValue: number | string, endValue: number | string): any;
    protected _handleStateChange: (startValue: number, endValue: number, tag?: string) => boolean;
    protected _handleChartZoom: (params: {
        zoomDelta: number;
        zoomX?: number;
        zoomY?: number;
    }, e?: BaseEventParams['event']) => void;
    protected _handleChartScroll: (params: {
        scrollX: number;
        scrollY: number;
    }, e: BaseEventParams['event']) => boolean;
    protected _handleChartDrag: (delta: [number, number], e: BaseEventParams['event']) => void;
    protected _handleChartMove: (value: number, rate: number) => boolean;
    protected _initCommonEvent(): void;
    updateLayoutAttribute(): void;
    protected _autoVisible(isShown: boolean): void;
    onLayoutStart(layoutRect: IRect, viewRect: ILayoutRect): void;
    onLayoutEnd(): void;
    getBoundsInRect(rect: ILayoutRect): IBoundsLike;
    hide(): void;
    show(): void;
    protected _getAxisBandSize(axisSpec?: ICartesianBandAxisSpec): {
        bandSize: number;
        maxBandSize: number;
        minBandSize: number;
    };
    protected _autoUpdate(rect?: ILayoutRect): boolean;
    protected _getNeedClearVRenderComponents(): IGraphic[];
}
