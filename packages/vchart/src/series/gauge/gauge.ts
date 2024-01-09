import type { SeriesMarkMap } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import type { IGaugeSeriesSpec, IGaugeSeriesTheme } from './interface';
import { ProgressLikeSeries } from '../polar/progress-like/progress-like';
import type { IProgressArcMark } from '../../mark/progress-arc';
import { registerDataSetInstanceTransform } from '../../data/register';
import { SEGMENT_FIELD_END, SEGMENT_FIELD_START } from '../../constant';
import type { Datum } from '@visactor/vgrammar-core';
import type { Maybe } from '../../typings';
import type { IStateAnimateSpec } from '../../animation/spec';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
// eslint-disable-next-line no-duplicate-imports
import { ProgressArcMark, registerProgressArcMark } from '../../mark/progress-arc';
import { gaugeSeriesMark } from './constant';
import { degreeToRadian, isValid } from '@visactor/vutils';
import { Factory } from '../../core/factory';
import { registerProgressLikeAnimation } from '../polar/progress-like';
import type { IMark } from '../../mark/interface';
import { GaugeSeriesSpecTransformer } from './gauge-transformer';

export class GaugeSeries<T extends IGaugeSeriesSpec = IGaugeSeriesSpec> extends ProgressLikeSeries<T> {
  static readonly type: string = SeriesTypeEnum.gauge;
  type = SeriesTypeEnum.gauge;

  static readonly mark: SeriesMarkMap = gaugeSeriesMark;
  static readonly transformerConstructor = GaugeSeriesSpecTransformer as any;
  readonly transformerConstructor = GaugeSeriesSpecTransformer;

  private _segmentMark: IProgressArcMark | null = null;
  private _trackMark: IProgressArcMark | null = null;

  protected _stack: boolean = false;
  protected _padAngle: number = 0;

  setAttrFromSpec(): void {
    super.setAttrFromSpec();
    this._padAngle = degreeToRadian(this._spec.padAngle ?? 0);
  }

  initData(): void {
    super.initData();

    /**
     * @description 将数据排序并调整图元的起始点为上一个数据的终点，但是终点维持不变
     */
    const spiltSegment = (data: Datum[], op: string) => {
      // 数据处理
      const dataCollect = data.slice();
      dataCollect.sort((a, b) => a[this._angleField[0]] - b[this._angleField[0]]);
      dataCollect.forEach((datum: any, i) => {
        datum[SEGMENT_FIELD_END] = datum[this._angleField[0]];
        if (i > 0) {
          datum[SEGMENT_FIELD_START] = dataCollect[i - 1][SEGMENT_FIELD_END];
        } else {
          datum[SEGMENT_FIELD_START] = undefined;
        }
      });
      return dataCollect;
    };

    registerDataSetInstanceTransform(this._option.dataSet, 'spiltSegment', spiltSegment);
    this.getViewData()?.transform(
      {
        type: 'spiltSegment'
      },
      false
    );
  }

  initMark(): void {
    super.initMark();
    this._trackMark = this._createMark(GaugeSeries.mark.track, {
      parent: this._arcGroupMark,
      dataView: false
    }) as IProgressArcMark;
    this._segmentMark = this._createMark(GaugeSeries.mark.segment, {
      parent: this._arcGroupMark,
      isSeriesMark: true
    }) as IProgressArcMark;
  }

  initMarkStyle(): void {
    super.initMarkStyle();
    this.initTrackMarkStyle();
    this.initSegmentMarkStyle();
  }

  private initSegmentMarkStyle() {
    const segmentMark = this._segmentMark;
    if (segmentMark) {
      this.setMarkStyle(segmentMark, {
        x: () => this.angleAxisHelper.center().x,
        y: () => this.angleAxisHelper.center().y,
        startAngle: this._getAngleValueStart.bind(this),
        endAngle: this._getAngleValueEnd.bind(this),
        innerRadius: () => this._computeLayoutRadius() * (this._spec.innerRadius ?? 0),
        outerRadius: () => this._computeLayoutRadius() * (this._spec.radius ?? this._spec.outerRadius ?? 1), // 需要优先兼容this._spec.radius
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
      this._trigger.registerMark(segmentMark);
    }
  }

  protected initTooltip() {
    super.initTooltip();

    this._segmentMark && this._tooltipHelper.activeTriggerSet.mark.add(this._segmentMark);
  }

  private initTrackMarkStyle() {
    const trackMark = this._trackMark;
    if (trackMark) {
      this.setMarkStyle(trackMark, {
        x: () => this.angleAxisHelper.center().x,
        y: () => this.angleAxisHelper.center().y,
        startAngle: this._startAngle,
        endAngle: this._endAngle,
        innerRadius: () => this._computeLayoutRadius() * (this._spec.innerRadius ?? 0),
        outerRadius: () => this._computeLayoutRadius() * (this._spec.radius ?? this._spec.outerRadius ?? 1), // 需要优先兼容this._spec.radius
        cap: this._spec.roundCap ?? false,
        boundsMode: 'imprecise',
        cornerRadius: this._spec.cornerRadius,
        zIndex: 100
      });
      this._trigger.registerMark(trackMark);
    }
  }

  protected _getAngleValueStartWithoutMask(datum: Datum) {
    const startAngle = this._getAngleValueStartWithoutPadAngle(datum);
    const endAngle = this._getAngleValueEndWithoutPadAngle(datum);
    return Math.min(startAngle + this._padAngle / 2, (startAngle + endAngle) / 2);
  }

  protected _getAngleValueEndWithoutMask(datum: Datum) {
    const startAngle = this._getAngleValueStartWithoutPadAngle(datum);
    const endAngle = this._getAngleValueEndWithoutPadAngle(datum);
    return Math.max(endAngle - this._padAngle / 2, (startAngle + endAngle) / 2);
  }

  protected _getAngleValueStartWithoutPadAngle(datum: Datum) {
    return isValid(datum[SEGMENT_FIELD_START])
      ? this.angleAxisHelper.dataToPosition([datum[SEGMENT_FIELD_START]])
      : this._startAngle;
  }

  protected _getAngleValueEndWithoutPadAngle(datum: Datum) {
    return this.angleAxisHelper.dataToPosition([datum[SEGMENT_FIELD_END]]);
  }

  initAnimation() {
    const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<any>)?.preset;

    this._segmentMark.setAnimationConfig(
      animationConfig(
        Factory.getAnimationInKey('circularProgress')?.(
          {
            startAngle: this._startAngle
          },
          appearPreset
        ),
        userAnimationConfig(SeriesMarkNameEnum.segment, this._spec, this._markAttributeContext)
      )
    );
  }

  getDefaultShapeType() {
    return 'circle';
  }

  getActiveMarks(): IMark[] {
    return [];
  }
}

export const registerGaugeSeries = () => {
  registerProgressArcMark();
  registerProgressLikeAnimation();
  Factory.registerSeries(GaugeSeries.type, GaugeSeries);
};
