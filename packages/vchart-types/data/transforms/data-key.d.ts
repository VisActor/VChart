import type { BaseSeries } from '../../series/base/base-series';
import type { TreemapSeries } from '../../series/treemap/treemap';
import type { AddVChartPropertyContext } from './add-property';
import type { SunburstSeries } from '../../series/sunburst/sunburst';
import type { CirclePackingSeries } from '../../series/circle-packing/circle-packing';
export declare const initKeyMap: () => {
  keyMap: Map<any, any>;
};
export declare function addDataKey(this: BaseSeries<any>, d: any, i: number, context: AddVChartPropertyContext): void;
export declare function addHierarchyDataKey(
  this: TreemapSeries | SunburstSeries | CirclePackingSeries,
  d: any,
  i: number,
  context: AddVChartPropertyContext,
  depth?: number,
  root?: string,
  rootIndex?: number
): void;
