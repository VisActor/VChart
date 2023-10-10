import type { Maybe } from '../../typings';
import type { SeriesMarkMap } from '../interface';
import { SeriesTypeEnum } from '../interface/type';
import type { IRoseSeriesSpec, IRoseSeriesTheme } from './interface';
import { RoseLikeSeries } from '../polar/rose-like';
import type { ITextMark } from '../../mark/text';
export declare const DefaultBandWidth = 0.5;
export declare class RoseSeries<T extends IRoseSeriesSpec = IRoseSeriesSpec> extends RoseLikeSeries<T> {
  static readonly type: string;
  type: SeriesTypeEnum;
  static readonly mark: SeriesMarkMap;
  protected _theme: Maybe<IRoseSeriesTheme>;
  protected _stack: boolean;
  private _roseMark;
  protected _labelMark: ITextMark | null;
  initMark(): void;
  initMarkStyle(): void;
  private initRoseMark;
  private getRoseAngle;
  private initRoseMarkStyle;
  initLabelMarkStyle(textMark: ITextMark): void;
  initAnimation(): void;
  getDefaultShapeType(): string;
}
