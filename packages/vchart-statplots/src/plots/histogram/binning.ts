import { makeHistogramEdges, histogramBinIndex } from '../../common/histogram';
import type { HistogramEdges, HistogramExtent } from '../../common/histogram';
import type { HistogramRow } from './types';

export interface HistogramBin {
  binStart: number;
  binEnd: number;
  count: number;
}
export interface HistogramResult extends HistogramEdges {
  sampleSize: number;
  bins: HistogramBin[];
}

export function collectHistogramExtent(data: readonly HistogramRow[]): HistogramExtent {
  let min = Infinity,
    max = -Infinity;
  for (const row of data) {
    min = Math.min(min, row.value);
    max = Math.max(max, row.value);
  }
  return { sampleSize: data.length, min: data.length ? min : 0, max: data.length ? max : 1 };
}

/** 公共边界已校验数值空间；只按箱分配，不复制或排序原始样本。 */
export function binHistogram(data: readonly HistogramRow[], binCount?: number): HistogramResult {
  const { domain, edges } = makeHistogramEdges(collectHistogramExtent(data), binCount)!;
  const bins: HistogramBin[] = edges.slice(1).map((binEnd, i) => ({ binStart: edges[i], binEnd, count: 0 }));
  for (const row of data) {
    bins[histogramBinIndex(row.value, edges)].count++;
  }
  return { domain, edges, sampleSize: data.length, bins };
}
