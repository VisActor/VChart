import { DEFAULT_DATA_INDEX, DEFAULT_DATA_KEY, DEFAULT_DATA_SERIES_FIELD } from '../../constant';
import type { BaseSeries } from '../../series/base/base-series';
import type { TreemapSeries } from '../../series/treemap/treemap';
import type { AddVChartPropertyContext } from './add-property';
import {
  DEFAULT_HIERARCHY_DEPTH,
  DEFAULT_HIERARCHY_ROOT,
  DEFAULT_HIERARCHY_ROOT_INDEX
} from '../../constant/hierarchy';
import type { SunburstSeries } from '../../series/sunburst/sunburst';
import type { CirclePackingSeries } from '../../series/circle-packing/circle-packing';

export const initKeyMap = () => {
  return { keyMap: new Map() };
};

export function addDataKey(this: BaseSeries<any>, d: any, i: number, context: AddVChartPropertyContext) {
  if (!d) {
    return;
  }
  if (!this._seriesField) {
    d[DEFAULT_DATA_SERIES_FIELD] = this.getSeriesKeys()[0];
  }
  d[DEFAULT_DATA_INDEX] = i;
  d[DEFAULT_DATA_KEY] = this.generateDefaultDataKey(this._spec.dataKey, d, i, context);
}

export function addHierarchyDataKey(
  this: TreemapSeries | SunburstSeries | CirclePackingSeries,
  d: any,
  i: number,
  context: AddVChartPropertyContext,
  depth: number = 0,
  root?: string,
  rootIndex?: number
) {
  if (rootIndex === undefined) {
    rootIndex = i;
  }
  addDataKey.bind(this)(d, i, context);
  d[DEFAULT_HIERARCHY_DEPTH] = depth;
  d[DEFAULT_HIERARCHY_ROOT] = root || d[this.getCategoryField()];
  d[DEFAULT_HIERARCHY_ROOT_INDEX] = rootIndex;
  if (d.children && d.children.length) {
    d.children.forEach((_d: any, _i: number) =>
      addHierarchyDataKey.bind(this)(
        _d,
        _i,
        context,
        d[DEFAULT_HIERARCHY_DEPTH] + 1,
        d[DEFAULT_HIERARCHY_ROOT],
        rootIndex
      )
    );
  }
}
