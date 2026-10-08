import type { ResidualPlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { points, zeroLine } from '../../common/marks';
export function compileResidual(spec: ResidualPlotSpec) {
  const label = { raw: '原始残差', standardized: '标准化残差', studentized: '学生化残差' }[spec.residualKind];
  const chart = commonChart(
    spec,
    [
      points(
        'residuals',
        spec.data.map(row => ({ ...row, residualKind: label })),
        'fittedValue',
        'residual',
        ['id', 'fittedValue', 'residual', 'residualKind'],
        spec.fieldLabels
      )
    ],
    [
      numberAxis('bottom', spec.fieldLabels?.fittedValue ?? '拟合值'),
      numberAxis('left', spec.fieldLabels?.residual ?? label)
    ]
  );
  chart.markLine = zeroLine;
  chart.legends = { visible: spec.data.some(row => row.series !== undefined), orient: 'top' };
  return chart;
}
