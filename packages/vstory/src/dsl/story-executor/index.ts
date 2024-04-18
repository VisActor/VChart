/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import VChart, { IChartSpec } from '@visactor/vchart';
import { StoryChart } from '../story-chart';
import { processorMap } from '../story-processor';
import { ActionNode } from '../types';

export interface StoryPlayerOption {
  chartInstance: VChart;
  spec: IChartSpec;
}

export class StoryExecutor {
  private storyChart: StoryChart;
  protected processor: Record<string, Function> = {};

  private option: StoryPlayerOption;
  private snapshots: ActionNode[] = [];

  constructor(storyChart: StoryChart, option: StoryPlayerOption) {
    this.storyChart = storyChart;
    this.processor = processorMap[storyChart.storyChartType];
    this.option = option;
    this.snapshots = this.storyChart.exportSnapshot();
  }

  play = async () => {
    console.log(this.snapshots);
    for (let i = 0; i < this.snapshots.length; i++) {
      // TODO: 上个动作执行完后, 执行下一个.
      // eslint-disable-next-line promise/param-names
      await new Promise(res => {
        setTimeout(res, 500);
      });

      const snapshot = this.snapshots[i];
      const { action, elementId, elementType, callback } = snapshot;

      let processor;
      if (elementId === this.storyChart.uid) {
        processor = this.processor[action];
      } else {
        processor = processorMap[elementType][action];
      }

      if (processor) {
        await processor(this.option.chartInstance, this.option.spec, snapshot);
        if (callback) {
          callback(this.option.chartInstance, this.option.spec, snapshot as any);
        }
      }
    }
  };
}
