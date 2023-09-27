import type { DataView } from '@visactor/vdataset';
import type { DataInfo } from '../../data/interface';
import type { IChartTemp } from '../interface';
export abstract class BaseTemp implements IChartTemp {
  type: string;
  abstract getSpec(data: DataView, info: DataInfo, opt?: any): any;
  abstract checkDataEnable(data: DataView, info: DataInfo, opt?: any): boolean;
  clear() {
    // do nothing
  }
}
