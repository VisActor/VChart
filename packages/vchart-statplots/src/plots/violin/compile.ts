import type { IAreaSeriesSpec, ICommonChartSpec, ICartesianLinearAxisSpec } from '@visactor/vchart';
import type { ViolinPlotSpec } from './types';
import { prepareViolin, estimateViolin } from './estimation';
import { commonChart } from '../../common/chart';
import { categoryAxis, numberAxis } from '../../common/axes';

export function compileViolin(spec: ViolinPlotSpec): ICommonChartSpec {
  const prepared = prepareViolin(spec);
  const { values, summaries } = estimateViolin(
    prepared,
    spec.densityNormalization ?? 'area',
    spec.normalizationScope ?? 'series'
  );
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
      content: (['count', 'minimum', 'maximum', 'bandwidth', 'peakDensity'] as const)
        .map((field, i) => ({
          key: [
            '样本数',
            fieldLabels.value + '（原始最小值）',
            fieldLabels.value + '（原始最大值）',
            '实际带宽',
            fieldLabels.density + '（峰值）'
          ][i],
          value: (datum: import('@visactor/vchart').Datum | undefined) =>
            String(summaries.get(first(datum!).__violinGroup)![field])
        }))
        .concat([
          { key: '宽度归一化', value: () => spec.densityNormalization ?? 'area' },
          { key: '归一化范围', value: () => spec.normalizationScope ?? 'series' }
        ])
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
  Object.assign(chart.axes![1] as ICartesianLinearAxisSpec, {
    min: prepared.domain[0],
    max: prepared.domain[1],
    nice: false
  });
  chart.legends = { visible: grouped, orient: 'top' };
  return chart;
}
