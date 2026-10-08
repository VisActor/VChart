import type { ICommonChartSpec, ICartesianAxisSpec, IGridLayoutSpec } from '@visactor/vchart';
import type { PairPlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { points } from '../../common/marks';
import { semanticTooltip } from '../../common/tooltip';
export function compilePairPlot(spec: PairPlotSpec) {
  const n = spec.variables.length;
  const grouped = spec.data.observations.some(row => row.series !== undefined);
  const domains = new Map<string, [number, number]>();
  const diagonals = new Map(spec.data.diagonal.map(row => [row.variable, row.bins]));
  spec.variables.forEach(variable => {
    let min = Infinity,
      max = -Infinity;
    spec.data.observations.forEach(row => {
      const v = row.values[variable];
      if (v !== null) {
        min = Math.min(min, v);
        max = Math.max(max, v);
      }
    });
    diagonals.get(variable)!.forEach(bin => {
      min = Math.min(min, bin.binStart);
      max = Math.max(max, bin.binEnd);
    });
    domains.set(variable, min === Infinity ? [0, 1] : min === max ? [min - 0.5, max + 0.5] : [min, max]);
  });
  const series: NonNullable<ICommonChartSpec['series']> = [];
  const axes: ICartesianAxisSpec[] = [];
  const region: { id: string }[] = [];
  const elements: NonNullable<IGridLayoutSpec['elements']> = [
    { modelKey: 'title', modelIndex: 0, col: 0, row: 0, colSpan: n * 3 }
  ];
  const scatterIds: string[] = [];
  spec.variables.forEach((y, r) =>
    spec.variables.forEach((x, c) => {
      const id = `panel-${r}-${c}`;
      region.push({ id });
      elements.push(
        { modelId: id, col: c * 3 + 1, row: r * 3 + 1 },
        { modelId: `x-${r}-${c}`, col: c * 3 + 1, row: r * 3 + 2 },
        { modelId: `y-${r}-${c}`, col: c * 3, row: r * 3 + 1 }
      );
      const [xMin, xMax] = domains.get(x)!,
        [yMin, yMax] = domains.get(y)!;
      const xAxis = {
        ...numberAxis('bottom', x),
        id: `x-${r}-${c}`,
        regionId: id,
        min: xMin,
        max: xMax,
        nice: false,
        tick: { tickCount: 3 }
      };
      if (r === c) {
        const values = diagonals.get(x)!.map(row => ({ ...row }));
        series.push({
          type: 'bar',
          id: `diagonal-${r}`,
          regionId: id,
          data: { id: `bins-${r}`, values },
          xField: 'binStart',
          x2Field: 'binEnd',
          yField: 'count',
          seriesField: 'series',
          stack: false,
          bar: { style: { fillOpacity: 0.45 } },
          tooltip: semanticTooltip(['binStart', 'binEnd', 'count'], {})
        });
        axes.push(xAxis, {
          ...numberAxis('left', '计数'),
          id: `y-${r}-${c}`,
          regionId: id,
          zero: true,
          tick: { tickCount: 3 }
        });
      } else {
        const values = spec.data.observations
          .filter(row => row.values[x] !== null && row.values[y] !== null)
          .map(row => ({ id: row.id, series: row.series, x: row.values[x]!, y: row.values[y]!, panelSampleSize: 0 }));
        values.forEach(row => {
          row.panelSampleSize = values.length;
        });
        const seriesId = `scatter-${r}-${c}`;
        scatterIds.push(seriesId);
        series.push({
          ...points(seriesId, values, 'x', 'y', ['id', 'x', 'y', 'panelSampleSize'], {
            x,
            y,
            panelSampleSize: '面板有效样本数'
          }),
          regionId: id,
          dataKey: 'id'
        });
        axes.push(xAxis, {
          ...numberAxis('left', `${y} · n=${values.length}`),
          id: `y-${r}-${c}`,
          regionId: id,
          min: yMin,
          max: yMax,
          nice: false,
          tick: { tickCount: 3 }
        });
      }
    })
  );
  const chart = commonChart(spec, series, axes);
  chart.region = region;
  chart.layout = {
    type: 'grid',
    col: n * 3,
    row: n * 3 + 2,
    colWidth: spec.variables.flatMap((_, i) => [
      { index: i * 3, size: 64 },
      { index: i * 3 + 2, size: 10 }
    ]),
    rowHeight: [
      { index: 0, size: spec.title || spec.description ? 58 : 8 },
      ...spec.variables.flatMap((_, i) => [
        { index: i * 3 + 1, size: (height: number) => Math.max(30, (height - (grouped ? 90 : 58)) / n - 50) },
        { index: i * 3 + 2, size: 42 },
        { index: i * 3 + 3, size: 8 }
      ]),
      { index: n * 3 + 1, size: grouped ? 32 : 0 }
    ],
    elements: [...elements, { modelKey: 'legends', modelIndex: 0, col: 0, row: n * 3 + 1, colSpan: n * 3 }]
  };
  chart.legends = { visible: grouped, orient: 'bottom', interactive: false, seriesId: scatterIds };
  // VChart 标准 brush 以 id 联动，不以不同变量面板中的相同像素框联动。
  chart.brush = {
    visible: true,
    seriesId: scatterIds,
    brushLinkSeriesId: scatterIds,
    brushLinkDataKey: 'id',
    brushMode: 'single',
    inBrush: { fillOpacity: 1 },
    outOfBrush: { fillOpacity: 0.12 }
  };
  return chart;
}
