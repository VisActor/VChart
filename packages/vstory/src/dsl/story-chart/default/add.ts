import type { IChartAddPayload } from '../../types/chart/Add';

export const defaultAdd: { payload: Partial<IChartAddPayload> } = {
  payload: {
    style: {},
    animation: {
      duration: 500,
      easing: 'linear'
    }
  }
};
