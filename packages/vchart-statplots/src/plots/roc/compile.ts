import type { ICommonChartSpec } from '@visactor/vchart';
import type { RocCurveSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { semanticTooltip } from '../../common/tooltip';

export function compileRoc(spec: RocCurveSpec): ICommonChartSpec {
  const fieldLabels = { fpr: '假阳性率 FPR', tpr: '真阳性率 TPR', ...spec.fieldLabels };
  const metrics = new Map(spec.metrics?.map(metric => [metric.series, metric.auc]));
  const chart = commonChart(
    spec,
    [
      {
        type: 'line',
        id: 'roc',
        data: { id: 'observations', values: spec.data.map(row => ({ ...row, auc: metrics.get(row.series) })) },
        xField: 'fpr',
        yField: 'tpr',
        seriesField: 'series',
        line: { style: { curveType: 'linear', lineWidth: 2 } },
        point: { visible: true, style: { size: 5 } },
        tooltip: semanticTooltip(['fpr', 'tpr', 'threshold', ...(spec.metrics ? ['auc'] : [])], fieldLabels)
      }
    ],
    [numberAxis('bottom', fieldLabels.fpr, true), numberAxis('left', fieldLabels.tpr, true)]
  );
  chart.markLine = {
    coordinates: [
      { fpr: 0, tpr: 0 },
      { fpr: 1, tpr: 1 }
    ],
    line: { style: { lineDash: [4, 4] } },
    endSymbol: { visible: false },
    label: { visible: false }
  };
  chart.legends = { visible: spec.data.some(row => row.series !== undefined), orient: 'top' };
  return chart;
}
