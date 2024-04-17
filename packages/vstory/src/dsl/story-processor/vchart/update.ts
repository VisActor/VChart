import VChart, { IChartSpec } from '@visactor/vchart';
import { ActionNode } from '../../types';
import { cloneDeep, isEqual } from '@visactor/vutils';
import { UpdateAction } from '../../types/Update';

export const updateProcessor = async (chartInstance: VChart, spec: IChartSpec, addAction: ActionNode) => {
  const action = addAction as UpdateAction;
  const dataIndex = spec.data[0].values.indexOf(v => isEqual(v, action.data));

  spec.data[0].values.splice(dataIndex, 1, action.payload);

  await chartInstance.updateData('data', cloneDeep(spec.data[0].values));
};
