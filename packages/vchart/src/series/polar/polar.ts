import type { IBaseScale } from '@visactor/vscale';
import type { IPoint, IPolarPoint } from '../../typings/coordinate';
import type { IPolarSeries } from '../interface';
import { array, isValid, isNil } from '@visactor/vutils';
import { couldBeValidNumber } from '../../util/type';
import type { IPolarAxisHelper } from '../../component/axis/polar/interface';
// eslint-disable-next-line no-duplicate-imports
import { isContinuous } from '@visactor/vscale';
import { POLAR_DEFAULT_RADIUS } from '../../constant/polar';
import { BaseSeries } from '../base/base-series';
import type { IPolarSeriesSpec } from './interface';
import type { Datum, StringOrNumber } from '../../typings';
import { sortDataInAxisHelper } from '../util/utils';

export abstract class PolarSeries<T extends IPolarSeriesSpec = IPolarSeriesSpec>
  extends BaseSeries<T>
  implements IPolarSeries
{
  readonly coordinate: 'polar' = 'polar';

  protected _outerRadius: number = POLAR_DEFAULT_RADIUS;
  public get outerRadius() {
    return this._outerRadius;
  }

  protected _innerRadius: number = 0;
  public get innerRadius() {
    return this._innerRadius;
  }

  protected _angleField: string[] = [];
  getAngleField() {
    return this._angleField;
  }
  setAngleField(f: string | string[]): string[] {
    this._angleField = isValid(f) ? array(f) : [];
    return this._angleField;
  }

  protected _radiusField: string[] = [];
  getRadiusField() {
    return this._radiusField;
  }
  setRadiusField(f: string | string[]): string[] {
    this._radiusField = isValid(f) ? array(f) : [];
    return this._radiusField;
  }

  protected _specAngleField: string[];
  protected _specRadiusField: string[];

  protected _innerRadiusField!: string[];
  public get innerRadiusField() {
    return this._innerRadiusField;
  }
  setInnerRadiusField(f: string | string[]): string[] {
    this._innerRadiusField = array(f);
    return this._innerRadiusField;
  }

  protected _radiusScale!: IBaseScale;
  public get radiusScale() {
    return this._radiusScale;
  }
  setRadiusScale(s: IBaseScale) {
    this._radiusScale = s;
    return s;
  }

  protected _angleScale!: IBaseScale;
  public get angleScale() {
    return this._angleScale;
  }
  setAngleScale(s: IBaseScale) {
    this._angleScale = s;
    return s;
  }

  private _angleAxisHelper!: IPolarAxisHelper;
  public get angleAxisHelper() {
    return this._angleAxisHelper;
  }
  public set angleAxisHelper(h: IPolarAxisHelper) {
    this._angleAxisHelper = h;
    this.onAngleAxisHelperUpdate();
  }

  private _radiusAxisHelper!: IPolarAxisHelper;
  public get radiusAxisHelper() {
    return this._radiusAxisHelper;
  }
  public set radiusAxisHelper(h: IPolarAxisHelper) {
    this._radiusAxisHelper = h;
    this.onRadiusAxisHelperUpdate();
  }

  protected _sortDataByAxis: boolean = false;
  get sortDataByAxis() {
    return this._sortDataByAxis;
  }

  protected _buildMarkAttributeContext() {
    super._buildMarkAttributeContext();
    // position
    this._markAttributeContext.valueToPosition = this.valueToPosition.bind(this);
    this._markAttributeContext.getCenter = () => this.angleAxisHelper.center();
    this._markAttributeContext.getLayoutRadius = () => this._computeLayoutRadius();
  }

  valueToPosition(angleValue: StringOrNumber | StringOrNumber[], radiusValue: StringOrNumber | StringOrNumber[]) {
    if (isNil(angleValue) || isNil(radiusValue) || !this.angleAxisHelper || !this.radiusAxisHelper) {
      return { x: Number.NaN, y: Number.NaN };
    }
    const angle = this.angleAxisHelper.dataToPosition(array(angleValue));
    const radius = this.radiusAxisHelper.dataToPosition(array(radiusValue));
    // FIXME: 由于存在两个轴，这里的 坐标系转换逻辑会有点尬
    return this.angleAxisHelper.coordToPoint({ angle, radius });
  }

  dataToPosition(datum: Datum, checkInViewData?: boolean): IPoint {
    if (!datum || !this.angleAxisHelper || !this.radiusAxisHelper) {
      return null;
    }
    if (checkInViewData && !this.isDatumInViewData(datum)) {
      return null;
    }
    // FIXME: 由于存在两个轴，这里的 坐标系转换逻辑会有点尬
    return this.valueToPosition(
      this.getDatumPositionValues(datum, this._angleField),
      this.getDatumPositionValues(datum, this._radiusField)
    );
  }

  dataToPositionX(datum: Datum): number {
    return this.dataToPosition(datum)?.x;
  }

  dataToPositionY(datum: Datum): number {
    return this.dataToPosition(datum)?.y;
  }

  dataToPositionZ(datum: Datum): number {
    return 0;
  }

  // todo: 待实现
  positionToData(p: IPolarPoint): any {
    /* do nothing */
  }
  radiusToData(r: number): any {
    /* do nothing */
  }
  angleToData(a: number): any {
    /* do nothing */
  }

  getStatisticFields() {
    const fields: { key: string; operations: Array<'max' | 'min' | 'values'> }[] = [];
    if (this.radiusAxisHelper?.getScale) {
      this._radiusField.forEach(f => {
        const result: { key: string; operations: Array<'max' | 'min' | 'values'> } = { key: f, operations: [] };
        if (isContinuous(this.radiusAxisHelper.getScale(0).type)) {
          result.operations = ['max', 'min'];
        } else {
          result.operations = ['values'];
        }
        fields.push(result);
      });
    }
    if (this.angleAxisHelper?.getScale) {
      this._angleField.forEach(f => {
        const result: { key: string; operations: Array<'max' | 'min' | 'values'> } = { key: f, operations: [] };
        if (isContinuous(this.angleAxisHelper.getScale(0).type)) {
          result.operations = ['max', 'min'];
        } else {
          result.operations = ['values'];
        }
        fields.push(result);
      });
    }
    return fields;
  }

  setAttrFromSpec() {
    super.setAttrFromSpec();
    if (isValid(this._spec.outerRadius)) {
      this._outerRadius = this._spec.outerRadius;
    }
    if (isValid(this._spec.radius)) {
      // 优先使用outerRadius, 但要兼容spec.radius
      this._outerRadius = this._spec.radius;
    }
    if (isValid(this._spec.innerRadius)) {
      this._innerRadius = this._spec.innerRadius;
    }

    if (isValid(this._spec.sortDataByAxis)) {
      this._sortDataByAxis = this._spec.sortDataByAxis === true;
    }
  }

  onRadiusAxisHelperUpdate(): void {
    this.onMarkPositionUpdate();
  }
  onAngleAxisHelperUpdate(): void {
    this.onMarkPositionUpdate();
  }

  afterInitMark(): void {
    super.afterInitMark();
  }

  protected _computeLayoutRadius() {
    const { width, height } = this._region.getLayoutRect();
    return Math.min(width / 2, height / 2);
  }

  fillData(): void {
    super.fillData();
    if (this.sortDataByAxis) {
      this._sortDataInAxisDomain();
    }
  }

  _sortDataInAxisDomain() {
    if (this.getViewData()?.latestData?.length) {
      sortDataInAxisHelper(this.angleAxisHelper, this._angleField[0], this.getViewData().latestData);
    }
  }

  _compareSpec(spec: T, prevSpec: T, ignoreCheckKeys?: { [key: string]: true }) {
    const result = super._compareSpec(spec, prevSpec);

    if (result.reMake) {
      return result;
    }

    if (this._sortDataByAxis) {
      result.reMake = true;
    }

    return result;
  }

  protected _getInvalidDefined(datum: Datum) {
    if (this.angleAxisHelper.isContinuous) {
      if (!couldBeValidNumber(datum[this._angleField[0]])) {
        return false;
      }
    }
    if (this.radiusAxisHelper.isContinuous) {
      if (!couldBeValidNumber(datum[this._radiusField[0]])) {
        return false;
      }
    }
    return true;
  }
}
