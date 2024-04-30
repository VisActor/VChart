import type { IChartStylePayload } from '../../types/chart/style';

export const defaultUpdateStyle: Partial<IChartStylePayload> = {
  animation: {
    duration: 500,
    easing: 'linear'
  }
};
