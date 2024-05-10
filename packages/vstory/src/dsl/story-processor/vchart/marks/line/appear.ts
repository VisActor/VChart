import VChart, { ISpec } from '@visactor/vchart';
import { merge } from '@visactor/vutils';
import { IChartAppearAction } from '../../../../types/chart/appear';
import { transformLineAppear } from './transformLineAppear';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';
import { getAllSeries, getSeriesMarksByMarkType } from '../../utils/series';

export const lineAppearProcessor = async (
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
    const symbolMarks = getSeriesMarksByMarkType(series, 'line');

    if (!symbolMarks.length) {
      return;
    }

    symbolMarks.forEach((mark, markIndex) => {
      const product = mark.getProduct();
      const config = transformLineAppear(instance, mergePayload.animation, {
        disappear: false,
        markIndex: seriesIndex + markIndex
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
