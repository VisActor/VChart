import VChart, { ISpec } from '@visactor/vchart';
import { getAllSeriesMarksWithoutRoot } from '../../../util/vchart-api';

export const appearProcessor = async (chartInstance: VChart, spec: ISpec, action: any) => {
  const vchart = (chartInstance as any)?._graphic?._vchart;

  const instance = vchart ? vchart : chartInstance;
  if (!instance) {
    return;
  }

  const marks = getAllSeriesMarksWithoutRoot(instance).filter(mark => mark.type === 'rect');

  if (!marks.length) {
    return;
  }
  const { payload } = action;
  marks.forEach(mark => {
    const product = mark.getProduct();
    product.animate.run({
      type: 'growCenterIn',
      duration: payload.duration,
      oneByOne: payload.duration,
      ...payload
    });
  });
};
