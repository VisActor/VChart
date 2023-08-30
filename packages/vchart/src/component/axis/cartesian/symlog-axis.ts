import { CartesianLinearAxis } from './linear-axis';
import { ComponentTypeEnum } from '../../interface';
import { LinearAxisMixin } from '../mixin/linear-axis-mixin';
import { SymlogScale } from '@visactor/vscale';
import { mixin } from '@visactor/vutils';

export interface CartesianSymlogAxis
  extends Pick<LinearAxisMixin, 'valueToPosition' | 'dataToPosition'>,
    CartesianLinearAxis {}

export class CartesianSymlogAxis extends CartesianLinearAxis {
  static type = ComponentTypeEnum.cartesianSymlogAxis;
  type = ComponentTypeEnum.cartesianSymlogAxis;

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
