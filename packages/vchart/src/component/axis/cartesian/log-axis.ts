import type { IEffect } from '../../../model/interface';
import { DataView } from '@visactor/vdataset';
import { isXAxis, TimeUtil } from './util';
import { eachSeries, isArray, merge } from '../../../util';
import type { ICartesianSeries } from '../../../series/interface';
import { CartesianLinearAxis } from './linear-axis';
import type { ICartesianTickDataOpt } from '../../../data/transforms/tick-data';
import { ComponentTypeEnum } from '../../interface';
import type { Datum } from '../../../typings';
import { CompilableData } from '../../../compile/data';
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

  effect: IEffect = {
    scaleUpdate: () => {
      this.computeData();
      eachSeries(
        this._regions,
        s => {
          if (isXAxis(this.orient)) {
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

  // setAttrFromSpec() {
  //   super.setAttrFromSpec();
  //   this._tick = merge({}, this._spec.tick, this._spec.layers?.[0]);
  // }

  // protected _initData() {
  //   super._initData();

  //   const tickData = new DataView(this._option.dataSet)
  //     .parse(this._scale, {
  //       type: 'scale'
  //     })
  //     .transform(
  //       {
  //         type: 'ticks',
  //         options: {
  //           tickCount: tick.tickCount,
  //           forceTickCount: tick.forceTickCount,
  //           tickStep: tick.tickStep,

  //           axisOrientType: this._orient,
  //           coordinateType: 'cartesian',

  //           labelStyle: label.style,
  //           labelFormatter: label.formatMethod,
  //           labelGap: label.minGap,

  //           labelLastVisible: label.lastVisible,
  //           labelFlush: label.flush
  //         } as ICartesianTickDataOpt
  //       },
  //       false
  //     );
  //   tickData.target.addListener('change', this._forceLayout.bind(this));

  //   this._tickData = new CompilableData(this._option, tickData);
  // }

  // protected getLabelFormatMethod(): any {
  //   const timeUtil = TimeUtil.getInstance();
  //   const timeFormat1 = this._spec?.layers?.[1]?.timeFormat || '%Y%m%d';
  //   const timeFormatMode1 = this._spec?.layers?.[1]?.timeFormatMode || 'local';
  //   const timeFormatter1 = timeFormatMode1 === 'local' ? timeUtil.timeFormat : timeUtil.timeUTCFormat;

  //   const timeFormat0 = this._spec?.layers?.[0]?.timeFormat || '%Y%m%d';
  //   const timeFormatMode0 = this._spec?.layers?.[0]?.timeFormatMode || 'local';
  //   const timeFormatter0 = timeFormatMode0 === 'local' ? timeUtil.timeFormat : timeUtil.timeUTCFormat;

  //   return (value: any, datum: any, index: number, data: any[], layer: number) => {
  //     let timeValue: string;
  //     if (layer === 0) {
  //       timeValue = timeFormatter0(timeFormat0, value);
  //     } else {
  //       timeValue = timeFormatter1(timeFormat1, value);
  //     }

  //     return this._spec.label?.formatMethod ? this._spec.label.formatMethod(timeValue, datum) : timeValue;
  //   };
  // }

  // protected getLabelItems(length: number) {
  //   const items = [];
  //   if (isArray(this._tickData.getLatestData())) {
  //     items.push(
  //       this._tickData.getLatestData().map((obj: Datum) => {
  //         return {
  //           id: obj.value,
  //           label: obj.value,
  //           value: length === 0 ? 0 : this.dataToPosition([obj.value]) / length,
  //           rawValue: obj.value
  //         };
  //       })
  //     );
  //   }

  //   if (this._layerTickData && isArray(this._layerTickData.getLatestData())) {
  //     items.push(
  //       this._layerTickData.getLatestData().map((obj: Datum) => {
  //         const value = this.dataToPosition([obj.value]);
  //         return {
  //           id: obj.value,
  //           label: obj.value,
  //           value: value / length,
  //           rawValue: obj.value
  //         };
  //       })
  //     );
  //   }

  //   return items;
  // }
  transformScaleDomain() {
    // do nothing
  }
}
