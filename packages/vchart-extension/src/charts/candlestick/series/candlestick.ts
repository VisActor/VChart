import { registerCandlestickMark, ICandlestickMark } from '../mark/candlestick';
import {
  registerSymbolMark,
  registerScaleInOutAnimation,
  registerCartesianBandAxis,
  registerCartesianLinearAxis,
  CartesianSeries,
  IMark,
  Factory
} from '@visactor/vchart';
import type { ICandlestickSeriesSpec } from './interface';

export const CANDLESTICK_SERIES_TYPE = 'candlestick';

export class CandlestickSeries<T extends ICandlestickSeriesSpec = ICandlestickSeriesSpec> extends CartesianSeries<T> {
  static readonly type: string = CANDLESTICK_SERIES_TYPE;
  type = CANDLESTICK_SERIES_TYPE;

  private _candlestickMark: ICandlestickMark;
  initMark() {
    this._candlestickMark = this._createMark(
      { type: CANDLESTICK_SERIES_TYPE, name: CANDLESTICK_SERIES_TYPE },
      {
        groupKey: this._seriesField,
        isSeriesMark: true
      }
    ) as ICandlestickMark;
  }
  initMarkStyle() {
    const candlestickMark = this._candlestickMark;
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
