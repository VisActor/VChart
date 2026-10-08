import type { PrecisionRecallCurveSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { curve } from '../../common/marks';
export function compilePrecisionRecall(spec: PrecisionRecallCurveSpec) {
  const metrics = new Map(spec.metrics?.map(row => [row.series, row.averagePrecision]));
  const chart = commonChart(
    spec,
    [
      curve(
        'pr',
        spec.data.map(row => ({ ...row, averagePrecision: metrics.get(row.series) })),
        'recall',
        'precision',
        ['recall', 'precision', 'threshold', 'averagePrecision'],
        {
          recall: '召回率',
          precision: '精确率',
          averagePrecision: 'Average precision（外部计算）',
          ...spec.fieldLabels
        }
      )
    ],
    [
      numberAxis('bottom', spec.fieldLabels?.recall ?? '召回率', true),
      numberAxis('left', spec.fieldLabels?.precision ?? '精确率', true)
    ]
  );
  chart.legends = { visible: spec.data.some(row => row.series !== undefined), orient: 'top' };
  if (spec.positiveRate !== undefined) {
    chart.markLine = {
      y: spec.positiveRate,
      endSymbol: { visible: false },
      line: { style: { lineDash: [4, 4] } },
      label: { visible: true, position: 'insideEndTop', text: '正例比例' }
    };
  }
  return chart;
}
