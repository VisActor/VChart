import { BandScale } from '@visactor/vscale';
import { CartesianAxis } from './axis';
import { DEFAULT_BAND_INNER_PADDING, DEFAULT_BAND_OUTER_PADDING } from './config';
import type { IAxisLocationCfg, ICartesianBandAxisSpec } from './interface';
import { ComponentTypeEnum } from '../../interface';
import { mixin } from '@visactor/vutils';
import { BandAxisMixin } from '../mixin/band-axis-mixin';
import type { StringOrNumber } from '../../../typings';
export interface CartesianBandAxis<T extends ICartesianBandAxisSpec = ICartesianBandAxisSpec>
  extends Pick<
      BandAxisMixin,
      'valueToPosition' | 'updateGroupScaleRange' | 'getPosition' | 'calcScales' | 'computeBandDomain'
    >,
    CartesianAxis<T> {}

export class CartesianBandAxis<T extends ICartesianBandAxisSpec = ICartesianBandAxisSpec> extends CartesianAxis<T> {
  static type = ComponentTypeEnum.cartesianBandAxis;
  type = ComponentTypeEnum.cartesianBandAxis;

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

  protected initScales() {
    super.initScales();
    this.calcScales(DEFAULT_BAND_INNER_PADDING, DEFAULT_BAND_OUTER_PADDING);
  }

  protected axisHelper() {
    const getScale = (depth: number) => {
      return this._scales[depth];
    };
    const getBandwidth = (depth: number) => {
      return getScale(depth).bandwidth();
    };

    return {
      isContinuous: false,
      dataToPosition: this.dataToPosition.bind(this),
      getScale,
      getBandwidth,
      getStatisticsDomain: () => this.getStatisticsDomain(),
      getAxisType: () => this.type,
      getAxisId: () => this.id,
      isInverse: () => this._spec.inverse
    };
  }

  dataToPosition(values: any[], cfg: IAxisLocationCfg = {}): number {
    if (values.length === 0 || this._scales.length === 0) {
      return 0;
    }
    const { position, bandScale } = this.getPosition(values);

    return position + bandScale.bandwidth() * (cfg.bandPosition ?? 0.5);
  }

  transformScaleDomain() {
    this.updateFixedWholeLength();
  }

  updateFixedWholeLength() {
    if (this._scale) {
      if (this._spec.bandSize) {
        this._scale.bandwidth(this._spec.bandSize);
      }
      if (this._spec.maxBandSize) {
        this._scale.maxBandwidth(this._spec.maxBandSize);
      }
      if (this._spec.minBandSize) {
        this._scale.minBandwidth(this._spec.minBandSize);
      }
    }
  }
}

mixin(CartesianBandAxis, BandAxisMixin);
