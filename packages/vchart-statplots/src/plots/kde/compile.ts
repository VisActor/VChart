import type { KdePlotSpec } from './types';
import type { ICartesianLinearAxisSpec } from '@visactor/vchart';
import { lineChart } from '../../common/line';
import { prepareKde, estimateKde } from './estimation';
export function compileKde(spec: KdePlotSpec) {
  const { groups, domain } = prepareKde(spec);
  const chart = lineChart(
    { ...spec, data: estimateKde(groups) },
    'value',
    'density',
    { value: '数值', density: '概率密度', ...spec.fieldLabels },
    { zeroY: true, points: false, tooltipActiveType: 'dimension' }
  );
  Object.assign(chart.axes![0] as ICartesianLinearAxisSpec, { min: domain[0], max: domain[1], nice: false });
  return chart;
}
