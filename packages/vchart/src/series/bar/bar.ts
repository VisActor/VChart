/* eslint-disable no-duplicate-imports */
import type { IBaseScale } from '@visactor/vscale';
import { isContinuous } from '@visactor/vscale';
import { Direction } from '../../typings/space';
import { CartesianSeries } from '../cartesian/cartesian';
import { MarkTypeEnum } from '../../mark/interface';
import { AttributeLevel, DEFAULT_DATA_KEY } from '../../constant';
import type { Maybe, Datum, DirectionType } from '../../typings';
import { mergeSpec, valueInScaleRange, getActualNumValue } from '../../util';
import type { BarAppearPreset, IBarAnimationParams } from './animation';
import { animationConfig, shouldDoMorph, userAnimationConfig } from '../../animation/utils';
import type { IBarSeriesSpec, IBarSeriesTheme } from './interface';
import type { IAxisHelper } from '../../component/axis/cartesian/interface';
import type { IRectMark } from '../../mark/rect';
import type { IModelInitOption } from '../../model/interface';
import type { ITextMark } from '../../mark/text';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum } from '../interface/type';
import { SeriesTypeEnum } from '../interface';
import { DEFAULT_MARK_ANIMATION } from '../../animation/config';
import type { IStateAnimateSpec } from '../../animation/spec';
import { VChart } from '../../core/vchart';
import { RectMark } from '../../mark/rect';
import { TextMark } from '../../mark/text';
import type { Dict } from '@visactor/vutils';
import { array, isValid, last } from '@visactor/vutils';
import { barSeriesMark } from './constant';

VChart.useMark([RectMark, TextMark]);

export const DefaultBandWidth = 6; // 默认的bandWidth，避免连续轴没有bandWidth

export class BarSeries<T extends IBarSeriesSpec = IBarSeriesSpec> extends CartesianSeries<T> {
  static readonly type: string = SeriesTypeEnum.bar;
  type = SeriesTypeEnum.bar;
  protected _barMarkName: SeriesMarkNameEnum = SeriesMarkNameEnum.bar;
  protected _barMarkType: MarkTypeEnum = MarkTypeEnum.rect;

  static readonly mark: SeriesMarkMap = barSeriesMark;

  protected declare _theme: Maybe<IBarSeriesTheme>;

  protected _stack: boolean = true;
  protected _bandPosition = 0;
  protected _rectMark!: IRectMark;

  private _cachedRectPositions: Dict<any>;

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
        label: mergeSpec({ animation: this._spec.animation }, this._spec.label),
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
      z: this._fieldZ ? this.dataToPositionZ.bind(this) : null
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

  private _calculateRectPosition() {
    if (!this._cachedRectPositions) {
      const isVertical = this.direction === Direction.vertical;
      let start: string;
      let end: string;
      let startMethod: string;
      let endMethod: string;
      let scale: IBaseScale;
      let inverse: boolean;
      if (isVertical) {
        start = 'y1';
        end = 'y';
        startMethod = 'dataToPositionY1';
        endMethod = 'dataToPositionY';
        scale = this._yAxisHelper.getScale?.(0);
        inverse = this._yAxisHelper.isInverse();
      } else {
        start = 'x1';
        end = 'x';
        startMethod = 'dataToPositionX1';
        endMethod = 'dataToPositionX';
        scale = this._xAxisHelper.getScale?.(0);
        inverse = this._xAxisHelper.isInverse();
      }

      this._cachedRectPositions = {};
      const stackData = this.getStackData();
      const barMinHeight = this._spec.barMinHeight;

      const calculatePosition = (data: any, cache: Dict<any>) => {
        Object.keys(data.nodes).forEach(key => {
          if (data.nodes[key].nodes) {
            calculatePosition(data.nodes[key], cache);
          } else {
            const values = data.nodes[key].values;

            let lastY: number;
            values.forEach((obj: Datum, index: number) => {
              const y1 = valueInScaleRange(this[startMethod](obj), scale);
              let y = valueInScaleRange(this[endMethod](obj), scale);

              if (index === 0) {
                lastY = y1;
              }

              let height = Math.abs(y1 - y);
              if (height < barMinHeight) {
                height = barMinHeight;
              }

              let flag = 1;
              if (y < y1) {
                flag = -1;
              } else if (y === y1) {
                flag = isVertical ? (inverse ? 1 : -1) : inverse ? -1 : 1;
              }
              y = lastY + flag * height;
              this._cachedRectPositions[obj[DEFAULT_DATA_KEY]] = {
                [start]: lastY,
                [end]: y
              };
              lastY = y;
            });
          }
        });
      };
      calculatePosition(stackData, this._cachedRectPositions);
    }
  }

  initBandRectMarkStyle() {
    const xScale = this._xAxisHelper?.getScale?.(0);
    const yScale = this._yAxisHelper?.getScale?.(0);

    // guess the direction which the user want
    if (this.direction === Direction.horizontal) {
      this.setMarkStyle(
        this._rectMark,
        {
          x: (datum: Datum) => {
            if (this._spec.barMinHeight) {
              this._calculateRectPosition();
              return this._cachedRectPositions[datum[DEFAULT_DATA_KEY]].x;
            }
            return valueInScaleRange(this.dataToPositionX(datum), xScale);
          },
          x1: (datum: Datum) => {
            if (this._spec.barMinHeight) {
              this._calculateRectPosition();
              return this._cachedRectPositions[datum[DEFAULT_DATA_KEY]].x1;
            }
            return valueInScaleRange(this.dataToPositionX1(datum), xScale);
          },
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
          y: (datum: Datum, ctx, opt, dataView) => {
            if (this._spec.barMinHeight) {
              this._calculateRectPosition();
              return this._cachedRectPositions[datum[DEFAULT_DATA_KEY]].y;
            }

            return valueInScaleRange(this.dataToPositionY(datum), yScale);
          },
          y1: (datum: Datum) => {
            if (this._spec.barMinHeight) {
              this._calculateRectPosition();
              return this._cachedRectPositions[datum[DEFAULT_DATA_KEY]].y1;
            }
            return valueInScaleRange(this.dataToPositionY1(datum), yScale);
          },
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

    if (this.direction === Direction.vertical) {
      this.setMarkStyle(
        this._rectMark,
        {
          x: (datum: Datum) => valueInScaleRange(this.dataToPositionX(datum), xScale),
          x1: (datum: Datum) => valueInScaleRange(this.dataToPositionX1(datum), xScale),
          y: (datum: Datum, ctx, opt, dataView) => {
            if (this._spec.barMinHeight) {
              this._calculateRectPosition();
              return this._cachedRectPositions[datum[DEFAULT_DATA_KEY]].y;
            }

            return valueInScaleRange(this.dataToPositionY(datum), yScale);
          },
          y1: (datum: Datum) => {
            if (this._spec.barMinHeight) {
              this._calculateRectPosition();
              return this._cachedRectPositions[datum[DEFAULT_DATA_KEY]].y1;
            }
            return valueInScaleRange(this.dataToPositionY1(datum), yScale);
          }
        },
        'normal',
        AttributeLevel.Series
      );
    } else {
      this.setMarkStyle(
        this._rectMark,
        {
          x: (datum: Datum) => {
            if (this._spec.barMinHeight) {
              this._calculateRectPosition();
              return this._cachedRectPositions[datum[DEFAULT_DATA_KEY]].x;
            }
            return valueInScaleRange(this.dataToPositionX(datum), xScale);
          },
          x1: (datum: Datum) => {
            if (this._spec.barMinHeight) {
              this._calculateRectPosition();
              return this._cachedRectPositions[datum[DEFAULT_DATA_KEY]].x1;
            }
            return valueInScaleRange(this.dataToPositionX1(datum), xScale);
          },
          y: (datum: Datum) => valueInScaleRange(this.dataToPositionY(datum), yScale),
          y1: (datum: Datum) => valueInScaleRange(this.dataToPositionY1(datum), yScale)
        },
        'normal',
        AttributeLevel.Series
      );
    }
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

  protected _getBarWidth(axisHelper: IAxisHelper) {
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

  protected _getPosition(direction: DirectionType, datum: Datum) {
    let axisHelper;
    let sizeAttribute;
    let dataToPosition;
    if (direction === Direction.horizontal) {
      axisHelper = this.getYAxisHelper();
      sizeAttribute = 'height';
      dataToPosition = this.dataToPositionY.bind(this);
    } else {
      axisHelper = this.getXAxisHelper();
      sizeAttribute = 'width';
      dataToPosition = this.dataToPositionX.bind(this);
    }
    const scale = axisHelper.getScale(0);
    const size = this._rectMark.getAttribute(sizeAttribute, datum) as number;
    const bandWidth = axisHelper.getBandwidth?.(this._groups ? this._groups.fields.length - 1 : 0) ?? DefaultBandWidth;
    if (this._groups?.fields?.length > 1 && isValid(this._spec.barGapInGroup)) {
      // 自里向外计算，沿着第一层分组的中心点进行位置调整
      const groupFields = this._groups.fields;
      const barInGroup = array(this._spec.barGapInGroup);
      let totalWidth: number = 0;
      let offSet: number = 0;

      for (let index = groupFields.length - 1; index >= 1; index--) {
        const groupField = groupFields[index];
        const groupValues = this.getViewDataStatistics()?.latestData?.[groupField]?.values ?? [];
        const groupCount = groupValues.length;
        const gap = getActualNumValue(barInGroup[index - 1] ?? last(barInGroup), bandWidth);
        const i = groupValues.indexOf(datum[groupField]);
        if (index === groupFields.length - 1) {
          totalWidth += groupCount * size + (groupCount - 1) * gap;
          offSet += i * (size + gap);
        } else {
          offSet += i * (totalWidth + gap);
          totalWidth += totalWidth + (groupCount - 1) * gap;
        }
      }

      const center = scale.scale(datum[groupFields[0]]) + axisHelper.getBandwidth(0) / 2;
      return center - totalWidth / 2 + offSet;
    }

    const continuous = isContinuous(scale.type || 'band');
    const pos = dataToPosition(datum);
    return pos + (bandWidth - size) * 0.5 + (continuous ? -bandWidth / 2 : 0);
  }

  onLayoutEnd(ctx: any) {
    super.onLayoutEnd(ctx);
    this._cachedRectPositions = null;
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
