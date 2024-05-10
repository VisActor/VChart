import VChart, { ISpec } from '@visactor/vchart';
import { merge } from '@visactor/vutils';
import { defaultPayload } from './default';
import { transformAreaAppear } from './transformAreaAppear';
import { IChartAppearAction } from '../../../../types/chart/appear';
import { getAllSeries, getSeriesMarksByMarkType } from '../../utils/series';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';
import { titleDisappearProcessor } from '../../disappear';

export const areaAppearProcessor = async (
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
    const symbolMarks = getSeriesMarksByMarkType(series, 'symbol');

    if (areaMarks.length) {
      areaMarks.forEach((mark, markIndex) => {
        const product = mark.getProduct();
        const config = transformAreaAppear(instance, mergePayload.animation, {
          markIndex: seriesIndex + markIndex,
          disappear: false
        });

        product.animate.run(config);
      });
    }
  });
};
