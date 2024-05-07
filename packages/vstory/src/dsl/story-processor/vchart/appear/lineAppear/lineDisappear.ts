import VChart, { ISpec } from '@visactor/vchart';
import { merge } from '@visactor/vutils';
import { defaultPayload } from './default';
import { transformLineAppear } from './transformLineAppear';
import { transformLineSymbolAppear } from './transformLineSymbolAppear';
import { getAllSeries, getSeriesMarksByMarkType } from '../../utils/series';
import { IChartAppearAction } from '../../../../types/chart/appear';

export const lineDisappearProcessor = async (chartInstance: VChart, spec: ISpec, action: IChartAppearAction) => {
  const vchart = (chartInstance as any)?._graphic?._vchart;

  const instance: VChart = vchart ? vchart : chartInstance;
  if (!instance) {
    return;
  }

  const series = getAllSeries(instance);
  series.forEach((series, seriesIndex) => {
    const lineMarks = getSeriesMarksByMarkType(series, 'line');
    const symbolMarks = getSeriesMarksByMarkType(series, 'symbol');

    if (lineMarks.length) {
      const { payload } = action;
      const mergePayload = merge({}, defaultPayload, payload) as IChartAppearAction['payload'];
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
      const { payload } = action;
      const mergePayload = merge({}, defaultPayload, payload) as IChartAppearAction['payload'];
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

  // const lineMarks = getAllSeriesMarksByMarkType(instance, 'line');
  // const symbolMarks = getAllSeriesMarksByMarkType(instance, 'symbol');
};
