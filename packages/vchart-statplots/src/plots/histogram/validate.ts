import type { HistogramSpec } from './types';
import type { StatPlotIssue } from '../../common/types';
import { issue } from '../../common/validation';
import { histogramDomain, makeHistogramEdges } from '../../common/histogram';
import { collectHistogramExtent } from './binning';

export function validateHistogram(spec: HistogramSpec): StatPlotIssue[] {
  const extent = collectHistogramExtent(spec.data);
  if (!histogramDomain(extent)) {
    return [issue('INVALID_RANGE', '/data', '轴域无法用有限数值表示，请先转换单位或平移数值')];
  }
  const space = makeHistogramEdges(extent, spec.binning?.binCount);
  if (!space) {
    return [issue('INVALID_RANGE', '/binning/binCount', '无法表示指定箱数的不同边界，请减少箱数或转换单位')];
  }
  if (spec.statistic === 'density') {
    for (let i = 1; i < space.edges.length; i++) {
      if (!Number.isFinite(1 / (space.edges[i] - space.edges[i - 1]))) {
        return [issue('INVALID_RANGE', '/data', '箱宽无法表示有限概率密度，请先转换数值单位')];
      }
    }
  }
  return [];
}
