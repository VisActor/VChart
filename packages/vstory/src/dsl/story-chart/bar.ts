import { merge } from '@visactor/vutils';
import { StoryChartType } from '../constant';
import { StyleAction, StylePayload } from '../types';
import { StoryChart } from './chart';
import { Datum } from '../types/Datum';
import { IChartSpec, IInitOption } from '@visactor/vchart';

export class StoryBar extends StoryChart {
  public storyChartType = StoryChartType.BAR;

  constructor(spec: IChartSpec, option: IInitOption) {
    super(spec, option);
  }

  barStyle(data: Datum, payload: StylePayload) {
    const styleNode: StyleAction = merge(
      { action: 'barStyle', elementType: this.storyChartType, elementId: this.uid },
      { data, payload }
    );
    this.snapshot(styleNode);
  }

  dance(data: Datum, payload: any) {
    const action: StyleAction = merge(
      { action: 'dance', elementType: this.storyChartType, elementId: this.uid },
      { data, payload }
    );
    this.snapshot(action);
  }

  appear(payload) {
    const action: StyleAction = merge(
      { action: 'appear', elementType: this.storyChartType, elementId: this.uid },
      { payload }
    );
    this.snapshot(action);
  }
}
