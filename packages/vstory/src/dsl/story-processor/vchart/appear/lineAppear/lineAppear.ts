import VChart, { ISpec } from '@visactor/vchart';
import { getAllSeriesMarksWithoutRoot } from '../../../../../util/vchart-api';
import { AppearAction } from '../../../../types/Appear';
import { merge } from '@visactor/vutils';
import { defaultPayload } from './default';
import { transformLineAppear } from '../transform/transformLineAppear';
import { getAllSeriesMarksByMarkType } from '../../utils';
import { transformLineSymbolAppear } from '../transform/transformLineSymbolAppear';
import { getAllSeries, getSeriesMarksByMarkType } from '../../utils/series';

export const lineAppearProcessor = async (chartInstance: VChart, spec: ISpec, action: AppearAction) => {
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
      const mergePayload = merge({}, defaultPayload, payload) as AppearAction['payload'];
      lineMarks.forEach((mark, markIndex) => {
        const product = mark.getProduct();
        const config = transformLineAppear(instance, mergePayload.animation, seriesIndex + markIndex);

        product.animate.run(config);
      });
    }

    if (symbolMarks.length) {
      const { payload } = action;
      const mergePayload = merge({}, defaultPayload, payload) as AppearAction['payload'];
      symbolMarks.forEach((mark, markIndex) => {
        const product = mark.getProduct();
        const config = transformLineSymbolAppear(instance, mergePayload.animation, seriesIndex + markIndex);
        product.animate.run(config);
      });
    }
  });

  // const lineMarks = getAllSeriesMarksByMarkType(instance, 'line');
  // const symbolMarks = getAllSeriesMarksByMarkType(instance, 'symbol');
};
