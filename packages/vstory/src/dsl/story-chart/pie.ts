import { merge } from '@visactor/vutils';
import { StoryChartType } from '../constant';
import { StoryChart } from './chart';
import { Datum } from '../types/Datum';
import { IChartStylePayload } from '../types/chart/Style';
import { ChartActionNode } from '../types';

export class StoryPie extends StoryChart {
  public storyChartType = StoryChartType.PIE;

  arcStyle(data: Datum, payload: IChartStylePayload) {
    const styleNode: ChartActionNode = merge(
      { action: 'arcStyle' },
      { elementType: this.storyChartType, elementId: this.uid, data, payload }
    );
    this.snapshot(styleNode);
  }
}
