import type { IScatterSeriesSpec, ILayoutSpec } from '@visactor/vchart';
import type { HexbinPlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { points } from '../../common/marks';
import { continuousColorScale } from '../../common/colors';
import { binHexagons } from './binning';
import type { HexbinLayoutSpec } from '../../layout/hexbin';

export function compileHexbin(spec: HexbinPlotSpec) {
  const result = binHexagons(spec.data, spec.binning?.xBins ?? 30);
  const xLabel = spec.fieldLabels?.x ?? 'x',
    yLabel = spec.fieldLabels?.y ?? 'y';
  const series = points('bins', result.bins, 'x', 'y', ['count', 'xMin', 'xMax', 'yMin', 'yMax'], {
    count: spec.fieldLabels?.count ?? '计数',
    xMin: `${xLabel}包围盒下界`,
    xMax: `${xLabel}包围盒上界`,
    yMin: `${yLabel}包围盒下界`,
    yMax: `${yLabel}包围盒上界`
  });
  series.type = 'statplotsHexbin' as IScatterSeriesSpec['type'];
  const chart = commonChart(
    spec,
    [series],
    [
      { ...numberAxis('bottom', xLabel), min: result.xDomain[0], max: result.xDomain[1], nice: false },
      { ...numberAxis('left', yLabel), min: result.yDomain[0], max: result.yDomain[1], nice: false }
    ]
  );
  const layout: HexbinLayoutSpec = { type: 'statplotsHexbin', normalizedAspect: result.normalizedAspect };
  chart.layout = layout as unknown as ILayoutSpec;
  chart.scales = [
    continuousColorScale(
      spec,
      'sequential',
      'hex-count',
      0,
      result.bins.reduce((max, bin) => Math.max(max, bin.count), 1)
    )
  ];
  chart.legends = {
    visible: result.bins.length > 0,
    type: 'color',
    scale: 'hex-count',
    filter: false,
    slidable: false,
    orient: 'right',
    title: { visible: true, text: spec.fieldLabels?.count ?? '计数' }
  };
  return chart;
}
