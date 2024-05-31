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
    interactive: true,
    position: 'outside',
    style: {
      fontWeight: 'normal',
      stroke: { type: 'palette', key: 'backgroundColor' },
      fillOpacity: 1
    }
  },
  innerLabel: {
    style: {
      lineWidth: 2
    }
  }
};
