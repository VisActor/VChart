import type { LogScale } from '@visactor/vscale';
import { LinearScale } from '@visactor/vscale';
import { CartesianAxis } from './axis';
import type { IAxisHelper, ICartesianLinearAxisSpec } from './interface';
import { ComponentTypeEnum } from '../../interface';
import { LinearAxisMixin } from '../mixin/linear-axis-mixin';
export interface CartesianLinearAxis<T extends ICartesianLinearAxisSpec = ICartesianLinearAxisSpec>
  extends Pick<
      LinearAxisMixin,
      | 'setExtraAttrFromSpec'
      | 'computeLinearDomain'
      | 'valueToPosition'
      | 'setScaleNice'
      | '_domain'
      | 'dataToPosition'
      | 'transformScaleDomain'
      | 'setExtendDomain'
    >,
    CartesianAxis<T> {}
export declare class CartesianLinearAxis<
  T extends ICartesianLinearAxisSpec = ICartesianLinearAxisSpec
> extends CartesianAxis<T> {
  static type: ComponentTypeEnum;
  type: ComponentTypeEnum;
  protected _zero: boolean;
  protected _nice: boolean;
  protected _extend: {
    [key: string]: number;
  };
  protected _scale: LinearScale | LogScale;
  protected _scales: LinearScale[] | LogScale[];
  setAttrFromSpec(): void;
  protected initScales(): void;
  protected computeDomain(
    data: {
      min: number;
      max: number;
      values: any[];
    }[]
  ): number[];
  protected axisHelper(): IAxisHelper;
}
export declare const registerCartesianLinearAxis: () => void;
