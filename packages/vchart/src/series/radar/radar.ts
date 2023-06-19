import { LineLikeSeriesMixin, lineLikeSeriesMarkMap } from '../mixin/line-mixin';
import type { ILineMark } from '../../mark/line';
import type { IMark, IMarkProgressiveConfig } from '../../mark/interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from '../../mark/interface';
import { AttributeLevel, POLAR_START_RADIAN } from '../../constant';
import { DEFAULT_LINEAR_CLOSED_INTERPOLATE } from '../../typings';
// eslint-disable-next-line no-duplicate-imports
import type { Datum, IPoint, IPolarPoint, Maybe } from '../../typings';
import { isValid, radians } from '../../util';

import type { SeriesMarkMap } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface';
import { mixin } from '@visactor/vutils';
import type { IRadarSeriesSpec, IRadarSeriesTheme } from './interface';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import { DEFAULT_MARK_ANIMATION } from '../../animation/config';
import type { IRadarAnimationParams, RadarAppearPreset } from './animation';
import { RoseLikeSeries } from '../polar/rose-like';
import type { IStateAnimateSpec } from '../../animation/spec';
import type { IAreaMark } from '../../mark/area';
import { BaseSeries } from '../base/base-series';

export interface RadarSeries
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
    RoseLikeSeries<IRadarSeriesSpec> {}

export class RadarSeries extends RoseLikeSeries<IRadarSeriesSpec> {
  static readonly type: string = SeriesTypeEnum.radar;
  type = SeriesTypeEnum.radar;

  static readonly mark: SeriesMarkMap = {
    ...BaseSeries.mark,
    ...lineLikeSeriesMarkMap,
    [SeriesMarkNameEnum.area]: { name: SeriesMarkNameEnum.area, type: MarkTypeEnum.area }
  };

  protected declare _theme: Maybe<IRadarSeriesTheme>;

  private _areaMark: ILineMark;

  initGroups() {
    // do nothing
  }

  initMark(): void {
    const progressive = {
      progressiveStep: this._spec.progressiveStep,
      progressiveThreshold: this._spec.progressiveThreshold,
      large: this._spec.large,
      largeThreshold: this._spec.largeThreshold
    };

    const isAreaVisible = this._spec.area?.visible !== false && this._spec.area?.style?.visible !== false;
    this.initAreaMark(progressive, isAreaVisible);
    this.initLineMark(progressive, !isAreaVisible);
    this.initSymbolMark(progressive);
  }

  initMarkStyle(): void {
    this.initAreaMarkStyle();
    this.initLineMarkStyle();
    this.initSymbolMarkStyle();
  }

  initAreaMark(progressive: IMarkProgressiveConfig, isSeriesMark: boolean) {
    this._areaMark = this._createMark(RadarSeries.mark.area, {
      progressive,
      isSeriesMark
    }) as IAreaMark;
  }

  initAreaMarkStyle() {
    const areaMark = this._areaMark;
    if (areaMark) {
      this.setMarkStyle(
        areaMark,
        {
          x: this.dataToPositionX.bind(this),
          y: this.dataToPositionY.bind(this),
          x1: (datum: Datum) => {
            if (!datum || !this.angleAxisHelper || !this.radiusAxisHelper) {
              return Number.NaN;
            }

            return this.valueToPosition(
              this.getDatumPositionValues(datum, this._angleField),
              this._stack ? this.getDatumPositionValues(datum, this._innerRadiusField) : 0
            ).x;
          },
          y1: (datum: Datum) => {
            if (!datum || !this.angleAxisHelper || !this.radiusAxisHelper) {
              return Number.NaN;
            }
            const value = this.valueToPosition(
              this.getDatumPositionValues(datum, this._angleField),
              this._stack ? this.getDatumPositionValues(datum, this._innerRadiusField) : 0
            ).y;
            return value;
          },
          fill: this.getColorAttribute(),
          curveType: DEFAULT_LINEAR_CLOSED_INTERPOLATE
        },
        'normal',
        AttributeLevel.Series
      );
      this._trigger.registerMark(areaMark);
      this._tooltipHelper?.activeTriggerSet.dimension.add(areaMark);
    }
  }

  initAnimation() {
    const animationParams: IRadarAnimationParams = {
      center: () => this.angleAxisHelper?.center(),
      radius: () => {
        const rect = this.getLayoutRect();
        return Math.min(rect.width, rect.height);
      },
      startAngle: radians(this._spec.startAngle) ?? POLAR_START_RADIAN,
      pointToCoord: (point: IPoint) => this.angleAxisHelper?.pointToCoord(point),
      coordToPoint: (coord: IPolarPoint) => this.angleAxisHelper.coordToPoint(coord)
    };
    const appearPreset = ((this._spec?.animationAppear as IStateAnimateSpec<RadarAppearPreset>)?.preset ??
      'clipIn') as RadarAppearPreset;

    if (appearPreset === 'clipIn') {
      if (this._rootMark) {
        this._rootMark.setAnimationConfig(
          animationConfig(
            DEFAULT_MARK_ANIMATION.radarGroup(animationParams, appearPreset),
            userAnimationConfig(SeriesMarkNameEnum.group, this._spec)
          )
        );
      }
    }

    const markAnimationMap: [IMark, keyof typeof DEFAULT_MARK_ANIMATION][] = [
      [this._areaMark, 'radar'],
      [this._lineMark, 'radar'],
      [this._symbolMark, 'radarSymbol']
    ];

    // 为 mark 添加动画
    markAnimationMap.forEach(([mark, animation]) => {
      if (isValid(mark)) {
        const getAnimation = DEFAULT_MARK_ANIMATION[animation];
        mark.setAnimationConfig(
          animationConfig(getAnimation(animationParams, appearPreset), userAnimationConfig(mark.name, this._spec))
        );
      }
    });
  }
}

mixin(RadarSeries, LineLikeSeriesMixin);
