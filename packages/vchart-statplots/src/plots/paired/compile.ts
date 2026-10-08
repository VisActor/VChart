import type { PairedComparisonPlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { categoryAxis, numberAxis } from '../../common/axes';
import { curve, points } from '../../common/marks';
import { paletteColor } from '../../common/theme';
export function compilePaired(spec: PairedComparisonPlotSpec) {
  const values = spec.data
    .map(row => ({ ...row }))
    .sort((a, b) => spec.categoryOrder.indexOf(a.category) - spec.categoryOrder.indexOf(b.category));
  const lines = curve('pairs', values, 'category', 'value', ['id', 'category', 'value'], spec.fieldLabels);
  lines.seriesField = 'id';
  lines.line = { style: { stroke: paletteColor(spec.theme, 'markLineStrokeColor'), strokeOpacity: 0.5, lineWidth: 1 } };
  lines.point = { visible: false };
  lines.tooltip = { visible: false };
  const chart = commonChart(
    spec,
    [
      lines,
      points(
        'observations',
        values.map(row => ({ ...row })),
        'category',
        'value',
        ['id', 'category', 'value'],
        spec.fieldLabels
      )
    ],
    [
      categoryAxis('bottom', spec.fieldLabels?.category ?? '', spec.categoryOrder),
      numberAxis('left', spec.fieldLabels?.value ?? '值')
    ]
  );
  chart.legends = {
    visible: spec.data.some(row => row.series !== undefined),
    seriesId: ['observations'],
    orient: 'top'
  };
  return chart;
}
