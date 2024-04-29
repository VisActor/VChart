import { merge } from '@visactor/vutils';
import { StoryChartType } from '../constant';
import { Datum } from '../types/Datum';
import { StoryChart } from './chart';
import { IChartStylePayload } from '../types/chart/Style';
import { ChartActionNode } from '../types';

export class StoryLine extends StoryChart {
  public storyChartType = StoryChartType.LINE;

  constructor() {
    super();
  }

  lineStyle(data: Datum, payload: IChartStylePayload) {
    const styleNode: ChartActionNode = merge(
      { action: 'lineStyle' },
      { elementType: this.storyChartType, elementId: this.uid, data, payload }
    );
    this.snapshot(styleNode);
  }

  symbolStyle(data: Datum, payload: IChartStylePayload) {
    const styleNode: ChartActionNode = merge(
      { action: 'symbolStyle' },
      { elementType: this.storyChartType, elementId: this.uid, data, payload }
    );
    this.snapshot(styleNode);
  }
}
