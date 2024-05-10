import VChart, { ISpec } from '@visactor/vchart';
import { merge } from '@visactor/vutils';
import { defaultPayload } from './default';
import { transformLineAppear } from './transformLineAppear';
import { transformLineSymbolAppear } from './transformLineSymbolAppear';
import { getAllSeries, getSeriesMarksByMarkType } from '../../utils/series';
import { IChartAppearAction } from '../../../../types/chart/appear';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';

import { axesDisappearProcessor, titleDisappearProcessor } from '../../components';

export const lineDisappearProcessor = async (
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

  const { payload } = action;
  const mergePayload = merge({}, defaultPayload, payload) as IChartAppearAction['payload'];

  const series = getAllSeries(instance);
  series.forEach((series, seriesIndex) => {
    const lineMarks = getSeriesMarksByMarkType(series, 'line');
    const symbolMarks = getSeriesMarksByMarkType(series, 'symbol');

    if (lineMarks.length) {
      lineMarks.forEach((mark, markIndex) => {
        const product = mark.getProduct();
        const config = transformLineAppear(instance, mergePayload.animation, {
          markIndex: seriesIndex + markIndex,
          disappear: true
        });
        product.animate.run(config);
      });
    }

    if (symbolMarks.length) {
      symbolMarks.forEach((mark, markIndex) => {
        const product = mark.getProduct();
        const config = transformLineSymbolAppear(instance, mergePayload.animation, {
          markIndex: seriesIndex + markIndex,
          disappear: true
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
