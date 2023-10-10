import type { DataView } from '@visactor/vdataset';
import type { IRegion } from '../../region/interface';
import { BaseComponent } from '../base';
import type { IEffect, ILayoutRect } from '../../model/interface';
import type { LayoutItem } from '../../model/layout-item';
import type { IOrientType, IPoint, StringOrNumber } from '../../typings';
import { CompilableData } from '../../compile/data';
import type { ILegend, ILegendCommonSpec } from './interface';
import type { IGroup } from '@visactor/vrender-core';
export declare abstract class BaseLegend<T extends ILegendCommonSpec> extends BaseComponent<T> implements ILegend {
  layoutType: LayoutItem['layoutType'];
  layoutZIndex: LayoutItem['layoutZIndex'];
  layoutLevel: number;
  protected _orient: IOrientType;
  get orient(): IOrientType;
  protected _visible: boolean;
  get visible(): boolean;
  protected _position: 'start' | 'middle' | 'end';
  get position(): 'start' | 'end' | 'middle';
  get layoutOrient(): IOrientType;
  set layoutOrient(v: IOrientType);
  protected _legendData: CompilableData;
  getLegendData(): any;
  private _preSelectedData;
  protected _selectedData: StringOrNumber[];
  getSelectedData(): StringOrNumber[];
  protected _legendComponent: IGroup;
  private _cacheAttrs;
  effect: IEffect;
  protected _seriesUserId?: StringOrNumber[];
  protected _seriesIndex?: number[];
  protected _regionUserId?: StringOrNumber[];
  protected _regionUserIndex?: number[];
  setAttrFromSpec(): void;
  created(): void;
  onRender(ctx: any): void;
  _compareSpec(): {
    change: boolean;
    reMake: boolean;
    reRender: boolean;
    reSize: boolean;
    reCompile: boolean;
  };
  changeRegions(regions: IRegion[]): void;
  protected abstract _initLegendData(): DataView;
  protected abstract _initSelectedData(): void;
  protected abstract _getLegendAttributes(rect: ILayoutRect): any;
  protected abstract _getLegendConstructor(): any;
  protected abstract _initEvent(): void;
  private _bindLegendDataChange;
  protected initData(): void;
  setSelectedData(selectedData: StringOrNumber[]): void;
  setLayoutStartPosition(pos: Partial<IPoint>): void;
  _boundsInRect(
    rect: ILayoutRect,
    fullSpace: ILayoutRect
  ): {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  onDataUpdate(): void;
  getVRenderComponents(): IGroup[];
  clear(): void;
}
