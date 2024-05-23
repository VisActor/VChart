import { IChartAddAction } from './../../types/chart/add';
import VChart, { ISpec, IVChart } from '@visactor/vchart';
import { cloneDeep, isArray } from '@visactor/vutils';
import { ICharacterVisactor } from '../../../story/character/visactor/interface';

export const addProcessor = async (chartInstance: ICharacterVisactor, spec: ISpec, action: IChartAddAction) => {
  const chart = chartInstance.getGraphicParent();
  const vchart = chart?._vchart;
  const instance: VChart = vchart ? vchart : chartInstance;

  if (!instance) {
    return;
  }

  const { payload } = action as IChartAddAction;
  const { id: dataId, values } = payload;
  const rowData = cloneDeep(vchart._dataSet.getDataView(dataId).rawData);

  const data = isArray(values) ? values : [values];
  rowData.push(...data);

  await instance.updateDataSync(dataId, rowData);
};
