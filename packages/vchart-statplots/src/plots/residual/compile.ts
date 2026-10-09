import type { ResidualPlotSpec } from './types';
import { buildResidualRows, type ResidualDisplayRow } from './statistics';
import { buildResidualSmooth, regressionMethodLabel } from '../../common/regression';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { points, curve, zeroLine } from '../../common/marks';
export function compileResidual(spec: ResidualPlotSpec) {
  const raw = spec.input === 'observations';
  const predictor = raw && spec.xAxis !== 'fitted';
  const xField = predictor ? 'x' : 'fittedValue';
  const label = { raw: '原始残差', standardized: '标准化残差', studentized: '学生化残差' }[
    spec.input === 'residuals' ? spec.residualKind : 'raw'
  ];
  const rows: ResidualDisplayRow[] = buildResidualRows(spec);
  const smooth = spec.smooth
    ? buildResidualSmooth(
        rows,
        row => row[xField]!,
        row => row.residual,
        spec.smooth
      )
    : [];
  if (spec.smooth) {
    const available = new Set(smooth.map(row => row.series));
    const method = regressionMethodLabel(spec.smooth);
    rows.forEach(row => {
      row.trend = available.has(row.series) ? method : '趋势不可计算：横轴取值不足';
    });
  }
  const labels = {
    ...spec.fieldLabels,
    x: raw ? spec.fieldLabels?.x ?? 'x' : 'x',
    y: raw ? spec.fieldLabels?.y ?? '实际值' : '实际值',
    actual: '实际值',
    fittedValue: spec.fieldLabels?.fittedValue ?? '拟合值',
    residual: spec.fieldLabels?.residual ?? label,
    residualKind: '残差类型',
    method: '拟合方法',
    trend: '趋势',
    estimate: '残差趋势'
  };
  const chart = commonChart(
    spec,
    [
      points(
        'residuals',
        rows,
        xField,
        'residual',
        [
          'id',
          ...(raw ? ['x', 'y'] : spec.input === 'predictions' ? ['actual'] : []),
          'fittedValue',
          'residual',
          'residualKind',
          ...(raw ? ['method'] : []),
          ...(spec.smooth ? ['trend'] : [])
        ],
        labels
      ),
      ...(spec.smooth
        ? [
            {
              ...curve('residual-trend', smooth, 'x', 'estimate', ['x', 'estimate', 'method'], {
                ...labels,
                x: labels[xField]
              }),
              point: { visible: false }
            }
          ]
        : [])
    ],
    [numberAxis('bottom', labels[xField]), numberAxis('left', labels.residual)]
  );
  chart.markLine = zeroLine;
  chart.legends = {
    visible: spec.data.some(row => row.series !== undefined),
    seriesId: chart.series!.map(item => item.id!),
    orient: 'top'
  };
  return chart;
}
