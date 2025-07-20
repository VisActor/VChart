import { baseSeriesMark } from '@visactor/vchart';

export const CANDLESTICK_CHART_TYPE = 'candlestick';
export const CANDLESTICK_SERIES_TYPE = 'candlestick';

export const enum CandlestickMarkNameEnum {
  candlestick = 'candlestick'
}

export const CandlestickSeriesMark = {
  ...baseSeriesMark,
  [CandlestickMarkNameEnum.candlestick]: { name: CandlestickMarkNameEnum.candlestick, type: 'candlestick' }
};
