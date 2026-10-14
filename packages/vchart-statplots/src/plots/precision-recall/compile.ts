import type { PrecisionRecallCurveSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { curve } from '../../common/marks';
import { computePrecisionRecall } from './distribution';
export function compilePrecisionRecall(spec: PrecisionRecallCurveSpec) {
  const { values, baselines } = computePrecisionRecall(spec);
  const pr = curve(
    'pr',
    values,
    'recall',
    'precision',
    ['recall', 'precision', 'threshold', 'averagePrecision', 'sampleCount', 'positiveRate'],
    {
      recall: '召回率',
      precision: '精确率',
      averagePrecision: 'Average precision',
      sampleCount: '样本数',
      positiveRate: '正例比例',
      ...spec.fieldLabels
    }
  );
  pr.line = { style: { curveType: 'stepBefore', lineWidth: 2 } };
  const baseline = curve('baseline', baselines, 'recall', 'precision', []);
  baseline.point = { visible: false };
  baseline.line = { style: { lineDash: [4, 4], lineWidth: 1 } };
  baseline.tooltip = { visible: false };
  const chart = commonChart(
    spec,
    [pr, ...(spec.baseline ? [baseline] : [])],
    [
      numberAxis('bottom', spec.fieldLabels?.recall ?? '召回率', true),
      numberAxis('left', spec.fieldLabels?.precision ?? '精确率', true)
    ]
  );
  chart.legends = { visible: spec.data.some(row => row.series !== undefined), orient: 'top' };
  return chart;
}
