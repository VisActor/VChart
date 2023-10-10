import type { DataView } from '@visactor/vdataset';
import type { IWaterfallSeriesSpec } from '../../series/waterfall/interface';
import type { Datum } from '../../typings';
export interface IWaterfallOpt {
  indexField: string;
  valueField: string;
  seriesField?: string;
  startAs: string;
  endAs: string;
  total: IWaterfallSeriesSpec['total'];
  seriesFieldName: {
    total: string;
    increase: string;
    decrease: string;
  };
  groupData: () => DataView;
}
export declare const waterfall: (lastData: Array<Datum>, op: IWaterfallOpt) => Datum[];
export interface IWaterfallFillEndOpt {
  indexField: string;
  valueField: string;
  seriesField?: string;
  total: IWaterfallSeriesSpec['total'];
}
export declare const waterfallFillTotal: (data: Array<Datum>, op: IWaterfallFillEndOpt) => Datum[];
