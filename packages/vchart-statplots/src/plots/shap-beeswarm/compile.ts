import type { IScatterSeriesSpec } from '@visactor/vchart';
import { createScale } from '@visactor/vchart';
import type { ShapBeeswarmPlotSpec } from './types';
import { commonChart } from '../../common/chart';
import { categoryAxis, numberAxis } from '../../common/axes';
import { points } from '../../common/marks';
import { paletteColor } from '../../common/theme';
import { continuousColorScale } from '../../common/colors';
export function compileShapBeeswarm(spec: ShapBeeswarmPlotSpec) {
  const missingColor = paletteColor(spec.theme, 'disableFontColor');
  const constantColor = paletteColor(spec.theme, 'tertiaryFontColor');
  const colorSpec = continuousColorScale(spec, 'sequential', 'feature-value', 0, 1);
  const colorScale = createScale('linear')!.domain(colorSpec.domain).range(colorSpec.range);
  const ranges = new Map<string, [number, number]>();
  spec.data.forEach(row => {
    if (row.featureValue !== null) {
      const r = ranges.get(row.feature) ?? [Infinity, -Infinity];
      r[0] = Math.min(r[0], row.featureValue);
      r[1] = Math.max(r[1], row.featureValue);
      ranges.set(row.feature, r);
    }
  });
  const values = spec.data.map(row => {
    const r = ranges.get(row.feature);
    return {
      ...row,
      __key: JSON.stringify([row.id, row.feature]),
      __group: row.feature,
      __featureColor:
        row.featureValue === null ? null : r![0] === r![1] ? 0.5 : (row.featureValue - r![0]) / (r![1] - r![0])
    };
  });
  const series = points(
    'shap',
    values,
    'shapValue',
    'feature',
    ['id', 'feature', 'shapValue', 'featureValue', '__crowded'],
    { ...spec.fieldLabels, __crowded: '拥挤重叠' }
  );
  series.type = 'statplotsSwarm' as IScatterSeriesSpec['type'];
  series.direction = 'horizontal';
  // 用语义数据预生成颜色，避免在每次 hover/渲染时计算特征范围。
  values.forEach(row => {
    const t = row.__featureColor;
    if (t !== null) {
      (row as typeof row & { __fill?: string }).__fill = colorScale.scale(t);
    }
  });
  series.point = {
    style: {
      fill: row =>
        row.__featureColor === null
          ? missingColor
          : ranges.get(row.feature)![0] === ranges.get(row.feature)![1]
          ? constantColor
          : row.__fill
    }
  };
  const chart = commonChart(
    {
      ...spec,
      description: [spec.description, '颜色表示特征内的相对值；灰色表示缺失或常量，空心警告色表示拥挤重叠。']
        .filter(Boolean)
        .join(' · ')
    },
    [series],
    [
      numberAxis('bottom', spec.fieldLabels?.shapValue ?? 'SHAP 值'),
      categoryAxis('left', spec.fieldLabels?.feature ?? '特征', spec.featureOrder)
    ]
  );
  chart.markLine = { x: 0, endSymbol: { visible: false }, line: { style: { lineDash: [4, 4] } } };
  chart.scales = [colorSpec];
  chart.legends = {
    visible: true,
    type: 'color',
    scale: 'feature-value',
    filter: false,
    slidable: false,
    orient: 'right',
    title: { visible: true, text: '特征内相对值' }
  };
  return chart;
}
