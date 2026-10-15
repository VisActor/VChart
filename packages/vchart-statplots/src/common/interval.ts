import type { Interval, StatPlotIssue } from './types';
import { issue } from './validation';

export function validateInterval(interval: Interval, path: string): StatPlotIssue[] {
  if ('level' in interval && !(interval.level > 0 && interval.level < 1)) {
    return [issue('INVALID_RANGE', `${path}/level`, '区间水平必须严格位于 0–1 之间')];
  }
  if ('multiplier' in interval && interval.multiplier <= 0) {
    return [issue('INVALID_RANGE', `${path}/multiplier`, '倍数必须大于 0')];
  }
  return [];
}

export function intervalLabel(interval: Interval): string {
  const names = {
    confidence: '置信区间',
    prediction: '预测区间',
    credible: '可信区间',
    standardError: '标准误',
    standardDeviation: '标准差',
    range: '范围'
  };
  return 'level' in interval
    ? `${interval.level * 100}% ${names[interval.kind]}`
    : 'multiplier' in interval
    ? `${interval.multiplier} × ${names[interval.kind]}`
    : names.range;
}
