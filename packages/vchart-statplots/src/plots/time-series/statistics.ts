import type { TimeSeriesPlotSpec, TimeSeriesEstimate } from './types';
import { summarizeSample } from '../../common/sample-estimate';
import { intervalLabel } from '../../common/interval';

/** 每行日期只解析一次；按系列首次出现顺序和时刻稳定排序，不修改输入。 */
export function summarizeTimeSeries(spec: TimeSeriesPlotSpec) {
  const seriesOrder = new Map<string | undefined, number>();
  const parsed = spec.data.map((row: TimeSeriesEstimate) => {
    if (!seriesOrder.has(row.series)) seriesOrder.set(row.series, seriesOrder.size);
    const __time = Date.parse(row.time);
    return { ...row, __time, time: new Date(__time).toISOString() };
  });
  parsed.sort((a, b) => seriesOrder.get(a.series)! - seriesOrder.get(b.series)! || a.__time - b.__time);
  if (spec.input === 'estimates') {
    return parsed.map(row => ({
      ...row,
      lower: row.lower ?? null,
      upper: row.upper ?? null,
      interval: spec.interval ? intervalLabel(spec.interval) : undefined
    }));
  }
  if (spec.estimator === false) return parsed.map(row => ({ ...row, lower: null, upper: null }));
  const groups = new Map<string, { time: string; __time: number; series?: string; values: number[] }>();
  for (const row of parsed) {
    const key = JSON.stringify([row.series, row.__time]);
    let group = groups.get(key);
    if (!group) {
      group = { time: row.time, __time: row.__time, series: row.series, values: [] };
      groups.set(key, group);
    }
    if (row.value !== null) group.values.push(row.value);
  }
  const estimator = spec.estimator ?? 'mean';
  return Array.from(groups.values(), ({ values, ...group }) => {
    if (!values.length)
      return { ...group, value: null, lower: null, upper: null, sampleCount: 0, estimator, interval: '缺失观测' };
    const { estimate, ...summary } = summarizeSample(values, { estimator, errorBar: spec.errorBar });
    return { ...group, value: estimate, ...summary, estimator };
  });
}
