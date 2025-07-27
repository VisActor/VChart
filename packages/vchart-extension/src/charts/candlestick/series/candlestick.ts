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
import { valueInScaleRange } from '@visactor/vchart';
import { IGlyphMark } from '@visactor/vchart';
import type { ICandlestickSeriesSpec } from './interface';
import { CANDLESTICK_SERIES_TYPE, CandlestickSeriesMark } from './constant';

const DEFAULT_STROKE_WIDTH = 2;
export const DEFAULT_STROKE_COLOR = '#000';
export const DEFAULT_RISE_COLOR = '#FF0000';
export const DEFAULT_FALL_COLOR = '#00AA00';

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
  protected _boxFillColor: string | ((datum: Datum) => string);
  getBoxFillColor(): string | ((datum: Datum) => string) {
    return this._boxFillColor;
  }
  protected _strokeColor: string;
  getStrokeColor(): string {
    return this._strokeColor;
  }
  protected _riseColor: string;
  getRiseColor(): string {
    return this._riseColor;
  }
  protected _fallColor: string;
  getFallColor(): string {
    return this._fallColor;
  }
  private _autoBoxWidth: number;

  setAttrFromSpec() {
    super.setAttrFromSpec();
    const spec = this._spec;
    const CandlestickStyle: any = spec.candlestick?.style ?? {};
    this._openField = spec.openField;
    this._highField = spec.highField;
    this._lowField = spec.lowField;
    this._closeField = spec.closeField;
    this._riseColor = spec.candlestickColor.rising ?? DEFAULT_RISE_COLOR;
    this._fallColor = spec.candlestickColor.falling ?? DEFAULT_FALL_COLOR;
    this._lineWidth = CandlestickStyle.lineWidth ?? DEFAULT_STROKE_WIDTH;
    this._boxWidth = CandlestickStyle.boxWidth;
    this._boxFillColor = CandlestickStyle.boxFill;
    this._strokeColor = CandlestickStyle.strokeColor;
  }

  private _candlestickMark?: ICandlestickMark;

  initMark(): void {
    this._candlestickMark = this._createMark(CandlestickSeries.mark.candlestick, {
      groupKey: this._seriesField,
      isSeriesMark: true
    }) as ICandlestickMark;
  }

  initMarkStyle(): void {
    const candlestickMark = this._candlestickMark;
    if (candlestickMark) {
      const CandlestickStyles = {
        boxWidth: this._boxWidth,
        fill: this._boxFillColor ?? this.getCandlestickColorAttribute.bind(this),
        stroke: this._strokeColor ?? this.getCandlestickColorAttribute.bind(this),
        x: this.dataToPositionX.bind(this)
      };
      (candlestickMark as IGlyphMark).setGlyphConfig({});
      this.setMarkStyle(candlestickMark, CandlestickStyles, STATE_VALUE_ENUM.STATE_NORMAL, AttributeLevel.Series);
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

  getCandlestickColorAttribute(datum: Datum): string {
    const open = this.getDatumPositionValues(datum, this._openField);
    const close = this.getDatumPositionValues(datum, this._closeField);
    if (open < close) {
      return this._riseColor;
    } else if (open > close) {
      return this._fallColor;
    }
    return this._strokeColor ?? DEFAULT_STROKE_COLOR;
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
