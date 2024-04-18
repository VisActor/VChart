import VChart, { IChartSpec } from '@visactor/vchart';
import { AddAction, AddPatchAction } from '../../types/Add';
import { ActionNode } from '../../types';
import { cloneDeep } from '@visactor/vutils';

export const addProcessor = async (chartInstance: VChart, spec: IChartSpec, addAction: ActionNode) => {
  const action = addAction as AddAction;
  const vchart = (chartInstance as any)._graphic._vchart;

  spec.data[0].values.push(action.data);
  vchart.getChart();
  vchart.updateData(addAction.data.id);
  await chartInstance.updateData('data', cloneDeep(spec.data[0].values));
};
