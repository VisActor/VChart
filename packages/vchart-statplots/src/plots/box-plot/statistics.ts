import { quantileSorted } from '@visactor/vutils';
import type { BoxPlotRow } from './types';
import type { SeriesRow } from '../../common/types';

export interface BoxPlotSummaryRow extends SeriesRow {
  category: string;
  q1: number;
  median: number;
  q3: number;
  whiskerLower: number;
  whiskerUpper: number;
  outliers: number[];
}

/** 只排序新建的分组数组；首次出现顺序保留类别和系列顺序。 */
export function summarizeBoxPlot(data: readonly BoxPlotRow[], iqrMultiplier: number): BoxPlotSummaryRow[] {
  const categories = new Map<string, Map<string | undefined, number[]>>();
  const groups: { category: string; series?: string; values: number[] }[] = [];
  for (const row of data) {
    let category = categories.get(row.category);
    if (!category) {
      category = new Map();
      categories.set(row.category, category);
    }
    let values = category.get(row.series);
    if (!values) {
      values = [];
      category.set(row.series, values);
      groups.push({ category: row.category, ...(row.series === undefined ? {} : { series: row.series }), values });
    }
    values.push(row.value);
  }
  return groups.map(({ category, series, values }) => {
    values.sort((a, b) => a - b);
    const q1 = quantileSorted(values, 0.25);
    const median = quantileSorted(values, 0.5);
    const q3 = quantileSorted(values, 0.75);
    const reach = iqrMultiplier * (q3 - q1);
    const lowerFence = q1 - reach;
    const upperFence = q3 + reach;
    let lower = 0;
    let upper = values.length - 1;
    while (lower < values.length && values[lower] < lowerFence) {
      lower++;
    }
    while (upper >= 0 && values[upper] > upperFence) {
      upper--;
    }
    // 插值四分位数不一定是观测；须不能反向伸入箱体。
    const whiskerLower = lower === values.length ? q1 : Math.min(q1, values[lower]);
    const whiskerUpper = upper < 0 ? q3 : Math.max(q3, values[upper]);
    const outliers = values.slice(0, lower).concat(values.slice(upper + 1));
    return {
      category,
      ...(series === undefined ? {} : { series }),
      q1,
      median,
      q3,
      whiskerLower,
      whiskerUpper,
      outliers
    };
  });
}
