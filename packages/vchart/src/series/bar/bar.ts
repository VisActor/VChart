import { isContinuous } from '@visactor/vgrammar-scale';
import { Direction } from '../../typings/space';
import { CartesianSeries } from '../cartesian/cartesian';
import { MarkTypeEnum } from '../../mark/interface';
import { AttributeLevel } from '../../constant';
import { getActualNumValue } from '../util/utils';
import type { Maybe, Datum } from '../../typings';
import { merge, valueInScaleRange } from '../../util';
import type { BarAppearPreset, IBarAnimationParams } from './animation';
import { animationConfig, userAnimationConfig } from '../../animation/utils';
import type { IBarSeriesSpec, IBarSeriesTheme } from './interface';
import type { IAxisHelper } from '../../component/axis/cartesian/interface';
import type { IRectMark } from '../../mark/rect';
import type { IModelInitOption } from '../../model/interface';
import type { ITextMark } from '../../mark/text';
import { SeriesTypeEnum } from '../interface';
import { DEFAULT_MARK_ANIMATION } from '../../animation/config';
import type { IStateAnimateSpec } from '../../animation/spec';

export const DefaultBandWidth = 6; // 默认的bandWidth，避免连续轴没有bandWidth

export class BarSeries<T extends IBarSeriesSpec = IBarSeriesSpec> extends CartesianSeries<T> {
  static readonly type: string = SeriesTypeEnum.bar;
  type = SeriesTypeEnum.bar;
  protected _barMarkType: MarkTypeEnum = MarkTypeEnum.rect;

  protected declare _theme: Maybe<IBarSeriesTheme>;

  protected _stack: boolean = true;
  protected _bandPosition = 0;
  protected _rectMark!: IRectMark;

  initMark(): void {
    const progressive = {
      progressiveStep: this._spec.progressiveStep,
      progressiveThreshold: this._spec.progressiveThreshold,
      large: this._spec.large,
      largeThreshold: this._spec.largeThreshold
    };

    this._rectMark = this._createMark(this._barMarkType, 'bar', {
      defaultMorphElementKey: this.getDimensionField()[0],
      groupKey: this._seriesField,
      isSeriesMark: true,
      label: merge({ animation: this._spec.animation }, this._spec.label),
      progressive
    }) as IRectMark;
  }

  initMarkStyle(): void {
    const rectMark = this._rectMark;
    if (rectMark) {
      this.setMarkStyle(
        rectMark,
        {
          fill: this.getColorAttribute(),
          fillOpacity: this._theme.fillOpacity
        },
        'normal',
        AttributeLevel.Series
      );

      this._trigger.registerMark(rectMark);
      this._tooltipHelper?.activeTriggerSet.mark.add(rectMark);
    }
  }

  initLabelMarkStyle(textMark: ITextMark) {
    if (!textMark) {
      return;
    }
    this.setMarkStyle(textMark, {
      fill: this.getColorAttribute(),
      text: (datum: Datum) => {
        return datum[this.getStackValueField()];
      }
    });
  }

  init(option: IModelInitOption): void {
    super.init(option);
    if (this.direction === 'vertical') {
      this._xAxisHelper?.getScale(0).type === 'band' ? this.initBandRectMarkStyle() : this.initLinearRectMarkStyle();
    } else {
      this._yAxisHelper?.getScale(0).type === 'band' ? this.initBandRectMarkStyle() : this.initLinearRectMarkStyle();
    }
  }

  initBandRectMarkStyle() {
    const xScale = this._xAxisHelper?.getScale?.(0);
    const yScale = this._yAxisHelper?.getScale?.(0);
    // TODO: 这里要考虑更多 条件因素
    // TODO: 这里要补充堆积
    // guess the direction which the user want
    if (this.direction === Direction.horizontal) {
      this.setMarkStyle(
        this._rectMark,
        {
          x: (datum: Datum) => valueInScaleRange(this.dataToPositionX(datum), xScale),
          x1: (datum: Datum) => valueInScaleRange(this.dataToPositionX1(datum), xScale),
          y: (datum: Datum) => {
            const bandWidth =
              this.getYAxisHelper().getBandwidth?.(this._groups ? this._groups.fields.length - 1 : 0) ??
              DefaultBandWidth;
            const continuous = isContinuous(yScale.type || 'band');
            const pos = this.dataToPositionY(datum);
            const width = this._rectMark.getAttribute('height', datum) as number;
            return pos + (bandWidth - width) * 0.5 + (continuous ? -bandWidth / 2 : 0);
          },
          height: () => this.getBarWidth(this._yAxisHelper)
        },
        'normal',
        AttributeLevel.Series
      );
    } else {
      this.setMarkStyle(
        this._rectMark,
        {
          x: (datum: Datum) => {
            const bandWidth =
              this.getXAxisHelper().getBandwidth?.(this._groups ? this._groups.fields.length - 1 : 0) ??
              DefaultBandWidth;
            const width = this._rectMark.getAttribute('width', datum) as number;
            const continuous = isContinuous(this.getXAxisHelper().getScale?.(0).type || 'band');
            const pos = this.dataToPositionX(datum);
            return pos + (bandWidth - width) / 2 + (continuous ? -bandWidth / 2 : 0);
          },
          y: (datum: Datum) => valueInScaleRange(this.dataToPositionY(datum), yScale),
          y1: (datum: Datum) => valueInScaleRange(this.dataToPositionY1(datum), yScale),
          width: () => {
            return this.getBarWidth(this._xAxisHelper);
          }
        },
        'normal',
        AttributeLevel.Series
      );
    }
  }

  initLinearRectMarkStyle() {
    const xScale = this._xAxisHelper?.getScale?.(0);
    const yScale = this._yAxisHelper?.getScale?.(0);
    this.setMarkStyle(
      this._rectMark,
      {
        x: (datum: Datum) => valueInScaleRange(this.dataToPositionX(datum), xScale),
        x1: (datum: Datum) => valueInScaleRange(this.dataToPositionX1(datum), xScale),
        y: (datum: Datum) => valueInScaleRange(this.dataToPositionY(datum), yScale),
        y1: (datum: Datum) => valueInScaleRange(this.dataToPositionY1(datum), yScale)
      },
      'normal',
      AttributeLevel.Series
    );
  }

  initAnimation() {
    // 这个数据在这个时候拿不到，因为组件还没创建结束，统计和筛选也还没添加。
    // 而且这个值理论上是动态的，建议 监听 viewDataStatisticsUpdate 消息动态更新
    const animationParams: IBarAnimationParams = {
      yField: this._fieldY[0],
      xField: this._fieldX[0],
      direction: this.direction,
      growFrom: () =>
        this.direction === 'horizontal'
          ? this._xAxisHelper?.getScale(0).scale(0)
          : this._yAxisHelper?.getScale(0).scale(0)
    };
    const appearPreset = (this._spec?.animationAppear as IStateAnimateSpec<BarAppearPreset>)?.preset;
    // 分组数据的dataIndex应该与x轴顺序一致，而非data[DEFAULT_DATA_INDEX]顺序
    const dataIndex = (datum: any) => {
      const xValue = datum?.[this._fieldX[0]];
      const xIndex = this.getViewDataStatistics()?.latestData?.[this._fieldX[0]]?.values.indexOf(xValue);
      // 不应该出现xIndex === -1 || undefined的情况
      return xIndex || 0;
    };

    this._rectMark.setAnimationConfig(
      animationConfig(
        DEFAULT_MARK_ANIMATION.bar(animationParams, appearPreset),
        userAnimationConfig('bar', this._spec),
        { dataIndex }
      )
    );
  }

  protected getBarWidth(axisHelper: IAxisHelper) {
    const hasBarWidth = this._spec.barWidth !== undefined;
    const bandWidth = axisHelper.getBandwidth?.(this._groups ? this._groups.fields.length - 1 : 0) ?? DefaultBandWidth;
    if (hasBarWidth) {
      return getActualNumValue(this._spec.barWidth, bandWidth);
    }
    const hasBarMinWidth = this._spec.barMinWidth !== undefined;
    const hasBarMaxWidth = this._spec.barMaxWidth !== undefined;
    let width = bandWidth;
    if (hasBarMinWidth) {
      width = Math.max(width, getActualNumValue(this._spec.barMinWidth, bandWidth));
    }
    if (hasBarMaxWidth) {
      width = Math.min(width, getActualNumValue(this._spec.barMaxWidth, bandWidth));
    }
    return width;
  }

  /**
   * spec 更新
   * @param spec
   * @returns
   */
  updateSpec(spec: IBarSeriesSpec) {
    // super updateSpec 会执行 setAttrFromSpec 所以先缓存比对值
    const { direction } = this._spec;
    const result = super.updateSpec(spec);
    if (spec.direction !== direction) {
      result.change = true;
      result.reRender = true;
      result.reMake = true;
    }
    return result;
  }

  getDefaultShapeType(): string {
    return 'square';
  }
}

export class Bar3dSeries extends BarSeries {
  static readonly type: string = SeriesTypeEnum.bar3d;
  type = SeriesTypeEnum.bar3d;
  protected _barMarkType: MarkTypeEnum = MarkTypeEnum.rect3d;
}
