import { CartesianLinearAxis } from './linear-axis';
import { ComponentTypeEnum } from '../../interface';
import type { LinearAxisMixin } from '../mixin/linear-axis-mixin';
import { LogScale } from '@visactor/vscale';

export interface CartesianLogAxis
  extends Pick<LinearAxisMixin, 'valueToPosition' | 'dataToPosition'>,
    CartesianLinearAxis {}

export class CartesianLogAxis extends CartesianLinearAxis {
  static type = ComponentTypeEnum.cartesianLogAxis;
  type = ComponentTypeEnum.cartesianLogAxis;

  protected _zero: boolean = false;

  protected _scale: LogScale = new LogScale();
  protected declare _scales: LogScale[];

  protected _initData() {
    this._scale.base(this._spec.base ?? 10);
    super._initData();
  }

  transformScaleDomain() {
    // do nothing
  }
}
