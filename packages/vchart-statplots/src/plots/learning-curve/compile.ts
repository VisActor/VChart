import type { LearningCurveSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { curve, band } from '../../common/marks';
import { summarizeLearningCurve } from './statistics';
export function compileLearningCurve(spec: LearningCurveSpec) {
  const values = summarizeLearningCurve(spec).map(row => ({
    ...row,
    series: row.series ? `${row.series} / ${row.split}` : row.split,
    lower: row.lower ?? null,
    upper: row.upper ?? null,
    metric: spec.metric
  }));
  const area = band('uncertainty', values, 'trainSize');
  area.invalidType = 'break';
  const chart = commonChart(
    spec,
    [
      ...(values.some(row => row.lower !== null) ? [area] : []),
      curve(
        'scores',
        values.map(row => ({ ...row })),
        'trainSize',
        'score',
        ['trainSize', 'split', 'score', 'lower', 'upper', 'interval', 'metric', 'foldCount', 'standardDeviation'],
        { ...spec.fieldLabels, foldCount: '折数', standardDeviation: '总体标准差', interval: '区间定义' }
      )
    ],
    [
      numberAxis('bottom', spec.fieldLabels?.trainSize ?? '训练样本数'),
      numberAxis('left', spec.fieldLabels?.score ?? spec.metric)
    ]
  );
  chart.legends = {
    visible: true,
    orient: 'top',
    seriesId: ['scores', ...(values.some(row => row.lower !== null) ? ['uncertainty'] : [])]
  };
  return chart;
}
