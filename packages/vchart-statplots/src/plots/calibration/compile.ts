import type { CalibrationCurveSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { curve, band, diagonal } from '../../common/marks';
import { intervalLabel } from '../../common/interval';
export function compileCalibration(spec: CalibrationCurveSpec) {
  const values = spec.data.map(row => ({ ...row, interval: spec.interval ? intervalLabel(spec.interval) : undefined }));
  const chart = commonChart(
    spec,
    [
      ...(values.some(row => row.lower !== undefined)
        ? [
            band(
              'uncertainty',
              values.filter(row => row.lower !== undefined),
              'meanPredictedProbability'
            )
          ]
        : []),
      curve(
        'calibration',
        values,
        'meanPredictedProbability',
        'observedRate',
        ['meanPredictedProbability', 'observedRate', 'binStart', 'binEnd', 'count', 'lower', 'upper', 'interval'],
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
