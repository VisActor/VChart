/* eslint-disable no-duplicate-imports */
import { CartesianSeries } from '../../cartesian/cartesian';
import type { SeriesMarkMap } from '../../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../../interface/type';
import type { IRectMark } from '../../../mark/rect';
import type { IGroupMark } from '../../../mark/group';
import { valueInScaleRange } from '../../../util/scale';
import { AttributeLevel } from '../../../constant';
import type { Datum, Maybe } from '../../../typings';
import { animationConfig, userAnimationConfig } from '../../../animation/utils';
import {
  registerLinearProgressAnimation,
  type ILinearProgressAnimationParams,
  type LinearProgressAppearPreset
} from './animation';
import type { ILinearProgressSeriesSpec, ILinearProgressSeriesTheme } from './interface';
import { LinearProgressSeriesTooltipHelper } from './tooltip-helper';
import type { IStateAnimateSpec } from '../../../animation/spec';
import { RectMark } from '../../../mark/rect';
import { createRect } from '@visactor/vrender-core';
import { linearProgressSeriesMark } from './constant';
import { Factory } from '../../../core/factory';
import { registerFadeInOutAnimation } from '../../../animation/config';
import type { IMark } from '../../../mark/interface';

export class LinearProgressSeries<
  T extends ILinearProgressSeriesSpec = ILinearProgressSeriesSpec
> extends CartesianSeries<T> {
  static readonly type: string = SeriesTypeEnum.linearProgress;
  type = SeriesTypeEnum.linearProgress;

  static readonly mark: SeriesMarkMap = linearProgressSeriesMark;

  protected declare _theme: Maybe<ILinearProgressSeriesTheme>;

  private _progressMark: IRectMark | null = null;
  private _trackMark: IRectMark | null = null;
  private _progressGroupMark: IGroupMark | null = null;

  /**
   * 为了解决在圆角情况下，在数值较小时，rect绘图效果不好的问题
   * 1. trackMark的所有样式设置在groupMark上，定位也依靠这个groupMark
   * 2. progressMark长度固定为整个进度条长度，通过x的偏移体现当前进度
   *
   * 为了解决在配置tooltip时，trackMark设置为GroupMark无法绑定数据的问题，
   * 1. 原本的设置为groupMark的trackMark更名为GroupMark。用来保证在clip效果下progressMark小数据值的绘图效果。
   * 1. 增加一层设置为rectMark的trackMark，形状大小与GroupMark相同
   *
   * 为了解决成组
   * 给groupMark的path字段赋值为一个rect数组 也就是一个groupMark具有多个以背景条为轮廓的rect的path
   * trackMark与progressMark使用绝对定位
   */
  initMark(): void {
    this._initProgressGroupMark();
    this._initTrackMark();
    this._initProgressMark();
  }

  initMarkStyle(): void {
    this._initProgressGroupMarkStyle();
    this._initTrackMarkStyle();
    this._initProgressMarkStyle();
  }

  private _initProgressMark() {
    this._progressMark = this._createMark(LinearProgressSeries.mark.progress, {
      isSeriesMark: true,
      parent: this._progressGroupMark,
      customShape: this._spec.progress?.customShape
    }) as IRectMark;
    return this._progressMark;
  }

  private _initProgressMarkStyle() {
    const progressMark = this._progressMark;
    if (progressMark) {
      if (this._spec.direction === 'vertical') {
        const leftPadding = this._spec.progress?.leftPadding ?? 0;
        const rightPadding = this._spec.progress?.rightPadding ?? 0;

        this.setMarkStyle(
          progressMark,
          {
            x: (datum: Datum) => {
              return (
                valueInScaleRange(this.dataToPositionX(datum), this._xAxisHelper?.getScale?.(0)) -
                this._spec.bandWidth / 2 +
                leftPadding
              );
            },
            y: (datum: Datum) => valueInScaleRange(this.dataToPositionY(datum), this._yAxisHelper?.getScale?.(0)),
            height: () => this._yAxisHelper?.dataToPosition([0], { bandPosition: this._bandPosition }),
            width: this._spec.bandWidth - leftPadding - rightPadding,
            cornerRadius: this._spec.cornerRadius,
            fill: this.getColorAttribute()
          },
          'normal',
          AttributeLevel.Series
        );
      } else {
        const topPadding = this._spec.progress?.topPadding ?? 0;
        const bottomPadding = this._spec.progress?.bottomPadding ?? 0;

        this.setMarkStyle(
          progressMark,
          {
            x: (datum: Datum) =>
              valueInScaleRange(this.dataToPositionX(datum), this._xAxisHelper?.getScale?.(0)) -
              this._xAxisHelper.dataToPosition([1], { bandPosition: this._bandPosition }),
            y: (datum: Datum) => {
              return (
                valueInScaleRange(this.dataToPositionY(datum), this._yAxisHelper?.getScale?.(0)) -
                this._spec.bandWidth / 2 +
                topPadding
              );
            },
            height: this._spec.bandWidth - topPadding - bottomPadding,
            width: () => this._xAxisHelper?.dataToPosition([1], { bandPosition: this._bandPosition }),
            cornerRadius: this._spec.cornerRadius,
            fill: this.getColorAttribute()
          },
          'normal',
          AttributeLevel.Series
        );
      }
      this._trigger.registerMark(progressMark);
    }
  }

  private _initTrackMark() {
    this._trackMark = this._createMark(LinearProgressSeries.mark.track, {
      parent: this._progressGroupMark,
      customShape: this._spec.track?.customShape
    }) as IRectMark;
    return this._trackMark;
  }

  private _initTrackMarkStyle() {
    const trackMark = this._trackMark;
    if (trackMark) {
      if (this._spec.direction === 'vertical') {
        this.setMarkStyle(
          trackMark,
          {
            x: (datum: any) => {
              return (
                valueInScaleRange(this.dataToPositionX(datum), this._xAxisHelper?.getScale?.(0)) -
                this._spec.bandWidth / 2
              );
            },
            y: 0,
            width: this._spec.bandWidth,
            height: () => this._scaleY.range()[0],
            cornerRadius: this._spec.cornerRadius
          },
          'normal',
          AttributeLevel.Series
        );
      } else {
        this.setMarkStyle(
          trackMark,
          {
            x: 0,
            y: (datum: any) => {
              return (
                valueInScaleRange(this.dataToPositionY(datum), this._yAxisHelper?.getScale?.(0)) -
                this._spec.bandWidth / 2
              );
            },
            height: this._spec.bandWidth,
            width: () => this._scaleX.range()[1],
            cornerRadius: this._spec.cornerRadius
          },
          'normal',
          AttributeLevel.Series
        );
      }
      this._trigger.registerMark(trackMark);
    }
  }

  private _initProgressGroupMark() {
    // FIXME: disable group mark layout to prevent reevaluate after layout end
    this._progressGroupMark = this._createMark(LinearProgressSeries.mark.group, {
      skipBeforeLayouted: false
    }) as IGroupMark;
    return this._progressGroupMark;
  }

  private _initProgressGroupMarkStyle() {
    const groupMark = this._progressGroupMark;
    groupMark.setZIndex(this.layoutZIndex);
    groupMark.created();

    this.setMarkStyle(
      groupMark,
      {
        clip: true,
        x: 0,
        y: 0,
        path: () => {
          const rectPaths: any[] = [];
          this._rawData?.rawData.forEach((datum: any, index: number) => {
            if (this._spec.direction === 'vertical') {
              const x =
                valueInScaleRange(this.dataToPositionX(datum), this._xAxisHelper?.getScale?.(0)) -
                this._spec.bandWidth / 2;
              const height = this._scaleY.range()[0];

              rectPaths.push(
                createRect({
                  x: x,
                  y: 0,
                  height: height,
                  width: this._spec.bandWidth,
                  cornerRadius: this._spec.cornerRadius,
                  fill: true
                })
              );
            } else {
              const y =
                valueInScaleRange(this.dataToPositionY(datum), this._yAxisHelper?.getScale?.(0)) -
                this._spec.bandWidth / 2;
              const width = this._scaleX.range()[1];

              rectPaths.push(
                createRect({
                  x: 0,
                  y: y,
                  height: this._spec.bandWidth,
                  width: width,
                  cornerRadius: this._spec.cornerRadius,
                  fill: true
                })
              );
            }
          });
          return rectPaths;
        }
      },
      'normal',
      AttributeLevel.Series
    );
    this._progressGroupMark.setInteractive(false);
  }

  initAnimation() {
    const animationParams: ILinearProgressAnimationParams = {
      direction: this.direction
    };

    const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<LinearProgressAppearPreset>)?.preset;

    this._progressMark.setAnimationConfig(
      animationConfig(
        Factory.getAnimationInKey('linearProgress')?.(animationParams, appearPreset),
        userAnimationConfig(SeriesMarkNameEnum.progress, this._spec, this._markAttributeContext)
      )
    );

    this._trackMark.setAnimationConfig(
      animationConfig(
        Factory.getAnimationInKey('fadeInOut')?.(),
        userAnimationConfig(SeriesMarkNameEnum.track, this._spec, this._markAttributeContext)
      )
    );
  }

  protected initTooltip() {
    this._tooltipHelper = new LinearProgressSeriesTooltipHelper(this);
    this._progressMark && this._tooltipHelper.activeTriggerSet.mark.add(this._progressMark);
    this._trackMark && this._tooltipHelper.activeTriggerSet.mark.add(this._trackMark);
  }

  getActiveMarks(): IMark[] {
    return [this._progressMark];
  }
}

export const registerLinearProgressSeries = () => {
  Factory.registerMark(RectMark.type, RectMark);
  Factory.registerSeries(LinearProgressSeries.type, LinearProgressSeries);
  registerLinearProgressAnimation();
  registerFadeInOutAnimation();
};
