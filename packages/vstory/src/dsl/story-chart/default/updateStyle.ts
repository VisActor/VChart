import type { IChartStylePayload } from '../../types/chart/Style';

export const defaultUpdateStyle: Partial<IChartStylePayload> = {
  animation: {
    duration: 500,
    easing: 'linear'
  }
};
