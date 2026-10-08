import type { LearningCurveSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { curve, band } from '../../common/marks';
import { intervalLabel } from '../../common/interval';
export function compileLearningCurve(spec: LearningCurveSpec) {
  const values = spec.data.map(row => ({
    ...row,
    series: row.series ? `${row.series} / ${row.split}` : row.split,
    lower: row.lower ?? null,
    upper: row.upper ?? null,
    interval: spec.interval ? intervalLabel(spec.interval) : undefined,
    metric: spec.metric
  }));
  const area = band('uncertainty', values, 'trainSize');
  area.invalidType = 'break';
  const chart = commonChart(
    spec,
    [
      ...(spec.data.some(row => row.lower !== undefined) ? [area] : []),
      curve(
        'scores',
        values.map(row => ({ ...row })),
        'trainSize',
        'score',
        ['trainSize', 'split', 'score', 'lower', 'upper', 'interval', 'metric'],
        spec.fieldLabels
      )
    ],
    [
      numberAxis('bottom', spec.fieldLabels?.trainSize ?? '训练样本数'),
      numberAxis('left', spec.fieldLabels?.score ?? spec.metric)
    ]
  );
  chart.legends = { visible: true, orient: 'top', seriesId: ['scores'] };
  return chart;
}
