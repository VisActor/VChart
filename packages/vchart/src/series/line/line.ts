import { DEFAULT_DATA_SERIES_FIELD } from '../../constant';
import { CartesianSeries } from '../cartesian/cartesian';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { SeriesTypeEnum } from '../interface';
import { LineLikeSeriesMixin, lineLikeSeriesMarkMap } from '../mixin/line-mixin';
import { mixin } from '@visactor/vutils';
import type { IInvalidType, Maybe } from '../../typings';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import { DEFAULT_MARK_ANIMATION } from '../../animation/config';
import type { ILineSeriesSpec, ILineSeriesTheme } from './interface';
import type { IStateAnimateSpec } from '../../animation/spec';
import type { LineAppearPreset } from './animation';
import { BaseSeries } from '../base/base-series';

export interface LineSeries
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
    CartesianSeries<ILineSeriesSpec> {}

export class LineSeries extends CartesianSeries<ILineSeriesSpec> {
  static readonly type: string = SeriesTypeEnum.line;
  type = SeriesTypeEnum.line;
  protected _invalidType: IInvalidType = 'break';

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
    this.initLineMark(progressive);
    this.initSymbolMark(progressive);
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

  getSeriesInfoList() {
    const seriesKeys = this.getSeriesKeys();
    const shapeType = this.getDefaultShapeType();
    return seriesKeys.map(key => {
      return {
        key,
        style: (attribute: string) => {
          if (!this._lineMark) {
            return null;
          }
          const attr = this._lineMark.getAttribute(attribute as any, {
            [this._seriesField ?? DEFAULT_DATA_SERIES_FIELD]: key
          });
          if (attr) {
            return attr;
          }
          return this._symbolMark.getAttribute(attribute as any, {
            [this._seriesField ?? DEFAULT_DATA_SERIES_FIELD]: key
          });
        },
        shapeType
      };
    });
  }
}

mixin(LineSeries, LineLikeSeriesMixin);
