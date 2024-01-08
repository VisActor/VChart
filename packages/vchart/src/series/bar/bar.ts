import { PREFIX } from './../../constant/index';
/* eslint-disable no-duplicate-imports */
import { isContinuous } from '@visactor/vscale';
import { Direction } from '../../typings/space';
import { CartesianSeries } from '../cartesian/cartesian';
import type { IMark, IMarkProgressiveConfig } from '../../mark/interface';
import { MarkTypeEnum } from '../../mark/interface/type';
import { AttributeLevel } from '../../constant';
import type { Maybe, Datum, DirectionType } from '../../typings';
import { valueInScaleRange } from '../../util/scale';
import { getRegionStackGroup } from '../../util/data';
import { getActualNumValue } from '../../util/space';
import { registerBarAnimation, type BarAppearPreset, type IBarAnimationParams } from './animation';
import { animationConfig, shouldMarkDoMorph, userAnimationConfig } from '../../animation/utils';
import type { IBarSeriesSpec, IBarSeriesTheme } from './interface';
import type { IAxisHelper } from '../../component/axis/cartesian/interface';
import type { IRectMark } from '../../mark/rect';
import type { IModelInitOption } from '../../model/interface';
import type { ITextMark } from '../../mark/text';
import type { SeriesMarkMap } from '../interface';
import { SeriesMarkNameEnum, SeriesTypeEnum } from '../interface/type';
import type { IStateAnimateSpec } from '../../animation/spec';
import { RectMark, registerRectMark } from '../../mark/rect';
import { array, isNil, isValid, last } from '@visactor/vutils';
import { barSeriesMark } from './constant';
import { stackWithMinHeight } from '../util/stack';
import { Factory } from '../../core/factory';
import { registerDataSetInstanceTransform } from '../../data/register';
import { SeriesData } from '../base/series-data';
import { DataView } from '@visactor/vdataset';
import { addVChartProperty } from '../../data/transforms/add-property';
import { addDataKey, initKeyMap } from '../../data/transforms/data-key';
import { registerSampleTransform } from '@visactor/vgrammar-core';
import type { ILabelSpec } from '../../component';
import { getGroupAnimationParams } from '../util/utils';
import { BarSeriesSpecTransformer } from './bar-transformer';

export const DefaultBandWidth = 6; // 默认的bandWidth，避免连续轴没有bandWidth
const RECT_X = `${PREFIX}_rect_x`;
const RECT_X1 = `${PREFIX}_rect_x1`;
const RECT_Y = `${PREFIX}_rect_y`;
const RECT_Y1 = `${PREFIX}_rect_y1`;

export class BarSeries<T extends IBarSeriesSpec = IBarSeriesSpec> extends CartesianSeries<T> {
  static readonly type: string = SeriesTypeEnum.bar;
  type = SeriesTypeEnum.bar;
  protected _barMarkName: SeriesMarkNameEnum = SeriesMarkNameEnum.bar;
  protected _barMarkType: MarkTypeEnum = MarkTypeEnum.rect;

  static readonly mark: SeriesMarkMap = barSeriesMark;
  static readonly transformerConstructor = BarSeriesSpecTransformer as any;
  readonly transformerConstructor = BarSeriesSpecTransformer;

  protected _supportStack: boolean = true;
  protected _bandPosition = 0;
  protected _barMark!: IRectMark;
  protected _barBackgroundMark!: IRectMark;

  protected _barBackgroundViewData: SeriesData;

  initMark(): void {
    const progressive = {
      progressiveStep: this._spec.progressiveStep,
      progressiveThreshold: this._spec.progressiveThreshold,
      large: this._spec.large,
      largeThreshold: this._spec.largeThreshold
    };

    this._initBarBackgroundMark(progressive);

    this._barMark = this._createMark(
      {
        ...BarSeries.mark.bar,
        name: this._barMarkName,
        type: this._barMarkType
      },
      {
        morph: shouldMarkDoMorph(this._spec, this._barMarkName),
        defaultMorphElementKey: this.getDimensionField()[0],
        groupKey: this._seriesField,
        isSeriesMark: true,
        progressive,
        customShape: this._spec.bar?.customShape
      }
    ) as IRectMark;
  }

  protected _initBarBackgroundMark(progressive?: IMarkProgressiveConfig): void {
    if (this._spec.barBackground?.visible) {
      this._barBackgroundMark = this._createMark(BarSeries.mark.barBackground, {
        dataView: this._barBackgroundViewData.getDataView(),
        dataProductId: this._barBackgroundViewData.getProductId(),
        progressive,
        customShape: this._spec.barBackground?.customShape
      }) as IRectMark;
    }
  }

  initMarkStyle(): void {
    if (this._barMark) {
      this.setMarkStyle(
        this._barMark,
        {
          fill: this.getColorAttribute()
        },
        'normal',
        AttributeLevel.Series
      );

      this._trigger.registerMark(this._barMark);
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

  protected initTooltip() {
    super.initTooltip();

    this._barMark && this._tooltipHelper.activeTriggerSet.mark.add(this._barMark);
  }

  protected _statisticViewData(): void {
    super._statisticViewData();

    const spec = this._spec.barBackground ?? {};
    if (!spec.visible) {
      return;
    }

    type DimensionItemsConfig = { scaleDepth?: number };

    /**
     * @description 准备 barBackground 数据
     */
    const dimensionItems = ([data]: DataView[], { scaleDepth }: DimensionItemsConfig) => {
      let dataCollect: any[] = [{}];
      const fields = this.getDimensionField();
      // 将维度轴的所有层级 field 的对应数据做笛卡尔积
      const depth = isNil(scaleDepth) ? fields.length : Math.min(fields.length, scaleDepth);
      for (let i = 0; i < depth; i++) {
        const field = fields[i];
        const values = data.latestData[field]?.values;
        if (!values?.length) {
          continue;
        }
        const newDataCollect: any[] = [];
        for (let j = 0; j < values.length; j++) {
          for (let k = 0; k < dataCollect.length; k++) {
            newDataCollect.push({
              ...dataCollect[k],
              [field]: values[j]
            });
          }
        }
        dataCollect = newDataCollect;
      }
      return dataCollect;
    };

    registerDataSetInstanceTransform(this._option.dataSet, 'addVChartProperty', addVChartProperty);
    registerDataSetInstanceTransform(this._option.dataSet, 'dimensionItems', dimensionItems);

    const barBackgroundData = new DataView(this._option.dataSet)
      .parse([this._viewDataStatistics], {
        type: 'dataview'
      })
      .transform(
        {
          type: 'dimensionItems',
          options: {
            scaleDepth: spec.isGroupLevel ? 1 : undefined
          } as DimensionItemsConfig
        },
        false
      )
      .transform(
        {
          type: 'addVChartProperty',
          options: {
            beforeCall: initKeyMap.bind(this),
            call: addDataKey
          }
        },
        false
      );

    this._viewDataStatistics?.target.addListener('change', barBackgroundData.reRunAllTransform);
    this._barBackgroundViewData = new SeriesData(this._option, barBackgroundData);
  }

  init(option: IModelInitOption): void {
    super.init(option);
    if (this.direction === 'vertical') {
      this._xAxisHelper?.getScale(0).type === 'band' ? this.initBandRectMarkStyle() : this.initLinearRectMarkStyle();
    } else {
      this._yAxisHelper?.getScale(0).type === 'band' ? this.initBandRectMarkStyle() : this.initLinearRectMarkStyle();
    }
  }

  private _shouldDoPreCalculate() {
    const region = this.getRegion();
    return (
      this._stack && region.getSeries().filter(s => s.type === SeriesTypeEnum.bar && s.getSpec().barMinHeight).length
    );
  }

  private _calculateStackRectPosition(isVertical: boolean) {
    const region = this.getRegion();

    // @ts-ignore
    if (region._bar_series_position_calculated) {
      return;
    }
    // @ts-ignore
    region._bar_series_position_calculated = true; // 因为是 region 内堆叠矩形的计算，所以加一个 hack 标识位用于避免重复计算
    let start: string;
    let end: string;
    let startMethod: string;
    let endMethod: string;
    let axisHelper: string;
    if (isVertical) {
      start = RECT_Y1;
      end = RECT_Y;
      startMethod = 'dataToPositionY1';
      endMethod = 'dataToPositionY';
      axisHelper = '_yAxisHelper';
    } else {
      start = RECT_X1;
      end = RECT_X;
      startMethod = 'dataToPositionX1';
      endMethod = 'dataToPositionX';
      axisHelper = '_xAxisHelper';
    }

    // only reCompute bar
    const stackValueGroup = getRegionStackGroup(region, false, s => s.type === SeriesTypeEnum.bar);

    // 按照堆积逻辑 重新计算一次图形的堆积位置并设置到数据上
    for (const stackValue in stackValueGroup) {
      for (const key in stackValueGroup[stackValue].nodes) {
        stackWithMinHeight(stackValueGroup[stackValue].nodes[key], region.getStackInverse(), {
          isVertical,
          start,
          end,
          startMethod,
          endMethod,
          axisHelper
        });
      }
    }
  }

  private _calculateRectPosition(datum: Datum, isVertical: boolean) {
    let startMethod: string;
    let endMethod: string;
    let axisHelper: string;
    if (isVertical) {
      startMethod = 'dataToPositionY1';
      endMethod = 'dataToPositionY';
      axisHelper = '_yAxisHelper';
    } else {
      startMethod = 'dataToPositionX1';
      endMethod = 'dataToPositionX';
      axisHelper = '_xAxisHelper';
    }

    const seriesScale = this[axisHelper].getScale?.(0);
    const inverse = this[axisHelper].isInverse();
    const barMinHeight = this._spec.barMinHeight;
    const y1 = valueInScaleRange(this[startMethod](datum), seriesScale);
    const y = valueInScaleRange(this[endMethod](datum), seriesScale);

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
    return y1 + flag * height;
  }

  initBandRectMarkStyle() {
    const xScale = this._xAxisHelper?.getScale?.(0);
    const yScale = this._yAxisHelper?.getScale?.(0);

    // guess the direction which the user want
    if (this.direction === Direction.horizontal) {
      this.setMarkStyle(
        this._barMark,
        {
          x: (datum: Datum) => {
            if (this._shouldDoPreCalculate()) {
              this._calculateStackRectPosition(false);
              return datum[RECT_X];
            }

            if (this._spec.barMinHeight) {
              return this._calculateRectPosition(datum, false);
            }

            return valueInScaleRange(this.dataToPositionX(datum), xScale);
          },
          x1: (datum: Datum) => {
            if (this._shouldDoPreCalculate()) {
              this._calculateStackRectPosition(false);
              return datum[RECT_X1];
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
        this._barMark,
        {
          x: (datum: Datum) => this._getPosition(this.direction, datum),
          y: (datum: Datum, ctx, opt, dataView) => {
            if (this._shouldDoPreCalculate()) {
              this._calculateStackRectPosition(true);
              return datum[RECT_Y];
            }

            if (this._spec.barMinHeight) {
              return this._calculateRectPosition(datum, true);
            }

            return valueInScaleRange(this.dataToPositionY(datum), yScale);
          },
          y1: (datum: Datum) => {
            if (this._shouldDoPreCalculate()) {
              this._calculateStackRectPosition(true);
              return datum[RECT_Y1];
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
    this._initBarBackgroundMarkStyle();
  }

  protected _initBarBackgroundMarkStyle() {
    if (!this._barBackgroundMark) {
      return;
    }

    const xScale = this._xAxisHelper?.getScale?.(0);
    const yScale = this._yAxisHelper?.getScale?.(0);
    const spec = this._spec.barBackground ?? {};
    const scaleDepth = spec.isGroupLevel ? 1 : undefined;

    // guess the direction which the user want
    if (this.direction === Direction.horizontal) {
      this.setMarkStyle(
        this._barBackgroundMark,
        {
          x: () => {
            const range = xScale.range();
            const min = Math.min(range[0], range[range.length - 1]);
            return min;
          },
          x1: () => {
            const range = xScale.range();
            const max = Math.max(range[0], range[range.length - 1]);
            return max;
          },
          y: (datum: Datum) => this._getPosition(this.direction, datum, scaleDepth, SeriesMarkNameEnum.barBackground),
          height: () => this._getBarWidth(this._yAxisHelper, scaleDepth)
        },
        'normal',
        AttributeLevel.Series
      );
    } else {
      this.setMarkStyle(
        this._barBackgroundMark,
        {
          x: (datum: Datum) => this._getPosition(this.direction, datum, scaleDepth, SeriesMarkNameEnum.barBackground),
          y: () => {
            const range = yScale.range();
            const min = Math.min(range[0], range[range.length - 1]);
            return min;
          },
          y1: () => {
            const range = yScale.range();
            const max = Math.max(range[0], range[range.length - 1]);
            return max;
          },
          width: () => {
            return this._getBarWidth(this._xAxisHelper, scaleDepth);
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
        this._barMark,
        {
          x: (datum: Datum) => valueInScaleRange(this.dataToPositionX(datum), xScale),
          x1: (datum: Datum) => valueInScaleRange(this.dataToPositionX1(datum), xScale),
          y: (datum: Datum, ctx, opt, dataView) => {
            if (this._shouldDoPreCalculate()) {
              this._calculateStackRectPosition(true);
              return datum[RECT_Y];
            }

            if (this._spec.barMinHeight) {
              return this._calculateRectPosition(datum, true);
            }

            return valueInScaleRange(this.dataToPositionY(datum), yScale);
          },
          y1: (datum: Datum) => {
            if (this._shouldDoPreCalculate()) {
              this._calculateStackRectPosition(true);
              return datum[RECT_Y1];
            }
            return valueInScaleRange(this.dataToPositionY1(datum), yScale);
          }
        },
        'normal',
        AttributeLevel.Series
      );
    } else {
      this.setMarkStyle(
        this._barMark,
        {
          x: (datum: Datum) => {
            if (this._shouldDoPreCalculate()) {
              this._calculateStackRectPosition(false);

              return datum[RECT_X];
            }

            if (this._spec.barMinHeight) {
              return this._calculateRectPosition(datum, false);
            }

            return valueInScaleRange(this.dataToPositionX(datum), xScale);
          },
          x1: (datum: Datum) => {
            if (this._shouldDoPreCalculate()) {
              this._calculateStackRectPosition(false);
              return datum[RECT_X1];
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
    const barAnimationParams: IBarAnimationParams = {
      yField: this._fieldY[0],
      xField: this._fieldX[0],
      direction: this.direction,
      growFrom: () =>
        this.direction === 'horizontal'
          ? this._xAxisHelper?.getScale(0).scale(0)
          : this._yAxisHelper?.getScale(0).scale(0)
    };
    const appearPreset = (this._spec.animationAppear as IStateAnimateSpec<BarAppearPreset>)?.preset;
    const animationParams = getGroupAnimationParams(this);

    this._barMark.setAnimationConfig(
      animationConfig(
        Factory.getAnimationInKey('bar')?.(barAnimationParams, appearPreset),
        userAnimationConfig(this._barMarkName, this._spec, this._markAttributeContext),
        animationParams
      )
    );
  }

  protected _getBarWidth(axisHelper: IAxisHelper, scaleDepth?: number) {
    const depthFromSpec = this._groups ? this._groups.fields.length : 1;
    const depth = isNil(scaleDepth) ? depthFromSpec : Math.min(depthFromSpec, scaleDepth);

    const bandWidth = axisHelper.getBandwidth?.(depth - 1) ?? DefaultBandWidth;
    const hasBarWidth = this._spec.barWidth !== undefined && depth === depthFromSpec;

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

  protected _getPosition(direction: DirectionType, datum: Datum, scaleDepth?: number, mark?: SeriesMarkNameEnum) {
    let axisHelper;
    let sizeAttribute;
    let dataToPosition;
    if (direction === Direction.horizontal) {
      axisHelper = this.getYAxisHelper();
      sizeAttribute = 'height';
      dataToPosition =
        mark === SeriesMarkNameEnum.barBackground
          ? this.dataToBarBackgroundPositionY.bind(this)
          : this.dataToPositionY.bind(this);
    } else {
      axisHelper = this.getXAxisHelper();
      sizeAttribute = 'width';
      dataToPosition =
        mark === SeriesMarkNameEnum.barBackground
          ? this.dataToBarBackgroundPositionX.bind(this)
          : this.dataToPositionX.bind(this);
    }
    const scale = axisHelper.getScale(0);

    const depthFromSpec = this._groups ? this._groups.fields.length : 1;
    const depth = isNil(scaleDepth) ? depthFromSpec : Math.min(depthFromSpec, scaleDepth);

    const bandWidth = axisHelper.getBandwidth?.(depth - 1) ?? DefaultBandWidth;
    const size = depth === depthFromSpec ? (this._barMark.getAttribute(sizeAttribute, datum) as number) : bandWidth;

    if (depth > 1 && isValid(this._spec.barGapInGroup)) {
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
    const pos = dataToPosition(datum, scaleDepth);

    return pos + (bandWidth - size) * 0.5 + (continuous ? -bandWidth / 2 : 0);
  }

  protected _barBackgroundPositionXEncoder?: (datum: Datum) => number;
  protected _getBarBackgroundPositionXEncoder = () => this._barBackgroundPositionXEncoder?.bind(this);
  protected _setBarBackgroundPositionXEncoder = (encoder: (datum: Datum) => number) => {
    this._barBackgroundPositionXEncoder = encoder.bind(this);
  };

  dataToBarBackgroundPositionX(datum: Datum, scaleDepth: number = 2): number {
    return this._dataToPosition(
      datum,
      this._xAxisHelper,
      this.fieldX,
      scaleDepth,
      this._getBarBackgroundPositionXEncoder,
      this._setBarBackgroundPositionXEncoder
    );
  }

  protected _barBackgroundPositionYEncoder?: (datum: Datum) => number;
  protected _getBarBackgroundPositionYEncoder = () => this._barBackgroundPositionYEncoder?.bind(this);
  protected _setBarBackgroundPositionYEncoder = (encoder: (datum: Datum) => number) => {
    this._barBackgroundPositionYEncoder = encoder.bind(this);
  };

  dataToBarBackgroundPositionY(datum: Datum, scaleDepth: number = 2): number {
    return this._dataToPosition(
      datum,
      this._yAxisHelper,
      this.fieldY,
      scaleDepth,
      this._getBarBackgroundPositionYEncoder,
      this._setBarBackgroundPositionYEncoder
    );
  }

  onLayoutEnd(ctx: any): void {
    super.onLayoutEnd(ctx);
    const region = this.getRegion();
    // @ts-ignore
    region._bar_series_position_calculated = false;
    if (this._spec.sampling) {
      this.compile();
    }
  }

  compile(): void {
    super.compile();

    if (this._spec.sampling) {
      const { width, height } = this._region.getLayoutRect();
      const samplingTrans = [];
      const fieldsY = this._fieldY;
      const fieldsX = this._fieldX;

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
  }

  getDefaultShapeType(): string {
    return 'square';
  }

  getActiveMarks(): IMark[] {
    return [this._barMark];
  }

  compileData() {
    super.compileData();
    this._barBackgroundViewData?.compile();
  }

  fillData() {
    super.fillData();
    this._barBackgroundViewData?.getDataView()?.reRunAllTransform();
  }

  viewDataUpdate(d: DataView): void {
    super.viewDataUpdate(d);
    this._barBackgroundViewData?.getDataView()?.reRunAllTransform();
    this._barBackgroundViewData?.updateData();
  }

  release() {
    super.release();
    this._barBackgroundViewData?.release();
    this._barBackgroundViewData = null;
  }
}

export const registerBarSeries = () => {
  registerSampleTransform();
  registerRectMark();
  registerBarAnimation();
  Factory.registerSeries(BarSeries.type, BarSeries);
};
