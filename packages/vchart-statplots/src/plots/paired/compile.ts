import type { PairedComparisonPlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { categoryAxis, numberAxis } from '../../common/axes';
import { curve, points } from '../../common/marks';
import { paletteColor } from '../../common/theme';
export function compilePaired(spec: PairedComparisonPlotSpec) {
  const values = spec.data
    .map(row => ({ ...row }))
    .sort((a, b) => spec.categoryOrder.indexOf(a.category) - spec.categoryOrder.indexOf(b.category));
  const grouped = values.some(row => row.series !== undefined);
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
  if (grouped) {
    // 对象 ID 仅用于连线分组；颜色域和图例沿用原始系列。
    chart.color = {
      type: 'ordinal',
      domain: [...new Set(values.map(row => row.series))],
      range: (chart.color as string[]) ?? []
    };
  }
  chart.legends = {
    visible: grouped,
    seriesId: ['observations', 'pairs'],
    orient: 'top',
    scaleName: 'color',
    field: 'series',
    data: (items, colorScale) =>
      items.map(item => ({
        ...item,
        shape: { symbolType: 'circle' as const, fill: colorScale.scale(item.label) }
      }))
  };
  return chart;
}
