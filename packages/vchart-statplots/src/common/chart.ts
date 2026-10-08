import type { ICommonChartSpec, ICartesianAxisSpec } from '@visactor/vchart';
import type { BaseSpec } from './types';
import { categoricalColors } from './colors';

export function commonChart(
  spec: BaseSpec,
  series: NonNullable<ICommonChartSpec['series']>,
  axes: ICartesianAxisSpec[]
): ICommonChartSpec {
  const empty = series.every(item => !(item as { data: { values: unknown[] } }).data.values.length);
  const description = empty ? [spec.description, '暂无可绘制数据'].filter(Boolean).join(' · ') : spec.description;
  return {
    type: 'common',
    theme: spec.theme ?? 'light',
    color: categoricalColors(spec),
    padding: 16,
    title:
      spec.title || description ? { text: spec.title ?? '', subtext: description, padding: { bottom: 16 } } : undefined,
    axes,
    series: series.map(item => ({ ...item, animation: false })),
    legends: { visible: false }
  };
}
