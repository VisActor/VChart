import { BandScale } from '@visactor/vscale';
import { CartesianAxis } from './axis';
import { DEFAULT_BAND_INNER_PADDING, DEFAULT_BAND_OUTER_PADDING, DEFAULT_BAND_POSITION } from './config';
import type { IAxisLocationCfg, ICartesianBandAxisSpec } from './interface';
import { ComponentTypeEnum } from '../../interface/type';
import { mixin } from '@visactor/vutils';
import { BandAxisMixin } from '../mixin/band-axis-mixin';
import type { StringOrNumber } from '../../../typings';
import { Factory } from '../../../core/factory';
import { registerAxis } from '../base-axis';
import { scaleWholeRangeSize } from './util/common';

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

    return (
      position + bandScale.bandwidth() * (cfg.bandPosition ?? this.getSpec().bandPosition ?? DEFAULT_BAND_POSITION)
    );
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
      // 更改 region 最大大小
      if (
        this._scale.isBandwidthFixed() &&
        this._spec.autoRegionSize &&
        (this._spec.bandSize || this._spec.maxBandSize)
      ) {
        const rangeSize = scaleWholeRangeSize(
          this._scale.domain().length,
          this._spec.bandSize ?? this._spec.maxBandSize,
          this._scale.paddingInner(),
          this._scale.paddingOuter()
        );
        if (['bottom', 'top'].includes(this._orient)) {
          this._regions.forEach(region => region.setMaxWidth(rangeSize));
        } else if (['left', 'right'].includes(this._orient)) {
          this._regions.forEach(region => region.setMaxHeight(rangeSize));
        }
      }
    }
  }
}

mixin(CartesianBandAxis, BandAxisMixin);

export const registerCartesianBandAxis = () => {
  registerAxis();
  Factory.registerComponent(CartesianBandAxis.type, CartesianBandAxis);
};
