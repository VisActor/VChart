import type { ILayoutSpec } from '@visactor/vchart';
import { MatrixLayout } from '../../layout/matrix';
import { createMatrixColorBar } from '../../common/matrix-colorbar';
import type { ConfusionMatrixSpec } from './types';
import { commonChart } from '../../common/chart';
import { matrixAxis } from '../../common/axes';
import { semanticTooltip } from '../../common/tooltip';
import { paletteColor } from '../../common/theme';
import { continuousColorScale } from '../../common/colors';
import { aggregateConfusionMatrix } from './aggregation';
export function compileConfusionMatrix(spec: ConfusionMatrixSpec) {
  const mode = spec.normalization ?? 'none';
  const borderColor = paletteColor(spec.theme, 'backgroundColor');
  const { values, classes } = aggregateConfusionMatrix(spec);
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
        cell: { style: { fill: { scale: 'intensity', field: 'value' }, stroke: borderColor, lineWidth: 1 } },
        label: {
          visible: true,
          overlap: { hideOnHit: true, avoidBaseMark: false, overlapPadding: 4, strategy: [] },
          smartInvert: { contrastRatiosThreshold: 4.5 },
          style: { fill: '#000000', stroke: false, fontSize: 11, boundsPadding: 0 },
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
        cell: { style: { fill: paletteColor(spec.theme, 'disableFontColor'), stroke: borderColor, lineWidth: 1 } },
        label: {
          visible: true,
          overlap: { hideOnHit: true, avoidBaseMark: false, overlapPadding: 4, strategy: [] },
          smartInvert: { contrastRatiosThreshold: 4.5 },
          style: { fill: paletteColor(spec.theme, 'primaryFontColor'), stroke: false, fontSize: 11, boundsPadding: 0 },
          formatMethod: () => 'NA'
        },
        tooltip: semanticTooltip(['actual', 'predicted', 'count', 'value'], fieldLabels)
      }
    ],
    [
      matrixAxis('bottom', spec.fieldLabels?.predicted ?? '预测类别', classes),
      matrixAxis('left', spec.fieldLabels?.actual ?? '实际类别', classes)
    ]
  );
  const max = mode === 'none' ? values.reduce((m, row) => Math.max(m, row.count), 1) : 1;
  const scale = continuousColorScale(spec, 'sequential', 'intensity', 0, max);
  chart.scales = [scale];
  chart.layout = { type: MatrixLayout.type } as ILayoutSpec;
  chart.legends = { visible: false };
  const ticks = mode === 'none' ? [] : [0, 0.25, 0.5, 0.75, 1];
  if (mode === 'none') {
    const step = Math.max(1, Math.ceil(max / 4));
    for (let value = 0; value < max; value += step) ticks.push(value);
    ticks.push(max);
  }
  chart.customMark = spec.data.length
    ? [
        createMatrixColorBar(spec, scale, {
          name: 'confusion-colorbar',
          title: fieldLabels.value,
          ticks,
          formatTick: value => (mode === 'none' ? String(value) : `${value * 100}%`)
        })
      ]
    : [];
  return chart;
}
