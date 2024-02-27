import { BandScale, scaleWholeRangeSize } from '@visactor/vscale';
import { CartesianAxis } from './axis';
import type { ICartesianBandAxisSpec } from './interface';
import { ComponentTypeEnum } from '../../interface';
import { isNil, isValid, mixin } from '@visactor/vutils';
import { BandAxisMixin } from '../mixin/band-axis-mixin';
import type { StringOrNumber } from '../../../typings';
import { Factory } from '../../../core/factory';
import { registerAxis } from '../base-axis';

export interface CartesianBandAxis<T extends ICartesianBandAxisSpec = ICartesianBandAxisSpec>
  extends Pick<
      BandAxisMixin,
      'valueToPosition' | 'updateGroupScaleRange' | 'getPosition' | 'calcScales' | 'computeBandDomain'
    >,
    CartesianAxis<T> {}

export class CartesianBandAxis<T extends ICartesianBandAxisSpec = ICartesianBandAxisSpec> extends CartesianAxis<T> {
  static type = ComponentTypeEnum.cartesianBandAxis;
  type = ComponentTypeEnum.cartesianBandAxis;

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

  protected initScales() {
    super.initScales();
    this.calcScales(this._defaultBandInnerPadding, this._defaultBandOuterPadding);
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
      getAxisType: () => this.type,
      getAxisId: () => this.id,
      isInverse: () => this._inverse,
      getSpec: () => this._spec
    };
  }

  transformScaleDomain() {
    this.updateFixedWholeLength();
  }

  updateFixedWholeLength() {
    if (this._scale) {
      const { bandSize, maxBandSize, minBandSize } = this._getOuterBandSizeFromSpec();
      if (bandSize) {
        this._scale.bandwidth(bandSize);
      }
      if (maxBandSize) {
        this._scale.maxBandwidth(maxBandSize);
      }
      if (minBandSize) {
        this._scale.minBandwidth(minBandSize);
      }
      // 更改 region 最大大小
      if (this._scale.isBandwidthFixed() && this._spec.autoRegionSize && (bandSize || maxBandSize)) {
        const rangeSize = scaleWholeRangeSize(
          this._scale.domain().length,
          bandSize ?? maxBandSize,
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

  /** 获取最外层 scale 的实际 bandSize 配置 */
  protected _getOuterBandSizeFromSpec() {
    let { bandSize, maxBandSize, minBandSize, bandSizeLevel = 0 } = this._spec;
    const { gap, extend = 0 } = this._spec.bandSizeExtend ?? {};
    bandSizeLevel = Math.min(bandSizeLevel, this._scales.length - 1);

    // 由内而外计算最外层 scale 的 bandSize
    for (let i = bandSizeLevel; i > 0; i--) {
      const scale = this._scales[i];
      const domain = scale.domain();
      const n = domain.length;
      const pi = scale.paddingInner();
      const po = scale.paddingOuter();

      const extendValue = i === bandSizeLevel ? extend : 0;

      if (isNil(gap) || i < bandSizeLevel) {
        if (isValid(bandSize)) {
          bandSize = scaleWholeRangeSize(n, bandSize, pi, po) + extendValue;
        }
        if (isValid(maxBandSize)) {
          maxBandSize = scaleWholeRangeSize(n, maxBandSize, pi, po) + extendValue;
        }
        if (isValid(minBandSize)) {
          minBandSize = scaleWholeRangeSize(n, minBandSize, pi, po) + extendValue;
        }
      } else {
        // 使组间距恰好等于柱间距
        const pi0 = this._scales[i - 1].paddingInner();
        if (isValid(bandSize)) {
          bandSize = ((bandSize + gap) * n) / (pi0 + 1) + extendValue;
        }
        if (isValid(maxBandSize)) {
          maxBandSize = ((maxBandSize + gap) * n) / (pi0 + 1) + extendValue;
        }
        if (isValid(minBandSize)) {
          minBandSize = ((minBandSize + gap) * n) / (pi0 + 1) + extendValue;
        }
      }
    }

    return {
      bandSize,
      maxBandSize,
      minBandSize
    };
  }
}

mixin(CartesianBandAxis, BandAxisMixin);

export const registerCartesianBandAxis = () => {
  registerAxis();
  Factory.registerComponent(CartesianBandAxis.type, CartesianBandAxis);
};
