import type { IChartSpec, IMarkPointSpec, VChart } from '@visactor/vchart';
import { Datum } from '../Datum';

export interface CreateComponentAction<Action extends string, PayLoad extends Object> {
  action: Action;
  elementId: number;
  payload?: PayLoad;
  callback?: (chartInstance: VChart, spec: IChartSpec, snapshot: CreateComponentAction<Action, PayLoad>) => void;
}

export interface CreateMarkPointAction
  extends CreateComponentAction<
    'createMarkPoint',
    {
      itemContent?: IMarkPointSpec['itemContent'];
      itemLine?: IMarkPointSpec['itemLine'];
      animation?: {
        duration: number;
        easing: string;
      };
    }
  > {
  data: Datum;
}

export interface CreateTitleAction
  extends CreateComponentAction<
    'createTitle',
    {
      animation?: {
        duration: number;
        easing: string;
      };
    }
  > {
  data: Datum;
}
