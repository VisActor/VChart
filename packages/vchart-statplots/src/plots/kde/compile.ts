import type { KdePlotSpec } from './types';
import { lineChart } from '../../common/line';
export function compileKde(spec: KdePlotSpec) {
  return lineChart(
    spec,
    'value',
    'density',
    { value: '数值', density: '概率密度', ...spec.fieldLabels },
    { zeroY: true }
  );
}
