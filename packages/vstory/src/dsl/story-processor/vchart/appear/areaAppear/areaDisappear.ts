import VChart, { ISpec } from '@visactor/vchart';
import { merge } from '@visactor/vutils';
import { defaultPayload } from './default';
import { transformAreaAppear } from './transformAreaAppear';
import { getAllSeriesMarksByMarkType } from '../../utils';
import { IChartAppearAction } from '../../../../types/chart/appear';
import { getAllSeries, getSeriesMarksByMarkType } from '../../utils/series';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';
import { channel } from 'diagnostics_channel';
import { axesDisappearProcessor, titleDisappearProcessor } from '../../components';

export const areaDisappearProcessor = async (
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

    if (areaMarks.length) {
      areaMarks.forEach((mark, markIndex) => {
        const product = mark.getProduct();
        const config = transformAreaAppear(instance, mergePayload.animation, {
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
