import { BaseComponent } from '../base';
import type { IEffect, IModelInitOption, ILayoutRect } from '../../model/interface';
import type { LayoutItem } from '../../model/layout-item';
import type { IComponent, IComponentOption } from '../interface';
import type { AdaptiveSpec, IOrientType, StringOrNumber } from '../../typings';
import type { IBaseScale } from '@visactor/vscale';
import type { ICartesianBandAxisSpec } from '../axis/cartesian';
import type { IBoundsLike } from '@visactor/vutils';
import { IFilterMode } from './constant';
import type { IDataFilterComponent, IDataFilterComponentSpec } from './interface';
import type { BaseEventParams } from '../../event/interface';
import type { AbstractComponent } from '@visactor/vrender-components';
export declare abstract class DataFilterBaseComponent<T extends IDataFilterComponentSpec = IDataFilterComponentSpec>
  extends BaseComponent<AdaptiveSpec<T, 'width' | 'height'>>
  implements IDataFilterComponent
{
  layoutType: LayoutItem['layoutType'];
  protected _component: AbstractComponent;
  protected _orient: IOrientType;
  protected _isHorizontal: boolean;
  protected _auto?: boolean;
  protected _fixedBandSize?: number;
  protected _cacheRect?: ILayoutRect;
  protected _cacheVisibility?: boolean;
  get orient(): IOrientType;
  get layoutOrient(): IOrientType;
  set layoutOrient(v: IOrientType);
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
  protected _field: string;
  protected _stateField: string;
  protected _valueField?: string;
  protected _width: number;
  protected _height: number;
  protected _filterMode: IFilterMode;
  setStartAndEnd(start: number, end: number): void;
  protected abstract _getComponentAttrs(): any;
  protected abstract _createOrUpdateComponent(): void;
  protected abstract _initEvent(): void;
  protected abstract _computeWidth(): number;
  protected abstract _computeHeight(): number;
  protected abstract _handleChange(start: number, end: number, updateComponent?: boolean): void;
  protected abstract _handleDataCollectionChange(): void;
  effect: IEffect;
  protected _visible: boolean;
  get visible(): boolean;
  constructor(spec: T, options: IComponentOption);
  created(): void;
  protected _setAxisFromSpec(): void;
  protected _setRegionsFromSpec(): void;
  onDataUpdate(): void;
  protected _computeDomainOfStateScale(isContinuous?: boolean): any;
  protected _initData(): void;
  setAttrFromSpec(): void;
  protected _statePointToData(state: number): any;
  protected _dataToStatePoint(data: number | string): number;
  protected _modeCheck(statePoint: 'start' | 'end', mode: string): any;
  protected _setStateFromSpec(): void;
  private _parseFieldOfSeries;
  protected _initStateScale(): void;
  init(option: IModelInitOption): void;
  protected _addTransformToSeries(): void;
  onRender(ctx: any): void;
  _compareSpec(): {
    change: boolean;
    reMake: boolean;
    reRender: boolean;
    reSize: boolean;
    reCompile: boolean;
  };
  reInit(theme?: any): void;
  changeRegions(): void;
  protected update(ctx: IComponentOption): void;
  protected resize(ctx: IComponentOption): void;
  protected _parseDomainFromState(startValue: number | string, endValue: number | string): any;
  protected _handleStateChange: (startValue: number, endValue: number) => boolean;
  protected _handleChartScroll: (
    params: {
      scrollX: number;
      scrollY: number;
    },
    e: BaseEventParams['event']
  ) => void;
  protected _handleChartZoom: (
    params: {
      zoomDelta: number;
      zoomX: number;
      zoomY: number;
    },
    e: BaseEventParams['event']
  ) => void;
  protected _handleChartDrag: (delta: [number, number], e: BaseEventParams['event']) => void;
  protected _initCommonEvent(): void;
  updateLayoutAttribute(): void;
  _boundsInRect(rect: ILayoutRect): IBoundsLike;
  hide(): void;
  show(): void;
  protected _getAxisBandSize(axisSpec?: ICartesianBandAxisSpec): {
    bandSize: number;
    maxBandSize: number;
    minBandSize: number;
  };
  protected _autoUpdate(rect?: ILayoutRect): boolean;
}
