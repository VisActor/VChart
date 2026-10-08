import type { BoxPlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { categoryAxis, numberAxis } from '../../common/axes';
import { semanticTooltip } from '../../common/tooltip';
export function compileBoxPlot(spec: BoxPlotSpec) {
  const grouped = spec.data.some(row => row.series !== undefined);
  const chart = commonChart(
    spec,
    [
      {
        type: 'boxPlot',
        id: 'boxPlot',
        direction: 'vertical',
        data: {
          id: 'observations',
          values: spec.data.map(row => ({ ...row, outliers: row.outliers?.slice(), whiskerRule: spec.whiskerRule }))
        },
        xField: grouped ? ['category', 'series'] : 'category',
        seriesField: 'series',
        yField: ['whiskerLower', 'q1', 'median', 'q3', 'whiskerUpper', 'outliers'],
        minField: 'whiskerLower',
        maxField: 'whiskerUpper',
        q1Field: 'q1',
        medianField: 'median',
        q3Field: 'q3',
        outliersField: 'outliers',
        boxWidth: '55%',
        tooltip: semanticTooltip(['whiskerLower', 'q1', 'median', 'q3', 'whiskerUpper', 'whiskerRule'], {
          whiskerLower: '须下端',
          q1: '第一四分位数',
          median: '中位数',
          q3: '第三四分位数',
          whiskerUpper: '须上端',
          whiskerRule: '须定义'
        })
      }
    ],
    [
      categoryAxis('bottom', spec.fieldLabels?.category ?? '分组'),
      numberAxis('left', spec.fieldLabels?.value ?? '数值')
    ]
  );
  chart.legends = { visible: grouped, orient: 'top' };
  return chart;
}
