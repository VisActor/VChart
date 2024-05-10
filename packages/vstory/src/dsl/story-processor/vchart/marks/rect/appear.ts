import VChart, { ISpec } from '@visactor/vchart';
import { merge } from '@visactor/vutils';
import { getAllSeriesMarksByMarkType } from '../../utils';
import { IChartAppearAction } from '../../../../types/chart/appear';
import { transformRectAppear } from './transformRectAppear';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';
import { getAllSeries, getSeriesMarksByMarkType } from '../../utils/series';

export const rectAppearProcessor = async (
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

  getAllSeries(instance).forEach((series, seriesIndex) => {
    const marks = getSeriesMarksByMarkType(series, 'rect');

    if (!marks.length) {
      return;
    }

    marks.forEach((mark, markIndex) => {
      const product = mark.getProduct();
      const config = transformRectAppear(instance, mergePayload.animation, {
        index: seriesIndex + markIndex,
        disappear: false
      });
      // @ts-ignore
      product && product.animate.run(config);
    });
  });
};

const defaultPayload: IChartAppearAction['payload'] = {
  animation: {
    effect: 'grow',
    duration: 2000,
    easing: 'cubicOut',
    oneByOne: false,
    loop: false
  }
};
