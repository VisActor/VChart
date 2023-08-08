/* eslint-disable no-duplicate-imports */
import type { BandScale } from '@visactor/vscale';
import type { IArcMark } from '../../../mark/arc';
import { MarkTypeEnum } from '../../../mark/interface';
import type { Maybe, Datum } from '../../../typings';
import { isValidNumber } from '../../../util';
import type { SeriesMarkMap } from '../../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../../interface';
import { animationConfig, userAnimationConfig } from '../../../animation/utils';
import { DEFAULT_MARK_ANIMATION } from '../../../animation/config';
import type { ICircularProgressSeriesSpec, ICircularProgressSeriesTheme } from './interface';
import { ProgressLikeSeries } from '../../polar/progress-like/progress-like';
import type { IStateAnimateSpec } from '../../../animation/spec';
import type { IProgressArcMark } from '../../../mark/progress-arc';
import { BaseSeries } from '../../base/base-series';
import { VChart } from '../../../core/vchart';
import { ArcMark } from '../../../mark/arc';
import { ProgressArcMark } from '../../../mark/progress-arc';

VChart.useMark([ArcMark, ProgressArcMark]);

export class CircularProgressSeries<
  T extends ICircularProgressSeriesSpec = ICircularProgressSeriesSpec
> extends ProgressLikeSeries<T> {
  static readonly type: string = SeriesTypeEnum.circularProgress;
  type = SeriesTypeEnum.circularProgress;

  static readonly mark: SeriesMarkMap = {
    ...BaseSeries.mark,
    [SeriesMarkNameEnum.track]: { name: SeriesMarkNameEnum.track, type: MarkTypeEnum.progressArc },
    [SeriesMarkNameEnum.progress]: { name: SeriesMarkNameEnum.progress, type: MarkTypeEnum.progressArc }
  };

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
    this._trackMark = this._createMark(CircularProgressSeries.mark.track) as IArcMark;
    this._progressMark = this._createMark(CircularProgressSeries.mark.progress, {
      isSeriesMark: true
    }) as IArcMark;
  }

  initMarkStyle(): void {
    this.initTrackMarkStyle();
    this.initProgressMarkStyle();
  }

  private initProgressMarkStyle() {
    const progressMark = this._progressMark;
    if (progressMark) {
      this.setMarkStyle(progressMark, {
        x: () => this.angleAxisHelper.center().x,
        y: () => this.angleAxisHelper.center().y,
        startAngle: this._getAngleValueStart.bind(this),
        endAngle: this._getAngleValueEnd.bind(this),
        innerRadius: this._getRadiusValueStart.bind(this),
        outerRadius: this._getRadiusValueEnd.bind(this),
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

  private initTrackMarkStyle() {
    const trackMark = this._trackMark;
    if (trackMark) {
      this.setMarkStyle(trackMark, {
        visible: (datum: Datum) => {
          const scale = this.angleAxisHelper.getScale(0);
          const range = scale.range();
          const min = Math.min(range[0], range[range.length - 1]);
          const startValue = this._getAngleValueStart(datum);
          // 堆叠情况只显示第一组的背景
          return Math.abs(startValue - min) <= 1e-14;
        },
        x: () => this.angleAxisHelper.center().x,
        y: () => this.angleAxisHelper.center().y,
        startAngle: this._startAngle,
        endAngle: this._endAngle,
        innerRadius: this._getRadiusValueStart.bind(this),
        outerRadius: this._getRadiusValueEnd.bind(this),
        cornerRadius: this._spec.cornerRadius,
        fill: this.getColorAttribute(),
        zIndex: 100
      });
      this._trigger.registerMark(trackMark);
    }
  }

  protected _getRadiusValueStart(datum: Datum) {
    if (this.getGroupFields().length > 1) {
      const value = this.radiusAxisHelper.dataToPosition(this.getDatumPositionValues(datum, this.getGroupFields()));
      if (isValidNumber(value)) {
        return value;
      }
    }
    return this.radiusAxisHelper.dataToPosition([datum[this._radiusField[0]]]);
  }

  protected _getRadiusValueEnd(datum: Datum) {
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
  }

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
