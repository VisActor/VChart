import type { IFunnel3dSeriesTheme, IFunnelSeriesTheme } from '../../../../series/funnel/interface';

const getFunnelTheme = (is3d?: boolean): IFunnelSeriesTheme | IFunnel3dSeriesTheme => {
  const res: IFunnelSeriesTheme | IFunnel3dSeriesTheme = {
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

  res[is3d ? 'transform3d' : 'transform'] = {
    style: {
      fill: { type: 'palette', key: 'axisGridColor' }
    }
  };

  return res;
};

export const funnel: IFunnelSeriesTheme = getFunnelTheme();
export const funnel3d: IFunnel3dSeriesTheme = getFunnelTheme(true);
