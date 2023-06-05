import {
  STACK_FIELD_END,
  STACK_FIELD_START_PERCENT,
  STACK_FIELD_END_PERCENT,
  ChartEvent,
  STACK_FIELD_END_OffsetSilhouette,
  STACK_FIELD_START_OffsetSilhouette
} from '../constant/index';
import type { ISeriesStackDataMeta } from '../series/interface';
import type { IRegion } from '../region/interface';
import type { IChart } from './interface';
import { STACK_FIELD_START } from '../constant';
import { toValidNumber } from '../util';
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
    const stackCache: IStackCacheRoot = {
      nodes: {}
    };
    // 分组
    model.getSeries().forEach(s => {
      const stackData = s.getStackData();
      const stackValueField = s.getStackValueField(); // yField
      if (stackData && stackValueField) {
        this.stackGroup(stackData, stackCache as unknown as IStackCacheNode, stackValueField);
      }
    });

    // 计算堆积
    for (const key in stackCache.nodes) {
      this.stack(stackCache.nodes[key]);
    }

    // 围绕中心轴偏移轮廓
    for (const key in stackCache.nodes) {
      this.stackOffsetSilhouette(stackCache.nodes[key]);
    }
  };

  private stackOffsetSilhouette(stackCache: IStackCacheNode) {
    if (!stackCache.values.length) {
      return;
    }
    const centerValue = stackCache.values[stackCache.values.length - 1][STACK_FIELD_END] / 2;
    for (let j = 0; j < stackCache.values.length; j++) {
      stackCache.values[j][STACK_FIELD_START_OffsetSilhouette] = stackCache.values[j][STACK_FIELD_START] - centerValue;
      stackCache.values[j][STACK_FIELD_END_OffsetSilhouette] = stackCache.values[j][STACK_FIELD_END] - centerValue;
    }
  }

  private stack(stackCache: IStackCacheNode) {
    if (stackCache.values.length > 0) {
      // 设置一个小数以保证 log 计算不会报错
      let positiveStart = Number.EPSILON;
      let negativeStart = 0;
      // temp
      let sign = 1;
      let value = 0;

      // stack
      stackCache.values.forEach(v => {
        value = v[STACK_FIELD_END];
        if (value >= 0) {
          v[STACK_FIELD_START] = positiveStart;
          positiveStart += v[STACK_FIELD_END];
          v[STACK_FIELD_END] = positiveStart;
        } else {
          v[STACK_FIELD_START] = negativeStart;
          negativeStart += v[STACK_FIELD_END];
          v[STACK_FIELD_END] = negativeStart;
        }
      });
      // normalize
      stackCache.values.forEach(v => {
        value = v[STACK_FIELD_END];
        const denominator = value >= 0 ? positiveStart : negativeStart;
        sign = value >= 0 ? 1 : -1;
        v[STACK_FIELD_START_PERCENT] = Math.min(1, v[STACK_FIELD_START] / denominator) * sign;
        v[STACK_FIELD_END_PERCENT] = Math.min(1, v[STACK_FIELD_END] / denominator) * sign;
      });
    }

    for (const key in stackCache.nodes) {
      this.stack(stackCache.nodes[key]);
    }
  }

  private stackGroup(stackData: ISeriesStackDataMeta, stackCache: IStackCacheNode, valueField: string) {
    if ('values' in stackData) {
      // 初值
      stackData.values.forEach(v => (v[STACK_FIELD_END] = toValidNumber(v[valueField])));
      stackCache.values.push(...stackData.values);
      return;
    }
    for (const key in stackData.nodes) {
      !stackCache.nodes[key] &&
        (stackCache.nodes[key] = {
          values: [],
          nodes: {}
        });
      this.stackGroup(stackData.nodes[key], stackCache.nodes[key], valueField);
    }
  }
}

interface IStackCacheNode {
  values: any[];
  nodes: {
    [key: string]: IStackCacheNode;
  };
}
interface IStackCacheRoot {
  nodes: {
    [key: string]: IStackCacheNode;
  };
}
