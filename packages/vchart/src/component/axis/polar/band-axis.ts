import { BandScale } from '@visactor/vscale';
import { ComponentTypeEnum } from '../../interface/type';
import { PolarAxis } from './axis';
import { mixin } from '@visactor/vutils';
import { BandAxisMixin } from '../mixin/band-axis-mixin';
import type { StringOrNumber } from '../../../typings';
import type { IPolarBandAxisSpec } from './interface';
import { Factory } from '../../../core/factory';
import { registerAxis } from '../base-axis';
import { registerLineAxis, registerLineGrid, registerCircleAxis, registerCircleGrid } from '@visactor/vgrammar-core';
import { registerDataSetInstanceTransform } from '../../../data/register';
import { polarAngleAxisDiscreteTicks } from '@visactor/vrender-components';

export interface PolarBandAxis<T extends IPolarBandAxisSpec = IPolarBandAxisSpec>
  extends Pick<
      BandAxisMixin,
      'valueToPosition' | 'updateGroupScaleRange' | 'getPosition' | 'calcScales' | 'computeBandDomain'
    >,
    PolarAxis<T> {}

export class PolarBandAxis<T extends IPolarBandAxisSpec = IPolarBandAxisSpec> extends PolarAxis<T> {
  static type = ComponentTypeEnum.polarBandAxis;
  type = ComponentTypeEnum.polarBandAxis;

  static specKey = 'axes';

  protected _scale: BandScale = new BandScale();

  protected declare _scales: BandScale[];

  protected computeDomain(data: { min: number; max: number; values: any[] }[]): StringOrNumber[] {
    return this.computeBandDomain(data);
  }

  protected updateScaleRange() {
    const isChanged = super.updateScaleRange();
    this.updateGroupScaleRange();

    return isChanged;
  }

  // axisHelper
  protected axisHelper() {
    const helper = super.axisHelper();
    const getBandwidth = (depth: number) => {
      return (helper.getScale(depth) as BandScale).bandwidth();
    };

    return { ...helper, getBandwidth };
  }

  protected initScales() {
    super.initScales();
    this.calcScales(this._defaultBandInnerPadding, this._defaultBandOuterPadding);
  }

  protected registerTicksTransform() {
    const name = `${this.type}-ticks`;
    registerDataSetInstanceTransform(this._option.dataSet, name, polarAngleAxisDiscreteTicks);
    return name;
  }
  transformScaleDomain() {
    // do nothing
  }
}
mixin(PolarBandAxis, BandAxisMixin);

export const registerPolarBandAxis = () => {
  registerLineAxis();
  registerLineGrid();
  registerCircleAxis();
  registerCircleGrid();
  registerAxis();
  Factory.registerComponent(PolarBandAxis.type, PolarBandAxis);
};
