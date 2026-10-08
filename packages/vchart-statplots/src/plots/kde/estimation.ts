import { kde, gaussian, epanechnikov } from '@visactor/vutils';
import type { KDEEvaluator } from '@visactor/vutils';
import type { KdePlotRow, KdePlotSpec } from './types';
import type { StatPlotIssue } from '../../common/types';
import { issue, seriesGroups } from '../../common/validation';

export interface KdeCurveRow extends KdePlotRow {
  density: number;
}
interface KdeGroup {
  series?: string;
  model: KDEEvaluator;
  grid: number[];
}

/** 仅创建模型和网格；边界校验不执行 O(N × points) 的密度计算。 */
export function prepareKde(spec: KdePlotSpec): {
  groups: KdeGroup[];
  domain: [number, number];
  errors: StatPlotIssue[];
} {
  const groups: KdeGroup[] = [];
  const errors: StatPlotIssue[] = [];
  const bandwidth = spec.estimation?.bandwidth ?? 'scott';
  if (typeof bandwidth === 'number' && bandwidth <= 0) {
    return { groups, domain: [-0.5, 0.5], errors: [issue('INVALID_RANGE', '/estimation/bandwidth', '带宽必须大于 0')] };
  }
  const kernel = spec.estimation?.kernel === 'epanechnikov' ? epanechnikov : gaussian;
  const cut = spec.estimation?.kernel === 'epanechnikov' ? 1 : 3;
  const count = spec.sampling?.points ?? 256;
  let left = Infinity,
    right = -Infinity;
  for (const [series, group] of seriesGroups(spec.data)) {
    const samples = group.map(({ row }) => row.value);
    const model = kde(samples, {
      kernel,
      ...(typeof bandwidth === 'number' ? { bandwidth } : { bandwidthMethod: bandwidth })
    });
    const h = model.bandwidth;
    const path = `/data/${group[0].index}/value`;
    if (h === 0) {
      errors.push(issue('INVALID_RANGE', path, '无法自动估计正带宽，请显式提供 estimation.bandwidth'));
      continue;
    }
    let min = Infinity,
      max = -Infinity;
    for (const value of samples) {
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
    min -= cut * h;
    max += cut * h;
    const span = max - min;
    const scale = 1 / (samples.length * h);
    if (
      !Number.isFinite(h) ||
      !Number.isFinite(min) ||
      !Number.isFinite(max) ||
      !(span > 0) ||
      !Number.isFinite(span) ||
      !(scale > 0) ||
      !Number.isFinite(1 / h)
    ) {
      errors.push(issue('INVALID_RANGE', path, '带宽、密度尺度或绘制范围无法用有限数值表示，请先转换单位或平移数值'));
      continue;
    }
    const grid: number[] = [];
    for (let i = 0; i < count; i++) {
      const position = i === count - 1 ? max : min + span * (i / (count - 1));
      if (i && position <= grid[i - 1]) {
        errors.push(issue('INVALID_RANGE', '/sampling/points', '无法表示指定数量的不同采样位置，请减少点数或转换单位'));
        break;
      }
      grid.push(position);
    }
    groups.push({ series, model, grid });
    left = Math.min(left, min);
    right = Math.max(right, max);
  }
  if (groups.length && !Number.isFinite(right - left)) {
    errors.push(issue('INVALID_RANGE', '/data', '各系列共享轴域无法用有限数值表示，请先转换单位或平移数值'));
  }
  return { groups, domain: groups.length ? [left, right] : [-0.5, 0.5], errors };
}

/** 每系列按自身样本数归一化，采样点只用于绘制。 */
export function estimateKde(groups: KdeGroup[]): KdeCurveRow[] {
  const rows: KdeCurveRow[] = [];
  for (const { series, model, grid } of groups) {
    const densities = model.evaluate(grid);
    const label = series === undefined ? {} : { series };
    for (let i = 0; i < grid.length; i++) {
      rows.push({ ...label, value: grid[i], density: densities[i] });
    }
  }
  return rows;
}
