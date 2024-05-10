import VChart, { ISpec } from '@visactor/vchart';
import { merge } from '@visactor/vutils';
import { defaultPayload } from './default';
import { transformAreaAppear } from './transformAreaAppear';
import { getAllSeriesMarksByMarkType } from '../../utils';
import { IChartAppearAction } from '../../../../types/chart/appear';
import { getAllSeries, getSeriesMarksByMarkType } from '../../utils/series';
import { transformSymbolAppear } from './transformSymbolAppear';
import { transformLineAppear } from './transformLineAppear';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';
import { axesDisappearProcessor, titleDisappearProcessor } from '../../components';

export const radarDisappearProcessor = async (
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
    const areaMarks = getSeriesMarksByMarkType(series, 'area');
    const symbolMarks = getSeriesMarksByMarkType(series, 'symbol');
    const lineMarks = getSeriesMarksByMarkType(series, 'line');

    if (areaMarks.length) {
      const { payload } = action;
      const mergePayload = merge({}, defaultPayload, payload) as IChartAppearAction['payload'];
      areaMarks.forEach((mark, markIndex) => {
        const product = mark.getProduct();
        const config = transformAreaAppear(instance, mergePayload.animation, {
          markIndex: seriesIndex + markIndex,
          disappear: true
        });

        product.animate.run(config);
      });
    }

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
        const config = transformSymbolAppear(instance, mergePayload.animation, {
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
