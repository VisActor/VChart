import type { CorrelationMatrixSpec } from './types';
import { commonChart } from '../../common/chart';
import { categoryAxis } from '../../common/axes';
import { semanticTooltip } from '../../common/tooltip';
import { paletteColor } from '../../common/theme';
import { continuousColorScale } from '../../common/colors';
import type { ILayoutSpec } from '@visactor/vchart';
import { CorrelationMatrixLayout } from '../../layout/correlation-matrix';
import { createCorrelationColorBar } from './colorbar';

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
          overlap: { hideOnHit: true, avoidBaseMark: false, overlapPadding: 4, strategy: [] },
          smartInvert: { contrastRatiosThreshold: 4.5 },
          style: { fill: '#000000', stroke: false, fontSize: 11, boundsPadding: 0 },
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
          overlap: { hideOnHit: true, avoidBaseMark: false, overlapPadding: 4, strategy: [] },
          smartInvert: { contrastRatiosThreshold: 4.5 },
          formatMethod: () => 'NA',
          style: { fill: paletteColor(spec.theme, 'primaryFontColor'), stroke: false, fontSize: 11, boundsPadding: 0 }
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
    ].map(axis => ({
      ...axis,
      paddingInner: 0,
      paddingOuter: 0,
      title: { ...axis.title, visible: Boolean(axis.title?.text) },
      domainLine: { visible: false },
      tick: { visible: false },
      grid: { visible: false },
      label: { autoLimit: true, autoHide: true }
    }))
  );
  const scale = continuousColorScale(spec, 'diverging', 'correlation', -1, 1);
  chart.scales = [scale];
  chart.layout = { type: CorrelationMatrixLayout.type } as ILayoutSpec;
  if (spec.data.length) {
    chart.customMark = [createCorrelationColorBar(spec, scale)];
  }
  return chart;
}
