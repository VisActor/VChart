import { merge } from '@visactor/vutils';
import { StoryElement } from '../element';
import { StoryChartComponentType } from '../../constant';
import type { ActionNode } from '../../types';
import type { FlickerAction, FlickerOption } from '../../types/Flicker';

export abstract class StoryComponent extends StoryElement {
  protected snapshot: (node: ActionNode) => void;

  protected declare type: StoryChartComponentType;

  constructor(snapshot: (node: ActionNode) => void) {
    super();
    this.snapshot = snapshot;
  }

  public flicker(option: FlickerOption = {}) {
    const actionNode: FlickerAction = merge(option, { action: 'flicker', elementId: this.uid, elementType: this.type });
    this.snapshot(actionNode);
    return this;
  }
}
