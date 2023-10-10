import { BaseComponent } from '../base';
import { ComponentTypeEnum } from '../interface';
import type { IComponentOption } from '../interface';
import type { ITitle, ITitleSpec, ITitleTheme } from './interface';
import type { IRegion } from '../../region/interface';
import type { ILayoutRect } from '../../model/interface';
import type { IGroup } from '@visactor/vrender-core';
import type { IPoint, IOrientType } from '../../typings';
import type { LayoutItem } from '../../model/layout-item';
export declare class Title extends BaseComponent<ITitleSpec> implements ITitle {
  static type: ComponentTypeEnum;
  type: ComponentTypeEnum;
  layoutType: LayoutItem['layoutType'];
  layoutZIndex: LayoutItem['layoutZIndex'];
  layoutLevel: number;
  protected _theme: ITitleTheme;
  protected _orient: IOrientType;
  private _titleComponent;
  private _cacheAttrs;
  get orient(): IOrientType;
  get layoutOrient(): IOrientType;
  set layoutOrient(v: IOrientType);
  constructor(spec: ITitleSpec, options: IComponentOption);
  static createComponent(spec: any, options: IComponentOption): Title | Title[];
  onRender(ctx: any): void;
  _compareSpec(): {
    change: boolean;
    reMake: boolean;
    reRender: boolean;
    reSize: boolean;
    reCompile: boolean;
  };
  changeRegions(regions: IRegion[]): void;
  update(ctx: IComponentOption): void;
  resize(ctx: IComponentOption): void;
  setLayoutStartPosition(pos: Partial<IPoint>): void;
  _boundsInRect(rect: ILayoutRect): {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  private _getTitleLayoutRect;
  private _getTitleAttrs;
  private _createOrUpdateTitleComponent;
  getVRenderComponents(): IGroup[];
  clear(): void;
}
