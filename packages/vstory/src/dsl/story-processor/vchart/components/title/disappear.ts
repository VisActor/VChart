import VChart, { ISpec } from '@visactor/vchart';

import { IGraphic } from '@visactor/vrender-core';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';
import { IGraphicDisappearAction } from '../../../../types/graphic/disappear';
import { commonDisappearEffect } from '../../../graphic/effect/disappear';

export const titleDisappearProcessor = async (
  chartInstance: ICharacterVisactor,
  spec: ISpec,
  action: IGraphicDisappearAction
) => {
  const chart = chartInstance.getGraphicParent();
  const instance: VChart = chart?._vchart ? chart?._vchart : chartInstance;

  if (!instance) {
    return;
  }

  // @ts-ignore
  const titleComponent = instance.getChart().getComponentsByType('title')[0]?._titleComponent; // 从图表获取Title组件
  if (!titleComponent) {
    return;
  }

  const { animation } = action.payload;
  if (animation) {
    // 得到所有的text图元, 执行disAppear动画
    titleComponent.getElementsByType('text').forEach((text: IGraphic) => {
      commonDisappearEffect(text, animation.effect, animation);
    });
  } else {
    titleComponent.getElementsByType('text').forEach((text: IGraphic) => {
      text.setAttributes({ visible: false });
    });
  }
};
