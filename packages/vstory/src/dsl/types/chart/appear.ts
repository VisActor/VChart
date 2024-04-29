import type { IAction, IAnimationParams, IActionPayload } from '../index';

export interface IChartAppearPayLoad extends IActionPayload {
  animation: IAnimationParams & {
    oneByOne: boolean;
    /**
     * 柱状图支持: 'grow' | 'fade' | 'bounce'
     * 折线图支持: 'grow' | 'fade'
     * 饼图支持: 'grow' | 'fade' | 'growAngle' | 'growRadius'
     */
    effect: string;
  };
}

export interface IChartAppearAction extends IAction {
  action: 'appear';
  payload: IChartAppearPayLoad;
}

export type AppearOption = Omit<IChartAppearAction, 'action' | 'data'>;
