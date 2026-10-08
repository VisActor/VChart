import type { ICartesianTimeAxisSpec } from '@visactor/vchart';
import type { TimeSeriesPlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { curve, band } from '../../common/marks';
import { intervalLabel } from '../../common/interval';
export function compileTimeSeries(spec: TimeSeriesPlotSpec) {
  const values = spec.data.map(row => ({
    ...row,
    __time: Date.parse(row.time),
    lower: row.lower ?? null,
    upper: row.upper ?? null,
    interval: spec.interval ? intervalLabel(spec.interval) : undefined
  }));
  const line = curve(
    'observations',
    values,
    '__time',
    'value',
    ['time', 'value', 'lower', 'upper', 'interval'],
    spec.fieldLabels
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
    [...(spec.data.some(row => row.lower !== undefined) ? [area] : []), line],
    [axis, numberAxis('left', spec.fieldLabels?.value ?? '值')]
  );
  chart.legends = { visible: spec.data.some(row => row.series !== undefined), orient: 'top' };
  return chart;
}
