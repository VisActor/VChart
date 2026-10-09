import type { KdePlotRow, KdePlotSpec } from './types';
import { seriesGroups } from '../../common/validation';
import { prepareKdeGroups } from '../../common/kde';
import type { KdeGroup } from '../../common/kde';

export interface KdeCurveRow extends KdePlotRow {
  density: number;
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

/** 每系列按自身样本数归一化，采样点只用于绘制。 */
export function estimateKde(groups: KdeGroup<string | undefined>[]): KdeCurveRow[] {
  const rows: KdeCurveRow[] = [];
  for (const { label: series, model, grid } of groups) {
    const densities = model.evaluate(grid);
    const label = series === undefined ? {} : { series };
    for (let i = 0; i < grid.length; i++) {
      rows.push({ ...label, value: grid[i], density: densities[i] });
    }
  }
  return rows;
}
