import type { Datum } from '@visactor/vgrammar';
import { degreeToRadian, isValid, isValidNumber } from '@visactor/vutils';
import { POLAR_END_RADIAN, POLAR_START_RADIAN, STACK_FIELD_END, STACK_FIELD_START } from '../../../constant';
import type { IMarkStyle } from '../../../mark/interface';
import type { ConvertToMarkStyleSpec, ICommonSpec } from '../../../typings';
import { valueInScaleRange } from '../../../util';
import { PolarSeries } from '../polar';
import type { IProgressLikeSeriesSpec } from './interface';

export abstract class ProgressLikeSeries<T extends IProgressLikeSeriesSpec> extends PolarSeries<T> {
  protected _stack: boolean = true;

  protected _startAngle: number;
  protected _endAngle: number;

  setAttrFromSpec(): void {
    super.setAttrFromSpec();
    const chartSpec = this._option.globalInstance.getChart()?.getSpec() as any;
    const startAngle = this._spec.startAngle ?? chartSpec?.startAngle;
    this._startAngle = isValid(startAngle) ? degreeToRadian(startAngle) : POLAR_START_RADIAN;
    const endAngle = this._spec.endAngle ?? chartSpec?.endAngle;
    this._endAngle = isValid(endAngle) ? degreeToRadian(endAngle) : POLAR_END_RADIAN;

    // 值信息给角度
    this.setAngleField(this._spec.valueField || this._spec.angleField);
    // 分类信息给半径
    this.setRadiusField(this._spec.categoryField || this._spec.radiusField);
  }

  getStackGroupFields(): string[] {
    return this._radiusField;
  }

  getStackValueField() {
    return this._angleField?.[0];
  }

  setValueFieldToStack(): void {
    // this.setAngleField(STACK_FIELD_END);
  }

  setValueFieldToPercent(): void {
    //do nothing
  }

  setValueFieldToStackOffsetSilhouette(): void {
    // do nothing
  }

  getGroupFields() {
    return this._angleField;
  }

  /** 重载 mark style 赋值前转换逻辑 */
  protected _convertMarkStyle<T extends ICommonSpec = ICommonSpec>(
    style: Partial<IMarkStyle<T> | ConvertToMarkStyleSpec<T>>
  ): Partial<IMarkStyle<T> | ConvertToMarkStyleSpec<T>> {
    const newStyle = super._convertMarkStyle(style) as unknown as any;

    const fillKey = 'fill';
    if (newStyle[fillKey]) {
      const value = style[fillKey] as unknown as any;
      // 为环形渐变色自动加 startAngle 和 endAngle
      if (value?.gradient === 'conical' && !isValid(value?.startAngle) && !isValid(value?.endAngle)) {
        newStyle[fillKey] = {
          ...value,
          startAngle: this._startAngle,
          endAngle: this._endAngle
        };
      }
    }

    return newStyle;
  }

  protected _getAngleValueStart(datum: Datum) {
    if (this._stack) {
      const value = valueInScaleRange(
        this.angleAxisHelper.dataToPosition([datum[STACK_FIELD_START]]),
        this.angleAxisHelper.getScale(0)
      );
      if (isValidNumber(value)) {
        return value;
      }
    }
    return this._startAngle;
  }

  protected _getAngleValueEnd(datum: Datum) {
    if (this._stack) {
      const value = valueInScaleRange(
        this.angleAxisHelper.dataToPosition([datum[STACK_FIELD_END]]),
        this.angleAxisHelper.getScale(0)
      );
      if (isValidNumber(value)) {
        return value;
      }
    }
    return this.angleAxisHelper.dataToPosition([datum[this._angleField[0]]]);
  }

  getDimensionField(): string[] {
    return this._radiusField;
  }

  getMeasureField(): string[] {
    return this._angleField;
  }
}
