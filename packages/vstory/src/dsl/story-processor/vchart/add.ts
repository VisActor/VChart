import { ISpec, IVChart } from '@visactor/vchart';
import { AddAction } from '../../types/Add';
import { ActionNode } from '../../types';
import { cloneDeep, isArray } from '@visactor/vutils';

export const addProcessor = async (chartInstance: IVChart, spec: ISpec, action: ActionNode) => {
  let vchart;
  let instance;
  if (chartInstance._graphic) {
    instance = chartInstance._graphic.vchart;
    vchart = chartInstance._graphic.vchart.getChart();
  } else {
    instance = chartInstance;
    vchart = chartInstance.getChart();
  }

  const { payload } = action as AddAction;
  const { id: dataId, values } = payload;
  const rowData = cloneDeep(vchart._dataSet.getDataView(dataId).rawData);

  const data = isArray(values) ? values : [values];
  rowData.push(...data);

  // TODO, 让行为的option生效, 例如动画

  await instance.updateDataSync(dataId, rowData);
};
