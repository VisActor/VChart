import { merge } from '@visactor/vutils';
import { StoryChartType } from '../constant';
import { StoryChart } from './chart';
import { Datum } from '../types/Datum';
import { IChartSpec, IInitOption } from '@visactor/vchart';
import { IChartStyleAction, IChartStylePayload } from '../types/chart/Style';
import { IChartAppearAction, IChartAppearPayLoad } from '../types/chart/Appear';

export class StoryBar extends StoryChart {
  public storyChartType = StoryChartType.BAR;

  constructor(spec: IChartSpec, option: IInitOption) {
    super(spec, option);
  }

  barStyle(data: Datum, payload: IChartStylePayload) {
    const styleNode: IChartStyleAction = merge(
      { action: 'barStyle', elementType: this.storyChartType, elementId: this.uid },
      { payload }
    );
    this.snapshot(styleNode);
  }

  dance(data: Datum, payload: any) {
    const action: IChartStyleAction = merge(
      { action: 'dance', elementType: this.storyChartType, elementId: this.uid },
      { payload: { data, ...payload } }
    );
    this.snapshot(action);
  }

  appear(payload: IChartAppearPayLoad) {
    const action: IChartAppearAction = merge(
      { action: 'appear', elementType: this.storyChartType, elementId: this.uid },
      { payload }
    );
    this.snapshot(action);
  }
}
