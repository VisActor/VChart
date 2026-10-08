import type { ICommonChartSpec, ICartesianLinearAxisSpec } from '@visactor/vchart';
import type { BaseSpec, SeriesRow } from './types';
import { commonChart } from './chart';
import { numberAxis } from './axes';
import { semanticTooltip } from './tooltip';

export function lineChart<T extends SeriesRow>(
  spec: BaseSpec & { data: T[] },
  x: keyof T & string,
  y: keyof T & string,
  labels: Record<string, string | undefined>,
  options: { probabilityY?: boolean; step?: boolean; zeroY?: boolean } = {}
): ICommonChartSpec {
  const yAxis: ICartesianLinearAxisSpec = numberAxis('left', labels[y] ?? y, options.probabilityY);
  if (options.zeroY) {
    yAxis.zero = true;
  }
  const chart = commonChart(
    spec,
    [
      {
        type: 'line',
        id: 'curve',
        xField: x,
        yField: y,
        seriesField: 'series',
        data: { id: 'observations', values: spec.data.map(row => ({ ...row })) },
        point: { visible: true, style: { size: 4 } },
        line: { style: { curveType: options.step ? 'stepAfter' : 'linear', lineWidth: 2 } },
        tooltip: semanticTooltip([x, y], labels)
      }
    ],
    [numberAxis('bottom', labels[x] ?? x), yAxis]
  );
  chart.legends = { visible: spec.data.some(row => row.series !== undefined), orient: 'top' };
  return chart;
}
