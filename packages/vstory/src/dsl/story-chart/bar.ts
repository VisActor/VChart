import { Datum } from '@visactor/vrender-components';
import { ActionNode } from '../types';
import { AddAction, AddOption } from '../types/Add';
import { UpdateStyleAction, UpdateStyleOption } from '../types/UpdateStyle';
import { defaultAdd } from './default/add';
import { merge } from '@visactor/vutils';
import { defaultUpdateStyle } from './default/updateStyle';
import { StoryChartType } from '../constant';

export class StoryBar {
  private type = StoryChartType.BAR;

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

  public updateStyle(data: Datum, option?: Partial<UpdateStyleOption>) {
    const editNode: AddAction = merge(
      {
        action: 'updateStyle',
        data
      },
      defaultUpdateStyle,
      option
    );
    this.snapshot(editNode);
  }
}
