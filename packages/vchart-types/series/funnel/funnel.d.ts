import type { IFunnelSeries, SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum } from '../interface/type';
import type { IOrientType, Maybe, Datum, StringOrNumber } from '../../typings';
import { SeriesTypeEnum } from '../interface';
import type { IPolygonMark } from '../../mark/polygon/polygon';
import { BaseSeries } from '../base/base-series';
import { MarkTypeEnum } from '../../mark/interface';
import type { ITextMark } from '../../mark/text';
import type { IFunnelSeriesSpec, IFunnelSeriesTheme } from './interface';
import type { IRuleMark } from '../../mark/rule';
import { SeriesData } from '../base/series-data';
import type { ILabelMark } from '../../mark/label';
export declare class FunnelSeries<T extends IFunnelSeriesSpec = IFunnelSeriesSpec>
  extends BaseSeries<T>
  implements IFunnelSeries
{
  static readonly type: string;
  type: SeriesTypeEnum;
  protected _funnelMarkName: SeriesMarkNameEnum;
  protected _funnelMarkType: MarkTypeEnum;
  protected _transformMarkName: SeriesMarkNameEnum;
  protected _transformMarkType: MarkTypeEnum;
  static readonly mark: SeriesMarkMap;
  protected _categoryField: string;
  getCategoryField(): string;
  setCategoryField(f: string): string;
  protected _valueField: string;
  getValueField(): string;
  setValueField(f: string): string;
  protected _viewDataTransform: SeriesData;
  protected _theme: Maybe<IFunnelSeriesTheme>;
  protected _funnelAlign: 'left' | 'center' | 'right' | 'top' | 'bottom';
  protected _funnelOrient: IOrientType;
  protected _shape: 'rect' | 'trapezoid';
  protected _funnelMark: IPolygonMark | null;
  protected _funnelTransformMark: IPolygonMark | null;
  protected _labelMark: ILabelMark | null;
  protected _transformLabelMark: ILabelMark | null;
  protected _funnelOuterLabelMark: {
    label?: ITextMark;
    line?: IRuleMark;
  };
  setAttrFromSpec(): void;
  initData(): void;
  getStatisticFields(): {
    key: string;
    operations: Array<'max' | 'min' | 'values'>;
  }[];
  protected _statisticViewData(): void;
  initMark(): void;
  protected initTooltip(): void;
  getDimensionField(): string[];
  getMeasureField(): string[];
  getGroupFields(): string[];
  initMarkStyle(): void;
  initLabelMarkStyle(labelMark?: ILabelMark): void;
  initAnimation(): void;
  initGroups(): void;
  getStackGroupFields(): string[];
  getStackValueField(): string;
  setValueFieldToStack(): void;
  setValueFieldToPercent(): void;
  protected initEvent(): void;
  getPoints(datum: Datum): {
    x: number;
    y: number;
  }[];
  isTransformLevel(datum: Datum): boolean;
  protected _buildMarkAttributeContext(): void;
  valueToPosition(category: StringOrNumber): {
    x: number;
    y: number;
  };
  dataToPosition(datum: any): {
    x: number;
    y: number;
  };
  dataToPositionX(datum: any): number;
  dataToPositionY(datum: any): number;
  dataToPositionZ(datum: any): number;
  private _getMainAxisLength;
  private _getSecondaryAxisLength;
  private _getPositionByData;
  private _getPolygonPoints;
  private _getPolygonCenter;
  private _adjustPoints;
  private _computeLabelPosition;
  private _computeLabelLimit;
  private _computeOuterLabelPosition;
  private _computeOuterLabelLimit;
  private _computeOuterLabelLinePosition;
  protected _computeMaxSize(): number;
  protected _computeMinSize(): number;
  protected _isHorizontal(): boolean;
  private _isReverse;
  setValueFieldToStackOffsetSilhouette(): void;
  getDefaultShapeType(): string;
}
