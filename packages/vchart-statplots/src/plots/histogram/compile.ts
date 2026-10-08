import type { ICommonChartSpec } from '@visactor/vchart';
import type { HistogramSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { semanticTooltip } from '../../common/tooltip';
import { paletteColor } from '../../common/theme';

export function compileHistogram(spec: HistogramSpec): ICommonChartSpec {
  const totals = new Map<string | undefined, number>();
  spec.data.forEach(row => totals.set(row.series, (totals.get(row.series) ?? 0) + row.count));
  const statistic = spec.statistic ?? 'count';
  const values = spec.data
    .filter(row => totals.get(row.series)! > 0)
    .map(row => ({
      ...row,
      height:
        statistic === 'count'
          ? row.count
          : row.count / totals.get(row.series)! / (statistic === 'density' ? row.binEnd - row.binStart : 1)
    }));
  const fieldLabels = { value: '数值', count: '数量', proportion: '比例', density: '概率密度', ...spec.fieldLabels };
  const yAxis = numberAxis('left', fieldLabels[statistic]);
  yAxis.zero = true;
  const chart = commonChart(
    spec,
    [
      {
        type: 'bar',
        id: 'histogram',
        data: { id: 'observations', values },
        xField: 'binStart',
        x2Field: 'binEnd',
        yField: 'height',
        seriesField: 'series',
        stack: false,
        bar: { style: { fillOpacity: 0.6, stroke: paletteColor(spec.theme, 'backgroundColor'), lineWidth: 1 } },
        tooltip: semanticTooltip(['binStart', 'binEnd', 'count', 'height'], {
          ...fieldLabels,
          height: fieldLabels[statistic]
        })
      }
    ],
    [numberAxis('bottom', fieldLabels.value), yAxis]
  );
  chart.legends = { visible: spec.data.some(row => row.series !== undefined), orient: 'top' };
  return chart;
}
