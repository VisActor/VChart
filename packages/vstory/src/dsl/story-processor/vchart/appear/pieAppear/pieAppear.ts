import VChart, { ISpec } from '@visactor/vchart';
import { getAllSeriesMarksWithoutRoot } from '../../../../../util/vchart-api';
import { AppearAction } from '../../../../types/Appear';
import { merge } from '@visactor/vutils';
import { defaultPayload } from './default';
import { getAllSeriesMarksByMarkType } from '../../utils';
import { transformArcAppear } from '../transform/transformArcAppear';
import { getAllSeries, getSeriesMarksByMarkType } from '../../utils/series';

export const pieAppearProcessor = async (chartInstance: VChart, spec: ISpec, action: AppearAction) => {
  const vchart = (chartInstance as any)?._graphic?._vchart;

  const instance: VChart = vchart ? vchart : chartInstance;
  if (!instance) {
    return;
  }

  const series = getAllSeries(instance);

  const { payload } = action;

  const mergePayload = merge({}, defaultPayload, payload) as AppearAction['payload'];

  series.forEach((series, seriesIndex) => {
    const arcMarks = getSeriesMarksByMarkType(series, 'arc');
    console.log('debug arcMarks', arcMarks);
    if (arcMarks.length) {
      arcMarks.forEach((mark, markIndex) => {
        const product = mark.getProduct();

        const config = transformArcAppear(instance, mergePayload.animation, seriesIndex + markIndex);
        product.animate.run(config);
      });
    }
  });
};
