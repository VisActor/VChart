import type { IChartSpec, IVChart } from '@visactor/vchart';
import type { IActionContext } from '..';
import type { IChartAddAction } from './Add';
import type { IChartAppearAction } from './Appear';
import type { IChartStyleAction } from './Style';

export type ChartAction = IChartAddAction | IChartStyleAction | IChartAppearAction;

export interface IChartActionContext extends IActionContext {
  callback?: (chartInstance: IVChart, spec: IChartSpec, action: ChartAction) => void;
}

export type ChartActionNode = ChartAction & IChartActionContext;
