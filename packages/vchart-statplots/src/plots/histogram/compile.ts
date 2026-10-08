import type { ICommonChartSpec } from '@visactor/vchart';
import type { HistogramSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { semanticTooltip } from '../../common/tooltip';
import { paletteColor } from '../../common/theme';
import { binHistogram } from './binning';

export function compileHistogram(spec: HistogramSpec): ICommonChartSpec {
  const result = binHistogram(spec.data, spec.binning?.binCount);
  const statistic = spec.statistic ?? 'count';
  const values = result.bins.map(row => ({
    ...row,
    height:
      statistic === 'count'
        ? row.count
        : row.count / result.sampleSize / (statistic === 'density' ? row.binEnd - row.binStart : 1)
  }));
  const fieldLabels = { value: '数值', count: '数量', proportion: '比例', density: '概率密度', ...spec.fieldLabels };
  const yAxis = numberAxis('left', fieldLabels[statistic]);
  yAxis.zero = true;
  const xAxis = numberAxis('bottom', fieldLabels.value);
  xAxis.min = result.domain[0];
  xAxis.max = result.domain[1];
  xAxis.nice = false;
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
        stack: false,
        // 密集箱仍按真实数值区间绘制，不使用原生 bar 的默认最小像素宽度。
        barMinWidth: '0%',
        bar: { style: { fillOpacity: 0.6, stroke: paletteColor(spec.theme, 'backgroundColor'), lineWidth: 1 } },
        tooltip: semanticTooltip(
          statistic === 'count' ? ['binStart', 'binEnd', 'count'] : ['binStart', 'binEnd', 'count', 'height'],
          {
            binStart: `${fieldLabels.value}下界`,
            binEnd: `${fieldLabels.value}上界`,
            count: fieldLabels.count,
            height: fieldLabels[statistic]
          }
        )
      }
    ],
    [xAxis, yAxis]
  );
  return chart;
}
