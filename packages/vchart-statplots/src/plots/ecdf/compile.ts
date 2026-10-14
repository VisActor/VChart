import type { EcdfPlotSpec } from './types';
import type { ICartesianLinearAxisSpec } from '@visactor/vchart';
import { lineChart } from '../../common/line';
import { ecdfDomain, ecdfDistribution } from './distribution';
export function compileEcdf(spec: EcdfPlotSpec) {
  const domain = ecdfDomain(spec.data)!;
  const chart = lineChart(
    { ...spec, data: ecdfDistribution(spec.data, domain) },
    'value',
    'cumulativeProbability',
    { value: '数值', cumulativeProbability: '累计概率', ...spec.fieldLabels },
    { probabilityY: true, step: true, points: false, tooltipActiveType: 'dimension' }
  );
  Object.assign(chart.axes![0] as ICartesianLinearAxisSpec, { min: domain[0], max: domain[1], nice: false });
  return chart;
}
