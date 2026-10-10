import type { KdePlotRow, KdePlotSpec } from './types';
import { seriesGroups } from '../../common/validation';
import { prepareKdeGroups } from '../../common/kde';
import type { KdeGroup } from '../../common/kde';

export interface KdeCurveRow extends KdePlotRow {
  density: number;
  sampleCount: number;
  bandwidth: number;
  normalizationScope: 'all' | 'series';
}

export function prepareKde(spec: KdePlotSpec) {
  return prepareKdeGroups(
    Array.from(seriesGroups(spec.data), ([series, group]) => ({
      label: series,
      samples: group.map(({ row }) => row.value),
      firstIndex: group[0].index
    })),
    spec
  );
}

/** 先估计各系列 PDF；all 按样本占比缩放，series 保留各自 PDF。采样点只用于绘制。 */
export function estimateKde(groups: KdeGroup<string | undefined>[], scope: 'all' | 'series' = 'all'): KdeCurveRow[] {
  const rows: KdeCurveRow[] = [];
  const total = groups.reduce((n, group) => n + group.samples.length, 0);
  for (const { label: series, model, grid, samples } of groups) {
    const densities = model.evaluate(grid);
    const label = series === undefined ? {} : { series };
    for (let i = 0; i < grid.length; i++) {
      rows.push({
        ...label,
        value: grid[i],
        density: densities[i] * (scope === 'all' ? samples.length / total : 1),
        sampleCount: samples.length,
        bandwidth: model.bandwidth,
        normalizationScope: scope
      });
    }
  }
  return rows;
}
