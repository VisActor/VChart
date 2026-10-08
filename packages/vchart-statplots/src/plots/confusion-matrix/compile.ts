import type { ConfusionMatrixSpec } from './types';
import { commonChart } from '../../common/chart';
import { categoryAxis } from '../../common/axes';
import { semanticTooltip } from '../../common/tooltip';
import { paletteColor } from '../../common/theme';
import { continuousColorScale } from '../../common/colors';
export function compileConfusionMatrix(spec: ConfusionMatrixSpec) {
  const totals = new Map<string, number>();
  const mode = spec.normalization ?? 'none';
  const key = (row: ConfusionMatrixSpec['data'][number]) =>
    mode === 'actual' ? row.actual : mode === 'predicted' ? row.predicted : '';
  spec.data.forEach(row => totals.set(key(row), (totals.get(key(row)) ?? 0) + row.count));
  const values = spec.data.map(row => ({
    ...row,
    value: mode === 'none' ? row.count : totals.get(key(row))! > 0 ? row.count / totals.get(key(row))! : null
  }));
  const classes = [...new Set(spec.data.flatMap(row => [row.actual, row.predicted]))];
  const fieldLabels = {
    ...spec.fieldLabels,
    value: mode === 'none' ? spec.fieldLabels?.count ?? '计数' : spec.fieldLabels?.proportion ?? '比例'
  };
  const chart = commonChart(
    spec,
    [
      {
        type: 'heatmap',
        id: 'matrix',
        data: { id: 'matrix', values: values.filter(row => row.value !== null) },
        xField: 'predicted',
        yField: 'actual',
        valueField: 'value',
        cell: { style: { fill: { scale: 'intensity', field: 'value' } } },
        label: {
          visible: true,
          smartInvert: { contrastRatiosThreshold: 4.5 },
          style: { fill: '#000000', stroke: false },
          formatMethod: text => (mode === 'none' ? String(text) : `${(Number(text) * 100).toFixed(1)}%`)
        },
        tooltip: semanticTooltip(['actual', 'predicted', 'count', 'value'], fieldLabels)
      },
      {
        type: 'heatmap',
        id: 'undefined',
        data: { id: 'undefined', values: values.filter(row => row.value === null) },
        xField: 'predicted',
        yField: 'actual',
        valueField: 'value',
        cell: { style: { fill: paletteColor(spec.theme, 'disableFontColor') } },
        label: {
          visible: true,
          smartInvert: { contrastRatiosThreshold: 4.5 },
          style: { fill: paletteColor(spec.theme, 'primaryFontColor'), stroke: false },
          formatMethod: () => 'NA'
        },
        tooltip: semanticTooltip(['actual', 'predicted', 'count', 'value'], fieldLabels)
      }
    ],
    [
      categoryAxis('bottom', spec.fieldLabels?.predicted ?? '预测类别', classes),
      categoryAxis('left', spec.fieldLabels?.actual ?? '实际类别', classes)
    ]
  );
  const max = mode === 'none' ? values.reduce((m, row) => Math.max(m, row.count), 1) : 1;
  chart.scales = [continuousColorScale(spec, 'sequential', 'intensity', 0, max)];
  chart.legends = { visible: true, type: 'color', scale: 'intensity', filter: false, slidable: false, orient: 'right' };
  return chart;
}
