import VChart, { IChartSpec } from '@visactor/vchart';
import { cloneDeep, isEqual } from '@visactor/vutils';
import { IChartUpdateAction } from '../../types/chart/Update';

export const updateProcessor = async (chartInstance: VChart, spec: IChartSpec, updateAction: IChartUpdateAction) => {
  const action = updateAction;
  const dataIndex = spec.data[0].values.indexOf(v => isEqual(v, action.payload.data));

  spec.data[0].values.splice(dataIndex, 1, action.payload);

  await chartInstance.updateData('data', cloneDeep(spec.data[0].values));
};
