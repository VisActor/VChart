import VChart, { ISpec } from '@visactor/vchart';
import { getAllSeriesMarksWithoutRoot } from '../../../../../util/vchart-api';
import { merge } from '@visactor/vutils';
import { defaultPayload } from './default';
import { getAllSeriesMarksByMarkType } from '../../utils';
import { transformArcAppear } from './transformArcAppear';
import { getAllSeries, getSeriesMarksByMarkType } from '../../utils/series';
import { IChartAppearAction } from '../../../../types/chart/appear';

export const pieDisappearProcessor = async (chartInstance: VChart, spec: ISpec, action: IChartAppearAction) => {
  const vchart = (chartInstance as any)?._graphic?._vchart;

  const instance: VChart = vchart ? vchart : chartInstance;
  if (!instance) {
    return;
  }

  const series = getAllSeries(instance);

  const { payload } = action;

  const mergePayload = merge({}, defaultPayload, payload) as IChartAppearAction['payload'];

  series.forEach((series, seriesIndex) => {
    const arcMarks = getSeriesMarksByMarkType(series, 'arc');

    if (arcMarks.length) {
      arcMarks.forEach((mark, markIndex) => {
        const product = mark.getProduct();

        const config = transformArcAppear(instance, mergePayload.animation, {
          disappear: true,
          index: seriesIndex + markIndex
        });
        product.animate.run(config);
      });
    }
  });
};
