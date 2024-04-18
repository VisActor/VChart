import VChart, { IChartSpec } from '@visactor/vchart';
import { AddAction, AddPatchAction } from '../../types/Add';
import { ActionNode } from '../../types';
import { cloneDeep } from '@visactor/vutils';

export const addProcessor = async (chartInstance: VChart, spec: IChartSpec, addAction: ActionNode) => {
  const action = addAction as AddAction;
  spec.data[0].values.push(action.data);

  // TODO: 使用同步接口
  await chartInstance.updateDataSync('data', cloneDeep(spec.data[0].values));
};

/**
 * 1. spec.data 要做归一化处理，统一处理到数组
 * 2. data 要有默认 id
 */
export const addPatchParser = async (chartInstance: VChart, spec: IChartSpec, addAction: AddPatchAction) => {
  const action = addAction;
  spec.data[0].values.push(...action.data);
  // TODO: 动画如何实现自定义
  const mark = chartInstance.getChart().getAllSeries()[0].getActiveMarks()[0].getProduct();
  if (mark.markType === 'area') {
    // debugger;
    mark.animate.updateConfig({
      appear: {
        type: 'moveIn',
        duration: 300
      }
    });
    console.log(mark.uid, mark.animate.getAnimationConfigs('appear'));
  }

  chartInstance.updateDataSync('data', cloneDeep(spec.data[0].values));
};
