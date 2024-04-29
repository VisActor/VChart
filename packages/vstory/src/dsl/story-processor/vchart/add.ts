import { IChartAddAction } from './../../types/chart/add';
import { ISpec, IVChart } from '@visactor/vchart';
import { cloneDeep, isArray } from '@visactor/vutils';

export const addProcessor = async (chartInstance: IVChart, spec: ISpec, action: IChartAddAction) => {
  let vchart;
  let instance;
  if (chartInstance._graphic) {
    instance = chartInstance._graphic.vchart;
    vchart = chartInstance._graphic.vchart.getChart();
  } else {
    instance = chartInstance;
    vchart = chartInstance.getChart();
  }

  const { payload } = action as IChartAddAction;
  const { id: dataId, values } = payload;
  const rowData = cloneDeep(vchart._dataSet.getDataView(dataId).rawData);

  const data = isArray(values) ? values : [values];
  rowData.push(...data);

  await instance.updateDataSync(dataId, rowData);
};
