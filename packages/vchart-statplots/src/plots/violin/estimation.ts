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
  return prepareKdeGroups(Array.from(groups.values()), spec, 2);
}

/** 密度每组仅评估一次；归一化只改变绘制半宽，不改变 KDE 概率密度。 */
export function estimateViolin(
  prepared: ReturnType<typeof prepareViolin>,
  normalization: 'width' | 'area' | 'count',
  scope: 'all' | 'series' = 'series'
) {
  const summaries = new Map<string, ViolinSummary>();
  const scales = new Map<string | undefined, { peak: number; count: number }>();
  const curves = prepared.groups.map(group => {
    const { model, grid, samples, label, minimum, maximum } = group;
    const densities = model.evaluate(grid);
    let peak = 0;
    for (const density of densities) peak = Math.max(peak, density);
    if (!(peak > 0) || !Number.isFinite(peak)) {
      throw new StatPlotValidationError([
        issue(
          'INVALID_RANGE',
          '/sampling/points',
          `分布 ${label.category} 的采样密度无法形成有限正峰值，请增加采样点或调整带宽`
        )
      ]);
    }
    const key = scope === 'all' ? undefined : label.series;
    const scale = scales.get(key) ?? { peak: 0, count: 0 };
    scale.peak = Math.max(scale.peak, peak);
    scale.count = Math.max(scale.count, samples.length);
    scales.set(key, scale);
    summaries.set(label.__violinGroup, {
      count: samples.length,
      minimum,
      maximum,
      bandwidth: model.bandwidth,
      peakDensity: peak
    });
    return { label, grid, densities, peak, count: samples.length, key };
  });
  const values = curves.flatMap(({ label, grid, densities, peak, count, key }) => {
    const scale = scales.get(key)!;
    return grid.map((value, i) => ({
      ...label,
      value,
      density: densities[i],
      __densityWidth:
        normalization === 'area'
          ? densities[i] / scale.peak
          : (densities[i] / peak) * (normalization === 'count' ? count / scale.count : 1)
    }));
  });
  return { values, summaries };
}
