import type { IScatterSeriesSpec } from '@visactor/vchart';
import type { StripPlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { categoryAxis, numberAxis } from '../../common/axes';
import { points } from '../../common/marks';
import { jitterOffset } from '../../common/jitter';
export function compileStripPlot(spec: StripPlotSpec) {
  const grouped = spec.data.some(row => row.series !== undefined);
  const series = points(
    'observations',
    spec.data.map(row => ({
      ...row,
      __key: row.id,
      __group: JSON.stringify([row.category, row.series]),
      __offset: spec.layout === 'jitter' ? jitterOffset(row.id) * (spec.jitterRatio ?? 0.3) : 0
    })),
    grouped ? ['category', 'series'] : 'category',
    'value',
    ['id', 'category', 'value', '__crowded'],
    spec.fieldLabels
  );
  series.type = (spec.layout === 'swarm' ? 'statplotsSwarm' : 'statplotsStrip') as IScatterSeriesSpec['type'];
  const chart = commonChart(
    {
      ...spec,
      description:
        spec.layout === 'swarm'
          ? [spec.description, '拥挤点以空心警告色标出；放大图表可减少重叠。'].filter(Boolean).join(' · ')
          : spec.description
    },
    [series],
    [categoryAxis('bottom', spec.fieldLabels?.category ?? '类别'), numberAxis('left', spec.fieldLabels?.value ?? '值')]
  );
  chart.legends = { visible: grouped, orient: 'top' };
  return chart;
}
