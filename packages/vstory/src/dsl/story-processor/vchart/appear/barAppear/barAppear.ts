import VChart, { ISpec } from '@visactor/vchart';
import { getAllSeriesMarksWithoutRoot } from '../../../../../util/vchart-api';
import { AppearAction } from '../../../../types/Appear';
import { merge } from '@visactor/vutils';
import { defaultPayload } from './default';
import { transformRectAppear } from '../transform/transformRectAppear';
import { getAllSeriesMarksByMarkType } from '../../utils';

export const barAppearProcessor = async (chartInstance: VChart, spec: ISpec, action: AppearAction) => {
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

  const mergePayload = merge({}, defaultPayload, payload) as AppearAction['payload'];

  marks.forEach(mark => {
    const product = mark.getProduct();
    const config = transformRectAppear(instance, mergePayload.animation);
    product.animate.run(config);
  });
};
