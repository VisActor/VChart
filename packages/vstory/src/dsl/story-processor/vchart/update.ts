import VChart, { IChartSpec } from '@visactor/vchart';
import { cloneDeep, isArray, isEqual } from '@visactor/vutils';
import { IChartUpdateAction } from '../../types/chart/update';
import { ICharacterVisactor } from '../../../story/character/visactor/interface';
import { isMatch } from './utils';

export const updateProcessor = async (
  chartInstance: ICharacterVisactor,
  spec: IChartSpec,
  action: IChartUpdateAction
) => {
  const chart = chartInstance.getGraphicParent();
  const vchart = chart?._vchart;
  const instance: VChart = vchart ? vchart : chartInstance;

  if (!instance) {
    return;
  }

  const { payload } = action as IChartUpdateAction;
  const { id: dataId, data } = payload;

  const rowData = cloneDeep(vchart._dataSet.getDataView(dataId).rawData);

  const items = isArray(data) ? data : [data];

  items.forEach(item => {
    const { sourceValue, targetValue } = item;
    const dataIndex = rowData.findIndex(v => isMatch(v, sourceValue));
    if (dataIndex !== -1) {
      rowData.splice(dataIndex, 1, targetValue);
    }
  });

  await instance.updateDataSync(dataId, rowData);
};
