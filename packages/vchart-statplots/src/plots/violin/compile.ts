import type { IAreaSeriesSpec, ICommonChartSpec } from '@visactor/vchart';
import type { ViolinPlotSpec } from './types';
import { violinGroups } from './validate';
import { commonChart } from '../../common/chart';
import { categoryAxis, numberAxis } from '../../common/axes';

export function compileViolin(spec: ViolinPlotSpec): ICommonChartSpec {
  const groups = violinGroups(spec.data);
  const widths = new Map<string, number>();
  let largest = 0;
  const summaries = new Map<string, { minimum: number; maximum: number; peakDensity: number }>();
  for (const [key, points] of groups) {
    let area = 0;
    let maximum = 0;
    points.forEach(({ row }, i) => {
      maximum = Math.max(maximum, row.density);
      if (i) {
        const previous = points[i - 1].row;
        area += ((row.value - previous.value) * (row.density + previous.density)) / 2;
      }
    });
    summaries.set(key, {
      minimum: points[0].row.value,
      maximum: points[points.length - 1].row.value,
      peakDensity: maximum
    });
    const divisor = spec.densityNormalization === 'area' ? area : maximum;
    widths.set(key, divisor);
    largest = Math.max(largest, maximum / divisor);
  }
  const values = spec.data.map(row => {
    const key = JSON.stringify([row.category, row.series]);
    return { ...row, __violinGroup: key, __densityWidth: row.density / widths.get(key)! / largest };
  });
  const grouped = spec.data.some(row => row.series !== undefined);
  const fieldLabels = { category: '分组', value: '数值', density: '概率密度', ...spec.fieldLabels };
  // 面积图元携带整组采样数据，tooltip 展示组摘要，避免误把首个采样点当作指针位置。
  const first = (datum: import('@visactor/vchart').Datum) => (Array.isArray(datum) ? datum[0] : datum);
  const tooltip: import('@visactor/vchart').ITooltipSpec = {
    activeType: ['mark'],
    mark: {
      title: {
        value: datum => {
          const row = first(datum!);
          return [row.category, row.series].filter(Boolean).join(' · ');
        }
      },
      content: (['minimum', 'maximum', 'peakDensity'] as const).map((field, i) => ({
        key: [fieldLabels.value + '（采样下界）', fieldLabels.value + '（采样上界）', fieldLabels.density + '（峰值）'][
          i
        ],
        value: datum => String(summaries.get(first(datum!).__violinGroup)![field])
      }))
    }
  };
  // CommonChart 的 TS 联合仅列内建系列，注册系列在这里跨越一次类型边界。
  const series = {
    type: 'statplotsViolin',
    id: 'violin',
    stack: false,
    data: { id: 'observations', values },
    xField: grouped ? ['category', 'series'] : 'category',
    yField: 'value',
    seriesField: 'series',
    point: { visible: false },
    line: { visible: false },
    area: { visible: true, style: { fillOpacity: 0.75 } },
    tooltip
  } as unknown as IAreaSeriesSpec;
  const chart = commonChart(
    spec,
    [series],
    [categoryAxis('bottom', fieldLabels.category), numberAxis('left', fieldLabels.value)]
  );
  chart.legends = { visible: grouped, orient: 'top' };
  return chart;
}
