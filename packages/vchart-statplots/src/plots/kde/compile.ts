import type { KdePlotSpec } from './types';
import type { ICartesianLinearAxisSpec } from '@visactor/vchart';
import { lineChart } from '../../common/line';
import { prepareKde, estimateKde } from './estimation';
import { semanticTooltip } from '../../common/tooltip';
export function compileKde(spec: KdePlotSpec) {
  const { groups, domain } = prepareKde(spec);
  const chart = lineChart(
    { ...spec, data: estimateKde(groups, spec.normalizationScope) },
    'value',
    'density',
    { value: '数值', density: '概率密度', ...spec.fieldLabels },
    { zeroY: true, points: false, tooltipActiveType: 'dimension' }
  );
  chart.series![0].tooltip = semanticTooltip(
    ['value', 'density', 'sampleCount', 'bandwidth', 'normalizationScope'],
    {
      value: '数值',
      density: spec.normalizationScope === 'series' ? '组内概率密度' : '按样本比例缩放的概率密度',
      sampleCount: '样本数',
      bandwidth: '实际带宽',
      normalizationScope: '归一化范围',
      ...spec.fieldLabels
    },
    'dimension'
  );
  Object.assign(chart.axes![0] as ICartesianLinearAxisSpec, { min: domain[0], max: domain[1], nice: false });
  return chart;
}
