import type { ICommonChartSpec, ICartesianAxisSpec } from '@visactor/vchart';
import type { PointIntervalPlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { categoryAxis, numberAxis } from '../../common/axes';
import { semanticTooltip } from '../../common/tooltip';
import { summarizePointIntervals } from './statistics';

export function compileEstimateInterval(spec: PointIntervalPlotSpec): ICommonChartSpec {
  const grouped = spec.data.some(row => row.series !== undefined);
  const yField = grouped ? ['category', 'series'] : 'category';
  const values = summarizePointIntervals(spec);
  const intervals = values.filter(row => row.lower !== null);
  const tooltip = semanticTooltip(['category', 'estimate', 'lower', 'upper', 'interval', 'sampleCount'], {
    ...spec.fieldLabels,
    lower: '下界',
    upper: '上界',
    interval: '区间定义',
    sampleCount: '样本数'
  });
  const axis = {
    ...numberAxis('bottom', spec.fieldLabels?.estimate ?? '估计值'),
    type: spec.valueScale ?? 'linear'
  } as ICartesianAxisSpec;
  const chart = commonChart(
    spec,
    [
      {
        type: 'rangeColumn',
        id: 'intervals',
        direction: 'horizontal',
        data: { id: 'intervals', values: intervals },
        xField: ['lower', 'upper'],
        yField,
        minField: 'lower',
        maxField: 'upper',
        seriesField: 'series',
        barWidth: 2,
        tooltip
      },
      {
        type: 'scatter',
        id: 'estimates',
        data: { id: 'estimates', values: values.map(row => ({ ...row })) },
        xField: 'estimate',
        yField,
        seriesField: 'series',
        size: 8,
        tooltip
      },
      {
        type: 'scatter',
        id: 'caps',
        data: {
          id: 'caps',
          values: intervals.flatMap(row => [
            { ...row, bound: row.lower },
            { ...row, bound: row.upper }
          ])
        },
        xField: 'bound',
        yField,
        seriesField: 'series',
        point: { style: { shape: 'square', size: 10, scaleX: 0.2 } },
        tooltip
      }
    ],
    [axis, categoryAxis('left', spec.fieldLabels?.category ?? '分组')]
  );
  chart.legends = { visible: grouped, orient: 'top', seriesId: ['estimates', 'intervals', 'caps'] };
  if (spec.referenceLine) {
    chart.markLine = {
      x: spec.referenceLine.value,
      endSymbol: { visible: false },
      line: { style: { lineDash: [4, 4] } },
      label: { visible: !!spec.referenceLine.label, text: spec.referenceLine.label }
    };
  }
  return chart;
}
