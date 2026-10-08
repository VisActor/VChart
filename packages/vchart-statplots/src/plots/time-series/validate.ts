import type { TimeSeriesPlotSpec } from './types';
import { checkSeries, issue } from '../../common/validation';
import { checkBounds } from '../../common/bounds';
export function validateTimeSeries(spec: TimeSeriesPlotSpec) {
  const errors = [...checkSeries(spec.data), ...checkBounds(spec.data, spec.interval)];
  const previous = new Map<string | undefined, number>();
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
    if (previous.has(row.series) && t <= previous.get(row.series)!) {
      errors.push(issue('INVALID_ORDER', `/data/${i}/time`, '每系列时间须严格递增'));
    }
    previous.set(row.series, t);
    if (row.value === null && row.lower !== undefined) {
      errors.push(issue('UNSUPPORTED_COMBINATION', `/data/${i}`, '缺失观测不能携带区间'));
    }
  });
  return errors;
}
