import { merge } from '@visactor/vutils';
import { StoryChartType } from '../constant';
import { StyleAction, StylePayload } from '../types';
import { StoryChart } from './chart';
import { Datum } from '../types/Datum';

export class StoryBar extends StoryChart {
  public storyChartType = StoryChartType.BAR;

  barStyle(datum: Datum, payload: StylePayload) {
    const styleNode: StyleAction = merge(
      { action: 'barStyle' },
      { elementType: this.storyChartType, elementId: this.uid, datum, payload }
    );
    this.snapshot(styleNode);
  }
}
