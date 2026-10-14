import type { ICartesianTimeAxisSpec } from '@visactor/vchart';
import type { TimeSeriesPlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { curve, band } from '../../common/marks';
import { summarizeTimeSeries } from './statistics';
export function compileTimeSeries(spec: TimeSeriesPlotSpec) {
  const values = summarizeTimeSeries(spec);
  const line = curve(
    'observations',
    values,
    '__time',
    'value',
    [
      'time',
      'value',
      ...(spec.input === 'observations' && spec.estimator !== false ? ['sampleCount', 'estimator'] : []),
      'lower',
      'upper',
      'interval'
    ],
    { sampleCount: '样本数', estimator: '估计方法', interval: '区间', ...spec.fieldLabels }
  );
  line.invalidType = 'break';
  const area = band('uncertainty', values, '__time');
  area.invalidType = 'break';
  const axis: ICartesianTimeAxisSpec = {
    orient: 'bottom',
    type: 'time',
    layers: [{ timeFormat: '%Y-%m-%d', timeFormatMode: 'utc' }],
    title: { visible: true, text: spec.fieldLabels?.time ?? '时间（UTC）' }
  };
  axis.label = { autoHide: true };
  const chart = commonChart(
    spec,
    [...(values.some(row => row.lower !== null) ? [area] : []), line],
    [axis, numberAxis('left', spec.fieldLabels?.value ?? '值')]
  );
  chart.legends = { visible: spec.data.some(row => row.series !== undefined), orient: 'top' };
  return chart;
}
