import { IGlobalMarkThemeByName } from '@visactor/vchart-types';

export const markByName: IGlobalMarkThemeByName = {
  bar: {
    style: {
      fill: {
        gradient: 'linear',
        x0: 0,
        y0: 0,
        x1: 0,
        y1: 1,
        stops: [
          {
            offset: 0,
            opacity: 0.9
          },
          {
            offset: 1,
            opacity: 0.2
          }
        ]
      },
      stroke: {
        gradient: 'linear',
        x0: 0,
        y0: 0,
        x1: 0,
        y1: 1,
        stops: [
          {
            offset: 0,
            opacity: 1
          },
          {
            offset: 1,
            opacity: 0.2
          }
        ]
      },
      lineWidth: 2
    }
  }
};
