import type { Datum } from '../types/Datum';
import type { AddAction } from './../types/Add';
import type { ActionNode } from '../types';
import type { AddOption } from '../types/Add';
import { merge } from '@visactor/vutils';
import { defaultAdd } from './default/add';
import { UpdateStyleOption } from '../types/UpdateStyle';
import { defaultUpdateStyle } from './default/updateStyle';

export abstract class StoryChart {
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
      { payload: option }
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
      { payload: option }
    );
    this.snapshot(editNode);
  }
}
