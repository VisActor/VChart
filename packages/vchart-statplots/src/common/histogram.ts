export interface HistogramExtent {
  sampleSize: number;
  min: number;
  max: number;
}
export interface HistogramEdges {
  domain: [number, number];
  edges: number[];
}

/** null 表示 IEEE-754 无法表示有效的原生轴域，错误在公共编译边界报告。 */
export function histogramDomain(extent: HistogramExtent): [number, number] | null {
  let { min, max } = extent;
  if (extent.sampleSize && min === max) {
    const halfSpan = Math.max(1, Math.abs(min)) / 2;
    min -= halfSpan;
    max += halfSpan;
  }
  return Number.isFinite(min) && Number.isFinite(max) && max > min && Number.isFinite(max - min) ? [min, max] : null;
}

/** 所有组复用一份边界；自动算法合并舍入后重合的边界，显式箱数不降级。 */
export function makeHistogramEdges(extent: HistogramExtent, binCount?: number): HistogramEdges | null {
  const domain = histogramDomain(extent);
  if (!domain) {
    return null;
  }
  if (!extent.sampleSize) {
    return { domain, edges: [] };
  }
  const count = extent.min === extent.max ? 1 : binCount ?? Math.min(200, Math.ceil(Math.log2(extent.sampleSize) + 1));
  const [min, max] = domain;
  const span = max - min;
  const edges = [min];
  for (let i = 1; i <= count; i++) {
    const edge = i === count ? max : min + span * (i / count);
    if (edge > edges[edges.length - 1]) {
      edges.push(edge);
    } else if (binCount !== undefined) {
      return null;
    }
  }
  return { domain, edges };
}

/** 有效边界覆盖 value；共享区间只计数一次。 */
export function histogramBinIndex(value: number, edges: readonly number[]): number {
  // upper-bound：内部边界归右箱；最大值归最后一箱。
  let lo = 1,
    hi = edges.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (value < edges[mid]) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  return lo - 1;
}
