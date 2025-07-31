import type { ICandlestickChartSpecBase, ICandlestickSeriesSpecBase } from './interface';
import type { Datum, IMark, IModelInitOption } from '@visactor/vchart';
import {
  VChart,
  registerMarkFilterTransform,
  BaseChart,
  getCartesianDimensionInfo,
  getDimensionInfoByValue,
  getCartesianCrosshairRect,
  registerCartesianBandAxis,
  registerCartesianLinearAxis,
  STATE_VALUE_ENUM,
  AttributeLevel,
  Direction,
  valueInScaleRange,
  CartesianSeries,
  registerDataSetInstanceTransform
} from '@visactor/vchart';
import { CandlestickChartSpecTransformer } from './candlestick-transform';
import { CandlestickMark } from './candlestick-mark';
import { registerCandlestickMark } from './candlestick-mark';
import { CandlestickSeriesTooltipHelper } from './candlestick-tooltip-helper';
import { CANDLESTICK_STYLE_LIST, VCHART_CANDLESTICK_STATE } from './constants';
import { candlestickStateTransform } from './candlestice-state-transform';

/**
 * 蜡烛图图表类
 * 继承自基础图表，实现蜡烛图的核心功能
 */
export class CandlestickChart<T extends ICandlestickChartSpecBase = ICandlestickChartSpecBase> extends BaseChart<T> {
  static readonly type: string = 'candlestick';
  static readonly seriesType: string = 'candlestick';
  static readonly transformerConstructor = CandlestickChartSpecTransformer;
  readonly transformerConstructor = CandlestickChartSpecTransformer;
  readonly type: string = 'candlestick';
  readonly seriesType: string = 'candlestick';

  protected _setModelOption() {
    this._modelOption.getDimensionInfo = getCartesianDimensionInfo;
    this._modelOption.getDimensionInfoByValue = getDimensionInfoByValue;
    this._modelOption.getRectByDimensionData = getCartesianCrosshairRect;
  }
}

/**
 * 蜡烛图系列类
 * 处理蜡烛图数据、样式和标记的核心逻辑
 */
export class CandlestickSeries extends CartesianSeries<ICandlestickSeriesSpecBase> {
  static readonly type: string = 'candlestick';
  // @ts-ignore
  type: string = 'candlestick';

  private _candlestickMark?: CandlestickMark;

  protected _highField?: string;
  /** 获取最高价数据字段 */
  get highField() {
    return this._highField;
  }
  protected _lowField?: string;
  get lowField() {
    return this._lowField;
  }
  protected _openField?: string;
  get openField() {
    return this._openField;
  }
  protected _closeField?: string;
  get closeField() {
    return this._closeField;
  }

  init(option: IModelInitOption): void {
    super.init(option);
    //init在axis初始化之后才被执行，此时axisHelper不为空
    this.initCandlestickMarkStyle();
  }

  /**
   * @override
   */
  setAttrFromSpec() {
    super.setAttrFromSpec();
    this._highField = this._spec.highField;
    this._lowField = this._spec.lowField;
    this._openField = this._spec.openField;
    this._closeField = this._spec.closeField;

    if (this.direction === Direction.horizontal) {
      this._fieldX = [this._spec.highField, this._spec.lowField];
    } else {
      this._fieldY = [this._spec.highField, this._spec.lowField];
    }
  }

  /**
   * 初始化标记
   * 创建蜡烛图的主标记对象
   */
  initMark() {
    this._candlestickMark = this._createMark(
      { name: 'candlestick', type: CandlestickMark.type },
      { groupKey: this._seriesField, isSeriesMark: true }
    ) as CandlestickMark;
  }

  /**
   * 计算数据点状态
   * 根据开盘价和收盘价比较结果返回'up'|'down'|'noChange'
   * @param datum 数据点
   * @returns 状态字符串
   */
  datumState = (datum: Datum) => {
    if (datum[this._openField] - datum[this._closeField] > 0) {
      return 'up';
    }
    if (datum[this._openField] - datum[this._closeField] < 0) {
      return 'down';
    }
    return 'noChange';
  };

  initMarkStyle() {
    if (!this._candlestickMark) {
      return;
    }
    this._candlestickMark.setGlyphConfig({
      direction: this._direction
    });
    const commonCandlestickStyles = {};

    const candlestickMarkStyles: Record<string, (datum: Datum, key: string) => any> = {
      x: this.dataToPositionX.bind(this),
      y: this.dataToPositionY.bind(this),
      ...commonCandlestickStyles
    };
    CANDLESTICK_STYLE_LIST.forEach(key => {
      candlestickMarkStyles[key] = (datum: Datum) => this.datumStyle(datum, key);
    });
    this.setMarkStyle(
      this._candlestickMark,
      candlestickMarkStyles,
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );
  }

  stateStyle(state: string) {
    switch (state) {
      case 'up':
        return this._spec.upStyle ?? {};
      case 'down':
        return this._spec.downStyle ?? {};
      case 'noChange':
        return this._spec.noChangeStyle ?? {};
      default:
        return {};
    }
  }

  datumStyle = (datum: Datum, key: string) => this.stateStyle(datum[VCHART_CANDLESTICK_STATE])[key];

  initCandlestickMarkStyle() {
    if (!this._candlestickMark) {
      return;
    }
    const axisHelper = this._direction === Direction.horizontal ? this._xAxisHelper : this._yAxisHelper;
    const bandHelper = this._direction === Direction.vertical ? this._xAxisHelper : this._yAxisHelper;
    if (!axisHelper) {
      return;
    }

    const { dataToPosition } = axisHelper;
    const scale = axisHelper?.getScale?.(0);
    this.setMarkStyle(
      this._candlestickMark,
      {
        low: (datum: Datum) =>
          valueInScaleRange(
            dataToPosition(this.getDatumPositionValues(datum, this._lowField), {
              bandPosition: this._bandPosition
            }),
            scale
          ),
        open: (datum: Datum) =>
          valueInScaleRange(
            dataToPosition(this.getDatumPositionValues(datum, this._openField), {
              bandPosition: this._bandPosition
            }),
            scale
          ),
        close: (datum: Datum) =>
          valueInScaleRange(
            dataToPosition(this.getDatumPositionValues(datum, this._closeField), {
              bandPosition: this._bandPosition
            }),
            scale
          ),
        high: (datum: Datum) =>
          valueInScaleRange(
            dataToPosition(this.getDatumPositionValues(datum, this._highField), {
              bandPosition: this._bandPosition
            }),
            scale
          ),
        bodySize: () => bandHelper.getBandwidth(0)
      },
      STATE_VALUE_ENUM.STATE_NORMAL,
      AttributeLevel.Series
    );
  }

  initData() {
    super.initData();
    registerDataSetInstanceTransform(this._dataSet, 'candlestickStateTransform', candlestickStateTransform);
    this._data.getDataView().transform({
      type: 'candlestickStateTransform',
      options: {
        getState: this.datumState
      }
    });
  }

  protected initTooltip() {
    this._tooltipHelper = new CandlestickSeriesTooltipHelper(this);
    this._candlestickMark && this._tooltipHelper.activeTriggerSet.mark.add(this._candlestickMark);
  }

  getActiveMarks(): IMark[] {
    return [this._candlestickMark];
  }
}

export const registerCandlestickChart = (option?: { VChart?: typeof VChart }) => {
  registerMarkFilterTransform();
  registerCandlestickMark();
  registerCartesianBandAxis();
  registerCartesianLinearAxis();

  const vchartConstructor = option?.VChart || VChart;
  if (vchartConstructor) {
    vchartConstructor.useChart([CandlestickChart]);
    vchartConstructor.useSeries([CandlestickSeries]);
  }
};
