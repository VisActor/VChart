import type { IFunnelSeriesTheme } from '../../../../series/funnel/interface';

export const funnel: IFunnelSeriesTheme = {
  transform: {
    style: {
      fill: { type: 'palette', key: 'axisGridColor' }
    }
  },
  label: {
    style: {
      fill: 'white',
      textBaseline: 'middle',
      lineWidth: 2
    }
  },
  outerLabel: {
    style: {
      fontSize: { type: 'token', key: 'l4FontSize' },
      fill: { type: 'palette', key: 'secondaryFontColor' }
    },
    line: {
      style: {
        stroke: { type: 'palette', key: 'axisDomainColor' }
      }
    }
  },
  transformLabel: {
    style: {
      fontSize: { type: 'token', key: 'l4FontSize' },
      fill: { type: 'palette', key: 'secondaryFontColor' },
      textBaseline: 'middle'
    }
  }
};
