/* eslint-disable no-duplicate-imports */
import { CartesianSeries } from '../cartesian/cartesian';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import { LineLikeSeriesMixin } from '../mixin/line-mixin';
import { mixin } from '@visactor/vutils';
import type { Datum, Maybe } from '../../typings';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import { registerLineAnimation, registerScaleInOutAnimation } from '../../animation/config';
import type { ILineSeriesSpec, ILineSeriesTheme } from './interface';
import type { IStateAnimateSpec } from '../../animation/spec';
import type { LineAppearPreset } from './animation';
import { lineSeriesMark } from './constant';
import { LineMark, registerLineMark } from '../../mark/line';
import { SymbolMark, registerSymbolMark } from '../../mark/symbol';
import { Factory } from '../../core/factory';
import type { IMark } from '../../mark/interface';
import { registerSampleTransform, registerMarkOverlapTransform } from '@visactor/vgrammar-core';

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
      | 'addSamplingCompile'
      | 'addOverlapCompile'
      | 'reCompileSampling'
    >,
    CartesianSeries<T> {}

export class LineSeries<T extends ILineSeriesSpec = ILineSeriesSpec> extends CartesianSeries<T> {
  static readonly type: string = SeriesTypeEnum.line;
  type = SeriesTypeEnum.line;

  static readonly mark: SeriesMarkMap = lineSeriesMark;

  protected _sortDataByAxis: boolean = false;

  compile(): void {
    super.compile();
    this.addSamplingCompile();
    this.addOverlapCompile();
  }

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

  protected initTooltip() {
    super.initTooltip();
    this._lineMark && this._tooltipHelper.activeTriggerSet.dimension.add(this._lineMark);
    this._symbolMark && this._tooltipHelper.activeTriggerSet.mark.add(this._symbolMark);
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
        Factory.getAnimationInKey('line')?.(animationParams, appearPreset),
        userAnimationConfig(SeriesMarkNameEnum.line, this._spec, this._markAttributeContext)
      )
    );

    if (this._symbolMark) {
      this._symbolMark.setAnimationConfig(
        animationConfig(
          Factory.getAnimationInKey('scaleInOut')?.(),
          userAnimationConfig(SeriesMarkNameEnum.point, this._spec, this._markAttributeContext)
        )
      );
    }
  }

  onLayoutEnd(ctx: any): void {
    super.onLayoutEnd(ctx);
    this.reCompileSampling();
  }

  getSeriesStyle(datum: Datum) {
    const isLineAsSeriesMark = this._spec?.seriesMark !== 'point'; // 加判空防止某些特殊时刻（如 updateSpec 时）鼠标滑过图表导致报错
    return (attribute: string) => {
      if (isLineAsSeriesMark) {
        // 增加一个标识位，用于是否替换，因为图例获取颜色的时候是不需要替换的
        attribute === 'fill' && (attribute = 'stroke');
      }
      return this._seriesMark?.getAttribute(attribute as any, datum) ?? undefined;
    };
  }

  getDefaultShapeType() {
    return 'circle';
  }

  getActiveMarks(): IMark[] {
    return [this._lineMark, this._symbolMark];
  }
}

mixin(LineSeries, LineLikeSeriesMixin);

export const registerLineSeries = () => {
  registerSampleTransform();
  registerMarkOverlapTransform();
  registerLineMark();
  registerSymbolMark();
  registerLineAnimation();
  registerScaleInOutAnimation();
  Factory.registerSeries(LineSeries.type, LineSeries);
};
