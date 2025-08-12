import type { ICandlestickSeriesTheme } from '../series/interface';

export const getCandlestickTheme = (is3d?: boolean): ICandlestickSeriesTheme => {
  const res: ICandlestickSeriesTheme = {
    rising: {
      style: {
        boxFill: '#FF0000',
        stroke: '#FF0000'
      }
    },
    falling: {
      style: {
        boxFill: '#00AA00',
        stroke: '#00AA00'
      }
    },
    doji: {
      style: {
        boxFill: '#0000FF',
        stroke: '#0000FF'
      }
    }
  };
  return res;
};

export const candlestick: ICandlestickSeriesTheme = getCandlestickTheme();
