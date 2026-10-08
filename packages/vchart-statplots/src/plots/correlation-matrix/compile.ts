import type { CorrelationMatrixSpec } from './types';
import { commonChart } from '../../common/chart';
import { categoryAxis } from '../../common/axes';
import { semanticTooltip } from '../../common/tooltip';
import { paletteColor } from '../../common/theme';
import { continuousColorScale } from '../../common/colors';

export function compileCorrelationMatrix(spec: CorrelationMatrixSpec) {
  const missingColor = paletteColor(spec.theme, 'disableFontColor');
  const borderColor = paletteColor(spec.theme, 'backgroundColor');
  const variableOrder = spec.variableOrder ?? Array.from(new Set(spec.data.map(row => row.row)));
  const indexes = new Map(variableOrder.map((correlation, i) => [correlation, i]));
  const values = spec.data
    .filter(row =>
      spec.triangle === 'lower'
        ? indexes.get(row.row)! >= indexes.get(row.column)!
        : spec.triangle === 'upper'
        ? indexes.get(row.row)! <= indexes.get(row.column)!
        : true
    )
    .map(row => ({ ...row, method: spec.method }));
  const chart = commonChart(
    spec,
    [
      {
        type: 'heatmap',
        id: 'matrix',
        data: { id: 'observations', values: values.filter(row => row.correlation !== null) },
        xField: 'column',
        yField: 'row',
        valueField: 'correlation',
        cell: { style: { fill: { field: 'correlation', scale: 'correlation' }, stroke: borderColor, lineWidth: 1 } },
        label: {
          visible: true,
          smartInvert: { contrastRatiosThreshold: 4.5 },
          style: { fill: '#000000', stroke: false, fontSize: 11 },
          formatMethod: text => Number(text).toFixed(2)
        },
        tooltip: semanticTooltip(['row', 'column', 'correlation', 'method'], {
          correlation: '相关系数',
          ...spec.fieldLabels
        })
      },
      {
        type: 'heatmap',
        id: 'missing',
        data: { id: 'missing', values: values.filter(row => row.correlation === null) },
        xField: 'column',
        yField: 'row',
        valueField: 'correlation',
        cell: { style: { fill: missingColor, stroke: borderColor, lineWidth: 1 } },
        label: {
          visible: true,
          smartInvert: { contrastRatiosThreshold: 4.5 },
          formatMethod: () => 'NA',
          style: { fill: paletteColor(spec.theme, 'primaryFontColor'), stroke: false, fontSize: 11 }
        },
        tooltip: semanticTooltip(['row', 'column', 'correlation', 'method'], {
          correlation: '相关系数',
          ...spec.fieldLabels
        })
      }
    ],
    [
      categoryAxis('bottom', spec.fieldLabels?.column ?? '', variableOrder),
      categoryAxis('left', spec.fieldLabels?.row ?? '', variableOrder)
    ]
  );
  chart.scales = [continuousColorScale(spec, 'diverging', 'correlation', -1, 1)];
  chart.legends = {
    visible: true,
    type: 'color',
    scale: 'correlation',
    orient: 'right',
    filter: false,
    slidable: false,
    title: { visible: true, text: spec.method }
  };
  return chart;
}
