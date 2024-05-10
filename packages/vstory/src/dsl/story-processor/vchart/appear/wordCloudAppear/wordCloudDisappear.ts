import VChart, { ISpec } from '@visactor/vchart';
import { merge } from '@visactor/vutils';
import { defaultPayload } from './default';
import { transformTextAppear } from './transformTextAppear';
import { getAllSeries, getSeriesMarksByMarkType } from '../../utils/series';
import { IChartAppearAction } from '../../../../types/chart/appear';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';
import { axesDisappearProcessor, titleDisappearProcessor } from '../../components';

export const wordCloudDisappearProcessor = async (
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
    const textMarks = getSeriesMarksByMarkType(series, 'text');

    if (textMarks.length) {
      textMarks.forEach((mark, markIndex) => {
        const product = mark.getProduct();

        const config = transformTextAppear(instance, mergePayload.animation, {
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
