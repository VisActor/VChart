/* eslint-disable no-duplicate-imports */
import type { IArcMark } from '../../mark/arc';
import { MarkTypeEnum } from '../../mark/interface';
import type { Maybe, Datum } from '../../typings';
import { valueInScaleRange, degrees, merge } from '../../util';
import { animationConfig, shouldDoMorph, userAnimationConfig } from '../../animation/utils';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface';
import type { IRoseAnimationParams, RoseAppearPreset } from './animation';
import { DEFAULT_MARK_ANIMATION } from '../../animation/config';
import type { IRoseSeriesSpec, IRoseSeriesTheme } from './interface';
import { RoseLikeSeries } from '../polar/rose-like';
import type { IStateAnimateSpec } from '../../animation/spec';
import type { ITextMark } from '../../mark/text';
import { AttributeLevel } from '../../constant';
import { BarSeries } from '../bar/bar';
import { VChart } from '../../core/vchart';
import { ArcMark } from '../../mark/arc';
import { TextMark } from '../../mark/text';

VChart.useMark([ArcMark, TextMark]);

export const DefaultBandWidth = 0.5;

export class RoseSeries extends RoseLikeSeries<IRoseSeriesSpec> {
  static readonly type: string = SeriesTypeEnum.rose;
  type = SeriesTypeEnum.rose;

  static readonly mark: SeriesMarkMap = {
    ...BarSeries.mark,
    [SeriesMarkNameEnum.rose]: { name: SeriesMarkNameEnum.rose, type: MarkTypeEnum.arc }
  };

  protected declare _theme: Maybe<IRoseSeriesTheme>;
  protected _stack: boolean = true;

  private _roseMark: IArcMark | null = null;
  protected _labelMark: ITextMark | null = null;

  initMark(): void {
    this.initRoseMark();
  }

  initMarkStyle(): void {
    this.initRoseMarkStyle();
  }

  private initRoseMark() {
    this._roseMark = this._createMark(RoseSeries.mark.rose, {
      morph: shouldDoMorph(this._spec.animation, this._spec.morph, userAnimationConfig('rose', this._spec)),
      defaultMorphElementKey: this.getDimensionField()[0],
      groupKey: this._seriesField,
      isSeriesMark: true,
      label: merge({ animation: this._spec.animation }, this._spec.label)
    }) as IArcMark;
  }

  private getRoseAngle() {
    const angleBandWidth =
      this.angleAxisHelper.getBandwidth?.(this._groups ? this._groups.fields.length - 1 : 0) ?? DefaultBandWidth;
    return angleBandWidth;
  }

  private initRoseMarkStyle() {
    const roseMark = this._roseMark;
    if (roseMark) {
      this.setMarkStyle(roseMark, {
        x: () => this.angleAxisHelper.center().x,
        y: () => this.angleAxisHelper.center().y,
        startAngle: (datum: Datum) =>
          this.angleAxisHelper.dataToPosition(this.getDatumPositionValues(datum, this.getGroupFields())) -
          this.angleAxisHelper.getBandwidth(0) * 0.5,
        endAngle: (datum: Datum) =>
          this.angleAxisHelper.dataToPosition(this.getDatumPositionValues(datum, this.getGroupFields())) +
          this.getRoseAngle() -
          this.angleAxisHelper.getBandwidth(0) * 0.5,
        fill: this.getColorAttribute(),
        outerRadius: (datum: Datum) =>
          valueInScaleRange(
            this.radiusAxisHelper.dataToPosition([datum[this._radiusField[0]]]),
            this.radiusAxisHelper.getScale(0)
          ),
        innerRadius: (datum: Datum) => {
          if (!this._stack) {
            return 0;
          }
          const stackStart = valueInScaleRange(
            this.radiusAxisHelper.dataToPosition([datum[this._innerRadiusField[0]]]),
            this.radiusAxisHelper.getScale(0)
          );
          return stackStart <= Number.MIN_VALUE
            ? this._computeLayoutRadius() * (this._spec.innerRadius ?? 0)
            : stackStart;
        }
      });
      this._trigger.registerMark(roseMark);
      this._tooltipHelper?.activeTriggerSet.mark.add(roseMark);
    }
  }

  initLabelMarkStyle(textMark: ITextMark) {
    if (!textMark) {
      return;
    }
    this.setMarkStyle(textMark, {
      visible: this._spec?.label?.visible,
      text: (datum: Datum) => {
        return datum[this.getDimensionField()[0]];
      },
      fill: this._spec.label?.style?.fill || this.getColorAttribute(),
      angle: this._spec.label?.style?.angle,
      limit: this._spec.label?.style?.limit,
      z: 0
    });
  }

  initAnimation() {
    const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<RoseAppearPreset>)?.preset;

    if (this._roseMark) {
      const animationParams: IRoseAnimationParams = {
        innerRadius: () => this._computeLayoutRadius() * (this._spec.innerRadius ?? 0)
      };
      this._roseMark.setAnimationConfig(
        animationConfig(
          DEFAULT_MARK_ANIMATION.rose(animationParams, appearPreset),
          userAnimationConfig(SeriesMarkNameEnum.rose, this._spec)
        )
      );
    }
  }
}
