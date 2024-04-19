import { merge } from '@visactor/vutils';
import { StoryChartType } from '../constant';
import { StyleAction, StylePayload } from '../types';
import { StoryChart } from './chart';
import { Datum } from '../types/Datum';

export class StoryPie extends StoryChart {
  public storyChartType = StoryChartType.PIE;

  arcStyle(data: Datum, payload: StylePayload) {
    const styleNode: StyleAction = merge(
      { action: 'arcStyle' },
      { elementType: this.storyChartType, elementId: this.uid, data, payload }
    );
    this.snapshot(styleNode);
  }
}
