import VChart, { ISpec } from '@visactor/vchart';
import { merge } from '@visactor/vutils';
import { defaultPayload } from './default';
import { transformRectAppear } from './transformRectAppear';
import { getAllSeries, getSeriesMarksByMarkType } from '../../utils/series';
import { IChartAppearAction } from '../../../../types/chart/appear';

export const treeMapDisappearProcessor = async (chartInstance: VChart, spec: ISpec, action: IChartAppearAction) => {
  const vchart = (chartInstance as any)?._graphic?._vchart;

  const instance: VChart = vchart ? vchart : chartInstance;
  if (!instance) {
    return;
  }

  const series = getAllSeries(instance);

  const { payload } = action;

  const mergePayload = merge({}, defaultPayload, payload) as IChartAppearAction['payload'];

  series.forEach((series, seriesIndex) => {
    const rectMarks = getSeriesMarksByMarkType(series, 'rect');

    if (rectMarks.length) {
      rectMarks.forEach((mark, markIndex) => {
        const product = mark.getProduct();

        const config = transformRectAppear(instance, mergePayload.animation, {
          disappear: true,
          index: seriesIndex + markIndex
        });
        product && product.animate.run(config);
      });
    }
  });
};
