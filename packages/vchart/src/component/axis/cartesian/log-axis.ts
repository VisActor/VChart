import { CartesianLinearAxis } from './linear-axis';
import { ComponentTypeEnum } from '../../interface';
import { LinearAxisMixin } from '../mixin/linear-axis-mixin';
import { LogScale } from '@visactor/vscale';
import { mixin } from '@visactor/vutils';
import type { ICartesianLogAxisSpec } from './interface';

export interface CartesianLogAxis<T extends ICartesianLogAxisSpec = ICartesianLogAxisSpec>
  extends Pick<LinearAxisMixin, 'valueToPosition' | 'dataToPosition'>,
    CartesianLinearAxis<T> {}

export class CartesianLogAxis<T extends ICartesianLogAxisSpec = ICartesianLogAxisSpec> extends CartesianLinearAxis<T> {
  static type = ComponentTypeEnum.cartesianLogAxis;
  type = ComponentTypeEnum.cartesianLogAxis;

  protected _zero: boolean = false;

  protected _scale: LogScale = new LogScale();
  protected declare _scales: LogScale[];

  /**
   * @override
   */
  protected initScales() {
    super.initScales();
    this._scale.base(this._spec.base ?? 10);
  }

  transformScaleDomain() {
    // do nothing
  }
}

mixin(CartesianLogAxis, LinearAxisMixin);
