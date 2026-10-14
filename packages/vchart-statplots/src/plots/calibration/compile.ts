import type { CalibrationCurveSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { curve, diagonal } from '../../common/marks';
import { computeCalibration } from './binning';
export function compileCalibration(spec: CalibrationCurveSpec) {
  const values = computeCalibration(spec);
  const chart = commonChart(
    spec,
    [
      curve(
        'calibration',
        values,
        'meanPredictedProbability',
        'observedRate',
        ['meanPredictedProbability', 'observedRate', 'binStart', 'binEnd', 'count'],
        spec.fieldLabels
      )
    ],
    [
      numberAxis('bottom', spec.fieldLabels?.meanPredictedProbability ?? '平均预测概率', true),
      numberAxis('left', spec.fieldLabels?.observedRate ?? '实际正例比例', true)
    ]
  );
  chart.markLine = diagonal('meanPredictedProbability', 'observedRate', 'calibration');
  chart.legends = { visible: spec.data.some(row => row.series !== undefined), orient: 'top' };
  return chart;
}
