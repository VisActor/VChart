import type { IPieSeriesTheme } from '../../../../series/pie/interface';

export const pie: IPieSeriesTheme = {
  outerRadius: 0.6,
  pie: {
    style: {
      fillOpacity: 1
    }
  },
  label: {
    visible: false,
    position: 'outside',
    style: {
      fontWeight: 'normal',
      fillOpacity: 1
    }
  }
};
