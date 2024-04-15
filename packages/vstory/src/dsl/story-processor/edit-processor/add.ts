import VChart, { IChartSpec } from '@visactor/vchart';
import { AddAction } from '../../types/Add';
import { ActionNode } from '../../types';
import { cloneDeep } from '@visactor/vutils';

export const addParser = async (chartInstance: VChart, spec: IChartSpec, addAction: ActionNode) => {
  const action = addAction as AddAction;
  spec.data[0].values.push(action.data);

  await chartInstance.updateData('data', cloneDeep(spec.data[0].values));
};
