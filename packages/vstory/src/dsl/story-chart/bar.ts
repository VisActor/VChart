import { ISpec, IInitOption } from '@visactor/vchart';
import { Datum } from '@visactor/vrender-components';
import { AddAction, AddOption, AddPayload } from '../types/Add';
import { merge } from '@visactor/vutils';
import { StoryChartType } from '../constant';
import { BaseChartElement } from './base/baseChart';
import { defaultAdd } from './default/add';

export class StoryBar extends BaseChartElement {
  public storyChartType = StoryChartType.BAR;

  constructor(spec?: ISpec, option?: IInitOption) {
    super(spec, option);
  }

  public add(payload: Partial<AddPayload>, option?: Partial<AddOption>) {
    const editNode: AddAction = merge(
      {
        action: 'add',
        option: defaultAdd
      },
      {
        payload: payload,
        option: option
      }
    );
    this.snapshot(editNode);
  }
}
