import { BandScale } from '@visactor/vscale';
import { CartesianAxis } from './axis';
import { DEFAULT_BAND_INNER_PADDING, DEFAULT_BAND_OUTER_PADDING } from './config';
import type { IAxisHelper, IAxisLocationCfg, ICartesianBandAxisSpec } from './interface';
import { ComponentTypeEnum } from '../../interface';
import { isValidNumber, mixin } from '@visactor/vutils';
import { BandAxisMixin } from '../mixin/band-axis-mixin';
import type { StringOrNumber } from '../../../typings';
import { registerDataSetInstanceParser, registerDataSetInstanceTransform } from '../../../data/register';
import { scaleParser } from '../../../data/parser/scale';
import type { ICartesianTickDataOpt } from '../../../data/transforms/tick-data';
// eslint-disable-next-line no-duplicate-imports
import { ticks } from '../../../data/transforms/tick-data';
import { DataView } from '@visactor/vdataset';
import { CompilableData } from '../../../compile/data';
import { isXAxis, isZAxis } from './util';
import type { DataFilterBaseComponent } from '../../data-zoom/data-filter-base-component';

export interface CartesianBandAxis
  extends Pick<
      BandAxisMixin,
      'valueToPosition' | 'updateGroupScaleRange' | 'getPosition' | 'calcScales' | 'computeBandDomain'
    >,
    CartesianAxis {}

export class CartesianBandAxis extends CartesianAxis {
  static type = ComponentTypeEnum.cartesianBandAxis;
  type = ComponentTypeEnum.cartesianBandAxis;

  protected _scale: BandScale = new BandScale();

  protected declare _scales: BandScale[];
  protected declare _spec: ICartesianBandAxisSpec;

  protected _relatedAutoDataFilterComponent?: DataFilterBaseComponent;
  setAutoDataFilterComponent(component: DataFilterBaseComponent) {
    this._relatedAutoDataFilterComponent = component;
  }

  protected _fixedWholeLength: number = NaN;

  protected computeDomain(data: { min: number; max: number; values: any[] }[]): StringOrNumber[] {
    return this.computeBandDomain(data);
  }

  protected updateScaleRange() {
    let isScaleChange = false;
    const { width, height } = this.getLayoutRect();
    const inverse = this._spec.inverse;
    let newRange: number[] = [];

    this.updateFixedWholeLength();

    if (isXAxis(this.orient)) {
      const length = isValidNumber(this._fixedWholeLength) ? Math.min(width, this._fixedWholeLength) : width;
      if (isValidNumber(length)) {
        newRange = inverse ? [length, 0] : [0, length];
      }
    } else if (isZAxis(this.orient)) {
      const length = isValidNumber(this._fixedWholeLength) ? Math.min(width, this._fixedWholeLength) : width;
      if (isValidNumber(length)) {
        // TODO 这里需要设置布局
        newRange = inverse ? [length, 0] : [0, length];
        this._scale.range(newRange);
      }
    } else {
      const length = isValidNumber(this._fixedWholeLength) ? Math.min(height, this._fixedWholeLength) : height;
      if (isValidNumber(length)) {
        newRange = inverse ? [0, length] : [length, 0];
      }
    }

    const [start, end] = this._scale.range();
    if (newRange[0] !== start || newRange[1] !== end) {
      isScaleChange = true;
      this._scale.range(newRange);
      // 更新 scrollBar
      if (this._relatedAutoDataFilterComponent) {
        const [start, end] = this._scale.rangeFactor();
        this._relatedAutoDataFilterComponent.setStartAndEnd(start, end);
        if (start === 0 && end === 1) {
          this._relatedAutoDataFilterComponent.hide();
        } else {
          this._relatedAutoDataFilterComponent.show();
        }
      }
    }

    this.updateGroupScaleRange();

    return isScaleChange;
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
      dataToPosition: this.dataToPosition.bind(this),
      getScale,
      getBandwidth,
      getStatisticsDomain: () => this.getStatisticsDomain(),
      getAxisType: () => this.type,
      getAxisId: () => this.id,
      isInverse: () => this._spec.inverse
    } as IAxisHelper;
  }

  protected _initData() {
    registerDataSetInstanceParser(this._option.dataSet, 'scale', scaleParser);
    registerDataSetInstanceTransform(this._option.dataSet, 'ticks', ticks);

    const label = this._spec.label || {};
    const tick = this._tick || {};
    const tickData = new DataView(this._option.dataSet)
      .parse(this._scale, {
        type: 'scale'
      })
      .transform(
        {
          type: 'ticks',
          options: {
            sampling: this._spec.sampling !== false && !this._spec.bandSize,
            tickCount: tick.tickCount,
            forceTickCount: tick.forceTickCount,
            tickStep: tick.tickStep,

            axisOrientType: this._orient,
            coordinateType: 'cartesian',

            labelStyle: label.style,
            labelFormatter: label.formatMethod,
            labelGap: label.minGap,

            labelLastVisible: label.lastVisible,
            labelFlush: label.flush
          } as ICartesianTickDataOpt
        },
        false
      );
    tickData.target.addListener('change', this._forceLayout.bind(this));

    this._tickData = new CompilableData(this._option, tickData);
  }

  dataToPosition(values: any[], cfg: IAxisLocationCfg = {}): number {
    if (values.length === 0 || this._scales.length === 0) {
      return 0;
    }
    const { position, bandScale } = this.getPosition(values);

    return position + bandScale.bandwidth() * (cfg.bandPosition ?? 0.5);
  }
  transformScaleDomain() {
    // do nothing
  }

  updateFixedWholeLength() {
    if (this._spec.bandSize) {
      // FIXME: vscale 发版后去掉 any
      (this._scale as any).bandwidth(this._spec.bandSize);
      this._fixedWholeLength = (this._scale as any).calculateWholeLength();
    }
  }
}

mixin(CartesianBandAxis, BandAxisMixin);
