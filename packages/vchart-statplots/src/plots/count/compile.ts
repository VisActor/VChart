import type { CountPlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { categoryAxis, numberAxis } from '../../common/axes';
import { semanticTooltip } from '../../common/tooltip';
export function compileCount(spec: CountPlotSpec) {
  const totals = new Map<string | undefined, number>();
  spec.data.forEach(row => totals.set(row.series, (totals.get(row.series) ?? 0) + row.count));
  const proportion = spec.statistic === 'proportion';
  const values = spec.data
    .filter(row => !proportion || totals.get(row.series)! > 0)
    .map(row => ({ ...row, proportion: row.count / (totals.get(row.series) || 1) }));
  const chart = commonChart(
    spec,
    [
      {
        type: 'bar',
        id: 'counts',
        data: { id: 'counts', values },
        xField: spec.data.some(row => row.series !== undefined) ? ['category', 'series'] : 'category',
        yField: proportion ? 'proportion' : 'count',
        seriesField: 'series',
        stack: false,
        tooltip: semanticTooltip(['category', 'count', ...(proportion ? ['proportion'] : [])], {
          proportion: '系列内比例',
          ...spec.fieldLabels
        })
      }
    ],
    [
      categoryAxis('bottom', spec.fieldLabels?.category ?? '类别'),
      {
        ...numberAxis(
          'left',
          proportion ? spec.fieldLabels?.proportion ?? '系列内比例' : spec.fieldLabels?.count ?? '计数',
          proportion
        ),
        zero: true
      }
    ]
  );
  chart.legends = { visible: spec.data.some(row => row.series !== undefined), orient: 'top' };
  return chart;
}
