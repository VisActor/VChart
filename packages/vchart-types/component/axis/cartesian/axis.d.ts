import type { IBoundsLike } from '@visactor/vutils';
import type { IEffect, IModelInitOption, ILayoutRect } from '../../../model/interface';
import type { ICartesianSeries } from '../../../series/interface';
import type { IRegion } from '../../../region/interface';
import type { IAxisLocationCfg, ICartesianAxisCommonSpec, IAxisHelper, ICartesianAxisCommonTheme } from './interface';
import type { IOrientType } from '../../../typings/space';
import type { IBaseScale } from '@visactor/vscale';
import type { LayoutItem } from '../../../model/layout-item';
import type { IPoint, StringOrNumber } from '../../../typings';
import type { IComponentOption } from '../../interface';
import { ComponentTypeEnum } from '../../interface';
import type { IAxis, ITick } from '../interface';
import type { DataSet } from '@visactor/vdataset';
import { AxisComponent } from '../base-axis';
import type { IGraphic } from '@visactor/vrender-core';
export declare abstract class CartesianAxis<T extends ICartesianAxisCommonSpec = ICartesianAxisCommonSpec>
  extends AxisComponent<T>
  implements IAxis
{
  static type: ComponentTypeEnum;
  type: ComponentTypeEnum;
  name: string;
  directionStr?: 'l2r' | 'r2l' | 't2b' | 'b2t';
  layoutType: LayoutItem['layoutType'];
  layoutZIndex: number;
  layoutLevel: number;
  protected _dataSet: DataSet;
  layout3dBox?: {
    width: number;
    height: number;
    length: number;
  };
  protected _orient: IOrientType;
  getOrient(): IOrientType;
  get layoutOrient(): IOrientType;
  set layoutOrient(v: IOrientType);
  protected _scales: IBaseScale[];
  getScales(): IBaseScale[];
  protected _theme: ICartesianAxisCommonTheme;
  protected _statisticsDomain: {
    domain: any[];
    index: {
      [key in StringOrNumber]: number;
    };
  };
  getStatisticsDomain(): {
    domain: any[];
    index: {
      [x: string]: number;
      [x: number]: number;
    };
  };
  protected _tick: ITick | undefined;
  private _axisStyle;
  private _latestBounds;
  private _verticalLimitSize;
  private _unitText;
  protected _layoutCache: {
    width: number;
    height: number;
    _lastComputeOutBounds: IBoundsLike;
  };
  constructor(spec: T, options: IComponentOption);
  static createAxis(spec: any, options: IComponentOption, isHorizontal?: boolean): IAxis;
  static createComponent(spec: any, options: IComponentOption): IAxis | IAxis[];
  setLayout3dBox(box3d: { width: number; height: number; length: number }): void;
  effect: IEffect;
  protected abstract computeDomain(
    data: {
      min: number;
      max: number;
      values: any[];
    }[]
  ): StringOrNumber[];
  abstract dataToPosition(values: any[], cfg?: IAxisLocationCfg): number;
  abstract valueToPosition(value: any): number;
  protected updateScaleRange(): boolean;
  init(option: IModelInitOption): void;
  setAttrFromSpec(): void;
  protected getSeriesStatisticsField(s: ICartesianSeries): string[];
  protected _initTickData(sampling: boolean): void;
  protected _initData(): void;
  protected axisHelper(): IAxisHelper;
  afterCompile(): void;
  onLayoutEnd(ctx: any): void;
  onRender(ctx: any): void;
  changeRegions(regions: IRegion[]): void;
  update(ctx: IComponentOption): void;
  resize(ctx: IComponentOption): void;
  protected collectScale(): IBaseScale[];
  protected collectData(depth?: number): {
    min: number;
    max: number;
    values: any[];
  }[];
  protected updateSeriesScale(): void;
  setLayoutStartPosition(pos: Partial<IPoint>): void;
  computeBoundsInRect(rect: ILayoutRect): ILayoutRect;
  _boundsInRect(rect: ILayoutRect): IBoundsLike;
  updateLayoutAttribute(): void;
  private _getTitleLimit;
  private _getUpdateAttribute;
  protected initEvent(): void;
  private _fixAxisOnZero;
  protected _layoutCacheProcessing(rect: ILayoutRect): ILayoutRect;
  _clearLayoutCache(): void;
  onDataUpdate(): void;
  protected _transformSpec(): void;
  private _appendAxisUnit;
  getVRenderComponents(): IGraphic[];
}
