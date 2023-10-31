import { ISeriesTheme, SeriesTypeEnum, SeriesTypeForThemeEnum } from '@visactor/vchart-types';

export const bar: Pick<
  ISeriesTheme,
  SeriesTypeEnum.bar | SeriesTypeForThemeEnum.bar_vertical | SeriesTypeForThemeEnum.bar_horizontal
> = {
  bar: {
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
  },
  bar_horizontal: {
    bar: {
      style: {
        fill: {
          gradient: 'linear',
          x0: 1,
          y0: 0,
          x1: 0,
          y1: 0,
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
          x0: 1,
          y0: 0,
          x1: 0,
          y1: 0,
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
  }
};
