import { merge } from '@visactor/vutils';
import { StoryChartType } from '../constant';
import { StyleAction, StylePayload } from '../types';
import { Datum } from '../types/Datum';
import { StoryChart } from './chart';

export class StoryLine extends StoryChart {
  public storyChartType = StoryChartType.LINE;

  constructor() {
    super();
  }

  lineStyle(data: Datum, payload: StylePayload) {
    const styleNode: StyleAction = merge(
      { action: 'lineStyle' },
      { elementType: this.storyChartType, elementId: this.uid, data, payload }
    );
    this.snapshot(styleNode);
  }

  symbolStyle(data: Datum, payload: StylePayload) {
    const styleNode: StyleAction = merge(
      { action: 'symbolStyle' },
      { elementType: this.storyChartType, elementId: this.uid, data, payload }
    );
    this.snapshot(styleNode);
  }
}
