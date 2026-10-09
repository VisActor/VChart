import type { ViolinPlotSpec } from './types';
import { prepareKdeGroups } from '../../common/kde';
import type { KdeInputGroup } from '../../common/kde';
import { issue } from '../../common/validation';
import { StatPlotValidationError } from '../../errors';

interface ViolinGroupLabel {
  category: string;
  series?: string;
  __violinGroup: string;
}
export interface ViolinSummary {
  count: number;
  minimum: number;
  maximum: number;
  bandwidth: number;
  peakDensity: number;
}

/** 组合键只用于编译索引和图元分组；原始值保留重复权重和首次顺序。 */
export function prepareViolin(spec: ViolinPlotSpec) {
  const groups = new Map<string, KdeInputGroup<ViolinGroupLabel>>();
  spec.data.forEach((row, index) => {
    const key = JSON.stringify([row.category, row.series]);
    let group = groups.get(key);
    if (!group) {
      group = {
        label: {
          category: row.category,
          ...(row.series === undefined ? {} : { series: row.series }),
          __violinGroup: key
        },
        samples: [],
        firstIndex: index
      };
      groups.set(key, group);
    }
    group.samples.push(row.value);
  });
  return prepareKdeGroups(Array.from(groups.values()), spec);
}

/** 密度每组仅评估一次；归一化只改变绘制半宽，不改变 KDE 概率密度。 */
export function estimateViolin(prepared: ReturnType<typeof prepareViolin>, normalization: 'width' | 'area') {
  const summaries = new Map<string, ViolinSummary>();
  let largest = 0;
  const curves = prepared.groups.map(group => {
    const { model, grid, samples, label, minimum, maximum } = group;
    const densities = model.evaluate(grid);
    let peak = 0;
    let area = 0;
    for (let i = 0; i < grid.length; i++) {
      peak = Math.max(peak, densities[i]);
      if (i) {
        area += (grid[i] - grid[i - 1]) * (densities[i] / 2 + densities[i - 1] / 2);
      }
    }
    if (!(peak > 0) || !(area > 0) || !Number.isFinite(peak) || !Number.isFinite(area)) {
      throw new StatPlotValidationError([
        issue(
          'INVALID_RANGE',
          '/sampling/points',
          `分布 ${label.category}${
            label.series === undefined ? '' : ' · ' + label.series
          } 的采样密度无法形成有限正面积，请增加采样点或调整带宽`
        )
      ]);
    }
    const divisor = normalization === 'area' ? area : peak;
    const normalizedPeak = peak / divisor;
    if (!Number.isFinite(normalizedPeak)) {
      throw new StatPlotValidationError([
        issue('INVALID_RANGE', `/data/${group.firstIndex}/value`, '轮廓宽度尺度无法用有限数值表示，请转换单位')
      ]);
    }
    largest = Math.max(largest, normalizedPeak);
    summaries.set(label.__violinGroup, {
      count: samples.length,
      minimum,
      maximum,
      bandwidth: model.bandwidth,
      peakDensity: peak
    });
    return { label, grid, densities, divisor };
  });
  const values = curves.flatMap(({ label, grid, densities, divisor }) =>
    grid.map((value, i) => ({
      ...label,
      value,
      density: densities[i],
      __densityWidth: densities[i] / divisor / largest
    }))
  );
  return { values, summaries };
}
