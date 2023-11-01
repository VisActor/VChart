import type { LogScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { LinearScale } from '@visactor/vscale';
import { CartesianAxis } from './axis';
import { isValid, mixin } from '@visactor/vutils';
import type { IAxisHelper, ICartesianLinearAxisSpec } from './interface';
import { ComponentTypeEnum } from '../../interface/type';
import { LinearAxisMixin } from '../mixin/linear-axis-mixin';
import { Factory } from '../../../core/factory';
import { registerAxis } from '../base-axis';

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

export class CartesianLinearAxis<
  T extends ICartesianLinearAxisSpec = ICartesianLinearAxisSpec
> extends CartesianAxis<T> {
  static type = ComponentTypeEnum.cartesianLinearAxis;
  type = ComponentTypeEnum.cartesianLinearAxis;

  protected _zero: boolean = true;
  protected _nice: boolean = true;
  protected _extend: { [key: string]: number } = {};

  protected _scale: LinearScale | LogScale = new LinearScale();
  protected declare _scales: LinearScale[] | LogScale[];

  setAttrFromSpec(): void {
    super.setAttrFromSpec();
    this.setExtraAttrFromSpec();
  }

  /**
   * @override
   */
  protected initScales() {
    super.initScales();
    const range = [0, 1];
    if (isValid(this._domain?.min)) {
      range[0] = this._domain.min;
    }
    if (isValid(this._domain?.max)) {
      range[1] = this._domain.max;
    }
    this._scale.domain(range);
    // this.setScaleNice();
  }

  protected computeDomain(data: { min: number; max: number; values: any[] }[]): number[] {
    return this.computeLinearDomain(data);
  }

  protected axisHelper() {
    const helper: IAxisHelper = super.axisHelper();
    helper.setExtendDomain = this.setExtendDomain.bind(this);
    helper.valueToPosition = this.valueToPosition.bind(this);
    return helper;
  }
}

mixin(CartesianLinearAxis, LinearAxisMixin);

export const registerCartesianLinearAxis = () => {
  registerAxis();
  Factory.registerComponent(CartesianLinearAxis.type, CartesianLinearAxis);
};
