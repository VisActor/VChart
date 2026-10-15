import type { CountPlotSpec } from './types';

interface CountResultRow {
  category: string;
  series?: string;
  count: number;
  proportion: number;
}

export function aggregateCounts(spec: CountPlotSpec): CountResultRow[] {
  const categories = new Set<string>();
  const groups = new Map<string | undefined, { total: number; counts: Map<string, number> }>();
  for (const row of spec.data) {
    categories.add(row.category);
    let group = groups.get(row.series);
    if (!group) {
      group = { total: 0, counts: new Map() };
      groups.set(row.series, group);
    }
    group.total++;
    group.counts.set(row.category, (group.counts.get(row.category) ?? 0) + 1);
  }
  const values: CountResultRow[] = [];
  for (const [series, group] of groups) {
    const denominator = spec.normalizationScope === 'series' ? group.total : spec.data.length;
    for (const category of categories) {
      const count = group.counts.get(category) ?? 0;
      values.push({ category, ...(series === undefined ? {} : { series }), count, proportion: count / denominator });
    }
  }
  return values;
}
