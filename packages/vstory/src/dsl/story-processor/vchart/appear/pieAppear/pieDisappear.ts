import VChart, { ISpec } from '@visactor/vchart';
import { merge } from '@visactor/vutils';
import { defaultPayload } from './default';
import { transformArcAppear } from './transformArcAppear';
import { getAllSeries, getSeriesMarksByMarkType } from '../../utils/series';
import { IChartAppearAction } from '../../../../types/chart/appear';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';

import { axesDisappearProcessor, titleDisappearProcessor } from '../../components';

export const pieDisappearProcessor = async (
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

  const series = getAllSeries(instance);

  const { payload } = action;

  const mergePayload = merge({}, defaultPayload, payload) as IChartAppearAction['payload'];

  series.forEach((series, seriesIndex) => {
    const arcMarks = getSeriesMarksByMarkType(series, 'arc');

    if (arcMarks.length) {
      arcMarks.forEach((mark, markIndex) => {
        const product = mark.getProduct();

        const config = transformArcAppear(instance, mergePayload.animation, {
          disappear: true,
          index: seriesIndex + markIndex
        });
        product.animate.run(config);
      });
    }
  });

  // 隐藏标题
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
