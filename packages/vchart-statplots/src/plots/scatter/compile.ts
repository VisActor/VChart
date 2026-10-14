import type { ScatterPlotSpec, FitRow } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { points, curve, band } from '../../common/marks';
import { intervalLabel } from '../../common/interval';
import { buildRegressionCurves } from '../../common/regression';
export function compileScatter(spec: ScatterPlotSpec) {
  const config = spec.fit;
  const fit: (FitRow & { method: string; interval?: string; sampleCount?: number })[] =
    config?.input === 'observations'
      ? buildRegressionCurves(
          spec.data,
          config,
          config.confidence,
          config.method === 'lowess' ? undefined : config.sampling?.points
        )
      : config?.data.map(row => ({
          ...row,
          method: config.method,
          interval: config.interval ? intervalLabel(config.interval) : undefined
        })) ?? [];
  const chart = commonChart(
    spec,
    [
      ...(fit.some(row => row.lower !== undefined)
        ? [
            {
              ...band(
                'fit-band',
                fit.map(row => ({ ...row, lower: row.lower ?? null, upper: row.upper ?? null })),
                'x'
              ),
              invalidType: 'break' as const
            }
          ]
        : []),
      ...(spec.fit
        ? [
            {
              ...curve(
                'fit',
                fit,
                'x',
                'estimate',
                [
                  'x',
                  'estimate',
                  'lower',
                  'upper',
                  'method',
                  'interval',
                  ...(config?.input === 'observations' ? ['sampleCount'] : [])
                ],
                {
                  ...spec.fieldLabels,
                  estimate: spec.fieldLabels?.y ?? '预测值',
                  method: '拟合方法',
                  interval: '区间',
                  sampleCount: '样本数'
                }
              ),
              ...(config?.input === 'observations' ? { point: { visible: false } } : {})
            }
          ]
        : []),
      points(
        'observations',
        spec.data.map(row => ({ ...row })),
        'x',
        'y',
        ['id', 'x', 'y'],
        spec.fieldLabels
      )
    ],
    [numberAxis('bottom', spec.fieldLabels?.x ?? 'x'), numberAxis('left', spec.fieldLabels?.y ?? 'y')]
  );
  chart.legends = {
    visible: spec.data.some(row => row.series !== undefined),
    seriesId: chart.series!.map(item => item.id!),
    orient: 'top'
  };
  return chart;
}
