import VChart, { ISpec } from '@visactor/vchart';
import { merge } from '@visactor/vutils';
import { defaultPayload } from './default';
import { transformRectAppear } from '../transform/transformRectAppear';
import { getAllSeriesMarksByMarkType } from '../../utils';
import { IChartAppearAction } from '../../../../types/chart/appear';

export const barAppearProcessor = async (chartInstance: VChart, spec: ISpec, action: IChartAppearAction) => {
  const vchart = (chartInstance as any)?._graphic?._vchart;

  const instance: VChart = vchart ? vchart : chartInstance;
  if (!instance) {
    return;
  }

  const marks = getAllSeriesMarksByMarkType(instance, 'rect');
  if (!marks.length) {
    return;
  }
  const { payload } = action;

  const mergePayload = merge({}, defaultPayload, payload) as IChartAppearAction['payload'];

  marks.forEach(mark => {
    const product = mark.getProduct();
    const config = transformRectAppear(instance, mergePayload.animation);
    if (config) {
      product.animate.run(config);
    }
  });
};
