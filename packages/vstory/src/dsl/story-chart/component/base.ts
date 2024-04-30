import { merge } from '@visactor/vutils';
import { StoryElement } from '../element';
import { StoryChartComponentType } from '../../constant';
import type { Action, IFlickerAction, IFlickerPayload } from '../../types';

export abstract class StoryComponent extends StoryElement {
  protected snapshot: (node: Action) => void;

  protected declare type: StoryChartComponentType;

  constructor(snapshot: (node: Action) => void) {
    super();
    this.snapshot = snapshot;
  }

  public flicker(option: IFlickerPayload) {
    const actionNode: IFlickerAction = merge(option, {
      action: 'flicker',
      elementId: this.uid,
      elementType: this.type
    });
    this.snapshot(actionNode);
    return this;
  }
}
