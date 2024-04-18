import { Datum } from '@visactor/vrender-components';
import { AddAction, AddOption } from '../types/Add';
import { defaultAdd } from './default/add';
import { isArray, merge } from '@visactor/vutils';
import { StoryChartType } from '../constant';
import { MarkPointFlickerOption, MarkPointOption } from '../types/MarkPoint';
import { StoryChart } from './base';

/**
 * 1. 禁用一些图表默认的基础操作。如 tooltip/crosshair
 */
export class StoryArea extends StoryChart {
  public storyChartType = StoryChartType.AREA;

  public add(data: Datum[], option?: Partial<AddOption>): this;
  public add(data: Datum, option?: Partial<AddOption>): this;
  public add(data: Datum | Datum[], option?: Partial<AddOption>): this {
    let editNode: AddAction;
    if (isArray(data)) {
      editNode = merge({ action: 'addPatch', data }, defaultAdd, option);
    } else {
      editNode = merge({ action: 'add', data }, defaultAdd, option);
    }

    this.snapshot(editNode);
    return this;
  }

  // TODO:
  // 1. rename to createMarkPoint
  // 2. return a component class
  public markPoint(data: Datum, option?: MarkPointOption) {
    const editNode = merge({ action: 'markPoint', data }, defaultAdd, option);
    this.snapshot(editNode);
    return this;
  }

  // TODO: flicker will be an API of MarkPoint
  public flicker(option: MarkPointFlickerOption) {
    const animationNode = merge(option, { action: 'flicker', element: 'markPoint' });
    this.snapshot(animationNode);
    return this;
  }
}
