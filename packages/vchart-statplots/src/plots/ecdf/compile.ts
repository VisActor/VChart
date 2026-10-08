import type { EcdfPlotSpec } from './types';
import { lineChart } from '../../common/line';
export function compileEcdf(spec: EcdfPlotSpec) {
  return lineChart(
    spec,
    'value',
    'cumulativeProbability',
    { value: '数值', cumulativeProbability: '累计概率', ...spec.fieldLabels },
    { probabilityY: true, step: true }
  );
}
