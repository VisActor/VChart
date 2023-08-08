/* eslint-disable no-duplicate-imports */
import { CartesianSeries } from '../cartesian/cartesian';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum } from '../interface';
import { SeriesTypeEnum } from '../interface';
import { LineLikeSeriesMixin, lineLikeSeriesMarkMap } from '../mixin/line-mixin';
import { mixin } from '@visactor/vutils';
import type { Datum, Maybe } from '../../typings';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import { DEFAULT_MARK_ANIMATION } from '../../animation/config';
import type { ILineSeriesSpec, ILineSeriesTheme } from './interface';
import type { IStateAnimateSpec } from '../../animation/spec';
import type { LineAppearPreset } from './animation';
import { BaseSeries } from '../base/base-series';
import { VChart } from '../../core/vchart';
import { LineMark } from '../../mark/line';
import { SymbolMark } from '../../mark/symbol';
import { TextMark } from '../../mark/text';

VChart.useMark([LineMark, SymbolMark, TextMark]);

export interface LineSeries<T extends ILineSeriesSpec = ILineSeriesSpec>
  extends Pick<
      LineLikeSeriesMixin,
      | 'initLineMark'
      | 'initSymbolMark'
      | 'initLabelMarkStyle'
      | 'initLineMarkStyle'
      | 'initSymbolMarkStyle'
      | '_lineMark'
      | '_symbolMark'
    >,
    CartesianSeries<T> {}

export class LineSeries<T extends ILineSeriesSpec = ILineSeriesSpec> extends CartesianSeries<T> {
  static readonly type: string = SeriesTypeEnum.line;
  type = SeriesTypeEnum.line;

  static readonly mark: SeriesMarkMap = {
    ...BaseSeries.mark,
    ...lineLikeSeriesMarkMap
  };

  protected declare _theme: Maybe<ILineSeriesTheme>;

  initMark(): void {
    const progressive = {
      progressiveStep: this._spec.progressiveStep,
      progressiveThreshold: this._spec.progressiveThreshold,
      large: this._spec.large,
      largeThreshold: this._spec.largeThreshold
    };
    const seriesMark = this._spec.seriesMark ?? 'line';
    this.initLineMark(progressive, seriesMark === 'line');
    this.initSymbolMark(progressive, seriesMark === 'point');
  }

  initMarkStyle(): void {
    this.initLineMarkStyle(this._direction);
    this.initSymbolMarkStyle();
  }

  initAnimation() {
    const animationParams = { direction: this.direction };
    const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<LineAppearPreset>)?.preset;
    this._lineMark.setAnimationConfig(
      animationConfig(
        DEFAULT_MARK_ANIMATION.line(animationParams, appearPreset),
        userAnimationConfig(SeriesMarkNameEnum.line, this._spec)
      )
    );

    if (this._symbolMark) {
      this._symbolMark.setAnimationConfig(
        animationConfig(DEFAULT_MARK_ANIMATION.symbol(), userAnimationConfig(SeriesMarkNameEnum.point, this._spec))
      );
    }
  }

  getSeriesStyle(datum: Datum) {
    const isLineAsSeriesMark = this._spec?.seriesMark !== 'point'; // 加判空防止某些特殊时刻（如 updateSpec 时）鼠标滑过图表导致报错
    return (attribute: string) => {
      if (isLineAsSeriesMark) {
        // 增加一个标识位，用于是否替换，因为图例获取颜色的时候是不需要替换的
        attribute === 'fill' && (attribute = 'stroke');
      }
      return this._seriesMark?.getAttribute(attribute as any, datum) ?? null;
    };
  }
}

mixin(LineSeries, LineLikeSeriesMixin);
