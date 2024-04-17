import { Datum } from '@visactor/vrender-components';
import { ActionNode } from '../types';
import { AddAction, AddOption } from '../types/Add';
import { UpdateStyleAction, UpdateStyleOption } from '../types/UpdateStyle';
import { defaultAdd } from './default/add';
import { merge } from '@visactor/vutils';
import { defaultUpdateStyle } from './default/updateStyle';
import { StoryChartType } from '../constant';
import { UpdateOption } from '../types/Update';

export class StoryPie {
  public storyChartType = StoryChartType.PIE;

  private snapshots: ActionNode[];

  constructor() {
    this.snapshots = [];
  }

  public snapshot(node: ActionNode) {
    this.snapshots.push(node);
  }

  public exportSnapshot() {
    return this.snapshots;
  }

  public add(data: Datum, option?: Partial<AddOption>) {
    const editNode: AddAction = merge(
      {
        action: 'add',
        data: data
      },
      defaultAdd,
      option
    );
    this.snapshot(editNode);
  }

  public update(data: Datum, payload?: Partial<UpdateOption>) {
    const editNode: UpdateOption = merge({
      action: 'update',
      data: data,
      payload: payload
    });
    this.snapshot(editNode);
  }
}
