/* eslint-disable no-duplicate-imports */
import { CartesianSeries } from '../cartesian/cartesian';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum } from '../interface/type';
import { SeriesTypeEnum } from '../interface';
import { LineLikeSeriesMixin } from '../mixin/line-mixin';
import { mixin } from '@visactor/vutils';
import { Direction, type Datum, type Maybe } from '../../typings';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import { registerLineAnimation, registerScaleInOutAnimation } from '../../animation/config';
import type { ILineSeriesSpec, ILineSeriesTheme } from './interface';
import type { IStateAnimateSpec } from '../../animation/spec';
import type { LineAppearPreset } from './animation';
import { lineSeriesMark } from './constant';
import { LineMark } from '../../mark/line';
import { SymbolMark } from '../../mark/symbol';
import { Factory } from '../../core/factory';
import type { IMark } from '../../mark/interface';

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
    >,
    CartesianSeries<T> {}

export class LineSeries<T extends ILineSeriesSpec = ILineSeriesSpec> extends CartesianSeries<T> {
  static readonly type: string = SeriesTypeEnum.line;
  type = SeriesTypeEnum.line;

  static readonly mark: SeriesMarkMap = lineSeriesMark;

  protected declare _theme: Maybe<ILineSeriesTheme>;

  protected _sortDataByAxis: boolean = false;

  compile(): void {
    super.compile();
    const { width, height } = this._region.getLayoutRect();
    const samplingTrans = [];
    const overlapTrans = [];

    if (this._spec.sampling) {
      const fieldsY = this._yAxisHelper.getFields ? this._yAxisHelper.getFields() : this._fieldY;
      const fieldsX = this._xAxisHelper.getFields ? this._xAxisHelper.getFields() : this._fieldX;

      samplingTrans.push({
        type: 'sampling',
        size: this._direction === Direction.vertical ? width : height,
        factor: this._spec.samplingFactor,
        yfield: this._direction === Direction.vertical ? fieldsY[0] : fieldsX[0],
        groupBy: this._seriesField,
        mode: this._spec.sampling
      });
      this._data.getProduct().transform(samplingTrans);
    }
    if (this._spec.markOverlap) {
      overlapTrans.push({
        type: 'markoverlap',
        direction: this._direction === Direction.vertical ? 2 : 1,
        delta: this._spec.pointDis,
        deltaMul: this._spec.pointDisMul,
        groupBy: this._seriesField
      });
      this._symbolMark.getProduct().transform(overlapTrans);
    }
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
        userAnimationConfig(SeriesMarkNameEnum.line, this._spec)
      )
    );

    if (this._symbolMark) {
      this._symbolMark.setAnimationConfig(
        animationConfig(
          Factory.getAnimationInKey('scaleInOut')?.(),
          userAnimationConfig(SeriesMarkNameEnum.point, this._spec)
        )
      );
    }
  }

  onLayoutEnd(ctx: any): void {
    super.onLayoutEnd(ctx);
    if (this._spec.sampling) {
      this.compile();
    }
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
  Factory.registerMark(LineMark.type, LineMark);
  Factory.registerMark(SymbolMark.type, SymbolMark);
  Factory.registerSeries(LineSeries.type, LineSeries);
  registerLineAnimation();
  registerScaleInOutAnimation();
};
