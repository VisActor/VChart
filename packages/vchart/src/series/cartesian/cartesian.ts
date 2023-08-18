import type { ICartesianSeries } from '../interface';
import { BaseSeries } from '../base/base-series';
import type { IPoint } from '../../typings/coordinate';
import type { IBaseScale } from '@visactor/vscale';
import {
  STACK_FIELD_END,
  STACK_FIELD_END_PERCENT,
  STACK_FIELD_END_OffsetSilhouette,
  STACK_FIELD_START,
  STACK_FIELD_START_PERCENT,
  STACK_FIELD_START_OffsetSilhouette
} from '../../constant';
import type { IAxisHelper } from '../../component/axis/cartesian/interface';
import type { DirectionType } from '../../typings/space';
// eslint-disable-next-line no-duplicate-imports
import { Direction } from '../../typings/space';
import type { Datum, StringOrNumber } from '../../typings';
import { array, shallowCompare, isValid } from '../../util';
// eslint-disable-next-line no-duplicate-imports
import { isContinuous } from '@visactor/vscale';
import type { StatisticOperations } from '../../data/transforms/dimension-statistics';
import type { ICartesianSeriesSpec } from './interface';

export abstract class CartesianSeries<T extends ICartesianSeriesSpec = ICartesianSeriesSpec>
  extends BaseSeries<T>
  implements ICartesianSeries
{
  readonly coordinate: 'cartesian' = 'cartesian';
  protected _bandPosition = 0.5;

  protected _fieldX!: string[];
  get fieldX() {
    return this._fieldX;
  }
  setFieldX(f: string | string[]) {
    this._fieldX = array(f);
  }

  protected _fieldY!: string[];
  get fieldY() {
    return this._fieldY;
  }
  setFieldY(f: string | string[]) {
    this._fieldY = array(f);
  }

  protected _fieldZ?: string[];
  get fieldZ(): string[] | undefined {
    return this._fieldZ;
  }
  setFieldZ(f?: string | string[]) {
    this._fieldZ = f && array(f);
  }

  protected _fieldX2!: string;
  get fieldX2() {
    return this._fieldX2;
  }
  setFieldX2(f: string) {
    this._fieldX2 = f;
  }

  protected _fieldY2!: string;
  get fieldY2() {
    return this._fieldY2;
  }
  setFieldY2(f: string) {
    this._fieldY2 = f;
  }

  protected _direction: DirectionType = Direction.vertical;
  get direction() {
    return this._direction;
  }

  protected _scaleX!: IBaseScale;
  get scaleX() {
    return this._scaleX;
  }
  setScaleX(s: IBaseScale) {
    this._scaleX = s;
  }

  protected _scaleY!: IBaseScale;
  get scaleY() {
    return this._scaleY;
  }
  setScaleY(s: IBaseScale) {
    this._scaleY = s;
  }

  protected _scaleZ?: IBaseScale;
  get scaleZ() {
    return this._scaleZ;
  }
  setScaleZ(s: IBaseScale) {
    this._scaleZ = s;
  }

  _xAxisHelper!: IAxisHelper;
  getXAxisHelper() {
    return this._xAxisHelper;
  }
  setXAxisHelper(h: IAxisHelper) {
    this._xAxisHelper = h;
    this.onXAxisHelperUpdate();
  }

  _yAxisHelper!: IAxisHelper;
  getYAxisHelper() {
    return this._yAxisHelper;
  }
  setYAxisHelper(h: IAxisHelper) {
    this._yAxisHelper = h;
    this.onYAxisHelperUpdate();
  }

  _zAxisHelper?: IAxisHelper;
  getZAxisHelper() {
    return this._zAxisHelper;
  }
  setZAxisHelper(h: IAxisHelper) {
    this._zAxisHelper = h;
    this.onYAxisHelperUpdate();
  }

  getStatisticFields() {
    const fields: { key: string; operations: StatisticOperations }[] = [];
    if (this.getXAxisHelper()?.getScale) {
      (this._fieldX2 ? [...this._fieldX, this._fieldX2] : this._fieldX).forEach(f => {
        const result: { key: string; operations: Array<'max' | 'min' | 'values'> } = { key: f, operations: [] };
        if (isContinuous(this.getXAxisHelper().getScale(0).type)) {
          result.operations = ['max', 'min'];
        } else {
          result.operations = ['values'];
        }
        fields.push(result);
      });
    }
    if (this.getYAxisHelper()?.getScale) {
      (this._fieldY2 ? [...this._fieldY, this._fieldY2] : this._fieldY).forEach(f => {
        const result: { key: string; operations: Array<'max' | 'min' | 'values'> } = { key: f, operations: [] };
        if (isContinuous(this.getYAxisHelper().getScale(0).type)) {
          result.operations = ['max', 'min'];
        } else {
          result.operations = ['values'];
        }
        fields.push(result);
      });
    }
    if (this._fieldZ && this.getZAxisHelper()?.getScale) {
      this._fieldZ.forEach(f => {
        const result: { key: string; operations: Array<'max' | 'min' | 'values'> } = { key: f, operations: [] };
        if (isContinuous(this.getZAxisHelper().getScale(0).type)) {
          result.operations = ['max', 'min'];
        } else {
          result.operations = ['values'];
        }
        fields.push(result);
      });
    }
    return fields;
  }

  getGroupFields() {
    return this.direction === 'vertical' ? this._fieldX : this._fieldY;
  }

  getStackGroupFields(): string[] {
    return this.getGroupFields();
  }

  getStackValueField() {
    // TODO: hack
    if (this.direction === Direction.vertical) {
      return array(this._spec.yField)[0];
    }
    return array(this._spec.xField)[0];
  }

  setValueFieldToStack(): void {
    if (this.direction === Direction.vertical) {
      this.setFieldY(STACK_FIELD_END);
      this.setFieldY2(STACK_FIELD_START);
    } else {
      this.setFieldX(STACK_FIELD_END);
      this.setFieldX2(STACK_FIELD_START);
    }
  }

  setValueFieldToPercent(): void {
    if (this.direction === Direction.vertical) {
      this.setFieldY(STACK_FIELD_END_PERCENT);
      this.setFieldY2(STACK_FIELD_START_PERCENT);
    } else {
      this.setFieldX(STACK_FIELD_END_PERCENT);
      this.setFieldX2(STACK_FIELD_START_PERCENT);
    }
  }

  setValueFieldToStackOffsetSilhouette(): void {
    if (this.direction === Direction.vertical) {
      this.setFieldY(STACK_FIELD_END_OffsetSilhouette);
      this.setFieldY2(STACK_FIELD_START_OffsetSilhouette);
    } else {
      this.setFieldX(STACK_FIELD_END_OffsetSilhouette);
      this.setFieldX2(STACK_FIELD_START_OffsetSilhouette);
    }
  }

  onXAxisHelperUpdate(): void {
    this.onMarkPositionUpdate();
  }

  onYAxisHelperUpdate(): void {
    this.onMarkPositionUpdate();
  }

  onZAxisHelperUpdate(): void {
    this.onMarkPositionUpdate();
  }

  updateSpec(spec: any) {
    const originalSpec = this._originalSpec;
    const { xField, yField } = originalSpec;
    const result = super.updateSpec(spec);
    if (!shallowCompare(spec.xField, xField) || !shallowCompare(spec.yField, yField)) {
      result.change = true;
      result.reRender = true;
      result.reMake = true;
    }
    return result;
  }

  setAttrFromSpec() {
    super.setAttrFromSpec();
    this.setFieldX(this._spec.xField);
    this.setFieldY(this._spec.yField);
    this.setFieldZ(this._spec.zField);
    if (isValid(this._spec.direction)) {
      this._direction = this._spec.direction;
    }

    this.setFieldX2(this._spec?.x2Field);
    this.setFieldY2(this._spec?.y2Field);

    if (this._stack) {
      this.setValueFieldToStack();
    }
    if (this._percent) {
      this.setValueFieldToPercent();
    }
    if (this._stackOffsetSilhouette) {
      this.setValueFieldToStackOffsetSilhouette();
    }
  }

  dataToPosition(datum: Datum): IPoint | null {
    if (!datum) {
      return null;
    }
    return {
      x: this.dataToPositionX(datum),
      y: this.dataToPositionY(datum)
    } as IPoint;
  }

  protected _buildMarkAttributeContext() {
    super._buildMarkAttributeContext();
    // position
    this._markAttributeContext.valueToX = this.valueToPositionX.bind(this);
    this._markAttributeContext.valueToY = this.valueToPositionY.bind(this);
    this._markAttributeContext.xBandwidth = (depth: number = 0) => this.getXAxisHelper().getBandwidth?.(depth) ?? 0;
    this._markAttributeContext.yBandwidth = (depth: number = 0) => this.getYAxisHelper().getBandwidth?.(depth) ?? 0;
    this._markAttributeContext.valueToPosition = this.valueToPosition.bind(this);
  }

  valueToPosition(xValue: StringOrNumber | StringOrNumber[], yValue: StringOrNumber | StringOrNumber[]) {
    return {
      x: this.valueToPositionX(xValue),
      y: this.valueToPositionY(yValue)
    };
  }

  valueToPositionX(value: StringOrNumber | StringOrNumber[]) {
    if (!this._xAxisHelper) {
      return Number.NaN;
    }
    const { dataToPosition } = this._xAxisHelper;
    return dataToPosition(array(value), { bandPosition: this._bandPosition });
  }

  valueToPositionY(value: StringOrNumber | StringOrNumber[]) {
    if (!this._yAxisHelper) {
      return Number.NaN;
    }
    const { dataToPosition } = this._yAxisHelper;
    return dataToPosition(array(value), { bandPosition: this._bandPosition });
  }

  dataToPositionX(datum: Datum): number {
    if (!this._xAxisHelper) {
      return Number.NaN;
    }

    const { dataToPosition, getFields } = this._xAxisHelper;
    const fields = getFields ? getFields() : this._fieldX;
    const value = this.getDatumPositionValues(datum, fields);
    return dataToPosition(array(value), { bandPosition: this._bandPosition, datum });
  }

  dataToPositionY(datum: Datum): number {
    if (!this._yAxisHelper) {
      return Number.NaN;
    }
    const { dataToPosition, getFields } = this._yAxisHelper;
    const fields = getFields ? getFields() : this._fieldY;
    const value = this.getDatumPositionValues(datum, fields);
    return dataToPosition(array(value), { bandPosition: this._bandPosition, datum });
  }

  dataToPositionZ(datum: Datum): number {
    if (!this._zAxisHelper) {
      return Number.NaN;
    }
    const { dataToPosition } = this._zAxisHelper;

    return dataToPosition(this.getDatumPositionValues(datum, this._fieldZ), {
      bandPosition: this._bandPosition
    });
  }

  dataToPositionX1(datum: Datum): number {
    if (!this._xAxisHelper) {
      return Number.NaN;
    }
    return this._fieldX2 && this._fieldX2 in datum
      ? this.valueToPositionX(this.getDatumPositionValues(datum, this._fieldX2))
      : this._xAxisHelper.getScale?.(0).range()[0];
  }

  dataToPositionY1(datum: Datum): number {
    if (!this._yAxisHelper) {
      return Number.NaN;
    }
    return this._fieldY2 && this._fieldY2 in datum
      ? this.valueToPositionY(this.getDatumPositionValues(datum, this._fieldY2))
      : this._yAxisHelper.getScale?.(0).range()[0];
  }

  positionToData(p: IPoint): IPoint | null {
    if (!p) {
      return null;
    }
    return {
      x: this.positionToDataX(p.x),
      y: this.positionToDataY(p.y)
    };
  }

  positionToDataX(xPos: number): any | null {
    if (!this._scaleX) {
      return null;
    }
    return this._scaleX.invert(xPos);
  }

  positionToDataY(yPos: number): any | null {
    if (!this._scaleY) {
      return null;
    }
    return this._scaleY.invert(yPos);
  }

  getRegionRectLeft(): number {
    if (!this._xAxisHelper) {
      return Number.NaN;
    }
    const { getScale } = this._xAxisHelper;
    return getScale(0).range()[0];
  }

  getRegionRectRight(): number {
    if (!this._xAxisHelper) {
      return Number.NaN;
    }
    const { getScale } = this._xAxisHelper;
    return getScale(0).range()[1];
  }

  afterInitMark(): void {
    super.afterInitMark();
    this.setFieldX(this._fieldX);
    this.setFieldY(this._fieldY);
    this._trigger.setStateKeys([...this._fieldX, ...this._fieldY]);
  }

  getDimensionField(): string[] {
    if (this._direction === Direction.vertical) {
      return this.fieldX;
    }
    return this.fieldY;
  }

  getMeasureField(): string[] {
    if (this._direction === Direction.vertical) {
      return array(this._spec.yField ?? this.fieldY);
    }
    return array(this._spec.xField ?? this.fieldX);
  }
}
