import VChart, { IChartSpec, ISpec } from '@visactor/vchart';
import { ActionNode } from '../../types';

export const appearProcessor = async (chartInstance: VChart, spec: ISpec, addAction: ActionNode) => {
  const vchart = (chartInstance as any)._graphic._vchart;
  vchart.updateSpecSync(vchart._spec);
};
