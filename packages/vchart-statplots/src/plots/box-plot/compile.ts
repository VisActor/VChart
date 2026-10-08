import type { BoxPlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { categoryAxis, numberAxis } from '../../common/axes';
import { summarizeBoxPlot } from './statistics';
export function compileBoxPlot(spec: BoxPlotSpec) {
  const iqrMultiplier = spec.whiskers?.iqrMultiplier ?? 1.5;
  const labels: Record<string, string> = {
    whiskerLower: '须下端',
    q1: '第一四分位数',
    median: '中位数',
    q3: '第三四分位数',
    whiskerUpper: '须上端',
    outliers: '异常值',
    series: '系列'
  };
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
          values: summarizeBoxPlot(spec.data, iqrMultiplier)
        },
        xField: grouped ? ['category', 'series'] : 'category',
        seriesField: grouped ? 'series' : undefined,
        yField: ['whiskerLower', 'q1', 'median', 'q3', 'whiskerUpper', 'outliers'],
        minField: 'whiskerLower',
        maxField: 'whiskerUpper',
        q1Field: 'q1',
        medianField: 'median',
        q3Field: 'q3',
        outliersField: 'outliers',
        boxWidth: '55%',
        tooltip: {
          activeType: ['mark'],
          mark: {
            updateContent: content => {
              if (!content) {
                return content;
              }
              const translated = content.map(line => ({ ...line, key: labels[String(line.key)] ?? line.key }));
              if (content.some(line => line.key === 'q1')) {
                translated.push({ key: '须规则', value: `${iqrMultiplier}×IQR` });
              }
              return translated;
            }
          }
        }
      }
    ],
    [
      categoryAxis('bottom', spec.fieldLabels?.category ?? '分组'),
      numberAxis('left', spec.fieldLabels?.value ?? '数值')
    ]
  );
  chart.legends = {
    visible: grouped,
    orient: 'top',
    item: { shape: { style: item => ({ fill: item.shape?.stroke }) } }
  };
  return chart;
}
