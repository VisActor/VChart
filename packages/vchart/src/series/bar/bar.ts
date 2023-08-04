/* eslint-disable no-duplicate-imports */
import { isContinuous } from '@visactor/vscale';
import { Direction } from '../../typings/space';
import { CartesianSeries } from '../cartesian/cartesian';
import { MarkTypeEnum } from '../../mark/interface';
import { AttributeLevel } from '../../constant';
import { getActualNumValue } from '../util/utils';
import type { Maybe, Datum, DirectionType } from '../../typings';
import { merge, valueInScaleRange } from '../../util';
import type { BarAppearPreset, IBarAnimationParams } from './animation';
import { animationConfig, shouldDoMorph, userAnimationConfig } from '../../animation/utils';
import type { IBarSeriesSpec, IBarSeriesTheme } from './interface';
import type { IAxisHelper } from '../../component/axis/cartesian/interface';
import type { IRectMark } from '../../mark/rect';
import type { IModelInitOption } from '../../model/interface';
import type { ITextMark } from '../../mark/text';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum } from '../interface';
import { SeriesTypeEnum } from '../interface';
import { DEFAULT_MARK_ANIMATION } from '../../animation/config';
import type { IStateAnimateSpec } from '../../animation/spec';
import { BaseSeries } from '../base/base-series';
import { VChart } from '../../core/vchart';
import { RectMark } from '../../mark/rect';
import { TextMark } from '../../mark/text';
import { isValid, last } from '@visactor/vutils';

VChart.useMark([RectMark, TextMark]);

export const DefaultBandWidth = 6; // 默认的bandWidth，避免连续轴没有bandWidth

export class BarSeries<T extends IBarSeriesSpec = IBarSeriesSpec> extends CartesianSeries<T> {
  static readonly type: string = SeriesTypeEnum.bar;
  type = SeriesTypeEnum.bar;
  protected _barMarkName: SeriesMarkNameEnum = SeriesMarkNameEnum.bar;
  protected _barMarkType: MarkTypeEnum = MarkTypeEnum.rect;

  static readonly mark: SeriesMarkMap = {
    ...BaseSeries.mark,
    [SeriesMarkNameEnum.bar]: { name: SeriesMarkNameEnum.bar, type: MarkTypeEnum.rect }
  };

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

    this._rectMark = this._createMark(
      {
        ...BarSeries.mark.bar,
        name: this._barMarkName,
        type: this._barMarkType
      },
      {
        morph: shouldDoMorph(this._spec.animation, this._spec.morph, userAnimationConfig(this.type, this._spec)),
        defaultMorphElementKey: this.getDimensionField()[0],
        groupKey: this._seriesField,
        isSeriesMark: true,
        label: merge({ animation: this._spec.animation }, this._spec.label),
        progressive
      }
    ) as IRectMark;
  }

  initMarkStyle(): void {
    const rectMark = this._rectMark;
    if (rectMark) {
      this.setMarkStyle(
        rectMark,
        {
          fill: this.getColorAttribute()
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
      },
      z: this.dataToPositionZ.bind(this)
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
          y: (datum: Datum) => this._getPosition(this.direction, datum),
          height: () => this._getBarWidth(this._yAxisHelper)
        },
        'normal',
        AttributeLevel.Series
      );
    } else {
      this.setMarkStyle(
        this._rectMark,
        {
          x: (datum: Datum) => this._getPosition(this.direction, datum),
          y: (datum: Datum) => valueInScaleRange(this.dataToPositionY(datum), yScale),
          y1: (datum: Datum) => valueInScaleRange(this.dataToPositionY1(datum), yScale),
          width: () => {
            return this._getBarWidth(this._xAxisHelper);
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
        userAnimationConfig(this._barMarkName, this._spec),
        { dataIndex }
      )
    );
  }

  private _getGroupValues() {
    if (this._groups?.fields?.length > 1) {
      const groupField = last(this._groups.fields);
      return this.getViewDataStatistics()?.latestData?.[groupField]?.values ?? [];
    }

    return [];
  }

  private _getBarGapSize(axisHelper: IAxisHelper) {
    const bandWidth = axisHelper.getBandwidth?.(this._groups ? this._groups.fields.length - 1 : 0) ?? DefaultBandWidth;
    const groupBandWidth = bandWidth * this._getGroupValues().length;
    return getActualNumValue(this._spec.barGapInGroup, groupBandWidth);
  }

  protected _getBarWidth(axisHelper: IAxisHelper) {
    const hasBarWidth = this._spec.barWidth !== undefined;
    let bandWidth = axisHelper.getBandwidth?.(this._groups ? this._groups.fields.length - 1 : 0) ?? DefaultBandWidth;
    if (this._groups?.fields?.length > 1 && isValid(this._spec.barGapInGroup)) {
      const gapWidth = this._getBarGapSize(axisHelper);
      const groupCount = this._getGroupValues().length;
      bandWidth = (bandWidth * groupCount - (groupCount - 1) * gapWidth) / groupCount;
    }

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

  protected _getPosition(direction: DirectionType, datum: Datum) {
    let axisHelper;
    let sizeAttribute;
    let field;
    let dataToPosition;
    if (direction === Direction.horizontal) {
      axisHelper = this.getYAxisHelper();
      sizeAttribute = 'height';
      field = this._fieldY[0];
      dataToPosition = this.dataToPositionY.bind(this);
    } else {
      axisHelper = this.getXAxisHelper();
      sizeAttribute = 'width';
      field = this._fieldX[0];
      dataToPosition = this.dataToPositionX.bind(this);
    }
    const scale = axisHelper.getScale(0);
    const height = this._rectMark.getAttribute(sizeAttribute, datum) as number;
    const groupValues = this._getGroupValues();
    if (this._groups?.fields?.length > 1 && groupValues.length && isValid(this._spec.barGapInGroup)) {
      const groupField = last(this._groups.fields);
      const center = scale.scale(datum[field]) + axisHelper.getBandwidth(0) / 2;
      const groupCount = groupValues.length;
      const gap = this._getBarGapSize(axisHelper);
      const i = groupValues.indexOf(datum[groupField]);
      const totalWidth = groupCount * height + (groupCount - 1) * gap;
      return center - totalWidth / 2 + i * (height + gap);
    }

    const bandWidth = axisHelper.getBandwidth?.(this._groups ? this._groups.fields.length - 1 : 0) ?? DefaultBandWidth;
    const continuous = isContinuous(scale.type || 'band');
    const pos = dataToPosition(datum);
    return pos + (bandWidth - height) * 0.5 + (continuous ? -bandWidth / 2 : 0);
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
