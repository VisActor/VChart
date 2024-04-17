import VChart, { IChartSpec } from '@visactor/vchart';
import { ActionNode } from '../../types';

export const appearProcessor = async (chartInstance: VChart, spec: IChartSpec, addAction: ActionNode) => {
  // const action = addAction as AddAction;
  // spec.data[0].values.push(action.data);

  console.log('abcdefg');
  const vchart = (chartInstance as any)._graphic._vchart;
  // await chartInstance.updateData('data', cloneDeep(spec.data[0].values));
  vchart.updateSpecSync(vchart._spec);
};
