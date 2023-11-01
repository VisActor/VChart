import { ISeriesTheme, SeriesTypeEnum, SeriesTypeForThemeEnum } from '@visactor/vchart-types';

export const area: Pick<
  ISeriesTheme,
  SeriesTypeEnum.area | SeriesTypeForThemeEnum.area_vertical | SeriesTypeForThemeEnum.area_horizontal
> = {
  area: {
    point: {
      style: {
        visible: false
      }
    },
    line: {
      style: {
        lineWidth: 3
      }
    },
    area: {
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
              opacity: 1
            },
            {
              offset: 1,
              opacity: 0.2
            }
          ]
        }
      }
    }
  },
  area_horizontal: {
    area: {
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
              opacity: 1
            },
            {
              offset: 1,
              opacity: 0.2
            }
          ]
        }
      }
    }
  }
};
