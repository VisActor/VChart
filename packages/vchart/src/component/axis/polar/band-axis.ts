import { BandScale } from '@visactor/vscale';
import { ComponentTypeEnum } from '../../interface';
import { PolarAxis } from './axis';
import { DEFAULT_BAND_INNER_PADDING, DEFAULT_BAND_OUTER_PADDING } from './config';
import { mixin } from '@visactor/vutils';
import { BandAxisMixin } from '../mixin/band-axis-mixin';
import type { StringOrNumber } from '../../../typings';

export interface PolarBandAxis
  extends Pick<
      BandAxisMixin,
      'valueToPosition' | 'updateGroupScaleRange' | 'getPosition' | 'calcScales' | 'computeBandDomain'
    >,
    PolarAxis {}

export class PolarBandAxis extends PolarAxis {
  static type = ComponentTypeEnum.polarBandAxis;
  type = ComponentTypeEnum.polarBandAxis;

  protected _scale: BandScale = new BandScale();

  protected declare _scales: BandScale[];

  protected computeDomain(data: { min: number; max: number; values: any[] }[]): StringOrNumber[] {
    return this.computeBandDomain(data);
  }

  dataToPosition(values: any[]): number {
    if (values.length === 0 || this._scales.length === 0) {
      return 0;
    }
    const { position } = this.getPosition(values);
    return position;
  }

  protected updateScaleRange() {
    super.updateScaleRange();
    this.updateGroupScaleRange();
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
    this.calcScales(DEFAULT_BAND_INNER_PADDING, DEFAULT_BAND_OUTER_PADDING);
  }

  transformScaleDomain() {
    // do nothing
  }
}
mixin(PolarBandAxis, BandAxisMixin);
