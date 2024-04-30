import type { IChartSpec, IVChart } from '@visactor/vchart';
import type { IActionContext } from '..';
import type { IChartAddAction } from './add';
import type { IChartAppearAction } from './appear';
import type { IChartStyleAction } from './style';

export type ChartAction = IChartAddAction | IChartStyleAction | IChartAppearAction;

export interface IChartActionContext extends IActionContext {
  callback?: (chartInstance: IVChart, spec: IChartSpec, action: ChartAction) => void;
}

export type ChartActionNode = ChartAction & IChartActionContext;
