import { CartesianLinearAxis } from './linear-axis';
import { ComponentTypeEnum } from '../../interface/type';
import { LinearAxisMixin } from '../mixin/linear-axis-mixin';
import { SymlogScale } from '@visactor/vscale';
import { mixin } from '@visactor/vutils';
import type { ICartesianSymlogAxisSpec } from './interface';
import { Factory } from '../../../core/factory';
import { registerAxis } from '../base-axis';

export interface CartesianSymlogAxis<T extends ICartesianSymlogAxisSpec = ICartesianSymlogAxisSpec>
  extends Pick<LinearAxisMixin, 'valueToPosition'>,
    CartesianLinearAxis<T> {}

export class CartesianSymlogAxis<
  T extends ICartesianSymlogAxisSpec = ICartesianSymlogAxisSpec
> extends CartesianLinearAxis<T> {
  static type = ComponentTypeEnum.cartesianSymlogAxis;
  type = ComponentTypeEnum.cartesianSymlogAxis;

  static specKey = 'axes';

  protected _zero: boolean = false;

  protected _scale: SymlogScale = new SymlogScale();
  protected declare _scales: SymlogScale[];

  /**
   * @override
   */
  protected initScales() {
    super.initScales();
    this._scale.constant(this._spec.constant ?? 10);
  }

  transformScaleDomain() {
    // do nothing
  }
}

mixin(CartesianSymlogAxis, LinearAxisMixin);

export const registerCartesianSymlogAxis = () => {
  registerAxis();
  Factory.registerComponent(CartesianSymlogAxis.type, CartesianSymlogAxis);
};
