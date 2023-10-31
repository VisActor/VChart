import { CartesianSeries } from '../cartesian/cartesian';
import type { Maybe } from '../../typings';
import type { IHeatmapSeriesSpec, IHeatmapSeriesTheme } from './interface';
import type { IAxisHelper } from '../../component/axis/cartesian/interface';
import type { ITextMark } from '../../mark/text';
import type { SeriesMarkMap } from '../interface';
import { SeriesTypeEnum } from '../interface/type';
import type { ICellMark } from '../../mark/cell';
import type { IMark } from '../../mark/interface';
export declare const DefaultBandWidth = 6;
export declare class HeatmapSeries<T extends IHeatmapSeriesSpec = IHeatmapSeriesSpec> extends CartesianSeries<T> {
  static readonly type: string;
  type: SeriesTypeEnum;
  static readonly mark: SeriesMarkMap;
  protected _theme: Maybe<IHeatmapSeriesTheme>;
  protected _cellMark: ICellMark;
  protected _backgroundMark: ICellMark;
  protected _fieldValue: string[];
  getFieldValue(): string[];
  setFieldValue(f: string | string[]): void;
  setAttrFromSpec(): void;
  initMark(): void;
  initMarkStyle(): void;
  initLabelMarkStyle(textMark: ITextMark): void;
  initCellMarkStyle(): void;
  initCellBackgroundMarkStyle(): void;
  getColorAttribute(): {
    scale: any;
    field: any;
  };
  initAnimation(): void;
  protected getCellSize(axisHelper: IAxisHelper): number;
  protected initTooltip(): void;
  getDefaultShapeType(): string;
  getDimensionField(): string[];
  getMeasureField(): string[];
  getActiveMarks(): IMark[];
}
export declare const registerHeatmapSeries: () => void;
