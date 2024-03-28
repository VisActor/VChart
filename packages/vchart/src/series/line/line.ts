/* eslint-disable no-duplicate-imports */
import { CartesianSeries } from '../cartesian/cartesian';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import { LineLikeSeriesMixin } from '../mixin/line-mixin';
import { mixin } from '@visactor/vutils';
import type { Datum } from '../../typings';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import { registerLineAnimation, registerScaleInOutAnimation } from '../../animation/config';
import type { ILineSeriesSpec } from './interface';
import type { IStateAnimateSpec } from '../../animation/spec';
import type { LineAppearPreset } from './animation';
import { lineSeriesMark } from './constant';
import { registerLineMark } from '../../mark/line';
import { registerSymbolMark } from '../../mark/symbol';
import { Factory } from '../../core/factory';
import type { IMark } from '../../mark/interface';
import { registerSampleTransform, registerMarkOverlapTransform } from '@visactor/vgrammar-core';
import { LineLikeSeriesSpecTransformer } from '../mixin/line-mixin-transformer';
import { getGroupAnimationParams } from '../util/utils';

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
  static readonly transformerConstructor = LineLikeSeriesSpecTransformer;
  readonly transformerConstructor = LineLikeSeriesSpecTransformer;

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
    const { dimension, group, mark } = this._tooltipHelper.activeTriggerSet;
    if (this._lineMark) {
      dimension.add(this._lineMark);
      group.add(this._lineMark);
    }
    if (this._symbolMark) {
      mark.add(this._symbolMark);
      group.add(this._symbolMark);
    }
  }

  initMarkStyle(): void {
    this.initLineMarkStyle(this._direction);
    this.initSymbolMarkStyle();
  }

  initAnimation() {
    const lineAnimationParams = { direction: this.direction };
    const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<LineAppearPreset>)?.preset;
    this._lineMark.setAnimationConfig(
      animationConfig(
        Factory.getAnimationInKey('line')?.(lineAnimationParams, appearPreset),
        userAnimationConfig(SeriesMarkNameEnum.line, this._spec, this._markAttributeContext)
      )
    );

    if (this._symbolMark) {
      const animationParams = getGroupAnimationParams(this);
      this._symbolMark.setAnimationConfig(
        animationConfig(
          Factory.getAnimationInKey('scaleInOut')?.(),
          userAnimationConfig(SeriesMarkNameEnum.point, this._spec, this._markAttributeContext),
          animationParams
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
