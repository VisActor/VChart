import VChart, { ISpec } from '@visactor/vchart';
import { merge } from '@visactor/vutils';
import { defaultPayload } from './default';
import { getAllSeriesMarksByMarkType } from '../../utils';
import { IChartAppearAction } from '../../../../types/chart/appear';
import { transformRectAppear } from './transformRectAppear';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';

import { axesDisappearProcessor, titleDisappearProcessor } from '../../components';

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

  const marks = getAllSeriesMarksByMarkType(instance, 'rect');
  if (!marks.length) {
    return;
  }
  const { payload } = action;

  const mergePayload = merge({}, defaultPayload, payload) as IChartAppearAction['payload'];

  marks.forEach(mark => {
    const product = mark.getProduct();
    const config = transformRectAppear(instance, mergePayload.animation, true);
    if (config) {
      product.animate.run(config);
    }
  });

  titleDisappearProcessor(chartInstance, spec, {
    action: 'disappear',
    payload: {
      animation: {
        duration: mergePayload.animation.duration,
        easing: mergePayload.animation.easing,
        effect: 'fade'
      }
    }
  });

  // 隐藏坐标轴
  axesDisappearProcessor(chartInstance, spec, { action: 'disappear', payload: undefined });

  // 隐藏group
  chart.setAttributes({
    visible: false
  });
};
