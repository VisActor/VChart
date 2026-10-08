import type { MissingValueMatrixSpec } from './types';
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
          values: spec.data.map(row => ({ ...row, status: row.isMissing ? '缺失' : '已观测' }))
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
        ...categoryAxis('bottom', spec.fieldLabels?.variable ?? '变量', [
          ...new Set(spec.data.map(row => row.variable))
        ]),
        sampling: false,
        grid: {
          visible: true,
          alignWithLabel: false,
          zIndex: 500,
          style: { stroke: paletteColor(spec.theme, 'backgroundColor'), lineWidth: 1, lineDash: [] }
        }
      },
      {
        ...categoryAxis('left', spec.fieldLabels?.observationId ?? '观测', [
          ...new Set(spec.data.map(row => row.observationId))
        ]),
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
