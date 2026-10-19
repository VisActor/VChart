import type { AutocorrelationPlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { points, band, zeroLine, curve } from '../../common/marks';
import { computeAutocorrelation } from './estimation';
export function compileAutocorrelation(spec: AutocorrelationPlotSpec) {
  const values = computeAutocorrelation(spec);
  const confidenceGroups = new Map<string | undefined, typeof values>();
  for (const row of values) {
    if (row.lower === undefined) continue;
    let group = confidenceGroups.get(row.series);
    if (!group) confidenceGroups.set(row.series, (group = []));
    group.push(row);
  }
  const confidenceValues = Array.from(confidenceGroups.values()).flatMap(group => [
    { ...group[0], lag: group[0].lag - 0.5 },
    ...group,
    { ...group[group.length - 1], lag: group[group.length - 1].lag + 0.5 }
  ]);
  const chart = commonChart(
    spec,
    [
      ...(confidenceValues.length ? [band('uncertainty', confidenceValues, 'lag')] : []),
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
        line: { style: { stroke: { scale: 'color', field: 'series' }, lineWidth: 1.5 } },
        tooltip: { visible: false }
      },
      points(
        'values',
        values.map(row => ({ ...row })),
        'lag',
        'correlation',
        ['lag', 'correlation', 'lower', 'upper', 'method', 'confidenceLevel', 'sampleCount'],
        {
          lower: '零中心下界',
          upper: '零中心上界',
          confidenceLevel: '置信水平',
          sampleCount: '样本数',
          ...spec.fieldLabels
        }
      )
    ],
    [
      { ...numberAxis('bottom', spec.fieldLabels?.lag ?? '滞后阶数'), min: 0, tick: { noDecimals: true } },
      numberAxis('left', spec.fieldLabels?.correlation ?? (spec.method ?? 'acf').toUpperCase())
    ]
  );
  chart.markLine = zeroLine;
  // 每个滞后独立成竖线；颜色和图例仍按原始样本系列绑定。
  chart.color = {
    type: 'ordinal',
    domain: [...new Set(values.map(row => row.series))],
    range: (chart.color as string[]) ?? []
  };
  chart.legends = {
    visible: spec.data.some(row => row.series !== undefined),
    orient: 'top',
    scaleName: 'color',
    field: 'series'
  };
  return chart;
}
