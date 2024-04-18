import { ISpec, IVChart } from '@visactor/vchart';
import { AddAction } from '../../types/Add';
import { ActionNode } from '../../types';
import { cloneDeep, isArray } from '@visactor/vutils';

export const addProcessor = async (chartInstance: IVChart, spec: ISpec, action: ActionNode) => {
  const vchart = chartInstance.getChart();
  const { payload } = action as AddAction;
  const { id, data } = payload;
  const rowData = cloneDeep(vchart._dataSet.getDataView(id).rawData);

  const values = isArray(data) ? data : [data];
  rowData.push(...values);

  // TODO, 让行为的option生效, 例如动画

  await chartInstance.updateDataSync('data', rowData);
};
