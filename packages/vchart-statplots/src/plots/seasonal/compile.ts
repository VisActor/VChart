import type { ICommonChartSpec, ICartesianAxisSpec } from '@visactor/vchart';
import type { SeasonalPlotSpec, SeasonalPlotRow } from './types';
import { commonChart } from '../../common/chart';
import { categoryAxis, numberAxis } from '../../common/axes';
import { curve } from '../../common/marks';

/** 只为实际存在的线补显示缺口，不修改输入或推断时间顺序。 */
function orderedRows(rows: SeasonalPlotRow[], field: 'cycle' | 'phase', order: string[], series: string | undefined) {
  const byPosition = new Map(rows.map(row => [row[field], row.value]));
  const fixedField = field === 'cycle' ? 'phase' : 'cycle';
  return order.map(position => ({
    [fixedField]: rows[0][fixedField],
    [field]: position,
    value: byPosition.get(position) ?? null,
    series
  }));
}

export function compileSeasonal(spec: SeasonalPlotSpec) {
  if (!spec.data.length) return commonChart(spec, [], []);
  const grouped = spec.data.some(row => row.series !== undefined);
  const groups = new Map<string | undefined, SeasonalPlotRow[]>();
  for (const row of spec.data) {
    const rows = groups.get(row.series);
    if (rows) rows.push(row);
    else groups.set(row.series, [row]);
  }
  if (spec.layout !== 'subseries') {
    const values: object[] = [];
    const lineLabels = new Map<string, string>();
    groups.forEach((rows, name) => {
      const cycles = new Map<string, SeasonalPlotRow[]>();
      rows.forEach(row => {
        const cycleRows = cycles.get(row.cycle);
        if (cycleRows) cycleRows.push(row);
        else cycles.set(row.cycle, [row]);
      });
      spec.cycleOrder.forEach(cycle => {
        const cycleRows = cycles.get(cycle);
        if (cycleRows) {
          const key = JSON.stringify([name, cycle]);
          const label = name === undefined ? cycle : `${name} / ${cycle}`;
          lineLabels.set(key, label);
          values.push(
            ...orderedRows(cycleRows, 'phase', spec.phaseOrder, label).map(row => ({ ...row, __lineKey: key }))
          );
        }
      });
    });
    const line = curve('seasonal', values, 'phase', 'value', ['cycle', 'phase', 'value'], spec.fieldLabels);
    line.seriesField = '__lineKey';
    line.invalidType = 'break';
    const chart = commonChart(
      spec,
      [line],
      [
        categoryAxis('bottom', spec.fieldLabels?.phase ?? '周期内位置', spec.phaseOrder),
        numberAxis('left', spec.fieldLabels?.value ?? '值')
      ]
    );
    chart.legends = {
      visible: true,
      orient: 'top',
      item: { label: { formatMethod: value => lineLabels.get(value as string)! } }
    };
    return chart;
  }
  const min = spec.data.reduce((m, r) => Math.min(m, r.value), Infinity);
  const max = spec.data.reduce((m, r) => Math.max(m, r.value), -Infinity);
  const series: NonNullable<ICommonChartSpec['series']> = [];
  const axes: ICartesianAxisSpec[] = [];
  const elements: { modelId: string; col: number; row: number }[] = [];
  spec.phaseOrder.forEach((phase, i) => {
    const regionId = `phase-${i}`;
    const values: object[] = [];
    groups.forEach((rows, name) => {
      const phaseRows = rows.filter(row => row.phase === phase);
      if (phaseRows.length) values.push(...orderedRows(phaseRows, 'cycle', spec.cycleOrder, name));
    });
    series.push({
      ...curve(`season-series-${i}`, values, 'cycle', 'value', ['cycle', 'phase', 'value'], spec.fieldLabels),
      invalidType: 'break',
      regionId
    });
    axes.push(
      {
        ...categoryAxis('bottom', `${phase} · ${spec.fieldLabels?.cycle ?? '周期'}`, spec.cycleOrder),
        id: `x-${i}`,
        regionId
      },
      { ...numberAxis('left', spec.fieldLabels?.value ?? '值'), id: `y-${i}`, regionId, min, max }
    );
    elements.push(
      { modelId: regionId, col: i * 3 + 1, row: 1 },
      { modelId: `x-${i}`, col: i * 3 + 1, row: 2 },
      { modelId: `y-${i}`, col: i * 3, row: 1 }
    );
  });
  const chart = commonChart(spec, series, axes);
  chart.region = spec.phaseOrder.map((_, i) => ({ id: `phase-${i}` }));
  chart.layout = {
    type: 'grid',
    col: spec.phaseOrder.length * 3,
    row: 4,
    rowHeight: [
      { index: 0, size: 60 },
      { index: 1, size: height => Math.max(80, height - (grouped ? 157 : 125)) },
      { index: 2, size: 65 },
      { index: 3, size: grouped ? 32 : 0 }
    ],
    colWidth: spec.phaseOrder.flatMap((_, i) => [
      { index: i * 3, size: 55 },
      { index: i * 3 + 2, size: 12 }
    ]),
    elements: [
      { modelKey: 'title', modelIndex: 0, col: 0, row: 0, colSpan: spec.phaseOrder.length * 3 },
      ...elements,
      { modelKey: 'legends', modelIndex: 0, col: 0, row: 3, colSpan: spec.phaseOrder.length * 3 }
    ]
  };
  chart.legends = { visible: grouped, orient: 'bottom' };
  return chart;
}
