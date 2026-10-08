import type { AutocorrelationPlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { points, band, zeroLine, curve } from '../../common/marks';
import { intervalLabel } from '../../common/interval';
import { paletteColor } from '../../common/theme';
export function compileAutocorrelation(spec: AutocorrelationPlotSpec) {
  const values = spec.data.map(row => ({
    ...row,
    zero: 0,
    interval: spec.interval ? intervalLabel(spec.interval) : undefined,
    method: spec.method
  }));
  const chart = commonChart(
    spec,
    [
      ...(values.some(row => row.lower !== undefined)
        ? [
            band(
              'uncertainty',
              values.map(row => ({ ...row, lower: row.lower ?? null, upper: row.upper ?? null })),
              'lag'
            )
          ]
        : []),
      {
        ...curve(
          'stems',
          values.flatMap(row => [
            { ...row, __stem: JSON.stringify([row.series, row.lag]), __end: 0 },
            { ...row, __stem: JSON.stringify([row.series, row.lag]), __end: row.correlation }
          ]),
          'lag',
          '__end',
          []
        ),
        seriesField: '__stem',
        point: { visible: false },
        line: { style: { stroke: paletteColor(spec.theme, 'infoColor'), lineWidth: 1.5 } },
        tooltip: { visible: false }
      },
      points(
        'values',
        values.map(row => ({ ...row })),
        'lag',
        'correlation',
        ['lag', 'correlation', 'lower', 'upper', 'method', 'interval'],
        spec.fieldLabels
      )
    ],
    [
      { ...numberAxis('bottom', spec.fieldLabels?.lag ?? '滞后阶数'), min: 0 },
      numberAxis('left', spec.fieldLabels?.correlation ?? spec.method.toUpperCase())
    ]
  );
  chart.markLine = zeroLine;
  chart.legends = { visible: spec.data.some(row => row.series !== undefined), seriesId: ['values'], orient: 'top' };
  return chart;
}
