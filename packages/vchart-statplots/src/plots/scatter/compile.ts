import type { ScatterPlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { points, curve, band } from '../../common/marks';
import { intervalLabel } from '../../common/interval';
export function compileScatter(spec: ScatterPlotSpec) {
  const fit =
    spec.fit?.data.map(row => ({
      ...row,
      method: spec.fit!.method,
      interval: spec.fit!.interval ? intervalLabel(spec.fit!.interval) : undefined
    })) ?? [];
  const chart = commonChart(
    spec,
    [
      ...(fit.some(row => row.lower !== undefined)
        ? [
            band(
              'fit-band',
              fit.filter(row => row.lower !== undefined),
              'x'
            )
          ]
        : []),
      ...(spec.fit
        ? [
            curve(
              'fit',
              fit,
              'x',
              'estimate',
              ['x', 'estimate', 'lower', 'upper', 'method', 'interval'],
              spec.fieldLabels
            )
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
    seriesId: ['observations'],
    orient: 'top'
  };
  return chart;
}
