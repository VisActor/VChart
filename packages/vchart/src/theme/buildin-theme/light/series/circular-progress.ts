import type { ICircularProgressSeriesTheme } from '../../../../series/progress/circular/interface';

export const circularProgress: ICircularProgressSeriesTheme = {
  outerRadius: 0.8,
  innerRadius: 0.6,
  progress: {
    style: {
      fillOpacity: 1
    }
  },
  track: {
    style: {
      fillOpacity: 0.2
    }
  }
};
