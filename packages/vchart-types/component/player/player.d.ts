import type { IGraphic } from '@visactor/vrender-core';
import type { ILayoutRect, IModelRenderOption } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type { IComponentOption } from '../interface';
import type { IPlayer } from './interface';
import type { IComponent } from '../interface';
import type { IPoint, IOrientType } from '../../typings';
import { type IChartSpec } from '../..';
import { ComponentTypeEnum } from '../interface';
import { BaseComponent } from '../base';
export declare class Player extends BaseComponent<IPlayer> implements IComponent {
  layoutZIndex: number;
  layoutLevel: number;
  static type: ComponentTypeEnum;
  type: ComponentTypeEnum;
  specKey: string;
  private _orient;
  private _specs;
  private _playerComponent;
  private _cacheAttrs;
  private _direction;
  private _alternate;
  private _dx;
  private _dy;
  private _width;
  private _height;
  private _position;
  get orient(): IOrientType;
  get layoutOrient(): IOrientType;
  set layoutOrient(v: IOrientType);
  static createComponent: (spec: IChartSpec, options: IComponentOption) => Player;
  setAttrFromSpec(): void;
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
  changeRegions(regions: IRegion[]): void;
  onRender(ctx: IModelRenderOption): void;
  getVRenderComponents(): IGraphic[];
  private _getPlayerAttrs;
  private _createOrUpdatePlayerComponent;
  private _computeLayoutRect;
  private _computeWidth;
  private _computeHeight;
  private _computeDx;
  private _computeDy;
  private _maxSize;
  private _sliderExceededSize;
  private _initEvent;
}
export declare const registerPlayer: () => void;
