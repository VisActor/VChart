import type { ICommonChartSpec } from '@visactor/vchart';
import type { RocCurveSpec } from './types';
import { commonChart } from '../../common/chart';
import { numberAxis } from '../../common/axes';
import { semanticTooltip } from '../../common/tooltip';
import { computeRoc } from './distribution';

export function compileRoc(spec: RocCurveSpec): ICommonChartSpec {
  const fieldLabels = {
    fpr: '假阳性率 FPR',
    tpr: '真阳性率 TPR',
    auc: 'AUC',
    sampleCount: '样本数',
    ...spec.fieldLabels
  };
  const values = computeRoc(spec);
  const chart = commonChart(
    spec,
    [
      {
        type: 'line',
        id: 'roc',
        data: { id: 'observations', values: values },
        xField: 'fpr',
        yField: 'tpr',
        seriesField: 'series',
        line: { style: { curveType: 'linear', lineWidth: 2 } },
        point: { visible: true, style: { size: 5 } },
        tooltip: semanticTooltip(['fpr', 'tpr', 'threshold', 'auc', 'sampleCount'], fieldLabels)
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
