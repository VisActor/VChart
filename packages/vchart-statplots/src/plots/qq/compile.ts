import type { QqPlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { points, curve } from '../../common/marks';
import { computeQq } from './distribution';
export function compileQq(spec: QqPlotSpec) {
  const result = computeQq(spec);
  const reference = curve('qq-reference', result.referenceLines, 'theoreticalQuantile', 'sampleQuantile', []);
  reference.point = { visible: false };
  reference.line = { style: { lineDash: [4, 4], lineWidth: 1 } };
  reference.tooltip = { visible: false };
  if (spec.referenceLine === 'identity') reference.seriesField = undefined;
  const chart = commonChart(
    spec,
    [
      points(
        'quantiles',
        result.points,
        'theoreticalQuantile',
        'sampleQuantile',
        ['theoreticalQuantile', 'sampleQuantile', 'probability'],
        { probability: '分位点位置', ...spec.fieldLabels }
      ),
      ...(spec.referenceLine && spec.referenceLine !== 'none' ? [reference] : [])
    ],
    [
      numberAxis('bottom', spec.fieldLabels?.theoreticalQuantile ?? '正态理论分位数'),
      numberAxis('left', spec.fieldLabels?.sampleQuantile ?? '样本分位数')
    ]
  );
  chart.legends = {
    visible: spec.data.some(row => row.series !== undefined),
    orient: 'top',
    ...(spec.referenceLine === 'identity' ? { seriesId: ['quantiles'] } : {})
  };
  return chart;
}
