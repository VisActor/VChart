import type { ScreePlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { categoryAxis, numberAxis } from '../../common/axes';
import { curve } from '../../common/marks';
import { semanticTooltip } from '../../common/tooltip';
export function compileScree(spec: ScreePlotSpec) {
  let cumulative = 0;
  const values = spec.data.map(row => ({
    ...row,
    __component: String(row.component),
    cumulative: (cumulative += row.explainedVarianceRatio)
  }));
  const line = curve(
    'cumulative',
    values.map(row => ({ ...row })),
    '__component',
    'cumulative',
    ['component', 'cumulative'],
    { cumulative: '累计解释率' }
  );
  // 两个系列由公共分类色板区分。
  line.seriesField = undefined;
  return commonChart(
    spec,
    [
      {
        type: 'bar',
        id: 'variance',
        data: { id: 'variance', values },
        xField: '__component',
        yField: 'explainedVarianceRatio',
        tooltip: semanticTooltip(['component', 'explainedVarianceRatio'], {
          component: '成分',
          explainedVarianceRatio: '解释率',
          ...spec.fieldLabels
        })
      },
      ...(spec.showCumulative ? [line] : [])
    ],
    [
      categoryAxis(
        'bottom',
        spec.fieldLabels?.component ?? '成分',
        values.map(row => row.__component)
      ),
      numberAxis('left', spec.fieldLabels?.explainedVarianceRatio ?? '解释方差比率', true)
    ]
  );
}
