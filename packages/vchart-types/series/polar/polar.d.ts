import type { IBaseScale } from '@visactor/vscale';
import type { IPoint, IPolarPoint } from '../../typings/coordinate';
import type { IPolarSeries } from '../interface';
import type { IPolarAxisHelper } from '../../component/axis/polar/interface';
import { BaseSeries } from '../base/base-series';
import type { IPolarSeriesSpec } from './interface';
import type { Datum, StringOrNumber } from '../../typings';
export declare abstract class PolarSeries<T extends IPolarSeriesSpec = IPolarSeriesSpec>
  extends BaseSeries<T>
  implements IPolarSeries
{
  readonly coordinate: 'polar';
  protected _outerRadius: number;
  get outerRadius(): number;
  protected _innerRadius: number;
  get innerRadius(): number;
  protected _angleField: string[];
  getAngleField(): string[];
  setAngleField(f: string | string[]): string[];
  protected _radiusField: string[];
  getRadiusField(): string[];
  setRadiusField(f: string | string[]): string[];
  protected _innerRadiusField: string[];
  get innerRadiusField(): string[];
  setInnerRadiusField(f: string | string[]): string[];
  protected _radiusScale: IBaseScale;
  get radiusScale(): IBaseScale;
  setRadiusScale(s: IBaseScale): IBaseScale;
  protected _angleScale: IBaseScale;
  get angleScale(): IBaseScale;
  setAngleScale(s: IBaseScale): IBaseScale;
  private _angleAxisHelper;
  get angleAxisHelper(): IPolarAxisHelper;
  set angleAxisHelper(h: IPolarAxisHelper);
  private _radiusAxisHelper;
  get radiusAxisHelper(): IPolarAxisHelper;
  set radiusAxisHelper(h: IPolarAxisHelper);
  protected _sortDataByAxis: boolean;
  get sortDataByAxis(): boolean;
  protected _buildMarkAttributeContext(): void;
  valueToPosition(
    angleValue: StringOrNumber | StringOrNumber[],
    radiusValue: StringOrNumber | StringOrNumber[]
  ): IPoint;
  dataToPosition(datum: Datum): IPoint;
  dataToPositionX(datum: Datum): number;
  dataToPositionY(datum: Datum): number;
  dataToPositionZ(datum: Datum): number;
  positionToData(p: IPolarPoint): any;
  radiusToData(r: number): any;
  angleToData(a: number): any;
  getStatisticFields(): {
    key: string;
    operations: Array<'max' | 'min' | 'values'>;
  }[];
  protected _getDefaultSpecFromChart(chartSpec: any): Partial<T>;
  setAttrFromSpec(): void;
  onRadiusAxisHelperUpdate(): void;
  onAngleAxisHelperUpdate(): void;
  afterInitMark(): void;
  protected _computeLayoutRadius(): number;
  fillData(): void;
  _sortDataInAxisDomain(): void;
  protected _getInvalidDefined: (datum: Datum) => boolean;
}
