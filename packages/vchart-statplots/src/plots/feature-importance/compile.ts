import type { FeatureImportancePlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { categoryAxis, numberAxis } from '../../common/axes';
import { semanticTooltip } from '../../common/tooltip';
import { intervalLabel } from '../../common/interval';
import { paletteColor } from '../../common/theme';
export function compileFeatureImportance(spec: FeatureImportancePlotSpec) {
  const values = spec.data.map(row => ({
    ...row,
    method: spec.method,
    interval: spec.interval ? intervalLabel(spec.interval) : undefined
  }));
  const grouped = spec.data.some(row => row.series !== undefined);
  const yField = grouped ? ['feature', 'series'] : 'feature';
  const tooltip = semanticTooltip(['feature', 'importance', 'lower', 'upper', 'method', 'interval'], spec.fieldLabels);
  const chart = commonChart(
    spec,
    [
      {
        type: 'bar',
        id: 'importance',
        direction: 'horizontal',
        data: { id: 'importance', values },
        xField: 'importance',
        yField,
        seriesField: 'series',
        stack: false,
        tooltip
      },
      ...(values.some(row => row.lower !== undefined)
        ? [
            {
              type: 'rangeColumn' as const,
              id: 'intervals',
              direction: 'horizontal' as const,
              data: { id: 'intervals', values: values.filter(row => row.lower !== undefined) },
              xField: ['lower', 'upper'],
              yField,
              seriesField: 'series',
              minField: 'lower',
              maxField: 'upper',
              barWidth: 2,
              bar: { style: { fill: paletteColor(spec.theme, 'primaryFontColor') } },
              tooltip
            }
          ]
        : [])
    ],
    [
      { ...numberAxis('bottom', spec.fieldLabels?.importance ?? `重要性（${spec.method}）`), zero: true },
      categoryAxis('left', spec.fieldLabels?.feature ?? '特征', [...new Set(values.map(row => row.feature))])
    ]
  );
  chart.legends = { visible: grouped, orient: 'top', seriesId: ['importance', 'intervals'] };
  return chart;
}
