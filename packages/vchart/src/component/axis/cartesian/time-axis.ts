import type { IEffect } from '../../../model/interface';
import { DataView } from '@visactor/vdataset';
import { isXAxis } from './util/common';
import { TimeUtil } from '@visactor/vutils';
import { eachSeries } from '../../../util/model';
import type { ICartesianSeries } from '../../../series/interface';
import { CartesianLinearAxis } from './linear-axis';
import type { ICartesianTickDataOpt } from '@visactor/vrender-components';
import { ComponentTypeEnum } from '../../interface/type';
import type { Datum } from '../../../typings';
import { CompilableData } from '../../../compile/data/compilable-data';
import type { LinearAxisMixin } from '../mixin/linear-axis-mixin';
import type { ICartesianTimeAxisSpec } from './interface';
import { Factory } from '../../../core/factory';
import { registerAxis } from '../base-axis';
import { getAxisItem } from '../util';
// eslint-disable-next-line no-duplicate-imports
import { mergeSpec } from '@visactor/vutils-extension';

export interface CartesianTimeAxis<T extends ICartesianTimeAxisSpec = ICartesianTimeAxisSpec>
  extends Pick<LinearAxisMixin, 'valueToPosition'>,
    CartesianLinearAxis<T> {}

export class CartesianTimeAxis<
  T extends ICartesianTimeAxisSpec = ICartesianTimeAxisSpec
> extends CartesianLinearAxis<T> {
  static type = ComponentTypeEnum.cartesianTimeAxis;
  type = ComponentTypeEnum.cartesianTimeAxis;

  static specKey = 'axes';

  protected _layerTickData!: CompilableData;

  protected _zero: boolean = false;

  effect: IEffect = {
    scaleUpdate: params => {
      this.computeData(params?.value);
      eachSeries(
        this._regions,
        s => {
          if (isXAxis(this.getOrient())) {
            (s as ICartesianSeries).setXAxisHelper(this.axisHelper());
          } else {
            (s as ICartesianSeries).setYAxisHelper(this.axisHelper());
          }
        },
        {
          userId: this._seriesUserId,
          specIndex: this._seriesIndex
        }
      );
    }
  };

  setAttrFromSpec() {
    super.setAttrFromSpec();
    this._tick = mergeSpec({}, this._spec.tick, this._spec.layers?.[0]);
  }

  protected _initData() {
    super._initData();

    // 如果layer数组的第二项未配置，则不显示第二层
    if (this._spec.layers?.[1]) {
      const layerTickData = new DataView(this._option.dataSet, { name: `${this.type}_${this.id}_layer_1_ticks` })
        .parse(this._scale, {
          type: 'scale'
        })
        .transform(
          {
            type: 'ticks',
            options: {
              ...this._tickTransformOption(),
              tickCount: this._spec.layers[1].tickCount,
              forceTickCount: this._spec.layers[1].forceTickCount,
              tickStep: this._spec.layers[1].tickStep
            } as ICartesianTickDataOpt
          },
          false
        );
      this._layerTickData = new CompilableData(this._option, layerTickData);
    }
  }

  /**
   * @override
   */
  protected computeData(updateType?: 'range' | 'domain' | 'force'): void {
    super.computeData(updateType);
    if (this._layerTickData) {
      this._layerTickData.getDataView().reRunAllTransform();
      this._layerTickData.updateData();
    }
  }

  protected _getLabelFormatMethod(): any {
    const timeUtil = TimeUtil.getInstance();
    const timeFormat1 = this._spec.layers?.[1]?.timeFormat || '%Y%m%d';
    const timeFormatMode1 = this._spec.layers?.[1]?.timeFormatMode || 'local';
    const timeFormatter1 = timeFormatMode1 === 'local' ? timeUtil.timeFormat : timeUtil.timeUTCFormat;

    const timeFormat0 = this._spec.layers?.[0]?.timeFormat || '%Y%m%d';
    const timeFormatMode0 = this._spec.layers?.[0]?.timeFormatMode || 'local';
    const timeFormatter0 = timeFormatMode0 === 'local' ? timeUtil.timeFormat : timeUtil.timeUTCFormat;

    return (value: any, datum: any, index: number, data: any[], layer: number) => {
      let timeValue: string;
      if (layer === 0) {
        timeValue = timeFormatter0(timeFormat0, value);
      } else {
        timeValue = timeFormatter1(timeFormat1, value);
      }

      return this._spec.label?.formatMethod ? this._spec.label.formatMethod(timeValue, datum) : timeValue;
    };
  }

  protected getLabelItems(length: number) {
    const items = [];

    const tickLatestData = this.getTickData()?.getLatestData();
    if (tickLatestData && tickLatestData.length) {
      items.push(
        tickLatestData.map((obj: Datum) => {
          return getAxisItem(obj.value, this._getNormalizedValue([obj.value], length));
        })
      );
    }

    const layerLatestData = this._layerTickData?.getLatestData();
    if (layerLatestData && layerLatestData.length) {
      items.push(
        layerLatestData.map((obj: Datum) => {
          return getAxisItem(obj.value, this._getNormalizedValue([obj.value], length));
        })
      );
    }

    return items;
  }
  transformScaleDomain() {
    // do nothing
  }
}

export const registerCartesianTimeAxis = () => {
  registerAxis();
  Factory.registerComponent(CartesianTimeAxis.type, CartesianTimeAxis);
};
