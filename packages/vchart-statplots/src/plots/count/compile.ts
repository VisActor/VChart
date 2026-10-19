import type { CountPlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { categoryAxis, numberAxis } from '../../common/axes';
import { semanticTooltip } from '../../common/tooltip';
import { aggregateCounts } from './aggregation';
export function compileCount(spec: CountPlotSpec) {
  const proportion = spec.statistic === 'proportion';
  const values = aggregateCounts(spec);
  const proportionLabel = spec.normalizationScope === 'series' ? '系列内比例' : '全表比例';
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
          proportion: proportionLabel,
          ...spec.fieldLabels
        })
      }
    ],
    [
      categoryAxis('bottom', spec.fieldLabels?.category ?? '类别'),
      {
        ...numberAxis(
          'left',
          proportion ? spec.fieldLabels?.proportion ?? proportionLabel : spec.fieldLabels?.count ?? '计数',
          proportion
        ),
        zero: true
      }
    ]
  );
  chart.legends = { visible: spec.data.some(row => row.series !== undefined), orient: 'top' };
  return chart;
}
