import VChart, { ISpec } from '@visactor/vchart';
import { IChartAppearAction } from '../../../../types/chart/appear';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';

import { axesDisappearProcessor, titleDisappearProcessor } from '../../components';
import { rectDisappearProcessor } from '../../marks';
import { graphicDisappearProcessor } from '../../../graphic/disappear';

export const barDisappearProcessor = async (
  chartInstance: ICharacterVisactor,
  spec: ISpec,
  action: IChartAppearAction
) => {
  const chart = chartInstance.getGraphicParent();
  const vchart = chart?._vchart;
  const instance: VChart = vchart ? vchart : chartInstance;

  if (!instance) {
    return;
  }

  // 隐藏: rect图元
  rectDisappearProcessor(chartInstance, spec, action);

  // 隐藏: title图元
  titleDisappearProcessor(chartInstance, spec, {
    action: 'disappear',
    payload: {
      animation: {
        effect: 'fade',
        duration: action.payload.animation.duration,
        easing: action.payload.animation.easing
      }
    }
  });

  // 隐藏: 坐标轴
  axesDisappearProcessor(chartInstance, spec, { action: 'disappear', payload: undefined });

  // Group Disappear
  // @ts-ignore
  graphicDisappearProcessor(chartInstance, spec, action);

  // 隐藏: 根节点容器
  chart.setAttributes({
    visible: false
  });
};
