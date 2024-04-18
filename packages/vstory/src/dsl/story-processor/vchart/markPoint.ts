import type { VChart, IChartSpec, IMarkPointSpec } from '@visactor/vchart';
import type { Tag } from '@visactor/vrender-components';
import type { MarkPointAction } from '../../types/MarkPoint';
import type { IGraphic } from '@visactor/vrender-core';

export const markPointProcessor = async (chartInstance: VChart, spec: IChartSpec, markPointAction: MarkPointAction) => {
  const action = markPointAction;
  const markPoint: IMarkPointSpec[] = (spec as any).markPoint ?? [];
  markPoint.push({
    coordinate: action.data,
    itemContent: action.payload.itemContent,
    itemLine: action.payload.itemLine
  });
  (spec as any).markPoint = markPoint;
  chartInstance.updateSpecSync(spec);
};

export const markPointFlickerProcessor = async (
  chartInstance: VChart,
  spec: IChartSpec,
  markPointAction: MarkPointAction
) => {
  setTimeout(() => {
    const marker = chartInstance.getComponents().filter(c => c.type === 'markPoint')[0];
    if (marker && marker._markerComponent._item) {
      const tag = marker._markerComponent._item as Tag;
      // TODO: customAnimation
      // 1. 支持闪烁快慢，即 duration
      // 2. 支持闪烁次数
      tag.forEachChildren(child => {
        (child as IGraphic).animate().to({ opacity: 0 }, 120, 'linear').to({ opacity: 1 }, 120, 'linear').loop(1); // FIXME: loop 次数不正确
      });
    }
  }, 1000);
};
