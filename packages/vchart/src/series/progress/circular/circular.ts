/* eslint-disable no-duplicate-imports */
import type { BandScale } from '@visactor/vscale';
import type { IArcMark } from '../../../mark/arc';
import type { Maybe, Datum } from '../../../typings';
import { isValidNumber } from '../../../util';
import type { SeriesMarkMap } from '../../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../../interface/type';
import { animationConfig, userAnimationConfig } from '../../../animation/utils';
import { DEFAULT_MARK_ANIMATION } from '../../../animation/config';
import type { ICircularProgressSeriesSpec, ICircularProgressSeriesTheme } from './interface';
import { ProgressLikeSeries } from '../../polar/progress-like/progress-like';
import type { IStateAnimateSpec } from '../../../animation/spec';
import type { IProgressArcMark } from '../../../mark/progress-arc';
import { VChart } from '../../../core/vchart';
import { ArcMark } from '../../../mark/arc';
import { ProgressArcMark } from '../../../mark/progress-arc';
import { circularProgressSeriesMark } from './constant';
import { STACK_FIELD_END, STACK_FIELD_START } from '../../../constant';

VChart.useMark([ArcMark, ProgressArcMark]);

export class CircularProgressSeries<
  T extends ICircularProgressSeriesSpec = ICircularProgressSeriesSpec
> extends ProgressLikeSeries<T> {
  static readonly type: string = SeriesTypeEnum.circularProgress;
  type = SeriesTypeEnum.circularProgress;

  static readonly mark: SeriesMarkMap = circularProgressSeriesMark;

  protected declare _theme: Maybe<ICircularProgressSeriesTheme>;

  private _progressMark: IProgressArcMark | null = null;
  private _trackMark: IProgressArcMark | null = null;

  getStackGroupFields(): string[] {
    return this.getGroupFields();
  }

  getGroupFields() {
    return this._radiusField;
  }

  initMark(): void {
    super.initMark();
    this._initTrackMark();
    this._initProgressMark();
  }

  initMarkStyle(): void {
    super.initMarkStyle();
    this._initTrackMarkStyle();
    this._initProgressMarkStyle();
  }

  private _initProgressMark() {
    this._progressMark = this._createMark(CircularProgressSeries.mark.progress, {
      parent: this._arcGroupMark,
      isSeriesMark: true
    }) as IArcMark;
    return this._progressMark;
  }

  private _initProgressMarkStyle() {
    const progressMark = this._progressMark;
    if (progressMark) {
      this.setMarkStyle(progressMark, {
        x: () => this.angleAxisHelper.center().x,
        y: () => this.angleAxisHelper.center().y,
        startAngle: this._getAngleValueStart,
        endAngle: this._getAngleValueEnd,
        innerRadius: this._getRadiusValueStart,
        outerRadius: this._getRadiusValueEnd,
        cap: this._spec.roundCap ?? false,
        boundsMode: 'imprecise',
        cornerRadius: this._spec.cornerRadius,
        fill: this.getColorAttribute(),
        zIndex: 200,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // forceShowCap 是内部属性，不在接口中暴露
        forceShowCap: true
      });
      this._trigger.registerMark(progressMark);
      this._tooltipHelper?.activeTriggerSet.mark.add(progressMark);
    }
  }

  private _initTrackMark() {
    this._trackMark = this._createMark(CircularProgressSeries.mark.track, {
      parent: this._arcGroupMark
    }) as IArcMark;
    return this._trackMark;
  }

  private _initTrackMarkStyle() {
    const trackMark = this._trackMark;
    if (trackMark) {
      this.setMarkStyle(trackMark, {
        visible: (datum: Datum) => {
          const scale = this.angleAxisHelper.getScale(0);
          const range = scale.range();
          const min = Math.min(range[0], range[range.length - 1]);
          const startValue = this._getAngleValueStartWithoutMask(datum);
          // 堆叠情况只显示第一组的背景
          return Math.abs(startValue - min) <= 1e-14;
        },
        x: () => this.angleAxisHelper.center().x,
        y: () => this.angleAxisHelper.center().y,
        startAngle: () => {
          const scale = this.angleAxisHelper.getScale(0);
          const domain = scale.domain();
          return this._getAngleValueStart({ [STACK_FIELD_START]: domain[0] });
        },
        endAngle: () => {
          const scale = this.angleAxisHelper.getScale(0);
          const domain = scale.domain();
          return this._getAngleValueEnd({ [STACK_FIELD_END]: domain[domain.length - 1] });
        },
        innerRadius: this._getRadiusValueStart,
        outerRadius: this._getRadiusValueEnd,
        cornerRadius: this._spec.cornerRadius,
        fill: this.getColorAttribute(),
        zIndex: 100
      });
      this._trigger.registerMark(trackMark);
    }
  }

  protected _getRadiusValueStart = (datum: Datum) => {
    if (this.getGroupFields().length > 1) {
      const value = this.radiusAxisHelper.dataToPosition(this.getDatumPositionValues(datum, this.getGroupFields()));
      if (isValidNumber(value)) {
        return value;
      }
    }
    return this.radiusAxisHelper.dataToPosition([datum[this._radiusField[0]]]);
  };

  protected _getRadiusValueEnd = (datum: Datum) => {
    if (this.getGroupFields().length > 1) {
      const value =
        this.radiusAxisHelper.dataToPosition(this.getDatumPositionValues(datum, this.getGroupFields())) +
        this.radiusAxisHelper.getBandwidth?.(this._groups ? this._groups.fields.length - 1 : 0);
      if (isValidNumber(value)) {
        return value;
      }
    }
    return (
      this.radiusAxisHelper.dataToPosition([datum[this._radiusField[0]]]) +
      (this.radiusAxisHelper.getScale(0) as BandScale).step()
    );
  };

  initAnimation() {
    const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<any>)?.preset;

    this._progressMark.setAnimationConfig(
      animationConfig(
        DEFAULT_MARK_ANIMATION.circularProgress(
          {
            startAngle: this._startAngle
          },
          appearPreset
        ),
        userAnimationConfig(SeriesMarkNameEnum.progress, this._spec)
      )
    );

    this._trackMark.setAnimationConfig(
      animationConfig(
        DEFAULT_MARK_ANIMATION.progressBackground(),
        userAnimationConfig(SeriesMarkNameEnum.track, this._spec)
      )
    );
  }
}
