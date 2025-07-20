import { registerCandlestickMark, ICandlestickMark } from '../mark/candlestick';
import {
  registerSymbolMark,
  registerScaleInOutAnimation,
  registerCartesianBandAxis,
  registerCartesianLinearAxis,
  CartesianSeries,
  IMark,
  Factory,
  STATE_VALUE_ENUM,
  AttributeLevel,
  Datum,
  IModelInitOption
} from '@visactor/vchart';
import { valueInScaleRange } from '@visactor/vchart/src/util';
import type { ICandlestickSeriesSpec } from './interface';
import { CANDLESTICK_SERIES_TYPE, CandlestickSeriesMark } from './constant';

const DEFAULT_STROKE_WIDTH = 2;
export const DEFAULT_FILL_COLOR = '#FFF';
export const DEFAULT_STROKE_COLOR = '#000';

export class CandlestickSeries<T extends ICandlestickSeriesSpec = ICandlestickSeriesSpec> extends CartesianSeries<T> {
  static readonly type: string = CANDLESTICK_SERIES_TYPE;
  type = CANDLESTICK_SERIES_TYPE;

  static readonly mark = CandlestickSeriesMark;
  protected _openField: string;
  getOpenField(): string {
    return this._openField;
  }
  protected _highField: string;
  getHighField(): string {
    return this._highField;
  }
  protected _lowField: string;
  getLowField(): string {
    return this._lowField;
  }
  protected _closeField: string;
  getCloseField(): string {
    return this._closeField;
  }
  protected _lineWidth: number;
  protected _boxWidth: number;
  protected _boxFill: string | ((datum: Datum) => string);

  setAttrFromSpec() {
    super.setAttrFromSpec();
    const spec = this._spec;
    const CandlestickStyle: any = spec.candlestick?.style ?? {};
    this._openField = spec.openField || 'open';
    this._highField = spec.highField || 'high';
    this._lowField = spec.lowField || 'low';
    this._closeField = spec.closeField || 'close';
    this._lineWidth = CandlestickStyle.lineWidth ?? DEFAULT_STROKE_WIDTH;
    this._boxWidth = CandlestickStyle.boxWidth ?? 10;
    this._boxFill = CandlestickStyle.boxFill ?? DEFAULT_FILL_COLOR;
  }

  private _candlestickMark?: ICandlestickMark;

  initMark() {
    this._candlestickMark = this._createMark(CandlestickSeries.mark.candlestick, {
      groupKey: this._seriesField,
      isSeriesMark: true
    }) as ICandlestickMark;
  }

  initMarkStyle() {
    const candlestickMark = this._candlestickMark;
    if (candlestickMark) {
      const commonCandlestickStyles = {
        lineWidth: this._lineWidth,
        boxWidth: this._boxWidth,
        fill: this._boxFill,
        stroke: DEFAULT_STROKE_COLOR
      };
      this.setMarkStyle(candlestickMark, commonCandlestickStyles, STATE_VALUE_ENUM.STATE_NORMAL, AttributeLevel.Series);
    }
  }

  initCandlestickMarkStyle() {
    const candlestickMark = this._candlestickMark;
    const axisHelper = this._yAxisHelper;
    if (candlestickMark && axisHelper) {
      const { dataToPosition } = axisHelper;
      const scale = axisHelper?.getScale?.(0);
      this.setMarkStyle(
        candlestickMark,
        {
          boxWidth: this._boxWidth,
          open: (datum: Datum) =>
            valueInScaleRange(
              dataToPosition(this.getDatumPositionValues(datum, this._openField), {
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
          low: (datum: Datum) =>
            valueInScaleRange(
              dataToPosition(this.getDatumPositionValues(datum, this._lowField), {
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
            )
        },
        STATE_VALUE_ENUM.STATE_NORMAL,
        AttributeLevel.Series
      );
    }
  }

  init(option: IModelInitOption): void {
    super.init(option);
    //init在axis初始化之后才被执行，此时axisHelper不为空
    this.initCandlestickMarkStyle();
  }

  getActiveMarks(): IMark[] {
    return [this._candlestickMark];
  }
}

export const registerCandlestickSeries = () => {
  registerCandlestickMark();
  registerSymbolMark();
  registerScaleInOutAnimation();
  registerCartesianBandAxis();
  registerCartesianLinearAxis();
  //registerCandlestickScaleAnimation();
  Factory.registerSeries(CandlestickSeries.type, CandlestickSeries);
};
