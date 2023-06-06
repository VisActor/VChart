import { LinearScale } from '@visactor/vscale';
import { CartesianAxis } from './axis';
import { isValid } from '../../../util';
import type { IAxisHelper } from './interface';
import { ComponentTypeEnum } from '../../interface';
import { getLinearAxisSpecDomain } from '../utils';
import { LinearAxisMixin } from '../mixin/linear-axis-mixin';
import { mixin } from '@visactor/vutils';

export interface CartesianLinearAxis
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
    CartesianAxis {}

export class CartesianLinearAxis extends CartesianAxis {
  static type = ComponentTypeEnum.cartesianLinearAxis;
  type = ComponentTypeEnum.cartesianLinearAxis;

  protected _zero: boolean = true;
  protected _nice: boolean = true;
  protected _extend: { [key: string]: number } = {};

  protected _scale: LinearScale = new LinearScale();
  protected declare _scales: LinearScale[];

  setAttrFromSpec(): void {
    super.setAttrFromSpec();
    this.setExtraAttrFromSpec();
    this._domain = getLinearAxisSpecDomain(this._spec);
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
    this.setScaleNice();
  }

  protected computeDomain(data: { min: number; max: number; values: any[] }[]): number[] {
    return this.computeLinearDomain(data);
  }

  protected axisHelper() {
    const helper: IAxisHelper = super.axisHelper();
    helper.setExtendDomain = this.setExtendDomain.bind(this);
    return helper;
  }
}

mixin(CartesianLinearAxis, LinearAxisMixin);
