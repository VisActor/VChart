import type { IComponentOption } from '../interface';
import { ComponentTypeEnum } from '../interface';
import type { ICartesianCrosshairSpec } from './interface';
import type { IHair } from './base';
import { BaseCrossHair } from './base';
import type { IGroup } from '@visactor/vrender-core';
import type { IAxis } from '../axis/interface';
import type { StringOrNumber } from '../../typings';
export declare class CartesianCrossHair<
  T extends ICartesianCrosshairSpec = ICartesianCrosshairSpec
> extends BaseCrossHair<T> {
  static type: ComponentTypeEnum;
  type: ComponentTypeEnum;
  name: string;
  currValueX: Map<
    number,
    {
      v: StringOrNumber;
      axis: IAxis;
    }
  >;
  currValueY: Map<
    number,
    {
      v: StringOrNumber;
      axis: IAxis;
    }
  >;
  xHair: IHair | undefined;
  yHair: IHair | undefined;
  private _cacheXCrossHairInfo;
  private _cacheYCrossHairInfo;
  private _xCrosshair;
  private _xTopLabel;
  private _xBottomLabel;
  private _yCrosshair;
  private _yLeftLabel;
  private _yRightLabel;
  static createComponent(
    spec: any,
    options: IComponentOption
  ): CartesianCrossHair<any> | CartesianCrossHair<ICartesianCrosshairSpec>[];
  constructor(spec: T, options: IComponentOption);
  protected _showDefaultCrosshair(): void;
  private defaultCrosshair;
  findAllAxisContains(
    relativeX: number,
    relativeY: number
  ): {
    xAxisMap: Map<
      number,
      {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
      } & {
        axis: IAxis;
      }
    >;
    yAxisMap: Map<
      number,
      {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
      } & {
        axis: IAxis;
      }
    >;
  };
  private getValueAt;
  clearAxisValue(): void;
  setAxisValue(v: StringOrNumber, axis: IAxis): void;
  private getAllAxisValues;
  protected _layoutCrosshair(relativeX: number, relativeY: number): void;
  hide(): void;
  private layoutByValue;
  private _layoutVertical;
  private _layoutHorizontal;
  protected _parseFieldInfo(): void;
  private _updateCrosshair;
  private _updateCrosshairLabel;
  getVRenderComponents(): IGroup[];
}
