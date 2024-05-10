import VChart, { ISpec } from '@visactor/vchart';
import { ICharacterVisactor } from '../../../../../story/character/visactor/interface';
import { IGraphicDisappearAction } from '../../../../types/graphic/disappear';

export const axesDisappearProcessor = async (
  chartInstance: ICharacterVisactor,
  spec: ISpec,
  action: IGraphicDisappearAction
) => {
  const chart = chartInstance.getGraphicParent();
  const instance: VChart = chart?._vchart ? chart?._vchart : chartInstance;

  if (!instance) {
    return;
  }

  // 获取轴组件
  const axes = instance.getChart().getComponentsByKey('axes');
  if (!axes) {
    return;
  }

  // 设置轴组件所有内容visible不可见
  axes.forEach(axis => {
    const marks = axis.getMarks();
    marks.forEach(mark => {
      mark.getProduct().encode({
        // 极坐标系和笛卡尔坐标系, 设置各个图形不可见.
        title: { visible: false },
        label: { visible: false },
        tick: { visible: false },
        subTick: { visible: false },
        line: { visible: false },
        // 极坐标系使用grid控制domainLine, 通过设置style和subGrid设置为不可见
        style: {
          visible: false
        },
        subGrid: {
          visible: false
        }
      });
    });
  });

  instance.renderSync();
};
