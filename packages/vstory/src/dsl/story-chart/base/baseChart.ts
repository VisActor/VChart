import VChart, { ISpec, IVChart, IInitOption } from '@visactor/vchart';
import { ActionNode } from '../../types';

export class BaseChartElement {
  private snapshots: ActionNode[] = [];
  private instance: IVChart;

  constructor(spec?: ISpec, option?: IInitOption) {
    if (spec && option) {
      this.instance = new VChart(spec, option);
    }
  }

  public getInstance() {
    return this.instance;
  }

  public setInstance(instance: IVChart) {
    this.instance = instance;
    return this;
  }

  public snapshot(node: ActionNode) {
    this.snapshots.push(node);
    return this;
  }

  public exportSnapshot() {
    return this.snapshots;
  }
}
