import type { SeriesMarkMap } from '../interface';
import { SeriesTypeEnum } from '../interface/type';
import type { IGaugeSeriesSpec, IGaugeSeriesTheme } from './interface';
import { ProgressLikeSeries } from '../polar/progress-like/progress-like';
import type { Datum } from '@visactor/vgrammar-core';
import type { Maybe } from '../../typings';
export declare class GaugeSeries<T extends IGaugeSeriesSpec = IGaugeSeriesSpec> extends ProgressLikeSeries<T> {
  static readonly type: string;
  type: SeriesTypeEnum;
  static readonly mark: SeriesMarkMap;
  protected _theme: Maybe<IGaugeSeriesTheme>;
  private _segmentMark;
  private _trackMark;
  protected _stack: boolean;
  protected _padAngle: number;
  setAttrFromSpec(): void;
  initData(): void;
  initMark(): void;
  initMarkStyle(): void;
  private initSegmentMarkStyle;
  private initTrackMarkStyle;
  protected _getAngleValueStartWithoutMask(datum: Datum): number;
  protected _getAngleValueEndWithoutMask(datum: Datum): number;
  protected _preprocessLabelSpec(): import('../..').ILabelSpec;
  initAnimation(): void;
  getDefaultShapeType(): string;
}
