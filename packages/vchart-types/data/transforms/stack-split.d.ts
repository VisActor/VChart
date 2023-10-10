import type { ISeriesStackDataNode } from '../../series/interface';
import type { DataView } from '@visactor/vdataset';
export interface IStackOption {
  fields: string[];
}
export declare const stackSplit: (data: Array<DataView>, op: IStackOption) => ISeriesStackDataNode;
