import VChart, { ISpec } from '@visactor/vchart';
import { merge } from '@visactor/vutils';
import { defaultPayload } from './default';
import { transformSymbolAppear } from './transformSymbolAppear';
import { getAllSeries, getSeriesMarksByMarkType } from '../../utils/series';
import { IChartAppearAction } from '../../../../types/chart/appear';

export const scatterAppearProcessor = async (chartInstance: VChart, spec: ISpec, action: IChartAppearAction) => {
  const vchart = (chartInstance as any)?._graphic?._vchart;

  const instance: VChart = vchart ? vchart : chartInstance;
  if (!instance) {
    return;
  }

  const series = getAllSeries(instance);
  series.forEach((series, seriesIndex) => {
    const symbolMarks = getSeriesMarksByMarkType(series, 'symbol');

    if (symbolMarks.length) {
      const { payload } = action;
      const mergePayload = merge({}, defaultPayload, payload) as IChartAppearAction['payload'];
      symbolMarks.forEach((mark, markIndex) => {
        const product = mark.getProduct();
        const config = transformSymbolAppear(instance, mergePayload.animation, {
          disappear: false,
          markIndex: seriesIndex + markIndex
        });
        product.animate.run(config);
      });
    }
  });

  // const lineMarks = getAllSeriesMarksByMarkType(instance, 'line');
  // const symbolMarks = getAllSeriesMarksByMarkType(instance, 'symbol');
};
