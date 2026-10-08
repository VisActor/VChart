import type { IScatterSeriesSpec } from '@visactor/vchart';
import type { HexbinPlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { points } from '../../common/marks';
import { continuousColorScale } from '../../common/colors';
export function compileHexbin(spec: HexbinPlotSpec) {
  const vertices = spec.data.flatMap(row => row.vertices);
  const range = (axis: 'x' | 'y') =>
    vertices.reduce(([min, max], v) => [Math.min(min, v[axis]), Math.max(max, v[axis])], [Infinity, -Infinity]);
  const [xMin, xMax] = range('x'),
    [yMin, yMax] = range('y');
  const values = spec.data.map(row => ({
    ...row,
    vertices: row.vertices.map(v => ({ ...v })),
    xMin: Math.min(...row.vertices.map(v => v.x)),
    xMax: Math.max(...row.vertices.map(v => v.x)),
    yMin: Math.min(...row.vertices.map(v => v.y)),
    yMax: Math.max(...row.vertices.map(v => v.y)),
    x: row.vertices.reduce((sum, v) => sum + v.x, 0) / 6,
    y: row.vertices.reduce((sum, v) => sum + v.y, 0) / 6
  }));
  const series = points('bins', values, 'x', 'y', ['id', 'count', 'xMin', 'xMax', 'yMin', 'yMax'], spec.fieldLabels);
  series.type = 'statplotsHexbin' as IScatterSeriesSpec['type'];
  const chart = commonChart(
    spec,
    [series],
    [
      {
        ...numberAxis('bottom', spec.fieldLabels?.x ?? 'x'),
        ...(vertices.length ? { min: xMin, max: xMax, nice: false } : {})
      },
      {
        ...numberAxis('left', spec.fieldLabels?.y ?? 'y'),
        ...(vertices.length ? { min: yMin, max: yMax, nice: false } : {})
      }
    ]
  );
  chart.scales = [
    continuousColorScale(
      spec,
      'sequential',
      'hex-count',
      0,
      spec.data.reduce((max, row) => Math.max(max, row.count), 1)
    )
  ];
  chart.legends = {
    visible: true,
    type: 'color',
    scale: 'hex-count',
    filter: false,
    slidable: false,
    orient: 'right',
    title: { visible: true, text: spec.fieldLabels?.count ?? '计数' }
  };
  return chart;
}
