import VChart, { ISpec } from '@visactor/vchart';
import { merge } from '@visactor/vutils';
import { defaultPayload } from './default';
import { transformAreaAppear } from './transformAreaAppear';
import { getAllSeriesMarksByMarkType } from '../../utils';
import { IChartAppearAction } from '../../../../types/chart/appear';
import { getAllSeries, getSeriesMarksByMarkType } from '../../utils/series';
import { transformSymbolAppear } from './transformSymbolAppear';
import { transformLineAppear } from './transformLineAppear';

export const radarAppearProcessor = async (chartInstance: VChart, spec: ISpec, action: IChartAppearAction) => {
  const vchart = (chartInstance as any)?._graphic?._vchart;
  const instance: VChart = vchart ? vchart : chartInstance;
  if (!instance) {
    return;
  }
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
          disappear: false
        });

        product.animate.run(config);
      });
    }

    if (symbolMarks.length) {
      const { payload } = action;
      const mergePayload = merge({}, defaultPayload, payload) as IChartAppearAction['payload'];
      symbolMarks.forEach((mark, markIndex) => {
        const product = mark.getProduct();
        const config = transformSymbolAppear(instance, mergePayload.animation, {
          markIndex: seriesIndex + markIndex,
          disappear: false
        });

        product.animate.run(config);
      });
    }

    if (lineMarks.length) {
      const { payload } = action;
      const mergePayload = merge({}, defaultPayload, payload) as IChartAppearAction['payload'];
      lineMarks.forEach((mark, markIndex) => {
        const product = mark.getProduct();
        const config = transformLineAppear(instance, mergePayload.animation, {
          markIndex: seriesIndex + markIndex,
          disappear: false
        });

        product.animate.run(config);
      });
    }
  });
};
