import { normalQuantile } from '@visactor/vutils';
import type { QqPlotSpec } from './types';
import { checkSeries, seriesGroups, issue } from '../../common/validation';
export function validateQq(spec: QqPlotSpec) {
  const errors = checkSeries(spec.data);
  const mean = spec.distribution?.mean ?? 0;
  const sd = spec.distribution?.standardDeviation ?? 1;
  if (!(sd > 0)) errors.push(issue('INVALID_RANGE', '/distribution/standardDeviation', '正态标准差须为正数'));
  for (const group of seriesGroups(spec.data).values()) {
    if (group.length < 2 && (spec.referenceLine === 'quartiles' || spec.referenceLine === 'regression')) {
      errors.push(issue('INVALID_RANGE', `/data/${group[0].index}`, '该参考线要求每系列至少两个样本'));
    }
    const q = normalQuantile(1 / (group.length + 1));
    const min = mean + sd * q;
    const max = mean - sd * q;
    if (
      !Number.isFinite(min) ||
      !Number.isFinite(max) ||
      !Number.isFinite(max - min) ||
      (group.length > 1 && !(min < max))
    ) {
      errors.push(issue('INVALID_RANGE', '/distribution', '理论分位数范围不可表示，请调整分布参数或数值单位'));
    }
  }
  return errors;
}
