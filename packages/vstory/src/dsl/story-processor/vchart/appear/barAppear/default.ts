import { IChartAppearAction } from '../../../../types/chart/appear';

export const defaultPayload: IChartAppearAction['payload'] = {
  animation: {
    effect: 'grow',
    duration: 2000,
    easing: 'cubicOut',
    oneByOne: false,
    loop: false
  }
};