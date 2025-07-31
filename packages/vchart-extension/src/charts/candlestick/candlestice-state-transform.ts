import type { Datum } from '@visactor/vchart';
import type { DataView } from '@visactor/vdataset';
import { VCHART_CANDLESTICK_STATE } from './constants';

export interface ICandlestickStateTransformOption {
  getState: (d: Datum) => string;
}

export const candlestickStateTransform = (data: Array<DataView>, option: ICandlestickStateTransformOption) => {
  if (!data) {
    return [];
  }
  const getState = option.getState;
  data.forEach((d: Datum) => {
    d[VCHART_CANDLESTICK_STATE] = getState(d);
  });
  return data;
};
