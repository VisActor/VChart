import type { TimeSeriesPlotSpec } from './types';
import { checkSeries, issue } from '../../common/validation';
import { checkBounds } from '../../common/bounds';
import { validateSampleEstimateOptions } from '../../common/sample-estimate';
export function validateTimeSeries(spec: TimeSeriesPlotSpec) {
  const errors = checkSeries(spec.data);
  if (spec.input === 'estimates') errors.push(...checkBounds(spec.data, spec.interval));
  else if (spec.estimator === false) {
    if (spec.errorBar) errors.push(issue('UNSUPPORTED_COMBINATION', '/errorBar', '直接连线时不能配置估计区间'));
  } else errors.push(...validateSampleEstimateOptions({ estimator: spec.estimator, errorBar: spec.errorBar }));
  const seen = new Map<string | undefined, Set<number>>();
  spec.data.forEach((row, i) => {
    const t = Date.parse(row.time);
    const [year, month, day] = row.time.slice(0, 10).split('-').map(Number);
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
    const validDay = day >= 1 && day <= days;
    if (
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(row.time) ||
      !Number.isFinite(t) ||
      !validDay
    ) {
      errors.push(issue('INVALID_RANGE', `/data/${i}/time`, 'time 必须为有效的带时区 ISO 时间'));
    }
    let times = seen.get(row.series);
    if (!times) {
      times = new Set();
      seen.set(row.series, times);
    }
    if (spec.input === 'estimates' && times.has(t)) {
      errors.push(issue('DUPLICATE_KEY', `/data/${i}/time`, '外部估计每系列每时刻只能提供一个结果'));
    }
    times.add(t);
    if (spec.input === 'estimates' && row.value === null && ('lower' in row || 'upper' in row)) {
      errors.push(issue('UNSUPPORTED_COMBINATION', `/data/${i}`, '缺失观测不能携带区间'));
    }
  });
  return errors;
}
