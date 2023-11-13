import { ChartEvent } from '../constant/index';
import type { IRegion } from '../region/interface';
import type { IChart } from './interface';
import type { IStackCacheNode } from '../util';
import { getRegionStackGroup, stack, stackOffsetSilhouette, stackTotal } from '../util';
import type { EventCallback } from '../event/interface';

// stack
// 1. 不可以多个region之间的series进行堆积，目前看这种需求没有场景。将堆积改为针对 region
// 2. 堆积是一个数据层面的逻辑，但是会影响系列当前使用的yField到底是什么。
// 3. ECharts 线系列参与堆积后，线系列的y不变，但是与它一起堆积的柱图，数据变化了了，是堆积后的值
// 4. x 方向分组的功能，是属于轴的，与堆积和怎么堆积无关。
// 现有功能，有支持堆积时的方向可以调整。也就是sort
export class Stack {
  protected _chart: IChart;

  constructor(chart: IChart) {
    this._chart = chart;
  }

  init() {
    this._chart.getAllRegions().forEach(r => {
      r.event.on(
        ChartEvent.regionSeriesDataFilterOver,
        { filter: ({ model }) => model?.id === r.id },
        this.stackRegion as EventCallback<unknown>
      );
    });
  }

  stackAll() {
    this._chart.getAllRegions().forEach(r => {
      this.stackRegion({ model: r });
    });
  }

  stackRegion = ({ model }: { model: IRegion }) => {
    const series = model.getSeries();
    const hasStack = series.some(s => s.getStack());

    if (!hasStack) {
      return;
    }
    // total label need percent
    const hasTotalLabel = series.some(s => s.getSpec()?.totalLabel?.visible);
    const hasPercent = hasTotalLabel || series.some(s => s.getPercent());
    const hasOffsetSilhouette = series.some(s => s.getStackOffsetSilhouette());

    const stackValueGroup = getRegionStackGroup(model, true);

    // 计算堆积
    for (const stackValue in stackValueGroup) {
      for (const key in stackValueGroup[stackValue].nodes) {
        stack(stackValueGroup[stackValue].nodes[key], model.getStackInverse(), hasPercent);
      }
    }

    if (hasOffsetSilhouette) {
      // 围绕中心轴偏移轮廓
      for (const stackValue in stackValueGroup) {
        for (const key in stackValueGroup[stackValue].nodes) {
          stackOffsetSilhouette(stackValueGroup[stackValue].nodes[key]);
        }
      }
    }

    if (hasTotalLabel) {
      model.getSeries().forEach(s => {
        const stackData = s.getStackData();
        const stackValue = s.getStackValue();
        const stackValueField = s.getStackValueField(); // yField
        if (stackData && stackValueField) {
          stackTotal(stackValueGroup[stackValue] as IStackCacheNode, stackValueField);
        }
      });
    }
  };
}
