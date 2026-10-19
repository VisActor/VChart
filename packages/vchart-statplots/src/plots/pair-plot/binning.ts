import type { PairPlotObservation } from './types';
import {
  histogramDomain as pairDomain,
  makeHistogramEdges as makePairEdges,
  histogramBinIndex
} from '../../common/histogram';
export { pairDomain, makePairEdges };

export interface PairVariableExtent {
  variable: string;
  sampleSize: number;
  min: number;
  max: number;
}
export interface PairHistogramBin {
  binStart: number;
  binEnd: number;
  count: number;
  series?: string;
}
export interface PairVariableDistribution {
  variable: string;
  domain: [number, number];
  sampleSize: number;
  bins: PairHistogramBin[];
}
export type { HistogramEdges as PairVariableEdges } from '../../common/histogram';

/** 每个变量独立排除 null，不创建 complete-case 观测副本。 */
export function collectPairExtents(
  observations: readonly PairPlotObservation[],
  variables: readonly string[]
): PairVariableExtent[] {
  return variables.map(variable => {
    let min = Infinity,
      max = -Infinity,
      sampleSize = 0;
    for (const row of observations) {
      const value = row.values[variable];
      if (value !== null) {
        min = Math.min(min, value);
        max = Math.max(max, value);
        sampleSize++;
      }
    }
    return { variable, sampleSize, min: sampleSize ? min : 0, max: sampleSize ? max : 1 };
  });
}

export function preparePairDistributions(
  observations: readonly PairPlotObservation[],
  variables: readonly string[],
  diagonal: { enabled: boolean; binCount?: number }
): PairVariableDistribution[] {
  return collectPairExtents(observations, variables).map(extent => {
    const space = diagonal.enabled
      ? makePairEdges(extent, diagonal.binCount)!
      : { domain: pairDomain(extent)!, edges: [] };
    const bins: PairHistogramBin[] = [];
    const counts = new Map<string | undefined, number[]>();
    const { edges } = space;
    if (edges.length) {
      for (const row of observations) {
        const value = row.values[extent.variable];
        if (value === null) {
          continue;
        }
        let group = counts.get(row.series);
        if (!group) {
          group = new Array(edges.length - 1).fill(0);
          counts.set(row.series, group);
        }
        group[histogramBinIndex(value, edges)]++;
      }
      counts.forEach((group, series) => {
        group.forEach((count, i) => {
          const bin: PairHistogramBin = { binStart: edges[i], binEnd: edges[i + 1], count };
          if (series !== undefined) {
            bin.series = series;
          }
          bins.push(bin);
        });
      });
    }
    return { variable: extent.variable, domain: space.domain, sampleSize: extent.sampleSize, bins };
  });
}
