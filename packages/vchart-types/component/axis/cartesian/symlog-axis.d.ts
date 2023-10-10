import { CartesianLinearAxis } from './linear-axis';
import { ComponentTypeEnum } from '../../interface';
import { LinearAxisMixin } from '../mixin/linear-axis-mixin';
import { SymlogScale } from '@visactor/vscale';
import type { ICartesianSymlogAxisSpec } from './interface';
export interface CartesianSymlogAxis<T extends ICartesianSymlogAxisSpec = ICartesianSymlogAxisSpec>
  extends Pick<LinearAxisMixin, 'valueToPosition' | 'dataToPosition'>,
    CartesianLinearAxis<T> {}
export declare class CartesianSymlogAxis<
  T extends ICartesianSymlogAxisSpec = ICartesianSymlogAxisSpec
> extends CartesianLinearAxis<T> {
  static type: ComponentTypeEnum;
  type: ComponentTypeEnum;
  protected _zero: boolean;
  protected _scale: SymlogScale;
  protected _scales: SymlogScale[];
  protected initScales(): void;
  transformScaleDomain(): void;
}
