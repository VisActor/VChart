/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import VChart, { IChartSpec } from '@visactor/vchart';
import { StoryChart } from '../story-chart';
import { processorMap } from '../story-processor';
import { ActionNode } from '../types';
import { componentProcessorMap } from '../story-processor/processorMap';

interface StoryPlayerOption {
  chartInstance: VChart;
  spec: IChartSpec;
}

export class StoryExecutor {
  private storyChart: StoryChart;
  private processor: Record<string, Function> = {};

  private option: StoryPlayerOption;
  private snapshots: ActionNode[] = [];

  constructor(storyChart: StoryChart, option: StoryPlayerOption) {
    this.storyChart = storyChart;
    this.processor = processorMap[storyChart.storyChartType];
    this.option = option;
    this.snapshots = this.storyChart.exportSnapshot();
  }

  play = async () => {
    for (let i = 0; i < this.snapshots.length; i++) {
      // TODO: 上个动作执行完后, 执行下一个.
      // eslint-disable-next-line promise/param-names
      await new Promise(res => {
        setTimeout(res, 500);
      });

      const snapshot = this.snapshots[i];
      let processor;
      // TODO: executor 需要与 element 一对一
      if ('element' in snapshot) {
        processor = componentProcessorMap[snapshot.element][snapshot.action];
      } else {
        processor = this.processor[snapshot.action];
      }

      if (processor) {
        await processor(this.option.chartInstance, snapshot);
      }
    }
  };
}
