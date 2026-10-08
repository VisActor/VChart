import type { QqPlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { points } from '../../common/marks';
export function compileQq(spec: QqPlotSpec) {
  const chart = commonChart(
    spec,
    [
      points(
        'quantiles',
        spec.data.map(row => ({ ...row, distribution: spec.distribution })),
        'theoreticalQuantile',
        'sampleQuantile',
        ['theoreticalQuantile', 'sampleQuantile', 'distribution'],
        spec.fieldLabels
      )
    ],
    [
      numberAxis('bottom', spec.fieldLabels?.theoreticalQuantile ?? `${spec.distribution} 理论分位数`),
      numberAxis('left', spec.fieldLabels?.sampleQuantile ?? '样本分位数')
    ]
  );
  if (spec.referenceLine && spec.data.length) {
    const min = spec.data.reduce((m, r) => Math.min(m, r.theoreticalQuantile), Infinity),
      max = spec.data.reduce((m, r) => Math.max(m, r.theoreticalQuantile), -Infinity);
    chart.markLine = {
      relativeSeriesId: 'quantiles',
      coordinates: [
        { theoreticalQuantile: min, sampleQuantile: spec.referenceLine.intercept + spec.referenceLine.slope * min },
        { theoreticalQuantile: max, sampleQuantile: spec.referenceLine.intercept + spec.referenceLine.slope * max }
      ],
      endSymbol: { visible: false },
      line: { style: { lineDash: [4, 4] } },
      label: { visible: true, text: spec.referenceLine.method }
    };
  }
  chart.legends = { visible: spec.data.some(row => row.series !== undefined), orient: 'top' };
  return chart;
}
