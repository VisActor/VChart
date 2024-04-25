import VChart, { ISpec } from '@visactor/vchart';
import { getAllSeriesMarksWithoutRoot } from '../../../../util/vchart-api';
import { AppearAction } from '../../../types/Appear';
import { merge } from '@visactor/vutils';
import { defaultPayload } from './default';
import { transformAppearAnimation } from './transform';

export const appearProcessor = async (chartInstance: VChart, spec: ISpec, action: AppearAction) => {
  const vchart = (chartInstance as any)?._graphic?._vchart;

  const instance: VChart = vchart ? vchart : chartInstance;
  if (!instance) {
    return;
  }

  const marks = getAllSeriesMarksWithoutRoot(instance).filter(mark => mark.type === 'rect');

  if (!marks.length) {
    return;
  }
  const { payload } = action;

  const mergePayload = merge({}, defaultPayload, payload) as AppearAction['payload'];

  marks.forEach(mark => {
    const product = mark.getProduct();
    const config = transformAppearAnimation(instance, mergePayload.animation);
    product.animate.run(config);
  });
};
