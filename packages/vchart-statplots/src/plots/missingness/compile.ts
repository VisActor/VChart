import type { MissingValueMatrixSpec } from './types';
import { buildMissingnessCells } from './statistics';
import type { IHeatmapSeriesSpec } from '@visactor/vchart';
import { commonChart } from '../../common/chart';
import { categoryAxis } from '../../common/axes';
import { semanticTooltip } from '../../common/tooltip';
import { paletteColor } from '../../common/theme';
import { categoricalColors } from '../../common/colors';
export function compileMissingness(spec: MissingValueMatrixSpec) {
  const chart = commonChart(
    spec,
    [
      {
        type: 'statplotsMissingness',
        id: 'missingness',
        data: {
          id: 'missingness',
          values: buildMissingnessCells(spec)
        },
        xField: 'variable',
        yField: 'observationId',
        valueField: 'status',
        seriesField: 'status',
        cell: { style: { fill: { scale: 'missing', field: 'status' } } },
        tooltip: semanticTooltip(['observationId', 'variable', 'status'], { ...spec.fieldLabels, status: '状态' })
      } as unknown as IHeatmapSeriesSpec
    ],
    [
      {
        ...categoryAxis('bottom', spec.fieldLabels?.variable ?? '变量', spec.variables),
        sampling: false,
        grid: {
          visible: true,
          alignWithLabel: false,
          zIndex: 500,
          style: { stroke: paletteColor(spec.theme, 'backgroundColor'), lineWidth: 1, lineDash: [] }
        }
      },
      {
        ...categoryAxis(
          'left',
          spec.fieldLabels?.observationId ?? '观测',
          spec.data.observations.map(row => row.id)
        ),
        sampling: true
      }
    ].map(axis => ({
      ...axis,
      paddingInner: 0,
      paddingOuter: 0,
      domainLine: { visible: false },
      tick: { visible: false },
      label: { autoLimit: true, autoHide: true }
    }))
  );
  chart.scales = [
    {
      id: 'missing',
      type: 'ordinal',
      domain: ['已观测', '缺失'],
      range: [
        categoricalColors(spec)?.[0] ?? paletteColor(spec.theme, 'infoColor'),
        paletteColor(spec.theme, 'disableFontColor')
      ]
    }
  ];
  chart.legends = { visible: true, orient: 'top', scale: 'missing' };
  return chart;
}
