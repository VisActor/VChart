import type { DataView } from '@visactor/vdataset';
import type { StatisticOperations } from '../data/transforms/dimension-statistics';
import type { ISeries, ISeriesStackDataMeta } from '../series/interface';
export declare function mergeFields(
  targetFields: {
    key: string;
    operations: StatisticOperations;
  }[],
  mergeFields: {
    key: string;
    operations: StatisticOperations;
  }[]
): {
  key: string;
  operations: StatisticOperations;
}[];
export declare function getFieldAlias(dataView: DataView, field: string): any;
export interface IStackCacheNode {
  values: any[];
  series: {
    s: ISeries;
    values: any[];
  }[];
  nodes: {
    [key: string]: IStackCacheNode;
  };
}
export interface IStackCacheRoot {
  nodes: {
    [key: string]: IStackCacheNode;
  };
}
export declare function getRegionStackGroup(
  region: {
    getSeries: () => any[];
  },
  setInitialValue: boolean,
  filter?: (s: any) => boolean
): {
  [key: string]: IStackCacheRoot;
};
export declare function stackTotal(stackData: IStackCacheNode, valueField: string): void;
export declare function stackOffsetSilhouette(stackCache: IStackCacheNode): void;
export declare function stack(stackCache: IStackCacheNode, stackInverse: boolean, hasPercent?: boolean): void;
export declare function stackGroup(
  s: ISeries,
  stackData: ISeriesStackDataMeta,
  stackCache: IStackCacheNode,
  valueField: string,
  setInitialValue: boolean
): void;
