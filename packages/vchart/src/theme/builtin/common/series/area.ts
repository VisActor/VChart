import type { IAreaSeriesTheme } from '../../../../series/area/interface';

export const area: IAreaSeriesTheme = {
  label: {
    visible: false,
    offset: 5,
    position: 'top',
    style: {
      stroke: 'white',
      lineWidth: 2
    }
  },
  point: {
    style: {
      symbolType: 'circle'
    }
  }
};
