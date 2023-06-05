import { LineLikeSeriesMixin } from '../mixin/line-mixin';
import type { IAreaMark } from '../../mark/area';
import { Direction } from '../../typings/space';
import { MarkTypeEnum } from '../../mark/interface';
import { CartesianSeries } from '../cartesian/cartesian';
import { AttributeLevel } from '../../constant';
import type { Maybe, Datum, IInvalidType } from '../../typings';
import { valueInScaleRange, couldBeValidNumber } from '../../util';
import { SeriesTypeEnum } from '../interface';
import { mixin } from '@visactor/vutils';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import { DEFAULT_MARK_ANIMATION } from '../../animation/config';
import { DEFAULT_SMOOTH_INTERPOLATE } from '../../typings/interpolate';
import type { IAreaSeriesSpec, IAreaSeriesTheme } from './interface';
import type { IMarkAnimateSpec } from '../../animation/spec';

export interface AreaSeries
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
    CartesianSeries<IAreaSeriesSpec> {}

export class AreaSeries extends CartesianSeries<IAreaSeriesSpec> {
  static readonly type: string = SeriesTypeEnum.area;
  type = SeriesTypeEnum.area;

  protected declare _theme: Maybe<IAreaSeriesTheme>;

  protected _areaMark!: IAreaMark;
  protected _stack: boolean = true;
  protected _invalidType: IInvalidType = 'break';

  initMark(): void {
    const progressive = {
      progressiveStep: this._spec.progressiveStep,
      progressiveThreshold: this._spec.progressiveThreshold,
      large: this._spec.large,
      largeThreshold: this._spec.largeThreshold
    };

    const isAreaVisible = this._spec.area?.visible !== false && this._spec.area?.style?.visible !== false;
    // area
    this._areaMark = this._createMark(MarkTypeEnum.area, 'area', {
      groupKey: this._seriesField,
      defaultMorphElementKey: this.getDimensionField()[0],
      progressive,
      isSeriesMark: isAreaVisible
    }) as IAreaMark;

    this.initLineMark(progressive, !isAreaVisible);
    this.initSymbolMark(progressive);
  }

  initMarkStyle(): void {
    // FIXME 是不是应该把curveType提前到上层配置
    // 不允许area和line的curveType不一致
    const userCurveType = this.getSpec().area?.style?.curveType ?? this.getSpec().line?.style?.curveType;
    const curveType =
      userCurveType === DEFAULT_SMOOTH_INTERPOLATE
        ? this._direction === Direction.vertical
          ? 'monotoneX'
          : 'monotoneY'
        : userCurveType;

    // area
    const areaMark = this._areaMark;
    if (areaMark) {
      if (this._direction === Direction.vertical) {
        this.setMarkStyle(
          this._areaMark,
          {
            x: this.dataToPositionX.bind(this),
            y1: (datum: Datum) => {
              return valueInScaleRange(this.dataToPositionY1(datum), this._yAxisHelper?.getScale?.(0));
            },
            y: this.dataToPositionY.bind(this)
          },
          'normal',
          AttributeLevel.Series
        );
      } else {
        this.setMarkStyle(
          this._areaMark,
          {
            x: this.dataToPositionX.bind(this),
            x1: (datum: Datum) => {
              return valueInScaleRange(this.dataToPositionX1(datum), this._xAxisHelper?.getScale?.(0));
            },
            y: this.dataToPositionY.bind(this),
            orient: this._direction
          },
          'normal',
          AttributeLevel.Series
        );
      }
      this.setMarkStyle(
        areaMark,
        {
          fill: this.getColorAttribute(),
          defined: (datum: Datum) => {
            if (this._invalidType === 'break') {
              return couldBeValidNumber(datum[this.getStackValueField()]);
            }
            return true;
          }
        },
        'normal',
        AttributeLevel.Series
      );
      this.setMarkStyle(
        areaMark,
        {
          curveType
        },
        'normal',
        AttributeLevel.Built_In
      );
      this._trigger.registerMark(areaMark);
      this._tooltipHelper.activeTriggerSet.dimension.add(areaMark);
    }

    this.initLineMarkStyle(this._direction, userCurveType);
    this.initSymbolMarkStyle();
    this.initLabelMarkStyle();
  }

  initAnimation() {
    const animationParams = { direction: this.direction };
    const appearPreset = (this._spec?.animationAppear as IMarkAnimateSpec<string>)?.preset;

    if (this._lineMark) {
      this._lineMark.setAnimationConfig(
        animationConfig(
          DEFAULT_MARK_ANIMATION.line(animationParams, appearPreset),
          userAnimationConfig(this._lineMark.name, this._spec)
        )
      );
    }

    if (this._areaMark) {
      this._areaMark.setAnimationConfig(
        animationConfig(
          DEFAULT_MARK_ANIMATION.area(animationParams, appearPreset),
          userAnimationConfig(this._areaMark.name, this._spec)
        )
      );
    }

    if (this._symbolMark) {
      this._symbolMark.setAnimationConfig(
        animationConfig(DEFAULT_MARK_ANIMATION.symbol(), userAnimationConfig(this._symbolMark.name, this._spec))
      );
    }
  }
}

mixin(AreaSeries, LineLikeSeriesMixin);
